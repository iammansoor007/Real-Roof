import mongoose from 'mongoose';
import ActivityLog from './src/models/ActivityLog';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: '.env.local' });

async function check() {
  await mongoose.connect(process.env.MONGODB_URI + '/' + process.env.MONGODB_DB);
  const logs = await ActivityLog.find({}).sort({ timestamp: -1 }).limit(5);
  console.log('Recent Logs:', JSON.stringify(logs, null, 2));
  process.exit();
}

check();
