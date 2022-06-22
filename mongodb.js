const mongoose = require('mongoose')
const { MONGO_DB_URI, MONGO_DB_URI_TEST, NODE_ENV } = process.env

const connectionString = NODE_ENV === 'test'
    ? MONGO_DB_URI_TEST
    : MONGO_DB_URI


//conexion a mongo db
mongoose.connect(connectionString)
.then(console.log('Database Connecting'))
.catch(err => console.error(err))

