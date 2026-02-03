#!/usr/bin/env python3
"""
THE ARCHIVIST METHOD™ - COMPLETE ARCHIVE PDF GENERATOR
Simple version for better compatibility
"""

import os
import re
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Image

# Colors - Using dark text on light background for compatibility
BLACK = HexColor('#1A1A1A')
DARK_GRAY = HexColor('#333333')
GRAY = HexColor('#666666')
TEAL = HexColor('#14B8A6')
PINK = HexColor('#EC4899')

PAGE_WIDTH, PAGE_HEIGHT = letter
MARGIN = 1 * inch

CONTENT_ORDER = [
    'module-0-emergency', 'module-1-foundation', 'module-2-four-doors',
    'module-3-patterns', 'module-4-implementation', 'module-5-advanced',
    'module-6-context', 'module-7-field-notes', 'module-8-resources', 'epilogue'
]

MODULE_TITLES = {
    'module-0-emergency': ('MODULE 0', 'EMERGENCY PROTOCOLS'),
    'module-1-foundation': ('MODULE 1', 'FOUNDATION'),
    'module-2-four-doors': ('MODULE 2', 'THE FOUR DOORS PROTOCOL'),
    'module-3-patterns': ('MODULE 3', 'THE PATTERNS'),
    'module-4-implementation': ('MODULE 4', 'IMPLEMENTATION'),
    'module-5-advanced': ('MODULE 5', 'ADVANCED TECHNIQUES'),
    'module-6-context': ('MODULE 6', 'CONTEXT'),
    'module-7-field-notes': ('MODULE 7', 'FIELD NOTES'),
    'module-8-resources': ('MODULE 8', 'RESOURCES'),
    'epilogue': ('', 'EPILOGUE')
}

def create_styles():
    return {
        'title': ParagraphStyle('Title', fontSize=42, textColor=BLACK, alignment=TA_CENTER, fontName='Helvetica-Bold', leading=50),
        'subtitle': ParagraphStyle('Subtitle', fontSize=28, textColor=TEAL, alignment=TA_CENTER, fontName='Helvetica-Bold', leading=36),
        'tagline': ParagraphStyle('Tagline', fontSize=12, textColor=GRAY, alignment=TA_CENTER, fontName='Helvetica-Oblique', leading=20),
        'brand': ParagraphStyle('Brand', fontSize=14, textColor=TEAL, alignment=TA_CENTER, fontName='Helvetica-Bold'),
        'module_label': ParagraphStyle('ModuleLabel', fontSize=14, textColor=TEAL, alignment=TA_CENTER, fontName='Helvetica-Bold'),
        'module_title': ParagraphStyle('ModuleTitle', fontSize=32, textColor=BLACK, alignment=TA_CENTER, fontName='Helvetica-Bold', leading=40),
        'toc_title': ParagraphStyle('TOCTitle', fontSize=24, textColor=BLACK, alignment=TA_CENTER, fontName='Helvetica-Bold'),
        'toc_entry': ParagraphStyle('TOCEntry', fontSize=11, textColor=DARK_GRAY, fontName='Helvetica', leading=22),
        'h1': ParagraphStyle('H1', fontSize=20, textColor=BLACK, fontName='Helvetica-Bold', spaceBefore=20, spaceAfter=10, leading=26),
        'h2': ParagraphStyle('H2', fontSize=16, textColor=TEAL, fontName='Helvetica-Bold', spaceBefore=16, spaceAfter=8, leading=22),
        'h3': ParagraphStyle('H3', fontSize=13, textColor=BLACK, fontName='Helvetica-Bold', spaceBefore=12, spaceAfter=6, leading=18),
        'h4': ParagraphStyle('H4', fontSize=11, textColor=GRAY, fontName='Helvetica-Bold', spaceBefore=10, spaceAfter=5, leading=16),
        'body': ParagraphStyle('Body', fontSize=10, textColor=DARK_GRAY, fontName='Helvetica', alignment=TA_JUSTIFY, leading=15, spaceAfter=8),
        'quote': ParagraphStyle('Quote', fontSize=10, textColor=TEAL, fontName='Helvetica-Oblique', leftIndent=25, leading=15, spaceAfter=10),
        'bullet': ParagraphStyle('Bullet', fontSize=10, textColor=DARK_GRAY, fontName='Helvetica', leftIndent=20, leading=15, spaceAfter=5),
        'footer': ParagraphStyle('Footer', fontSize=8, textColor=GRAY, alignment=TA_CENTER),
    }

