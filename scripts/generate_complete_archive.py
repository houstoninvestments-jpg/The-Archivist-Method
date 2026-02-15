#!/usr/bin/env python3
"""
THE ARCHIVIST METHOD — COMPLETE ARCHIVE PDF Generator
Assembles the full 600+ page flagship product ($197).

Usage:
    python3 generate_complete_archive.py

Output:
    outputs/THE-ARCHIVIST-METHOD-COMPLETE-ARCHIVE.pdf
"""

import os
import re
from pathlib import Path

from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.platypus import (
    BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer,
    PageBreak, Table, TableStyle, NextPageTemplate, Flowable
)

# ══════════════════════════════════════════════════════════════
# CONFIGURATION
# ══════════════════════════════════════════════════════════════

PATTERN_NAMES = {
    1: "Disappearing",
    2: "Apology Loop",
    3: "Testing",
    4: "Attraction to Harm",
    5: "Draining Bond",
    6: "Compliment Deflection",
    7: "Perfectionism",
    8: "Success Sabotage",
    9: "Rage",
}

PATTERN_DIR_NAMES = {
    1: "pattern-1-disappearing",
    2: "pattern-2-apology-loop",
    3: "pattern-3-testing",
    4: "pattern-4-attraction-to-harm",
    5: "pattern-5-draining-bond",
    6: "pattern-6-compliment-deflection",
    7: "pattern-7-perfectionism",
    8: "pattern-8-success-sabotage",
    9: "pattern-9-rage",
}

PATTERN_TAGLINES = {
    1: "When closeness approaches, you pull away. You leave before you can be left.",
    2: "You apologize for existing. For taking up space. For having needs.",
    3: "You create tests for people to prove they care. They always fail.",
    4: "You are drawn to chaos. You mistake danger for passion.",
    5: "You stay long past the point where staying costs you everything.",
    6: "You cannot accept praise. Visibility feels like a target on your back.",
    7: "You cannot start until conditions are perfect. They never are.",
    8: "You destroy good things right before they materialize.",
    9: "The anger is not proportional. It is old. It belongs to another room.",
}

PATTERN_SECTION_SUFFIXES = {
    '0': 'at-a-glance', '1': 'what-it-is', '2': 'pattern-in-context',
    '3': 'pattern-markers', '4': 'execution-log', '5': 'the-circuit',
    '6': 'pattern-archaeology', '7': 'what-it-costs', '8': 'how-to-interrupt',
    '9': 'the-override', '10': 'troubleshooting', '11': 'quick-reference',
}

PATTERN_SECTION_TITLES = {
    '0': 'AT A GLANCE',
    '1': 'WHAT IT IS',
    '2': 'THE PATTERN IN CONTEXT',
    '3': 'PATTERN MARKERS',
    '4': 'EXECUTION LOG',
    '5': 'THE CIRCUIT',
    '6': 'PATTERN ARCHAEOLOGY',
    '7': 'WHAT IT COSTS',
    '8': 'HOW TO INTERRUPT',
    '9': 'THE OVERRIDE',
    '10': 'TROUBLESHOOTING',
    '11': 'QUICK REFERENCE',
}

PATTERN_SECTION_SUBTITLES = {
    '0': 'Quick orientation',
    '1': 'Definition, mechanism, checklist',
    '2': 'Real-life scenarios',
    '3': 'Identification checklist',
    '4': 'Timestamped real-time activation trace',
    '5': 'Trigger \u2192 Body \u2192 Thought \u2192 Gap \u2192 Behavior \u2192 Relief \u2192 Reinforcement',
    '6': 'Origin story and self-excavation template',
    '7': 'Life impact across every domain',
    '8': 'Circuit Break scripts and practice protocols',
    '9': 'Replacement behaviors and graduated scripts',
    '10': 'Common challenges and solutions',
    '11': 'One-page reference card',
}

# Pull quotes — powerful lines from the content, inserted every ~35 pages
PULL_QUOTES = [
    "You do not need to understand your pattern to interrupt it. You need to see it, name it, and do something different. Once.",
    "The pattern is not who you are. It is something that happens to you.",
    "Somewhere between the ages of two and twelve, your brain encountered a threat and wrote a survival program. The program worked. You survived. But the program never updated.",
    "The pattern expects silence between trigger and behavior. Your voice is the disruption.",
    "Failure is not the pattern running. Failure is pretending you do not see it.",
    "You are now an adult running a child\u2019s code.",
    "The gap between trigger and behavior is 3 to 7 seconds. That gap is where your entire life changes.",
    "The child in the Original Room did not have this book. You do.",
    "One successful interrupt is proof. The pattern can be broken.",
    "The pattern bets everything on your quitting. It has no defense against your persistence.",
    "You cannot interrupt a program you believe is your identity.",
    "Observation without action changes nothing.",
    "The program is running. But you are not the program.",
    "Not gone. Dormant. Manageable. A scar rather than an open wound.",
    "They continued. After the relapse. After the missed day. After the shame. They continued.",
    "You found the thread. You pulled it. The pattern doesn\u2019t run you anymore. You run you.",
    "Every pattern fires in the body first. Before the thought. Before the behavior.",
    "Done is better than perfect. Ship it.",
]

# ── Design Specs ──
BG_DARK = HexColor("#1A1A1A")
BG_CALLOUT = HexColor("#242424")
BG_CODE = HexColor("#222222")
TEAL = HexColor("#14B8A6")
TEAL_DIM = HexColor("#0F7B6E")
GOLD = HexColor("#F59E0B")
PINK = HexColor("#EC4899")
WHITE = HexColor("#FFFFFF")
TEXT_PRIMARY = HexColor("#E5E5E5")
TEXT_SECONDARY = HexColor("#9CA3AF")
TEXT_DIM = HexColor("#6B7280")
BORDER_COLOR = HexColor("#333333")
RED_ACCENT = HexColor("#EF4444")

PAGE_W, PAGE_H = letter
MARGIN_L = 0.75 * inch
MARGIN_R = 0.75 * inch
MARGIN_T = 0.7 * inch
MARGIN_B = 0.7 * inch
CONTENT_W = PAGE_W - MARGIN_L - MARGIN_R

CONTENT_DIR = Path(__file__).parent.parent / "content" / "book"
OUTPUT_DIR = Path(__file__).parent.parent / "outputs"
FOOTER_TEXT = "THE ARCHIVIST METHOD\u2122 | CLASSIFIED"


# ══════════════════════════════════════════════════════════════
# CUSTOM FLOWABLES
# ══════════════════════════════════════════════════════════════

class HorizontalRule(Flowable):
    def __init__(self, width=None, color=TEAL_DIM, thickness=1):
        Flowable.__init__(self)
        self._width = width
        self.color = color
        self.thickness = thickness

    def draw(self):
        self.canv.setStrokeColor(self.color)
        self.canv.setLineWidth(self.thickness)
        self.canv.line(0, 0, self._width or CONTENT_W, 0)

    def wrap(self, availWidth, availHeight):
        self._width = self._width or availWidth
        return (self._width, self.thickness + 6)


class TealDivider(Flowable):
    def __init__(self, width=None):
        Flowable.__init__(self)
        self._width = width

    def wrap(self, availWidth, availHeight):
        self._width = self._width or availWidth
        return (self._width, 20)

    def draw(self):
        mid = self._width / 2
        self.canv.setStrokeColor(TEAL_DIM)
        self.canv.setLineWidth(0.5)
        self.canv.line(mid - 120, 10, mid - 15, 10)
        self.canv.setFillColor(TEAL)
        self.canv.saveState()
        self.canv.translate(mid, 10)
        self.canv.rotate(45)
        self.canv.rect(-4, -4, 8, 8, fill=1, stroke=0)
        self.canv.restoreState()
        self.canv.line(mid + 15, 10, mid + 120, 10)


