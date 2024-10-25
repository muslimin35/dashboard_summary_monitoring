import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  // Extracting the date parameter from the query string
  const url = new URL(req.url);
  const dateParam = url.searchParams.get('date');

  let visitorInCount = 0;
  let visitorOutCount = 0;
  const pinMap = new Map<string, number>();

  // If a date parameter is provided, validate it
  if (dateParam) {
    const filterDate = new Date(dateParam);
    
    // Check if the date is valid
    if (isNaN(filterDate.getTime())) {
      return NextResponse.json({ error: 'Invalid date format' }, { status: 400 });
    }

    // Set start and end time for the specific date
    const startOfDay = filterDate.setHours(0, 0, 0, 0);
    const endOfDay = filterDate.setHours(23, 59, 59, 999);

    // Fetch transactions for the specified date
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

      // Check for visitor IN logic
      if (pin.startsWith('8') && event_point_name.startsWith('TS') && event_point_name.endsWith('IN')) {
        visitorInCount += 1;
      } else if (pinMap.has(pin) && event_point_name.startsWith('TS') && event_point_name.endsWith('IN')) {
        visitorInCount += 1;
        visitorOutCount -= 1; // decrement OUT for same pin
      }

      // Check for visitor OUT logic
      if (pin.startsWith('8') && event_point_name.startsWith('TS') && event_point_name.endsWith('OUT')) {
        visitorOutCount += 1;
      } else if (pinMap.has(pin) && event_point_name.startsWith('TS') && event_point_name.endsWith('OUT')) {
        visitorOutCount += 1;
        visitorInCount -= 1; // decrement IN for same pin
      }

      // Track pins to check for duplicates
      pinMap.set(pin, (pinMap.get(pin) || 0) + 1);
    });
  } else {
    // If no date parameter is provided, you might want to fetch all transactions
    const transactions = await prisma.acc_transaction.findMany();
    // (You can repeat the counting logic here if you want to count for all dates)
  }

  return NextResponse.json({ visitorInCount, visitorOutCount });
}
