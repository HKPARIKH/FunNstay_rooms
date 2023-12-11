const mongoose = require("mongoose");

var mongoURL = 'mongodb+srv://hotlebooking:prjprjprj@cluster0.mspvxuv.mongodb.net/mern-rooms'

mongoose.connect(mongoURL , {useUnifiedTopology : true ,  useNewUrlParser : true})

var connection = mongoose.connection

connection.on('error' , ()=>{
    console.log('Mongo DB connection failed')
})
connection.on('connected' , ()=>{
    console.log('Mongo DB Connection Successful')
})

module.exports = mongoose