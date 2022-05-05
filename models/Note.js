const {Schema, model} = require('mongoose')

const noteSchema = new Schema({    
    content: String,
    date: Date,
    important: Boolean
})

noteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v
    }
})



const Note = model('Note', noteSchema)

/* const note = new Note({
    content: 'nueva nota, hola mundo',
    date: new Date(),
    important: falseS
}) */

/* 
note.save(resul => {
    console.log(resul)
    mongoose.connection.close()
}).catch(err => console.error(err)) */

/* Note.find({}).then(res => {
    console.log(res)
    mongoose.connection.close()
}) */



module.exports = Note