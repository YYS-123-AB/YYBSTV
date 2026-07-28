const state = { locale: 'en', category: 'all', query: '', activeToolId: 'wordCounter' };
const categoryOrder = ['all', 'featured', 'text', 'code', 'color', 'math', 'date', 'web', 'convert'];

function bindEvents() {
  document.getElementById('localeSelect')?.addEventListener('change', (e) => {
    state.locale = e.target.value;
    render();
  });

  document.getElementById('searchInput')?.addEventListener('input', (e) => {
    state.query = e.target.value.trim();
    render();
  });

  document.querySelectorAll('.chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      state.category = chip.dataset.category;
      render();
    });
  });

  document.querySelectorAll('.tool-card').forEach((card) => {
    card.addEventListener('click', () => {
      state.activeToolId = card.dataset.tool;
      render();
    });
  });

  const s = initToolState(state.activeToolId);
  document.querySelectorAll('[data-bind]').forEach((el) => {
    const key = el.dataset.bind;
    if (el.type === 'checkbox') {
      el.checked = s[key] === 'true';
    } else {
      el.value = s[key] ?? '';
    }

    el.addEventListener('input', () => {
      if (el.type === 'checkbox') {
        s[key] = el.checked ? 'true' : 'false';
      } else {
        s[key] = el.value;
      }
      updateToolResult();
    });
  });

  document.querySelectorAll('[data-action]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const s = initToolState(state.activeToolId);
      const action = btn.dataset.action;
      const value = btn.dataset.value;
      s[action] = value;

      document.querySelectorAll(`[data-action="${action}"]`).forEach((b) => {
        b.classList.remove('active');
      });
      btn.classList.add('active');

      updateToolResult();
    });
  });

  document.getElementById('copyBtn')?.addEventListener('click', () => {
    const resultEl = document.getElementById('toolResult');
    if (resultEl) {
      const text = resultEl.textContent || (resultEl.querySelector('img')?.src || '');
      copyText(text);
    }
  });

  document.getElementById('downloadBtn')?.addEventListener('click', () => {
    const resultEl = document.getElementById('toolResult');
    if (resultEl) {
      downloadText(`result-${state.activeToolId}.txt`, resultEl.textContent || '');
    }
  });

  document.getElementById('clearBtn')?.addEventListener('click', () => {
    const s = initToolState(state.activeToolId);
    Object.keys(s).forEach((key) => {
      if (typeof s[key] === 'string') s[key] = '';
    });
    render();
  });

  document.getElementById('imageInput')?.addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const resultEl = document.getElementById('toolResult');
      if (resultEl) resultEl.textContent = ev.target?.result || '';
    };
    reader.readAsDataURL(file);
  });

  const colorSwatch = document.getElementById('colorSwatch');
  if (colorSwatch) {
    const rgb = parseColor(s.input || '#6ea8fe');
    colorSwatch.style.background = rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : '#ffffff';
  }

  document.querySelectorAll('[data-action]').forEach((btn) => {
    const action = btn.dataset.action;
    const value = btn.dataset.value;
    if (s[action] === value) {
      btn.classList.add('active');
    }
  });
}

async function updateToolResult() {
  const resultEl = document.getElementById('toolResult');
  if (!resultEl) return;

  const s = initToolState(state.activeToolId);
  if (!s.input && !s.height && !s.weight && !s.birthDate && !s.min && !s.max) {
    resultEl.textContent = t('labels.input') + ' ' + t('labels.result').toLowerCase() + '...';
    return;
  }

  const result = runTool(state.activeToolId);
  if (result instanceof Promise) {
    resultEl.textContent = 'Processing...';
    const resolved = await result;
    if (resolved.startsWith('data:image')) {
      resultEl.innerHTML = `<img src="${resolved}" alt="QR Code" />`;
    } else {
      resultEl.textContent = resolved;
    }
  } else if (result.startsWith('data:image')) {
    resultEl.innerHTML = `<img src="${result}" alt="QR Code" />`;
  } else if (state.activeToolId === 'markdownPreview') {
    resultEl.innerHTML = result;
  } else {
    resultEl.textContent = result;
  }
}

document.addEventListener('DOMContentLoaded', render);