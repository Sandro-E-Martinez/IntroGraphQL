const mongoose = require('mongoose');

const UsersSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    last_name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    }, 
    phone: {
        type: String,
        required: true,
        trim: true
    }, 
    bio: {
        type: String,
        required: true,
        trim: true
    }, 
    hobbies: {
        type: String,
        required: true,
        trim: true
    }, 
    occupation: {
        type: String,
        required: true,
        trim: true
    }, 
    nationality: {
        type: String,
        required: true,
        trim: true
    }, 
    favorite_movie: {
        type: String,
        required: true,
        trim: true
    }, 
    favorite_color: {
        type: String,
        required: true,
        trim: true
    }, 
    active: {
        type: Boolean,
        default: true
    }, 
    created_at: {
        type: Date,
        default: Date.now() // POR DEFAULT SE INSERTA LA HORA EN LA QUE FUE GENERADO EL OBJECTO
    }
});

module.exports = mongoose.model('User', UsersSchema);