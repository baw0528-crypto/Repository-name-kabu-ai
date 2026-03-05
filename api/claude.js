export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-api-key, anthropic-version');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();
  
  try {
    const apiKey = req.headers['x-api-key'];
    const body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    
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
    res.status(200).json(data);
  } catch(e) {
    res.status(500).json({error: e.message});
  }
}
