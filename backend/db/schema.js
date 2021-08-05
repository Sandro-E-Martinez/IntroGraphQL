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
    input UserInput {
        name: String!
        last_name: String!
        email: String!
        password: String!
        phone: String
        bio: String
        hobbies: String
        occupation: String
        nationality: String
        favorite_movie: String
        favorite_color: String
        active: Boolean
    }

    input AuthInput{
        email: String!
        password: String!
    }

    type Token {
        token: String
    }

    type Query {
        getUsers: [User]
        currentUser: User
        getUser(id: ID!) : User
    }

    #  CREAMOS NUSTRO APARTADO DE MUTACIONES
    type Mutation {
        addUser(input: UserInput!) : User
        auth(input: AuthInput!) : Token
        changeMyPassword(newPassword : String!): String
    }

`;

module.exports = typeDefs;