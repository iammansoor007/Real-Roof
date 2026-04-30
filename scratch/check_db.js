import mongoose from 'mongoose';
import User from './src/models/User';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: '.env.local' });

async function check() {
  await mongoose.connect(process.env.MONGODB_URI + '/' + process.env.MONGODB_DB);
  const users = await User.find({ resetPasswordToken: { $exists: true } });
  console.log('Users with reset tokens:', JSON.stringify(users, null, 2));
  process.exit();
}

check();
