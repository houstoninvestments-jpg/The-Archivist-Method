const { mdToPdf } = require('md-to-pdf');
const fs = require('fs');
const path = require('path');

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

async function generatePDF() {
  const contentDir = path.join(__dirname, '..', 'content', 'book');
  const outputPath = path.join(__dirname, '..', 'THE-ARCHIVIST-METHOD-COMPLETE-ARCHIVE.pdf');
  const combinedMdPath = path.join(__dirname, '..', 'COMPLETE-ARCHIVE.md');

  console.log('Generating THE ARCHIVIST METHOD™ Complete Archive PDF...\n');

  // Build combined markdown
  let combinedMd = `
<div style="text-align: center; padding: 200px 50px;">

# THE ARCHIVIST METHOD™

## COMPLETE ARCHIVE

---

*A systematic approach to identifying and interrupting the destructive patterns that have been running your life. This is not therapy. This is pattern archaeology—excavating the programs installed in childhood and replacing them with conscious choice.*

---

**PATTERN ARCHAEOLOGY, NOT THERAPY**

</div>

<div style="page-break-after: always;"></div>

`;

  for (const moduleName of CONTENT_ORDER) {
    const modulePath = path.join(contentDir, moduleName);
    
    if (!fs.existsSync(modulePath)) {
      console.log(`  Skipping ${moduleName} (not found)`);
      continue;
    }

    const title = MODULE_TITLES[moduleName] || moduleName.toUpperCase();
    
    // Module title page
    combinedMd += `
<div style="text-align: center; padding: 250px 50px;">

# ${title}

---

</div>

<div style="page-break-after: always;"></div>

`;

    const files = getFilesInOrder(modulePath);
    console.log(`  Processing ${moduleName}: ${files.length} files`);

    for (const filePath of files) {
      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        combinedMd += content + '\n\n<div style="page-break-after: always;"></div>\n\n';
      } catch (err) {
        console.log(`    Error processing ${path.basename(filePath)}: ${err.message}`);
      }
    }
  }

  // Write combined markdown
  fs.writeFileSync(combinedMdPath, combinedMd);
  console.log('  Combined markdown created');

  // Generate PDF with styling
  console.log('  Generating PDF...');
  
  try {
    const pdf = await mdToPdf(
      { path: combinedMdPath },
      {
        pdf_options: {
          format: 'Letter',
          margin: { top: '0.75in', bottom: '0.75in', left: '1in', right: '1in' },
          printBackground: true
        },
        stylesheet: `
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background-color: #1a1a1a;
            color: #FFFFFF;
            font-size: 11pt;
            line-height: 1.7;
          }
          
          h1 {
            color: #FFFFFF;
            font-size: 22pt;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 2px;
            border-bottom: 2px solid #14B8A6;
            padding-bottom: 10px;
            margin-top: 30px;
            margin-bottom: 20px;
          }
          
          h2 {
            color: #14B8A6;
            font-size: 14pt;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-top: 25px;
            margin-bottom: 15px;
          }
          
          h3 {
            color: #FFFFFF;
            font-size: 12pt;
            font-weight: 600;
            margin-top: 20px;
            margin-bottom: 12px;
          }
          
          h4 {
            color: #9CA3AF;
            font-size: 11pt;
            font-weight: 600;
            margin-top: 15px;
            margin-bottom: 10px;
          }
          
          p {
            color: #E5E7EB;
            margin-bottom: 14px;
          }
          
          ul, ol {
            margin-left: 25px;
            margin-bottom: 16px;
            color: #E5E7EB;
          }
          
          li {
            margin-bottom: 8px;
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
        `,
        launch_options: {
          args: ['--no-sandbox', '--disable-setuid-sandbox']
        }
      }
    );
    
    if (pdf.content) {
      fs.writeFileSync(outputPath, pdf.content);
      const stats = fs.statSync(outputPath);
      const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
      
      console.log(`\nPDF Generated Successfully!`);
      console.log(`  File size: ${fileSizeMB} MB`);
      console.log(`  Output: ${outputPath}`);
    }
  } catch (err) {
    console.error('PDF generation error:', err.message);
  }
  
  // Cleanup
  if (fs.existsSync(combinedMdPath)) {
    fs.unlinkSync(combinedMdPath);
  }
}

generatePDF().catch(console.error);
