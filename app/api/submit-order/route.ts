// File: app/api/submit-order/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import eventEmitter from '@/lib/eventEmitter';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

interface OrderItem {
  id: number;
  name: string;
  quantity: number;
}

export async function POST(req: NextRequest) {
  const { order } = await req.json() as { order: OrderItem[] };

  try {
    const savedOrder = await prisma.order.create({
      data: {
        items: {
          create: order.map((item) => ({
            dishId: item.id,
            dishName: item.name,
            quantity: item.quantity,
          }))
        }
      },
      include: {
        items: true
      }
    });

    eventEmitter.emit('newOrder', savedOrder);

    return NextResponse.json({ success: true, message: 'Order saved successfully', order: savedOrder });
  } catch (error) {
    console.error('Error processing order:', error);
    return NextResponse.json({ success: false, error: 'Failed to process order' }, { status: 500 });
  }
}