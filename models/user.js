const {createHmac, randomBytes} =  require('crypto');
const {Schema, model} = require('mongoose');
const { createTokenForUser } = require('../services/auth');

const userSchema = new Schema({
    fullName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    salt:{
        type:String,
       
    },
    password:{
        type:String,
        required:true,
        
    },
   
    profileImageURL:{
        type:String,
        default:'/images/image.png',
    },
    role:{
        type:String,
        enum: ["USER","ADMIN"],
        default: "USER",
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:"user",
    },
},
 {timestamps:true}
 );

 userSchema.pre('save',function (next) {
    const user = this;

    if(!user.isModified('password')) return;

    const salt = 'someRandmSalt';
    const hashedpassword = createHmac('sha256',salt)
    .update(user.password)
    .digest("hex");

    this.salt = salt;
    this.password = hashedpassword;

    next();
 });

 userSchema.static('matchPasswordandGenerateToken',
     async function(email,password){
    const user = await this.findOne({email});
    if(!user) throw new Error('User not found')

    const salt = user.salt;
    

    const hashedpassword = user.password;
    const userProvidedHash = createHmac('sha256',salt)
    .update(password)
    .digest("hex");
    

    if(hashedpassword !== userProvidedHash)throw new Error('Incrroct password');
      
   const token = createTokenForUser(user);
   return token;
 })

 const User = model('user', userSchema);

 module.exports = User;