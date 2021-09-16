const  mongoose=require('mongoose');;
const mongoURI="mongodb+srv://qwerty12:qwerty12@cluster0.cedcr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const connectToMongo=()=>{
    mongoose.connect(mongoURI,()=>{
        console.log("connect to mongo")
    })
};

module.exports=connectToMongo;
