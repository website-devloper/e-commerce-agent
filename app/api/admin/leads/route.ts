import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifyAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";

const LEAD_STATUSES = ["new", "contacted", "qualified", "converted", "lost"] as const;

const PatchBody = z.object({
  id: z.number().int().positive(),
  status: z.enum(LEAD_STATUSES),
});

export async function PATCH(req: NextRequest) {
  if (!(await verifyAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: z.infer<typeof PatchBody>;
  try {
    body = PatchBody.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  await prisma.lead.update({
    where: { id: body.id },
    data: { status: body.status },
  });

  return NextResponse.json({ ok: true });
}
