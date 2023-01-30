const mongoose=require('mongoose');
const mongoURI="mongodb+srv://yashjaiswalonly:yash123@newcluster.z6cxguf.mongodb.net/test"
mongoose.set("strictQuery", false); //stack overflow to reduce error
const connectToMongo=()=>{
    mongoose.connect(mongoURI,()=>{
        console.log("connected to  mongo successfully") ;
    })
} 

module.exports=connectToMongo;