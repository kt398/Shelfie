import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

// Auth responses must never be cached; Route Handler GET defaults to
// dynamic caching in this Next.js version, so no extra config is needed here.
export const { GET, POST } = toNextJsHandler(auth);
