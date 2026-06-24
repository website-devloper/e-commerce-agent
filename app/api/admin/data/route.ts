import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  if (!(await verifyAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [leads, orders, conversations, config, profiles] = await Promise.all([
    prisma.lead.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.order.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.conversation.findMany({ orderBy: { updatedAt: "desc" }, take: 100 }),
    prisma.businessConfig.findFirst({ orderBy: { id: "desc" } }),
    prisma.userProfile.findMany({ orderBy: { updatedAt: "desc" } }),
  ]);

  return NextResponse.json({ leads, orders, conversations, config, profiles });
}
