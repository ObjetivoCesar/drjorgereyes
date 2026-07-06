import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const BLOG_DIR = path.join(process.cwd(), 'content/blog');

interface Params {
  params: Promise<{ slug: string }>;
}

// GET /api/posts/[slug] - Get single post
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { slug } = await params;
    const filePath = path.join(BLOG_DIR, `${slug}.mdx`);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(fileContent);

    return NextResponse.json({
      slug,
      metadata: data,
      content,
    });
  } catch (error) {
    console.error('Error reading post:', error);
    return NextResponse.json({ error: 'Failed to read post' }, { status: 500 });
  }
}

// PUT /api/posts/[slug] - Update post
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const { title, content, metadata } = body;

    const filePath = path.join(BLOG_DIR, `${slug}.mdx`);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Preserve existing frontmatter keys not in update
    const existingContent = fs.readFileSync(filePath, 'utf-8');
    const existing = matter(existingContent);

    const frontmatter = {
      title: title || existing.data.title,
      date: metadata?.date || existing.data.date,
      excerpt: metadata?.excerpt || existing.data.excerpt || '',
      author: metadata?.author || existing.data.author || 'Jorge Reyes',
      category: metadata?.category || existing.data.category || 'Artículo',
      image: metadata?.image || existing.data.image || '/images/og-jorge-reyes.webp',
      status: metadata?.status || existing.data.status || 'draft',
      seoTitle: metadata?.seoTitle || existing.data.seoTitle || '',
      seoDescription: metadata?.seoDescription || existing.data.seoDescription || '',
      seoKeywords: metadata?.seoKeywords || existing.data.seoKeywords || '',
      ogImage: metadata?.ogImage || existing.data.ogImage || '',
    };

    const newContent = matter.stringify(content, frontmatter);
    fs.writeFileSync(filePath, newContent, 'utf-8');

    return NextResponse.json({
      success: true,
      slug,
      message: 'Post updated successfully',
    });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

// DELETE /api/posts/[slug] - Delete post
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { slug } = await params;
    const filePath = path.join(BLOG_DIR, `${slug}.mdx`);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    fs.unlinkSync(filePath);

    return NextResponse.json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}