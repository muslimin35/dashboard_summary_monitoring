import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const url = new URL(req.url);
  const dateParam = url.searchParams.get("date");

  let employeeInCount = 0;
  let employeeOutCount = 0;
  const pinMap = new Map<string, number>();

  if (dateParam) {
    const filterDate = new Date(dateParam);

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
      // Employee IN
      if (
        !pin.startsWith("8") &&
        reader_name.startsWith("TS") &&
        reader_name.endsWith("IN") &&
        reader_name != "" && event_name == 'acc_newEventNo_222'
      ) {
        employeeInCount += 1;
        if (isValidPin(pin, pinMap)) {
          // If the same PIN is used for IN and OUT, reduce IN count
          employeeOutCount -= 1;
        }
      }

      // Employee OUT
      if (
        reader_name.startsWith("TS") &&
        reader_name.endsWith("OUT") &&
        reader_name !== "" &&
        event_name === "acc_newEventNo_222"
      ) {
        if (!pin.startsWith("8")) {
          // Normal OUT logic
          employeeOutCount += 1;
          if (isValidPin(pin, pinMap)) {
            // If the same PIN is used for IN and OUT, reduce IN count
            employeeInCount -= 1;
          }
        }
      }

      // Vehicle IN
      if (
        !pin.startsWith("8") &&
        reader_name.startsWith("BG") &&
        reader_name.endsWith("IN") &&
        reader_name != "" && event_name == 'acc_newEventNo_222'
      ) {
        employeeInCount += 1; // Count as employee IN
        if (isValidPin(pin, pinMap)) {
          // If the same PIN is used for IN and OUT, reduce IN count
          employeeOutCount -= 1;
        }
      }

      // Vehicle OUT
      if (
        reader_name.startsWith("BG") &&
        reader_name.endsWith("OUT") &&
        reader_name !== "" &&
        event_name === "acc_newEventNo_222"
      ) {
        if (!pin.startsWith("8")) {
          // Normal OUT logic
          employeeOutCount += 1;
          if (isValidPin(pin, pinMap)) {
            // If the same PIN is used for IN and OUT, reduce IN count
            employeeInCount -= 1;
          }
        }
      }

      pinMap.set(pin, (pinMap.get(pin) || 0) + 1);
    });
  }

  return NextResponse.json({ employeeInCount, employeeOutCount });
}
