# Introducción a GraphQL

Puedes descargar el proyecto sin la implementación de los queries, resolvers y sin el consumo del API en el frontend desde la rama "clean" en este mismo repositorio.

### ¿De qué consta el ejemplo?

El proyecto consta de una api en graphql como backend conectacto a mongo y de un frontent hecho en react.

En la carpeta "Docker" se encuentrar las imágenes tanto del backend como del frontend.

El archivo docker-compose.yml se encarga de levantar un contenedor en donde corren tanto el backend como el front y una instancia de mongo.

Para correr el poryecto solo es necesario ejecutar el siguiente comando desde la terminal en la raíz del proyecto

```command
docker-compose up
```

NOTA: En la carpeta "db" estarán todos los archivos que mongo utilizar para persistir la data.

## Backend

En el archivo "variables.env" insertamos las variables de entorno que necesitamos para la conexión de mongo como para la creción del token con jsonwebtoken

```env
DB_MONGO=mongodb://db:27017/introGraphQL
SECRET=secret
```

### Inicio del poryecto

Inicialmente el proyecto define en _backend/db/schema.js_ el tipo "Use" el cual contiene varios campor básicos.

Adicionalmente el proyecto ya definie un Query que nos servirá para consolar los usuarios que se encuentran ya almacenados en la base de mongo

##### Get Users

```graphql
query {
  getUsers {
    id
    email
    last_name
  }
}
```

También podemos obtener el mismo resultado de la siguiente manera

```graphql
{
  getUsers {
    id
    email
    last_name
  }
}
```

##### Modelado de la BD

Cambe mencionar que para poder realizar la conexión con mongo usamos el ORM de mongoose como capa intermedia para modelar nuestros objectos de bd. https://mongoosejs.com/

El modelo de usuario se puede ver en _backend/models/User.js_

### Crear usuarios

Primero lo primero, con nuestro usuario definido procederemos a definir nuestra primera mutación la cual se encargará de crear nuevos usuarios en nustro schema _backend/db/schema.js_

```js
    type Mutation {
        addUser(input: UserInput!) : User
    }
```

Nuestra mutación requiere de parámetros que definiremos con el objeto "UserInput" en el mismo esquema

```js
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
```

No olvidemos que siempre que definamos una mutación debemos ir a crear nuestro resolver con el mismo nombre

_backend/db/resolvers.js_

```js
    // AQUÍ DEFINIREMOS LOS RESOLVERS PARA NUESTRAS MUTACIONES
    Mutation: {
        addUser: async (_, { input } ) => {
            const { email, password } = input;
            // Revisar si el usuario ya esta registrado
            const registeredUser = await User.findOne({email});
            if (registeredUser) {
                throw new Error('El usuario ya está registrado');
            }
            // Hashear password
            const salt = await bcryptjs.genSalt(10);
            input.password = await bcryptjs.hash(password, salt);
            try {
                 // Guardarlo en la base de datos
                const newUser = new User(input);
                newUser.save(); // guardarlo
                return newUser;
            } catch (error) {
                console.log(error);
            }
        },
    }
```

### Probado nuestro Mutation para Crear Usuario

Ahora podemos entrar al playground del backend en la url http://localhost:4000/ y escribir la siquiente mutación

```graphql
mutation ($input: UserInput!) {
  addUser(input: $input) {
    id
    email
  }
}
```

Y la sección de Query Variables debemos escribir la infirmación a insrtar

```json
{
  "input": {
    "name": "Sandro E.",
    "last_name": "Martínez",
    "email": "zanddro@gmail.com",
    "password": "P@55word",
    "phone": "1234567890",
    "bio": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum urna nisl, fringilla nec porttitor ut.",
    "hobbies": "Ver Películas",
    "occupation": "Empleado",
    "nationality": "Mexicano",
    "favorite_movie": "Back to the Future",
    "favorite_color": "blue"
  }
}
```

ahora podemos consultar nuestra base de datos en ROBO 3T

### Creando una mutación para la autenticación de usuarios

En _schema.js_

```js

    input AuthInput{
        email: String!
        password: String!
    }

       type Token {
        token: String
    }

    .
    .
    .

    type Mutation {
        addUser(input: UserInput!) : User
        auth(input: AuthInput!) : Token
```

Y en _resolver.js_

```js
        auth: async (_, {input}) => {
            const { email, password } = input;
            // Si el usuario existe
            const registeredUser = await User.findOne({email});
            if (!registeredUser) {
                throw new Error('Usuario o password incorrecto');
            }
            // Revisar si el password es correcto
            const rightPassword = await bcryptjs.compare( password, registeredUser.password );
            if(!rightPassword) {
                throw new Error('Usuario o password incorrecto');
            }
            // Crear el token
            const { id, name, last_name, created_at } = registeredUser;
            return {
                token: jwt.sign( { id, email, name, last_name, created_at } , process.env.SECRET, { expiresIn: '8h' } )
            }
        },
```

#### Probando nuestra mutación para Autenticar Usuarios

```graphql
mutation ($input: AuthInput!) {
  auth(input: $input) {
    token
  }
}
```

