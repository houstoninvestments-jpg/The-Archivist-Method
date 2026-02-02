#!/usr/bin/env python3
import os
import re
from reportlab.lib.pagesizes import letter
from reportlab.lib.colors import HexColor, white, black
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer, PageBreak, ListFlowable, ListItem
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY
from reportlab.pdfgen import canvas

COLORS = {
    'background': '#0A0A0A',
    'text': '#FFFFFF',
    'accent': '#14B8A6',
    'muted': '#6B7280',
    'pink': '#EC4899',
    'body': '#D1D5DB'
}

CONTENT_ORDER = [
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
]

MODULE_TITLES = {
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
}

def get_files_in_order(module_path):
    if not os.path.exists(module_path):
        return []
    
    items = os.listdir(module_path)
    files = []
    subdirs = []
    
    for item in items:
        item_path = os.path.join(module_path, item)
        if os.path.isdir(item_path):
            subdirs.append(item)
        elif item.endswith('.md'):
            files.append(item)
    
    def sort_key(f):
        match = re.match(r'^([\d.]+)', f)
        return float(match.group(1)) if match else 999
    
    files.sort(key=sort_key)
    subdirs.sort()
    
    result = [os.path.join(module_path, f) for f in files]
    
    for subdir in subdirs:
        subdir_path = os.path.join(module_path, subdir)
        result.extend(get_files_in_order(subdir_path))
    
    return result

def clean_text(text):
    text = re.sub(r'\*\*([^*]+)\*\*', r'<b>\1</b>', text)
    text = re.sub(r'\*([^*]+)\*', r'<i>\1</i>', text)
    text = re.sub(r'_([^_]+)_', r'<i>\1</i>', text)
    text = re.sub(r'`([^`]+)`', r'<font color="#14B8A6">\1</font>', text)
    text = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', text)
    text = text.replace('&', '&amp;')
    text = text.replace('<b>', '<<<BOLD>>>').replace('</b>', '<<<ENDBOLD>>>')
    text = text.replace('<i>', '<<<ITALIC>>>').replace('</i>', '<<<ENDITALIC>>>')
    text = text.replace('<font', '<<<FONT').replace('</font>', '<<<ENDFONT>>>')
    text = text.replace('<', '&lt;').replace('>', '&gt;')
    text = text.replace('<<<BOLD>>>', '<b>').replace('<<<ENDBOLD>>>', '</b>')
    text = text.replace('<<<ITALIC>>>', '<i>').replace('<<<ENDITALIC>>>', '</i>')
    text = text.replace('<<<FONT', '<font').replace('<<<ENDFONT>>>', '</font>')
    return text

def parse_markdown(content, styles):
    elements = []
    lines = content.split('\n')
    i = 0
    
    while i < len(lines):
        line = lines[i].rstrip()
        
        if line.startswith('# '):
            text = clean_text(line[2:])
            elements.append(Spacer(1, 24))
            elements.append(Paragraph(text.upper(), styles['h1']))
            elements.append(Spacer(1, 16))
        elif line.startswith('## '):
            text = clean_text(line[3:])
            elements.append(Spacer(1, 18))
            elements.append(Paragraph(text.upper(), styles['h2']))
            elements.append(Spacer(1, 12))
        elif line.startswith('### '):
            text = clean_text(line[4:])
            elements.append(Spacer(1, 14))
            elements.append(Paragraph(text, styles['h3']))
            elements.append(Spacer(1, 10))
        elif line.startswith('#### '):
            text = clean_text(line[5:])
            elements.append(Spacer(1, 12))
            elements.append(Paragraph(text, styles['h4']))
            elements.append(Spacer(1, 8))
        elif line.startswith('- ') or line.startswith('* '):
            bullet_items = []
            while i < len(lines) and (lines[i].strip().startswith('- ') or lines[i].strip().startswith('* ')):
                item_text = clean_text(lines[i].strip()[2:])
                bullet_items.append(ListItem(Paragraph(item_text, styles['body']), bulletColor=HexColor(COLORS['accent'])))
                i += 1
            i -= 1
            if bullet_items:
                elements.append(ListFlowable(bullet_items, bulletType='bullet', leftIndent=20))
                elements.append(Spacer(1, 12))
        elif line.startswith('> '):
            quote_text = clean_text(line[2:])
            elements.append(Paragraph(quote_text, styles['quote']))
            elements.append(Spacer(1, 12))
        elif line.startswith('---') or line.startswith('***'):
            elements.append(Spacer(1, 24))
        elif line.strip():
            text = clean_text(line)
            try:
                elements.append(Paragraph(text, styles['body']))
                elements.append(Spacer(1, 10))
            except:
                pass
        
        i += 1
    
    return elements

