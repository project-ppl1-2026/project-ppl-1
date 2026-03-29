import { toNextJsHandler } from "better-auth/next-js";

import { auth } from "@/lib/auth";

// Exposes Better Auth endpoints under /api/auth for client sign-in requests.
export const { GET, POST } = toNextJsHandler(auth);
