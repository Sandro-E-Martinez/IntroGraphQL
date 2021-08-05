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

        currentUser: async (_, {}, ctx) => {
            //Validamos que ctx contenga información del usuario
            if(!ctx.id) throw new Error('Token no válido');

            const user = await User.findById( ctx.id );
            if(!user) {
                throw new Error('Usuario no encontrado');
            }
            return user;
        },

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

    },
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
            const { id } = registeredUser;
            return {
                token: jwt.sign( { id } , process.env.SECRET, { expiresIn: '8h' } )
            }
        },

        changeMyPassword: async (_,{newPassword}, ctx) => {
            if(!ctx.id) throw new Error('Token no válido');

            // Hashear password
            const salt = await bcryptjs.genSalt(10);
            const password = await bcryptjs.hash(newPassword, salt);

            // guardarlo en la base de datos
            try {
                // Guardarlo en la base de datos
                await User.findOneAndUpdate({ _id : ctx.id }, {password});
                return 'Password actualizado correctamente';
            } catch (error) {
                console.log(error);
            }
        }
    }
}

module.exports = resolvers;