def create_styles():
    styles = {}
    
    styles['title'] = ParagraphStyle(
        'title',
        fontName='Helvetica-Bold',
        fontSize=42,
        textColor=HexColor(COLORS['text']),
        alignment=TA_CENTER,
        spaceAfter=24,
        leading=50
    )
    
    styles['subtitle'] = ParagraphStyle(
        'subtitle',
        fontName='Helvetica-Bold',
        fontSize=20,
        textColor=HexColor(COLORS['accent']),
        alignment=TA_CENTER,
        spaceAfter=48
    )
    
    styles['tagline'] = ParagraphStyle(
        'tagline',
        fontName='Helvetica-Oblique',
        fontSize=11,
        textColor=HexColor(COLORS['body']),
        alignment=TA_CENTER,
        spaceAfter=48,
        leading=18
    )
    
    styles['brand'] = ParagraphStyle(
        'brand',
        fontName='Helvetica-Bold',
        fontSize=14,
        textColor=HexColor(COLORS['accent']),
        alignment=TA_CENTER,
        spaceBefore=40
    )
    
    styles['module_title'] = ParagraphStyle(
        'module_title',
        fontName='Helvetica-Bold',
        fontSize=32,
        textColor=HexColor(COLORS['text']),
        alignment=TA_CENTER,
        leading=40
    )
    
    styles['h1'] = ParagraphStyle(
        'h1',
        fontName='Helvetica-Bold',
        fontSize=20,
        textColor=HexColor(COLORS['text']),
        spaceAfter=16,
        leading=26
    )
    
    styles['h2'] = ParagraphStyle(
        'h2',
        fontName='Helvetica-Bold',
        fontSize=15,
        textColor=HexColor(COLORS['accent']),
        spaceAfter=12,
        leading=20
    )
    
    styles['h3'] = ParagraphStyle(
        'h3',
        fontName='Helvetica-Bold',
        fontSize=13,
        textColor=HexColor(COLORS['text']),
        spaceAfter=10,
        leading=18
    )
    
    styles['h4'] = ParagraphStyle(
        'h4',
        fontName='Helvetica-Bold',
        fontSize=11,
        textColor=HexColor(COLORS['muted']),
        spaceAfter=8,
        leading=16
    )
    
    styles['body'] = ParagraphStyle(
        'body',
        fontName='Helvetica',
        fontSize=10,
        textColor=HexColor(COLORS['body']),
        alignment=TA_JUSTIFY,
        leading=15,
        spaceAfter=10
    )
    
    styles['quote'] = ParagraphStyle(
        'quote',
        fontName='Helvetica-Oblique',
        fontSize=10,
        textColor=HexColor(COLORS['accent']),
        leftIndent=30,
        leading=15
    )
    
    return styles

class DarkBackgroundDocTemplate(BaseDocTemplate):
    def __init__(self, filename, **kwargs):
        BaseDocTemplate.__init__(self, filename, **kwargs)
        
        frame = Frame(
            inch, 
            inch, 
            letter[0] - 2*inch, 
            letter[1] - 2*inch,
            id='normal'
        )
        
        template = PageTemplate(
            id='dark',
            frames=frame,
            onPage=self.add_dark_background
        )
        
        self.addPageTemplates([template])
    
    def add_dark_background(self, canvas_obj, doc):
        canvas_obj.saveState()
        
        canvas_obj.setFillColor(HexColor(COLORS['background']))
        canvas_obj.rect(0, 0, letter[0], letter[1], fill=1, stroke=0)
        
        canvas_obj.setFont('Helvetica', 8)
        canvas_obj.setFillColor(HexColor(COLORS['muted']))
        canvas_obj.drawString(inch, 0.5*inch, "THE ARCHIVIST METHOD™ | CLASSIFIED")
        canvas_obj.drawRightString(letter[0] - inch, 0.5*inch, f"Page {doc.page}")
        
        canvas_obj.setStrokeColor(HexColor(COLORS['accent']))
        canvas_obj.setLineWidth(0.5)
        canvas_obj.line(inch, 0.75*inch, letter[0] - inch, 0.75*inch)
        
        canvas_obj.restoreState()

def generate_pdf():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    content_dir = os.path.join(script_dir, '..', 'content', 'book')
    output_path = os.path.join(script_dir, '..', 'THE-ARCHIVIST-METHOD-COMPLETE-ARCHIVE.pdf')
    
    print('Generating THE ARCHIVIST METHOD™ Complete Archive PDF...\n')
    
    doc = DarkBackgroundDocTemplate(
        output_path,
        pagesize=letter,
        leftMargin=inch,
        rightMargin=inch,
        topMargin=inch,
        bottomMargin=inch
    )
    
    styles = create_styles()
    story = []
    
    story.append(Spacer(1, 180))
    story.append(Paragraph("THE ARCHIVIST<br/>METHOD™", styles['title']))
    story.append(Spacer(1, 20))
    story.append(Paragraph("COMPLETE ARCHIVE", styles['subtitle']))
    story.append(Spacer(1, 30))
    story.append(Paragraph(
        "A systematic approach to identifying and interrupting the destructive patterns "
        "that have been running your life. This is not therapy. This is pattern archaeology—"
        "excavating the programs installed in childhood and replacing them with conscious choice.",
        styles['tagline']
    ))
    story.append(Paragraph("PATTERN ARCHAEOLOGY, <font color='#EC4899'>NOT</font> THERAPY", styles['brand']))
    story.append(PageBreak())
    
    total_files = 0
    
    for module_name in CONTENT_ORDER:
        module_path = os.path.join(content_dir, module_name)
        
        if not os.path.exists(module_path):
            print(f'  Skipping {module_name} (not found)')
            continue
        
        title = MODULE_TITLES.get(module_name, module_name.upper())
        
        story.append(Spacer(1, 220))
        story.append(Paragraph(title, styles['module_title']))
        story.append(PageBreak())
        
        files = get_files_in_order(module_path)
        print(f'  Processing {module_name}: {len(files)} files')
        
        for file_path in files:
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                elements = parse_markdown(content, styles)
                story.extend(elements)
                story.append(PageBreak())
                total_files += 1
            except Exception as e:
                print(f'    Error processing {os.path.basename(file_path)}: {e}')
    
    print('  Building PDF...')
    doc.build(story)
    
    file_size = os.path.getsize(output_path) / (1024 * 1024)
    print(f'\nPDF Generated Successfully!')
    print(f'  Total files processed: {total_files}')
    print(f'  File size: {file_size:.2f} MB')
    print(f'  Output: {output_path}')

if __name__ == '__main__':
    generate_pdf()