class BoxedContent(Flowable):
    MAX_HEIGHT = 680

    def __init__(self, content_flowables, width=None, bg_color=BG_CALLOUT,
                 border_color=TEAL, padding=12):
        Flowable.__init__(self)
        self._content = [f for f in content_flowables if f is not None]
        self._box_width = width or CONTENT_W
        self.bg_color = bg_color
        self.border_color = border_color
        self.padding = padding
        self._height = 0

    def wrap(self, availWidth, availHeight):
        if not self._content:
            return (0, 0)
        self._box_width = min(self._box_width, availWidth)
        inner_w = max(self._box_width - 2 * self.padding - 8, 50)
        h = 0
        for f in self._content:
            try:
                _, fh = f.wrap(inner_w, max(availHeight - h, 50))
                h += fh
            except Exception:
                h += 14
        self._height = h + 2 * self.padding
        if self._height > self.MAX_HEIGHT:
            self._height = min(self._height, availHeight)
        return (self._box_width, self._height)

    def split(self, availWidth, availHeight):
        if not self._content:
            return []
        if self._height <= availHeight:
            return []
        if availHeight < 200:
            return []
        inner_w = max(self._box_width - 2 * self.padding - 8, 50)
        h = 0
        split_idx = 0
        target = availHeight - 2 * self.padding
        for idx, f in enumerate(self._content):
            try:
                _, fh = f.wrap(inner_w, max(target - h, 50))
            except Exception:
                fh = 14
            if h + fh > target and idx > 0:
                split_idx = idx
                break
            h += fh
        else:
            return []
        if split_idx == 0:
            return []
        first = BoxedContent(self._content[:split_idx], self._box_width,
                             self.bg_color, self.border_color, self.padding)
        second = BoxedContent(self._content[split_idx:], self._box_width,
                              self.bg_color, self.border_color, self.padding)
        return [first, second]

    def draw(self):
        if not self._content:
            return
        self.canv.setFillColor(self.bg_color)
        self.canv.roundRect(0, 0, self._box_width, self._height, 4, fill=1, stroke=0)
        if self.border_color:
            self.canv.setStrokeColor(self.border_color)
            self.canv.setLineWidth(3)
            self.canv.line(2, 4, 2, self._height - 4)
        inner_w = max(self._box_width - 2 * self.padding - 8, 50)
        y = self._height - self.padding
        for f in self._content:
            try:
                _, fh = f.wrap(inner_w, self._height)
                if y - fh >= -self.padding:
                    f.drawOn(self.canv, self.padding + 8, y - fh)
                y -= fh
            except Exception:
                y -= 14


class WriteArea(Flowable):
    def __init__(self, num_lines=4, width=None, label=None):
        Flowable.__init__(self)
        self._width = width
        self.num_lines = num_lines
        self.label = label
        self.line_height = 24

    def wrap(self, availWidth, availHeight):
        self._width = self._width or availWidth
        label_h = 16 if self.label else 0
        self._height = label_h + self.num_lines * self.line_height + 8
        return (self._width, self._height)

    def draw(self):
        y = self._height
        if self.label:
            self.canv.setFont('Helvetica-Bold', 9.5)
            self.canv.setFillColor(TEAL)
            y -= 14
            self.canv.drawString(0, y, self.label)
            y -= 6
        self.canv.setStrokeColor(BORDER_COLOR)
        self.canv.setLineWidth(0.5)
        for i in range(self.num_lines):
            y -= self.line_height
            self.canv.line(8, y, self._width - 8, y)


# ══════════════════════════════════════════════════════════════
# STYLES
# ══════════════════════════════════════════════════════════════

def create_styles():
    s = {}

    s['body'] = ParagraphStyle('Body', fontName='Helvetica', fontSize=11,
        leading=17.6, textColor=TEXT_PRIMARY, alignment=TA_JUSTIFY, spaceAfter=6)

    s['body_center'] = ParagraphStyle('BodyCenter', parent=s['body'],
        alignment=TA_CENTER)

    s['body_italic'] = ParagraphStyle('BodyItalic', parent=s['body'],
        fontName='Helvetica-Oblique', textColor=TEXT_SECONDARY)

    s['chapter_title'] = ParagraphStyle('ChapterTitle', fontName='Helvetica-Bold',
        fontSize=26, leading=32, textColor=WHITE, alignment=TA_LEFT, spaceAfter=4)

    s['chapter_subtitle'] = ParagraphStyle('ChapterSubtitle', fontName='Helvetica',
        fontSize=12, leading=17, textColor=TEXT_SECONDARY, alignment=TA_LEFT,
        spaceAfter=16)

    s['section_header'] = ParagraphStyle('SectionHeader', fontName='Helvetica-Bold',
        fontSize=16, leading=21, textColor=WHITE, alignment=TA_LEFT,
        spaceBefore=14, spaceAfter=6)

    s['subsection_header'] = ParagraphStyle('SubsectionHeader',
        fontName='Helvetica-Bold', fontSize=13, leading=17, textColor=TEAL,
        alignment=TA_LEFT, spaceBefore=12, spaceAfter=4)

    s['sub3_header'] = ParagraphStyle('Sub3Header', fontName='Helvetica-Bold',
        fontSize=11, leading=15, textColor=TEXT_PRIMARY, alignment=TA_LEFT,
        spaceBefore=10, spaceAfter=3)

    s['callout_title'] = ParagraphStyle('CalloutTitle', fontName='Helvetica-Bold',
        fontSize=10, leading=14, textColor=TEAL, spaceAfter=4)

    s['callout_body'] = ParagraphStyle('CalloutBody', fontName='Helvetica',
        fontSize=10, leading=15, textColor=TEXT_PRIMARY, spaceAfter=4)

    s['gold_title'] = ParagraphStyle('GoldTitle', fontName='Helvetica-Bold',
        fontSize=10, leading=14, textColor=GOLD, spaceAfter=4)

    s['gold_body'] = ParagraphStyle('GoldBody', fontName='Helvetica-Oblique',
        fontSize=10.5, leading=16, textColor=HexColor("#FCD34D"), spaceAfter=4)

    s['bullet'] = ParagraphStyle('Bullet', fontName='Helvetica', fontSize=11,
        leading=17.6, textColor=TEXT_PRIMARY, leftIndent=18, bulletIndent=6,
        spaceAfter=3)

    s['numbered'] = ParagraphStyle('Numbered', fontName='Helvetica', fontSize=11,
        leading=17.6, textColor=TEXT_PRIMARY, leftIndent=22, bulletIndent=4,
        spaceAfter=3)

    s['code'] = ParagraphStyle('Code', fontName='Courier', fontSize=9, leading=13,
        textColor=HexColor("#A5F3FC"), leftIndent=12, spaceAfter=4)

    s['script'] = ParagraphStyle('Script', fontName='Helvetica-Oblique',
        fontSize=10.5, leading=16, textColor=HexColor("#A5F3FC"), leftIndent=16,
        rightIndent=16, spaceAfter=6, spaceBefore=6, alignment=TA_CENTER)

    s['warning_body'] = ParagraphStyle('WarningBody', fontName='Helvetica',
        fontSize=10, leading=15, textColor=HexColor("#FCA5A5"), spaceAfter=4)

    s['timestamp'] = ParagraphStyle('Timestamp', fontName='Courier', fontSize=10,
        leading=14, textColor=TEAL, spaceBefore=6, spaceAfter=2)

    # Cover styles
    s['cover_series'] = ParagraphStyle('CoverSeries', fontName='Helvetica-Bold',
        fontSize=14, leading=18, textColor=TEAL, alignment=TA_CENTER, spaceAfter=6)

    s['cover_main'] = ParagraphStyle('CoverMain', fontName='Helvetica-Bold',
        fontSize=42, leading=48, textColor=WHITE, alignment=TA_CENTER, spaceAfter=4)

    s['cover_sub'] = ParagraphStyle('CoverSub', fontName='Helvetica-Bold',
        fontSize=28, leading=34, textColor=TEAL, alignment=TA_CENTER, spaceAfter=16)

    s['cover_tagline'] = ParagraphStyle('CoverTagline', fontName='Helvetica-Oblique',
        fontSize=12, leading=17, textColor=TEXT_SECONDARY, alignment=TA_CENTER,
        spaceAfter=12)

    s['cover_footer'] = ParagraphStyle('CoverFooter', fontName='Helvetica',
        fontSize=10, leading=14, textColor=TEXT_DIM, alignment=TA_CENTER)

    # TOC styles
    s['toc_heading'] = ParagraphStyle('TOCHeading', fontName='Helvetica-Bold',
        fontSize=24, leading=30, textColor=WHITE, alignment=TA_LEFT, spaceAfter=24)

    s['toc_part'] = ParagraphStyle('TOCPart', fontName='Helvetica-Bold',
        fontSize=12, leading=18, textColor=TEAL, spaceBefore=14, spaceAfter=2)

    s['toc_chapter'] = ParagraphStyle('TOCChapter', fontName='Helvetica-Bold',
        fontSize=10, leading=16, textColor=WHITE, leftIndent=12, spaceAfter=1)

    s['toc_entry'] = ParagraphStyle('TOCEntry', fontName='Helvetica', fontSize=10,
        leading=15, textColor=TEXT_PRIMARY, leftIndent=24)

    # Part divider styles
    s['part_label'] = ParagraphStyle('PartLabel', fontName='Helvetica-Bold',
        fontSize=13, leading=17, textColor=TEAL_DIM, alignment=TA_CENTER,
        spaceAfter=8)

    s['part_name'] = ParagraphStyle('PartName', fontName='Helvetica-Bold',
        fontSize=30, leading=36, textColor=WHITE, alignment=TA_CENTER, spaceAfter=10)

    s['part_desc'] = ParagraphStyle('PartDesc', fontName='Helvetica', fontSize=11,
        leading=16, textColor=TEXT_SECONDARY, alignment=TA_CENTER)

    # Chapter title page styles
    s['chap_page_title'] = ParagraphStyle('ChapPageTitle', fontName='Helvetica-Bold',
        fontSize=32, leading=38, textColor=WHITE, alignment=TA_CENTER, spaceAfter=12)

    s['chap_page_subtitle'] = ParagraphStyle('ChapPageSubtitle',
        fontName='Helvetica-Oblique', fontSize=13, leading=18,
        textColor=TEXT_SECONDARY, alignment=TA_CENTER)

    # Pull quote page styles
    s['pull_quote'] = ParagraphStyle('PullQuote', fontName='Helvetica-Oblique',
        fontSize=18, leading=28, textColor=TEXT_PRIMARY, alignment=TA_LEFT,
        leftIndent=36, rightIndent=36)

    # Quick reference card styles
    s['card_title'] = ParagraphStyle('CardTitle', fontName='Helvetica-Bold',
        fontSize=14, leading=18, textColor=WHITE, alignment=TA_CENTER, spaceAfter=8)

    s['card_body'] = ParagraphStyle('CardBody', fontName='Helvetica', fontSize=10,
        leading=15, textColor=TEXT_PRIMARY, spaceAfter=3)

    s['card_label'] = ParagraphStyle('CardLabel', fontName='Helvetica-Bold',
        fontSize=10, leading=14, textColor=TEAL, spaceBefore=6, spaceAfter=2)

    # Template styles
    s['ws_title'] = ParagraphStyle('WSTitle', fontName='Helvetica-Bold',
        fontSize=16, leading=22, textColor=WHITE, alignment=TA_CENTER,
        spaceBefore=16, spaceAfter=12)

    s['ws_label'] = ParagraphStyle('WSLabel', fontName='Helvetica-Bold',
        fontSize=10, leading=14, textColor=TEAL, spaceBefore=8, spaceAfter=2)

    s['ws_line'] = ParagraphStyle('WSLine', fontName='Courier', fontSize=10,
        leading=20, textColor=TEXT_DIM, leftIndent=8)

    s['ws_instruction'] = ParagraphStyle('WSInstruction', fontName='Helvetica',
        fontSize=9.5, leading=14, textColor=TEXT_SECONDARY, spaceAfter=8)

    # Table styles
    s['table_header'] = ParagraphStyle('TableHeader', fontName='Helvetica-Bold',
        fontSize=9.5, leading=13, textColor=TEAL)

    s['table_cell'] = ParagraphStyle('TableCell', fontName='Helvetica',
        fontSize=9.5, leading=13, textColor=TEXT_PRIMARY)

    s['table_cell_bold'] = ParagraphStyle('TableCellBold', fontName='Helvetica-Bold',
        fontSize=9.5, leading=13, textColor=TEXT_PRIMARY)

    # Final page styles
    s['final_text'] = ParagraphStyle('FinalText', fontName='Helvetica-Oblique',
        fontSize=14, leading=22, textColor=TEXT_PRIMARY, alignment=TA_CENTER,
        spaceAfter=6)

    s['final_bold'] = ParagraphStyle('FinalBold', fontName='Helvetica-Bold',
        fontSize=14, leading=22, textColor=WHITE, alignment=TA_CENTER,
        spaceAfter=6)

    return s


