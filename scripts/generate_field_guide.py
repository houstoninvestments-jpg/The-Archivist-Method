#!/usr/bin/env python3
"""
THE ARCHIVIST METHOD - Field Guide PDF Generator
Generates pattern-specific field guide PDFs with dark theme styling.

Usage:
    python3 generate_field_guide.py <pattern_number>
    python3 generate_field_guide.py 1  # Generates Disappearing pattern guide

Pattern numbers:
    1: Disappearing    2: Apology Loop    3: Testing
    4: Attraction to Harm    5: Draining Bond    6: Compliment Deflection
    7: Perfectionism    8: Success Sabotage    9: Rage
"""

import sys
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

# ── Design Specs (Match Complete Archive) ──
BG_DARK = HexColor("#1A1A1A")          # Background on ALL pages
BG_CALLOUT = HexColor("#242424")       # Callout box background
BG_CODE = HexColor("#222222")          # Code block background
TEAL = HexColor("#14B8A6")             # Primary accent
TEAL_DIM = HexColor("#0F7B6E")         # Dimmed teal
GOLD = HexColor("#F59E0B")             # Gold nugget accent
WHITE = HexColor("#FFFFFF")            # Headers
TEXT_PRIMARY = HexColor("#E5E5E5")     # Body text
TEXT_SECONDARY = HexColor("#9CA3AF")   # Secondary text
TEXT_DIM = HexColor("#6B7280")         # Dim text
BORDER_COLOR = HexColor("#333333")     # Subtle borders
RED_ACCENT = HexColor("#EF4444")       # Warning accent

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
    """Content in a styled box with background and left border.
    Falls back to inline rendering if content exceeds page height."""
    MAX_HEIGHT = 680  # Max height before falling back to splitting

    def __init__(self, content_flowables, width=None, bg_color=BG_CALLOUT,
                 border_color=TEAL, padding=12):
        Flowable.__init__(self)
        self._content = [f for f in content_flowables if f is not None]
        self._box_width = width or CONTENT_W
        self.bg_color = bg_color
        self.border_color = border_color
        self.padding = padding
        self._height = 0
        self._too_tall = False

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
                h += 14  # fallback line height
        self._height = h + 2 * self.padding
        if self._height > self.MAX_HEIGHT:
            self._too_tall = True
            self._height = min(self._height, availHeight)
        return (self._box_width, self._height)

    def split(self, availWidth, availHeight):
        """If too large for current page, move to next page. If too tall for any
        page, break into two BoxedContent pieces."""
        if not self._content:
            return []
        if self._height <= availHeight:
            return []  # fits, no split needed

        # Try to fit on next page (return empty = move to next page)
        if availHeight < 200:
            return []

        # Split content: find a split point
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
            return []  # can't split meaningfully

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


# ══════════════════════════════════════════════════════════════
# STYLES
# ══════════════════════════════════════════════════════════════

