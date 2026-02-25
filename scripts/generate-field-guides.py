#!/usr/bin/env python3
"""
THE ARCHIVIST METHOD - FIELD GUIDE PDF GENERATOR
Generates 9 personalized Field Guide PDFs, one per pattern.
Matches Complete Archive / Crash Course aesthetic exactly.
"""

import os
import re
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak, Flowable,
    Table, TableStyle
)
from reportlab.pdfgen import canvas

DARK_BG = HexColor('#1A1A1A')
WHITE = HexColor('#FFFFFF')
LIGHT_GRAY = HexColor('#E5E5E5')
MEDIUM_GRAY = HexColor('#888888')
TEAL = HexColor('#14B8A6')
PINK = HexColor('#EC4899')

PAGE_WIDTH, PAGE_HEIGHT = letter
MARGIN = 1.0 * inch

PATTERNS = [
    {
        'id': 'disappearing',
        'name': 'THE DISAPPEARING PATTERN',
        'dir': 'pattern-1-disappearing',
        'prefix': '1',
        'filename': 'THE-ARCHIVIST-METHOD-FIELD-GUIDE-DISAPPEARING.pdf',
        'summary': 'You leave before they can leave you. When relationships get close, you feel walls closing in. You ghost, pull away, or end things before they can end you.',
        'signs': 'Relationships that never get past 3 months. Serial almost-relationships. Chronic loneliness despite meeting people.',
    },
    {
        'id': 'apology-loop',
        'name': 'THE APOLOGY LOOP',
        'dir': 'pattern-2-apology-loop',
        'prefix': '2',
        'filename': 'THE-ARCHIVIST-METHOD-FIELD-GUIDE-APOLOGY-LOOP.pdf',
        'summary': 'You apologize for existing. For asking. For needing. You make yourself small before anyone can tell you you\'re too much.',
        'signs': 'Starting sentences with "sorry." Minimizing your needs. Feeling like a burden. Can\'t negotiate or set boundaries.',
    },
    {
        'id': 'testing',
        'name': 'THE TESTING PATTERN',
        'dir': 'pattern-3-testing',
        'prefix': '3',
        'filename': 'THE-ARCHIVIST-METHOD-FIELD-GUIDE-TESTING.pdf',
        'summary': 'You don\'t ask if they love you--you make them prove it. You create tests to see if they\'ll stay. Most people fail.',
        'signs': 'Late-night fights. Loaded questions. Pushing people away to see if they\'ll fight to stay.',
    },
    {
        'id': 'attraction-to-harm',
        'name': 'ATTRACTION TO HARM',
        'dir': 'pattern-4-attraction-to-harm',
        'prefix': '4',
        'filename': 'THE-ARCHIVIST-METHOD-FIELD-GUIDE-ATTRACTION-TO-HARM.pdf',
        'summary': 'The safe ones bore you. Red flags feel like chemistry. You confuse chaos for connection.',
        'signs': 'History of toxic relationships. Good people feel "off." Drawn to unavailable or harmful partners.',
    },
    {
        'id': 'draining-bond',
        'name': 'THE DRAINING BOND',
        'dir': 'pattern-5-draining-bond',
        'prefix': '5',
        'filename': 'THE-ARCHIVIST-METHOD-FIELD-GUIDE-DRAINING-BOND.pdf',
        'summary': 'You know you should leave. Everyone tells you to leave. You stay. Guilt keeps you locked in.',
        'signs': 'Years in situations you\'ve outgrown. Can\'t leave without feeling like the bad guy. Slow disappearance of self.',
    },
    {
        'id': 'compliment-deflection',
        'name': 'COMPLIMENT DEFLECTION',
        'dir': 'pattern-6-compliment-deflection',
        'prefix': '6',
        'filename': 'THE-ARCHIVIST-METHOD-FIELD-GUIDE-COMPLIMENT-DEFLECTION.pdf',
        'summary': 'Praise makes you flinch. You deflect, minimize, explain why it wasn\'t that good. Visibility feels dangerous.',
        'signs': 'Career stagnation despite talent. Can\'t accept acknowledgment. Hide your best work.',
    },
    {
        'id': 'perfectionism',
        'name': 'THE PERFECTIONISM PATTERN',
        'dir': 'pattern-7-perfectionism',
        'prefix': '7',
        'filename': 'THE-ARCHIVIST-METHOD-FIELD-GUIDE-PERFECTIONISM.pdf',
        'summary': 'If it\'s not perfect, it\'s garbage. So you don\'t finish. Or you don\'t start. The gap between vision and output paralyzes you.',
        'signs': 'Projects that never launch. Ideas that die in your head. Endless tweaking instead of shipping.',
    },
    {
        'id': 'success-sabotage',
        'name': 'SUCCESS SABOTAGE',
        'dir': 'pattern-8-success-sabotage',
        'prefix': '8',
        'filename': 'THE-ARCHIVIST-METHOD-FIELD-GUIDE-SUCCESS-SABOTAGE.pdf',
        'summary': 'You get close, then blow it up. Right before the win, you pull the pin. You\'re not afraid of failure--you\'re afraid of success.',
        'signs': 'Pattern of almost-then-not. Destroying things right before breakthrough. Self-fulfilling prophecy of failure.',
    },
    {
        'id': 'rage',
        'name': 'THE RAGE PATTERN',
        'dir': 'pattern-9-rage',
        'prefix': '9',
        'filename': 'THE-ARCHIVIST-METHOD-FIELD-GUIDE-RAGE.pdf',
        'summary': 'It comes fast. One second fine, next second saying things you can\'t take back. The anger runs you.',
        'signs': 'Damaged relationships from words you didn\'t mean. Regret after outbursts. A version of yourself you\'re ashamed of.',
    },
]


class CircularLogo(Flowable):
    def __init__(self, image_path, size=140):
        Flowable.__init__(self)
        self.image_path = image_path
        self.size = size
        self.width = size
        self.height = size

    def draw(self):
        self.canv.setFillColor(DARK_BG)
        cx, cy = self.size / 2, self.size / 2
        self.canv.circle(cx, cy, self.size / 2 + 5, fill=1, stroke=0)
        self.canv.setStrokeColor(TEAL)
        self.canv.setLineWidth(3)
        self.canv.circle(cx, cy, self.size / 2 + 2, fill=0, stroke=1)
        from reportlab.lib.utils import ImageReader
        try:
            img = ImageReader(self.image_path)
            self.canv.drawImage(img, 0, 0, self.size, self.size, mask='auto')
        except:
            pass


