import { Schema, model } from 'mongoose';
import { TUser } from './user.interface';

const userSchema = new Schema<TUser>(
  {
    id: { type: String, required: true },
    password: { type: String, required: true },
    needsPasswordChange: { type: Boolean, required: true },
    role: { type: String, enum: ['admin', 'faculty', 'student'] },
     status:{type:String, enum:['in-progress', 'blocked'],
    default:"in-progress"
     },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const User = model<TUser>("User", userSchema);