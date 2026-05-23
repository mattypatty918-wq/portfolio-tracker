// Production Middleware

export async function withErrorHandling(handler: (req: Request) => Promise<Response>) {
  return async (req: Request): Promise<Response> => {
    try {
      return await handler(req);
    } catch (error: any) {
      console.error('Route error:', error);
      return Response.json(
        { error: 'Internal server error', message: error.message },
        { status: 500 }
      );
    }
  };
}

export async function withRateLimit(handler: (req: Request) => Promise<Response>, limit: number = 100) {
  const requests = new Map<string, number[]>();
  
  return async (req: Request): Promise<Response> => {
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    const now = Date.now();
    const windowMs = 60000; // 1 minute
    
    if (!requests.has(ip)) {
      requests.set(ip, []);
    }
    
    const times = requests.get(ip)!.filter(t => now - t < windowMs);
    
    if (times.length >= limit) {
      return Response.json(
        { error: 'Rate limit exceeded' },
        { status: 429, headers: { 'Retry-After': '60' } }
      );
    }
    
    times.push(now);
    requests.set(ip, times);
    
    return await handler(req);
  };
}

export async function withAuthentication(handler: (req: Request) => Promise<Response>) {
  return async (req: Request): Promise<Response> => {
    const authHeader = req.headers.get('authorization');
    
    if (!authHeader?.startsWith('Bearer ')) {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const token = authHeader.substring(7);
    // TODO: Validate JWT token
    
    return await handler(req);
  };
}

export async function withCORS(handler: (req: Request) => Promise<Response>) {
  return async (req: Request): Promise<Response> => {
    const response = await handler(req);
    
    const headers = new Headers(response.headers);
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    return new Response(response.body, { ...response, headers });
  };
}

export async function withLogging(handler: (req: Request) => Promise<Response>) {
  return async (req: Request): Promise<Response> => {
    const start = Date.now();
    const response = await handler(req);
    const duration = Date.now() - start;
    
    console.log(`${req.method} ${new URL(req.url).pathname} - ${response.status} (${duration}ms)`);
    
    return response;
  };
}

// Compose middleware
export function compose(...middlewares: any[]) {
  return (handler: (req: Request) => Promise<Response>) => {
    return middlewares.reduceRight((acc, middleware) => {
      return (req: Request) => middleware((r: Request) => acc(r))(req);
    }, handler);
  };
}