Query Variables

```json
{
  "input": {
    "email": "zanddro@gmail.com",
    "password": "P@55word"
  }
}
```

Podemos validar nuestro JWToken en https://jwt.io/

### Verificar Token en caso de recibir el header 'Authorization'

Con lo anterior podemos crear un "query" que nos regrese los datos del usuario que se encuentra logeado, obteniendo los datos del jsonwebtoken.

Primero necesitamos Verificar el Token que recibiremos en el header de neustras peticiones

_backend/index.js_

```js
const server = new ApolloServer({
  typeDefs,
  resolvers,
  // VERIFICAR TOKEN DEL HEADER DE AUTHORIZATION
  context: ({ req }) => {
    const token = req.headers['authorization'] || '';
    if (token) {
      try {
        const { id } = jwt.verify(
          token.replace('Bearer ', ''),
          process.env.SECRET
        );
        return {
          id,
        };
      } catch (error) {
        console.log(error);
      }
    }
  },
});
```

Creamos la definición en el schema

```js
    type Query {
        currentUser: User
        getUsers: [User]
    }
```

Y el resolver correspondiente

```js
currentUser: async (_, {}, ctx) => {
  //Validamos que ctx contenga información del usuario
  if (!ctx.id) throw new Error('Token no válido');

  const user = await User.findById(ctx.id);
  if (!user) {
    throw new Error('Usuario no encontrado');
  }
  return user;
};
```

##### Probando la mutación para otener el Current User

```graphql
{
  currentUser {
    id
    email
    last_name
  }
}
```

HTTP Headers

```json
{
  "authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMGI3MGFmMWRkY2ZlMDAxZjUxZjlkMCIsImVtYWlsIjoiemFuZGRyb0BnbWFpbC5jb20iLCJuYW1lIjoiU2FuZHJvIEUuIiwibGFzdF9uYW1lIjoiTWFydMOtbmV6IiwiaWF0IjoxNjI4MTQyMzk4LCJleHAiOjE2MjgxNzExOTh9.R3J5ncYdIVtfLFBVxhq-egurjUJFp5UbSZ7RfC2d-Ps"
}
```

### Un ejemplo de Query pasando parámetros

También es posible parámetros a una consulta, lo ejemplificaremos con ek siguiente query.

_schema.js_

```js
    type Query {
       ...
        getUser(id: ID!) : User
    }
```

_resolvers.js_

```js
        getUser: async (_, { id }, ctx) => {
            //Validamos que ctx contenga información del usuario
            if(!ctx.id) throw new Error('Token no válido');

            // Consultamos al usuario
            const user = await User.findById(id);
            if(!user) {
                throw new Error('Usuario no encontrado');
            }
            return user;
        },
```

##### Probando el query para obterner un usuario por su id

```graphql
query ($id: ID!) {
  getUser(id: $id) {
    id
    email
    last_name
    created_at
  }
}
```

Query Variables

```json
{
  "id": "610b70af1ddcfe001f51f9d0"
}
```

HTTP Headers

```json
{
  "authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMGI3MGFmMWRkY2ZlMDAxZjUxZjlkMCIsImVtYWlsIjoiemFuZGRyb0BnbWFpbC5jb20iLCJuYW1lIjoiU2FuZHJvIEUuIiwibGFzdF9uYW1lIjoiTWFydMOtbmV6IiwiaWF0IjoxNjI4MTQyMzk4LCJleHAiOjE2MjgxNzExOTh9.R3J5ncYdIVtfLFBVxhq-egurjUJFp5UbSZ7RfC2d-Ps"
}
```

### Mutation para cambiar password

Hagámos un ejemplo más de una mutación, la cual utilizaremos para actualizar el password de un un usuario logeado

_schema.js_

```js
    #  CREAMOS NUSTRO APARTADO DE MUTACIONES
    type Mutation {
      ...
      changeMyPassword(newPassword : String!): String
    }
```

_resolvers.js_

```js
changeMyPassword: async (_, { newPassword }, ctx) => {
  if (!ctx.id) throw new Error('Token no válido');

  // Hashear password
  const salt = await bcryptjs.genSalt(10);
  const password = await bcryptjs.hash(newPassword, salt);

  // guardarlo en la base de datos
  try {
    // Guardarlo en la base de datos
    await User.findOneAndUpdate({ _id: ctx.id }, { password });
    return 'Password actualizado correctamente';
  } catch (error) {
    console.log(error);
  }
};
```

#### Probando mutación para cambiar password para

Probemos en el playground nuestra mutación cambiando un password

```graphql
mutation ($newPassword: String!) {
  changeMyPassword(newPassword: $newPassword)
}
```

En las variables debemos coloar el nuevo Password

```json
{
  "newPassword": "123456"
}
```

Y es neceario agregar el token en el header de autenticación

