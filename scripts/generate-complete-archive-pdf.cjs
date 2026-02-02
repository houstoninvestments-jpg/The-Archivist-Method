const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

const COLORS = {
  background: '#1a1a1a',
  text: '#FFFFFF',
  accent: '#14B8A6',
  muted: '#9CA3AF',
  pink: '#EC4899'
};

const FONTS = {
  regular: 'Helvetica',
  bold: 'Helvetica-Bold',
  italic: 'Helvetica-Oblique'
};

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

class ArchivistPDFGenerator {
  constructor() {
    this.doc = new PDFDocument({
      size: 'LETTER',
      margins: { top: 72, bottom: 72, left: 72, right: 72 },
      bufferPages: true
    });
    this.pageNumber = 0;
    this.contentDir = path.join(__dirname, '..', 'content', 'book');
  }

  drawBackground() {
    this.doc.rect(0, 0, this.doc.page.width, this.doc.page.height)
      .fill(COLORS.background);
  }

  addFooter(includePageNumber = true) {
    const footerY = this.doc.page.height - 50;
    this.doc.font(FONTS.regular)
      .fontSize(9)
      .fillColor(COLORS.muted);
    
    if (includePageNumber) {
      this.doc.text(
        `THE ARCHIVIST METHOD | CLASSIFIED                                                                                    ${this.pageNumber}`,
        72, footerY, { width: this.doc.page.width - 144 }
      );
    } else {
      this.doc.text('THE ARCHIVIST METHOD | CLASSIFIED', 72, footerY, { 
        width: this.doc.page.width - 144, 
        align: 'center' 
      });
    }
  }

  addTitlePage() {
    this.drawBackground();
    
    const centerX = this.doc.page.width / 2;
    const logoY = 120;
    
    this.doc.save();
    this.doc.circle(centerX, logoY, 60)
      .lineWidth(4)
      .stroke(COLORS.accent);
    this.doc.circle(centerX, logoY, 55)
      .lineWidth(2)
      .stroke(COLORS.pink);
    this.doc.restore();
    
    this.doc.font(FONTS.bold)
      .fontSize(36)
      .fillColor(COLORS.text)
      .text('THE ARCHIVIST METHOD™', 72, logoY + 100, { 
        width: this.doc.page.width - 144, 
        align: 'center' 
      });
    
    this.doc.font(FONTS.bold)
      .fontSize(18)
      .fillColor(COLORS.text)
      .text('COMPLETE ARCHIVE', 72, logoY + 160, { 
        width: this.doc.page.width - 144, 
        align: 'center' 
      });
    
    this.doc.font(FONTS.italic)
      .fontSize(12)
      .fillColor(COLORS.text)
      .text(
        'A systematic approach to identifying and interrupting the destructive patterns ' +
        'that have been running your life. This is not therapy. This is pattern archaeology—' +
        'excavating the programs installed in childhood and replacing them with conscious choice.',
        72, logoY + 220, { 
          width: this.doc.page.width - 144, 
          align: 'center',
          lineGap: 6
        }
      );
    
    this.doc.font(FONTS.bold)
      .fontSize(14)
      .fillColor(COLORS.accent)
      .text('PATTERN ARCHAEOLOGY, NOT THERAPY', 72, logoY + 320, { 
        width: this.doc.page.width - 144, 
        align: 'center' 
      });
    
    this.addFooter(false);
  }

  addModuleTitlePage(moduleName) {
    this.doc.addPage();
    this.pageNumber++;
    this.drawBackground();
    
    const title = MODULE_TITLES[moduleName] || moduleName.toUpperCase();
    
    this.doc.font(FONTS.bold)
      .fontSize(28)
      .fillColor(COLORS.accent)
      .text(title, 72, this.doc.page.height / 2 - 50, { 
        width: this.doc.page.width - 144, 
        align: 'center' 
      });
    
    this.addFooter();
  }

  parseMarkdown(content) {
    const lines = content.split('\n');
    const elements = [];
    let inList = false;
    let listItems = [];
    let inBlockquote = false;
    let blockquoteText = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      if (trimmed.startsWith('> ')) {
        inBlockquote = true;
        blockquoteText.push(trimmed.substring(2));
        continue;
      } else if (inBlockquote && trimmed === '') {
        elements.push({ type: 'blockquote', content: blockquoteText.join(' ') });
        blockquoteText = [];
        inBlockquote = false;
        continue;
      } else if (inBlockquote) {
        blockquoteText.push(trimmed);
        continue;
      }

      if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || /^\d+\.\s/.test(trimmed)) {
        inList = true;
        const bullet = trimmed.replace(/^[-*]\s/, '').replace(/^\d+\.\s/, '');
        listItems.push(bullet);
        continue;
      } else if (inList && trimmed === '') {
        elements.push({ type: 'list', items: [...listItems] });
        listItems = [];
        inList = false;
        continue;
      }

      if (inList && !trimmed.startsWith('- ') && !trimmed.startsWith('* ') && trimmed !== '') {
        elements.push({ type: 'list', items: [...listItems] });
        listItems = [];
        inList = false;
      }

