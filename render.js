function renderHeader() {
  return `
    <header class="topbar">
      <div class="brand">
        <div class="logo">T</div>
        <div class="brand-copy">
          <h1>${t('siteName')}</h1>
          <p>${t('tagline')}</p>
        </div>
      </div>
      <div class="controls">
        <input type="search" class="search" placeholder="${t('searchPlaceholder')}" id="searchInput" />
        <select class="select" id="localeSelect">
          <option value="en" ${state.locale === 'en' ? 'selected' : ''}>English</option>
          <option value="zh-Hant" ${state.locale === 'zh-Hant' ? 'selected' : ''}>繁體中文</option>
          <option value="ja" ${state.locale === 'ja' ? 'selected' : ''}>日本語</option>
        </select>
      </div>
    </header>
  `;
}

function renderHero() {
  return `
    <div class="hero">
      <div class="hero-main card">
        <h2>${t('headline')}</h2>
        <p>${t('subheadline')}</p>
      </div>
      <div class="hero-side card">
        <div class="stats">
          <div class="stat"><strong>${toolDefinitions.length}</strong><span>${t('toolsCount')}</span></div>
          <div class="stat"><strong>${Object.keys(i18n).length}</strong><span>${t('langsCount')}</span></div>
        </div>
      </div>
    </div>
  `;
}

function renderCategories() {
  return `
    <div class="categories">
      ${categoryOrder.map((cat) => `
        <button class="chip ${state.category === cat ? 'active' : ''}" data-category="${cat}">
          ${cat === 'all' ? t('allCategories') : cat === 'featured' ? t('featured') : t(`categories.${cat}`)}
        </button>
      `).join('')}
    </div>
  `;
}

