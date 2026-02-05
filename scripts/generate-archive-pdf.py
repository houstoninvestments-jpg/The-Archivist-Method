#!/usr/bin/env python3
"""
THE ARCHIVIST METHOD™ - COMPLETE ARCHIVE PDF GENERATOR
Matches Crash Course PDF aesthetic exactly - dark background, bold typography
"""

import os
import re
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Flowable
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

class CircularLogo(Flowable):
    """Custom flowable to draw logo with dark background mask"""
    def __init__(self, image_path, size=140):
        Flowable.__init__(self)
        self.image_path = image_path
        self.size = size
        self.width = size
        self.height = size
    
    def draw(self):
        # Draw dark circle background first (larger than logo to mask any transparency)
        self.canv.setFillColor(DARK_BG)
        center_x = self.size / 2
        center_y = self.size / 2
        self.canv.circle(center_x, center_y, self.size / 2 + 5, fill=1, stroke=0)
        
        # Draw teal/pink gradient ring
        self.canv.setStrokeColor(TEAL)
        self.canv.setLineWidth(3)
        self.canv.circle(center_x, center_y, self.size / 2 + 2, fill=0, stroke=1)
        
        # Draw the logo image
        from reportlab.lib.utils import ImageReader
        try:
            img = ImageReader(self.image_path)
            self.canv.drawImage(img, 0, 0, self.size, self.size, mask='auto')
        except:
            pass