class TealRule(Flowable):
    def __init__(self, width=None):
        Flowable.__init__(self)
        self.rule_width = width or (PAGE_WIDTH - 2 * MARGIN)
        self.width = self.rule_width
        self.height = 6

    def draw(self):
        self.canv.setStrokeColor(TEAL)
        self.canv.setLineWidth(1)
        self.canv.line(0, 3, self.rule_width, 3)


class FourDoorsFlowable(Flowable):
    def __init__(self):
        Flowable.__init__(self)
        self.width = PAGE_WIDTH - 2 * MARGIN
        self.height = 480

    def draw(self):
        cx = self.width / 2
        box_w, box_h = 180, 80
        start_y = self.height - 20
        doors = [
            ("DOOR 1", "RECOGNITION", "See the pattern"),
            ("DOOR 2", "EXCAVATION", "Understand the origin"),
            ("DOOR 3", "INTERRUPTION", "Break the circuit"),
            ("DOOR 4", "OVERRIDE", "Install new response"),
        ]
        for i, (label, title, desc) in enumerate(doors):
            y = start_y - i * 115
            x = cx - box_w / 2
            self.canv.setStrokeColor(TEAL)
            self.canv.setLineWidth(1.5)
            self.canv.setFillColor(DARK_BG)
            self.canv.roundRect(x, y - box_h, box_w, box_h, 6, fill=1, stroke=1)
            self.canv.setFillColor(TEAL)
            self.canv.setFont('Helvetica-Bold', 10)
            self.canv.drawCentredString(cx, y - 20, label)
            self.canv.setFillColor(WHITE)
            self.canv.setFont('Helvetica-Bold', 14)
            self.canv.drawCentredString(cx, y - 38, title)
            self.canv.setFillColor(LIGHT_GRAY)
            self.canv.setFont('Helvetica', 9)
            self.canv.drawCentredString(cx, y - 55, desc)
            if i < 3:
                arrow_y = y - box_h - 5
                self.canv.setStrokeColor(TEAL)
                self.canv.setLineWidth(1)
                self.canv.line(cx, arrow_y, cx, arrow_y - 25)
                self.canv.setFillColor(TEAL)
                arrow_size = 5
                ay = arrow_y - 25
                from reportlab.lib.colors import Color
                path = self.canv.beginPath()
                path.moveTo(cx - arrow_size, ay)
                path.lineTo(cx + arrow_size, ay)
                path.lineTo(cx, ay - arrow_size)
                path.close()
                self.canv.drawPath(path, fill=1, stroke=0)


def create_styles():
    return {
        'main_title': ParagraphStyle(
            'MainTitle', fontSize=48, textColor=WHITE, alignment=TA_CENTER,
            fontName='Helvetica-Bold', leading=56
        ),
        'field_guide_title': ParagraphStyle(
            'FieldGuideTitle', fontSize=36, textColor=TEAL, alignment=TA_CENTER,
            fontName='Helvetica-Bold', leading=44
        ),
        'pattern_title': ParagraphStyle(
            'PatternTitle', fontSize=24, textColor=WHITE, alignment=TA_CENTER,
            fontName='Helvetica-Bold', leading=32
        ),
        'subtitle': ParagraphStyle(
            'Subtitle', fontSize=12, textColor=LIGHT_GRAY, alignment=TA_CENTER,
            fontName='Helvetica', leading=20
        ),
        'tagline': ParagraphStyle(
            'Tagline', fontSize=14, textColor=MEDIUM_GRAY, alignment=TA_CENTER,
            fontName='Helvetica-Oblique', leading=22
        ),
        'brand': ParagraphStyle(
            'Brand', fontSize=16, textColor=WHITE, alignment=TA_CENTER,
            fontName='Helvetica-Bold', leading=24
        ),
        'toc_title': ParagraphStyle(
            'TOCTitle', fontSize=28, textColor=WHITE, alignment=TA_CENTER,
            fontName='Helvetica-Bold', leading=36, spaceAfter=30
        ),
        'toc_entry': ParagraphStyle(
            'TOCEntry', fontSize=13, textColor=LIGHT_GRAY, fontName='Helvetica',
            leading=28, leftIndent=20
        ),
        'toc_subentry': ParagraphStyle(
            'TOCSubEntry', fontSize=11, textColor=MEDIUM_GRAY, fontName='Helvetica',
            leading=22, leftIndent=40
        ),
        'section_label': ParagraphStyle(
            'SectionLabel', fontSize=18, textColor=TEAL, alignment=TA_CENTER,
            fontName='Helvetica-Bold', leading=26
        ),
        'section_title': ParagraphStyle(
            'SectionTitle', fontSize=36, textColor=WHITE, alignment=TA_CENTER,
            fontName='Helvetica-Bold', leading=44
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
        'body_bold': ParagraphStyle(
            'BodyBold', fontSize=11, textColor=WHITE, fontName='Helvetica-Bold',
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
        'fill_in': ParagraphStyle(
            'FillIn', fontSize=11, textColor=LIGHT_GRAY, fontName='Helvetica',
            leading=28, spaceAfter=4, leftIndent=10
        ),
        'checkbox': ParagraphStyle(
            'Checkbox', fontSize=11, textColor=LIGHT_GRAY, fontName='Helvetica',
            leading=22, spaceAfter=4, leftIndent=10
        ),
    }


def draw_dark_background(canvas_obj, doc):
    canvas_obj.saveState()
    canvas_obj.setFillColor(DARK_BG)
    canvas_obj.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, fill=1, stroke=0)
    canvas_obj.setStrokeColor(TEAL)
    canvas_obj.setLineWidth(1.5)
    canvas_obj.line(MARGIN, 0.55 * inch, PAGE_WIDTH - MARGIN, 0.55 * inch)
    canvas_obj.setFillColor(MEDIUM_GRAY)
    canvas_obj.setFont('Helvetica-Bold', 9)
    canvas_obj.drawString(MARGIN, 0.35 * inch, "THE ARCHIVIST METHOD")
    canvas_obj.setFillColor(TEAL)
    canvas_obj.drawString(MARGIN + 155, 0.35 * inch, "|")
    canvas_obj.setFillColor(MEDIUM_GRAY)
    canvas_obj.drawString(MARGIN + 165, 0.35 * inch, "CLASSIFIED")
    canvas_obj.setFillColor(WHITE)
    canvas_obj.setFont('Helvetica-Bold', 10)
    canvas_obj.drawRightString(PAGE_WIDTH - MARGIN, 0.35 * inch, str(doc.page))
    canvas_obj.restoreState()


def draw_title_page(canvas_obj, doc):
    canvas_obj.saveState()
    canvas_obj.setFillColor(DARK_BG)
    canvas_obj.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, fill=1, stroke=0)
    canvas_obj.setFillColor(MEDIUM_GRAY)
    canvas_obj.setFont('Helvetica-Bold', 9)
    canvas_obj.drawCentredString(PAGE_WIDTH / 2, 0.35 * inch, "THE ARCHIVIST METHOD | CLASSIFIED")
    canvas_obj.restoreState()


