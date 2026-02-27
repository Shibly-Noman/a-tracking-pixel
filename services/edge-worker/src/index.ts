import { handleRequest } from './handler';
import { Env } from './config';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    return handleRequest(request, env);
  },
};