def create_styles():
    """Create styles matching Crash Course PDF - bold, impactful typography"""
    return {
        'main_title': ParagraphStyle(
            'MainTitle', fontSize=48, textColor=WHITE, alignment=TA_CENTER, 
            fontName='Helvetica-Bold', leading=56
        ),
        'archive_title': ParagraphStyle(
            'ArchiveTitle', fontSize=36, textColor=TEAL, alignment=TA_CENTER, 
            fontName='Helvetica-Bold', leading=44
        ),
        'tagline': ParagraphStyle(
            'Tagline', fontSize=14, textColor=MEDIUM_GRAY, alignment=TA_CENTER, 
            fontName='Helvetica-Oblique', leading=22
        ),
        'brand': ParagraphStyle(
            'Brand', fontSize=16, textColor=WHITE, alignment=TA_CENTER, 
            fontName='Helvetica-Bold', leading=24
        ),
        'module_label': ParagraphStyle(
            'ModuleLabel', fontSize=18, textColor=TEAL, alignment=TA_CENTER, 
            fontName='Helvetica-Bold', leading=26
        ),
        'module_title': ParagraphStyle(
            'ModuleTitle', fontSize=40, textColor=WHITE, alignment=TA_CENTER, 
            fontName='Helvetica-Bold', leading=48
        ),
        'toc_title': ParagraphStyle(
            'TOCTitle', fontSize=28, textColor=WHITE, alignment=TA_CENTER, 
            fontName='Helvetica-Bold', leading=36, spaceAfter=30
        ),
        'toc_entry': ParagraphStyle(
            'TOCEntry', fontSize=13, textColor=LIGHT_GRAY, fontName='Helvetica', 
            leading=28, leftIndent=20
        ),
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
        'callout': ParagraphStyle(
            'Callout', fontSize=12, textColor=TEAL, fontName='Helvetica-Bold',
            spaceBefore=16, spaceAfter=8, leading=18
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

def strip_emoji(text):
    """Remove all emoji characters from text"""
    emoji_pattern = re.compile(
        "["
        "\U0001F600-\U0001F64F"  # emoticons
        "\U0001F300-\U0001F5FF"  # symbols & pictographs
        "\U0001F680-\U0001F6FF"  # transport & map symbols
        "\U0001F700-\U0001F77F"  # alchemical symbols
        "\U0001F780-\U0001F7FF"  # Geometric Shapes Extended
        "\U0001F800-\U0001F8FF"  # Supplemental Arrows-C
        "\U0001F900-\U0001F9FF"  # Supplemental Symbols and Pictographs
        "\U0001FA00-\U0001FA6F"  # Chess Symbols
        "\U0001FA70-\U0001FAFF"  # Symbols and Pictographs Extended-A
        "\U00002702-\U000027B0"  # Dingbats
        "\U000024C2-\U0001F251"
        "\U0001f926-\U0001f937"
        "\U00010000-\U0010ffff"
        "\u200d"
        "\u2640-\u2642"
        "\u2600-\u2B55"
        "\u23cf"
        "\u23e9"
        "\u231a"
        "\ufe0f"
        "\u3030"
        "\u2934"
        "\u2935"
        "\u25aa-\u25ab"
        "\u25b6"
        "\u25c0"
        "\u25fb-\u25fe"
        "\u2614-\u2615"
        "\u2648-\u2653"
        "\u267f"
        "\u2693"
        "\u26a1"
        "\u26aa-\u26ab"
        "\u26bd-\u26be"
        "\u26c4-\u26c5"
        "\u26ce"
        "\u26d4"
        "\u26ea"
        "\u26f2-\u26f3"
        "\u26f5"
        "\u26fa"
        "\u26fd"
        "\u2702"
        "\u2705"
        "\u2708-\u270d"
        "\u270f"
        "\u2712"
        "\u2714"
        "\u2716"
        "\u271d"
        "\u2721"
        "\u2728"
        "\u2733-\u2734"
        "\u2744"
        "\u2747"
        "\u274c"
        "\u274e"
        "\u2753-\u2755"
        "\u2757"
        "\u2763-\u2764"
        "\u2795-\u2797"
        "\u27a1"
        "\u27b0"
        "\u27bf"
        "\u2b05-\u2b07"
        "\u2b1b-\u2b1c"
        "\u2b50"
        "\u2b55"
        "\u231a-\u231b"
        "\u23e9-\u23f3"
        "\u23f8-\u23fa"
        "\U0001F48E"  # gem/diamond emoji
        "]+", flags=re.UNICODE
    )
    return emoji_pattern.sub('', text)

def clean_text(text):
    """Clean markdown, strip emoji, and escape special characters"""
    # Strip emoji first
    text = strip_emoji(text)
    
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
    
    return text.strip()

def parse_markdown(content, styles):
    """Parse markdown content into PDF elements"""
    elements = []
    
    for line in content.split('\n'):
        line = line.rstrip()
        if not line.strip():
            continue
        
        # Strip emoji from the line first
        line = strip_emoji(line)
        
        # Skip empty lines after emoji removal
        if not line.strip():
            continue
        
        try:
            # Check for GOLD NUGGET or similar callout sections
            if 'GOLD NUGGET' in line.upper():
                elements.append(Paragraph('<font color="#14B8A6">GOLD NUGGET</font>', styles['callout']))
                continue
            
            if line.startswith('# '):
                text = clean_text(line[2:]).upper()
                if text:
                    elements.append(Paragraph(text, styles['h1']))
            elif line.startswith('## '):
                text = clean_text(line[3:])
                if text:
                    elements.append(Paragraph(text, styles['h2']))
            elif line.startswith('### '):
                text = clean_text(line[4:])
                if text:
                    elements.append(Paragraph(text, styles['h3']))
            elif line.startswith('#### '):
                text = clean_text(line[5:])
                if text:
                    elements.append(Paragraph(text, styles['h4']))
            elif line.strip() in ['---', '***', '___']:
                elements.append(Spacer(1, 20))
            elif line.startswith('> '):
                quote_text = clean_text(line[2:])
                if quote_text:
                    elements.append(Paragraph(f'"{quote_text}"', styles['quote']))
            elif line.strip().startswith('- ') or line.strip().startswith('* '):
                text = clean_text(line.strip()[2:])
                if text:
                    bullet = '<font color="#14B8A6"><b>•</b></font>'
                    elements.append(Paragraph(f'{bullet}  {text}', styles['bullet']))
            elif re.match(r'^\d+\.\s', line.strip()):
                match = re.match(r'^(\d+)\.\s*(.+)', line.strip())
                if match:
                    num, text = match.groups()
                    text = clean_text(text)
                    if text:
                        num_styled = f'<font color="#14B8A6"><b>{num}.</b></font>'
                        elements.append(Paragraph(f'{num_styled}  {text}', styles['bullet']))
            elif line.strip():
                text = clean_text(line)
                if text:
                    elements.append(Paragraph(text, styles['body']))
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
    
    # Logo with dark background mask and teal ring
    if os.path.exists(logo_path):
        logo = CircularLogo(logo_path, size=140)
        from reportlab.platypus import KeepInFrame
        # Center the logo
        from reportlab.platypus import Table, TableStyle
        logo_table = Table([[logo]], colWidths=[PAGE_WIDTH - 2*MARGIN])
        logo_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ]))
        story.append(logo_table)
        story.append(Spacer(1, 40))
    
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
