import { NextRequest, NextResponse } from 'next/server';
import { journalPosts } from '@/lib/data';

export async function GET() {
  return NextResponse.json({ posts: journalPosts, total: journalPosts.length });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // In production: await prisma.journalPost.create({ data: body });
    return NextResponse.json({ success: true, message: 'Journal post created (mock)', data: body }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
