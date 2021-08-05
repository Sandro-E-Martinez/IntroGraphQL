const {  gql } = require('apollo-server');

// Schema
const typeDefs = gql`

    type User {
        id: ID
        name: String
        last_name: String
        email: String
        phone: String
        bio: String
        hobbies: String
        occupation: String
        nationality: String
        favorite_movie: String
        favorite_color: String
        active: Boolean
        created_at: String
    }

    # DEFINOS AQUÍE LOS OBJECTOS QUE USAREMOS COMO PARÁMETROS  EN NUESTROS QUERIES Y MUTATIONS


    type Query {
        getUsers: [User]
    }

    #  CREAMOS NUSTRO APARTADO DE MUTACIONES

`;

module.exports = typeDefs;