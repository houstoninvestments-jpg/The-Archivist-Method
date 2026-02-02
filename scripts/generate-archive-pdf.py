#!/usr/bin/env python3
"""
THE ARCHIVIST METHOD™ - COMPLETE ARCHIVE PDF GENERATOR
Premium $197 product - 145 markdown files → Professional PDF
Optimized version using standard reportlab flowables
"""

import os
import re
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY
from reportlab.platypus import (
    BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer, 
    PageBreak, Image, NextPageTemplate
)

# Brand Colors
DARK_BG = HexColor('#1A1A1A')
WHITE = HexColor('#FFFFFF')
LIGHT_GRAY = HexColor('#E5E5E5')
TEAL = HexColor('#14B8A6')
PINK = HexColor('#EC4899')
DARK_GRAY = HexColor('#888888')

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
        'title': ParagraphStyle('Title', fontSize=48, textColor=WHITE, alignment=TA_CENTER, fontName='Helvetica-Bold', leading=56),
        'subtitle': ParagraphStyle('Subtitle', fontSize=32, textColor=WHITE, alignment=TA_CENTER, fontName='Helvetica', leading=40),
        'tagline': ParagraphStyle('Tagline', fontSize=14, textColor=LIGHT_GRAY, alignment=TA_CENTER, fontName='Helvetica-Oblique', leading=22),
        'brand': ParagraphStyle('Brand', fontSize=16, textColor=TEAL, alignment=TA_CENTER, fontName='Helvetica-Bold'),
        'module_label': ParagraphStyle('ModuleLabel', fontSize=14, textColor=TEAL, alignment=TA_CENTER, fontName='Helvetica-Bold'),
        'module_title': ParagraphStyle('ModuleTitle', fontSize=36, textColor=WHITE, alignment=TA_CENTER, fontName='Helvetica-Bold', leading=44),
        'toc_title': ParagraphStyle('TOCTitle', fontSize=28, textColor=WHITE, alignment=TA_CENTER, fontName='Helvetica-Bold'),
        'toc_entry': ParagraphStyle('TOCEntry', fontSize=12, textColor=LIGHT_GRAY, fontName='Helvetica', leading=24),
        'h1': ParagraphStyle('H1', fontSize=24, textColor=WHITE, fontName='Helvetica-Bold', spaceBefore=24, spaceAfter=12, leading=30),
        'h2': ParagraphStyle('H2', fontSize=18, textColor=TEAL, fontName='Helvetica-Bold', spaceBefore=18, spaceAfter=8, leading=24),
        'h3': ParagraphStyle('H3', fontSize=14, textColor=WHITE, fontName='Helvetica-Bold', spaceBefore=14, spaceAfter=6, leading=20),
        'h4': ParagraphStyle('H4', fontSize=12, textColor=LIGHT_GRAY, fontName='Helvetica-Bold', spaceBefore=12, spaceAfter=6, leading=18),
        'body': ParagraphStyle('Body', fontSize=11, textColor=LIGHT_GRAY, fontName='Helvetica', alignment=TA_JUSTIFY, leading=17, spaceAfter=10),
        'quote': ParagraphStyle('Quote', fontSize=11, textColor=TEAL, fontName='Helvetica-Oblique', leftIndent=30, leading=17, spaceAfter=12),
        'bullet': ParagraphStyle('Bullet', fontSize=11, textColor=LIGHT_GRAY, fontName='Helvetica', leftIndent=25, leading=17, spaceAfter=6, bulletIndent=10),
    }

