import { NextRequest, NextResponse } from 'next/server';
import { members, redemptionRequests } from '@/lib/data';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const view = searchParams.get('view') ?? 'members';
  if (view === 'redemptions') return NextResponse.json({ redemptions: redemptionRequests });
  return NextResponse.json({ members, total: members.length });
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json() as { memberId: number; delta: number; reason: string; adminNote?: string };
    // In production:
    // await prisma.$transaction([
    //   prisma.member.update({ where: { id: body.memberId }, data: { loyaltyPoints: { increment: body.delta } } }),
    //   prisma.pointsTransaction.create({ data: { memberId: body.memberId, delta: body.delta, reason: body.reason, adminNote: body.adminNote } }),
    // ]);
    return NextResponse.json({ success: true, message: `Points adjusted by ${body.delta} for member ${body.memberId} (mock)` });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
