import * as z from "zod";
import { LibraryStatus } from "@prisma/client";

const statusValues = Object.values(LibraryStatus) as [string, ...string[]];

export const updateStatusSchema = z.object({
  status: z.enum(statusValues),
});

export const updateEntrySchema = z.object({
  status: z.enum(statusValues),
  rating: z.preprocess(
    (v) => (v === "" || v == null ? null : Number(v)),
    z.number().int().min(1).max(5).nullable()
  ),
  dateStarted: z.preprocess((v) => (v === "" || v == null ? null : v), z.string().nullable()),
  dateFinished: z.preprocess((v) => (v === "" || v == null ? null : v), z.string().nullable()),
  comment: z.preprocess((v) => (v === "" || v == null ? null : v), z.string().trim().nullable()),
});