def clean_text(text):
    """Clean markdown formatting to reportlab tags"""
    # Custom tags
    text = re.sub(r'<<<BOLD>>>(.*?)<<<ENDBOLD>>>', r'<b>\1</b>', text, flags=re.DOTALL)
    text = re.sub(r'<<<ITALIC>>>(.*?)<<<ENDITALIC>>>', r'<i>\1</i>', text, flags=re.DOTALL)
    
    # Standard markdown
    text = re.sub(r'\*\*\*([^*]+)\*\*\*', r'<b><i>\1</i></b>', text)
    text = re.sub(r'\*\*([^*]+)\*\*', r'<b>\1</b>', text)
    text = re.sub(r'(?<!\*)\*([^*]+)\*(?!\*)', r'<i>\1</i>', text)
    text = re.sub(r'__([^_]+)__', r'<b>\1</b>', text)
    text = re.sub(r'(?<!_)_([^_]+)_(?!_)', r'<i>\1</i>', text)
    text = re.sub(r'`([^`]+)`', r'<font color="#14B8A6">\1</font>', text)
    text = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', text)
    
    # Clean artifacts
    text = text.replace('<<<', '').replace('>>>', '')
    
    # Escape XML (protect our tags first)
    text = text.replace('&', '&amp;')
    text = text.replace('<b>', '[[B]]').replace('</b>', '[[/B]]')
    text = text.replace('<i>', '[[I]]').replace('</i>', '[[/I]]')
    text = text.replace('<font', '[[FONT').replace('</font>', '[[/FONT]]')
    text = text.replace('<', '&lt;').replace('>', '&gt;')
    text = text.replace('[[B]]', '<b>').replace('[[/B]]', '</b>')
    text = text.replace('[[I]]', '<i>').replace('[[/I]]', '</i>')
    text = text.replace('[[FONT', '<font').replace('[[/FONT]]', '</font>')
    
    return text

def parse_markdown(content, styles):
    """Fast markdown parser"""
    elements = []
    lines = content.split('\n')
    i = 0
    
    while i < len(lines):
        line = lines[i].rstrip()
        
        if not line.strip():
            i += 1
            continue
            
        if line.startswith('# '):
            elements.append(Paragraph(clean_text(line[2:]).upper(), styles['h1']))
        elif line.startswith('## '):
            elements.append(Paragraph(clean_text(line[3:]), styles['h2']))
        elif line.startswith('### '):
            elements.append(Paragraph(clean_text(line[4:]), styles['h3']))
        elif line.startswith('#### '):
            elements.append(Paragraph(clean_text(line[5:]), styles['h4']))
        elif line.strip() in ['---', '***', '___']:
            elements.append(Spacer(1, 20))
        elif line.startswith('> '):
            elements.append(Paragraph(clean_text(line[2:]), styles['quote']))
        elif line.strip().startswith('- ') or line.strip().startswith('* '):
            text = clean_text(line.strip()[2:])
            elements.append(Paragraph(f'<font color="#14B8A6">•</font>  {text}', styles['bullet']))
        elif re.match(r'^\d+\.\s', line.strip()):
            num_match = re.match(r'^(\d+)\.\s*(.+)', line.strip())
            if num_match:
                num, text = num_match.groups()
                elements.append(Paragraph(f'<font color="#14B8A6">{num}.</font>  {clean_text(text)}', styles['bullet']))
        elif line.strip():
            try:
                elements.append(Paragraph(clean_text(line), styles['body']))
            except:
                pass
        
        i += 1
    
    return elements

def get_files_in_order(module_path):
    if not os.path.exists(module_path):
        return []
    
    items = os.listdir(module_path)
    files = [f for f in items if f.endswith('.md') and not os.path.isdir(os.path.join(module_path, f))]
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

