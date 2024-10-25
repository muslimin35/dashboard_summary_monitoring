import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const employees = await prisma.employee.findMany();
  return NextResponse.json(employees);
}

export async function POST(req: Request) {
  const { name, position } = await req.json();
  const newEmployee = await prisma.employee.create({
    data: { name, position },
  });
  return NextResponse.json(newEmployee, { status: 201 });
}
