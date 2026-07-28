const toolDefinitions = [
  { id: 'wordCounter', category: 'text', featured: true, keywords: ['count', 'words', 'text'] },
  { id: 'caseConverter', category: 'text', featured: true, keywords: ['case', 'slug', 'title'] },
  { id: 'removeDuplicates', category: 'text', featured: false, keywords: ['duplicate', 'lines', 'text'] },
  { id: 'sortLines', category: 'text', featured: false, keywords: ['sort', 'lines', 'text'] },
  { id: 'findReplace', category: 'text', featured: true, keywords: ['find', 'replace', 'text'] },
  { id: 'jsonFormatter', category: 'code', featured: true, keywords: ['json', 'format', 'validate'] },
  { id: 'base64Encoder', category: 'code', featured: true, keywords: ['base64', 'encode', 'decode'] },
  { id: 'urlEncoder', category: 'code', featured: false, keywords: ['url', 'encode', 'decode'] },
  { id: 'hashGenerator', category: 'code', featured: true, keywords: ['sha256', 'hash', 'crypto'] },
  { id: 'regexTester', category: 'code', featured: false, keywords: ['regex', 'pattern', 'test'] },
  { id: 'markdownPreview', category: 'code', featured: true, keywords: ['markdown', 'preview', 'html'] },
  { id: 'htmlEscape', category: 'code', featured: false, keywords: ['html', 'escape', 'entities'] },
  { id: 'colorConverter', category: 'color', featured: true, keywords: ['hex', 'rgb', 'hsl'] },
  { id: 'gradientMaker', category: 'color', featured: true, keywords: ['gradient', 'css', 'color'] },
  { id: 'paletteGenerator', category: 'color', featured: false, keywords: ['palette', 'color', 'theme'] },
  { id: 'bmiCalculator', category: 'math', featured: false, keywords: ['bmi', 'health', 'weight'] },
  { id: 'percentageCalc', category: 'math', featured: true, keywords: ['percentage', 'ratio', 'math'] },
  { id: 'randomNumber', category: 'math', featured: false, keywords: ['random', 'number', 'generator'] },
  { id: 'ageCalculator', category: 'date', featured: false, keywords: ['age', 'birthday', 'date'] },
  { id: 'unixConverter', category: 'date', featured: true, keywords: ['unix', 'timestamp', 'date'] },
  { id: 'timezoneConverter', category: 'date', featured: true, keywords: ['timezone', 'utc', 'date'] },
  { id: 'uuidGenerator', category: 'web', featured: false, keywords: ['uuid', 'id', 'random'] },
  { id: 'qrGenerator', category: 'web', featured: true, keywords: ['qr', 'code', 'url'] },
  { id: 'passwordGenerator', category: 'web', featured: true, keywords: ['password', 'secure', 'random'] },
  { id: 'loremIpsum', category: 'text', featured: false, keywords: ['lorem', 'placeholder', 'text'] },
  { id: 'textReverser', category: 'text', featured: false, keywords: ['reverse', 'text'] },
  { id: 'lineCounter', category: 'text', featured: false, keywords: ['lines', 'count', 'text'] },
  { id: 'csvToJson', category: 'convert', featured: true, keywords: ['csv', 'json', 'convert'] },
  { id: 'jsonToCsv', category: 'convert', featured: true, keywords: ['json', 'csv', 'convert'] },
  { id: 'numberBase', category: 'convert', featured: false, keywords: ['binary', 'hex', 'decimal'] },
  { id: 'cronHelper', category: 'web', featured: false, keywords: ['cron', 'schedule'] },
  { id: 'unitConverter', category: 'convert', featured: false, keywords: ['unit', 'length', 'convert'] },
  { id: 'imageToBase64', category: 'convert', featured: true, keywords: ['image', 'base64', 'upload'] },
  { id: 'textToList', category: 'convert', featured: false, keywords: ['list', 'markdown', 'json'] },
  { id: 'duplicateChecker', category: 'text', featured: false, keywords: ['duplicate', 'checker', 'lines'] },
  { id: 'keywordExtractor', category: 'text', featured: false, keywords: ['keyword', 'extract', 'seo'] },
  { id: 'readingTime', category: 'text', featured: false, keywords: ['reading', 'time', 'article'] },
  { id: 'htmlStripper', category: 'web', featured: false, keywords: ['html', 'strip', 'text'] }
];

const toolStates = {};

function initToolState(toolId) {
  if (!toolStates[toolId]) {
    toolStates[toolId] = {
      input: '', input2: '', input3: '', mode: 'encode', sortOrder: 'asc', format: 'json',
      min: '0', max: '100', count: '5', length: '16', height: '', weight: '', birthDate: '',
      color1: '#6ea8fe', color2: '#8b5cf6', fromUnit: 'm', toUnit: 'cm'
    };
  }
  return toolStates[toolId];
}

