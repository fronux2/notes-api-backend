const supertest = require('supertest')
const {app}  = require('../index')
const api = supertest(app)
const User = require('../models/User')

const initialNotes = [
    {
        content:"hola mundo",
        date: new Date(),
        important: true
    },
    {
        content:"learning testing for midudev",
        date: new Date(),
        important: true
    }
]

const getAllContentfromNotes = async () => {
    const response = await api.get('/api/notes')    
    return {
        contents: response.body.map(note => note.content),
        response
    }
}

const getUsers =  async () => {
    const userDB = await User.find({})
    return userAtStart = userDB.map(user => user.toJSON())
}

module.exports = {initialNotes, getAllContentfromNotes, api, getUsers}