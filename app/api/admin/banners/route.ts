import { NextRequest, NextResponse } from 'next/server';
import { bannerConfigs } from '@/lib/data';

export async function GET() {
  return NextResponse.json({ banners: bannerConfigs });
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    // In production: await prisma.bannerConfig.upsert({ where: { key: body.key }, update: body, create: body });
    return NextResponse.json({ success: true, message: 'Banner updated (mock)', data: body });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
