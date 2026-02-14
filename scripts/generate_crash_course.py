#!/usr/bin/env python3
"""
THE ARCHIVIST METHOD - 7-Day Crash Course PDF Generator
Generates the universal crash course PDF with dark theme styling.

Usage:
    python3 generate_crash_course.py
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

# ── Design Specs (Match Field Guides) ──
BG_DARK = HexColor("#1A1A1A")
BG_CALLOUT = HexColor("#242424")
BG_CODE = HexColor("#222222")
TEAL = HexColor("#14B8A6")
TEAL_DIM = HexColor("#0F7B6E")
GOLD = HexColor("#F59E0B")
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
    """Blank lined area for writing exercises."""
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

    s['body'] = ParagraphStyle('Body', fontName='Helvetica', fontSize=9.5,
        leading=14, textColor=TEXT_PRIMARY, alignment=TA_JUSTIFY, spaceAfter=6)

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

    s['bullet'] = ParagraphStyle('Bullet', fontName='Helvetica', fontSize=9.5,
        leading=14, textColor=TEXT_PRIMARY, leftIndent=18, bulletIndent=6,
        spaceAfter=3)

    s['numbered'] = ParagraphStyle('Numbered', fontName='Helvetica', fontSize=9.5,
        leading=14, textColor=TEXT_PRIMARY, leftIndent=22, bulletIndent=4,
        spaceAfter=3)

    s['script'] = ParagraphStyle('Script', fontName='Helvetica-Oblique',
        fontSize=10.5, leading=16, textColor=HexColor("#A5F3FC"), leftIndent=16,
        rightIndent=16, spaceAfter=6, spaceBefore=6, alignment=TA_CENTER)

    s['script_short'] = ParagraphStyle('ScriptShort', fontName='Helvetica-Bold',
        fontSize=11, leading=16, textColor=TEAL, leftIndent=16,
        rightIndent=16, spaceAfter=4, spaceBefore=4, alignment=TA_CENTER)

    s['warning_body'] = ParagraphStyle('WarningBody', fontName='Helvetica',
        fontSize=10, leading=15, textColor=HexColor("#FCA5A5"), spaceAfter=4)

    # Cover styles
    s['cover_series'] = ParagraphStyle('CoverSeries', fontName='Helvetica-Bold',
        fontSize=12, leading=16, textColor=TEAL, alignment=TA_CENTER, spaceAfter=6)

    s['cover_main'] = ParagraphStyle('CoverMain', fontName='Helvetica-Bold',
        fontSize=42, leading=48, textColor=WHITE, alignment=TA_CENTER, spaceAfter=4)

    s['cover_sub'] = ParagraphStyle('CoverSub', fontName='Helvetica-Bold',
        fontSize=28, leading=34, textColor=TEAL, alignment=TA_CENTER, spaceAfter=16)

    s['cover_tagline'] = ParagraphStyle('CoverTagline', fontName='Helvetica-Oblique',
        fontSize=13, leading=18, textColor=TEXT_SECONDARY, alignment=TA_CENTER,
        spaceAfter=12)

    s['cover_note'] = ParagraphStyle('CoverNote', fontName='Helvetica',
        fontSize=10, leading=14, textColor=TEXT_DIM, alignment=TA_CENTER,
        spaceAfter=6)

    s['cover_footer'] = ParagraphStyle('CoverFooter', fontName='Helvetica',
        fontSize=10, leading=14, textColor=TEXT_DIM, alignment=TA_CENTER)

    # Day header style
    s['day_label'] = ParagraphStyle('DayLabel', fontName='Helvetica-Bold',
        fontSize=13, leading=17, textColor=TEAL_DIM, alignment=TA_LEFT,
        spaceAfter=2)

    s['day_title'] = ParagraphStyle('DayTitle', fontName='Helvetica-Bold',
        fontSize=24, leading=30, textColor=WHITE, alignment=TA_LEFT, spaceAfter=4)

    s['day_subtitle'] = ParagraphStyle('DaySubtitle', fontName='Helvetica',
        fontSize=11, leading=16, textColor=TEXT_SECONDARY, alignment=TA_LEFT,
        spaceAfter=12)

    # Part divider styles
    s['part_label'] = ParagraphStyle('PartLabel', fontName='Helvetica-Bold',
        fontSize=13, leading=17, textColor=TEAL_DIM, alignment=TA_CENTER,
        spaceAfter=8)

    s['part_name'] = ParagraphStyle('PartName', fontName='Helvetica-Bold',
        fontSize=30, leading=36, textColor=WHITE, alignment=TA_CENTER, spaceAfter=10)

    s['part_desc'] = ParagraphStyle('PartDesc', fontName='Helvetica', fontSize=11,
        leading=16, textColor=TEXT_SECONDARY, alignment=TA_CENTER)

    # Pattern card styles
    s['pattern_num'] = ParagraphStyle('PatternNum', fontName='Helvetica-Bold',
        fontSize=9, leading=13, textColor=TEAL_DIM, spaceAfter=1)

    s['pattern_name'] = ParagraphStyle('PatternName', fontName='Helvetica-Bold',
        fontSize=12, leading=16, textColor=TEAL, spaceAfter=3)

    s['pattern_desc'] = ParagraphStyle('PatternDesc', fontName='Helvetica',
        fontSize=9.5, leading=14, textColor=TEXT_PRIMARY, spaceAfter=2)

    # CTA styles
    s['cta_heading'] = ParagraphStyle('CTAHeading', fontName='Helvetica-Bold',
        fontSize=22, leading=28, textColor=WHITE, alignment=TA_CENTER,
        spaceAfter=16)

    s['cta_body'] = ParagraphStyle('CTABody', fontName='Helvetica', fontSize=11,
        leading=17, textColor=TEXT_PRIMARY, alignment=TA_CENTER, spaceAfter=10)

    s['cta_price'] = ParagraphStyle('CTAPrice', fontName='Helvetica-Bold',
        fontSize=28, leading=34, textColor=TEAL, alignment=TA_CENTER,
        spaceBefore=12, spaceAfter=4)

    s['cta_price_label'] = ParagraphStyle('CTAPriceLabel', fontName='Helvetica',
        fontSize=11, leading=15, textColor=TEXT_SECONDARY, alignment=TA_CENTER,
        spaceAfter=12)

    s['cta_url'] = ParagraphStyle('CTAUrl', fontName='Helvetica-Bold',
        fontSize=14, leading=20, textColor=TEAL, alignment=TA_CENTER,
        spaceBefore=12, spaceAfter=8)

    s['table_header'] = ParagraphStyle('TableHeader', fontName='Helvetica-Bold',
        fontSize=9, leading=13, textColor=TEAL)

    s['table_cell'] = ParagraphStyle('TableCell', fontName='Helvetica',
        fontSize=9, leading=13, textColor=TEXT_PRIMARY)

    s['table_cell_bold'] = ParagraphStyle('TableCellBold', fontName='Helvetica-Bold',
        fontSize=9, leading=13, textColor=TEXT_PRIMARY)

    # Tracking template styles
    s['ws_label'] = ParagraphStyle('WSLabel', fontName='Helvetica-Bold',
        fontSize=10, leading=14, textColor=TEAL, spaceBefore=8, spaceAfter=2)

    s['ws_line'] = ParagraphStyle('WSLine', fontName='Courier', fontSize=10,
        leading=20, textColor=TEXT_DIM, leftIndent=8)

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

    y_hdr = PAGE_H - MARGIN_T + 18
    c.setStrokeColor(BORDER_COLOR)
    c.setLineWidth(0.5)
    c.line(MARGIN_L, y_hdr - 4, PAGE_W - MARGIN_R, y_hdr - 4)

    c.setFont('Helvetica', 7)
    c.setFillColor(TEXT_DIM)
    c.drawString(MARGIN_L, y_hdr + 2, "THE ARCHIVIST METHOD")
    c.setFillColor(TEAL_DIM)
    c.drawRightString(PAGE_W - MARGIN_R, y_hdr + 2, "7-DAY CRASH COURSE")

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


# ══════════════════════════════════════════════════════════════
# PATTERN DATA
# ══════════════════════════════════════════════════════════════

PATTERN_DESCRIPTIONS = {
    1: ("Disappearing",
        "When closeness approaches, you pull away. You leave before you can be left.",
        "Someone left. Or someone stayed but was not emotionally present. The child learned: distance is safety. Leave before you are left."),
    2: ("Apology Loop",
        "You apologize for existing. For taking up space. For having needs.",
        "Needs were punished. Asking was dangerous. The child learned: I am too much. My needs are a burden. If I shrink, I survive."),
    3: ("Testing",
        "You create tests for people to prove they care. They always fail.",
        "Attachment was unreliable. Love was inconsistent. The child learned: I cannot trust that people will stay. I need to test them constantly."),
    4: ("Attraction to Harm",
        "You are drawn to chaos. You mistake danger for passion.",
        "The primary caregiver was both the source of love and the source of pain. The child learned: this is what love feels like. This electricity. This fear."),
    5: ("Draining Bond",
        "You stay long past the point where staying costs you everything.",
        "The child was responsible for a caregiver's emotional state. Leaving was punished with guilt. The child learned: I must stay. No matter the cost."),
    6: ("Compliment Deflection",
        "You cannot accept praise. Visibility feels like a target on your back.",
        "Being seen was dangerous. Standing out was punished. The child learned: stay invisible. If they notice you, something bad follows."),
    7: ("Perfectionism",
        "You cannot start until conditions are perfect. They never are.",
        "Mistakes were punished. Not just corrected\u2014punished. The child learned: imperfection is unacceptable. If I cannot guarantee the outcome, I cannot risk the attempt."),
    8: ("Success Sabotage",
        "You destroy good things right before they materialize.",
        "Success was punished. Good things were always followed by bad things. The child learned: do not succeed. Better to fail on your terms."),
    9: ("Rage",
        "The anger is not proportional. It is old. It belongs to another room.",
        "The child's boundaries were violated repeatedly. Rage became the only tool that worked. The child learned: when threatened, explode."),
}

PATTERN_BODY_SIGNATURES = {
    1: "Chest tightness, claustrophobic sensation, urge to move toward exits, shallow breathing, temperature drop",
    2: "Preemptive guilt, throat tightening, physical shrinking, stomach knot, face flushing, eye aversion",
    3: "Heart racing, hypervigilance, chest flutter/panic, stomach dropping, restlessness, hot face",
    4: "Intense excitement (mimics attraction), \u201cbutterflies\u201d (actually stress), obsessive thinking; flatness around safe people",
    5: "Chronic exhaustion, heaviness in chest/shoulders, low-grade tension; crushing guilt and nausea when considering leaving",
    6: "Facial heat/flushing, physical squirming, breaking eye contact, nervous laughter, feeling of wrongness",
    7: "Jaw clenching, chest tightness, restless scanning for errors, inability to step away, mental \u201citch\u201d",
    8: "Causeless restlessness, skin-crawling agitation, inability to enjoy calm, insomnia when nothing is wrong",
    9: "Heat rising through chest/neck/face, jaw clenching, fists clenching, heart rate spiking, tunnel vision",
}

PATTERN_TRIGGERS = {
    1: ["Intimacy deepening", "Someone saying \u201cI love you\u201d", "Future plans being discussed",
        "Someone moving closer emotionally", "Being asked to commit"],
    2: ["Needing something from someone", "Being asked your opinion", "Taking up space in a group",
        "Receiving attention", "Making a request"],
    3: ["Things going well (too well)", "Partner being happy/content", "Stability in relationship",
        "Not hearing back quickly enough", "Partner spending time with others"],
    4: ["Meeting someone safe and available (boredom)", "Meeting someone volatile (electricity)",
        "Red flags that feel like excitement", "Calm relationship feeling \u201cwrong\u201d"],
    5: ["Considering leaving a relationship/job/situation", "Someone expressing they need you",
        "Seeing the cost of staying", "Others telling you to leave"],
    6: ["Receiving a compliment", "Being praised publicly", "Performance reviews",
        "Someone noticing your work", "Being singled out positively"],
    7: ["Visible deadlines or projects", "Work that will be judged", "Starting something new",
        "Submitting or publishing", "Being watched while working"],
    8: ["Approaching a milestone", "Things going well", "A promotion or opportunity",
        "Relationship deepening", "Project near completion"],
    9: ["Criticism (real or perceived)", "Being controlled or disrespected", "Boundaries violated",
        "Feeling powerless", "Someone dismissing you"],
}

PATTERN_CIRCUIT_BREAKS = {
    1: {
        "full": "The Disappearing Pattern just activated. I feel [body signature]. The pattern wants me to pull away. I am choosing to stay and communicate instead.",
        "short": "Pattern. Stay.",
    },
    2: {
        "full": "I am about to apologize for [existing/asking/needing]. I have done nothing wrong. I am replacing \u2018sorry\u2019 with \u2018thank you.\u2019",
        "short": "Not sorry. Thank you.",
    },
    3: {
        "full": "The Testing Pattern activated. I want to test if they really care. I am not creating a test. I am asking directly instead.",
        "short": "Not a test. Ask directly.",
    },
    4: {
        "full": "I feel chemistry with this person. Let me check: are they safe or familiar? This is pattern recognition, not love. I am choosing not to pursue until I assess.",
        "short": "Familiar, not safe.",
    },
    5: {
        "full": "I know I should leave this [relationship/job/situation]. I am staying out of pattern, not love or necessity. Leaving is self-preservation, not betrayal.",
        "short": "Pattern, not loyalty.",
    },
    6: {
        "full": "Someone just complimented me. I want to deflect. I am saying only: Thank you. No deflection. No minimization.",
        "short": "Thank you. Full stop.",
    },
    7: {
        "full": "I am revising again. This is the pattern, not quality control. Done is better than perfect. I am submitting now.",
        "short": "Done. Submit.",
    },
    8: {
        "full": "Things are going well and I feel the urge to blow it up. This is the pattern. I do not have to act on this feeling. I can tolerate good.",
        "short": "Tolerate good.",
    },
    9: {
        "full": "The rage is here. It is not me. I am leaving this room for 20 minutes. I will return when I can speak, not explode.",
        "short": "I need 20 minutes.",
    },
}


# ══════════════════════════════════════════════════════════════
# CRASH COURSE BUILDER
# ══════════════════════════════════════════════════════════════

class CrashCourseBuilder:
    def __init__(self):
        self.styles = create_styles()
        self.flow = []

    def _esc(self, text):
        return text.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')

    def _inline(self, text):
        text = re.sub(r'\*\*\*(.+?)\*\*\*', r'<b><i>\1</i></b>', text)
        text = re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', text)
        text = re.sub(r'\*(.+?)\*', r'<i>\1</i>', text)
        return text

    def _gold_box(self, text):
        inner = [
            Paragraph("\u2666 GOLD NUGGET", self.styles['gold_title']),
            Spacer(1, 4),
            Paragraph(self._esc(text), self.styles['gold_body']),
        ]
        self.flow.append(Spacer(1, 8))
        self.flow.append(BoxedContent(inner, bg_color=HexColor("#242010"),
                                       border_color=GOLD))
        self.flow.append(Spacer(1, 10))

    def _key_box(self, items):
        inner = [
            Paragraph("\u2611 KEY TAKEAWAYS", self.styles['callout_title']),
            Spacer(1, 4),
        ]
        for item in items:
            inner.append(Paragraph(
                f"\u2022  {self._esc(item)}", self.styles['callout_body']))
        self.flow.append(Spacer(1, 8))
        self.flow.append(BoxedContent(inner, bg_color=HexColor("#1A2420"),
                                       border_color=TEAL))
        self.flow.append(Spacer(1, 10))

    def _warning_box(self, title, text):
        inner = [
            Paragraph(f"\u26A0 {self._esc(title)}", ParagraphStyle(
                'WarnT', parent=self.styles['callout_title'], textColor=RED_ACCENT)),
            Spacer(1, 4),
            Paragraph(self._esc(text), self.styles['warning_body']),
        ]
        self.flow.append(Spacer(1, 8))
        self.flow.append(BoxedContent(inner, bg_color=HexColor("#2A1A1A"),
                                       border_color=RED_ACCENT))
        self.flow.append(Spacer(1, 10))

    def _info_box(self, title, items):
        inner = [
            Paragraph(self._esc(title), self.styles['callout_title']),
            Spacer(1, 4),
        ]
        for item in items:
            inner.append(Paragraph(
                f"\u2022  {self._esc(item)}", self.styles['callout_body']))
        self.flow.append(Spacer(1, 8))
        self.flow.append(BoxedContent(inner, bg_color=BG_CALLOUT,
                                       border_color=TEAL_DIM))
        self.flow.append(Spacer(1, 10))

    def _day_header(self, day_num, title, subtitle):
        self.flow.append(Spacer(1, 0.1 * inch))
        self.flow.append(Paragraph(f"DAY {day_num}", self.styles['day_label']))
        self.flow.append(Paragraph(title, self.styles['day_title']))
        self.flow.append(Paragraph(subtitle, self.styles['day_subtitle']))
        self.flow.append(HorizontalRule(color=TEAL, thickness=2))
        self.flow.append(Spacer(1, 10))

    def _part_divider(self, label, title, desc):
        self.flow.append(NextPageTemplate('part'))
        self.flow.append(PageBreak())
        self.flow.append(Spacer(1, 2.3 * inch))
        self.flow.append(Paragraph(label, self.styles['part_label']))
        self.flow.append(Paragraph(title, self.styles['part_name']))
        self.flow.append(Spacer(1, 6))
        self.flow.append(TealDivider())
        self.flow.append(Spacer(1, 14))
        self.flow.append(Paragraph(desc, self.styles['part_desc']))
        self.flow.append(NextPageTemplate('body'))
        self.flow.append(PageBreak())

    def _p(self, text):
        self.flow.append(Paragraph(self._inline(self._esc(text)), self.styles['body']))

    def _bullet(self, text):
        self.flow.append(Paragraph(
            f"\u2022  {self._inline(self._esc(text))}", self.styles['bullet']))

    def _num(self, n, text):
        self.flow.append(Paragraph(
            f'<font color="#14B8A6">{n}.</font>  {self._inline(self._esc(text))}',
            self.styles['numbered']))

    # ════════════════════════════════════════════════════════
    # 1. TITLE PAGE
    # ════════════════════════════════════════════════════════

    def _section_title_page(self):
        self.flow.append(NextPageTemplate('cover'))
        self.flow.append(Spacer(1, 1.6 * inch))

        # Logo area — teal diamond icon
        self.flow.append(Paragraph("\u25C6", ParagraphStyle(
            'LogoIcon', fontName='Helvetica', fontSize=36, leading=40,
            textColor=TEAL, alignment=TA_CENTER, spaceAfter=12)))

        self.flow.append(Paragraph(
            "THE ARCHIVIST METHOD\u2122", self.styles['cover_series']))
        self.flow.append(Spacer(1, 10))
        self.flow.append(Paragraph(
            "7-DAY", self.styles['cover_main']))
        self.flow.append(Paragraph(
            "CRASH COURSE", self.styles['cover_sub']))
        self.flow.append(Spacer(1, 6))
        self.flow.append(TealDivider())
        self.flow.append(Spacer(1, 16))
        self.flow.append(Paragraph(
            "Seven days. One pattern. One interrupt.",
            self.styles['cover_tagline']))
        self.flow.append(Spacer(1, 8))
        self.flow.append(Paragraph(
            "PATTERN ARCHAEOLOGY, NOT THERAPY",
            ParagraphStyle('CoverBadge', fontName='Helvetica-Bold',
                           fontSize=10, leading=14, textColor=TEAL_DIM,
                           alignment=TA_CENTER, spaceAfter=8)))
        self.flow.append(Spacer(1, 1.5 * inch))
        self.flow.append(Paragraph(
            "thearchivistmethod.com", self.styles['cover_footer']))

        self.flow.append(NextPageTemplate('body'))
        self.flow.append(PageBreak())

    # ════════════════════════════════════════════════════════
    # 2. WHAT THIS IS
    # ════════════════════════════════════════════════════════

    def _section_what_this_is(self):
        S = self.styles

        self.flow.append(Spacer(1, 0.1 * inch))
        self.flow.append(Paragraph("WHAT THIS IS", S['chapter_title']))
        self.flow.append(Paragraph(
            "And what it is not. And why that matters.",
            S['chapter_subtitle']))
        self.flow.append(HorizontalRule(color=TEAL, thickness=2))
        self.flow.append(Spacer(1, 10))

        # The 90-day problem
        self.flow.append(Paragraph("THE 90-DAY PROBLEM", S['subsection_header']))
        self._p("Every year, millions of people buy self-help programs. Courses. Books. Subscriptions. "
                "They are motivated. They are ready to change. They start strong.")
        self._p("By Day 14, eighty percent have quit.")
        self._p("Not because the programs are bad. Because the programs are too long, too vague, and "
                "too focused on understanding instead of doing. You do not need to understand your "
                "childhood to interrupt a pattern. You need to see it, name it, and do something "
                "different. Once.")
        self._p("That is what this week is for.")

        self.flow.append(Spacer(1, 6))

        # What we're doing this week
        self.flow.append(Paragraph("WHAT WE ARE DOING THIS WEEK", S['subsection_header']))
        self._p("Seven days. One pattern. One interrupt. Proof it works.")
        self._p("You will pick one pattern\u2014the survival program that is costing you the most right "
                "now. You will learn its circuit: how it fires, what it feels like in your body, what "
                "triggers it. Then you will interrupt it. Once. On purpose.")
        self._p("One successful interrupt is proof the pattern can be broken. Everything after that "
                "is repetition and refinement.")

        self._gold_box("You do not need to understand your pattern to interrupt it. "
                       "You do not need to forgive it. You do not need to heal from it. "
                       "You need to see it, name it, and do something different. Once. "
                       "That once is everything.")

        # What this is NOT
        self.flow.append(Paragraph("WHAT THIS IS NOT", S['subsection_header']))
        self._bullet("This is **not therapy.** Therapy explains why the house is on fire. This teaches you how to stop lighting matches.")
        self._bullet("This is **not journaling.** You will not be writing about your feelings. You will be tracking data: triggers, body signatures, activations, outcomes.")
        self._bullet("This is **not mindfulness.** Mindfulness says observe without judgment. This says observe, then act. Observation without action changes nothing.")
        self._bullet("This is **not self-help.** Self-help tells you to love yourself more. This gives you a specific protocol to interrupt a specific behavior in a specific moment.")

        self.flow.append(Spacer(1, 6))

        # The rules
        self.flow.append(Paragraph("THE RULES", S['subsection_header']))
        self._num(1, "**Pick one pattern.** Not two. Not three. One. The most costly one. You will work on others later. For now: one.")
        self._num(2, "**Failure is data.** If the pattern runs, that is not failure. That is an observation. Record it and move on.")
        self._num(3, "**Track just enough.** You do not need a journal. You need a few data points: What triggered it? What did your body do? What did you do? That is enough.")
        self._num(4, "**Say the scripts out loud.** Reading them silently does not work. Your brain needs to hear the interrupt from your own voice. Say it out loud. Every time.")

        self._warning_box("BEFORE YOU BEGIN",
            "This crash course is not a replacement for professional help. If you are in active "
            "crisis, experiencing suicidal ideation, or in an abusive situation, please contact "
            "a crisis resource first. The 988 Suicide and Crisis Lifeline (call or text 988) is "
            "available 24/7. This is a pattern interruption system, not emergency intervention.")

        self.flow.append(PageBreak())

    # ════════════════════════════════════════════════════════
    # 3. THE 9 PATTERNS
    # ════════════════════════════════════════════════════════

    def _section_nine_patterns(self):
        S = self.styles

        self.flow.append(Spacer(1, 0.1 * inch))
        self.flow.append(Paragraph("THE NINE PATTERNS", S['chapter_title']))
        self.flow.append(Paragraph(
            "Nine programs. Nine survival codes. All installed the same way.",
            S['chapter_subtitle']))
        self.flow.append(HorizontalRule(color=TEAL, thickness=2))
        self.flow.append(Spacer(1, 8))

        self._p("Somewhere between the ages of two and twelve, your brain encountered a threat "
                "and wrote a survival program. The program worked. You survived. But the program "
                "never updated. You are now an adult running a child\u2019s code.")
        self._p("Read all nine. Your body will tell you which one is yours.")

        self.flow.append(Spacer(1, 8))

        for pnum in range(1, 10):
            name, tagline, origin = PATTERN_DESCRIPTIONS[pnum]
            inner = [
                Paragraph(f"PATTERN {pnum}", S['pattern_num']),
                Paragraph(f"THE {name.upper()} PATTERN", S['pattern_name']),
                Paragraph(self._esc(tagline), ParagraphStyle(
                    f'PT_{pnum}', parent=S['pattern_desc'],
                    fontName='Helvetica-Oblique', textColor=TEXT_SECONDARY)),
                Spacer(1, 3),
                Paragraph(self._esc(origin), S['pattern_desc']),
            ]
            self.flow.append(BoxedContent(inner, bg_color=BG_CALLOUT,
                                           border_color=TEAL_DIM, padding=10))
            self.flow.append(Spacer(1, 6))

        self.flow.append(Spacer(1, 8))

        # The gut-check line
        gut_inner = [
            Paragraph("YOUR BODY ALREADY KNOWS", self.styles['gold_title']),
            Spacer(1, 4),
            Paragraph(
                "Which one made your stomach drop? Which description made your chest tighten "
                "or your face flush? That is your pattern. Not the one you intellectually agree "
                "with\u2014the one your body responded to.",
                self.styles['gold_body']),
        ]
        self.flow.append(BoxedContent(gut_inner, bg_color=HexColor("#242010"),
                                       border_color=GOLD))
        self.flow.append(Spacer(1, 6))

        self.flow.append(PageBreak())

    # ════════════════════════════════════════════════════════
    # 4. DAY 1: IDENTIFY YOUR PATTERN
    # ════════════════════════════════════════════════════════

    def _section_day1(self):
        self._day_header(1, "IDENTIFY YOUR PATTERN",
            "Name it. Own it. Separate yourself from the code.")

        self._p("Your primary pattern is not the one you run most often. It is the one that "
                "costs you the most. Use three criteria:")

        self.flow.append(Spacer(1, 4))

        self.flow.append(Paragraph("THE THREE CRITERIA", self.styles['subsection_header']))

        self._num(1, '**Highest cost.** Which pattern has done the most damage to your life? '
                     'Relationships, career, health, time, money.')
        self._num(2, '**Most recent activation.** Which pattern ran most recently? '
                     'The one that brought you here.')
        self._num(3, '**Strongest body response.** Which description on the previous pages '
                     'made your body react the most?')

        self._p("If all three criteria point to the same pattern: that is your primary. "
                "If two out of three: that is your primary. If all three differ: go with "
                "highest cost.")

        self.flow.append(Spacer(1, 8))

        # Writing exercise
        self.flow.append(Paragraph("YOUR STARTING PROFILE", self.styles['subsection_header']))

        self.flow.append(WriteArea(1, label="My primary pattern is:"))
        self.flow.append(Spacer(1, 4))
        self.flow.append(WriteArea(1, label="How long I have been running it:"))
        self.flow.append(Spacer(1, 4))
        self.flow.append(WriteArea(2, label="What it has cost me (relationships, career, health, time):"))
        self.flow.append(Spacer(1, 4))
        self.flow.append(WriteArea(1, label="Last time it activated:"))
        self.flow.append(Spacer(1, 4))
        self.flow.append(WriteArea(1, label="What happened:"))

        self.flow.append(Spacer(1, 10))

        self._info_box("SAY THIS OUT LOUD", [
            '"I run the [name] Pattern."',
            'Not "I am [adjective]." Not "I think I might have [name]."',
            '"I run the [name] Pattern."',
            'That sentence separates you from the code. The pattern is something you run. It is not something you are.',
        ])

        self._gold_box("You do not need to be sure. You need to be close enough to start. "
                       "Identification gets refined through practice, not through more assessment.")

        self.flow.append(PageBreak())

    # ════════════════════════════════════════════════════════
    # 5. DAY 2: BODY SIGNATURE
    # ════════════════════════════════════════════════════════

    def _section_day2(self):
        self._day_header(2, "BODY SIGNATURE",
            "The 3\u20137 second window. Your body knows before your brain does.")

        self._p("Every pattern fires in the body first. Before the thought. Before the behavior. "
                "There is a physical signal\u2014a body signature\u2014that arrives in the 3 to 7 seconds "
                "between trigger and action.")
        self._p("This gap is where interruption happens. But you cannot use the gap if you "
                "do not know what your body does.")

        self.flow.append(Spacer(1, 4))
        self.flow.append(Paragraph("THE 3\u20137 SECOND WINDOW", self.styles['subsection_header']))

        self._p("Here is the circuit, every time:")
        self._num(1, "**Trigger** \u2014 something happens in the environment")
        self._num(2, "**Body signature** \u2014 physical sensation (3\u20137 seconds)")
        self._num(3, "**Automatic thought** \u2014 the story the pattern tells")
        self._num(4, "**Behavior** \u2014 the pattern executes")

        self._p("Steps 2 and 3 are the gap. That is your window. The goal this week is to "
                "catch Step 2\u2014the body signature\u2014before you reach Step 4.")

        self.flow.append(Spacer(1, 6))
        self.flow.append(Paragraph("COMMON BODY SIGNATURES BY PATTERN", self.styles['subsection_header']))

        # Build body signature table
        data = [[
            Paragraph("PATTERN", self.styles['table_header']),
            Paragraph("PRIMARY BODY SIGNATURES", self.styles['table_header']),
        ]]
        for pnum in range(1, 10):
            name = PATTERN_NAMES[pnum]
            sigs = PATTERN_BODY_SIGNATURES[pnum]
            data.append([
                Paragraph(self._esc(name), self.styles['table_cell_bold']),
                Paragraph(self._esc(sigs), self.styles['table_cell']),
            ])

        t = Table(data, colWidths=[1.4 * inch, CONTENT_W - 1.4 * inch])
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
        self.flow.append(Spacer(1, 4))
        self.flow.append(t)
        self.flow.append(Spacer(1, 10))

        self.flow.append(Paragraph("TODAY\u2019S ASSIGNMENT", self.styles['subsection_header']))
        self._p("Track your activations today. Every time you notice a body signature\u2014even "
                "after the pattern has already run\u2014record it:")

        self.flow.append(WriteArea(1, label="Time:"))
        self.flow.append(Spacer(1, 2))
        self.flow.append(WriteArea(1, label="Body signature (what I felt physically):"))
        self.flow.append(Spacer(1, 2))
        self.flow.append(WriteArea(1, label="What happened next:"))

        self.flow.append(Spacer(1, 6))

        self._gold_box("Noticing after the fact still counts. You are training your nervous "
                       "system to recognize the signal. Speed comes with repetition. Today, "
                       "noticing at all is the win.")

        self.flow.append(PageBreak())

    # ════════════════════════════════════════════════════════
    # 6. DAY 3: FIND YOUR TRIGGERS
    # ════════════════════════════════════════════════════════

    def _section_day3(self):
        self._day_header(3, "FIND YOUR TRIGGERS",
            "What activates the pattern. Every time.")

        self._p("A trigger is the environmental event that fires the pattern. It is not "
                "the cause of the pattern\u2014that happened in the original room, years ago. "
                "The trigger is the match that lights the fuse today.")
        self._p("Triggers are specific. Not \u201cstress\u201d or \u201crelationships.\u201d A specific moment, "
                "a specific sentence, a specific situation. The more specific your trigger map, "
                "the earlier you can catch the pattern.")

        self.flow.append(Spacer(1, 6))
        self.flow.append(Paragraph("COMMON TRIGGERS BY PATTERN", self.styles['subsection_header']))

        for pnum in range(1, 10):
            name = PATTERN_NAMES[pnum]
            triggers = PATTERN_TRIGGERS[pnum]

            inner = [
                Paragraph(f"THE {name.upper()} PATTERN", ParagraphStyle(
                    f'TN_{pnum}', parent=self.styles['callout_title'])),
                Spacer(1, 2),
            ]
            for trig in triggers:
                inner.append(Paragraph(
                    f"\u2022  {self._esc(trig)}", self.styles['callout_body']))

            self.flow.append(BoxedContent(inner, bg_color=BG_CALLOUT,
                                           border_color=TEAL_DIM, padding=8))
            self.flow.append(Spacer(1, 4))

        self.flow.append(Spacer(1, 8))
        self.flow.append(Paragraph("YOUR TOP 3 TRIGGERS", self.styles['subsection_header']))
        self._p("Based on the list above and your own experience, identify the three "
                "situations most likely to activate your pattern this week:")

        self.flow.append(WriteArea(1, label="Trigger 1:"))
        self.flow.append(Spacer(1, 2))
        self.flow.append(WriteArea(1, label="Trigger 2:"))
        self.flow.append(Spacer(1, 2))
        self.flow.append(WriteArea(1, label="Trigger 3:"))

        self.flow.append(Spacer(1, 8))

        self._key_box([
            "Triggers are specific, not vague. Not \u201cstress\u201d\u2014the exact moment.",
            "Most patterns have 3\u20135 primary triggers that account for 80% of activations.",
            "Knowing your triggers lets you prepare before the pattern fires.",
            "You cannot avoid all triggers. The goal is recognition, not avoidance.",
        ])

        self.flow.append(PageBreak())

    # ════════════════════════════════════════════════════════
    # 7. DAY 4: CIRCUIT BREAK
    # ════════════════════════════════════════════════════════

    def _section_day4(self):
        self._day_header(4, "CIRCUIT BREAK",
            "The interrupt. A specific script you say out loud in the gap.")

        self._p("A Circuit Break is a verbal interrupt\u2014a script you say out loud in the "
                "3 to 7 seconds between the body signature and the behavior. It works because "
                "speaking activates the prefrontal cortex, which is the part of the brain the "
                "pattern bypasses.")
        self._p("You do not need to believe the script. You do not need to feel it. You need "
                "to say it. Out loud. The neural interrupt works whether you believe it or not.")

        self.flow.append(Spacer(1, 4))
        self.flow.append(Paragraph("HOW IT WORKS", self.styles['subsection_header']))

        self._num(1, "You feel the body signature (Day 2)")
        self._num(2, "You recognize the trigger (Day 3)")
        self._num(3, "You say the Circuit Break script out loud")
        self._num(4, "You choose a different behavior")

        self._p("Step 3 is the interrupt. It breaks the automatic sequence. The pattern "
                "expects silence between trigger and behavior. Your voice is the disruption.")

        self.flow.append(Spacer(1, 6))
        self.flow.append(Paragraph("CIRCUIT BREAK SCRIPTS FOR ALL 9 PATTERNS",
                                    self.styles['subsection_header']))

        for pnum in range(1, 10):
            name = PATTERN_NAMES[pnum]
            scripts = PATTERN_CIRCUIT_BREAKS[pnum]

            inner = [
                Paragraph(f"PATTERN {pnum}: {name.upper()}", ParagraphStyle(
                    f'CB_{pnum}', parent=self.styles['callout_title'])),
                Spacer(1, 6),
                Paragraph("Full script:", ParagraphStyle(
                    f'CBL_{pnum}', parent=self.styles['callout_body'],
                    textColor=TEXT_SECONDARY, fontSize=9)),
                Paragraph(f'"{self._esc(scripts["full"])}"',
                          self.styles['script']),
                Spacer(1, 4),
                Paragraph("Short version:", ParagraphStyle(
                    f'CBS_{pnum}', parent=self.styles['callout_body'],
                    textColor=TEXT_SECONDARY, fontSize=9)),
                Paragraph(f'"{self._esc(scripts["short"])}"',
                          self.styles['script_short']),
            ]
            self.flow.append(BoxedContent(inner, bg_color=BG_CALLOUT,
                                           border_color=TEAL_DIM, padding=10))
            self.flow.append(Spacer(1, 6))

        self.flow.append(Spacer(1, 6))
        self.flow.append(Paragraph("PRACTICE EXERCISE", self.styles['subsection_header']))

        self._num(1, "Find your pattern\u2019s Circuit Break script above.")
        self._num(2, "Say the full script out loud. Five times. Right now.")
        self._num(3, "Say the short version out loud. Five times.")
        self._num(4, "Close your eyes. Imagine the last time your pattern activated. Replay the body signature. Now say the script.")
        self._num(5, "Repeat this exercise before bed tonight.")

        self._p("By tomorrow, the script should feel automatic. Not natural\u2014automatic. "
                "Natural comes later. For now, you just need the words ready.")

        self._gold_box("The script does not need to feel true. It needs to be said. "
                       "Your prefrontal cortex does not care about sincerity. It cares about activation. "
                       "Speaking is activation. That is enough.")

        self.flow.append(PageBreak())

    # ════════════════════════════════════════════════════════
    # 8. DAY 5: FIRST INTERRUPT
    # ════════════════════════════════════════════════════════

    def _section_day5(self):
        self._day_header(5, "FIRST INTERRUPT",
            "Today you use it. For real. In the gap.")

        self._p("Today you attempt your first live interrupt. This means: when the pattern "
                "activates\u2014when you feel the body signature and recognize the trigger\u2014you "
                "say the Circuit Break script out loud and choose a different behavior.")

        self.flow.append(Spacer(1, 4))
        self.flow.append(Paragraph("WHAT TO EXPECT", self.styles['subsection_header']))

        self._p("There are three possible outcomes today:")

        inner_auto = [
            Paragraph("OUTCOME 1: AUTO", ParagraphStyle(
                'Auto', parent=self.styles['callout_title'], textColor=RED_ACCENT)),
            Spacer(1, 4),
            Paragraph("The pattern runs before you can catch it. You realize afterward "
                      "that it activated. This is normal. This is still data.",
                      self.styles['callout_body']),
            Spacer(1, 4),
            Paragraph("What to do: Record the activation. Note the trigger and body "
                      "signature. Practice the script again tonight.",
                      self.styles['callout_body']),
        ]
        self.flow.append(BoxedContent(inner_auto, bg_color=HexColor("#2A1A1A"),
                                       border_color=RED_ACCENT, padding=10))
        self.flow.append(Spacer(1, 6))

        inner_pause = [
            Paragraph("OUTCOME 2: PAUSE", ParagraphStyle(
                'Pause', parent=self.styles['callout_title'], textColor=GOLD)),
            Spacer(1, 4),
            Paragraph("You feel the body signature. You recognize it as the pattern. "
                      "You pause\u2014even for a second\u2014before the behavior executes. "
                      "You may or may not say the script. The pattern may still run.",
                      self.styles['callout_body']),
            Spacer(1, 4),
            Paragraph("This is significant. A pause means the gap is opening. "
                      "You are building awareness.",
                      ParagraphStyle('PauseNote', parent=self.styles['callout_body'],
                                     fontName='Helvetica-Bold')),
        ]
        self.flow.append(BoxedContent(inner_pause, bg_color=HexColor("#242010"),
                                       border_color=GOLD, padding=10))
        self.flow.append(Spacer(1, 6))

        inner_rewrite = [
            Paragraph("OUTCOME 3: REWRITE", ParagraphStyle(
                'Rewrite', parent=self.styles['callout_title'], textColor=TEAL)),
            Spacer(1, 4),
            Paragraph("You feel the body signature. You say the Circuit Break script. "
                      "You choose a different behavior. The pattern does not execute.",
                      self.styles['callout_body']),
            Spacer(1, 4),
            Paragraph("This is a successful interrupt. This is proof.",
                      ParagraphStyle('RNote', parent=self.styles['callout_body'],
                                     fontName='Helvetica-Bold', textColor=TEAL)),
        ]
        self.flow.append(BoxedContent(inner_rewrite, bg_color=HexColor("#1A2420"),
                                       border_color=TEAL, padding=10))
        self.flow.append(Spacer(1, 10))

        self.flow.append(Paragraph("TRACKING TEMPLATE", self.styles['subsection_header']))

        self.flow.append(WriteArea(1, label="Date / Time:"))
        self.flow.append(Spacer(1, 2))
        self.flow.append(WriteArea(1, label="Trigger:"))
        self.flow.append(Spacer(1, 2))
        self.flow.append(WriteArea(1, label="Body signature:"))
        self.flow.append(Spacer(1, 2))
        self.flow.append(WriteArea(1, label="Did I say the script? (Yes / No):"))
        self.flow.append(Spacer(1, 2))
        self.flow.append(WriteArea(1, label="Outcome (AUTO / PAUSE / REWRITE):"))
        self.flow.append(Spacer(1, 2))
        self.flow.append(WriteArea(1, label="What I did instead:"))

        self.flow.append(Spacer(1, 6))

        self._gold_box("AUTO is not failure. PAUSE is not failure. The only failure is not trying. "
                       "If the pattern runs today, you now have data you did not have yesterday. "
                       "That is progress.")

        self.flow.append(PageBreak())

    # ════════════════════════════════════════════════════════
    # 9. DAY 6: REFINE
    # ════════════════════════════════════════════════════════

    def _section_day6(self):
        self._day_header(6, "REFINE",
            "What went wrong. What to adjust. Try again.")

        self._p("Day 5 gave you data. Today you analyze it and adjust.")

        self.flow.append(Spacer(1, 4))
        self.flow.append(Paragraph("WHAT WENT WRONG ANALYSIS", self.styles['subsection_header']))

        self._p("If the pattern ran (AUTO or PAUSE), work through these questions:")

        self._num(1, "**Where in the circuit did you catch it?** After the behavior? During the behavior? At the body signature? At the trigger?")
        self._num(2, "**What prevented the interrupt?** Too fast? Did not recognize the body signature? Forgot the script? Were around other people?")
        self._num(3, "**What would you do differently?** Knowing what you know now, where could you have intervened?")

        self.flow.append(WriteArea(2, label="Where I caught the pattern:"))
        self.flow.append(Spacer(1, 4))
        self.flow.append(WriteArea(2, label="What prevented the interrupt:"))
        self.flow.append(Spacer(1, 4))
        self.flow.append(WriteArea(2, label="What I will do differently:"))

        self.flow.append(Spacer(1, 8))

        self.flow.append(Paragraph("ADJUSTMENTS", self.styles['subsection_header']))

        self._p("Based on your analysis, make one or more of these adjustments:")

        self._bullet("**If you did not catch the body signature:** Spend 5 minutes now with eyes closed, "
                     "replaying the activation. Focus only on the physical sensation. Where was it? What did it feel like? Name it precisely.")
        self._bullet("**If you caught it but could not say the script:** Switch to the short version. "
                     "Two words are better than silence.")
        self._bullet("**If you said the script but the pattern ran anyway:** That is normal for the "
                     "first attempt. The interrupt does not need to be perfect. It needs to be present. "
                     "Try again.")
        self._bullet("**If the pattern did not activate at all:** Good. It will. When it does, you "
                     "are ready. Practice the script three more times tonight so it stays loaded.")

        self.flow.append(Spacer(1, 8))

        self.flow.append(Paragraph("TRY AGAIN", self.styles['subsection_header']))

        self._p("Repeat Day 5. Same protocol:")
        self._num(1, "Watch for the body signature")
        self._num(2, "Recognize the trigger")
        self._num(3, "Say the Circuit Break script out loud")
        self._num(4, "Choose a different behavior")
        self._num(5, "Record the outcome (AUTO / PAUSE / REWRITE)")

        self._key_box([
            "The gap between trigger and behavior widens with practice.",
            "Catching the pattern after the fact is progress\u2014your awareness is growing.",
            "The short script works. Use it if the full version is too long in the moment.",
            "Most people need 3\u20135 attempts before their first successful REWRITE.",
            "You are not behind. You are training a nervous system that has been running this code for years.",
        ])

        self.flow.append(PageBreak())

    # ════════════════════════════════════════════════════════
    # 10. DAY 7: DECIDE
    # ════════════════════════════════════════════════════════

    def _section_day7(self):
        self._day_header(7, "DECIDE",
            "Review your week. Assess your results. Choose what is next.")

        self._p("You have spent six days learning one pattern\u2019s circuit. Today you take stock.")

        self.flow.append(Spacer(1, 4))
        self.flow.append(Paragraph("REVIEW YOUR WEEK", self.styles['subsection_header']))

        self.flow.append(WriteArea(1, label="Pattern I worked on:"))
        self.flow.append(Spacer(1, 2))
        self.flow.append(WriteArea(1, label="Number of times it activated:"))
        self.flow.append(Spacer(1, 2))
        self.flow.append(WriteArea(1, label="Number of times I caught the body signature:"))
        self.flow.append(Spacer(1, 2))
        self.flow.append(WriteArea(1, label="Number of times I said the Circuit Break script:"))
        self.flow.append(Spacer(1, 2))
        self.flow.append(WriteArea(1, label="Number of successful interrupts (REWRITE):"))

        self.flow.append(Spacer(1, 8))
        self.flow.append(Paragraph("WHAT YOUR RESULTS MEAN", self.styles['subsection_header']))

        inner_r1 = [
            Paragraph("IF YOU HAD A REWRITE", ParagraphStyle(
                'R1', parent=self.styles['callout_title'], textColor=TEAL)),
            Spacer(1, 4),
            Paragraph("Even one successful interrupt is proof. The pattern can be broken. "
                      "It is not permanent. It is not who you are. It is a program, and "
                      "programs can be rewritten. You have evidence now.",
                      self.styles['callout_body']),
        ]
        self.flow.append(BoxedContent(inner_r1, bg_color=HexColor("#1A2420"),
                                       border_color=TEAL, padding=10))
        self.flow.append(Spacer(1, 6))

        inner_r2 = [
            Paragraph("IF YOU HAD PAUSES BUT NO REWRITE", ParagraphStyle(
                'R2', parent=self.styles['callout_title'], textColor=GOLD)),
            Spacer(1, 4),
            Paragraph("A pause is the gap opening. You are building awareness. The interrupt "
                      "is coming. Most people need more than one week. You are ahead of where "
                      "you were seven days ago.",
                      self.styles['callout_body']),
        ]
        self.flow.append(BoxedContent(inner_r2, bg_color=HexColor("#242010"),
                                       border_color=GOLD, padding=10))
        self.flow.append(Spacer(1, 6))

        inner_r3 = [
            Paragraph("IF IT WAS ALL AUTO", ParagraphStyle(
                'R3', parent=self.styles['callout_title'], textColor=TEXT_SECONDARY)),
            Spacer(1, 4),
            Paragraph("You know more about your pattern now than you did seven days ago. "
                      "You can name it. You know its body signature. You know its triggers. "
                      "You have a script ready. The awareness is there. The speed will come.",
                      self.styles['callout_body']),
        ]
        self.flow.append(BoxedContent(inner_r3, bg_color=BG_CALLOUT,
                                       border_color=TEXT_DIM, padding=10))
        self.flow.append(Spacer(1, 10))

        self.flow.append(Paragraph("YOUR DECISION", self.styles['subsection_header']))

        self._p("You have three options:")

        self._num(1, "**Keep practicing.** Repeat this crash course for another week. Same pattern, same script. Repetition builds the neural pathway.")
        self._num(2, "**Go deeper with the Quick-Start System.** Your pattern-specific Field Guide with the full 90-day protocol, deep-dive content, and tracking templates.")
        self._num(3, "**Get the Complete Archive.** All nine patterns, full depth. 685 pages of pattern recognition, circuit mapping, interruption scripts, and override protocols.")

        self._p("There is no wrong answer. The only wrong answer is going back to sleep\u2014"
                "pretending you do not see the pattern now that you have seen it.")

        self._gold_box("The pattern does not know you are reading this. That is your advantage. Use it.")

        self.flow.append(PageBreak())

    # ════════════════════════════════════════════════════════
    # 11. WHAT'S NEXT
    # ════════════════════════════════════════════════════════

    def _section_whats_next(self):
        S = self.styles

        self.flow.append(Spacer(1, 0.3 * inch))
        self.flow.append(Paragraph("WHAT\u2019S NEXT", S['cta_heading']))
        self.flow.append(Spacer(1, 4))
        self.flow.append(TealDivider())
        self.flow.append(Spacer(1, 16))

        self._p("This crash course gave you the mechanics: one pattern, one circuit, one interrupt. "
                "If you want to go deeper, here is what is available.")

        self.flow.append(Spacer(1, 16))

        # Quick-Start System
        inner_qs = [
            Paragraph("QUICK-START SYSTEM", ParagraphStyle(
                'QST', parent=S['callout_title'], fontSize=14)),
            Spacer(1, 6),
            Paragraph("Your pattern-specific Field Guide. The full deep dive on one pattern: "
                      "what it is, how it shows up across every context, body signatures, "
                      "the circuit, pattern archaeology, interruption scripts, override protocols, "
                      "the complete 90-day protocol, crisis protocols, and tracking templates.",
                      S['callout_body']),
            Spacer(1, 6),
            Paragraph("Everything you need to interrupt one pattern permanently.",
                      ParagraphStyle('QSNote', parent=S['callout_body'],
                                     fontName='Helvetica-Bold')),
            Spacer(1, 8),
            Paragraph("$47", ParagraphStyle(
                'QSPrice', parent=S['callout_body'], fontName='Helvetica-Bold',
                fontSize=22, textColor=TEAL, alignment=TA_CENTER)),
            Paragraph("One pattern. Full depth. Lifetime access.",
                      ParagraphStyle('QSSub', parent=S['callout_body'],
                                     alignment=TA_CENTER, textColor=TEXT_SECONDARY)),
        ]
        self.flow.append(BoxedContent(inner_qs, bg_color=BG_CALLOUT,
                                       border_color=TEAL, padding=14))
        self.flow.append(Spacer(1, 14))

        # Complete Archive
        inner_ca = [
            Paragraph("THE COMPLETE ARCHIVE", ParagraphStyle(
                'CAT', parent=S['callout_title'], fontSize=14, textColor=GOLD)),
            Spacer(1, 6),
            Paragraph("All nine patterns. Full depth. 685 pages.", S['callout_body']),
            Spacer(1, 4),
        ]
        features = [
            "All 9 patterns: full deep dive, not just overview",
            "Pattern combinations and interaction maps",
            "Advanced protocols for multiple overlapping patterns",
            "Context-specific guides: work, relationships, parenting, body",
            "Real-world field notes and case studies",
            "Complete resource library and professional referral guide",
            "Lifetime updates as the method evolves",
        ]
        for f in features:
            inner_ca.append(Paragraph(
                f"\u2022  {self._esc(f)}", S['callout_body']))
        inner_ca.append(Spacer(1, 8))
        inner_ca.append(Paragraph("$197", ParagraphStyle(
            'CAPrice', parent=S['callout_body'], fontName='Helvetica-Bold',
            fontSize=22, textColor=GOLD, alignment=TA_CENTER)))
        inner_ca.append(Paragraph("All nine patterns. One purchase. Lifetime access.",
                                   ParagraphStyle('CASub', parent=S['callout_body'],
                                                  alignment=TA_CENTER, textColor=TEXT_SECONDARY)))

        self.flow.append(BoxedContent(inner_ca, bg_color=HexColor("#242010"),
                                       border_color=GOLD, padding=14))
        self.flow.append(Spacer(1, 20))

        self.flow.append(Paragraph(
            "thearchivistmethod.com", S['cta_url']))

        self.flow.append(Spacer(1, 0.4 * inch))
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

    # ════════════════════════════════════════════════════════
    # BUILD
    # ════════════════════════════════════════════════════════

    def build(self):
        output_path = OUTPUT_DIR / "THE-ARCHIVIST-METHOD-CRASH-COURSE.pdf"
        OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

        print(f"\n{'='*60}")
        print(f"  CRASH COURSE GENERATOR")
        print(f"  Output: {output_path}")
        print(f"{'='*60}\n")

        print("  [1/10] Title page...")
        self._section_title_page()
        print("  [2/10] What This Is...")
        self._section_what_this_is()
        print("  [3/10] The 9 Patterns...")
        self._section_nine_patterns()
        print("  [4/10] Day 1: Identify Your Pattern...")
        self._section_day1()
        print("  [5/10] Day 2: Body Signature...")
        self._section_day2()
        print("  [6/10] Day 3: Find Your Triggers...")
        self._section_day3()
        print("  [7/10] Day 4: Circuit Break...")
        self._section_day4()
        print("  [8/10] Day 5: First Interrupt...")
        self._section_day5()
        print("  [9/10] Day 6: Refine...")
        self._section_day6()
        print("  [10/10] Day 7: Decide + What's Next...")
        self._section_day7()
        self._section_whats_next()

        print(f"\n  Rendering PDF ({len(self.flow)} flowables)...")

        doc = BaseDocTemplate(
            str(output_path), pagesize=letter,
            leftMargin=MARGIN_L, rightMargin=MARGIN_R,
            topMargin=MARGIN_T, bottomMargin=MARGIN_B,
            title="The Archivist Method - 7-Day Crash Course",
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
    builder = CrashCourseBuilder()
    path = builder.build()
    print(f"\n  Generated: {path}")


if __name__ == '__main__':
    main()
