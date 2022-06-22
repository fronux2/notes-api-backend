const {server}  = require('../index')
const mongoose = require('mongoose')
const User = require("../models/User")
const bcrypt = require('bcrypt')
const {api, getUsers} = require('./helpers')

describe.only('creating a new user', () => {
    beforeEach(async () => {
        await User.deleteMany()

        const passwordHash = await bcrypt.hash('pswd', 10)
        const user = new User({username: 'fronux',passwordHash})
        await user.save()
    })

    test('wordks as expected creating a freash username', async () => {
        const userAtStart = await getUsers()

        const newUser = {
            username: 'fronux',
            name:'marcos',
            password: '654321'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        
        const usersAtEnd = await getUsers()

        expect(usersAtEnd).toHaveLength(userAtStart.length +1)

        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).toContain(newUser.username)
    })

    afterAll(() => {
        mongoose.connection.close()
        server.close()    
      })
})