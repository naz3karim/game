const Mongoose = require("mongoose")
const userSchema = new Mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
  token: {
    type:String,
    default:null
  },
  name: String,
})
module.exports = Mongoose.model("User", userSchema)