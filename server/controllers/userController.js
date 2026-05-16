import Event from "../models/eventModel.js";

export const getSearchResult = async (req, res) => {
    try {
        let { searchEvent, searchLocation } = req.body;
        searchEvent = searchEvent.replace(".","\\.")
        searchLocation = searchLocation.replace(".","\\.")

        if (!searchEvent || searchEvent.trim().length === 0) return res.status(400).json({ message: "Please Enter the event name or job title" });

        if (!searchLocation || searchLocation.trim().length === 0) {
            const searchQuery = await Event.find({
                $or: [
                    { title: { $regex: searchEvent, $options: 'i' } },
                    { role: { $regex: searchEvent, $options: 'i' } }
                ]
            });

            if (searchQuery.length === 0) return res.status(404).json({ message: "No Event Or Job Title Found" });

            return res.status(200).json({ message: `Found ${searchQuery.length} result(s)`, data: searchQuery });
        }
        const searchQuery = await Event.find({
            $or: [
                { title: { $regex: searchEvent, $options: 'i' } },
                { role: { $regex: searchEvent, $options: 'i' } }
            ],
            location: { $regex: searchLocation, $options: 'i' }
        });

        if (searchQuery.length === 0) {
            return res.status(404).json({ message: "No Event Or Job Title Found for this location" });
        }

        return res.status(200).json({ message: `Found ${searchQuery.length} result(s)`, data: searchQuery });

    } catch (error) {
        console.log("Error in getSearchResult Controller:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
