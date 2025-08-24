import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

const paymentSchema = z.object({
  userId: z.string(),
  amount: z.number().positive(),
  huntId: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, amount, huntId } = paymentSchema.parse(body);

    // Verify user exists
    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Verify hunt exists and is active
    const hunt = await db.hunt.findUnique({
      where: { id: huntId },
    });

    if (!hunt || !hunt.isActive) {
      return NextResponse.json(
        { error: 'Hunt not found or not active' },
        { status: 404 }
      );
    }

    // Check if user is already registered for this hunt
    const existingParticipant = await db.participant.findUnique({
      where: {
        userId_huntId: {
          userId,
          huntId,
        },
      },
    });

    if (existingParticipant) {
      return NextResponse.json(
        { error: 'User already registered for this hunt' },
        { status: 400 }
      );
    }

    // Create payment record
    const payment = await db.payment.create({
      data: {
        userId,
        amount,
        status: 'PENDING',
        // In a real app, you would integrate with Stripe here
        // stripePaymentId: paymentIntent.id,
      },
    });

    // Create participant record
    const participant = await db.participant.create({
      data: {
        userId,
        huntId,
        status: 'REGISTERED',
      },
    });

    // Simulate payment processing (in real app, this would be handled by Stripe webhook)
    await db.payment.update({
      where: { id: payment.id },
      data: { status: 'COMPLETED' },
    });

    return NextResponse.json({
      message: 'Payment processed successfully',
      payment: {
        id: payment.id,
        amount: payment.amount,
        status: payment.status,
      },
      participant: {
        id: participant.id,
        status: participant.status,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Payment error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}