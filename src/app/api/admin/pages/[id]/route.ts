import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Page from '@/models/Page';
import SiteContent from '@/models/Content';
import { hasPermission, getSessionUser } from '@/lib/rbac';
import { recordActivity } from '@/lib/logger';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await hasPermission(req, 'pages', 'read'))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
  try {
    const { id } = await params;
    await connectToDatabase();
    const page = await Page.findById(id);
    if (!page) return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    return NextResponse.json(page);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionUser(req);
  if (!(await hasPermission(req, 'pages', 'update'))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const { content, isTrashed } = body;

    await connectToDatabase();
    const oldPage = await Page.findById(id);
    if (!oldPage) return NextResponse.json({ error: 'Page not found' }, { status: 404 });

    const updateData = { ...body };
    if (body.isTrashed !== undefined) {
      updateData.isTrashed = body.isTrashed;
      updateData.trashedAt = body.isTrashed ? new Date() : null;
    }

    const updatedPage = await Page.findByIdAndUpdate(id, updateData, { new: true });

    // ====================================================================
    // AUTO-SYNC: If this is the about-us page, sync all content sections
    // to complete_data.data.aboutPage so the public /about page always
    // shows the latest admin edits without needing a manual sync script.
    // ====================================================================
    const pageSlug = updatedPage?.slug || oldPage?.slug;
    if (pageSlug === 'about-us' && content && typeof content === 'object') {
      try {
        const sectionsToSync = [
          'hero', 'mission', 'story', 'values', 'capabilities',
          'stats', 'ctaBanner', 'recognition', 'services', 'faqs', 'blogSection'
        ];
        const syncSet: Record<string, any> = {};

        for (const section of sectionsToSync) {
          if (content[section] !== undefined) {
            syncSet[`data.aboutPage.${section}`] = content[section];
          }
        }

        if (Object.keys(syncSet).length > 0) {
          await SiteContent.updateOne(
            { key: 'complete_data' },
            { $set: { ...syncSet, lastUpdated: new Date() } },
            { upsert: false }
          );
          console.log('[Pages API] Auto-synced about-us content to complete_data.data.aboutPage');
        }
      } catch (syncErr) {
        // Don't fail the main save if sync fails — just log it
        console.error('[Pages API] Failed to auto-sync about-us to complete_data:', syncErr);
      }
    }

    await recordActivity({
      user: (session as any).userId,
      userName: (session as any).username,
      action: 'UPDATE_PAGE',
      entity: 'Page',
      entityId: id,
      details: { before: oldPage?.title || 'Unknown', after: updatedPage?.title || 'Unknown' },
      ip: req.headers.get('x-forwarded-for') || (req as any).ip || 'unknown'
    });

    if (updatedPage && updatedPage.slug) {
      try {
        const { revalidatePath } = await import('next/cache');
        const pagePath = updatedPage.slug.startsWith('/') ? updatedPage.slug : `/${updatedPage.slug}`;
        revalidatePath(pagePath);
        revalidatePath('/about');
        revalidatePath('/');
      } catch (err) {
        console.error('Failed to revalidate path:', err);
      }
    }

    return NextResponse.json(updatedPage);
  } catch (error: any) {
    console.error('Page update error:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionUser(req);
  if (!(await hasPermission(req, 'pages', 'delete'))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const { id } = await params;
    await connectToDatabase();
    const deletedPage = await Page.findByIdAndDelete(id);
    if (!deletedPage) return NextResponse.json({ error: 'Page not found' }, { status: 404 });

    await recordActivity({
      user: (session as any).userId,
      userName: (session as any).username,
      action: 'DELETE_PAGE',
      entity: 'Page',
      entityId: id,
      details: { message: `Deleted page: ${deletedPage?.title || 'Unknown'}` },
      ip: req.headers.get('x-forwarded-for') || (req as any).ip || 'unknown'
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Page delete error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
