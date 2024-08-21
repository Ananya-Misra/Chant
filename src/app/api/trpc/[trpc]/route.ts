import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '@/trpc'
function handler(req: Request) {
  console.log('API request received:', req.url);
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => {
      console.log('Creating context');
      return {};
    },
  });
}
export { handler as GET, handler as POST };