def strip_emoji(text):
    emoji_pattern = re.compile(
        "["
        "\U0001F600-\U0001F64F\U0001F300-\U0001F5FF\U0001F680-\U0001F6FF"
        "\U0001F700-\U0001F77F\U0001F780-\U0001F7FF\U0001F800-\U0001F8FF"
        "\U0001F900-\U0001F9FF\U0001FA00-\U0001FA6F\U0001FA70-\U0001FAFF"
        "\U00002702-\U000027B0\U000024C2-\U0001F251\U0001f926-\U0001f937"
        "\U00010000-\U0010ffff\u200d\u2640-\u2642\u2600-\u2B55\u23cf"
        "\u23e9\u231a\ufe0f\u3030\u2934\u2935\u25aa-\u25ab\u25b6\u25c0"
        "\u25fb-\u25fe\u2614-\u2615\u2648-\u2653\u267f\u2693\u26a1"
        "\u26aa-\u26ab\u26bd-\u26be\u26c4-\u26c5\u26ce\u26d4\u26ea"
        "\u26f2-\u26f3\u26f5\u26fa\u26fd\u2702\u2705\u2708-\u270d"
        "\u270f\u2712\u2714\u2716\u271d\u2721\u2728\u2733-\u2734"
        "\u2744\u2747\u274c\u274e\u2753-\u2755\u2757\u2763-\u2764"
        "\u2795-\u2797\u27a1\u27b0\u27bf\u2b05-\u2b07\u2b1b-\u2b1c"
        "\u2b50\u2b55\u231a-\u231b\u23e9-\u23f3\u23f8-\u23fa"
        "\U0001F48E"
        "]+", flags=re.UNICODE
    )
    return emoji_pattern.sub('', text)


def clean_text(text):
    text = strip_emoji(text)
    text = re.sub(r'\*\*([^*]+)\*\*', r'<b>\1</b>', text)
    text = re.sub(r'(?<!\*)\*([^*]+)\*(?!\*)', r'<i>\1</i>', text)
    text = re.sub(r'__([^_]+)__', r'<b>\1</b>', text)
    text = re.sub(r'`([^`]+)`', r'<font color="#14B8A6"><b>\1</b></font>', text)
    text = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', text)
    text = text.replace('&', '&amp;')
    protected = []
    tags = ['<b>', '</b>', '<i>', '</i>', '<font color="#14B8A6">', '</font>']
    for tag in tags:
        placeholder = f'__TAG{len(protected)}__'
        text = text.replace(tag, placeholder)
        protected.append((placeholder, tag))
    text = text.replace('<', '&lt;').replace('>', '&gt;')
    for placeholder, tag in protected:
        text = text.replace(placeholder, tag)
    return text.strip()


def parse_markdown(content, styles):
    elements = []
    for line in content.split('\n'):
        line = line.rstrip()
        if not line.strip():
            continue
        line = strip_emoji(line)
        if not line.strip():
            continue
        try:
            if 'GOLD NUGGET' in line.upper():
                elements.append(Paragraph('<font color="#14B8A6">GOLD NUGGET</font>', styles['callout']))
                continue
            upper = line.strip().upper()
            if upper.startswith('=') and len(upper) > 5 and all(c in '= ' for c in upper):
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
                elements.append(TealRule())
                elements.append(Spacer(1, 10))
            elif line.startswith('> '):
                qt = clean_text(line[2:])
                if qt:
                    elements.append(Paragraph(f'"{qt}"', styles['quote']))
            elif line.strip().startswith('- ') or line.strip().startswith('* '):
                text = clean_text(line.strip()[2:])
                if text:
                    bullet = '<font color="#14B8A6"><b>&bull;</b></font>'
                    elements.append(Paragraph(f'{bullet}  {text}', styles['bullet']))
            elif re.match(r'^\d+\.\s', line.strip()):
                match = re.match(r'^(\d+)\.\s*(.+)', line.strip())
                if match:
                    num, text = match.groups()
                    text = clean_text(text)
                    if text:
                        ns = f'<font color="#14B8A6"><b>{num}.</b></font>'
                        elements.append(Paragraph(f'{ns}  {text}', styles['bullet']))
            elif line.strip():
                text = clean_text(line)
                if text:
                    elements.append(Paragraph(text, styles['body']))
        except:
            pass
    return elements


def get_pattern_files(content_dir, pattern_dir):
    path = os.path.join(content_dir, 'module-3-patterns', pattern_dir)
    if not os.path.exists(path):
        return []
    files = [f for f in os.listdir(path) if f.endswith('.md')]
    def sort_key(f):
        m = re.match(r'^[\d]+\.([\d]+)', f)
        if m:
            try:
                return float(m.group(1))
            except:
                return 999
        return 999
    files.sort(key=sort_key)
    return [os.path.join(path, f) for f in files]


