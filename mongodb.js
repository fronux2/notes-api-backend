const mongoose = require('mongoose')
const connectionString = process.env.MONGO_DB_URI


//conexion a mongo db
mongoose.connect(connectionString)
.then(console.log('Database Connecting'))
.catch(err => console.error(err))

