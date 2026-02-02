const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

const CONTENT_ORDER = [
  'module-0-emergency',
  'module-1-foundation',
  'module-2-four-doors',
  'module-3-patterns',
  'module-4-implementation',
  'module-5-advanced',
  'module-6-context',
  'module-7-field-notes',
  'module-8-resources',
  'epilogue'
];

const MODULE_TITLES = {
  'module-0-emergency': 'MODULE 0: EMERGENCY PROTOCOLS',
  'module-1-foundation': 'MODULE 1: FOUNDATION',
  'module-2-four-doors': 'MODULE 2: THE FOUR DOORS',
  'module-3-patterns': 'MODULE 3: THE PATTERNS',
  'module-4-implementation': 'MODULE 4: IMPLEMENTATION',
  'module-5-advanced': 'MODULE 5: ADVANCED TECHNIQUES',
  'module-6-context': 'MODULE 6: CONTEXT',
  'module-7-field-notes': 'MODULE 7: FIELD NOTES',
  'module-8-resources': 'MODULE 8: RESOURCES',
  'epilogue': 'EPILOGUE'
};

function getFilesInOrder(modulePath) {
  if (!fs.existsSync(modulePath)) return [];
  
  const items = fs.readdirSync(modulePath);
  const files = [];
  const subdirs = [];

  for (const item of items) {
    const itemPath = path.join(modulePath, item);
    const stat = fs.statSync(itemPath);
    
    if (stat.isDirectory()) {
      subdirs.push(item);
    } else if (item.endsWith('.md')) {
      files.push(item);
    }
  }

  files.sort((a, b) => {
    const numA = parseFloat(a.match(/^[\d.]+/)?.[0] || '999');
    const numB = parseFloat(b.match(/^[\d.]+/)?.[0] || '999');
    return numA - numB;
  });

  subdirs.sort();

  const result = files.map(f => path.join(modulePath, f));
  
  for (const subdir of subdirs) {
    const subdirPath = path.join(modulePath, subdir);
    const subdirFiles = getFilesInOrder(subdirPath);
    result.push(...subdirFiles);
  }

  return result;
}

