#!/usr/bin/env python3
"""
THE ARCHIVIST METHOD™ - COMPLETE ARCHIVE PDF GENERATOR
Matches Crash Course PDF aesthetic exactly - dark background, bold typography
"""

import os
import re
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor, Color
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Image, Table, TableStyle
from reportlab.pdfgen import canvas

# Colors matching Crash Course PDF
DARK_BG = HexColor('#1A1A1A')
WHITE = HexColor('#FAFAFA')
LIGHT_GRAY = HexColor('#E5E5E5')
MEDIUM_GRAY = HexColor('#A0A0A0')
TEAL = HexColor('#14B8A6')
PINK = HexColor('#EC4899')

PAGE_WIDTH, PAGE_HEIGHT = letter
MARGIN = 0.75 * inch

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
    """Create styles matching Crash Course PDF - bold, impactful typography"""
    return {
        # Title page styles
        'main_title': ParagraphStyle(
            'MainTitle', fontSize=48, textColor=WHITE, alignment=TA_CENTER, 
            fontName='Helvetica-Bold', leading=56, spaceAfter=0
        ),
        'archive_title': ParagraphStyle(
            'ArchiveTitle', fontSize=36, textColor=TEAL, alignment=TA_CENTER, 
            fontName='Helvetica-Bold', leading=44, spaceAfter=0
        ),
        'tagline': ParagraphStyle(
            'Tagline', fontSize=14, textColor=MEDIUM_GRAY, alignment=TA_CENTER, 
            fontName='Helvetica-Oblique', leading=22
        ),
        'brand': ParagraphStyle(
            'Brand', fontSize=16, textColor=WHITE, alignment=TA_CENTER, 
            fontName='Helvetica-Bold', leading=24
        ),
        
        # Module title page styles
        'module_label': ParagraphStyle(
            'ModuleLabel', fontSize=18, textColor=TEAL, alignment=TA_CENTER, 
            fontName='Helvetica-Bold', leading=26, letterSpacing=2
        ),
        'module_title': ParagraphStyle(
            'ModuleTitle', fontSize=40, textColor=WHITE, alignment=TA_CENTER, 
            fontName='Helvetica-Bold', leading=48
        ),
        
        # TOC styles
        'toc_title': ParagraphStyle(
            'TOCTitle', fontSize=28, textColor=WHITE, alignment=TA_CENTER, 
            fontName='Helvetica-Bold', leading=36, spaceAfter=30
        ),
        'toc_entry': ParagraphStyle(
            'TOCEntry', fontSize=13, textColor=LIGHT_GRAY, fontName='Helvetica', 
            leading=28, leftIndent=20
        ),
        
        # Content styles - BOLD and impactful
        'h1': ParagraphStyle(
            'H1', fontSize=24, textColor=WHITE, fontName='Helvetica-Bold', 
            spaceBefore=24, spaceAfter=14, leading=30
        ),
        'h2': ParagraphStyle(
            'H2', fontSize=18, textColor=TEAL, fontName='Helvetica-Bold', 
            spaceBefore=20, spaceAfter=10, leading=24
        ),
        'h3': ParagraphStyle(
            'H3', fontSize=14, textColor=WHITE, fontName='Helvetica-Bold', 
            spaceBefore=16, spaceAfter=8, leading=20
        ),
        'h4': ParagraphStyle(
            'H4', fontSize=12, textColor=TEAL, fontName='Helvetica-Bold', 
            spaceBefore=12, spaceAfter=6, leading=18
        ),
        'body': ParagraphStyle(
            'Body', fontSize=11, textColor=LIGHT_GRAY, fontName='Helvetica', 
            alignment=TA_JUSTIFY, leading=18, spaceAfter=10
        ),
        'quote': ParagraphStyle(
            'Quote', fontSize=12, textColor=TEAL, fontName='Helvetica-Oblique', 
            leftIndent=30, rightIndent=20, leading=18, spaceAfter=12, spaceBefore=8
        ),
        'bullet': ParagraphStyle(
            'Bullet', fontSize=11, textColor=LIGHT_GRAY, fontName='Helvetica', 
            leftIndent=25, leading=18, spaceAfter=6
        ),
    }