function renderToolsGrid() {
  const filtered = toolDefinitions.filter((tool) => {
    if (state.category === 'featured') return tool.featured;
    if (state.category !== 'all' && tool.category !== state.category) return false;
    if (!state.query) return true;
    const q = state.query.toLowerCase();
    return tool.id.toLowerCase().includes(q) || tool.keywords.some((k) => k.includes(q));
  });

  return `
    <div class="tools-grid">
      ${filtered.map((tool) => `
        <div class="tool-card ${state.activeToolId === tool.id ? 'active' : ''}" data-tool="${tool.id}">
          <h3>${tool.id.replace(/([A-Z])/g, ' $1').trim()}</h3>
          <p>${t(`toolDescriptions.${tool.id}`)}</p>
          <div class="tool-meta">
            <span>${t(`categories.${tool.category}`)}</span>
            <button class="ghost-btn">${t('openTool')}</button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function renderToolPanel() {
  const tool = toolDefinitions.find((t) => t.id === state.activeToolId);
  if (!tool) return `<div class="card panel"><p>${t('noToolSelected')}</p></div>`;

  const s = initToolState(state.activeToolId);
  let body = '';

  switch (state.activeToolId) {
    case 'wordCounter':
    case 'textReverser':
    case 'lineCounter':
    case 'htmlStripper':
    case 'readingTime':
      body = `
        <textarea class="text-area" rows="8" placeholder="${t('labels.text')}" data-bind="input"></textarea>
        <div class="result-box" id="toolResult"></div>
      `;
      break;

    case 'caseConverter':
      body = `
        <textarea class="text-area" rows="6" placeholder="${t('labels.text')}" data-bind="input"></textarea>
        <div class="action-row">
          <button class="secondary-btn" data-action="mode" data-value="upper">${t('toolLabels.upper')}</button>
          <button class="secondary-btn" data-action="mode" data-value="lower">${t('toolLabels.lower')}</button>
          <button class="secondary-btn" data-action="mode" data-value="title">${t('toolLabels.title')}</button>
          <button class="secondary-btn" data-action="mode" data-value="slug">${t('toolLabels.slug')}</button>
        </div>
        <div class="result-box" id="toolResult"></div>
      `;
      break;

    case 'removeDuplicates':
    case 'sortLines':
      body = `
        <textarea class="text-area" rows="6" placeholder="${t('labels.text')}" data-bind="input"></textarea>
        ${state.activeToolId === 'sortLines' ? `
          <div class="action-row">
            <button class="secondary-btn" data-action="sortOrder" data-value="asc">${t('toolLabels.ascending')}</button>
            <button class="secondary-btn" data-action="sortOrder" data-value="desc">${t('toolLabels.descending')}</button>
          </div>
        ` : ''}
        <div class="result-box" id="toolResult"></div>
      `;
      break;

    case 'findReplace':
      body = `
        <textarea class="text-area" rows="4" placeholder="${t('labels.text')}" data-bind="input"></textarea>
        <div class="two-col">
          <input type="text" class="text-input" placeholder="${t('labels.keyword')}" data-bind="input2" />
          <input type="text" class="text-input" placeholder="${t('labels.replace')}" data-bind="input3" />
        </div>
        <div class="result-box" id="toolResult"></div>
      `;
      break;

    case 'jsonFormatter':
      body = `
        <textarea class="text-area" rows="6" placeholder="${t('labels.json')}" data-bind="input"></textarea>
        <div class="result-box" id="toolResult"></div>
      `;
      break;

    case 'base64Encoder':
    case 'urlEncoder':
    case 'htmlEscape':
      body = `
        <div class="action-row">
          <button class="secondary-btn" data-action="mode" data-value="encode">${t('toolLabels.modeEncode')}</button>
          <button class="secondary-btn" data-action="mode" data-value="decode">${t('toolLabels.modeDecode')}</button>
        </div>
        <textarea class="text-area" rows="4" placeholder="${t('labels.text')}" data-bind="input"></textarea>
        <div class="result-box" id="toolResult"></div>
      `;
      break;

    case 'hashGenerator':
      body = `
        <textarea class="text-area" rows="4" placeholder="${t('labels.text')}" data-bind="input"></textarea>
        <div class="result-box" id="toolResult"></div>
      `;
      break;

    case 'regexTester':
      body = `
        <textarea class="text-area" rows="4" placeholder="${t('labels.text')}" data-bind="input"></textarea>
        <div class="two-col">
          <input type="text" class="text-input" placeholder="${t('labels.pattern')}" data-bind="input2" />
          <input type="text" class="text-input" placeholder="${t('labels.flags')}" data-bind="input3" />
        </div>
        <div class="result-box" id="toolResult"></div>
      `;
      break;

    case 'markdownPreview':
      body = `
        <textarea class="text-area" rows="6" placeholder="${t('labels.markdown')}" data-bind="input"></textarea>
        <div class="preview-box" id="toolResult"></div>
      `;
      break;

    case 'colorConverter':
      body = `
        <div class="color-row">
          <input type="text" class="text-input" placeholder="${t('labels.color')}" data-bind="input" value="#6ea8fe" />
          <div class="color-swatch" id="colorSwatch"></div>
        </div>
        <div class="result-box" id="toolResult"></div>
      `;
      break;

    case 'gradientMaker':
      body = `
        <div class="color-row">
          <input type="color" data-bind="color1" value="${s.color1}" />
          <input type="color" data-bind="color2" value="${s.color2}" />
        </div>
        <div class="result-box" id="toolResult"></div>
      `;
      break;

    case 'paletteGenerator':
      body = `
        <input type="text" class="text-input" placeholder="${t('labels.color')}" data-bind="input" value="#6ea8fe" />
        <div class="result-box" id="toolResult"></div>
      `;
      break;

    case 'bmiCalculator':
      body = `
        <div class="two-col">
          <input type="number" class="number-input" placeholder="${t('labels.heightCm')}" data-bind="height" />
          <input type="number" class="number-input" placeholder="${t('labels.weightKg')}" data-bind="weight" />
        </div>
        <div class="result-box" id="toolResult"></div>
      `;
      break;

    case 'percentageCalc':
      body = `
        <div class="two-col">
          <input type="number" class="number-input" placeholder="${t('labels.number')}" data-bind="input" />
          <input type="number" class="number-input" placeholder="${t('labels.count')}" data-bind="input2" />
        </div>
        <div class="result-box" id="toolResult"></div>
      `;
      break;

    case 'randomNumber':
      body = `
        <div class="two-col">
          <input type="number" class="number-input" placeholder="${t('labels.min')}" data-bind="min" value="0" />
          <input type="number" class="number-input" placeholder="${t('labels.max')}" data-bind="max" value="100" />
        </div>
        <button class="primary-btn" data-action="generate">${t('toolLabels.generate')}</button>
        <div class="result-box" id="toolResult"></div>
      `;
      break;

    case 'ageCalculator':
      body = `
        <input type="date" class="text-input" data-bind="birthDate" />
        <div class="result-box" id="toolResult"></div>
      `;
      break;

    case 'unixConverter':
      body = `
        <input type="text" class="text-input" placeholder="${t('labels.dateTime')} or ${t('labels.timestamp')}" data-bind="input" />
        <div class="result-box" id="toolResult"></div>
      `;
      break;

    case 'timezoneConverter':
      body = `
        <input type="datetime-local" class="text-input" data-bind="input" />
        <div class="result-box" id="toolResult"></div>
      `;
      break;

    case 'uuidGenerator':
      body = `
        <input type="number" class="number-input" placeholder="${t('labels.count')}" data-bind="count" value="5" />
        <button class="primary-btn" data-action="generate">${t('toolLabels.generate')}</button>
        <div class="result-box" id="toolResult"></div>
      `;
      break;

    case 'qrGenerator':
      body = `
        <input type="text" class="text-input" placeholder="${t('labels.url')}" data-bind="input" />
        <div class="preview-box" id="toolResult"></div>
      `;
      break;

    case 'passwordGenerator':
      body = `
        <input type="number" class="number-input" placeholder="${t('labels.passwordLength')}" data-bind="length" value="16" />
        <button class="primary-btn" data-action="generate">${t('toolLabels.generate')}</button>
        <div class="result-box" id="toolResult"></div>
      `;
      break;

    case 'loremIpsum':
      body = `
        <input type="number" class="number-input" placeholder="${t('labels.paragraphs')}" data-bind="count" value="3" />
        <button class="primary-btn" data-action="generate">${t('toolLabels.generate')}</button>
        <div class="result-box" id="toolResult"></div>
      `;
      break;

    case 'csvToJson':
    case 'jsonToCsv':
      body = `
        <textarea class="text-area" rows="6" placeholder="${state.activeToolId === 'csvToJson' ? 'CSV data' : 'JSON array'}" data-bind="input"></textarea>
        <div class="result-box" id="toolResult"></div>
      `;
      break;

    case 'numberBase':
      body = `
        <input type="number" class="number-input" placeholder="${t('labels.number')}" data-bind="input" />
        <div class="result-box" id="toolResult"></div>
      `;
      break;

    case 'cronHelper':
      body = `
        <input type="text" class="text-input" placeholder="* * * * *" data-bind="input" />
        <div class="result-box" id="toolResult"></div>
      `;
      break;

    case 'unitConverter':
      body = `
        <input type="number" class="number-input" placeholder="${t('labels.length')}" data-bind="input" />
        <div class="two-col">
          <select class="select" data-bind="fromUnit">
            <option value="m" ${s.fromUnit === 'm' ? 'selected' : ''}>m</option>
            <option value="cm" ${s.fromUnit === 'cm' ? 'selected' : ''}>cm</option>
            <option value="mm" ${s.fromUnit === 'mm' ? 'selected' : ''}>mm</option>
            <option value="km" ${s.fromUnit === 'km' ? 'selected' : ''}>km</option>
            <option value="in" ${s.fromUnit === 'in' ? 'selected' : ''}>in</option>
            <option value="ft" ${s.fromUnit === 'ft' ? 'selected' : ''}>ft</option>
          </select>
          <select class="select" data-bind="toUnit">
            <option value="m" ${s.toUnit === 'm' ? 'selected' : ''}>m</option>
            <option value="cm" ${s.toUnit === 'cm' ? 'selected' : ''}>cm</option>
            <option value="mm" ${s.toUnit === 'mm' ? 'selected' : ''}>mm</option>
            <option value="km" ${s.toUnit === 'km' ? 'selected' : ''}>km</option>
            <option value="in" ${s.toUnit === 'in' ? 'selected' : ''}>in</option>
            <option value="ft" ${s.toUnit === 'ft' ? 'selected' : ''}>ft</option>
          </select>
        </div>
        <div class="result-box" id="toolResult"></div>
      `;
      break;

    case 'imageToBase64':
      body = `
        <input type="file" class="file-input" id="imageInput" accept="image/*" />
        <div class="result-box" id="toolResult"></div>
      `;
      break;

    case 'textToList':
      body = `
        <textarea class="text-area" rows="4" placeholder="${t('labels.text')}" data-bind="input"></textarea>
        <div class="action-row">
          <button class="secondary-btn" data-action="format" data-value="html">HTML</button>
          <button class="secondary-btn" data-action="format" data-value="markdown">Markdown</button>
          <button class="secondary-btn" data-action="format" data-value="json">JSON</button>
        </div>
        <div class="result-box" id="toolResult"></div>
      `;
      break;

    case 'duplicateChecker':
    case 'keywordExtractor':
      body = `
        <textarea class="text-area" rows="6" placeholder="${t('labels.text')}" data-bind="input"></textarea>
        <div class="result-box" id="toolResult"></div>
      `;
      break;
  }

  return `
    <div class="card panel">
      <div class="panel-header">
        <div>
          <h3>${tool.id.replace(/([A-Z])/g, ' $1').trim()}</h3>
          <p>${t(`toolDescriptions.${tool.id}`)}</p>
        </div>
        <div class="action-row">
          <button class="ghost-btn" id="copyBtn">${t('copyResult')}</button>
          <button class="ghost-btn" id="downloadBtn">${t('downloadFile')}</button>
          <button class="ghost-btn" id="clearBtn">${t('clear')}</button>
        </div>
      </div>
      <div class="tool-body">${body}</div>
    </div>
  `;
}

function renderFooter() {
  return `<footer class="footer">${t('footer')}</footer>`;
}

function render() {
  app.innerHTML = `
    <div class="container">
      ${renderHeader()}
      ${renderHero()}
      ${renderCategories()}
      <div class="layout">
        ${renderToolsGrid()}
        ${renderToolPanel()}
      </div>
      ${renderFooter()}
    </div>
  `;
  bindEvents();
  updateToolResult();
}