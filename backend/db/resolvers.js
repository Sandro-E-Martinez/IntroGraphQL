const User = require('../models/User');

const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'variables.env' });


const resolvers = {
    Query: {
        getUsers: async () => {
            try {
                const users = await User.find({});
                return users;
            } catch (error) {
                console.log(error);
            }
        },
    },
    // AQUÍ DEFINIREMOS LOS RESOLVERS PARA NUESTRAS MUTACIONES
}

module.exports = resolvers;