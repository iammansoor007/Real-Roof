import mongoose, { Schema } from 'mongoose';
import './User';
import './Category';
import './Tag';

const PostSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true }, // HTML from Tiptap
  excerpt: { type: String },
  featuredImage: { type: String },
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
  tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
  status: { 
    type: String, 
    enum: ['draft', 'published', 'scheduled'], 
    default: 'draft' 
  },
  publishedAt: { type: Date, default: Date.now },
  seo: {
    metaTitle: String,
    metaDescription: String,
    focusKeyword: String,
    canonicalUrl: String,
    metaRobotsIndex: { type: String, default: 'index' },
    metaRobotsFollow: { type: String, default: 'follow' },
    ogTitle: String,
    ogDescription: String,
    ogImage: String,
    twitterCard: { type: String, default: 'summary_large_image' }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.models.Post || mongoose.model('Post', PostSchema);
