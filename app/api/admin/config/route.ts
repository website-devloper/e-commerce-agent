import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifyAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";

const ConfigBody = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  servicesJson: z.string(),
  hoursJson: z.string(),
  location: z.string().min(1),
  languages: z.string(),
  faqJson: z.string(),
  handoffEmail: z.string().email(),
});

export async function POST(req: NextRequest) {
  if (!(await verifyAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = ConfigBody.parse(await req.json());
  const existing = await prisma.businessConfig.findFirst({ orderBy: { id: "desc" } });

  if (existing) {
    await prisma.businessConfig.update({ where: { id: existing.id }, data: body });
  } else {
    await prisma.businessConfig.create({ data: body });
  }

  return NextResponse.json({ ok: true });
}
