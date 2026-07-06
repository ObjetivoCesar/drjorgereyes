import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const BLOG_DIR = path.join(process.cwd(), 'content/blog');

// GET /api/posts - List all posts
export async function GET() {
  try {
    if (!fs.existsSync(BLOG_DIR)) {
      return NextResponse.json({ posts: [] });
    }

    const files = fs.readdirSync(BLOG_DIR);
    const posts = files
      .filter((file) => file.endsWith('.mdx'))
      .map((file) => {
        const filePath = path.join(BLOG_DIR, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const { data, content } = matter(fileContent);

        return {
          slug: file.replace('.mdx', ''),
          metadata: data,
          content,
          wordCount: content.split(/\s+/).length,
        };
      });

    const sorted = posts.sort((a, b) => {
      const dateA = a.metadata?.date ? new Date(a.metadata.date).getTime() : 0;
      const dateB = b.metadata?.date ? new Date(b.metadata.date).getTime() : 0;
      return dateB - dateA;
    });

    return NextResponse.json({ posts: sorted });
  } catch (error) {
    console.error('Error reading posts:', error);
    return NextResponse.json(
      { error: 'Failed to read posts' },
      { status: 500 }
    );
  }
}

// POST /api/posts - Create new post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, metadata } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .substring(0, 60);

    // Check if slug exists
    const existingFile = path.join(BLOG_DIR, `${slug}.mdx`);
    let finalSlug = slug;
    let counter = 1;

    while (fs.existsSync(existingFile)) {
      finalSlug = `${slug}-${counter}`;
      counter++;
    }

    // Prepare frontmatter
    const frontmatter = {
      title,
      date: metadata?.date || new Date().toISOString().split('T')[0],
      excerpt: metadata?.excerpt || '',
      author: metadata?.author || 'Jorge Reyes',
      category: metadata?.category || 'Artículo',
      image: metadata?.image || '/images/og-jorge-reyes.webp',
      status: metadata?.status || 'draft',
      // SEO fields
      seoTitle: metadata?.seoTitle || '',
      seoDescription: metadata?.seoDescription || '',
      seoKeywords: metadata?.seoKeywords || '',
      ogImage: metadata?.ogImage || '',
    };

    const fileContent = matter.stringify(content, frontmatter);
    const filePath = path.join(BLOG_DIR, `${finalSlug}.mdx`);

    fs.writeFileSync(filePath, fileContent, 'utf-8');

    return NextResponse.json({
      success: true,
      slug: finalSlug,
      message: 'Post created successfully',
    });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}