def clean_text(text):
    text = re.sub(r'<<<BOLD>>>(.*?)<<<ENDBOLD>>>', r'<b>\1</b>', text, flags=re.DOTALL)
    text = re.sub(r'<<<ITALIC>>>(.*?)<<<ENDITALIC>>>', r'<i>\1</i>', text, flags=re.DOTALL)
    text = re.sub(r'\*\*([^*]+)\*\*', r'<b>\1</b>', text)
    text = re.sub(r'(?<!\*)\*([^*]+)\*(?!\*)', r'<i>\1</i>', text)
    text = re.sub(r'__([^_]+)__', r'<b>\1</b>', text)
    text = re.sub(r'`([^`]+)`', r'<font color="#14B8A6">\1</font>', text)
    text = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', text)
    text = text.replace('<<<', '').replace('>>>', '')
    
    text = text.replace('&', '&amp;')
    
    protected = []
    for tag in ['<b>', '</b>', '<i>', '</i>', '<font color="#14B8A6">', '</font>']:
        placeholder = f'__TAG{len(protected)}__'
        text = text.replace(tag, placeholder)
        protected.append((placeholder, tag))
    
    text = text.replace('<', '&lt;').replace('>', '&gt;')
    
    for placeholder, tag in protected:
        text = text.replace(placeholder, tag)
    
    return text

def parse_markdown(content, styles):
    elements = []
    for line in content.split('\n'):
        line = line.rstrip()
        if not line.strip():
            continue
        
        try:
            if line.startswith('# '):
                elements.append(Paragraph(clean_text(line[2:]).upper(), styles['h1']))
            elif line.startswith('## '):
                elements.append(Paragraph(clean_text(line[3:]), styles['h2']))
            elif line.startswith('### '):
                elements.append(Paragraph(clean_text(line[4:]), styles['h3']))
            elif line.startswith('#### '):
                elements.append(Paragraph(clean_text(line[5:]), styles['h4']))
            elif line.strip() in ['---', '***', '___']:
                elements.append(Spacer(1, 15))
            elif line.startswith('> '):
                elements.append(Paragraph(clean_text(line[2:]), styles['quote']))
            elif line.strip().startswith('- ') or line.strip().startswith('* '):
                text = clean_text(line.strip()[2:])
                elements.append(Paragraph(f'<font color="#14B8A6">•</font> {text}', styles['bullet']))
            elif re.match(r'^\d+\.\s', line.strip()):
                match = re.match(r'^(\d+)\.\s*(.+)', line.strip())
                if match:
                    num, text = match.groups()
                    elements.append(Paragraph(f'<font color="#14B8A6">{num}.</font> {clean_text(text)}', styles['bullet']))
            elif line.strip():
                elements.append(Paragraph(clean_text(line), styles['body']))
        except:
            pass
    
    return elements

def get_files_in_order(module_path):
    if not os.path.exists(module_path):
        return []
    
    items = os.listdir(module_path)
    files = [f for f in items if f.endswith('.md') and os.path.isfile(os.path.join(module_path, f))]
    subdirs = [d for d in items if os.path.isdir(os.path.join(module_path, d))]
    
    def sort_key(f):
        match = re.match(r'^([\d.]+)', f)
        return float(match.group(1)) if match else 999
    
    files.sort(key=sort_key)
    subdirs.sort()
    
    result = [os.path.join(module_path, f) for f in files]
    for subdir in subdirs:
        result.extend(get_files_in_order(os.path.join(module_path, subdir)))
    
    return result