def create_styles():
    s = {}

    s['body'] = ParagraphStyle('Body', fontName='Helvetica', fontSize=9.5,
        leading=14, textColor=TEXT_PRIMARY, alignment=TA_JUSTIFY, spaceAfter=6)

    s['body_center'] = ParagraphStyle('BodyCenter', parent=s['body'],
        alignment=TA_CENTER)

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

    s['bullet'] = ParagraphStyle('Bullet', fontName='Helvetica', fontSize=9.5,
        leading=14, textColor=TEXT_PRIMARY, leftIndent=18, bulletIndent=6,
        spaceAfter=3)

    s['numbered'] = ParagraphStyle('Numbered', fontName='Helvetica', fontSize=9.5,
        leading=14, textColor=TEXT_PRIMARY, leftIndent=22, bulletIndent=4,
        spaceAfter=3)

    s['code'] = ParagraphStyle('Code', fontName='Courier', fontSize=9, leading=13,
        textColor=HexColor("#A5F3FC"), leftIndent=12, spaceAfter=4)

    s['warning_body'] = ParagraphStyle('WarningBody', fontName='Helvetica',
        fontSize=10, leading=15, textColor=HexColor("#FCA5A5"), spaceAfter=4)

    s['timestamp'] = ParagraphStyle('Timestamp', fontName='Courier', fontSize=10,
        leading=14, textColor=TEAL, spaceBefore=6, spaceAfter=2)

    # Cover styles
    s['cover_series'] = ParagraphStyle('CoverSeries', fontName='Helvetica-Bold',
        fontSize=12, leading=16, textColor=TEAL, alignment=TA_CENTER, spaceAfter=6)

    s['cover_main'] = ParagraphStyle('CoverMain', fontName='Helvetica-Bold',
        fontSize=42, leading=48, textColor=WHITE, alignment=TA_CENTER, spaceAfter=4)

    s['cover_pattern'] = ParagraphStyle('CoverPattern', fontName='Helvetica-Bold',
        fontSize=34, leading=40, textColor=TEAL, alignment=TA_CENTER, spaceAfter=16)

    s['cover_tagline'] = ParagraphStyle('CoverTagline', fontName='Helvetica-Oblique',
        fontSize=12, leading=17, textColor=TEXT_SECONDARY, alignment=TA_CENTER,
        spaceAfter=20)

    s['cover_footer'] = ParagraphStyle('CoverFooter', fontName='Helvetica',
        fontSize=10, leading=14, textColor=TEXT_DIM, alignment=TA_CENTER)

    # TOC styles
    s['toc_heading'] = ParagraphStyle('TOCHeading', fontName='Helvetica-Bold',
        fontSize=24, leading=30, textColor=WHITE, alignment=TA_LEFT, spaceAfter=24)

    s['toc_section'] = ParagraphStyle('TOCSection', fontName='Helvetica-Bold',
        fontSize=11, leading=18, textColor=TEAL, spaceBefore=12, spaceAfter=2)

    s['toc_entry'] = ParagraphStyle('TOCEntry', fontName='Helvetica', fontSize=10,
        leading=16, textColor=TEXT_PRIMARY, leftIndent=16)

    # Part divider styles
    s['part_label'] = ParagraphStyle('PartLabel', fontName='Helvetica-Bold',
        fontSize=13, leading=17, textColor=TEAL_DIM, alignment=TA_CENTER,
        spaceAfter=8)

    s['part_name'] = ParagraphStyle('PartName', fontName='Helvetica-Bold',
        fontSize=30, leading=36, textColor=WHITE, alignment=TA_CENTER, spaceAfter=10)

    s['part_desc'] = ParagraphStyle('PartDesc', fontName='Helvetica', fontSize=11,
        leading=16, textColor=TEXT_SECONDARY, alignment=TA_CENTER)

    # Pattern overview card styles
    s['pattern_card_name'] = ParagraphStyle('PatternCardName',
        fontName='Helvetica-Bold', fontSize=13, leading=17, textColor=TEAL,
        spaceAfter=4)

    s['pattern_card_body'] = ParagraphStyle('PatternCardBody',
        fontName='Helvetica', fontSize=9.5, leading=14, textColor=TEXT_PRIMARY,
        spaceAfter=2)

    s['pattern_card_label'] = ParagraphStyle('PatternCardLabel',
        fontName='Helvetica-Bold', fontSize=9, leading=13, textColor=TEXT_SECONDARY,
        spaceAfter=1)

    # Worksheet styles
    s['ws_title'] = ParagraphStyle('WSTitle', fontName='Helvetica-Bold',
        fontSize=16, leading=22, textColor=WHITE, alignment=TA_CENTER,
        spaceBefore=16, spaceAfter=12)

    s['ws_label'] = ParagraphStyle('WSLabel', fontName='Helvetica-Bold',
        fontSize=10, leading=14, textColor=TEAL, spaceBefore=10, spaceAfter=2)

    s['ws_line'] = ParagraphStyle('WSLine', fontName='Courier', fontSize=10,
        leading=20, textColor=TEXT_DIM, leftIndent=8)

    s['ws_instruction'] = ParagraphStyle('WSInstruction', fontName='Helvetica',
        fontSize=9.5, leading=14, textColor=TEXT_SECONDARY, spaceAfter=8)

    # CTA styles
    s['cta_heading'] = ParagraphStyle('CTAHeading', fontName='Helvetica-Bold',
        fontSize=22, leading=28, textColor=WHITE, alignment=TA_CENTER,
        spaceAfter=16)

    s['cta_body'] = ParagraphStyle('CTABody', fontName='Helvetica', fontSize=11,
        leading=17, textColor=TEXT_PRIMARY, alignment=TA_CENTER, spaceAfter=10)

    s['cta_price'] = ParagraphStyle('CTAPrice', fontName='Helvetica-Bold',
        fontSize=28, leading=34, textColor=TEAL, alignment=TA_CENTER,
        spaceBefore=12, spaceAfter=8)

    s['cta_url'] = ParagraphStyle('CTAUrl', fontName='Helvetica-Bold',
        fontSize=14, leading=20, textColor=TEAL, alignment=TA_CENTER,
        spaceBefore=12, spaceAfter=8)

    s['table_header'] = ParagraphStyle('TableHeader', fontName='Helvetica-Bold',
        fontSize=9.5, leading=13, textColor=TEAL)

    s['table_cell'] = ParagraphStyle('TableCell', fontName='Helvetica',
        fontSize=9.5, leading=13, textColor=TEXT_PRIMARY)

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
    # Top teal accent line
    c.setStrokeColor(TEAL)
    c.setLineWidth(2)
    c.line(PAGE_W * 0.15, PAGE_H - 50, PAGE_W * 0.85, PAGE_H - 50)
    # Bottom teal accent line
    c.line(PAGE_W * 0.15, 50, PAGE_W * 0.85, 50)
    c.restoreState()


