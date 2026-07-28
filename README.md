# ToolVerse - Online Tools

A multilingual online toolbox built for Cloudflare Pages. Everything runs in the browser — no backend required.

## Features

- **38+ Tools**: Text processing, code utilities, color tools, math calculators, date/time converters, web utilities, and converters
- **3 Languages**: English, Traditional Chinese, Japanese
- **Pure Frontend**: Static HTML/CSS/JS — deploy anywhere
- **Instant Search**: Filter tools by keyword or category
- **No Dependencies**: All logic runs client-side

## Tools Included

**Text Tools**: Word Counter, Case Converter, Remove Duplicates, Sort Lines, Find Replace, Lorem Ipsum, Text Reverser, Line Counter, Duplicate Checker, Keyword Extractor, Reading Time, HTML Stripper

**Code Tools**: JSON Formatter, Base64 Encoder/Decoder, URL Encoder/Decoder, SHA-256 Hash Generator, Regex Tester, Markdown Preview, HTML Escape

**Color Tools**: Color Converter, Gradient Maker, Palette Generator

**Math Tools**: BMI Calculator, Percentage Calculator, Random Number Generator

**Date/Time Tools**: Age Calculator, Unix Timestamp Converter, Timezone Converter

**Web Tools**: UUID Generator, QR Code Generator, Password Generator, Cron Helper

**Converters**: CSV to JSON, JSON to CSV, Number Base Converter, Unit Converter, Image to Base64, Text to List

## Deploy to Cloudflare Pages

1. Create a new GitHub repository and push this project
2. Go to [Cloudflare Pages](https://pages.cloudflare.com/)
3. Connect your GitHub repository
4. Configure build settings:
   - Build command: `npm run build` (or leave empty for static sites)
   - Build output directory: `public` (or leave empty)
5. Click "Deploy"

Alternatively, use Wrangler CLI:

```bash
npm install -g wrangler
wrangler pages deploy .
```

## Run Locally

```bash
# Option 1: Python
python -m http.server 8080

# Option 2: Node.js
npx serve

# Open http://localhost:8080
```

## Project Structure

```
├── index.html          # Main entry point
├── styles.css          # Global styles
├── i18n.js             # Translations (en, zh-Hant, ja)
├── utils.js            # Utility functions
├── tools.js            # Tool definitions and logic
├── render.js           # DOM rendering
├── main.js             # State management & events
├── _headers            # Cloudflare security headers
└── _redirects          # SPA fallback routing
```

## License

MIT