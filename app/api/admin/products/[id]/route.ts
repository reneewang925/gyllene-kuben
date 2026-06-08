import { NextRequest, NextResponse } from 'next/server';
import { featuredProducts } from '@/lib/data';

interface Params { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const product = featuredProducts.find((p) => p.id === parseInt(id, 10));
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ product });
}

export async function PUT(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await req.json();
  // In production: await prisma.product.update({ where: { id: parseInt(id) }, data: body });
  return NextResponse.json({ success: true, message: `Product ${id} updated (mock)`, data: body });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  // In production: await prisma.product.delete({ where: { id: parseInt(id) } });
  return NextResponse.json({ success: true, message: `Product ${id} deleted (mock)` });
}