def add_footer(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(HexColor('#14B8A6'))
    canvas.setLineWidth(0.5)
    canvas.line(MARGIN, 0.6*inch, PAGE_WIDTH - MARGIN, 0.6*inch)
    canvas.setFillColor(HexColor('#888888'))
    canvas.setFont('Helvetica', 8)
    canvas.drawString(MARGIN, 0.4*inch, "THE ARCHIVIST METHOD™ | CLASSIFIED")
    canvas.drawRightString(PAGE_WIDTH - MARGIN, 0.4*inch, str(doc.page))
    canvas.restoreState()

def generate_pdf():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    base_dir = os.path.join(script_dir, '..')
    content_dir = os.path.join(base_dir, 'content', 'book')
    output_path = os.path.join(base_dir, 'THE-ARCHIVIST-METHOD-COMPLETE-ARCHIVE.pdf')
    logo_path = os.path.join(base_dir, 'attached_assets', 'archivist-portrait-circle.jpg')
    
    print('Generating THE ARCHIVIST METHOD™ Complete Archive PDF...')
    
    styles = create_styles()
    story = []
    
    # Title Page
    story.append(Spacer(1, 100))
    if os.path.exists(logo_path):
        try:
            logo = Image(logo_path, width=120, height=120)
            logo.hAlign = 'CENTER'
            story.append(logo)
            story.append(Spacer(1, 30))
        except:
            pass
    
    story.append(Paragraph("THE ARCHIVIST METHOD™", styles['title']))
    story.append(Spacer(1, 15))
    story.append(Paragraph("COMPLETE ARCHIVE", styles['subtitle']))
    story.append(Spacer(1, 30))
    story.append(Paragraph("The complete system for identifying and interrupting the patterns destroying your life.", styles['tagline']))
    story.append(Spacer(1, 25))
    story.append(Paragraph('PATTERN ARCHAEOLOGY, <font color="#EC4899">NOT</font> THERAPY', styles['brand']))
    story.append(PageBreak())
    
    # Table of Contents
    story.append(Spacer(1, 50))
    story.append(Paragraph("TABLE OF CONTENTS", styles['toc_title']))
    story.append(Spacer(1, 25))
    for name in CONTENT_ORDER:
        if name in MODULE_TITLES:
            label, title = MODULE_TITLES[name]
            entry = f'<font color="#14B8A6">{label}:</font> {title}' if label else f'<font color="#14B8A6">{title}</font>'
            story.append(Paragraph(entry, styles['toc_entry']))
            story.append(Spacer(1, 6))
    story.append(PageBreak())
    
    # Modules
    total_files = 0
    for module_name in CONTENT_ORDER:
        module_path = os.path.join(content_dir, module_name)
        if not os.path.exists(module_path):
            continue
        
        label, title = MODULE_TITLES.get(module_name, ('', module_name.upper()))
        
        story.append(Spacer(1, 180))
        if label:
            story.append(Paragraph(label, styles['module_label']))
            story.append(Spacer(1, 10))
        story.append(Paragraph(title, styles['module_title']))
        story.append(PageBreak())
        
        files = get_files_in_order(module_path)
        print(f'  {module_name}: {len(files)} files')
        
        for file_path in files:
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                story.extend(parse_markdown(content, styles))
                story.append(PageBreak())
                total_files += 1
            except:
                pass
    
    print('Building PDF...')
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        leftMargin=MARGIN,
        rightMargin=MARGIN,
        topMargin=MARGIN,
        bottomMargin=0.75*inch
    )
    doc.build(story, onFirstPage=add_footer, onLaterPages=add_footer)
    
    size_mb = os.path.getsize(output_path) / (1024 * 1024)
    print(f'\nDone! {total_files} files, {size_mb:.2f} MB')

if __name__ == '__main__':
    generate_pdf()
