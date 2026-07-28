function t(path) {
  return path.split('.').reduce((acc, key) => acc?.[key], i18n[state?.locale || 'en']) ?? path;
}

function escapeHtml(value) {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function slugify(value) {
  return value.trim().toLowerCase().normalize('NFKD').replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
}

function titleCase(value) {
  return value.toLowerCase().replace(/\b\w/g, (s) => s.toUpperCase());
}

function copyText(value) {
  navigator.clipboard.writeText(value ?? '');
}

function downloadText(filename, content) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function parseCsv(text) {
  const rows = text.trim().split(/\r?\n/).map((line) => line.split(','));
  if (!rows.length || !rows[0]?.length) return [];
  const headers = rows[0].map((item) => item.trim());
  return rows.slice(1).filter((row) => row.some((cell) => cell.trim() !== '')).map((row) => {
    const obj = {};
    headers.forEach((header, index) => { obj[header || `col${index + 1}`] = (row[index] ?? '').trim(); });
    return obj;
  });
}

function toCsv(jsonText) {
  const data = JSON.parse(jsonText);
  if (!Array.isArray(data) || !data.length) return '';
  const headers = Array.from(data.reduce((set, item) => { Object.keys(item || {}).forEach((key) => set.add(key)); return set; }, new Set()));
  const lines = [headers.join(',')];
  data.forEach((item) => {
    lines.push(headers.map((key) => {
      const text = String(item?.[key] ?? '').replace(/"/g, '""');
      return /[",\n]/.test(text) ? `"${text}"` : text;
    }).join(','));
  });
  return lines.join('\n');
}

function parseColor(input) {
  const value = input.trim();
  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value)) {
    let hex = value.slice(1);
    if (hex.length === 3) hex = hex.split('').map((c) => c + c).join('');
    const int = parseInt(hex, 16);
    return { r: (int >> 16) & 255, g: (int >> 8) & 255, b: int & 255 };
  }
  const rgb = value.match(/^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/i);
  return rgb ? { r: Number(rgb[1]), g: Number(rgb[2]), b: Number(rgb[3]) } : null;
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map((num) => Math.max(0, Math.min(255, num)).toString(16).padStart(2, '0')).join('').toUpperCase();
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      default: h = (r - g) / d + 4;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToRgb(h, s, l) {
  s /= 100; l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return { r: Math.round((r + m) * 255), g: Math.round((g + m) * 255), b: Math.round((b + m) * 255) };
}

function frequencyMap(text) {
  const words = text.toLowerCase().match(/[\p{L}\p{N}]{2,}/gu) || [];
  const stopwords = new Set(['the', 'and', 'for', 'with', 'this', 'that', 'from', 'you', 'your', 'are', 'was', 'have', 'has', 'not', 'but', 'www', 'http', 'https']);
  const map = new Map();
  words.forEach((word) => { if (!stopwords.has(word)) map.set(word, (map.get(word) || 0) + 1); });
  return [...map.entries()].sort((a, b) => b[1] - a[1]);
}

function createUuid() {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function basicMarkdownToHtml(text) {
  return escapeHtml(text)
    .replace(/^### (.*)$/gm, '<h3>$1</h3>')
    .replace(/^## (.*)$/gm, '<h2>$1</h2>')
    .replace(/^# (.*)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/^[-*] (.*)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<h|<u|<li|<\/ul)(.+)$/gm, '<p>$1</p>');
}

function stripHtml(text) {
  return text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function generateQrCode(text) {
  if (!text.trim()) return '';
  return new Promise((resolve) => {
    QRCode.toDataURL(text, { width: 200, margin: 2 }, (err, url) => {
      resolve(err ? '' : url);
    });
  });
}