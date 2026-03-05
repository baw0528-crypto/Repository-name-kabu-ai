export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Credentials', 'false');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();
  
  const apiKey = req.headers['x-api-key'];
  const body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
  
  for (let i = 0; i < 5; i++) {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: body
    });
    const data = await r.json();
    if (data.error?.type === 'rate_limit_error') {
      await new Promise(r => setTimeout(r, 30000));
      continue;
    }
    return res.status(200).json(data);
  }
  res.status(429).json({error: {message: 'レート制限。しばらく待ってから再試行してください。'}});
}