# ══════════════════════════════════════════════════════════════
# PAGE TEMPLATES
# ══════════════════════════════════════════════════════════════

def _draw_bg(c, doc):
    c.saveState()
    c.setFillColor(BG_DARK)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    c.restoreState()


def draw_cover(c, doc):
    _draw_bg(c, doc)
    c.saveState()
    c.setStrokeColor(TEAL)
    c.setLineWidth(2)
    c.line(PAGE_W * 0.15, PAGE_H - 50, PAGE_W * 0.85, PAGE_H - 50)
    c.line(PAGE_W * 0.15, 50, PAGE_W * 0.85, 50)
    c.restoreState()


def draw_body(c, doc):
    _draw_bg(c, doc)
    c.saveState()

    # Header
    y_hdr = PAGE_H - MARGIN_T + 18
    c.setStrokeColor(BORDER_COLOR)
    c.setLineWidth(0.5)
    c.line(MARGIN_L, y_hdr - 4, PAGE_W - MARGIN_R, y_hdr - 4)

    c.setFont('Helvetica', 7)
    c.setFillColor(TEXT_DIM)
    c.drawString(MARGIN_L, y_hdr + 2, "THE ARCHIVIST METHOD")
    c.setFillColor(TEAL_DIM)
    c.drawRightString(PAGE_W - MARGIN_R, y_hdr + 2, "COMPLETE ARCHIVE")

    # Footer
    y_ftr = MARGIN_B - 20
    c.setStrokeColor(BORDER_COLOR)
    c.line(MARGIN_L, y_ftr + 8, PAGE_W - MARGIN_R, y_ftr + 8)

    c.setFont('Helvetica', 7)
    c.setFillColor(TEXT_DIM)
    c.drawString(MARGIN_L, y_ftr - 4, FOOTER_TEXT)
    c.drawRightString(PAGE_W - MARGIN_R, y_ftr - 4, str(c.getPageNumber()))

    c.restoreState()


def draw_part(c, doc):
    _draw_bg(c, doc)


def draw_quote(c, doc):
    _draw_bg(c, doc)
    # Teal left border accent
    c.saveState()
    c.setStrokeColor(TEAL)
    c.setLineWidth(4)
    c.line(MARGIN_L + 20, PAGE_H * 0.3, MARGIN_L + 20, PAGE_H * 0.7)
    c.restoreState()


# ══════════════════════════════════════════════════════════════
# MARKDOWN PARSER
# ══════════════════════════════════════════════════════════════