```json
{
  "authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMGI3MGFmMWRkY2ZlMDAxZjUxZjlkMCIsImVtYWlsIjoiemFuZGRyb0BnbWFpbC5jb20iLCJuYW1lIjoiU2FuZHJvIEUuIiwibGFzdF9uYW1lIjoiTWFydMOtbmV6IiwiaWF0IjoxNjI4MTQyMzk4LCJleHAiOjE2MjgxNzExOTh9.R3J5ncYdIVtfLFBVxhq-egurjUJFp5UbSZ7RfC2d-Ps"
}
```

NOTA: Si modificamos el token podemos ver el error de "Token no válido"

## Consultar GraphQL desde Postman

https://learning.postman.com/docs/sending-requests/supported-api-frameworks/graphql/

## FRONTEND

Para poder consumir el API de graphql necesitamos crear el cliente apollo

_frontend/src/apollo.js_

```js
import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import fetch from 'node-fetch';
import { setContext } from 'apollo-link-context';

// CREAMOS LA CONEXIÓN AL BACKEND
const httpLink = createHttpLink({
  uri: 'http://localhost:4000/',
  fetch,
});

// INSERTAMOS EL TOKEN EN EL HEADER AUTHORIZATION
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      ...headers,
      authorization: token ? token : '',
    },
  };
});

// CREAMOS EL CLIENTE
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
});

// EXPORTAMOS EL CLIENTE
export default client;
```

Y poseriormente es neceario "hacerlo accesible" para la aplicación de la siguiente manera:

_frontend/src/index.js_

```js
import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from '@apollo/client';
import client from './apollo';
import CssBaseline from '@material-ui/core/CssBaseline';

import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <CssBaseline />
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
```

#### Login

Creamos el "MUTATION" para autenticar al usuario

_frontend/src/components/Login.js_

```js
//DECLARAMOS EL MUTATUION PARA AUTENTICAR
const AUTH_MUTATION = gql`
  mutation ($input: AuthInput!) {
    auth(input: $input) {
      token
    }
  }
`;
```

También debemos preparar la llamada a la mutación

```js
const [auth, { loading, error }] = useMutation(AUTH_MUTATION);
```

Para utilizarlo posteriormente en el método del submit

```js
const onSubmit = async (formData) => {
  console.log('Datos del formulario', formData);
  // UTILIZAMOS LA MUTACIÓN "AUTH" EN EL SUBMIT DEL FORMULARIO
  const { email, password } = formData;
  try {
    const { data } = await auth({
      variables: {
        input: { email, password },
      },
    });
    onAuth(data.auth.token);
  } catch (error) {
    console.error(error);
  }
};
```

Sin olvidarnos de dar retro alimentación al usuario

```jsx
{
  loading && <Loading />;
}
{
  error && <Modal message={error.message} />;
}
```

#### Cambiar Password

En esta pantalla traermos el nombre del cliente y también actualizaremos su contraseña, por lo que preparamos el query y la mutación correspondiente

```js
// PREPARAMOS LA CONSULTA PARA OBTEBER LOS DATOS DEL USUARIO
const QUERY_CURRENT_USER = gql`
  {
    currentUser {
      name
    }
  }
`;

// PREPARAMOS LA MUTACIÓN PARA PARA CAMBIAR EL PASSWORD
const QUERY_CHANGE_MY_PASSWORD = gql`
  mutation ($newPassword: String!) {
    changeMyPassword(newPassword: $newPassword)
  }
`;
```

Realizacmos la consulta de los datos del usuario

```js
const {
  data,
  loading: cuLoading,
  error: cuError,
} = useQuery(QUERY_CURRENT_USER);
```

Preparamos la mutación para actuazalizar los datos del usuario

```js
const [changeMyPassword, { loading: cpLoading, error: cpError }] = useMutation(
  QUERY_CHANGE_MY_PASSWORD
);
```

Mostramos el nombre del usuario arriba del formulario

```js
{
  data && (
    <Typography variant='h3'>Bienvenido {data.currentUser.name}</Typography>
  );
}
```

Sin olvidarnos de dar Retro alimentación al usuario

```js
if (cuError) {
  return <Modal message={cuError.message} />;
} else if (cuLoading) {
  return <Loading />;
} else {
  return <Div100vh className={classes.root}>. . .</Div100vh>;
}
```

Utilizamos el método para cambiar password en el submit del formulario de

```js
const onSubmit = async ({ password }) => {
  console.log('forma data', password);

  // UTILIZAMOS NUESTRO MÉTODO PARA CAMBIAR PASSWORD
  try {
    const { data } = await changeMyPassword({
      variables: {
        newPassword: password,
      },
    });
    setMessage(data.changeMyPassword);
  } catch (error) {
    console.error(error);
  }
};
```

Sin olvidarnos de dar retro alimentación al usuario de agún error

```js
if (cuError || cpError) {
  return <Modal message={cuError ? cuError.message : cpError.message} />;
} else if (cpLoading || cuLoading) {
  return <Loading />;
} else {
  return (
    <Div100vh className={classes.root}>
.
.
.

        <Link onClick={onLogout} className={classes.link}>
          Cerrar Sesión
        </Link>
        {message && <Modal title='Cambio Exitoso' message={message} />}
      </Container>
    </Div100vh>
  );
}
```
