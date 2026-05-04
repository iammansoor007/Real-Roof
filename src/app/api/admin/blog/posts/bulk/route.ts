import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Post from '@/models/Post';
import { getSessionUser } from '@/lib/rbac';
import { recordActivity } from '@/lib/logger';

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { ids, action, value } = await req.json();
    if (!ids || !Array.isArray(ids) || !action) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    await connectToDatabase();

    if (action === 'delete') {
      await Post.deleteMany({ _id: { $in: ids } });
      await recordActivity({
        user: user.userId,
        userName: user.username,
        action: 'BULK_DELETE_POSTS',
        entity: 'Post',
        details: { ids, message: `Bulk deleted ${ids.length} posts` },
        ip: req.headers.get('x-forwarded-for') || 'unknown'
      });
    } else if (action === 'status') {
      await Post.updateMany(
        { _id: { $in: ids } },
        { $set: { status: value, updatedAt: new Date() } }
      );
      await recordActivity({
        user: user.userId,
        userName: user.username,
        action: 'BULK_STATUS_CHANGE',
        entity: 'Post',
        details: { ids, status: value, message: `Bulk changed ${ids.length} posts to ${value}` },
        ip: req.headers.get('x-forwarded-for') || 'unknown'
      });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Bulk action error:", err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