def draw_body(c, doc):
    _draw_bg(c, doc)
    c.saveState()

    # Header: thin line + text
    y_hdr = PAGE_H - MARGIN_T + 18
    c.setStrokeColor(BORDER_COLOR)
    c.setLineWidth(0.5)
    c.line(MARGIN_L, y_hdr - 4, PAGE_W - MARGIN_R, y_hdr - 4)

    c.setFont('Helvetica', 7)
    c.setFillColor(TEXT_DIM)
    c.drawString(MARGIN_L, y_hdr + 2, "THE ARCHIVIST METHOD")
    pname = getattr(doc, '_pattern_name', '')
    if pname:
        c.setFillColor(TEAL_DIM)
        c.drawRightString(PAGE_W - MARGIN_R, y_hdr + 2,
                          f"FIELD GUIDE: THE {pname.upper()} PATTERN")

    # Footer: line + classified text + page number
    y_ftr = MARGIN_B - 20
    c.setStrokeColor(BORDER_COLOR)
    c.line(MARGIN_L, y_ftr + 8, PAGE_W - MARGIN_R, y_ftr + 8)

    c.setFont('Helvetica', 7)
    c.setFillColor(TEXT_DIM)
    c.drawString(MARGIN_L, y_ftr - 4, FOOTER_TEXT)
    c.drawRightString(PAGE_W - MARGIN_R, y_ftr - 4,
                      str(c.getPageNumber()))

    c.restoreState()


def draw_part(c, doc):
    _draw_bg(c, doc)


# ══════════════════════════════════════════════════════════════
# MARKDOWN PARSER
# ══════════════════════════════════════════════════════════════

class MarkdownParser:
    """Converts markdown to reportlab flowables with Archivist dark theme."""

    def __init__(self, styles):
        self.styles = styles

    def _esc(self, text):
        return text.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')

    def _inline(self, text):
        text = re.sub(r'\*\*\*(.+?)\*\*\*', r'<b><i>\1</i></b>', text)
        text = re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', text)
        text = re.sub(r'\*(.+?)\*', r'<i>\1</i>', text)
        teal_hex = TEAL.hexval()[2:] if hasattr(TEAL, 'hexval') else '14B8A6'
        text = re.sub(r'`([^`]+)`',
            lambda m: f'<font face="Courier" color="#{teal_hex}">{m.group(1)}</font>', text)
        text = text.replace('\u2014', '\u2014')  # em dash
        return text

    def parse(self, md_text):
        """Parse markdown into flowables."""
        out = []
        lines = md_text.split('\n')
        i = 0

        while i < len(lines):
            line = lines[i]
            s = line.strip()

            if not s:
                i += 1
                continue

            # Skip top-level headings with section numbers (handled externally as chapter titles)
            if s.startswith('# ') and re.match(r'^# \d+\.\d+', s):
                i += 1
                continue

            # ═══ boxed blocks (Gold Nuggets, Key Takeaways, Quick Wins, etc.)
            if '\u2550' in s or '\u2500' in s:  # ═ or ─
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
                teal_hex = TEAL.hexval()[2:] if hasattr(TEAL, 'hexval') else '14B8A6'
                out.append(Paragraph(
                    f'<font color="#{teal_hex}">{num}.</font>  {txt}',
                    self.styles['numbered']))
                i += 1; continue

            # Regular paragraph (collect continuation lines)
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

        # For quickwin/warning, create custom title style with different color
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

        # Detect title in first line of block
        for idx, bl in enumerate(block_lines):
            bl_s = bl.strip()
            if not bl_s: continue
            emoji_markers = ['\U0001F48E', '\U0001F511', '\u26A1', '\u26A0', '\U0001F4DC']
            keywords = ['GOLD NUGGET', 'KEY TAKEAWAY', 'QUICK WIN', 'WARNING', 'BEFORE YOU', 'ARCHIVIST OBSERVES']
            if any(k in bl_s.upper() for k in keywords) or any(e in bl_s for e in emoji_markers):
                if title is None:
                    title = re.sub(r'[💎🔑⚡⚠️📜\s]+$', '', bl_s).strip()
                    title = re.sub(r'^[💎🔑⚡⚠️📜\s]+', '', title).strip()
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
        for line in table_lines[2:]:  # skip header separator
            cells = [c.strip() for c in line.split('|') if c.strip()]
            if cells:
                rows.append(cells)

        if not headers or not rows:
            return out

        # Build table data
        data = [[Paragraph(self._esc(h), self.styles['table_header']) for h in headers]]
        for row in rows:
            data.append([Paragraph(self._inline(self._esc(c)), self.styles['table_cell'])
                        for c in row])

        # Pad rows to have same number of columns
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


