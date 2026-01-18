// Shared CORS configuration for Edge Functions
// Restricts origins to approved domains only

const allowedOrigins = [
  'https://clovely.lovable.app',
  'https://id-preview--7da6f1be-4cda-4487-ac31-c249046a47bd.lovable.app',
  'http://localhost:5173',
  'http://localhost:3000',
];

export function getCorsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get('origin') || '';
  const allowedOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
  
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Credentials': 'true',
  };
}

// Handle preflight requests
export function handleCorsPreflightRequest(req: Request): Response | null {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: getCorsHeaders(req) });
  }
  return null;
}

// Helper to create JSON response with CORS headers
export function jsonResponse(
  data: unknown,
  req: Request,
  status = 200
): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...getCorsHeaders(req),
      'Content-Type': 'application/json',
    },
  });
}

// Helper to create error response
export function errorResponse(
  message: string,
  req: Request,
  status = 400
): Response {
  return jsonResponse({ error: message }, req, status);
}

// Input validation helpers
export function validatePayloadSize(bodyText: string, maxBytes = 100000): boolean {
  return bodyText.length <= maxBytes;
}

// Sanitize nested objects for AI API calls
export function sanitizeForAI(obj: unknown, maxDepth = 3, currentDepth = 0): unknown {
  if (currentDepth >= maxDepth) return '[nested object]';
  if (typeof obj === 'string') return obj.slice(0, 2000);
  if (Array.isArray(obj)) {
    return obj.slice(0, 20).map(item => sanitizeForAI(item, maxDepth, currentDepth + 1));
  }
  if (typeof obj === 'object' && obj !== null) {
    const sanitized: Record<string, unknown> = {};
    const entries = Object.entries(obj).slice(0, 30);
    for (const [key, value] of entries) {
      sanitized[key] = sanitizeForAI(value, maxDepth, currentDepth + 1);
    }
    return sanitized;
  }
  return obj;
}
