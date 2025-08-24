import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // Get the active hunt (for now, we'll get the first active hunt)
    const hunt = await db.hunt.findFirst({
      where: { isActive: true },
      include: {
        _count: {
          select: {
            participants: true,
          },
        },
      },
    });

    if (!hunt) {
      return NextResponse.json(
        { error: 'No active hunt found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      hunt: {
        id: hunt.id,
        title: hunt.title,
        description: hunt.description,
        entryFee: hunt.entryFee,
        prizePool: hunt.prizePool,
        prizeClaimed: hunt.prizeClaimed,
        maxParticipants: hunt.maxParticipants,
        participantsCount: hunt._count.participants,
      },
    });
  } catch (error) {
    console.error('Error fetching active hunt:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}