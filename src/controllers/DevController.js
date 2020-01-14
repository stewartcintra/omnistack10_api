const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../util/parseStringAsArray');

module.exports = {
    async index(request, response) {
        const devs = await Dev.find();

        return response.json(devs);
    },

    async store(request, response) {
        const { github_usename, techs, latitude, longitude } = request.body;

        let dev = await Dev.findOne({ github_usename });

        if (!dev) {
            const apiResponse = await axios.get(`https://api.github.com/users/${github_usename}`);
    
            const { name = login, avatar_url, bio } = apiResponse.data;
        
            const techArray = parseStringAsArray(techs);
        
            const location = {
                type: 'Point',
                coordinates: [longitude, latitude],
            };
        
            dev = await Dev.create({
                github_usename,
                name,
                avatar_url,
                bio,
                techs: techArray,
                location,
            });
        };
    
        return response.json(dev);
    },
};