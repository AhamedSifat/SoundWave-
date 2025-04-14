import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },

    clerkId: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;