def draw_dark_background(canvas, doc):
    """Draw dark background and teal footer line on every page"""
    canvas.saveState()
    
    # Dark background
    canvas.setFillColor(DARK_BG)
    canvas.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, fill=1, stroke=0)
    
    # Teal footer line
    canvas.setStrokeColor(TEAL)
    canvas.setLineWidth(1.5)
    canvas.line(MARGIN, 0.55*inch, PAGE_WIDTH - MARGIN, 0.55*inch)
    
    # Footer text
    canvas.setFillColor(MEDIUM_GRAY)
    canvas.setFont('Helvetica-Bold', 9)
    canvas.drawString(MARGIN, 0.35*inch, "THE ARCHIVIST METHOD™")
    
    canvas.setFillColor(TEAL)
    canvas.drawString(MARGIN + 165, 0.35*inch, "|")
    
    canvas.setFillColor(MEDIUM_GRAY)
    canvas.drawString(MARGIN + 175, 0.35*inch, "CLASSIFIED")
    
    # Page number
    canvas.setFillColor(WHITE)
    canvas.setFont('Helvetica-Bold', 10)
    canvas.drawRightString(PAGE_WIDTH - MARGIN, 0.35*inch, str(doc.page))
    
    canvas.restoreState()

def clean_text(text):
    """Clean markdown and escape special characters"""
    # Convert markdown formatting
    text = re.sub(r'\*\*([^*]+)\*\*', r'<b>\1</b>', text)
    text = re.sub(r'(?<!\*)\*([^*]+)\*(?!\*)', r'<i>\1</i>', text)
    text = re.sub(r'__([^_]+)__', r'<b>\1</b>', text)
    text = re.sub(r'`([^`]+)`', r'<font color="#14B8A6"><b>\1</b></font>', text)
    text = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', text)
    
    # Escape ampersands
    text = text.replace('&', '&amp;')
    
    # Protect tags
    protected = []
    tags = ['<b>', '</b>', '<i>', '</i>', '<font color="#14B8A6">', '</font>']
    for tag in tags:
        placeholder = f'__TAG{len(protected)}__'
        text = text.replace(tag, placeholder)
        protected.append((placeholder, tag))
    
    # Escape angle brackets
    text = text.replace('<', '&lt;').replace('>', '&gt;')
    
    # Restore tags
    for placeholder, tag in protected:
        text = text.replace(placeholder, tag)
    
    return text

def parse_markdown(content, styles):
    """Parse markdown content into PDF elements"""
    elements = []
    
    for line in content.split('\n'):
        line = line.rstrip()
        if not line.strip():
            continue
        
        try:
            if line.startswith('# '):
                text = clean_text(line[2:]).upper()
                elements.append(Paragraph(text, styles['h1']))
            elif line.startswith('## '):
                elements.append(Paragraph(clean_text(line[3:]), styles['h2']))
            elif line.startswith('### '):
                elements.append(Paragraph(clean_text(line[4:]), styles['h3']))
            elif line.startswith('#### '):
                elements.append(Paragraph(clean_text(line[5:]), styles['h4']))
            elif line.strip() in ['---', '***', '___']:
                elements.append(Spacer(1, 20))
            elif line.startswith('> '):
                quote_text = clean_text(line[2:])
                elements.append(Paragraph(f'"{quote_text}"', styles['quote']))
            elif line.strip().startswith('- ') or line.strip().startswith('* '):
                text = clean_text(line.strip()[2:])
                bullet = '<font color="#14B8A6"><b>•</b></font>'
                elements.append(Paragraph(f'{bullet}  {text}', styles['bullet']))
            elif re.match(r'^\d+\.\s', line.strip()):
                match = re.match(r'^(\d+)\.\s*(.+)', line.strip())
                if match:
                    num, text = match.groups()
                    num_styled = f'<font color="#14B8A6"><b>{num}.</b></font>'
                    elements.append(Paragraph(f'{num_styled}  {clean_text(text)}', styles['bullet']))
            elif line.strip():
                elements.append(Paragraph(clean_text(line), styles['body']))
        except Exception as e:
            pass
    
    return elements

def get_files_in_order(module_path):
    """Get markdown files in proper order"""
    if not os.path.exists(module_path):
        return []
    
    items = os.listdir(module_path)
    files = [f for f in items if f.endswith('.md') and os.path.isfile(os.path.join(module_path, f))]
    subdirs = [d for d in items if os.path.isdir(os.path.join(module_path, d))]
    
    def sort_key(f):
        match = re.match(r'^([\d.]+)', f)
        if match:
            try:
                return float(match.group(1))
            except:
                return 999
        return 999
    
    files.sort(key=sort_key)
    subdirs.sort()
    
    result = [os.path.join(module_path, f) for f in files]
    for subdir in subdirs:
        result.extend(get_files_in_order(os.path.join(module_path, subdir)))
    
    return result