class MarkdownParser:
    def __init__(self, styles):
        self.styles = styles

    def _esc(self, text):
        return text.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')

    def _inline(self, text):
        text = re.sub(r'\*\*\*(.+?)\*\*\*', r'<b><i>\1</i></b>', text)
        text = re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', text)
        text = re.sub(r'\*(.+?)\*', r'<i>\1</i>', text)
        teal_hex = '14B8A6'
        text = re.sub(r'`([^`]+)`',
            lambda m: f'<font face="Courier" color="#{teal_hex}">{m.group(1)}</font>', text)
        return text

    def parse(self, md_text):
        out = []
        lines = md_text.split('\n')
        i = 0

        while i < len(lines):
            line = lines[i]
            s = line.strip()

            if not s:
                i += 1
                continue

            # Skip top-level headings with section numbers
            if s.startswith('# ') and re.match(r'^# \d+\.\d+', s):
                i += 1
                continue

            # Skip top-level headings that are pattern titles (handled by chapter pages)
            if s.startswith('# PATTERN ') or s.startswith('# EPILOGUE'):
                i += 1
                continue

            # Boxed blocks (═ or ─)
            if '\u2550' in s or '\u2500' in s:
                header_line = s
                block = []
                i += 1
                while i < len(lines):
                    ls = lines[i].strip()
                    if '\u2550' in ls or '\u2500' in ls:
                        i += 1
                        break
                    block.append(ls)
                    i += 1
                text = '\n'.join(block).strip()
                if text:
                    out.extend(self._box(text, header_line))
                continue

            # Code blocks
            if s.startswith('```'):
                code = []
                i += 1
                while i < len(lines):
                    if lines[i].strip().startswith('```'):
                        i += 1
                        break
                    code.append(lines[i])
                    i += 1
                out.extend(self._code_block('\n'.join(code)))
                continue

            # Headers
            if s.startswith('####'):
                t = self._inline(self._esc(s.lstrip('#').strip()))
                out.append(Paragraph(t, self.styles['sub3_header']))
                i += 1; continue

            if s.startswith('###'):
                t = self._inline(self._esc(s.lstrip('#').strip()))
                out.append(Paragraph(t, self.styles['subsection_header']))
                i += 1; continue

            if s.startswith('##'):
                t = self._inline(self._esc(s.lstrip('#').strip()))
                out.append(Spacer(1, 4))
                out.append(Paragraph(t, self.styles['section_header']))
                out.append(HorizontalRule(color=TEAL_DIM))
                out.append(Spacer(1, 4))
                i += 1; continue

            if s.startswith('# '):
                t = self._inline(self._esc(s.lstrip('#').strip()))
                out.append(Paragraph(t, self.styles['chapter_title']))
                i += 1; continue

            # Horizontal rule
            if s in ('---', '***', '___'):
                out.append(Spacer(1, 6))
                out.append(TealDivider())
                out.append(Spacer(1, 6))
                i += 1; continue

            # Timestamps [T+00:00]
            if re.match(r'^\*?\*?\[T[+-]\d+:\d+\]', s):
                t = self._inline(self._esc(s.strip('*')))
                out.append(Paragraph(t, self.styles['timestamp']))
                i += 1; continue

            # Tables
            if '|' in s and i + 1 < len(lines) and '---' in lines[i + 1]:
                table_lines = []
                while i < len(lines) and '|' in lines[i].strip():
                    table_lines.append(lines[i].strip())
                    i += 1
                out.extend(self._table(table_lines))
                continue

            # Bullet points
            if s.startswith('- ') or s.startswith('\u2022 '):
                bt = self._inline(self._esc(s[2:].strip()))
                out.append(Paragraph(
                    f'\u2022  {bt}', self.styles['bullet']))
                i += 1; continue

            # Numbered list
            nm = re.match(r'^(\d+)\.\s+(.+)', s)
            if nm:
                num, txt = nm.group(1), nm.group(2).strip()
                txt = self._inline(self._esc(txt))
                out.append(Paragraph(
                    f'<font color="#14B8A6">{num}.</font>  {txt}',
                    self.styles['numbered']))
                i += 1; continue

            # Regular paragraph
            paras = [s]
            i += 1
            while i < len(lines):
                ns = lines[i].strip()
                if (not ns or ns.startswith('#') or ns.startswith('- ') or
                    ns.startswith('\u2022 ') or ns.startswith('```') or
                    '\u2550' in ns or ns in ('---', '***', '___') or
                    re.match(r'^\d+\.', ns) or re.match(r'^\*?\*?\[T[+-]', ns) or
                    ('|' in ns and i + 1 < len(lines) and '---' in lines[i + 1])):
                    break
                paras.append(ns)
                i += 1
            full = ' '.join(paras)
            full = self._inline(self._esc(full))
            out.append(Paragraph(full, self.styles['body']))

        return out

    def _detect_type(self, header, text):
        c = (header + ' ' + text).upper()
        if 'GOLD NUGGET' in c: return 'gold'
        if 'KEY TAKEAWAY' in c: return 'takeaway'
        if 'QUICK WIN' in c: return 'quickwin'
        if 'WARNING' in c or 'BEFORE YOU' in c or '\u26A0' in c: return 'warning'
        if 'ARCHIVIST OBSERVES' in c: return 'archivist'
        if 'PATTERN ARCHAEOLOGY' in c and 'SUBJECT' in c: return 'log'
        if 'PATTERN EXECUTION LOG' in c: return 'log'
        if 'COPY TO PHONE' in c or 'QUICK REFERENCE' in c: return 'reference'
        return 'info'

    def _box(self, text, header=""):
        out = []
        btype = self._detect_type(header, text)

        configs = {
            'gold':      (GOLD, HexColor("#242010"), 'gold_title', 'gold_body', '\u2666 GOLD NUGGET'),
            'takeaway':  (TEAL, HexColor("#1A2420"), 'callout_title', 'callout_body', '\u2611 KEY TAKEAWAYS'),
            'quickwin':  (HexColor("#22C55E"), HexColor("#1A2A1A"), 'callout_title', 'callout_body', '\u26A1 QUICK WIN'),
            'warning':   (RED_ACCENT, HexColor("#2A1A1A"), 'callout_title', 'warning_body', '\u26A0 IMPORTANT'),
            'archivist': (TEAL_DIM, HexColor("#1E2428"), 'callout_title', 'callout_body', '\U0001F4DC THE ARCHIVIST OBSERVES'),
            'log':       (TEAL_DIM, BG_CODE, 'callout_title', 'callout_body', None),
            'reference': (TEAL, HexColor("#1A2420"), 'callout_title', 'callout_body', None),
            'info':      (TEAL_DIM, BG_CALLOUT, 'callout_title', 'callout_body', None),
        }

        border, bg, title_key, body_key, default_title = configs.get(btype, configs['info'])

        title_style = self.styles[title_key]
        if btype == 'quickwin':
            title_style = ParagraphStyle(f'QW_{id(text)}', parent=title_style,
                                         textColor=HexColor("#22C55E"))
        elif btype == 'warning':
            title_style = ParagraphStyle(f'WN_{id(text)}', parent=title_style,
                                         textColor=RED_ACCENT)
        body_style = self.styles[body_key]

        inner = []
        block_lines = text.split('\n')
        start = 0
        title = default_title

        for idx, bl in enumerate(block_lines):
            bl_s = bl.strip()
            if not bl_s: continue
            emoji_markers = ['\U0001F48E', '\U0001F511', '\u26A1', '\u26A0', '\U0001F4DC']
            keywords = ['GOLD NUGGET', 'KEY TAKEAWAY', 'QUICK WIN', 'WARNING', 'BEFORE YOU', 'ARCHIVIST OBSERVES']
            if any(k in bl_s.upper() for k in keywords) or any(e in bl_s for e in emoji_markers):
                if title is None:
                    title = re.sub(r'[\U0001F48E\U0001F511\u26A1\u26A0\U0001F4DC\s]+$', '', bl_s).strip()
                    title = re.sub(r'^[\U0001F48E\U0001F511\u26A1\u26A0\U0001F4DC\s]+', '', title).strip()
                start = idx + 1
                break
            break

        if title:
            inner.append(Paragraph(self._esc(title), title_style))
            inner.append(Spacer(1, 4))

        remaining = '\n'.join(block_lines[start:]).strip()
        if remaining:
            for ln in remaining.split('\n'):
                ls = ln.strip()
                if not ls:
                    inner.append(Spacer(1, 3))
                    continue
                if ls.startswith('- ') or ls.startswith('\u2022 '):
                    bt = self._inline(self._esc(ls[2:]))
                    inner.append(Paragraph(f'\u2022  {bt}', ParagraphStyle(
                        f'BB_{id(ls)}', parent=body_style, leftIndent=16)))
                else:
                    inner.append(Paragraph(self._inline(self._esc(ls)), body_style))

        out.append(Spacer(1, 6))
        out.append(BoxedContent(inner, bg_color=bg, border_color=border))
        out.append(Spacer(1, 10))
        return out

    def _code_block(self, code):
        out = [Spacer(1, 4)]
        inner = []
        for ln in code.split('\n'):
            escaped = self._esc(ln) if ln.strip() else ' '
            inner.append(Paragraph(escaped, self.styles['code']))
        out.append(BoxedContent(inner, bg_color=BG_CODE, border_color=TEAL_DIM))
        out.append(Spacer(1, 6))
        return out

    def _table(self, table_lines):
        out = []
        if len(table_lines) < 3:
            return out

        headers = [c.strip() for c in table_lines[0].split('|') if c.strip()]
        rows = []
        for line in table_lines[2:]:
            cells = [c.strip() for c in line.split('|') if c.strip()]
            if cells:
                rows.append(cells)

        if not headers or not rows:
            return out

        data = [[Paragraph(self._esc(h), self.styles['table_header']) for h in headers]]
        for row in rows:
            data.append([Paragraph(self._inline(self._esc(c)), self.styles['table_cell'])
                        for c in row])

        ncols = len(headers)
        for row in data:
            while len(row) < ncols:
                row.append(Paragraph('', self.styles['table_cell']))

        col_w = CONTENT_W / ncols
        t = Table(data, colWidths=[col_w] * ncols)
        t.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), HexColor("#222222")),
            ('BACKGROUND', (0, 1), (-1, -1), HexColor("#1E1E1E")),
            ('GRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ('LEFTPADDING', (0, 0), (-1, -1), 8),
            ('RIGHTPADDING', (0, 0), (-1, -1), 8),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ]))

        out.append(Spacer(1, 6))
        out.append(t)
        out.append(Spacer(1, 8))
        return out


# ══════════════════════════════════════════════════════════════
# CONTENT LOADING
# ══════════════════════════════════════════════════════════════

def load_file(path):
    try:
        with open(path, 'r', encoding='utf-8') as f:
            return f.read()
    except FileNotFoundError:
        print(f"  [warn] Not found: {path}")
        return ""


def find_pattern_file(pattern_num, section_key):
    base = CONTENT_DIR / "module-3-patterns"
    suffix = PATTERN_SECTION_SUFFIXES[section_key]
    filename = f"{pattern_num}.{section_key}-{suffix}.md"

    dir_name = PATTERN_DIR_NAMES.get(pattern_num, "")
    if dir_name:
        path = base / dir_name / filename
        if path.exists():
            return load_file(path)

    path = base / filename
    if path.exists():
        return load_file(path)

    print(f"  [warn] Pattern file not found: {filename}")
    return ""


