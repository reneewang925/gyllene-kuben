import { NextRequest, NextResponse } from 'next/server';
import { featuredProducts } from '@/lib/data';

export async function GET() {
  return NextResponse.json({ products: featuredProducts, total: featuredProducts.length });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // In production: await prisma.product.create({ data: body });
    return NextResponse.json({ success: true, message: 'Product created (mock)', data: body }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
