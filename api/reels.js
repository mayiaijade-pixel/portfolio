import { get, put } from '@vercel/blob';

export const config = {
  api: { bodyParser: { sizeLimit: '5mb' } }
};

async function readBlob() {
  try {
    const blob = await get('reels.json');
    if (!blob || !blob.url) return null;
    const res = await fetch(blob.url);
    if (!res.ok) return null;
    const json = await res.json();
    return Array.isArray(json) ? json : null;
  } catch (e) {
    return null;
  }
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const data = await readBlob();
    return res.status(200).json(data || []);
  }

  if (req.method === 'POST') {
    try {
      const data = req.body;
      if (!Array.isArray(data)) {
        return res.status(400).json({ error: 'payload must be array' });
      }

      await put('reels.json', JSON.stringify(data, null, 2), {
        contentType: 'application/json',
        access: 'public'
      });

      return res.status(200).json({ ok: true });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end('Method not allowed');
}

