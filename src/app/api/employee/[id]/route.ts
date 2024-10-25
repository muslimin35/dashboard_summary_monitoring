import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const employee = await prisma.employee.findUnique({
    where: { id },
  });

  if (!employee) {
    return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
  }

  return NextResponse.json(employee);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  await prisma.employee.delete({
    where: { id },
  });

  return NextResponse.json({ message: 'Employee deleted' }, { status: 204 });
}
