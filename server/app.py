from flask import Flask, jsonify, request
from flask_cors import CORS
from langchain_ollama import ChatOllama
from langchain.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from pymongo import MongoClient
import json, re, nest_asyncio, dotenv, os, logging
from bson import ObjectId

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logging.getLogger('werkzeug').setLevel(logging.ERROR)
dotenv.load_dotenv()

app = Flask(__name__)

clientUrl = os.getenv("CLIENT_URL")
CORS(app, origins= clientUrl, methods=["POST"])

@app.route('/api/textToMongo', methods=['POST'])
def api():
    try:
        data = request.get_json()
        query = data['query']
        logging.info(f"Received query: {query}")
        nest_asyncio.apply()
        client = MongoClient('localhost', 27017)
        db = client['eventProject']

        collections = db.list_collection_names()
        logging.info(f"Collections in the database: {collections}")
        llm = ChatOllama(model="mistral", verbose=False, temperature=0)
        def get_collection_schema(collections: list) -> dict:
            schemas = {}

            for i in collections:
                collection = db[i]
                data = collection.find_one(sort=[('createdAt', -1)])
                logging.info(f"Data from collection '{i}': {data}")
                if not data:
                    schemas[i] = {} 
                    continue

                def infer_field_schema(value):
                    if isinstance(value, list):
                        if value:
                            return f"list of {infer_field_schema(value[0])}"
                        return "list of unknown documents"
                    elif isinstance(value, dict):
                        if value:
                            return {key: infer_field_schema(val) for key, val in value.items()}
                        return "dict of unknown documents"
                    else:
                        return type(value).__name__

                schema = {}
                for key, value in data.items():
                    schema[key] = infer_field_schema(value)

                schemas[i] = schema
                logging.info(f"Schema for collection '{i}': {schema}")
            return schemas

        prompt_template = """
        You are a world's best database expert. go through the input thoroughly along with the collections to find the most relevant collection and then only return the collection name(s).
        You are provided with a list of MongoDB collection names: {collections}.
        Based on the input query: {input}, return only the name(s) of the collection that is most relevant and be very precise find all the collections that are relevant.
        Do not include anything else, just the collection name(s).
        YOUR response should be in the format of 'collection_name(s)'
        dont write anything else without any whitespaces.
        Also read parse the input carefully as there might be multiple collections and you might have to use a comma to separate them
        if there is no relevant collection then say that there is no relevant collection
        Example:
        1. Human Input: show all the feedbacks for recent event that users has filled
        AI Response: eventfeedbacks,users

        2. Human Input: show all event
        AI Response: events

        DO NOT ADD WHITESPACE IN YOUR RESPONSES
        NOTE: You will only return the collection name(s) that is included in collections.
        """

        prompt = PromptTemplate(input_variables=["input"], template=prompt_template)

        table_chain = prompt | llm | StrOutputParser()
        # query = input("Enter: ")

        result = table_chain.invoke({'input': query, 'collections': collections})
        logging.info(f"Collection(s) found: {result}")

        collections = result.strip().split(",")
        # print(collections)
        collection_Schema = get_collection_schema(collections)
        logging.info(f"Collection Schema: {collection_Schema}")

        prompt_template2 = """
        You are a world's best database expert.
        Here is the Schema of the collection(s): {{schema}}

        NOTE: If you see any sensitive information like password or bank details, just ignore it and do not include it in the response.

        Based on the input query: {{input}}, return only the MongoDB query that matches the user's request based on the schema.
        only return the mongodb query according to the schema.
        Be precise and only include the necessary MongoDB query. Do not add extra information or explanations. 

        Just return the MongoDB query in the following format if user has not asked for specific fields:
        db.collection.find({ query conditions })

        NOTE: Use 3 commas to separate the query conditions with field selection
        Also DO NOT include sensitive information like password or bank details.

        Just return the MongoDB query in the following format if user has asked for specific fields:
        db.collection.find({ query conditions },,, { field selection })

        Examples:

        1. Human Input: "Find all events where title contains 'job'"
        MongoDB Query: db.events.find({ "title": { "$regex": 'job', "$options": 'i' }})

        2. Human Input: "Find all events where selected is null"
        MongoDB Query: db.events.find({ "roles.selected": null })

        3. Human Input: "Find events where applicants is not empty"
        MongoDB Query: db.events.find({ "roles.applicants": { $exists: true, $ne: [] } })

        4. Human Input: "show start date from event title new event"
        MongoDB Query: db.events.find({ "title": "new event" },,, { "startDate": 1 })

        5. Human Input: "show role from event where event title is jods"
        MongoDB Query: db.events.find({ "title": 'jods' },,, { "roles.role" : 1 })

        6. Human Input: "show all the contact us"
        MongoDB Query: db.contacts.find({})
        
        7. Human Input: "show all the users"
        MongoDB Query: db.users.find({}).select("-password")

        8. Human Input: "show applicant details from events where applicant status is accepted"
        MongoDB Query: db.events.find({ "roles.applicants.status": 'accepted' },,, { "roles.applicants": 1 })

        You will wrap the query conditions in double quotes and the field selection in single quotes.
        You just repond with query nothing else without any whitespaces just the query.
        Do not show Human Input just show your response
        Dont try to match the example's mongoDB Query with your responses as they both are different
        If Human asks for any spefic query you will not return anything else and only return that thing not even id should be returned
        Keep the responses clear and short. Only return the query in the format shown above. Do not attempt to explain the query or ask for clarification unless explicitly mentioned.
        You will only return ONE MONGO QUERY only ONE.
        """

        prompt2 = PromptTemplate(input_variables=["input"], template=prompt_template2, template_format="jinja2")
        query_chain = prompt2 | llm | StrOutputParser()

        query_string = query_chain.invoke({'input': query, 'schema': collection_Schema})
        query_string = query_string.strip()
        # print(len(query_string))
        logging.info(f"MongoDB Query: {query_string}")

        def convert_objectid_to_str(data):
            if isinstance(data, dict):
                return {key: convert_objectid_to_str(value) for key, value in data.items()}
            elif isinstance(data, list):
                return [convert_objectid_to_str(item) for item in data]
            elif isinstance(data, ObjectId):
                return str(data)
            else:
                return data

        def execute_mongo_query(query_string):
            try:
                match = re.match(r"db\.(\w+)\.find\((.*)\)", query_string.strip())
                if not match:
                    raise ValueError("Query string does not follow the correct format.")

                collection_name = match.group(1)
                query_details = match.group(2).strip()

                parts = query_details.split(",,,")
                if len(parts) < 1:
                    raise ValueError("Query string does not contain valid query conditions.")
                
                query_conditions = parts[0].strip()
                field_selection = parts[1].strip() if len(parts) == 2 else None  

                def fix_quotes(query_string):
                    return query_string.replace("'", '"')

                query_conditions_json = fix_quotes(query_conditions)
                field_selection_json = fix_quotes(field_selection) if field_selection else None

                logging.info(f"Query conditions JSON: {query_conditions_json}")
                logging.info(f"Field selection JSON: {field_selection_json}")
                # print(f"Query details JSON: {query_conditions_json}")
                # print(f"Field selection JSON: {field_selection_json}")

                query_conditions_dict = json.loads(query_conditions_json.replace('null', '"null"'))  
                field_selection_dict = json.loads(field_selection_json) if field_selection_json else None

                collection = db[collection_name]
                # print(f"Executing query: db.{collection_name}.find({query_conditions_dict}, {field_selection_dict})")

                result = collection.find(query_conditions_dict, field_selection_dict)
                logging.info(f"Query result: {result}")
                result_list = []
                for document in result:
                    result_list.append(convert_objectid_to_str(document))

                if result_list:
                    return result_list
                else:
                    return "No documents found matching the query"

            except Exception as e:
                return f"Error executing the query: {e}"
            
        # print(f"MongoDB Query: {query_string}")
        result = execute_mongo_query(query_string)
        return jsonify({"result": result})
    except Exception as e:
        # print(e)
        return jsonify({"result": "Error occurred: " + str(e)})

if __name__ == '__main__':
    app.run(debug=True, port=5000)