def build_section_page(styles, label, title):
    elements = []
    elements.append(Spacer(1, 180))
    elements.append(Paragraph(label, styles['section_label']))
    elements.append(Spacer(1, 15))
    elements.append(Paragraph(title, styles['section_title']))
    elements.append(PageBreak())
    return elements


def add_text_section(styles, title, body_lines):
    elements = []
    elements.append(Paragraph(title, styles['h1']))
    elements.append(TealRule())
    elements.append(Spacer(1, 10))
    for line in body_lines:
        if line.startswith('__BOLD__'):
            elements.append(Paragraph(clean_text(line[8:]), styles['body_bold']))
        elif line.startswith('__H2__'):
            elements.append(Paragraph(clean_text(line[6:]), styles['h2']))
        elif line.startswith('__H3__'):
            elements.append(Paragraph(clean_text(line[6:]), styles['h3']))
        elif line.startswith('__QUOTE__'):
            elements.append(Paragraph(f'"{clean_text(line[9:])}"', styles['quote']))
        elif line.startswith('__BULLET__'):
            bullet = '<font color="#14B8A6"><b>&bull;</b></font>'
            elements.append(Paragraph(f'{bullet}  {clean_text(line[10:])}', styles['bullet']))
        elif line.startswith('__NUM__'):
            m = re.match(r'__NUM__(\d+)\.\s*(.*)', line)
            if m:
                n, t = m.groups()
                ns = f'<font color="#14B8A6"><b>{n}.</b></font>'
                elements.append(Paragraph(f'{ns}  {clean_text(t)}', styles['bullet']))
        elif line.startswith('__CHECKBOX__'):
            elements.append(Paragraph(f'[ ]  {clean_text(line[12:])}', styles['checkbox']))
        elif line.startswith('__BRAND__'):
            raw_text = line[9:]
            branded = raw_text.replace('NOT', '<font color="#EC4899">NOT</font>')
            elements.append(Paragraph(branded, styles['body_bold']))
        elif line.startswith('__FILL__'):
            elements.append(Paragraph(f'{clean_text(line[8:])}: _______________________________________________', styles['fill_in']))
        elif line.startswith('__RULE__'):
            elements.append(TealRule())
            elements.append(Spacer(1, 10))
        elif line.startswith('__SPACE__'):
            elements.append(Spacer(1, 16))
        elif line == '':
            elements.append(Spacer(1, 8))
        else:
            elements.append(Paragraph(clean_text(line), styles['body']))
    return elements


