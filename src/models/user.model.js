import mongoose,{Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new Schema(
    {
        username : {
            type: String,
            require: true,
            unique: true,
            lowecase: true,
            trim: true,
            index: true // index help for searching data
        },
        email : {
            type: String,
            require: true,
            unique: true,
            lowecase: true,
            trim: true,
        },
        fullname : {
            type: String,
            require: true,
            trim: true,
            index: true // index help for searching data
        },
        avatar : {
            type: String, //cloudinary url/another server
            require: true,
        },
        coverImage : {
            type: String, //cloudinary url/another server
            require: true,
        },
        watchHistory : [
            {
                type : Schema.Types.ObjectId,
                ref : "Video"
            }
        ],
        password:{
            type: String,
            required:[true,'password is required']
        },
        refreshToken:{
            type:String
        }
    },
    {
        timestamps:true
    }
)

//pre database data save howar aktu age ai code excuite kore
userSchema.pre("save",async function (next) {
    if(!this.isModified("password")) return next()
    
    this.password = bcrypt.hash(this.password,10)
    next()
})

//password check
userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password)
}

//genarate access token
userSchema.methods.generateAccessToken = function(){
  return jwt.sign(
    {
        _id : this._id,
        email: this.email,
        username:this.username,
        fullname: this.fullname
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
)
}

//generate refreshtoken
userSchema.methods.generateRefreshToken = function(){
    jwt.sign(
        {
            _id : this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User",userSchema)
