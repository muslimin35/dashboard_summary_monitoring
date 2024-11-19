import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  // Extracting the date parameter from the query string
  const url = new URL(req.url);
  const dateParam = url.searchParams.get("date");

  let visitorInCount = 0;
  let visitorOutCount = 0;
  const pinMap = new Map<string, number>();

  // If a date parameter is provided, validate it
  if (dateParam) {
    const filterDate = new Date(dateParam);

    // Check if the date is valid
    if (isNaN(filterDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      );
    }


    const transactions = await prisma.acc_transaction.findMany({
      where: {
      },
    });

    transactions.forEach((transaction) => {
      const { pin, reader_name, event_name } = transaction;
      function isValidPin(pin: string | null, pinMap: Map<string, number>): boolean {
        return pin !== null && pinMap.has(pin);
      }      
      // Check for visitor IN logic
      if (
        pin.startsWith("8") &&
        reader_name.startsWith("TS") &&
        reader_name.endsWith("IN") &&
        reader_name != "" && event_name == 'acc_newEventNo_222'
      ) {
        visitorInCount += 1;
        if (isValidPin(pin, pinMap)) {
          // If the same PIN is used for IN and OUT, reduce IN count
          visitorOutCount -= 1;
        }
      }

      // Check for visitor OUT logic
      // Employee OUT
      if (
        reader_name.startsWith("TS") &&
        reader_name.endsWith("OUT") &&
        reader_name !== "" &&
        event_name === "acc_newEventNo_222"
      ) {
        if (pin.startsWith("8")) {
          // Normal OUT logic
          visitorOutCount += 1;
          if (isValidPin(pin, pinMap)) {
            // If the same PIN is used for IN and OUT, reduce IN count
            visitorInCount -= 1;
          }
        }
      }

      // Vehicle IN
      if (
        pin.startsWith("8") &&
        reader_name.startsWith("BG") &&
        reader_name.endsWith("IN") &&
        reader_name != "" && event_name == 'acc_newEventNo_222'
      ) {
        visitorInCount += 1; // Count as employee IN
        if (isValidPin(pin, pinMap)) {
          // If the same PIN is used for IN and OUT, reduce IN count
          visitorOutCount -= 1;
        }
      }

      // Vehicle OUT
      if (
        reader_name.startsWith("BG") &&
        reader_name.endsWith("OUT") &&
        reader_name !== "" &&
        event_name === "acc_newEventNo_222"
      ) {
        if (pin.startsWith("8")) {
          // Normal OUT logic
          visitorOutCount += 1;
          if (isValidPin(pin, pinMap)) {
            // If the same PIN is used for IN and OUT, reduce IN count
            visitorInCount -= 1;
          }
        }
      }

      // Track pins to check for duplicates
      pinMap.set(pin, (pinMap.get(pin) || 0) + 1);
    });
  }

  // Ensure counts are not negative
  const safeVisitorInCount = Math.max(visitorInCount, 0);
  const safeVisitorOutCount = Math.max(visitorOutCount, 0);

  return NextResponse.json({ visitorInCount: safeVisitorInCount, visitorOutCount: safeVisitorOutCount });

}