def find_pattern_file(pattern_num, section_key, suffix):
    """Find a pattern file, checking both flat and subdirectory structures."""
    base = CONTENT_DIR / "module-3-patterns"
    filename = f"{pattern_num}.{section_key}-{suffix}.md"

    # Try subdirectory first
    dir_name = PATTERN_DIR_NAMES.get(pattern_num, "")
    if dir_name:
        path = base / dir_name / filename
        if path.exists():
            return load_file(path)

    # Try flat
    path = base / filename
    if path.exists():
        return load_file(path)

    print(f"  [warn] Pattern file not found: {filename}")
    return ""


def get_pattern_files(pnum):
    suffixes = {
        '0': 'at-a-glance', '1': 'what-it-is', '2': 'pattern-in-context',
        '3': 'pattern-markers', '4': 'execution-log', '5': 'the-circuit',
        '6': 'pattern-archaeology', '7': 'what-it-costs', '8': 'how-to-interrupt',
        '9': 'the-override', '10': 'troubleshooting', '11': 'quick-reference',
    }
    files = {}
    for key, suf in suffixes.items():
        content = find_pattern_file(pnum, key, suf)
        if content:
            files[key] = content
    return files


def get_all_at_a_glance(exclude_num):
    """Get at-a-glance content for all patterns except the given one."""
    result = {}
    for pnum in range(1, 10):
        if pnum == exclude_num:
            continue
        content = find_pattern_file(pnum, '0', 'at-a-glance')
        if content:
            result[pnum] = content
    return result


# ══════════════════════════════════════════════════════════════
# FIELD GUIDE BUILDER
# ══════════════════════════════════════════════════════════════

