const mongoose=require('mongoose');
const {Schema}=mongoose;

const NotesSchema = new Schema({
    user:{  //foreign key like , konse user se ye notes link krra hai
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'  //reference model , link user to notes 
    }, 
    tittle:{ 
        type:String,
        required:true
    },    
    description:{
        type:String,
        required:true
    },  
    tag:{  
        type:String,
        default:"General"
    },
    date:{
        type:Date,
        default:Date.now
    }     
});
module.exports=mongoose.model('notes',NotesSchema);