def generate_field_guide(pattern_info, content_dir, logo_path, output_dir, styles):
    pattern_name = pattern_info['name']
    filename = pattern_info['filename']
    output_path = os.path.join(output_dir, filename)

    print(f'\n  Generating: {filename}')
    story = []

    # ===== TITLE PAGE =====
    story.append(Spacer(1, 60))
    if os.path.exists(logo_path):
        logo = CircularLogo(logo_path, size=140)
        lt = Table([[logo]], colWidths=[PAGE_WIDTH - 2 * MARGIN])
        lt.setStyle(TableStyle([('ALIGN', (0, 0), (-1, -1), 'CENTER'), ('VALIGN', (0, 0), (-1, -1), 'MIDDLE')]))
        story.append(lt)
        story.append(Spacer(1, 40))
    story.append(Paragraph("THE ARCHIVIST METHOD", styles['main_title']))
    story.append(Spacer(1, 10))
    story.append(Paragraph("FIELD GUIDE", styles['field_guide_title']))
    story.append(Spacer(1, 15))
    story.append(TealRule())
    story.append(Spacer(1, 20))
    story.append(Paragraph(pattern_name, styles['pattern_title']))
    story.append(Spacer(1, 20))
    story.append(Paragraph(
        "Your 90-day protocol for identifying, interrupting,<br/>and overriding the pattern destroying your life.",
        styles['subtitle']
    ))
    story.append(Spacer(1, 40))
    story.append(Paragraph(
        'PATTERN ARCHAEOLOGY, <font color="#EC4899">NOT</font> THERAPY',
        styles['brand']
    ))
    story.append(PageBreak())

    # ===== TABLE OF CONTENTS =====
    story.append(Spacer(1, 40))
    story.append(Paragraph("CONTENTS", styles['toc_title']))
    story.append(TealRule())
    story.append(Spacer(1, 20))
    toc_items = [
        ("WELCOME", ["How to Use This Guide", "The Rules", "What This Is (And What It Isn't)"]),
        ("THE FOUR DOORS PROTOCOL", ["Door 1: Recognition", "Door 2: Excavation", "Door 3: Interruption", "Door 4: Override"]),
        (f"YOUR PATTERN: {pattern_name}", ["What It Looks Like", "The Origin Room", "Your Triggers", "The Body Signature", "Circuit Break Scripts", "Override Protocol", "The Archaeology"]),
        ("THE OTHER PATTERNS", ["Quick Reference Guide"]),
        ("THE 90-DAY PROTOCOL", ["Days 1-7: Recognition", "Days 8-30: Excavation", "Days 31-60: Interruption", "Days 61-90: Override"]),
        ("CRISIS PROTOCOLS", ["When the Pattern Runs Anyway", "Emergency Interrupts", "The Morning After Protocol"]),
        ("TRACKING TEMPLATES", ["Daily Interrupt Log", "Trigger Map", "Progress Tracker"]),
        ("WHAT'S NEXT", []),
    ]
    for title, subs in toc_items:
        story.append(Paragraph(f'<font color="#14B8A6"><b>{title}</b></font>', styles['toc_entry']))
        for sub in subs:
            story.append(Paragraph(sub, styles['toc_subentry']))
    story.append(PageBreak())

    # ===== SECTION 1: WELCOME =====
    story.extend(build_section_page(styles, "SECTION 1", "WELCOME"))

    story.extend(add_text_section(styles, "HOW TO USE THIS GUIDE", [
        "This is not a book you read cover to cover and put on a shelf.",
        "",
        "This is a field guide. You take it into the field. You use it when the pattern activates. You reference it when you're in the middle of the fire, not after.",
        "",
        "__BOLD__HERE'S HOW THIS WORKS:",
        "",
        "Read the Four Doors Protocol first. Understand the system.",
        "",
        "Then go deep on YOUR pattern. That's Section 3. That's where you'll spend most of your time. Learn it. Know it. Memorize the circuit breaks.",
        "",
        "Use the 90-Day Protocol as your structure. It tells you what to focus on each week.",
        "",
        "When shit hits the fan, go to Crisis Protocols. That's your emergency kit.",
        "",
        "Track your interrupts. The data matters. Every interrupt--successful or not--is information.",
        "",
        "The other patterns are there for awareness. You'll recognize people in your life. You might recognize yourself. But stay focused on YOUR pattern first. Master one before you try to master all.",
        "",
        "__BOLD__YOU FOUND THE THREAD. NOW PULL IT.",
    ]))
    story.append(PageBreak())

    story.extend(add_text_section(styles, "THE RULES", [
        "__H2__RULE 1: ONE PATTERN AT A TIME",
        "You probably have multiple patterns running. Most people do. Ignore them for now. This guide is about ONE pattern--yours. Master this one first. The others can wait.",
        "",
        "__H2__RULE 2: PROGRESS, NOT PERFECTION",
        "You will try to interrupt your pattern and fail. The pattern will run anyway. That is not failure. That is data.",
        "Write down what happened. What triggered it. How fast it ran. That data makes tomorrow better than today.",
        "",
        "__H2__RULE 3: TRACK JUST ENOUGH",
        "When the pattern activates, write one sentence. What happened. Move on.",
        "This is not journaling. This is data collection. You're building a map of your own mind.",
        "",
        "__H2__RULE 4: USE THE CRISIS PROTOCOLS",
        "When you're in the middle of the pattern running, you won't remember what to do. That's why the Crisis Protocols exist. Bookmark them. Screenshot them. Know where they are.",
        "",
        "__RULE__",
        "__BOLD__THE ONLY WAY TO FAIL THIS",
        "Quit before Day 90.",
        "A pattern running on Day 30 is not failure. A pattern running on Day 60 is not failure. Closing this PDF and never opening it again is failure.",
        "__BOLD__90 days. That's the commitment.",
    ]))
    story.append(PageBreak())

    story.extend(add_text_section(styles, "WHAT THIS IS", [
        "This is pattern interruption. Behavioral forensics. You have a program running. We are going to interrupt it mid-execution.",
        "This is a field guide for people who are tired of understanding why and ready to focus on stopping it.",
        "This is the 90-day protocol to take a pattern that has been running for years--maybe decades--and break its automatic grip.",
        "",
        "__H2__WHAT THIS IS NOT",
        "This is not therapy. We are not processing your trauma. We are not exploring your inner child. We are not journaling about feelings.",
        "This is not self-help. We are not affirming your worth or teaching you to love yourself. That might come later. But that's not the work.",
        "This is not a cure. Patterns don't disappear. They lose power. They stop running automatically. But the circuit remains. This guide teaches you to catch it before it runs, not to pretend it doesn't exist.",
        "",
        "__H2__THE DIFFERENCE",
        "Therapy explains why the house caught fire.",
        "This teaches you to stop lighting matches.",
        "",
        '__BOLD__PATTERN ARCHAEOLOGY, NOT THERAPY.',
    ]))
    story.append(PageBreak())

    # ===== SECTION 2: THE FOUR DOORS PROTOCOL =====
    story.extend(build_section_page(styles, "SECTION 2", "THE FOUR DOORS PROTOCOL"))

    story.append(Paragraph("THE FOUR DOORS PROTOCOL", styles['h1']))
    story.append(TealRule())
    story.append(Spacer(1, 10))
    story.append(Paragraph("Every pattern interruption moves through four doors.", styles['body']))
    story.append(Paragraph("You cannot skip doors. You cannot rush doors. Each one builds on the last.", styles['body']))
    story.append(Spacer(1, 10))
    story.append(FourDoorsFlowable())
    story.append(Spacer(1, 10))
    story.append(Paragraph("Most people spend their whole lives at Door 1--seeing the pattern, hating the pattern, but never moving through the other doors.", styles['body']))
    story.append(Paragraph("This guide walks you through all four.", styles['body_bold']))
    story.append(PageBreak())

    # Door 1
    story.extend(add_text_section(styles, "DOOR 1: RECOGNITION", [
        "Before you can interrupt a pattern, you have to see it.",
        "Not after it runs. Not the next day when you're full of regret. In the moment. As it's activating.",
        "This is harder than it sounds. Patterns are fast. They run in 3-7 seconds. By the time you realize what's happening, it's already happened.",
        "Recognition has three layers:",
        "",
        "__H2__LAYER 1: THE TRIGGER",
        "Something happens right before your pattern activates. Always. A word. A tone. A silence. A look on someone's face.",
        "__BOLD__Your job: Identify your top 3 triggers.",
        "You'll map these in Section 3.",
        "",
        "__H2__LAYER 2: THE BODY SIGNATURE",
        "Before your pattern runs, your body signals it. Every time. Chest tightness. Stomach drop. Throat closing. Heart racing.",
        "This is the 3-7 second window. The body knows before the mind catches up.",
        "__BOLD__Your job: Learn what your body does before the pattern runs.",
        "",
        "__H2__LAYER 3: THE THOUGHT",
        "Between trigger and action, there's usually a thought. Fast. Almost invisible. But it's there.",
        '__QUOTE__"They\'re going to leave anyway."',
        '__QUOTE__"I shouldn\'t have asked."',
        '__QUOTE__"Here we go again."',
        "__BOLD__Your job: Catch the thought.",
        "",
        "__RULE__",
        "__BOLD__RECOGNITION COMPLETE WHEN:",
        "You can feel the pattern activating BEFORE it runs. You notice the trigger, feel the body signature, and catch the thought.",
        "You don't have to stop it yet. You just have to SEE it.",
    ]))
    story.append(PageBreak())

    # Door 2
    story.extend(add_text_section(styles, "DOOR 2: EXCAVATION", [
        "Your pattern didn't come from nowhere.",
        "It installed in childhood. Not because something happened TO you--because you learned to DO something to survive.",
        "Excavation is not about blame. It's not about processing. It's about understanding where the pattern learned to run.",
        "",
        "__H2__THE ORIGINAL ROOM",
        "Every pattern has an Original Room. Not a literal room--an emotional environment. The place where this pattern made sense.",
        "Maybe closeness led to pain, so you learned to disappear. Maybe your needs were a burden, so you learned to apologize. Maybe love was unpredictable, so you learned to test it.",
        "The pattern was a solution once. It kept you safe. It helped you survive.",
        "But you're not in that room anymore. And the pattern keeps running like you are.",
        "",
        "__H2__WHY THIS MATTERS",
        "You don't excavate to heal. You excavate to understand why the pattern feels so automatic.",
        "When you know where it came from, you stop thinking something is wrong with you. You start seeing it as a program that installed in a specific environment for a specific reason.",
        "__BOLD__Programs can be rewritten.",
        "",
        "__RULE__",
        "__BOLD__EXCAVATION COMPLETE WHEN:",
        "You can name the Original Room. You understand what the pattern was protecting you from. You see why it made sense then--and why it doesn't now.",
    ]))
    story.append(PageBreak())

    # Door 3
    story.extend(add_text_section(styles, "DOOR 3: INTERRUPTION", [
        "This is the door most people never reach.",
        "They see the pattern (Door 1). They understand it (Door 2). But they never learn to STOP it mid-execution.",
        "Interruption is the skill that changes everything.",
        "",
        "__H2__THE CIRCUIT BREAK",
        "A circuit break is a pre-written script you say when the pattern activates. Out loud or in your head.",
        "It interrupts the automatic sequence.",
        "",
        "__BOLD__WITHOUT CIRCUIT BREAK:",
        "Trigger -> Body signature -> Pattern runs (3-7 seconds)",
        "",
        "__BOLD__WITH CIRCUIT BREAK:",
        "Trigger -> Body signature -> CIRCUIT BREAK -> Choose different response",
        "",
        "The circuit break creates a gap. In that gap, you can choose.",
        "",
        "__H2__HOW TO USE A CIRCUIT BREAK",
        "__NUM__1. Feel the body signature",
        "__NUM__2. Say the script (out loud or in your head)",
        "__NUM__3. Take one breath",
        "__NUM__4. Choose a different action",
        "That's it. Simple in concept. Hard in practice.",
        "",
        "__RULE__",
        "__BOLD__INTERRUPTION COMPLETE WHEN:",
        "You successfully interrupt the pattern at least once. It doesn't have to be perfect. It doesn't have to stick. You just need ONE successful interrupt to prove the circuit can break.",
    ]))
    story.append(PageBreak())

    # Door 4
    story.extend(add_text_section(styles, "DOOR 4: OVERRIDE", [
        "Interruption stops the old pattern. Override installs a new one.",
        "You cannot just stop a behavior. You have to replace it with something. Otherwise the vacuum gets filled by the old pattern running again.",
        "",
        "__H2__THE OVERRIDE PROTOCOL",
        "An override is the new behavior you do INSTEAD of the pattern.",
        "__BULLET__PATTERN: Disappear when someone gets close.",
        "__BULLET__OVERRIDE: Stay and communicate what you're feeling.",
        "__BULLET__PATTERN: Apologize before asking for something.",
        "__BULLET__OVERRIDE: Ask directly without preamble.",
        "__BULLET__PATTERN: Test if they really love you.",
        "__BULLET__OVERRIDE: Ask for reassurance directly.",
        "",
        "__H2__WHY OVERRIDE IS HARD",
        "The pattern feels natural. The override feels fake.",
        "That's because the pattern has been running for years. Maybe decades. It's worn a groove in your brain.",
        "The override is a new path. It feels awkward. Forced. Wrong.",
        "This is normal. You're not being fake. You're being intentional.",
        "__BOLD__Keep running the override. Eventually, it wears its own groove.",
        "",
        "__RULE__",
        "__BOLD__OVERRIDE COMPLETE WHEN:",
        "The new behavior starts to feel less forced. You reach for the override without having to consciously remember it.",
        "This takes time. Usually somewhere between Day 60-90.",
    ]))
    story.append(PageBreak())

    # ===== SECTION 3: YOUR PATTERN (from content/book/) =====
    story.extend(build_section_page(styles, "SECTION 3", f"YOUR PATTERN:\n{pattern_name}"))

    pattern_files = get_pattern_files(content_dir, pattern_info['dir'])
    print(f'    Pattern content files: {len(pattern_files)}')
    files_processed = 0
    for fpath in pattern_files:
        try:
            with open(fpath, 'r', encoding='utf-8') as f:
                content = f.read()
            elems = parse_markdown(content, styles)
            if elems:
                story.extend(elems)
                story.append(PageBreak())
                files_processed += 1
        except Exception as e:
            print(f'    Error reading {fpath}: {e}')
    print(f'    Pattern files processed: {files_processed}')

    # ===== SECTION 4: THE OTHER PATTERNS =====
    story.extend(build_section_page(styles, "SECTION 4", "THE OTHER PATTERNS"))

    story.append(Paragraph("You're focused on your pattern right now. Good.", styles['body']))
    story.append(Paragraph("But patterns rarely run alone. As you do this work, you may recognize other patterns in yourself--or in people you love.", styles['body']))
    story.append(Paragraph("This section gives you quick identification for all 9 patterns. Not mastery. Just awareness.", styles['body']))
    story.append(Paragraph("If you want to go deep on all 9 patterns, the Complete Archive has the full archaeology for each.", styles['body']))
    story.append(Spacer(1, 10))

    for p in PATTERNS:
        if p['id'] == pattern_info['id']:
            continue
        story.append(TealRule())
        story.append(Spacer(1, 8))
        story.append(Paragraph(p['name'], styles['h2']))
        story.append(Paragraph(p['summary'], styles['body']))
        story.append(Paragraph(f'<b>Signs:</b> {p["signs"]}', styles['body']))
        story.append(Spacer(1, 6))

    story.append(PageBreak())

    # ===== SECTION 5: THE 90-DAY PROTOCOL =====
    story.extend(build_section_page(styles, "SECTION 5", "THE 90-DAY PROTOCOL"))

    story.extend(add_text_section(styles, "THE 90-DAY PROTOCOL", [
        "This is your structure. What to focus on each phase.",
        "",
        "__H2__PHASE 1: RECOGNITION (Days 1-7)",
        "Focus: See the pattern in real-time.",
        "__CHECKBOX__Day 1: Identify your pattern (done--you're here)",
        "__CHECKBOX__Day 2: Learn your body signature",
        "__CHECKBOX__Day 3: Map your triggers",
        "__CHECKBOX__Day 4: Catch the thought",
        "__CHECKBOX__Day 5: Practice noticing without stopping",
        "__CHECKBOX__Day 6: Track activations (minimum 3)",
        "__CHECKBOX__Day 7: Review--what did you learn?",
        "__BOLD__Success metric: You can feel the pattern activate BEFORE it runs.",
        "",
        "__RULE__",
        "__H2__PHASE 2: EXCAVATION (Days 8-30)",
        "Focus: Understand where the pattern came from.",
        "",
        "__H3__Week 2: The Original Room",
        "__CHECKBOX__Where did this pattern install?",
        "__CHECKBOX__What was it protecting you from?",
        "__CHECKBOX__Who taught you this was necessary?",
        "",
        "__H3__Week 3: The Function",
        "__CHECKBOX__What did this pattern do for you?",
        "__CHECKBOX__How did it keep you safe?",
        "__CHECKBOX__What would have happened without it?",
        "",
        "__H3__Week 4: The Cost",
        "__CHECKBOX__What has this pattern cost you?",
        "__CHECKBOX__Relationships? Opportunities? Health?",
        "__CHECKBOX__What do you want back?",
        "__BOLD__Success metric: You understand why the pattern exists--and why it no longer serves you.",
        "",
        "__RULE__",
        "__H2__PHASE 3: INTERRUPTION (Days 31-60)",
        "Focus: Break the circuit.",
        "",
        "__H3__Week 5-6: Circuit Break Practice",
        "__CHECKBOX__Memorize your primary circuit break",
        "__CHECKBOX__Practice it 3x daily (not just when activated)",
        "__CHECKBOX__Use it in low-stakes situations first",
        "",
        "__H3__Week 7-8: Live Interruption",
        "__CHECKBOX__Use circuit break in real activations",
        "__CHECKBOX__Track outcomes: AUTO / PAUSE / REWRITE",
        "__CHECKBOX__Refine based on what works",
        "__BOLD__Success metric: At least ONE successful interrupt where you chose a different behavior.",
        "",
        "__RULE__",
        "__H2__PHASE 4: OVERRIDE (Days 61-90)",
        "Focus: Install new behavior.",
        "",
        "__H3__Week 9-10: Override Practice",
        "__CHECKBOX__Identify your override behavior",
        "__CHECKBOX__Practice override scripts",
        "__CHECKBOX__Use override after successful interrupts",
        "",
        "__H3__Week 11-12: Integration",
        "__CHECKBOX__Override becomes more automatic",
        "__CHECKBOX__Notice when old pattern tries to return",
        "__CHECKBOX__Reinforce new pathway",
        "",
        "__H3__Week 13: Review + What's Next",
        "__CHECKBOX__What changed in 90 days?",
        "__CHECKBOX__What still needs work?",
        "__CHECKBOX__Other patterns to address?",
        "__BOLD__Success metric: Override feels less forced. New behavior is becoming default.",
    ]))
    story.append(PageBreak())

    # ===== SECTION 6: CRISIS PROTOCOLS =====
    story.extend(build_section_page(styles, "SECTION 6", "CRISIS PROTOCOLS"))

    crisis_pattern_name = pattern_name.replace('THE ', '')

    story.extend(add_text_section(styles, "WHEN THE PATTERN IS RUNNING RIGHT NOW", [
        "Stop. Read this.",
        "",
        "__NUM__1. You are not your pattern. The pattern is running through you. But it is not you.",
        "__NUM__2. You noticed. That matters. Most people don't even see it.",
        "__NUM__3. You have a choice right now. Not a perfect choice. But a choice.",
        "",
        "__BOLD__Say this out loud:",
        f'__QUOTE__The {crisis_pattern_name} just activated. I feel it in my body. I am choosing to pause before I act.',
        "",
        "Take 3 breaths. Slow.",
        "Now: What is ONE different thing you can do right now? Not the perfect thing. Just a different thing.",
        "__BOLD__Do that.",
    ]))
    story.append(PageBreak())

    story.extend(add_text_section(styles, "EMERGENCY CIRCUIT BREAKS", [
        "When you can't remember your scripts, use these:",
        "",
        '__QUOTE__This is the pattern. Not me. The pattern.',
        '__QUOTE__I can feel it running. I\'m going to pause.',
        '__QUOTE__I don\'t have to do what the pattern wants right now.',
        '__QUOTE__What would I do if the pattern wasn\'t running?',
    ]))
    story.append(PageBreak())

    story.extend(add_text_section(styles, "WHEN THE PATTERN ALREADY RAN", [
        "It happened. You did the thing. Now what?",
        "",
        "__H2__DO NOT:",
        "__BULLET__Spiral into shame",
        "__BULLET__Decide you're broken",
        "__BULLET__Give up on the process",
        "",
        "__H2__DO:",
        "__BULLET__Write down what happened (one paragraph)",
        "__BULLET__Identify the trigger",
        "__BULLET__Note when you first felt the body signature",
        "__BULLET__Ask: Where could I have interrupted?",
        "",
        "__BOLD__This is data. Not failure. Data.",
        "The pattern ran for years before you started this work. It doesn't stop in a week. Every time it runs, you learn something.",
    ]))
    story.append(PageBreak())

    story.extend(add_text_section(styles, "THE MORNING AFTER PROTOCOL", [
        "You woke up and remembered what happened. The shame is heavy.",
        "",
        "__NUM__1. Get out of bed. Shower. Eat something.",
        "__NUM__2. Open this guide. Read your pattern section.",
        '__NUM__3. Write: "The pattern ran. I noticed. I\'m still here. Today is a new data point."',
        "__NUM__4. Do ONE thing from your 90-day protocol today.",
        "",
        "That's it. You don't have to fix everything. You just have to keep going.",
    ]))
    story.append(PageBreak())

    story.extend(add_text_section(styles, "WHEN YOU WANT TO QUIT", [
        "The pattern might tell you this doesn't work. That you're too broken. That you should give up.",
        "__BOLD__That's the pattern talking.",
        "",
        "Patterns don't want to be interrupted. They fight back. Wanting to quit IS the pattern trying to protect itself.",
        "",
        "Read this:",
        '__QUOTE__Quitting is the pattern winning. I don\'t have to be perfect. I just have to keep going. One more day. One more interrupt attempt. That\'s all.',
        "",
        "If you're thinking about quitting, you're closer than you think. The pattern is fighting because it's losing.",
        "__BOLD__Keep going.",
    ]))
    story.append(PageBreak())

    # ===== SECTION 7: TRACKING TEMPLATES =====
    story.extend(build_section_page(styles, "SECTION 7", "TRACKING TEMPLATES"))

    story.extend(add_text_section(styles, "DAILY INTERRUPT LOG", [
        "__FILL__Date",
        "",
        "__BOLD__Activation 1:",
        "__FILL__Time",
        "__FILL__Trigger",
        "__FILL__Body signature",
        "Circuit break used? [ ] Yes  [ ] No",
        "Outcome: [ ] AUTO (ran anyway)  [ ] PAUSE  [ ] REWRITE",
        "__FILL__Notes",
        "",
        "__BOLD__Activation 2:",
        "__FILL__Time",
        "__FILL__Trigger",
        "__FILL__Body signature",
        "Circuit break used? [ ] Yes  [ ] No",
        "Outcome: [ ] AUTO  [ ] PAUSE  [ ] REWRITE",
        "__FILL__Notes",
        "",
        "__BOLD__Activation 3:",
        "__FILL__Time",
        "__FILL__Trigger",
        "__FILL__Body signature",
        "Circuit break used? [ ] Yes  [ ] No",
        "Outcome: [ ] AUTO  [ ] PAUSE  [ ] REWRITE",
        "__FILL__Notes",
    ]))
    story.append(PageBreak())

    story.extend(add_text_section(styles, "TRIGGER MAP", [
        f"My top triggers for {pattern_name}:",
        "",
        "__NUM__1. _______________________________________________________",
        "__FILL__Situation",
        "__FILL__Who's usually involved",
        "",
        "__NUM__2. _______________________________________________________",
        "__FILL__Situation",
        "__FILL__Who's usually involved",
        "",
        "__NUM__3. _______________________________________________________",
        "__FILL__Situation",
        "__FILL__Who's usually involved",
        "",
        "__FILL__Patterns I notice",
    ]))
    story.append(PageBreak())

    story.extend(add_text_section(styles, "WEEKLY PROGRESS TRACKER", [
        "__FILL__Week ___ of 13",
        "",
        "__FILL__Total activations this week",
        "__FILL__Successful interrupts",
        "__FILL__Override attempts",
        "",
        "__FILL__What's getting easier",
        "__FILL__What's still hard",
        "__FILL__Insight of the week",
    ]))
    story.append(PageBreak())

    # ===== SECTION 8: WHAT'S NEXT =====
    story.extend(build_section_page(styles, "SECTION 8", "WHAT'S NEXT"))

    story.extend(add_text_section(styles, "WHAT'S NEXT", [
        "You have what you need to master this pattern.",
        "The Field Guide. The 90-day protocol. The crisis protocols. The tracking templates.",
        "__BOLD__This is enough to change your life.",
        "But patterns rarely run alone.",
        "",
        "__H2__WHEN YOU'RE READY FOR MORE",
        "The Complete Archive contains:",
        "__BULLET__Full deep dives on all 9 patterns",
        "__BULLET__Pattern combinations (when you run more than one)",
        "__BULLET__Relationship protocols (how patterns interact with partners)",
        "__BULLET__Workplace applications (patterns at work)",
        "__BULLET__Parenting contexts (breaking the cycle)",
        "__BULLET__Advanced interruption techniques",
        "__BULLET__Lifetime updates as the method evolves",
        "",
        "You don't need it now. Focus on YOUR pattern first.",
        "But when you're ready--when you've tasted what interruption feels like and you want the full picture--the Archive is there.",
        "",
        "__BOLD__thearchivistmethod.com",
        "",
        "__RULE__",
        "__BOLD__YOU FOUND THE THREAD. NOW PULL IT.",
        "__RULE__",
        "",
        "__BOLD__THE ARCHIVIST METHOD",
        "__BRAND__Pattern Archaeology, NOT Therapy",
    ]))

    # ===== BUILD PDF =====
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        leftMargin=MARGIN,
        rightMargin=MARGIN,
        topMargin=MARGIN,
        bottomMargin=0.8 * inch
    )
    doc.build(story, onFirstPage=draw_title_page, onLaterPages=draw_dark_background)

    size_mb = os.path.getsize(output_path) / (1024 * 1024)
    print(f'    Pages: ~{doc.page}')
    print(f'    Size: {size_mb:.2f} MB')
    return output_path


def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    base_dir = os.path.join(script_dir, '..')
    content_dir = os.path.join(base_dir, 'content', 'book')
    logo_path = os.path.join(base_dir, 'attached_assets', 'archivist-portrait-circle.jpg')
    output_dir = base_dir

    print('=' * 60)
    print('THE ARCHIVIST METHOD - FIELD GUIDE GENERATOR')
    print('Generating 9 personalized Field Guide PDFs...')
    print('=' * 60)

    if not os.path.exists(content_dir):
        print(f'ERROR: Content directory not found: {content_dir}')
        return

    styles = create_styles()
    generated = []

    for pattern in PATTERNS:
        try:
            path = generate_field_guide(pattern, content_dir, logo_path, output_dir, styles)
            generated.append(path)
        except Exception as e:
            print(f'  ERROR generating {pattern["filename"]}: {e}')
            import traceback
            traceback.print_exc()

    print('\n' + '=' * 60)
    print(f'COMPLETE: {len(generated)}/9 Field Guides generated')
    for path in generated:
        size = os.path.getsize(path) / (1024 * 1024)
        print(f'  {os.path.basename(path)}: {size:.2f} MB')
    print('=' * 60)


if __name__ == '__main__':
    main()
