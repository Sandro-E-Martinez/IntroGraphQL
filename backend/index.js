const { ApolloServer  } = require('apollo-server');
const typeDefs = require('./db/schema');
const resolvers = require('./db/resolvers');
const connectDB = require('./config/db');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'variables.env' });

connectDB();

const server = new ApolloServer({
    typeDefs,
    resolvers,
    // VERIFICAR TOKEN DEL HEADER DE AUTHORIZATION
    context: ({req}) => {
        const token = req.headers['authorization'] || '';
        if(token) {
            try {
                const {id} = jwt.verify(token, process.env.SECRET );
                return {
                    id
                }
            } catch (error) {
                console.log(error);
            }
        }
    }
});

server.listen({ port: 4000 }).then( ({url}) => {
    console.log(`Server ready to listen on ${url}`)
} )