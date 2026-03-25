// Cloudflare Worker — Groq API Proxy
// Deploy this at: https://dash.cloudflare.com → Workers & Pages → Create Worker
// Then add GROQ_API_KEY as an Environment Variable (encrypted) in the Worker settings.

export default {
  async fetch(request, env) {
    const allowedOrigins = [
      'https://saltbatchcalculator.org',
      'https://gregorymllr1.github.io',
    ];
    const origin = request.headers.get('Origin');
    const isAllowed = allowedOrigins.includes(origin);

    // CORS preflight
    if (request.method === 'OPTIONS') {
      if (isAllowed) {
        return new Response(null, {
          headers: {
            'Access-Control-Allow-Origin': origin,
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '86400',
          },
        });
      }
      return new Response('Forbidden', { status: 403 });
    }

    // Block anything not POST from an allowed origin
    if (request.method !== 'POST' || !isAllowed) {
      return new Response('Forbidden', { status: 403 });
    }

    // Forward to Groq with the secret key
    const body = await request.text();
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body,
    });

    const data = await groqResponse.text();
    return new Response(data, {
      status: groqResponse.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': origin,
      },
    });
  },
};
