const mongoose = requrie('mongoose');
const crypto = require('crypto');
const uuidV1 = require('uuid');

const artistSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 64
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: 64
    },
    password: {
        type: String,
        required: true,
    },
    artistType:{
        type: String,
        required: true,
    },
    about: {
        type: String,
        trim: true,
        required: true
    },
    usertype:{
        type: Number,
        default: 0
    },
    history:{
        type: Array,
        default: []
    },
    salt: String,

}, { timestamps: true }
);

artistSchema.virtual('password')
    .set(function(password){
        this._password = password
        this.salt = uuidV1()
        this.password = this.encryptPassword(password)
    })
    .get(function(){
        return this._password
    })

 artistSchema.methods = {
    encryptPassword: function(password){
        if(!password) return '';
        try{
            return crypto.createHmac('sha1',this.salt)
                         .update(password)
                         .digest('hex')
        }catch(err){
            return "";
        }
    }
 };
 
 module.exports = mongoose.model("Artist",artistSchema);