# ══════════════════════════════════════════════════════════════
# COMPLETE ARCHIVE BUILDER
# ══════════════════════════════════════════════════════════════

class CompleteArchiveBuilder:
    def __init__(self):
        self.styles = create_styles()
        self.parser = MarkdownParser(self.styles)
        self.flow = []
        self.pull_quote_idx = 0
        self.page_estimate = 0  # rough page counter for pull quote insertion

    def _esc(self, text):
        return text.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')

    def _inline(self, text):
        text = re.sub(r'\*\*\*(.+?)\*\*\*', r'<b><i>\1</i></b>', text)
        text = re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', text)
        text = re.sub(r'\*(.+?)\*', r'<i>\1</i>', text)
        return text

    # ── Structural Elements ──

    def _part_divider(self, num, title, desc):
        """Full-page part divider."""
        self.flow.append(NextPageTemplate('part'))
        self.flow.append(PageBreak())
        self.flow.append(Spacer(1, 2.3 * inch))
        self.flow.append(Paragraph(f"PART {num}", self.styles['part_label']))
        self.flow.append(Paragraph(title, self.styles['part_name']))
        self.flow.append(Spacer(1, 6))
        self.flow.append(TealDivider())
        self.flow.append(Spacer(1, 14))
        self.flow.append(Paragraph(desc, self.styles['part_desc']))
        self.flow.append(NextPageTemplate('body'))
        self.flow.append(PageBreak())
        self.page_estimate += 1

    def _chapter_title_page(self, title, subtitle=None):
        """Full-page chapter title with just the title centered."""
        self.flow.append(NextPageTemplate('part'))
        self.flow.append(PageBreak())
        self.flow.append(Spacer(1, 2.8 * inch))
        self.flow.append(Paragraph(title, self.styles['chap_page_title']))
        self.flow.append(Spacer(1, 8))
        self.flow.append(HorizontalRule(color=TEAL, thickness=2))
        if subtitle:
            self.flow.append(Spacer(1, 14))
            self.flow.append(Paragraph(subtitle, self.styles['chap_page_subtitle']))
        self.flow.append(NextPageTemplate('body'))
        self.flow.append(PageBreak())
        self.page_estimate += 1

    def _pull_quote_page(self):
        """Full-page pull quote for visual rhythm."""
        if self.pull_quote_idx >= len(PULL_QUOTES):
            return
        quote = PULL_QUOTES[self.pull_quote_idx]
        self.pull_quote_idx += 1

        self.flow.append(NextPageTemplate('quote'))
        self.flow.append(PageBreak())
        self.flow.append(Spacer(1, 2.8 * inch))
        self.flow.append(Paragraph(
            f'\u201c{self._esc(quote)}\u201d',
            self.styles['pull_quote']))
        self.flow.append(NextPageTemplate('body'))
        self.flow.append(PageBreak())
        self.page_estimate += 1

    def _maybe_pull_quote(self):
        """Insert a pull quote page if we are due for one (~every 35 pages)."""
        if self.page_estimate > 0 and self.page_estimate % 35 < 3:
            self._pull_quote_page()

    def _chapter(self, title, content, subtitle=None, page_break=True):
        """Render a chapter with header and parsed markdown content."""
        if not content:
            return
        self.flow.append(Spacer(1, 0.12 * inch))
        self.flow.append(Paragraph(title, self.styles['chapter_title']))
        if subtitle:
            self.flow.append(Paragraph(subtitle, self.styles['chapter_subtitle']))
        self.flow.append(HorizontalRule(color=TEAL, thickness=2))
        self.flow.append(Spacer(1, 8))
        flowables = self.parser.parse(content)
        self.flow.extend(flowables)
        # Estimate pages: ~45 flowables per page roughly
        self.page_estimate += max(1, len(flowables) // 40)
        if page_break:
            self.flow.append(PageBreak())

    def _chapter_from_file(self, title, filepath, subtitle=None, page_break=True):
        """Load a file and render as a chapter."""
        content = load_file(filepath)
        self._chapter(title, content, subtitle, page_break)

    # ── Quick Reference Card ──

    def _quick_reference_card(self, content, pattern_name):
        """Render a quick reference as a bordered card with teal accent."""
        if not content:
            return

        self.flow.append(Spacer(1, 0.1 * inch))

        # Card header
        inner = []
        inner.append(Paragraph(
            f"QUICK REFERENCE: THE {pattern_name.upper()} PATTERN",
            self.styles['card_title']))
        inner.append(Spacer(1, 4))
        inner.append(HorizontalRule(color=TEAL, thickness=1.5))
        inner.append(Spacer(1, 6))

        # Parse the content into the card
        card_flowables = self.parser.parse(content)
        inner.extend(card_flowables)

        self.flow.append(BoxedContent(inner, bg_color=HexColor("#1A2420"),
                                       border_color=TEAL, padding=14))
        self.flow.append(Spacer(1, 10))

    # ════════════════════════════════════════════════════════
    # TITLE PAGE
    # ════════════════════════════════════════════════════════

    def _section_title_page(self):
        self.flow.append(NextPageTemplate('cover'))
        self.flow.append(Spacer(1, 1.4 * inch))

        # Logo icon
        self.flow.append(Paragraph("\u25C6", ParagraphStyle(
            'LogoIcon', fontName='Helvetica', fontSize=42, leading=46,
            textColor=TEAL, alignment=TA_CENTER, spaceAfter=14)))

        self.flow.append(Paragraph(
            "THE ARCHIVIST METHOD\u2122", self.styles['cover_series']))
        self.flow.append(Spacer(1, 10))
        self.flow.append(Paragraph(
            "COMPLETE", self.styles['cover_main']))
        self.flow.append(Paragraph(
            "ARCHIVE", self.styles['cover_sub']))
        self.flow.append(Spacer(1, 6))
        self.flow.append(TealDivider())
        self.flow.append(Spacer(1, 16))

        # Tagline with pink "NOT"
        self.flow.append(Paragraph(
            'The complete system for identifying, interrupting, and overriding<br/>'
            'the 9 patterns destroying your life.',
            self.styles['cover_tagline']))
        self.flow.append(Spacer(1, 12))
        self.flow.append(Paragraph(
            'PATTERN ARCHAEOLOGY, <font color="#EC4899">NOT</font> THERAPY',
            ParagraphStyle('CoverBadge', fontName='Helvetica-Bold',
                           fontSize=11, leading=15, textColor=TEAL,
                           alignment=TA_CENTER, spaceAfter=8)))

        self.flow.append(Spacer(1, 1.2 * inch))
        self.flow.append(Paragraph(
            "thearchivistmethod.com", self.styles['cover_footer']))

        self.flow.append(NextPageTemplate('body'))
        self.flow.append(PageBreak())
        self.page_estimate += 1

    # ════════════════════════════════════════════════════════
    # TABLE OF CONTENTS
    # ════════════════════════════════════════════════════════

    def _section_toc(self):
        S = self.styles
        self.flow.append(Spacer(1, 0.2 * inch))
        self.flow.append(Paragraph("TABLE OF CONTENTS", S['toc_heading']))
        self.flow.append(HorizontalRule(color=TEAL, thickness=1.5))
        self.flow.append(Spacer(1, 12))

        dim_hex = '6B7280'

        toc = [
            ("PART I: ORIENTATION", [
                ("Chapter 1", "Emergency Protocols"),
                ("Chapter 2", "What This Is"),
                ("Chapter 3", "The Four Doors Protocol"),
            ]),
            ("PART II: THE 9 PATTERNS", []),
            ("PART III: ADVANCED WORK", [
                ("", "Pattern Combinations"),
                ("", "Relapse Protocol"),
            ]),
            ("PART IV: CONTEXT", [
                ("", "Patterns at Work"),
                ("", "Patterns in Relationships"),
                ("", "Patterns in Parenting"),
                ("", "Patterns in the Body"),
                ("", "Letters from the Field"),
            ]),
            ("PART V: IMPLEMENTATION", [
                ("", "The 90-Day Protocol"),
                ("", "Daily Practice"),
                ("", "Weekly Check-In"),
                ("", "Progress Markers"),
                ("", "Tracking Templates"),
            ]),
            ("PART VI: RESOURCES", [
                ("", "When to Seek Help"),
                ("", "Finding a Therapist"),
                ("", "Supporting Someone with Patterns"),
                ("", "Glossary"),
                ("", "Reading List"),
            ]),
            ("EPILOGUE", []),
        ]

        for part_name, chapters in toc:
            self.flow.append(Paragraph(part_name, S['toc_part']))
            if part_name == "PART II: THE 9 PATTERNS":
                for pnum in range(1, 10):
                    pname = PATTERN_NAMES[pnum]
                    self.flow.append(Paragraph(
                        f'<font color="#{dim_hex}">\u2500\u2500</font>  '
                        f'Pattern {pnum}: The {pname} Pattern',
                        S['toc_entry']))
            for prefix, name in chapters:
                label = f'{prefix}: {name}' if prefix else name
                self.flow.append(Paragraph(
                    f'<font color="#{dim_hex}">\u2500\u2500</font>  {label}',
                    S['toc_entry']))

        self.flow.append(PageBreak())
        self.page_estimate += 3

    # ════════════════════════════════════════════════════════
    # PART I: ORIENTATION
    # ════════════════════════════════════════════════════════

    def _part_i_orientation(self):
        self._part_divider("I", "ORIENTATION",
            "Emergency protocols. What this is. How the system works.")

        # Chapter 1: Emergency Protocols
        self._chapter_title_page("EMERGENCY PROTOCOLS",
            "For readers in crisis right now.")

        self._chapter_from_file("YOU JUST RAN YOUR PATTERN",
            CONTENT_DIR / "module-0-emergency" / "0.1-you-just-ran-your-pattern.md",
            "What to do right now. Not tomorrow. Now.")

        self._chapter_from_file("FIVE-MINUTE EMERGENCY PROTOCOL",
            CONTENT_DIR / "module-0-emergency" / "0.2-five-minute-emergency.md",
            "Ground. Breathe. Name. Assess. Intend.")

        self._chapter_from_file("WHICH PATTERN RAN?",
            CONTENT_DIR / "module-0-emergency" / "0.3-which-pattern.md",
            "Identify which of the nine patterns just activated.")

        self._chapter_from_file("CRISIS TRIAGE",
            CONTENT_DIR / "module-0-emergency" / "0.4-crisis-triage.md",
            "When the pattern creates real danger.")

        self._maybe_pull_quote()

        # Chapter 2: What This Is
        self._chapter_title_page("WHAT THIS IS",
            "What this is. What this isn\u2019t. Who it\u2019s for.")

        self._chapter_from_file("WHAT THIS IS",
            CONTENT_DIR / "module-1-foundation" / "1.1-what-this-is.md",
            "The Archivist Method: a pattern interruption system")

        self._chapter_from_file("WHY NOT THERAPY",
            CONTENT_DIR / "module-1-foundation" / "1.2-why-not-therapy.md",
            "What therapy does well, what it doesn\u2019t, and where this fills the gap")

        self._chapter_from_file("WHY THIS IS DIFFERENT",
            CONTENT_DIR / "module-1-foundation" / "1.3-why-different.md",
            "Why willpower, journaling, and affirmations failed")

        self._chapter_from_file("WHO THIS IS NOT FOR",
            CONTENT_DIR / "module-1-foundation" / "1.4-who-this-isnt-for.md",
            "Clear boundaries on who should not use this system")

        self._chapter_from_file("THE NINE PATTERNS: OVERVIEW",
            CONTENT_DIR / "module-1-foundation" / "1.5-nine-patterns-overview.md",
            "Nine programs. Nine survival codes. All installed the same way.")

        self._chapter_from_file("IDENTIFY YOUR PRIMARY PATTERN",
            CONTENT_DIR / "module-1-foundation" / "1.6-identify-primary-pattern.md",
            "Three criteria. One pattern. Start here.")

        self._maybe_pull_quote()

        # Chapter 3: The Four Doors Protocol
        self._chapter_title_page("THE FOUR DOORS PROTOCOL",
            "Recognition \u2022 Excavation \u2022 Interruption \u2022 Override")

        self._chapter_from_file("THE FOUR DOORS FRAMEWORK",
            CONTENT_DIR / "module-2-four-doors" / "2.1-framework-overview.md",
            "The system everything else builds on")

        self._chapter_from_file("DOOR 1: RECOGNITION",
            CONTENT_DIR / "module-2-four-doors" / "2.2-door-1-recognition.md",
            "See the pattern while it is running")

        self._chapter_from_file("DOOR 2: EXCAVATION",
            CONTENT_DIR / "module-2-four-doors" / "2.3-door-2-excavation.md",
            "Find the Original Room where the pattern was installed")

        self._chapter_from_file("DOOR 3: INTERRUPTION",
            CONTENT_DIR / "module-2-four-doors" / "2.4-door-3-interruption.md",
            "Break the circuit in the 3\u20137 second gap")

        self._chapter_from_file("DOOR 4: OVERRIDE",
            CONTENT_DIR / "module-2-four-doors" / "2.5-door-4-override.md",
            "Replace the pattern with something that serves you")

        self._maybe_pull_quote()

    # ════════════════════════════════════════════════════════
    # PART II: THE 9 PATTERNS
    # ════════════════════════════════════════════════════════

    def _part_ii_patterns(self):
        self._part_divider("II", "THE 9 PATTERNS",
            "Nine survival programs. Full deep dive on each.\n"
            "Recognition. Excavation. Interruption. Override.")

        for pnum in range(1, 10):
            pname = PATTERN_NAMES[pnum]
            tagline = PATTERN_TAGLINES[pnum]

            print(f"    Pattern {pnum}: {pname}...")

            # Pattern chapter title page
            self._chapter_title_page(
                f"THE {pname.upper()} PATTERN",
                tagline)

            # Load all 12 sections
            for skey in ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11']:
                content = find_pattern_file(pnum, skey)
                if not content:
                    continue

                section_title = PATTERN_SECTION_TITLES[skey]
                section_subtitle = PATTERN_SECTION_SUBTITLES[skey]
                full_title = f"{section_title}"

                # Quick reference gets special card treatment
                if skey == '11':
                    self.flow.append(PageBreak())
                    self._quick_reference_card(content, pname)
                    self.flow.append(PageBreak())
                    self.page_estimate += 2
                else:
                    # All pattern sub-sections get page breaks for breathing room
                    self._chapter(full_title, content, section_subtitle,
                                  page_break=True)

            # Pull quote after every 2-3 patterns
            if pnum in {3, 6, 9}:
                self._pull_quote_page()

    # ════════════════════════════════════════════════════════
    # PART III: ADVANCED WORK
    # ════════════════════════════════════════════════════════

    def _part_iii_advanced(self):
        self._part_divider("III", "ADVANCED WORK",
            "When you run multiple patterns. When the pattern returns.")

        self._maybe_pull_quote()

        # Pattern Combinations
        self._chapter_title_page("PATTERN COMBINATIONS",
            "When you run multiple patterns simultaneously")

        self._chapter_from_file("MULTIPLE PATTERNS",
            CONTENT_DIR / "module-5-advanced" / "5.1-multiple-patterns.md",
            "When you run more than one pattern")

        self._chapter_from_file("PATTERN COMBINATIONS",
            CONTENT_DIR / "module-5-advanced" / "5.2-pattern-combinations.md",
            "Common combinations and how to sequence your work")

        # Relapse Protocol
        self._chapter_title_page("RELAPSE PROTOCOL",
            "When the pattern runs again. Not failure \u2014 data.")

        self._chapter_from_file("RELAPSE PROTOCOL",
            CONTENT_DIR / "module-5-advanced" / "5.3-relapse-protocol.md",
            "Recovery framework for when the pattern returns")

        self._maybe_pull_quote()

    # ════════════════════════════════════════════════════════
    # PART IV: CONTEXT
    # ════════════════════════════════════════════════════════

    def _part_iv_context(self):
        self._part_divider("IV", "CONTEXT",
            "How patterns operate across every domain of your life.")

        self._chapter_title_page("PATTERNS AT WORK",
            "Where the program runs 40+ hours per week")
        self._chapter_from_file("PATTERNS AT WORK",
            CONTENT_DIR / "module-6-context" / "6.1-patterns-at-work.md",
            "How each pattern shows up professionally")

        self._chapter_title_page("PATTERNS IN RELATIONSHIPS",
            "Where the program does the most damage")
        self._chapter_from_file("PATTERNS IN RELATIONSHIPS",
            CONTENT_DIR / "module-6-context" / "6.2-patterns-in-relationships.md",
            "How each pattern operates in intimate relationships")

        self._maybe_pull_quote()

        self._chapter_title_page("PATTERNS IN PARENTING",
            "Breaking the transmission")
        self._chapter_from_file("PATTERNS IN PARENTING",
            CONTENT_DIR / "module-6-context" / "6.3-patterns-in-parenting.md",
            "How patterns transmit to children and how to interrupt the cycle")

        self._chapter_title_page("PATTERNS IN THE BODY",
            "Where the program lives")
        self._chapter_from_file("PATTERNS AND THE BODY",
            CONTENT_DIR / "module-6-context" / "6.4-patterns-and-the-body.md",
            "The somatic dimension of pattern activation")

        self._maybe_pull_quote()

        # Letters from the Field (Module 7)
        self._chapter_title_page("LETTERS FROM THE FIELD",
            "Real reports from people doing the work")
        self._chapter_from_file("LETTERS FROM THE FIELD",
            CONTENT_DIR / "module-7-field-notes" / "7.1-letters-from-the-field.md",
            "Composite accounts drawn from real experiences. The patterns are real. The progress is real.")

        self._maybe_pull_quote()

    # ════════════════════════════════════════════════════════
    # PART V: IMPLEMENTATION
    # ════════════════════════════════════════════════════════

    def _part_v_implementation(self):
        self._part_divider("V", "IMPLEMENTATION",
            "The 90-day protocol. Daily practice. Templates.\n"
            "The minimum viable path to pattern interruption.")

        # The 90-Day Protocol
        self._chapter_title_page("THE 90-DAY PROTOCOL",
            "Four phases. Twelve weeks. One pattern.")

        self._chapter_from_file("THE 90-DAY MAP",
            CONTENT_DIR / "module-4-implementation" / "4.1-the-90-day-map.md",
            "Four phases: Recognition \u2192 Excavation \u2192 Interruption \u2192 Override")

        self._chapter_from_file("WEEKS 1\u20132: RECOGNITION",
            CONTENT_DIR / "module-4-implementation" / "4.2-weeks-1-2-recognition.md",
            "See the pattern. Name it. Track it.")

        self._chapter_from_file("WEEKS 3\u20134: EXCAVATION",
            CONTENT_DIR / "module-4-implementation" / "4.3-weeks-3-4-excavation.md",
            "Find the Original Room. Understand the installation.")

        self._chapter_from_file("WEEKS 5\u20138: INTERRUPTION",
            CONTENT_DIR / "module-4-implementation" / "4.4-weeks-5-8-interruption.md",
            "Break the circuit. Say the script. Choose differently.")

        self._chapter_from_file("WEEKS 9\u201312: OVERRIDE",
            CONTENT_DIR / "module-4-implementation" / "4.5-weeks-9-12-override.md",
            "Replace the pattern. Graduated exposure. New behaviors.")

        self._maybe_pull_quote()

        # Daily Practice
        self._chapter_title_page("DAILY PRACTICE",
            "Five minutes a day. The minimum effective dose.")
        self._chapter_from_file("DAILY PRACTICE PROTOCOL",
            CONTENT_DIR / "module-4-implementation" / "4.6-daily-practice-protocol.md",
            "Template included")

        # Weekly Check-In
        self._chapter_title_page("WEEKLY CHECK-IN",
            "Ten minutes. Same day every week.")
        self._chapter_from_file("WEEKLY CHECK-IN",
            CONTENT_DIR / "module-4-implementation" / "4.7-weekly-check-in.md",
            "Template included")

        # Progress Markers
        self._chapter_title_page("PROGRESS MARKERS",
            "How to know it\u2019s working")
        self._chapter_from_file("PROGRESS MARKERS",
            CONTENT_DIR / "module-4-implementation" / "4.8-progress-markers.md",
            "The signs that tell you the protocol is doing its job")

        self._maybe_pull_quote()

        # Tracking Templates
        self._section_tracking_templates()

    def _section_tracking_templates(self):
        """Printable tracking templates."""
        self._chapter_title_page("TRACKING TEMPLATES",
            "Print these. Fill them in. The data is the antidote to the pattern.")

        S = self.styles

        # Template 1: Pattern Execution Log
        self.flow.append(Paragraph("PATTERN EXECUTION LOG", S['ws_title']))
        self.flow.append(HorizontalRule(color=TEAL, thickness=1.5))
        self.flow.append(Spacer(1, 6))
        self.flow.append(Paragraph(
            "Complete after each pattern activation. Data, not judgment.",
            S['ws_instruction']))

        fields = [
            ("Date / Time", "_______________________________________________"),
            ("Trigger", "_______________________________________________"),
            ("Body Signature", "_______________________________________________"),
            ("Intensity (1\u201310)", "_____ / 10"),
            ("Automatic Thought", "_______________________________________________"),
            ("What the Pattern Wanted", "_______________________________________________"),
            ("What I Did", "_______________________________________________"),
            ("Were They the Same?", "Yes  /  No"),
            ("Circuit Break Used?", "Yes (Full / Short)  /  No"),
            ("Outcome", "_______________________________________________"),
            ("What I Learned", "_______________________________________________"),
        ]
        for label, line in fields:
            self.flow.append(Paragraph(label, S['ws_label']))
            self.flow.append(Paragraph(line, S['ws_line']))
        self.flow.append(PageBreak())

        # Template 2: Weekly Check-In
        self.flow.append(Paragraph("WEEKLY CHECK-IN", S['ws_title']))
        self.flow.append(HorizontalRule(color=TEAL, thickness=1.5))
        self.flow.append(Spacer(1, 6))
        self.flow.append(Paragraph(
            "Ten minutes. Same day every week. Same time.",
            S['ws_instruction']))

        fields2 = [
            ("Week #", "_____"),
            ("Date", "_______________________________________________"),
            ("Protocol Phase", "Recognition  /  Excavation  /  Interruption  /  Override"),
            ("Activations This Week", "_____"),
            ("Strongest Activation (trigger + intensity)",
             "_______________________________________________"),
            ("Circuit Break Attempts", "_____"),
            ("Successful Interruptions", "_____"),
            ("Success Rate", "_____%"),
            ("Override Level Attempted", "1  /  2  /  3  /  4  /  N/A"),
            ("Days Practiced This Week", "_____ / 7"),
            ("Daily Score Average", "_____ / 10"),
            ("What I Noticed", "_______________________________________________"),
            ("What Was Hardest", "_______________________________________________"),
            ("One Thing to Practice Next Week",
             "_______________________________________________"),
        ]
        for label, line in fields2:
            self.flow.append(Paragraph(label, S['ws_label']))
            self.flow.append(Paragraph(line, S['ws_line']))
        self.flow.append(PageBreak())

        # Template 3: Pattern Archaeology Report
        self.flow.append(Paragraph("PATTERN ARCHAEOLOGY REPORT", S['ws_title']))
        self.flow.append(HorizontalRule(color=TEAL, thickness=1.5))
        self.flow.append(Spacer(1, 6))
        self.flow.append(Paragraph(
            "Complete during Weeks 3\u20134 (Excavation Phase). Go slowly. Stop if overwhelmed.",
            S['ws_instruction']))

        fields3 = [
            ("Pattern Name", "_______________________________________________"),
            ("Installation Age (approximate)", "_____"),
            ("The Original Room", "_______________________________________________"),
            ("Who Was There", "_______________________________________________"),
            ("What Happened", "_______________________________________________"),
            ("What I Heard", "_______________________________________________"),
            ("What I Learned", '"If I get close, ________________________________"'),
            ("Survival Logic", '"I must _____________ because ___________________"'),
            ("How Old Is This Code?", "_____ years"),
            ("Is the Original Threat Still Present?", "Yes  /  No"),
            ("Current Trigger", "_______________________________________________"),
            ("Original Trigger", "_______________________________________________"),
            ("What Has Changed Since the Original Room",
             "_______________________________________________"),
        ]
        for label, line in fields3:
            self.flow.append(Paragraph(label, S['ws_label']))
            self.flow.append(Paragraph(line, S['ws_line']))
        self.flow.append(PageBreak())

        # Template 4: 90-Day Review
        self.flow.append(Paragraph("90-DAY REVIEW", S['ws_title']))
        self.flow.append(HorizontalRule(color=TEAL, thickness=1.5))
        self.flow.append(Spacer(1, 6))
        self.flow.append(Paragraph(
            "Complete at the end of your 90-day protocol cycle.",
            S['ws_instruction']))

        fields4 = [
            ("Start Date", "_______________________________________________"),
            ("End Date", "_______________________________________________"),
            ("Pattern Worked On", "_______________________________________________"),
            ("Recognition (can I see it? 1\u201310)", "_____ / 10"),
            ("Speed (how quickly do I catch it?)",
             "Seconds  /  Minutes  /  Hours  /  Days"),
            ("Excavation Complete?", "Yes  /  No"),
            ("Interruption (can I break it? 1\u201310)", "_____ / 10"),
            ("Success Rate (% of activations interrupted)", "_____%"),
            ("Override Level Reached", "1  /  2  /  3  /  4"),
            ("Successful Overrides (total count)", "_____"),
            ("Impact on Pattern\u2019s Cost (1\u201310 improvement)", "_____ / 10"),
            ("Using Witness?", "Yes  /  No"),
            ("Using Professional Support?", "Yes  /  No"),
            ("Next 90 Days Plan", "Repeat  /  New Pattern  /  Maintenance"),
            ("What Changed", "_______________________________________________"),
            ("What Still Needs Work", "_______________________________________________"),
        ]
        for label, line in fields4:
            self.flow.append(Paragraph(label, S['ws_label']))
            self.flow.append(Paragraph(line, S['ws_line']))
        self.flow.append(PageBreak())

        # Template 5: Daily Practice Log (week view)
        self.flow.append(Paragraph("DAILY PRACTICE LOG", S['ws_title']))
        self.flow.append(HorizontalRule(color=TEAL, thickness=1.5))
        self.flow.append(Spacer(1, 6))
        self.flow.append(Paragraph(
            "Track one week of daily five-minute practice sessions.",
            S['ws_instruction']))

        for day in range(1, 8):
            self.flow.append(Paragraph(f"Day {day}", S['ws_label']))
            self.flow.append(Paragraph(
                "Date: ____________  Practiced: Yes / No  "
                "Score: ___/10  Notes: _______________________",
                S['ws_line']))
        self.flow.append(Spacer(1, 12))
        self.flow.append(Paragraph("Week Total: ___/7 days practiced    "
                                    "Average Score: ___/10", S['ws_label']))
        self.flow.append(PageBreak())

        self.page_estimate += 5

    # ════════════════════════════════════════════════════════
    # PART VI: RESOURCES
    # ════════════════════════════════════════════════════════

    def _part_vi_resources(self):
        self._part_divider("VI", "RESOURCES",
            "Professional help. Support for others. Glossary. Reading list.")

        self._chapter_title_page("WHEN TO SEEK HELP",
            "Clear criteria for when professional support is needed")
        self._chapter_from_file("WHEN TO SEEK PROFESSIONAL HELP",
            CONTENT_DIR / "module-8-resources" / "8.2-when-to-seek-professional-help.md",
            "Clear criteria")

        self._chapter_title_page("FINDING A THERAPIST",
            "How to find one who won\u2019t undo this work")
        self._chapter_from_file("FINDING A THERAPIST",
            CONTENT_DIR / "module-8-resources" / "8.3-finding-a-therapist.md",
            "How to find a therapist who complements pattern work")

        self._chapter_title_page("SUPPORTING SOMEONE WITH PATTERNS",
            "For partners, friends, and family")
        self._chapter_from_file("SUPPORTING SOMEONE WITH PATTERNS",
            CONTENT_DIR / "module-8-resources" / "8.4-supporting-someone-with-patterns.md",
            "For partners, friends, family")

        self._maybe_pull_quote()

        self._chapter_title_page("GLOSSARY",
            "All Archivist Method terminology defined")
        self._chapter_from_file("GLOSSARY",
            CONTENT_DIR / "module-8-resources" / "8.5-glossary.md",
            "The language of The Archivist Method")

        self._chapter_title_page("READING LIST",
            "Curated recommendations")
        self._chapter_from_file("RECOMMENDED READING",
            CONTENT_DIR / "module-8-resources" / "8.1-recommended-reading.md",
            "Books that complement this work")

    # ════════════════════════════════════════════════════════
    # EPILOGUE
    # ════════════════════════════════════════════════════════

    def _section_epilogue(self):
        self._chapter_title_page("EPILOGUE",
            "The Archivist\u2019s Final Note")

        content = load_file(CONTENT_DIR / "epilogue" / "epilogue.md")
        if content:
            self.flow.append(Spacer(1, 0.12 * inch))
            self.flow.append(Paragraph("THE ARCHIVIST\u2019S FINAL NOTE",
                                        self.styles['chapter_title']))
            self.flow.append(HorizontalRule(color=TEAL, thickness=2))
            self.flow.append(Spacer(1, 8))
            self.flow.extend(self.parser.parse(content))
            self.flow.append(PageBreak())

    # ════════════════════════════════════════════════════════
    # FINAL PAGE
    # ════════════════════════════════════════════════════════

    def _section_final_page(self):
        self.flow.append(NextPageTemplate('part'))
        self.flow.append(PageBreak())
        self.flow.append(Spacer(1, 2.5 * inch))

        # Logo icon
        self.flow.append(Paragraph("\u25C6", ParagraphStyle(
            'FinalLogo', fontName='Helvetica', fontSize=36, leading=40,
            textColor=TEAL, alignment=TA_CENTER, spaceAfter=20)))

        self.flow.append(Paragraph(
            "You found the thread. You pulled it.",
            self.styles['final_text']))
        self.flow.append(Spacer(1, 8))
        self.flow.append(Paragraph(
            "The pattern doesn\u2019t run you anymore.",
            self.styles['final_text']))
        self.flow.append(Spacer(1, 8))
        self.flow.append(Paragraph(
            "You run you.",
            self.styles['final_bold']))
        self.flow.append(Spacer(1, 1.5 * inch))
        self.flow.append(TealDivider())
        self.flow.append(Spacer(1, 20))
        self.flow.append(Paragraph(
            "THE ARCHIVIST METHOD\u2122",
            ParagraphStyle('FinalBrand', fontName='Helvetica-Bold',
                           fontSize=11, leading=15, textColor=TEAL,
                           alignment=TA_CENTER, spaceAfter=6)))
        self.flow.append(Paragraph(
            "thearchivistmethod.com",
            self.styles['cover_footer']))

    # ════════════════════════════════════════════════════════
    # BUILD
    # ════════════════════════════════════════════════════════

    def build(self):
        output_path = OUTPUT_DIR / "THE-ARCHIVIST-METHOD-COMPLETE-ARCHIVE.pdf"
        OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

        print(f"\n{'='*60}")
        print(f"  THE ARCHIVIST METHOD \u2014 COMPLETE ARCHIVE GENERATOR")
        print(f"  Output: {output_path}")
        print(f"{'='*60}\n")

        print("  [1/9] Title page...")
        self._section_title_page()

        print("  [2/9] Table of contents...")
        self._section_toc()

        print("  [3/9] Part I: Orientation...")
        self._part_i_orientation()

        print("  [4/9] Part II: The 9 Patterns...")
        self._part_ii_patterns()

        print("  [5/9] Part III: Advanced Work...")
        self._part_iii_advanced()

        print("  [6/9] Part IV: Context...")
        self._part_iv_context()

        print("  [7/9] Part V: Implementation...")
        self._part_v_implementation()

        print("  [8/9] Part VI: Resources...")
        self._part_vi_resources()

        print("  [9/9] Epilogue + Final Page...")
        self._section_epilogue()
        self._section_final_page()

        print(f"\n  Rendering PDF ({len(self.flow)} flowables)...")
        print(f"  Estimated pages: {self.page_estimate}")

        doc = BaseDocTemplate(
            str(output_path), pagesize=letter,
            leftMargin=MARGIN_L, rightMargin=MARGIN_R,
            topMargin=MARGIN_T, bottomMargin=MARGIN_B,
            title="The Archivist Method \u2014 Complete Archive",
            author="The Archivist Method",
        )

        frame = Frame(MARGIN_L, MARGIN_B, CONTENT_W,
                      PAGE_H - MARGIN_T - MARGIN_B, id='main')

        doc.addPageTemplates([
            PageTemplate(id='cover', frames=[Frame(MARGIN_L, MARGIN_B,
                CONTENT_W, PAGE_H - MARGIN_T - MARGIN_B, id='cover_f')],
                onPage=draw_cover),
            PageTemplate(id='body', frames=[frame], onPage=draw_body),
            PageTemplate(id='part', frames=[Frame(MARGIN_L, MARGIN_B,
                CONTENT_W, PAGE_H - MARGIN_T - MARGIN_B, id='part_f')],
                onPage=draw_part),
            PageTemplate(id='quote', frames=[Frame(MARGIN_L, MARGIN_B,
                CONTENT_W, PAGE_H - MARGIN_T - MARGIN_B, id='quote_f')],
                onPage=draw_quote),
        ])

        doc.build(self.flow)

        size_kb = os.path.getsize(output_path) / 1024
        size_mb = size_kb / 1024
        print(f"\n  {'='*60}")
        print(f"  COMPLETE ARCHIVE GENERATED")
        print(f"  File: {output_path.name}")
        print(f"  Size: {size_mb:.1f} MB ({size_kb:.0f} KB)")
        print(f"  {'='*60}")
        return str(output_path)


# ══════════════════════════════════════════════════════════════
# MAIN
# ══════════════════════════════════════════════════════════════

def main():
    builder = CompleteArchiveBuilder()
    path = builder.build()
    print(f"\n  Generated: {path}")


if __name__ == '__main__':
    main()
