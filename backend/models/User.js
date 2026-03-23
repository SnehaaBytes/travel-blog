import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  
  // 👉 ADD THIS: Default gives regular user access. You can manually set this to true directly in MongoDB for your admin account.
  isAdmin: { type: Boolean, default: false } 
});


const User = mongoose.model('User', userSchema);

export default User;