def generate_pdf():
    """Generate the Complete Archive PDF matching Crash Course aesthetic"""
    script_dir = os.path.dirname(os.path.abspath(__file__))
    base_dir = os.path.join(script_dir, '..')
    content_dir = os.path.join(base_dir, 'content', 'book')
    output_path = os.path.join(base_dir, 'THE-ARCHIVIST-METHOD-COMPLETE-ARCHIVE.pdf')
    logo_path = os.path.join(base_dir, 'attached_assets', 'archivist-portrait-circle.jpg')
    
    print('=' * 60)
    print('THE ARCHIVIST METHOD™ - COMPLETE ARCHIVE')
    print('Generating PDF with Crash Course aesthetic...')
    print('=' * 60)
    
    styles = create_styles()
    story = []
    
    # === TITLE PAGE ===
    story.append(Spacer(1, 80))
    
    # Logo with gradient ring effect (achieved through table with colored borders)
    if os.path.exists(logo_path):
        try:
            logo = Image(logo_path, width=140, height=140)
            logo.hAlign = 'CENTER'
            story.append(logo)
            story.append(Spacer(1, 40))
        except Exception as e:
            print(f'Logo error: {e}')
    
    # Main title
    story.append(Paragraph("THE ARCHIVIST METHOD™", styles['main_title']))
    story.append(Spacer(1, 15))
    story.append(Paragraph("COMPLETE ARCHIVE", styles['archive_title']))
    story.append(Spacer(1, 40))
    
    # Tagline
    story.append(Paragraph(
        "The complete system for identifying and interrupting<br/>the patterns destroying your life.", 
        styles['tagline']
    ))
    story.append(Spacer(1, 30))
    
    # Brand line with pink NOT
    story.append(Paragraph(
        'PATTERN ARCHAEOLOGY, <font color="#EC4899">NOT</font> THERAPY', 
        styles['brand']
    ))
    story.append(PageBreak())
    
    # === TABLE OF CONTENTS ===
    story.append(Spacer(1, 60))
    story.append(Paragraph("CONTENTS", styles['toc_title']))
    story.append(Spacer(1, 20))
    
    for name in CONTENT_ORDER:
        if name in MODULE_TITLES:
            label, title = MODULE_TITLES[name]
            if label:
                entry = f'<font color="#14B8A6"><b>{label}:</b></font>  {title}'
            else:
                entry = f'<font color="#14B8A6"><b>{title}</b></font>'
            story.append(Paragraph(entry, styles['toc_entry']))
    
    story.append(PageBreak())
    
    # === MODULE CONTENT ===
    total_files = 0
    
    for module_name in CONTENT_ORDER:
        module_path = os.path.join(content_dir, module_name)
        if not os.path.exists(module_path):
            print(f'  Skipping {module_name} (not found)')
            continue
        
        label, title = MODULE_TITLES.get(module_name, ('', module_name.upper()))
        
        # Module title page
        story.append(Spacer(1, 200))
        if label:
            story.append(Paragraph(label, styles['module_label']))
            story.append(Spacer(1, 15))
        story.append(Paragraph(title, styles['module_title']))
        story.append(PageBreak())
        
        # Module content files
        files = get_files_in_order(module_path)
        print(f'  {module_name}: {len(files)} files')
        
        for file_path in files:
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                elements = parse_markdown(content, styles)
                if elements:
                    story.extend(elements)
                    story.append(PageBreak())
                    total_files += 1
            except Exception as e:
                print(f'    Error reading {file_path}: {e}')
    
    # === BUILD PDF ===
    print('\nBuilding PDF...')
    
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        leftMargin=MARGIN,
        rightMargin=MARGIN,
        topMargin=MARGIN,
        bottomMargin=0.8*inch
    )
    
    doc.build(story, onFirstPage=draw_dark_background, onLaterPages=draw_dark_background)
    
    # Report
    size_mb = os.path.getsize(output_path) / (1024 * 1024)
    print('=' * 60)
    print(f'SUCCESS!')
    print(f'  Files processed: {total_files}')
    print(f'  Output size: {size_mb:.2f} MB')
    print(f'  Location: {output_path}')
    print('=' * 60)

if __name__ == '__main__':
    generate_pdf()
