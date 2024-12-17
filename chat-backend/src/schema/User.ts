import mongoose, { Document, Schema } from 'mongoose';


interface IUser extends Document {
 
  username: string;
  //email: string;
  password: string;
}

// Define el esquema de usuario
const UserSchema: Schema = new Schema({
   username: { type: String, required: true },
  //email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Crea el modelo de usuario
const User = mongoose.model<IUser >('User ', UserSchema);

export default User;