function generateHTML(contentDir) {
  marked.setOptions({
    breaks: true,
    gfm: true
  });

  let html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: #1a1a1a;
      color: #FFFFFF;
      font-size: 11pt;
      line-height: 1.6;
    }
    
    .page {
      width: 8.5in;
      min-height: 11in;
      padding: 0.75in 1in;
      background: #1a1a1a;
      page-break-after: always;
      position: relative;
    }
    
    .page:last-child {
      page-break-after: avoid;
    }
    
    .footer {
      position: absolute;
      bottom: 0.5in;
      left: 1in;
      right: 1in;
      font-size: 8pt;
      color: #6B7280;
      display: flex;
      justify-content: space-between;
      border-top: 1px solid #333;
      padding-top: 10px;
    }
    
    /* Title Page */
    .title-page {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      min-height: 10in;
    }
    
    .logo-ring {
      width: 140px;
      height: 140px;
      border: 4px solid #14B8A6;
      border-radius: 50%;
      position: relative;
      margin-bottom: 50px;
    }
    
    .logo-ring::before {
      content: '';
      position: absolute;
      top: 6px;
      left: 6px;
      right: 6px;
      bottom: 6px;
      border: 2px solid #EC4899;
      border-radius: 50%;
    }
    
    .logo-ring::after {
      content: 'A';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 48px;
      font-weight: 700;
      color: #14B8A6;
    }
    
    .main-title {
      font-size: 42pt;
      font-weight: 700;
      letter-spacing: 3px;
      margin-bottom: 10px;
      color: #FFFFFF;
    }
    
    .subtitle {
      font-size: 18pt;
      font-weight: 600;
      letter-spacing: 4px;
      margin-bottom: 50px;
      color: #FFFFFF;
    }
    
    .tagline {
      font-size: 12pt;
      font-style: italic;
      color: #D1D5DB;
      max-width: 450px;
      line-height: 1.8;
      margin-bottom: 50px;
    }
    
    .brand-line {
      font-size: 13pt;
      font-weight: 700;
      letter-spacing: 2px;
      color: #14B8A6;
    }
    
    /* Module Title Page */
    .module-title-page {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 10in;
      text-align: center;
    }
    
    .module-title {
      font-size: 32pt;
      font-weight: 700;
      letter-spacing: 3px;
      color: #14B8A6;
    }
    
    .module-divider {
      width: 100px;
      height: 3px;
      background: linear-gradient(90deg, #14B8A6, #EC4899);
      margin-top: 30px;
    }
    
    /* Content Styling */
    .content-page {
      padding-bottom: 1in;
    }
    
    h1 {
      font-size: 20pt;
      font-weight: 700;
      color: #FFFFFF;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 2px solid #14B8A6;
    }
    
    h2 {
      font-size: 14pt;
      font-weight: 700;
      color: #14B8A6;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-top: 30px;
      margin-bottom: 15px;
    }
    
    h3 {
      font-size: 12pt;
      font-weight: 600;
      color: #FFFFFF;
      margin-top: 25px;
      margin-bottom: 12px;
    }
    
    h4 {
      font-size: 11pt;
      font-weight: 600;
      color: #9CA3AF;
      margin-top: 20px;
      margin-bottom: 10px;
    }
    
    p {
      margin-bottom: 14px;
      color: #E5E7EB;
      text-align: justify;
    }
    
    ul, ol {
      margin-left: 25px;
      margin-bottom: 16px;
    }
    
    li {
      margin-bottom: 8px;
      color: #E5E7EB;
    }
    
    li::marker {
      color: #14B8A6;
    }
    
    blockquote {
      border-left: 3px solid #14B8A6;
      padding-left: 20px;
      margin: 20px 0;
      font-style: italic;
      color: #14B8A6;
    }
    
    strong {
      color: #FFFFFF;
      font-weight: 600;
    }
    
    em {
      color: #14B8A6;
    }
    
    code {
      background: #2D2D2D;
      padding: 2px 6px;
      border-radius: 3px;
      font-size: 10pt;
      color: #14B8A6;
    }
    
    pre {
      background: #2D2D2D;
      padding: 15px;
      border-radius: 5px;
      overflow-x: auto;
      margin: 15px 0;
    }
    
    pre code {
      background: none;
      padding: 0;
    }
    
    hr {
      border: none;
      height: 1px;
      background: linear-gradient(90deg, transparent, #14B8A6, transparent);
      margin: 30px 0;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    
    th, td {
      border: 1px solid #333;
      padding: 10px;
      text-align: left;
    }
    
    th {
      background: #2D2D2D;
      color: #14B8A6;
      font-weight: 600;
    }
    
    a {
      color: #14B8A6;
      text-decoration: none;
    }
    
    .section-break {
      height: 40px;
    }
  </style>
</head>
<body>
  <!-- Title Page -->
  <div class="page">
    <div class="title-page">
      <div class="logo-ring"></div>
      <div class="main-title">THE ARCHIVIST METHOD™</div>
      <div class="subtitle">COMPLETE ARCHIVE</div>
      <div class="tagline">
        A systematic approach to identifying and interrupting the destructive patterns 
        that have been running your life. This is not therapy. This is pattern archaeology—
        excavating the programs installed in childhood and replacing them with conscious choice.
      </div>
      <div class="brand-line">PATTERN ARCHAEOLOGY, NOT THERAPY</div>
    </div>
    <div class="footer">
      <span>THE ARCHIVIST METHOD | CLASSIFIED</span>
      <span></span>
    </div>
  </div>
`;

  let pageNum = 1;

  for (const moduleName of CONTENT_ORDER) {
    const modulePath = path.join(contentDir, moduleName);
    
    if (!fs.existsSync(modulePath)) {
      console.log(`  Skipping ${moduleName} (not found)`);
      continue;
    }

    const title = MODULE_TITLES[moduleName] || moduleName.toUpperCase();
    
    pageNum++;
    html += `
  <div class="page">
    <div class="module-title-page">
      <div class="module-title">${title}</div>
      <div class="module-divider"></div>
    </div>
    <div class="footer">
      <span>THE ARCHIVIST METHOD | CLASSIFIED</span>
      <span>${pageNum}</span>
    </div>
  </div>
`;

    const files = getFilesInOrder(modulePath);
    console.log(`  Processing ${moduleName}: ${files.length} files`);

    for (const filePath of files) {
      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const htmlContent = marked.parse(content);
        
        pageNum++;
        html += `
  <div class="page content-page">
    ${htmlContent}
    <div class="footer">
      <span>THE ARCHIVIST METHOD | CLASSIFIED</span>
      <span>${pageNum}</span>
    </div>
  </div>
`;
      } catch (err) {
        console.log(`    Error processing ${path.basename(filePath)}: ${err.message}`);
      }
    }
  }

  html += `
</body>
</html>
`;

  return html;
}

async function generatePDF() {
  const contentDir = path.join(__dirname, '..', 'content', 'book');
  const outputPath = path.join(__dirname, '..', 'THE-ARCHIVIST-METHOD-COMPLETE-ARCHIVE.pdf');
  const htmlPath = path.join(__dirname, '..', 'temp-archive.html');

  console.log('Generating THE ARCHIVIST METHOD™ Complete Archive PDF...\n');

  const html = generateHTML(contentDir);
  fs.writeFileSync(htmlPath, html);
  console.log('  HTML generated');

  console.log('  Launching browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  
  console.log('  Generating PDF...');
  await page.pdf({
    path: outputPath,
    format: 'Letter',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  });

  await browser.close();
  
  fs.unlinkSync(htmlPath);

  const stats = fs.statSync(outputPath);
  const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
  
  console.log(`\nPDF Generated Successfully!`);
  console.log(`  File size: ${fileSizeMB} MB`);
  console.log(`  Output: ${outputPath}`);
}

generatePDF().catch(console.error);