function runTool(toolId) {
  const s = initToolState(toolId);
  const input = s.input || '';

  switch (toolId) {
    case 'wordCounter': {
      const words = input.match(/[\p{L}\p{N}]+/gu)?.length || 0;
      const chars = input.length;
      const lines = input.split(/\r?\n/).length;
      const nonEmpty = input.split(/\r?\n/).filter((l) => l.trim()).length;
      const readTime = Math.max(1, Math.round(words / 200));
      return `Words: ${words}\nCharacters: ${chars}\nLines: ${lines}\nNon-empty lines: ${nonEmpty}\nReading time: ~${readTime} min`;
    }
    case 'caseConverter': {
      if (s.mode === 'upper') return input.toUpperCase();
      if (s.mode === 'lower') return input.toLowerCase();
      if (s.mode === 'title') return input.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
      return slugify(input);
    }
    case 'removeDuplicates': {
      const seen = new Set();
      return input.split(/\r?\n/).filter((line) => {
        const trimmed = line.trim();
        if (!trimmed || seen.has(trimmed)) return false;
        seen.add(trimmed);
        return true;
      }).join('\n');
    }
    case 'sortLines': {
      return input.split(/\r?\n/).sort((a, b) => s.sortOrder === 'asc' ? a.localeCompare(b) : b.localeCompare(a)).join('\n');
    }
    case 'findReplace': {
      return input.replace(new RegExp(s.input2 || '', 'g'), s.input3 || '');
    }
    case 'jsonFormatter': {
      try {
        return JSON.stringify(JSON.parse(input), null, 2);
      } catch {
        return 'Invalid JSON';
      }
    }
    case 'base64Encoder': {
      if (s.mode === 'encode') return btoa(unescape(encodeURIComponent(input)));
      try {
        return decodeURIComponent(escape(atob(input)));
      } catch {
        return 'Invalid Base64';
      }
    }
    case 'urlEncoder': {
      if (s.mode === 'encode') return encodeURIComponent(input);
      try {
        return decodeURIComponent(input);
      } catch {
        return 'Invalid URL encoding';
      }
    }
    case 'hashGenerator': {
      const bytes = new TextEncoder().encode(input);
      return crypto.subtle.digest('SHA-256', bytes).then((hash) => {
        return [...new Uint8Array(hash)].map((b) => b.toString(16).padStart(2, '0')).join('');
      });
    }
    case 'regexTester': {
      try {
        const regex = new RegExp(s.input2 || '', s.input3 || 'g');
        const matches = input.match(regex);
        return matches ? matches.join('\n') : 'No matches';
      } catch {
        return 'Invalid regex';
      }
    }
    case 'markdownPreview': {
      return basicMarkdownToHtml(input);
    }
    case 'htmlEscape': {
      if (s.mode === 'encode') return escapeHtml(input);
      return input.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
    }
    case 'colorConverter': {
      const rgb = parseColor(input);
      if (!rgb) return 'Invalid color';
      const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      return `HEX: ${hex}\nRGB: rgb(${rgb.r}, ${rgb.g}, ${rgb.b})\nHSL: hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
    }
    case 'gradientMaker': {
      return `background: linear-gradient(135deg, ${s.color1}, ${s.color2});`;
    }
    case 'paletteGenerator': {
      const rgb = parseColor(input);
      if (!rgb) return 'Invalid color';
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      const colors = [];
      for (let i = 0; i <= 4; i++) {
        const l = Math.min(95, Math.max(10, hsl.l - 20 + i * 10));
        const c = hslToRgb(hsl.h, hsl.s, l);
        colors.push(rgbToHex(c.r, c.g, c.b));
      }
      return colors.join('\n');
    }
    case 'bmiCalculator': {
      const h = parseFloat(s.height);
      const w = parseFloat(s.weight);
      if (!h || !w) return 'Enter height and weight';
      const bmi = w / ((h / 100) ** 2);
      return `BMI: ${bmi.toFixed(1)}`;
    }
    case 'percentageCalc': {
      const num = parseFloat(input);
      const percent = parseFloat(s.input2);
      if (!num || !percent) return 'Enter values';
      return `${percent}% of ${num} = ${(num * percent / 100).toFixed(2)}`;
    }
    case 'randomNumber': {
      const min = parseInt(s.min) || 0;
      const max = parseInt(s.max) || 100;
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    case 'ageCalculator': {
      if (!s.birthDate) return 'Enter birth date';
      const birth = new Date(s.birthDate);
      const now = new Date();
      let age = now.getFullYear() - birth.getFullYear();
      if (now.getMonth() < birth.getMonth() || (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate())) age--;
      return `Age: ${Math.max(0, age)}`;
    }
    case 'unixConverter': {
      if (input.match(/^\d+$/)) {
        return new Date(parseInt(input) * 1000).toString();
      }
      return Math.floor(new Date(input).getTime() / 1000).toString();
    }
    case 'timezoneConverter': {
      const date = new Date(input || Date.now());
      return [
        `UTC: ${date.toISOString()}`,
        `Local: ${date.toString()}`,
        `America/New_York: ${date.toLocaleString('en-US', { timeZone: 'America/New_York' })}`,
        `Asia/Tokyo: ${date.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}`,
        `Asia/Shanghai: ${date.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}`
      ].join('\n');
    }
    case 'uuidGenerator': {
      return Array.from({ length: parseInt(s.count) || 5 }, createUuid).join('\n');
    }
    case 'qrGenerator': {
      return generateQrCode(input);
    }
    case 'passwordGenerator': {
      const len = parseInt(s.length) || 16;
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
      return Array.from(crypto.getRandomValues(new Uint8Array(len))).map((b) => chars[b % chars.length]).join('');
    }
    case 'loremIpsum': {
      const words = ['Lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua'];
      const paras = parseInt(s.count) || 3;
      return Array.from({ length: paras }, () => {
        return Array.from({ length: 15 + Math.floor(Math.random() * 20) }, () => words[Math.floor(Math.random() * words.length)]).join(' ') + '.';
      }).join('\n\n');
    }
    case 'textReverser': {
      return input.split('').reverse().join('');
    }
    case 'lineCounter': {
      const lines = input.split(/\r?\n/);
      return `Total lines: ${lines.length}\nNon-empty lines: ${lines.filter((l) => l.trim()).length}`;
    }
    case 'csvToJson': {
      try {
        return JSON.stringify(parseCsv(input), null, 2);
      } catch {
        return 'Invalid CSV';
      }
    }
    case 'jsonToCsv': {
      try {
        return toCsv(input);
      } catch {
        return 'Invalid JSON array';
      }
    }
    case 'numberBase': {
      const num = parseInt(input);
      if (!num && input !== '0') return 'Enter a number';
      return `Binary: ${num.toString(2)}\nOctal: ${num.toString(8)}\nDecimal: ${num}\nHex: ${num.toString(16).toUpperCase()}`;
    }
    case 'cronHelper': {
      const parts = input.trim().split(/\s+/);
      if (parts.length !== 5) return 'Invalid cron format';
      const [min, hour, day, month, dow] = parts;
      let desc = [];
      if (min === '*') desc.push(t('cronMap.everyMinute'));
      else desc.push(`at minute ${min}`);
      if (hour === '*') desc.push(t('cronMap.everyHour'));
      else desc.push(`at hour ${hour}`);
      if (day === '*') desc.push(t('cronMap.everyDay'));
      else desc.push(`on day ${day}`);
      return desc.join(' ');
    }
    case 'unitConverter': {
      const num = parseFloat(input);
      if (!num && input !== '0') return 'Enter a number';
      const rates = { m: 1, cm: 100, mm: 1000, km: 0.001, in: 39.37, ft: 3.281, yd: 1.094, mi: 0.000621 };
      return `${num} ${s.fromUnit} = ${(num * rates[s.toUnit] / rates[s.fromUnit]).toFixed(4)} ${s.toUnit}`;
    }
    case 'imageToBase64': {
      return 'Use the upload button to select an image';
    }
    case 'textToList': {
      const lines = input.split(/\r?\n/).filter((l) => l.trim());
      if (s.format === 'html') return `<ul>\n${lines.map((l) => `  <li>${escapeHtml(l)}</li>`).join('\n')}\n</ul>`;
      if (s.format === 'markdown') return lines.map((l) => `- ${l}`).join('\n');
      return JSON.stringify(lines);
    }
    case 'duplicateChecker': {
      const counts = new Map();
      input.split(/\r?\n/).forEach((line) => {
        const trimmed = line.trim();
        if (trimmed) counts.set(trimmed, (counts.get(trimmed) || 0) + 1);
      });
      return [...counts.entries()].filter(([, count]) => count > 1).map(([line, count]) => `${line} (${count} times)`).join('\n') || 'No duplicates';
    }
    case 'keywordExtractor': {
      return frequencyMap(input).slice(0, 10).map(([word, count]) => `${word}: ${count}`).join('\n');
    }
    case 'readingTime': {
      const words = input.match(/[\p{L}\p{N}]+/gu)?.length || 0;
      const minutes = Math.max(1, Math.round(words / 200));
      const seconds = Math.round((words % 200) / 3.33);
      return `${minutes} min ${seconds} sec (${words} words)`;
    }
    case 'htmlStripper': {
      return stripHtml(input);
    }
    default:
      return 'Tool not found';
  }
}