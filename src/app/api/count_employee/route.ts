import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const url = new URL(req.url);
  const dateParam = url.searchParams.get('date');

  let employeeInCount = 0;
  let employeeOutCount = 0;
  const pinMap = new Map<string, number>();

  if (dateParam) {
    const filterDate = new Date(dateParam);

    if (isNaN(filterDate.getTime())) {
      return NextResponse.json({ error: 'Invalid date format' }, { status: 400 });
    }

    const startOfDay = filterDate.setHours(0, 0, 0, 0);
    const endOfDay = filterDate.setHours(23, 59, 59, 999);

    const transactions = await prisma.acc_transaction.findMany({
      where: {
        create_time: {
          gte: new Date(startOfDay),
          lte: new Date(endOfDay),
        },
      },
    });

    transactions.forEach(transaction => {
      const { pin, event_point_name } = transaction;

      // Employee IN
      if (!pin.startsWith('8') && event_point_name.startsWith('TS') && event_point_name.endsWith('IN')) {
        employeeInCount += 1;
      } else if (pinMap.has(pin) && event_point_name.startsWith('TS') && event_point_name.endsWith('IN')) {
        employeeInCount += 1;
        employeeOutCount -= 1;
      }

      // Employee OUT
      if (!pin.startsWith('8') && event_point_name.startsWith('TS') && event_point_name.endsWith('OUT')) {
        employeeOutCount += 1;
      } else if (pinMap.has(pin) && event_point_name.startsWith('TS') && event_point_name.endsWith('OUT')) {
        employeeOutCount += 1;
        employeeInCount -= 1;
      }

      // Vehicle IN
      if (event_point_name.startsWith('BG') && event_point_name.endsWith('IN')) {
        employeeInCount += 1; // Count as employee IN
        employeeOutCount -= 1; // Adjust OUT count
      }

      // Vehicle OUT
      if (event_point_name.startsWith('BG') && event_point_name.endsWith('OUT')) {
        employeeOutCount += 1; // Count as employee OUT
        employeeInCount -= 1; // Adjust IN count
      }

      pinMap.set(pin, (pinMap.get(pin) || 0) + 1);
    });
  } else {
    const transactions = await prisma.acc_transaction.findMany();
    // Logic for counting all transactions if needed
  }

  return NextResponse.json({ employeeInCount, employeeOutCount });
}
