import { getAllUsers, getOneUser } from '../../controllers/adminController.js'
import { searchQuery } from '../../controllers/messageController.js';

const req = {}
const res = {
    status: (statusCode) => {
        return {
            json: (data) => {
                return {statusCode, data}
            },
        };
    },
};

const query = {
    async users() {
        const users = await getAllUsers(req,res)
        if(users.statusCode === 200) return users.data
        else throw new Error(users.data.message)
    },
    user: async (_, { id }) => {
        const req = { params: { id } };
        const response = await getOneUser(req, res);

        if (response.statusCode === 200) {
            return response.data;
        } else {
            throw new Error(response.data.message);
        }
    },
    userSearch: async (_, { query, curUser }) => {
        const req = { body: { query, curUser } };
        const response = await searchQuery(req,res);

        if (response.statusCode === 200) {
            return response.data;
        } else {
            throw new Error(response.data.message);
        }
    }
}

const mutation = {
    createUser: async (_, args) => {
        return `CHASE? JOD ${args.name} ${args.email} ${args.password} ${args.age}`
    },
}

export const resolvers = { query, mutation }