class FieldGuideBuilder:
    def __init__(self, pattern_num):
        self.pnum = pattern_num
        self.name = PATTERN_NAMES[pattern_num]
        self.tagline = PATTERN_TAGLINES[pattern_num]
        self.styles = create_styles()
        self.parser = MarkdownParser(self.styles)
        self.flow = []

    # ── 1. TITLE PAGE ──
    def _section_title_page(self):
        self.flow.append(NextPageTemplate('cover'))
        self.flow.append(Spacer(1, 2.0 * inch))
        self.flow.append(Paragraph("THE ARCHIVIST METHOD", self.styles['cover_series']))
        self.flow.append(Spacer(1, 6))
        self.flow.append(Paragraph("FIELD GUIDE", self.styles['cover_main']))
        self.flow.append(Spacer(1, 10))
        self.flow.append(TealDivider())
        self.flow.append(Spacer(1, 14))
        self.flow.append(Paragraph(
            f"THE {self.name.upper()} PATTERN", self.styles['cover_pattern']))
        self.flow.append(Spacer(1, 10))
        self.flow.append(Paragraph(self.tagline, self.styles['cover_tagline']))
        self.flow.append(Spacer(1, 1.8 * inch))
        self.flow.append(Paragraph(
            "Recognition \u2022 Interruption \u2022 Override",
            self.styles['cover_footer']))
        self.flow.append(Spacer(1, 6))
        self.flow.append(Paragraph(
            "A complete pattern-specific protocol", self.styles['cover_footer']))
        self.flow.append(Spacer(1, 4))
        self.flow.append(Paragraph(
            "thearchivistmethod.com", self.styles['cover_footer']))
        self.flow.append(NextPageTemplate('body'))
        self.flow.append(PageBreak())

    # ── 2. TABLE OF CONTENTS ──
    def _section_toc(self):
        self.flow.append(Spacer(1, 0.2 * inch))
        self.flow.append(Paragraph("CONTENTS", self.styles['toc_heading']))
        self.flow.append(HorizontalRule(color=TEAL, thickness=1.5))
        self.flow.append(Spacer(1, 12))

        sections = [
            ("01  WELCOME", ["What This Is", "Why Not Therapy", "Why This Is Different"]),
            ("02  THE FOUR DOORS PROTOCOL", [
                "The Four Doors Framework"]),
            (f"03  YOUR PATTERN: THE {self.name.upper()} PATTERN", [
                "At a Glance", "What It Is", "Pattern in Context", "Pattern Markers",
                "Execution Log", "The Circuit", "Pattern Archaeology", "What It Costs",
                "How to Interrupt It", "The Override", "Troubleshooting", "Quick Reference"]),
            ("04  THE OTHER 8 PATTERNS", ["Brief overview of each pattern"]),
            ("05  THE 90-DAY PROTOCOL", [
                "The 90-Day Map", "Daily Practice Protocol",
                "Weekly Check-In", "Progress Markers"]),
            ("06  CRISIS PROTOCOLS", [
                "You Just Ran Your Pattern", "Five-Minute Emergency",
                "Which Pattern Ran?", "Crisis Triage"]),
            ("07  TRACKING TEMPLATES", [
                "Pattern Execution Log", "Weekly Check-In Template",
                "Pattern Archaeology Report", "90-Day Review"]),
            ("08  WHAT\u2019S NEXT", ["The Complete Archive"]),
        ]

        dim_hex = TEXT_DIM.hexval()[2:] if hasattr(TEXT_DIM, 'hexval') else '6B7280'
        for heading, entries in sections:
            self.flow.append(Paragraph(heading, self.styles['toc_section']))
            for e in entries:
                self.flow.append(Paragraph(
                    f'<font color="#{dim_hex}">\u2500\u2500</font>  {e}',
                    self.styles['toc_entry']))

        self.flow.append(PageBreak())

    # ── 3. WELCOME ──
    def _section_welcome(self):
        self._part_divider("01", "WELCOME",
            "What The Archivist Method is, why it exists, and how it works.")

        files = [
            ("WHAT THIS IS", "The Archivist Method: a pattern interruption system",
             CONTENT_DIR / "module-1-foundation" / "1.1-what-this-is.md"),
            ("WHY NOT THERAPY", "What therapy does well, what it doesn\u2019t, and where this fills the gap",
             CONTENT_DIR / "module-1-foundation" / "1.2-why-not-therapy.md"),
            ("WHY THIS IS DIFFERENT", "Why willpower, journaling, and affirmations failed",
             CONTENT_DIR / "module-1-foundation" / "1.3-why-different.md"),
        ]
        for title, subtitle, path in files:
            self._chapter(title, load_file(path), subtitle, page_break=False)

    # ── 4. FOUR DOORS PROTOCOL ──
    def _section_four_doors(self):
        self._part_divider("02", "THE FOUR DOORS PROTOCOL",
            "Recognition \u2022 Excavation \u2022 Interruption \u2022 Override")

        # Include framework overview (comprehensive) - individual doors covered
        # in depth in the pattern-specific section
        self._chapter("THE FOUR DOORS FRAMEWORK",
            load_file(CONTENT_DIR / "module-2-four-doors" / "2.1-framework-overview.md"),
            "The four doors, the circuit, and how every pattern runs",
            page_break=False)

    # ── 5. YOUR PATTERN ──
    def _section_your_pattern(self):
        self._part_divider("03", f"THE {self.name.upper()} PATTERN", self.tagline)

        pattern_files = get_pattern_files(self.pnum)
        chapter_map = [
            ('0', "AT A GLANCE", f"The {self.name} Pattern: overview"),
            ('1', "WHAT IT IS", f"Understanding the {self.name} Pattern"),
            ('2', "PATTERN IN CONTEXT", f"The {self.name} Pattern across four domains"),
            ('3', "PATTERN MARKERS", "Body signatures, automatic thoughts, behavioral urges"),
            ('4', "EXECUTION LOG", "A real-time pattern execution, moment by moment"),
            ('5', "THE CIRCUIT", "How the pattern fires and where to interrupt it"),
            ('6', "PATTERN ARCHAEOLOGY", "Where the pattern came from and why it installed"),
            ('7', "WHAT IT COSTS", "Relationships, career, health, time"),
            ('8', "HOW TO INTERRUPT IT", "Circuit Break scripts and practice protocols"),
            ('9', "THE OVERRIDE", "Replacement behaviors that meet the same need"),
            ('10', "TROUBLESHOOTING", "When interruption is not working"),
            ('11', "QUICK REFERENCE", "Everything you need on one page"),
        ]
        # Pattern chapters get page breaks for major sections only
        major_breaks = {'0', '1', '3', '5', '8', '9', '11'}  # at-a-glance, what-it-is, markers, circuit, interrupt, override, reference
        for key, title, subtitle in chapter_map:
            if key in pattern_files:
                self._chapter(title, pattern_files[key], subtitle,
                              page_break=(key in major_breaks))

    # ── 6. THE OTHER 8 PATTERNS ──
    def _section_other_patterns(self):
        self._part_divider("04", "THE OTHER 8 PATTERNS",
            "Brief overview of each pattern. Awareness without deep dive.")

        overviews = get_all_at_a_glance(self.pnum)

        self.flow.append(Spacer(1, 0.15 * inch))
        self.flow.append(Paragraph("THE OTHER 8 PATTERNS",
            self.styles['chapter_title']))
        self.flow.append(Paragraph(
            "You may run more than one pattern. Here is a brief overview of each.",
            self.styles['chapter_subtitle']))
        self.flow.append(HorizontalRule(color=TEAL, thickness=2))
        self.flow.append(Spacer(1, 10))

        for pnum in range(1, 10):
            if pnum == self.pnum:
                continue
            pname = PATTERN_NAMES[pnum]
            ptagline = PATTERN_TAGLINES[pnum]
            content = overviews.get(pnum, "")

            # Pattern card
            inner = []
            inner.append(Paragraph(
                f"PATTERN {pnum}: THE {pname.upper()} PATTERN",
                self.styles['pattern_card_name']))
            inner.append(Paragraph(ptagline, ParagraphStyle(
                f'PT_{pnum}', parent=self.styles['pattern_card_body'],
                textColor=TEXT_SECONDARY, fontName='Helvetica-Oblique')))
            inner.append(Spacer(1, 4))

            # Extract key fields from at-a-glance content
            if content:
                for field in ['SHOWS UP:', 'THE TRIGGER:', 'THE BODY SIGNATURE:',
                              'THE BEHAVIOR:', 'THE COST:', 'THE WIN:',
                              'DIFFICULTY:']:
                    match = re.search(rf'\*?\*?{re.escape(field)}\*?\*?\s*(.+)',
                                      content, re.IGNORECASE)
                    if match:
                        val = match.group(1).strip()
                        label = field.rstrip(':')
                        inner.append(Paragraph(
                            f'<b>{self.parser._esc(label)}:</b> {self.parser._inline(self.parser._esc(val))}',
                            self.styles['pattern_card_body']))

            self.flow.append(BoxedContent(inner, bg_color=BG_CALLOUT,
                                          border_color=TEAL_DIM))
            self.flow.append(Spacer(1, 10))

        self.flow.append(PageBreak())

    # ── 7. 90-DAY PROTOCOL ──
    def _section_90_day(self):
        self._part_divider("05", "THE 90-DAY PROTOCOL",
            "Four phases. Twelve weeks. The minimum viable path to pattern interruption.")

        # Include map (comprehensive overview with all phases), daily practice,
        # and progress markers. Individual week details are in Complete Archive.
        files = [
            ("THE 90-DAY MAP", "Four phases: Recognition \u2192 Excavation \u2192 Interruption \u2192 Override",
             CONTENT_DIR / "module-4-implementation" / "4.1-the-90-day-map.md"),
            ("DAILY PRACTICE PROTOCOL", "Five minutes a day. The minimum effective dose.",
             CONTENT_DIR / "module-4-implementation" / "4.6-daily-practice-protocol.md"),
            ("WEEKLY CHECK-IN", "Ten minutes. Every week. No exceptions.",
             CONTENT_DIR / "module-4-implementation" / "4.7-weekly-check-in.md"),
            ("PROGRESS MARKERS", "How to know it is working",
             CONTENT_DIR / "module-4-implementation" / "4.8-progress-markers.md"),
        ]
        for title, subtitle, path in files:
            self._chapter(title, load_file(path), subtitle, page_break=False)

    # ── 8. CRISIS PROTOCOLS ──
    def _section_crisis(self):
        self._part_divider("06", "CRISIS PROTOCOLS",
            "You just ran your pattern. You are activated. Start here.")

        files = [
            ("YOU JUST RAN YOUR PATTERN", "What to do right now. Not tomorrow. Now.",
             CONTENT_DIR / "module-0-emergency" / "0.1-you-just-ran-your-pattern.md"),
            ("FIVE-MINUTE EMERGENCY PROTOCOL", "Ground. Breathe. Name. Assess. Intend.",
             CONTENT_DIR / "module-0-emergency" / "0.2-five-minute-emergency.md"),
            ("WHICH PATTERN RAN?", "Identify which of the nine patterns just activated.",
             CONTENT_DIR / "module-0-emergency" / "0.3-which-pattern.md"),
            ("CRISIS TRIAGE", "When the pattern creates real danger.",
             CONTENT_DIR / "module-0-emergency" / "0.4-crisis-triage.md"),
        ]
        for title, subtitle, path in files:
            self._chapter(title, load_file(path), subtitle, page_break=False)

    # ── 9. TRACKING TEMPLATES ──
    def _section_templates(self):
        self._part_divider("07", "TRACKING TEMPLATES",
            "Print these. Fill them in. The data is the antidote to the pattern.")

        S = self.styles

        # ── Template 1: Pattern Execution Log ──
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

        # ── Template 2: Weekly Check-In ──
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
            ("Strongest Activation (trigger + intensity)", "_______________________________________________"),
            ("Circuit Break Attempts", "_____"),
            ("Successful Interruptions", "_____"),
            ("Success Rate", "_____%"),
            ("Override Level Attempted", "1  /  2  /  3  /  4  /  N/A"),
            ("Days Practiced This Week", "_____ / 7"),
            ("Daily Score Average", "_____ / 10"),
            ("What I Noticed", "_______________________________________________"),
            ("What Was Hardest", "_______________________________________________"),
            ("One Thing to Practice Next Week", "_______________________________________________"),
        ]
        for label, line in fields2:
            self.flow.append(Paragraph(label, S['ws_label']))
            self.flow.append(Paragraph(line, S['ws_line']))

        self.flow.append(PageBreak())

        # ── Template 3: Pattern Archaeology Report ──
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

        # ── Template 4: 90-Day Review ──
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
            ("Speed (how quickly do I catch it?)", "Seconds  /  Minutes  /  Hours  /  Days"),
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

    # ── 10. WHAT'S NEXT ──
    def _section_whats_next(self):
        self._part_divider("08", "WHAT\u2019S NEXT",
            "You have the field guide. Here is the full system.")

        S = self.styles
        self.flow.append(Spacer(1, 0.4 * inch))
        self.flow.append(Paragraph("THE COMPLETE ARCHIVE", S['cta_heading']))
        self.flow.append(Spacer(1, 8))
        self.flow.append(TealDivider())
        self.flow.append(Spacer(1, 16))

        self.flow.append(Paragraph(
            f"This Field Guide covered the {self.name} Pattern in depth, "
            "with brief overviews of the other eight.",
            S['cta_body']))

        self.flow.append(Paragraph(
            "The Complete Archive contains the full deep dive on all nine patterns\u2014"
            "685 pages of pattern recognition, circuit mapping, interruption scripts, "
            "and override protocols. Every pattern. Every context. Every tool.",
            S['cta_body']))

        self.flow.append(Spacer(1, 12))

        # Feature list
        features = [
            "All 9 patterns: full deep dive (not just at-a-glance)",
            "Pattern combinations and interaction maps",
            "Advanced protocols for multiple overlapping patterns",
            "Context-specific guides: work, relationships, parenting, body",
            "Letters from the field: real stories of pattern interruption",
            "Complete resource library and professional referral guide",
            "Lifetime updates as the method evolves",
        ]
        for f in features:
            self.flow.append(Paragraph(
                f'\u2022  {f}', ParagraphStyle(f'CTA_B_{id(f)}',
                parent=S['body'], leftIndent=24, bulletIndent=12)))

        self.flow.append(Paragraph("$197", S['cta_price']))
        self.flow.append(Paragraph(
            "One purchase. Lifetime access. No subscription.",
            S['cta_body']))

        self.flow.append(Paragraph(
            "thearchivistmethod.com", S['cta_url']))

        self.flow.append(Spacer(1, 0.5 * inch))
        self.flow.append(TealDivider())
        self.flow.append(Spacer(1, 16))

        self.flow.append(Paragraph(
            "The pattern does not know you are reading this.<br/>"
            "That is your advantage.<br/><br/>"
            "Use it.",
            ParagraphStyle('CTAClose', parent=S['body'],
                           alignment=TA_CENTER, textColor=TEXT_SECONDARY,
                           fontName='Helvetica-Oblique', fontSize=12, leading=18)))

        self.flow.append(PageBreak())

    # ── Helpers ──

    def _part_divider(self, num, title, desc):
        self.flow.append(NextPageTemplate('part'))
        if self.flow:
            self.flow.append(PageBreak())
        self.flow.append(Spacer(1, 2.3 * inch))
        self.flow.append(Paragraph(f"SECTION {num}", self.styles['part_label']))
        self.flow.append(Paragraph(title, self.styles['part_name']))
        self.flow.append(Spacer(1, 6))
        self.flow.append(TealDivider())
        self.flow.append(Spacer(1, 14))
        self.flow.append(Paragraph(desc, self.styles['part_desc']))
        self.flow.append(NextPageTemplate('body'))
        self.flow.append(PageBreak())

    def _chapter(self, title, content, subtitle=None, page_break=False):
        if not content:
            return
        self.flow.append(Spacer(1, 0.12 * inch))
        self.flow.append(Paragraph(title, self.styles['chapter_title']))
        if subtitle:
            self.flow.append(Paragraph(subtitle, self.styles['chapter_subtitle']))
        self.flow.append(HorizontalRule(color=TEAL, thickness=2))
        self.flow.append(Spacer(1, 8))
        self.flow.extend(self.parser.parse(content))
        if page_break:
            self.flow.append(PageBreak())

    # ── Build ──

    def build(self):
        output_name = f"THE-ARCHIVIST-METHOD-FIELD-GUIDE-{self.name.upper().replace(' ', '-')}.pdf"
        output_path = OUTPUT_DIR / output_name
        OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

        print(f"\n{'='*60}")
        print(f"  FIELD GUIDE GENERATOR: The {self.name} Pattern")
        print(f"  Output: {output_path}")
        print(f"{'='*60}\n")

        print("  [1/8] Title page...")
        self._section_title_page()
        print("  [2/8] Table of contents...")
        self._section_toc()
        print("  [3/8] Welcome (foundation)...")
        self._section_welcome()
        print("  [4/8] Four Doors Protocol...")
        self._section_four_doors()
        print(f"  [5/8] Your Pattern: {self.name}...")
        self._section_your_pattern()
        print("  [6/8] The Other 8 Patterns...")
        self._section_other_patterns()
        print("  [7/8] 90-Day Protocol + Crisis + Templates...")
        self._section_90_day()
        self._section_crisis()
        self._section_templates()
        print("  [8/8] What's Next...")
        self._section_whats_next()

        print(f"\n  Rendering PDF ({len(self.flow)} flowables)...")

        doc = BaseDocTemplate(
            str(output_path), pagesize=letter,
            leftMargin=MARGIN_L, rightMargin=MARGIN_R,
            topMargin=MARGIN_T, bottomMargin=MARGIN_B,
            title=f"The Archivist Method - Field Guide: The {self.name} Pattern",
            author="The Archivist Method",
        )
        doc._pattern_name = self.name

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
        ])

        doc.build(self.flow)

        size_kb = os.path.getsize(output_path) / 1024
        print(f"\n  Done! {output_path.name}")
        print(f"  Size: {size_kb:.0f} KB")
        return str(output_path)


# ══════════════════════════════════════════════════════════════
# MAIN
# ══════════════════════════════════════════════════════════════

def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)

    pnum = int(sys.argv[1])
    if pnum not in PATTERN_NAMES:
        print(f"Error: Invalid pattern number {pnum}. Must be 1-9.")
        sys.exit(1)

    builder = FieldGuideBuilder(pnum)
    path = builder.build()
    print(f"\n  Generated: {path}")


if __name__ == '__main__':
    main()
