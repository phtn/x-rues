import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { ctx } from "@/trpc/init";
import { merged } from "@/server/routers";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: merged,
    createContext: ctx,
  });
export { handler as GET, handler as POST };
