import { prisma } from "@/lib/db";
import type { Tag } from "@prisma/client";

export async function getUserTags(userId: string): Promise<Tag[]> {
  return prisma.tag.findMany({
    where: { userId },
    orderBy: { name: "asc" },
  });
}
