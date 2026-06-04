const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

// We need to import the models so mongoose knows about them
const CategorySchema = new mongoose.Schema({ name: String });
const TagSchema = new mongoose.Schema({ name: String });
const UserSchema = new mongoose.Schema({ name: String });

mongoose.model('Category', CategorySchema);
mongoose.model('Tag', TagSchema);
mongoose.model('User', UserSchema);

const PostSchema = new mongoose.Schema({
  title: String,
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const Post = mongoose.model('Post', PostSchema);

async function check() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { dbName: process.env.MONGODB_DB });
    console.log('Connected');
    const posts = await Post.find().populate('categories').populate('tags').populate('author').lean();
    console.log('Success:', posts.length);
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await mongoose.disconnect();
  }
}

check();