class ArchivistDoc(BaseDocTemplate):
    def __init__(self, filename, **kwargs):
        BaseDocTemplate.__init__(self, filename, **kwargs)
        frame = Frame(MARGIN, MARGIN + 0.5*inch, PAGE_WIDTH - 2*MARGIN, PAGE_HEIGHT - 2*MARGIN - 0.5*inch, id='main')
        self.addPageTemplates([
            PageTemplate(id='title', frames=frame, onPage=self.title_page),
            PageTemplate(id='content', frames=frame, onPage=self.content_page)
        ])
    
    def title_page(self, c, doc):
        c.saveState()
        c.setFillColor(DARK_BG)
        c.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, fill=1, stroke=0)
        c.restoreState()
    
    def content_page(self, c, doc):
        c.saveState()
        c.setFillColor(DARK_BG)
        c.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, fill=1, stroke=0)
        c.setStrokeColor(TEAL)
        c.setLineWidth(0.5)
        c.line(MARGIN, 0.6*inch, PAGE_WIDTH - MARGIN, 0.6*inch)
        c.setFillColor(DARK_GRAY)
        c.setFont('Helvetica', 9)
        c.drawString(MARGIN, 0.4*inch, "THE ARCHIVIST METHOD™ | CLASSIFIED")
        c.drawRightString(PAGE_WIDTH - MARGIN, 0.4*inch, str(doc.page))
        c.restoreState()

def generate_pdf():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    base_dir = os.path.join(script_dir, '..')
    content_dir = os.path.join(base_dir, 'content', 'book')
    output_path = os.path.join(base_dir, 'THE-ARCHIVIST-METHOD-COMPLETE-ARCHIVE.pdf')
    logo_path = os.path.join(base_dir, 'attached_assets', 'archivist-portrait-circle.jpg')
    
    print('THE ARCHIVIST METHOD™ - COMPLETE ARCHIVE PDF GENERATOR')
    print('=' * 55)
    
    styles = create_styles()
    story = []
    
    # Title Page
    story.append(Spacer(1, 80))
    if os.path.exists(logo_path):
        try:
            logo = Image(logo_path, width=150, height=150)
            logo.hAlign = 'CENTER'
            story.append(logo)
            story.append(Spacer(1, 40))
        except:
            pass
    
    story.append(Paragraph("THE ARCHIVIST METHOD™", styles['title']))
    story.append(Spacer(1, 10))
    story.append(Paragraph("COMPLETE ARCHIVE", styles['subtitle']))
    story.append(Spacer(1, 40))
    story.append(Paragraph("The complete system for identifying and interrupting<br/>the patterns destroying your life.", styles['tagline']))
    story.append(Spacer(1, 30))
    story.append(Paragraph('PATTERN ARCHAEOLOGY, <font color="#EC4899">NOT</font> THERAPY', styles['brand']))
    story.append(NextPageTemplate('content'))
    story.append(PageBreak())
    
    # Table of Contents
    story.append(Spacer(1, 60))
    story.append(Paragraph("TABLE OF CONTENTS", styles['toc_title']))
    story.append(Spacer(1, 30))
    for name in CONTENT_ORDER:
        if name in MODULE_TITLES:
            label, title = MODULE_TITLES[name]
            entry = f'<font color="#14B8A6">{label}:</font> {title}' if label else f'<font color="#14B8A6">{title}</font>'
            story.append(Paragraph(entry, styles['toc_entry']))
            story.append(Spacer(1, 8))
    story.append(PageBreak())
    
    # Modules
    total_files = 0
    for module_name in CONTENT_ORDER:
        module_path = os.path.join(content_dir, module_name)
        if not os.path.exists(module_path):
            continue
        
        label, title = MODULE_TITLES.get(module_name, ('', module_name.upper()))
        
        # Module title page
        story.append(Spacer(1, 200))
        if label:
            story.append(Paragraph(label, styles['module_label']))
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
            except Exception as e:
                print(f'    Error: {os.path.basename(file_path)}')
    
    print('Building PDF...')
    doc = ArchivistDoc(output_path, pagesize=letter)
    doc.build(story)
    
    size_mb = os.path.getsize(output_path) / (1024 * 1024)
    print(f'\nDone! {total_files} files, {size_mb:.2f} MB')
    print(f'Output: {output_path}')

if __name__ == '__main__':
    generate_pdf()
