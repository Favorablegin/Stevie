export default function handler(req, res) {
  const names = Object.keys(process.env).filter(k => k.startsWith('VERCEL') || k === 'NODE_VERSION').sort();
  res.status(200).json({ names, hasProjectId: !!process.env.VERCEL_PROJECT_ID, node: process.version });
}