      if (trimmed.startsWith('# ')) {
        elements.push({ type: 'h1', content: trimmed.substring(2) });
      } else if (trimmed.startsWith('## ')) {
        elements.push({ type: 'h2', content: trimmed.substring(3) });
      } else if (trimmed.startsWith('### ')) {
        elements.push({ type: 'h3', content: trimmed.substring(4) });
      } else if (trimmed.startsWith('#### ')) {
        elements.push({ type: 'h4', content: trimmed.substring(5) });
      } else if (trimmed === '---' || trimmed === '***') {
        elements.push({ type: 'hr' });
      } else if (trimmed !== '') {
        elements.push({ type: 'paragraph', content: trimmed });
      } else {
        elements.push({ type: 'space' });
      }
    }

    if (listItems.length > 0) {
      elements.push({ type: 'list', items: listItems });
    }
    if (blockquoteText.length > 0) {
      elements.push({ type: 'blockquote', content: blockquoteText.join(' ') });
    }

    return elements;
  }

  cleanText(text) {
    return text
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/_([^_]+)_/g, '$1')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  }

  checkPageBreak(neededHeight = 100) {
    const bottomMargin = 100;
    if (this.doc.y > this.doc.page.height - bottomMargin - neededHeight) {
      this.doc.addPage();
      this.pageNumber++;
      this.drawBackground();
      this.addFooter();
      this.doc.y = 72;
    }
  }

  renderElements(elements) {
    for (const el of elements) {
      switch (el.type) {
        case 'h1':
          this.checkPageBreak(80);
          this.doc.moveDown(1);
          this.doc.font(FONTS.bold)
            .fontSize(22)
            .fillColor(COLORS.text)
            .text(this.cleanText(el.content).toUpperCase(), { lineGap: 4 });
          this.doc.moveDown(0.5);
          break;

        case 'h2':
          this.checkPageBreak(60);
          this.doc.moveDown(0.8);
          this.doc.font(FONTS.bold)
            .fontSize(16)
            .fillColor(COLORS.accent)
            .text(this.cleanText(el.content).toUpperCase(), { lineGap: 3 });
          this.doc.moveDown(0.3);
          break;

        case 'h3':
          this.checkPageBreak(50);
          this.doc.moveDown(0.6);
          this.doc.font(FONTS.bold)
            .fontSize(13)
            .fillColor(COLORS.text)
            .text(this.cleanText(el.content), { lineGap: 2 });
          this.doc.moveDown(0.2);
          break;

        case 'h4':
          this.checkPageBreak(40);
          this.doc.moveDown(0.4);
          this.doc.font(FONTS.bold)
            .fontSize(11)
            .fillColor(COLORS.muted)
            .text(this.cleanText(el.content), { lineGap: 2 });
          this.doc.moveDown(0.2);
          break;

        case 'paragraph':
          this.checkPageBreak(40);
          this.doc.font(FONTS.regular)
            .fontSize(11)
            .fillColor(COLORS.text)
            .text(this.cleanText(el.content), { lineGap: 4, align: 'justify' });
          this.doc.moveDown(0.5);
          break;

        case 'list':
          for (const item of el.items) {
            this.checkPageBreak(30);
            this.doc.font(FONTS.regular)
              .fontSize(11)
              .fillColor(COLORS.text)
              .text(`  •  ${this.cleanText(item)}`, { lineGap: 3, indent: 20 });
          }
          this.doc.moveDown(0.5);
          break;

        case 'blockquote':
          this.checkPageBreak(50);
          this.doc.font(FONTS.italic)
            .fontSize(11)
            .fillColor(COLORS.accent)
            .text(this.cleanText(el.content), { 
              lineGap: 4, 
              indent: 30,
              width: this.doc.page.width - 144 - 60
            });
          this.doc.moveDown(0.5);
          break;

        case 'hr':
          this.checkPageBreak(30);
          this.doc.moveDown(0.5);
          const y = this.doc.y;
          this.doc.moveTo(72, y)
            .lineTo(this.doc.page.width - 72, y)
            .lineWidth(0.5)
            .stroke(COLORS.muted);
          this.doc.moveDown(0.5);
          break;

        case 'space':
          this.doc.moveDown(0.3);
          break;
      }
    }
  }

  getFilesInOrder(modulePath) {
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
      const subdirFiles = this.getFilesInOrder(subdirPath);
      result.push(...subdirFiles);
    }

    return result;
  }

  async generate() {
    const outputPath = path.join(__dirname, '..', 'THE-ARCHIVIST-METHOD-COMPLETE-ARCHIVE.pdf');
    const stream = fs.createWriteStream(outputPath);
    this.doc.pipe(stream);

    console.log('Generating THE ARCHIVIST METHOD™ Complete Archive PDF...\n');

    this.addTitlePage();

    let totalFiles = 0;

    for (const moduleName of CONTENT_ORDER) {
      const modulePath = path.join(this.contentDir, moduleName);
      
      if (!fs.existsSync(modulePath)) {
        console.log(`  Skipping ${moduleName} (not found)`);
        continue;
      }

      this.addModuleTitlePage(moduleName);

      const files = this.getFilesInOrder(modulePath);
      console.log(`  Processing ${moduleName}: ${files.length} files`);

      for (const filePath of files) {
        try {
          const content = fs.readFileSync(filePath, 'utf-8');
          const elements = this.parseMarkdown(content);
          
          this.doc.addPage();
          this.pageNumber++;
          this.drawBackground();
          this.addFooter();
          this.doc.y = 72;
          
          this.renderElements(elements);
          totalFiles++;
        } catch (err) {
          console.log(`    Error processing ${path.basename(filePath)}: ${err.message}`);
        }
      }
    }

    this.doc.end();

    return new Promise((resolve, reject) => {
      stream.on('finish', () => {
        console.log(`\nPDF Generated Successfully!`);
        console.log(`  Total pages: ${this.pageNumber}`);
        console.log(`  Total files processed: ${totalFiles}`);
        console.log(`  Output: ${outputPath}`);
        resolve(outputPath);
      });
      stream.on('error', reject);
    });
  }
}

const generator = new ArchivistPDFGenerator();
generator.generate().catch(console.error);
