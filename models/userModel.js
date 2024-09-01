import mongoose from "mongoose";
import validator from "validator";
import bcrypt from 'bcryptjs';
import JWT from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
   name: {
      type: String,
      required: [true, 'Name Is Required']
   },
   lastName: {
      type: String
   },
   email: {
      type: String,
      required: [true, 'Email Is Required'],
      unique: true,
      validate: validator.isEmail
   },
   password: {
      type: String,
      required: [true, 'Password Is Required'],
      minlength: [6, "Password Length Should Be More Than 6"],
      select: true
   },
   location: {
      type: String,
      default: 'India'
   },
})

// Create Middleware
userSchema.pre("save", async function () {
   if(!this.isModified) return ;  // This function check password modified or not
   const salt = await bcrypt.genSalt(10);
   this.password = await bcrypt.hash(this.password, salt);
})

// Compare Password
userSchema.methods.comparePassword = async function (userPassword) {
   const isMatch = await bcrypt.compare(userPassword, this.password)
   return isMatch;
}

// Creating Token
userSchema.methods.createJWT = function () {
   return JWT.sign({ userId: this._id }, process.env.JWT_SECRET, { expiresIn: '1d' })
}

export default mongoose.model('User', userSchema)