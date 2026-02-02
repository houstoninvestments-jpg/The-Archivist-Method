#!/usr/bin/env python3
import os
import re
from reportlab.lib.pagesizes import letter
from reportlab.lib.colors import HexColor
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, ListFlowable, ListItem
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT

COLORS = {
    'background': '#1a1a1a',
    'text': '#FFFFFF',
    'accent': '#14B8A6',
    'muted': '#9CA3AF',
    'pink': '#EC4899',
    'body': '#E5E7EB'
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
    return text

def parse_markdown(content, styles):
    elements = []
    lines = content.split('\n')
    i = 0
    
    while i < len(lines):
        line = lines[i].rstrip()
        
        if line.startswith('# '):
            text = clean_text(line[2:])
            elements.append(Spacer(1, 20))
            elements.append(Paragraph(text.upper(), styles['h1']))
            elements.append(Spacer(1, 15))
        elif line.startswith('## '):
            text = clean_text(line[3:])
            elements.append(Spacer(1, 15))
            elements.append(Paragraph(text.upper(), styles['h2']))
            elements.append(Spacer(1, 10))
        elif line.startswith('### '):
            text = clean_text(line[4:])
            elements.append(Spacer(1, 12))
            elements.append(Paragraph(text, styles['h3']))
            elements.append(Spacer(1, 8))
        elif line.startswith('#### '):
            text = clean_text(line[5:])
            elements.append(Spacer(1, 10))
            elements.append(Paragraph(text, styles['h4']))
            elements.append(Spacer(1, 6))
        elif line.startswith('- ') or line.startswith('* '):
            bullet_items = []
            while i < len(lines) and (lines[i].strip().startswith('- ') or lines[i].strip().startswith('* ')):
                item_text = clean_text(lines[i].strip()[2:])
                bullet_items.append(ListItem(Paragraph(item_text, styles['body']), bulletColor=HexColor(COLORS['accent'])))
                i += 1
            i -= 1
            if bullet_items:
                elements.append(ListFlowable(bullet_items, bulletType='bullet', leftIndent=20))
                elements.append(Spacer(1, 10))
        elif line.startswith('> '):
            quote_text = clean_text(line[2:])
            elements.append(Paragraph(quote_text, styles['quote']))
            elements.append(Spacer(1, 10))
        elif line.startswith('---') or line.startswith('***'):
            elements.append(Spacer(1, 20))
        elif line.strip():
            text = clean_text(line)
            elements.append(Paragraph(text, styles['body']))
            elements.append(Spacer(1, 8))
        
        i += 1
    
    return elements

def create_styles():
    styles = {}
    
    styles['title'] = ParagraphStyle(
        'title',
        fontName='Helvetica-Bold',
        fontSize=36,
        textColor=HexColor(COLORS['text']),
        alignment=TA_CENTER,
        spaceAfter=20
    )
    
    styles['subtitle'] = ParagraphStyle(
        'subtitle',
        fontName='Helvetica-Bold',
        fontSize=18,
        textColor=HexColor(COLORS['text']),
        alignment=TA_CENTER,
        spaceAfter=40
    )
    
    styles['tagline'] = ParagraphStyle(
        'tagline',
        fontName='Helvetica-Oblique',
        fontSize=11,
        textColor=HexColor(COLORS['body']),
        alignment=TA_CENTER,
        spaceAfter=40,
        leading=18
    )
    
    styles['brand'] = ParagraphStyle(
        'brand',
        fontName='Helvetica-Bold',
        fontSize=12,
        textColor=HexColor(COLORS['accent']),
        alignment=TA_CENTER
    )
    
    styles['module_title'] = ParagraphStyle(
        'module_title',
        fontName='Helvetica-Bold',
        fontSize=28,
        textColor=HexColor(COLORS['accent']),
        alignment=TA_CENTER
    )
    
    styles['h1'] = ParagraphStyle(
        'h1',
        fontName='Helvetica-Bold',
        fontSize=18,
        textColor=HexColor(COLORS['text']),
        spaceAfter=15,
        borderWidth=0,
        borderColor=HexColor(COLORS['accent']),
        borderPadding=10
    )
    
    styles['h2'] = ParagraphStyle(
        'h2',
        fontName='Helvetica-Bold',
        fontSize=14,
        textColor=HexColor(COLORS['accent']),
        spaceAfter=10
    )
    
    styles['h3'] = ParagraphStyle(
        'h3',
        fontName='Helvetica-Bold',
        fontSize=12,
        textColor=HexColor(COLORS['text']),
        spaceAfter=8
    )
    
    styles['h4'] = ParagraphStyle(
        'h4',
        fontName='Helvetica-Bold',
        fontSize=11,
        textColor=HexColor(COLORS['muted']),
        spaceAfter=6
    )
    
    styles['body'] = ParagraphStyle(
        'body',
        fontName='Helvetica',
        fontSize=10,
        textColor=HexColor(COLORS['body']),
        alignment=TA_JUSTIFY,
        leading=14,
        spaceAfter=8
    )
    
    styles['quote'] = ParagraphStyle(
        'quote',
        fontName='Helvetica-Oblique',
        fontSize=10,
        textColor=HexColor(COLORS['accent']),
        leftIndent=30,
        leading=14
    )
    
    styles['footer'] = ParagraphStyle(
        'footer',
        fontName='Helvetica',
        fontSize=8,
        textColor=HexColor(COLORS['muted']),
        alignment=TA_CENTER
    )
    
    return styles

def add_page_background(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(HexColor(COLORS['background']))
    canvas.rect(0, 0, letter[0], letter[1], fill=1)
    
    canvas.setFont('Helvetica', 8)
    canvas.setFillColor(HexColor(COLORS['muted']))
    canvas.drawString(inch, 0.5*inch, "THE ARCHIVIST METHOD | CLASSIFIED")
    canvas.drawRightString(letter[0] - inch, 0.5*inch, str(doc.page))
    
    canvas.restoreState()

def generate_pdf():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    content_dir = os.path.join(script_dir, '..', 'content', 'book')
    output_path = os.path.join(script_dir, '..', 'THE-ARCHIVIST-METHOD-COMPLETE-ARCHIVE.pdf')
    
    print('Generating THE ARCHIVIST METHOD™ Complete Archive PDF...\n')
    
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        leftMargin=inch,
        rightMargin=inch,
        topMargin=0.75*inch,
        bottomMargin=0.75*inch
    )
    
    styles = create_styles()
    story = []
    
    story.append(Spacer(1, 150))
    story.append(Paragraph("THE ARCHIVIST METHOD™", styles['title']))
    story.append(Paragraph("COMPLETE ARCHIVE", styles['subtitle']))
    story.append(Paragraph(
        "A systematic approach to identifying and interrupting the destructive patterns "
        "that have been running your life. This is not therapy. This is pattern archaeology—"
        "excavating the programs installed in childhood and replacing them with conscious choice.",
        styles['tagline']
    ))
    story.append(Paragraph("PATTERN ARCHAEOLOGY, NOT THERAPY", styles['brand']))
    story.append(PageBreak())
    
    total_files = 0
    
    for module_name in CONTENT_ORDER:
        module_path = os.path.join(content_dir, module_name)
        
        if not os.path.exists(module_path):
            print(f'  Skipping {module_name} (not found)')
            continue
        
        title = MODULE_TITLES.get(module_name, module_name.upper())
        
        story.append(Spacer(1, 200))
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
    doc.build(story, onFirstPage=add_page_background, onLaterPages=add_page_background)
    
    file_size = os.path.getsize(output_path) / (1024 * 1024)
    print(f'\nPDF Generated Successfully!')
    print(f'  Total files processed: {total_files}')
    print(f'  File size: {file_size:.2f} MB')
    print(f'  Output: {output_path}')

if __name__ == '__main__':
    generate_pdf()
