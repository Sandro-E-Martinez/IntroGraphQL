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
});

server.listen({ port: 4000 }).then( ({url}) => {
    console.log(`Server ready to listen on ${url}`)
} )