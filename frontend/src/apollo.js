import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import fetch from 'node-fetch'
import { setContext } from 'apollo-link-context'

// CREAMOS LA CONEXIÓN AL BACKEND
const httpLink = createHttpLink({
    uri: 'http://localhost:4000/',
    fetch
});

// INSERTAMOS EL TOKEN EN EL HEADER AUTHORIZATION
const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            ...headers,
            authorization: token ? token : ''
        }
    }
});

// CREAMOS EL CLIENTE
const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink)
});

// EXPORTAMOS EL CLIENTE
export default client;