#!/usr/bin/env python3
"""
THE ARCHIVIST METHOD - CRASH COURSE PDF GENERATOR
Generates a single universal 7-Day Crash Course PDF.
Matches Complete Archive / Field Guide aesthetic exactly.
Output: THE-ARCHIVIST-METHOD-CRASH-COURSE.pdf
Target: 20-30 pages
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


def create_styles():
    return {
        'main_title': ParagraphStyle(
            'MainTitle', fontSize=48, textColor=WHITE, alignment=TA_CENTER,
            fontName='Helvetica-Bold', leading=56
        ),
        'crash_course_title': ParagraphStyle(
            'CrashCourseTitle', fontSize=36, textColor=TEAL, alignment=TA_CENTER,
            fontName='Helvetica-Bold', leading=44
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
        'body': ParagraphStyle(
            'Body', fontSize=11, textColor=LIGHT_GRAY, fontName='Helvetica',
            alignment=TA_JUSTIFY, leading=18, spaceAfter=10
        ),
        'body_bold': ParagraphStyle(
            'BodyBold', fontSize=11, textColor=WHITE, fontName='Helvetica-Bold',
            alignment=TA_JUSTIFY, leading=18, spaceAfter=10
        ),
        'body_center': ParagraphStyle(
            'BodyCenter', fontSize=11, textColor=LIGHT_GRAY, fontName='Helvetica',
            alignment=TA_CENTER, leading=18, spaceAfter=10
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
        'pattern_name': ParagraphStyle(
            'PatternName', fontSize=13, textColor=TEAL, fontName='Helvetica-Bold',
            spaceBefore=14, spaceAfter=4, leading=18
        ),
        'pattern_body': ParagraphStyle(
            'PatternBody', fontSize=10.5, textColor=LIGHT_GRAY, fontName='Helvetica',
            leading=16, spaceAfter=2
        ),
        'pattern_cost': ParagraphStyle(
            'PatternCost', fontSize=10.5, textColor=WHITE, fontName='Helvetica-Bold',
            leading=16, spaceAfter=10, leftIndent=10
        ),
        'day_header': ParagraphStyle(
            'DayHeader', fontSize=28, textColor=WHITE, fontName='Helvetica-Bold',
            spaceBefore=0, spaceAfter=6, leading=34
        ),
        'day_sub': ParagraphStyle(
            'DaySub', fontSize=14, textColor=TEAL, fontName='Helvetica-Bold',
            spaceBefore=4, spaceAfter=10, leading=20
        ),
        'completion': ParagraphStyle(
            'Completion', fontSize=11, textColor=TEAL, fontName='Helvetica-Oblique',
            alignment=TA_CENTER, spaceBefore=20, spaceAfter=10, leading=18
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
    canvas_obj.drawString(MARGIN, 0.35 * inch, "THE ARCHIVIST METHOD\u2122")
    canvas_obj.setFillColor(TEAL)
    canvas_obj.drawString(MARGIN + 165, 0.35 * inch, "|")
    canvas_obj.setFillColor(MEDIUM_GRAY)
    canvas_obj.drawString(MARGIN + 175, 0.35 * inch, "CLASSIFIED")
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
    canvas_obj.drawCentredString(PAGE_WIDTH / 2, 0.35 * inch, "THE ARCHIVIST METHOD\u2122 | CLASSIFIED")
    canvas_obj.restoreState()


def build_title_page(elements, styles, logo_path):
    elements.append(Spacer(1, 60))
    if logo_path and os.path.exists(logo_path):
        elements.append(CircularLogo(logo_path, size=140))
    elements.append(Spacer(1, 40))
    elements.append(Paragraph("THE ARCHIVIST METHOD\u2122", styles['main_title']))
    elements.append(Spacer(1, 10))
    elements.append(Paragraph("7-DAY CRASH COURSE", styles['crash_course_title']))
    elements.append(Spacer(1, 40))
    elements.append(Paragraph(
        "You have a pattern destroying your life.",
        styles['subtitle']
    ))
    elements.append(Paragraph(
        "You know you have it. You watch yourself do it.",
        styles['subtitle']
    ))
    elements.append(Paragraph(
        "You do it anyway.",
        styles['subtitle']
    ))
    elements.append(Spacer(1, 20))
    elements.append(Paragraph(
        "This week, you identify it, feel it activate, and interrupt it once.",
        styles['body_center']
    ))
    elements.append(Spacer(1, 10))
    elements.append(Paragraph(
        "Seven days. One pattern. One successful interrupt.",
        styles['body_bold']
    ))
    elements.append(Spacer(1, 40))
    brand_text = 'PATTERN ARCHAEOLOGY, <font color="#EC4899">NOT</font> THERAPY'
    elements.append(Paragraph(brand_text, styles['brand']))
    elements.append(PageBreak())


def build_what_this_is(elements, styles):
    elements.append(Paragraph("WHAT THIS IS", styles['h1']))
    elements.append(TealRule())
    elements.append(Spacer(1, 14))

    elements.append(Paragraph("THE 90-DAY PROBLEM", styles['h2']))
    elements.append(Paragraph(
        "Every program wants 90 days. Journal for 90 days. Meditate for 90 days. Track your feelings for 90 days.",
        styles['body']
    ))
    elements.append(Paragraph(
        "You have a life. Maybe ADHD. Maybe depression. Maybe trauma. Maybe just chaos. 90 days feels impossible before you start.",
        styles['body']
    ))
    elements.append(Paragraph(
        'So you buy the program. You do Day 1. Maybe Day 2. Then it sits in your downloads folder for three years.',
        styles['body']
    ))
    elements.append(Paragraph(
        "You need to know if this works NOW. Not in 90 days.",
        styles['body_bold']
    ))
    elements.append(Spacer(1, 10))

    elements.append(Paragraph("WHAT WE'RE DOING THIS WEEK", styles['h2']))
    elements.append(Paragraph(
        "Fuck 90 days. Here's what happens this week:",
        styles['body']
    ))
    days_overview = [
        "Day 1: Identify which pattern is running your life",
        "Day 2: Learn what it feels like in your body before it runs",
        "Day 3: Find what triggers it",
        "Day 4: Learn how to interrupt it",
        "Day 5: Try to interrupt it once",
        "Day 6: Try again, better",
        "Day 7: Decide if you want to keep going",
    ]
    for d in days_overview:
        b = '<font color="#14B8A6"><b>&bull;</b></font>'
        elements.append(Paragraph(f'{b}  {d}', styles['bullet']))

    elements.append(Spacer(1, 10))
    elements.append(Paragraph(
        "One successful interrupt. That's your proof this works. Everything else is optional.",
        styles['body_bold']
    ))
    elements.append(PageBreak())

    elements.append(Paragraph("WHAT THIS IS NOT", styles['h2']))
    elements.append(TealRule())
    elements.append(Spacer(1, 14))
    elements.append(Paragraph(
        "This is not therapy. We're not processing your trauma. We're not exploring your inner child. We're not journaling about feelings.",
        styles['body']
    ))
    elements.append(Paragraph(
        'This is pattern interruption. Behavioral forensics. You have a program running. We\'re going to interrupt it mid-execution.',
        styles['body']
    ))
    elements.append(Spacer(1, 6))
    elements.append(Paragraph(
        '"Therapy explains why the house is on fire. This teaches you to stop lighting matches."',
        styles['quote']
    ))
    elements.append(Spacer(1, 14))

    elements.append(Paragraph("THE RULES", styles['h2']))
    rules = [
        ("RULE 1: PICK ONE PATTERN", "You probably have three or four patterns running. Ignore them. Pick one. Work on that. The others can wait."),
        ("RULE 2: DO NOT AIM FOR PERFECTION", "You're not mastering this pattern in 7 days. You're seeing if the method works for you. One successful interrupt = proof of concept."),
        ("RULE 3: TRACK JUST ENOUGH", "When the pattern activates, write down what happened. One sentence. Move on. This is data collection, not journaling."),
        ("RULE 4: FAILURE IS DATA", "You will try to interrupt the pattern and it will run anyway. That's not failure. That's information."),
    ]
    for title, desc in rules:
        elements.append(Paragraph(title, styles['h3']))
        elements.append(Paragraph(desc, styles['body']))

    elements.append(Spacer(1, 14))
    elements.append(Paragraph("THE ONLY WAY TO FAIL THIS WEEK", styles['h2']))
    elements.append(Paragraph("Quit before Day 7.", styles['body_bold']))
    elements.append(PageBreak())


def build_nine_patterns(elements, styles):
    elements.append(Paragraph("THE 9 PATTERNS", styles['h1']))
    elements.append(TealRule())
    elements.append(Spacer(1, 10))
    elements.append(Paragraph(
        "One of these is destroying your life. Read all nine. Notice which one made your stomach drop.",
        styles['body']
    ))
    elements.append(Spacer(1, 6))

    patterns = [
        ("1. THE DISAPPEARING PATTERN",
         "You meet someone. Three months in, they say I love you. Your chest gets tight. You ghost them by Tuesday.",
         "Relationships that never get past 90 days. Chronic loneliness. Serial almost-relationships."),
        ("2. THE APOLOGY LOOP",
         "Sorry to bother you. Sorry, quick question. Sorry for existing.",
         "Can't negotiate salary. Can't state boundaries. People walk over you because you trained them to."),
        ("3. THE TESTING PATTERN",
         "You pick fights at 11pm to see if they'll still be there at breakfast. You push them away to see if they'll fight to stay.",
         "Exhausted partners. Pushed away people who cared. Self-fulfilling abandonment prophecy."),
        ("4. ATTRACTION TO HARM",
         "The nice guy feels boring. The unavailable one feels like chemistry. Red flags feel like attraction, not warning.",
         "Serial toxic relationships. Can't stay attracted to healthy partners. The good ones feel wrong."),
        ("5. THE DRAINING BOND",
         "You know you should leave. Everyone tells you to leave. You stay.",
         "Years in toxic jobs or relationships. Chronic depletion. Watching your life pass while staying stuck."),
        ("6. COMPLIMENT DEFLECTION",
         'Someone says "nice work." You say "oh it was nothing." They stop complimenting you.',
         "Career stagnation. Underpaid despite talent. Invisible to people who could help you."),
        ("7. THE PERFECTIONISM PATTERN",
         "If it's not perfect, it's garbage. So you don't finish. Or you don't start.",
         "Pattern of almost-finished projects. Ideas that die in your head. Years spent polishing things no one sees."),
        ("8. SUCCESS SABOTAGE",
         "You're three weeks from launching. Everything's going well. Suddenly you stop working. Or pick a fight. Or miss the deadline.",
         "Pattern of almost-success then failure. Watching less talented people succeed because they can tolerate it."),
        ("9. THE RAGE PATTERN",
         "It comes out of nowhere. One second you're fine, the next you're saying things you can't take back.",
         "Damaged relationships. Trust that takes years to rebuild. A version of yourself you're ashamed of."),
    ]

    for name, desc, cost in patterns:
        elements.append(Paragraph(name, styles['pattern_name']))
        elements.append(Paragraph(desc, styles['pattern_body']))
        elements.append(Paragraph(f"What it costs you: {cost}", styles['pattern_cost']))

    elements.append(Spacer(1, 14))
    elements.append(TealRule())
    elements.append(Spacer(1, 10))
    elements.append(Paragraph(
        "Which one made your stomach drop?",
        styles['body_bold']
    ))
    elements.append(Paragraph(
        "That's your pattern.",
        styles['body_bold']
    ))
    elements.append(PageBreak())


def add_fill_line(elements, styles, label):
    elements.append(Paragraph(
        f'{label}: _______________________________________________',
        styles['fill_in']
    ))


def add_checkbox(elements, styles, label):
    elements.append(Paragraph(f'[ ]  {label}', styles['checkbox']))


def build_day1(elements, styles):
    elements.append(Paragraph("DAY 1", styles['day_header']))
    elements.append(Paragraph("IDENTIFY YOUR PATTERN", styles['day_sub']))
    elements.append(TealRule())
    elements.append(Spacer(1, 10))
    elements.append(Paragraph("Time: 20-30 minutes", styles['body']))
    elements.append(Spacer(1, 10))

    elements.append(Paragraph("YOUR TASK", styles['h2']))
    elements.append(Paragraph(
        "You read the 9 patterns. One of them hit different. That's the one you're working on this week.",
        styles['body']
    ))
    elements.append(Paragraph("Write it down:", styles['body']))
    add_fill_line(elements, styles, "MY PATTERN")
    add_fill_line(elements, styles, "HOW LONG HAVE I BEEN RUNNING IT")
    add_fill_line(elements, styles, "WHAT HAS IT COST ME")
    add_fill_line(elements, styles, "")
    add_fill_line(elements, styles, "")
    elements.append(Spacer(1, 14))

    elements.append(Paragraph("THE ORIGINAL ROOM", styles['h2']))
    elements.append(Paragraph(
        "Your pattern didn't come from nowhere. It installed in childhood. Not because something happened TO you\u2014because you learned to DO something to survive.",
        styles['body']
    ))
    elements.append(Paragraph(
        "The Original Room is not a literal room. It's the emotional environment where this pattern made sense.",
        styles['body']
    ))
    elements.append(Paragraph(
        "You don't need to process the Original Room right now. You don't need to decode it. You just need to know it exists so you understand why the pattern feels so automatic.",
        styles['body']
    ))
    elements.append(Paragraph(
        "The pattern was a survival strategy. It worked once. It doesn't anymore.",
        styles['body_bold']
    ))
    elements.append(Spacer(1, 14))
    elements.append(TealRule())
    elements.append(Paragraph("Day 1 complete.", styles['completion']))
    elements.append(Paragraph(
        "Tomorrow you learn to feel the pattern activate BEFORE it runs.",
        styles['completion']
    ))
    elements.append(PageBreak())


def build_day2(elements, styles):
    elements.append(Paragraph("DAY 2", styles['day_header']))
    elements.append(Paragraph("LEARN THE BODY SIGNATURE", styles['day_sub']))
    elements.append(TealRule())
    elements.append(Spacer(1, 10))
    elements.append(Paragraph("Time: All day awareness", styles['body']))
    elements.append(Spacer(1, 10))

    elements.append(Paragraph("THE 3-7 SECOND WINDOW", styles['h2']))
    elements.append(Paragraph(
        "Before your pattern runs, your body signals it. Every time.",
        styles['body']
    ))
    elements.append(Paragraph(
        "Chest tightness. Stomach drop. Throat closing. Heart racing. Jaw clenching. Heat in your face. Something.",
        styles['body']
    ))
    elements.append(Paragraph(
        "This is the body signature. It happens 3-7 seconds before the pattern executes.",
        styles['body_bold']
    ))
    elements.append(Paragraph(
        "Right now, you don't notice it. The trigger happens, the pattern runs, and you realize what happened afterward.",
        styles['body']
    ))
    elements.append(Paragraph("Today you learn to catch it in real time.", styles['body']))
    elements.append(Spacer(1, 10))

    elements.append(Paragraph("COMMON BODY SIGNATURES BY PATTERN", styles['h2']))
    sigs = [
        ("Disappearing:", "Chest tightness. Urge to flee. Walls closing in."),
        ("Apology Loop:", "Guilt. Throat tightening. Shrinking sensation."),
        ("Testing:", "Panic. Heart racing. Scanning for signs they'll leave."),
        ("Attraction to Harm:", 'Excitement. "Chemistry." Pull toward danger.'),
        ("Draining Bond:", "Heavy guilt. Obligation. Trapped feeling."),
        ("Compliment Deflection:", "Squirming. Heat. Want to disappear."),
        ("Perfectionism:", "Paralysis. Dread. Gap between vision and reality."),
        ("Success Sabotage:", 'Panic. "Something bad is coming." Urge to stop.'),
        ("Rage:", "Heat rising. Jaw tight. Pressure building."),
    ]
    for name, desc in sigs:
        elements.append(Paragraph(
            f'<font color="#14B8A6"><b>{name}</b></font> {desc}',
            styles['bullet']
        ))
    elements.append(Spacer(1, 10))

    elements.append(Paragraph("TODAY'S TASK", styles['h2']))
    elements.append(Paragraph(
        "When your pattern activates today\u2014and it will\u2014don't try to stop it. Just notice.",
        styles['body']
    ))
    elements.append(Paragraph(
        "What did your body feel BEFORE you executed the pattern?",
        styles['body_bold']
    ))
    elements.append(Spacer(1, 6))

    for i in range(1, 4):
        elements.append(Paragraph(f"Activation {i}:", styles['h3']))
        add_fill_line(elements, styles, "Time")
        add_fill_line(elements, styles, "What happened")
        add_fill_line(elements, styles, "Body sensation")
        elements.append(Spacer(1, 6))

    elements.append(Spacer(1, 6))
    elements.append(Paragraph(
        "You're not interrupting the pattern yet. You're just seeing it.",
        styles['body_bold']
    ))
    elements.append(TealRule())
    elements.append(Paragraph("Day 2 complete.", styles['completion']))
    elements.append(Paragraph("Tomorrow you identify what triggers it.", styles['completion']))
    elements.append(PageBreak())


def build_day3(elements, styles):
    elements.append(Paragraph("DAY 3", styles['day_header']))
    elements.append(Paragraph("FIND YOUR TRIGGERS", styles['day_sub']))
    elements.append(TealRule())
    elements.append(Spacer(1, 10))
    elements.append(Paragraph("Time: 15 minutes + all day awareness", styles['body']))
    elements.append(Spacer(1, 10))

    elements.append(Paragraph("WHAT IS A TRIGGER", styles['h2']))
    elements.append(Paragraph(
        "The situation that happens RIGHT BEFORE your pattern activates.",
        styles['body']
    ))
    elements.append(Paragraph(
        "Your pattern doesn't run randomly. It runs in response to specific triggers.",
        styles['body']
    ))
    elements.append(Paragraph(
        "Know your triggers and you can see the pattern coming before it runs.",
        styles['body_bold']
    ))
    elements.append(Spacer(1, 10))

    elements.append(Paragraph("COMMON TRIGGERS BY PATTERN", styles['h2']))
    triggers = [
        ("Disappearing:", '"I love you." Future plans. Relationship milestones.'),
        ("Apology Loop:", "Needing to ask for help. Wanting something. Boundaries."),
        ("Testing:", "Slow text response. Partner seems distant. Things going well."),
        ("Attraction to Harm:", "Meeting someone with red flags. Safe person interest."),
        ("Draining Bond:", 'Thinking about leaving. Someone saying "you deserve better."'),
        ("Compliment Deflection:", "Being praised. Visibility. Someone noticing you."),
        ("Perfectionism:", "Deadline approaching. About to share work. Feedback."),
        ("Success Sabotage:", "Approaching milestone. Things going well too long."),
        ("Rage:", "Feeling dismissed. Being contradicted. Losing control."),
    ]
    for name, desc in triggers:
        elements.append(Paragraph(
            f'<font color="#14B8A6"><b>{name}</b></font> {desc}',
            styles['bullet']
        ))
    elements.append(Spacer(1, 10))

    elements.append(Paragraph("TODAY'S TASK", styles['h2']))
    elements.append(Paragraph(
        "Track what triggers your pattern today. Not what the pattern does\u2014what happens RIGHT BEFORE.",
        styles['body']
    ))
    for i in range(1, 4):
        add_fill_line(elements, styles, f"TRIGGER {i}")
    elements.append(Spacer(1, 14))

    elements.append(Paragraph("END OF DAY: YOUR TOP 3 TRIGGERS", styles['h2']))
    elements.append(Paragraph("These are the situations where you need to be ready:", styles['body']))
    for i in range(1, 4):
        add_fill_line(elements, styles, f"{i}")
    elements.append(Spacer(1, 10))
    elements.append(TealRule())
    elements.append(Paragraph("Day 3 complete.", styles['completion']))
    elements.append(Paragraph("Tomorrow you learn how to interrupt it.", styles['completion']))
    elements.append(PageBreak())


def build_day4(elements, styles):
    elements.append(Paragraph("DAY 4", styles['day_header']))
    elements.append(Paragraph("LEARN YOUR CIRCUIT BREAK", styles['day_sub']))
    elements.append(TealRule())
    elements.append(Spacer(1, 10))
    elements.append(Paragraph("Time: 15 minutes to memorize", styles['body']))
    elements.append(Spacer(1, 10))

    elements.append(Paragraph("WHAT IS A CIRCUIT BREAK", styles['h2']))
    elements.append(Paragraph(
        "A pre-written script you say when the pattern activates. Out loud or in your head. It interrupts the automatic sequence.",
        styles['body']
    ))
    elements.append(Spacer(1, 6))
    elements.append(Paragraph("Right now:", styles['body_bold']))
    elements.append(Paragraph(
        "Trigger \u2192 Body signature \u2192 Pattern runs (3-7 seconds, automatic)",
        styles['body']
    ))
    elements.append(Paragraph("With circuit break:", styles['body_bold']))
    elements.append(Paragraph(
        "Trigger \u2192 Body signature \u2192 CIRCUIT BREAK \u2192 Choose different behavior",
        styles['body']
    ))
    elements.append(Paragraph(
        "The circuit break creates a gap. In that gap, you can choose.",
        styles['body_bold']
    ))
    elements.append(Spacer(1, 10))

    elements.append(Paragraph("YOUR CIRCUIT BREAK SCRIPT", styles['h2']))
    elements.append(Paragraph(
        "Find your pattern. Memorize this script. Say it when the body signature hits.",
        styles['body']
    ))
    elements.append(Spacer(1, 6))

    scripts = [
        ("DISAPPEARING:",
         '"The Disappearing Pattern just activated. I feel the walls closing in. The program wants me to pull away. I\'m choosing to stay and communicate instead."'),
        ("APOLOGY LOOP:",
         '"I\'m about to apologize for asking. I\'ve done nothing wrong. I\'m replacing \'sorry\' with what I actually need to say."'),
        ("TESTING:",
         '"The Testing Pattern activated. I want to create a test. I\'m not doing that. I\'m asking directly instead."'),
        ("ATTRACTION TO HARM:",
         '"I feel chemistry with this person. Let me check: are they safe or familiar? This might be pattern recognition, not love."'),
        ("DRAINING BOND:",
         '"I know I should leave. The guilt is the pattern talking. Leaving is self-preservation, not betrayal."'),
        ("COMPLIMENT DEFLECTION:",
         '"Someone just acknowledged me. I want to deflect. I\'m saying only: thank you. No deflection. No minimizing."'),
        ("PERFECTIONISM:",
         '"Perfectionism is telling me it\'s not ready. Done is better than perfect. I\'m shipping it."'),
        ("SUCCESS SABOTAGE:",
         '"I\'m close to succeeding. Success Sabotage is activating. This is the pattern, not reality. I\'m allowed to win."'),
        ("RAGE:",
         '"I feel the anger rising. This is the Rage Pattern. I\'m not saying anything for 10 seconds. Breathe."'),
    ]
    for name, script in scripts:
        elements.append(Paragraph(
            f'<font color="#14B8A6"><b>{name}</b></font>',
            styles['bullet']
        ))
        elements.append(Paragraph(script, styles['quote']))

    elements.append(Spacer(1, 10))
    elements.append(Paragraph("TODAY'S TASK", styles['h2']))
    b = '<font color="#14B8A6"><b>&bull;</b></font>'
    elements.append(Paragraph(f"{b}  Write your circuit break on paper or in your phone", styles['bullet']))
    elements.append(Paragraph(f"{b}  Say it out loud 5 times", styles['bullet']))
    elements.append(Paragraph(f"{b}  Imagine your most recent trigger and practice saying it", styles['bullet']))
    elements.append(Spacer(1, 6))
    elements.append(Paragraph("Tomorrow you use it for real.", styles['body_bold']))
    elements.append(TealRule())
    elements.append(Paragraph("Day 4 complete.", styles['completion']))
    elements.append(PageBreak())


def build_day5(elements, styles):
    elements.append(Paragraph("DAY 5", styles['day_header']))
    elements.append(Paragraph("FIRST INTERRUPT ATTEMPT", styles['day_sub']))
    elements.append(TealRule())
    elements.append(Spacer(1, 10))
    elements.append(Paragraph("Success = attempting the circuit break", styles['body_bold']))
    elements.append(Spacer(1, 10))

    elements.append(Paragraph("WHAT TO EXPECT", styles['h2']))
    elements.append(Paragraph("Today your pattern will activate. When it does:", styles['body']))
    b = '<font color="#14B8A6"><b>&bull;</b></font>'
    elements.append(Paragraph(f"{b}  Step 1: Feel the body signature", styles['bullet']))
    elements.append(Paragraph(f"{b}  Step 2: Say your circuit break", styles['bullet']))
    elements.append(Paragraph(f"{b}  Step 3: Attempt different behavior", styles['bullet']))
    elements.append(Spacer(1, 10))

    elements.append(Paragraph("LIKELY OUTCOMES", styles['h2']))
    outcomes = [
        ("70% chance \u2014 AUTO:", "Pattern runs anyway. You feel it, you say the circuit break, the pattern executes anyway. This is normal. This is data. You TRIED."),
        ("20% chance \u2014 PAUSE:", "You pause before the pattern runs. Maybe 2 seconds. Maybe 10. Then it runs anyway. This is progress. You created a GAP."),
        ("10% chance \u2014 REWRITE:", "You successfully interrupt. Rare on Day 5. If it happens, you're ahead of schedule."),
    ]
    for label, desc in outcomes:
        elements.append(Paragraph(
            f'<font color="#14B8A6"><b>{label}</b></font> {desc}',
            styles['bullet']
        ))
    elements.append(Spacer(1, 10))

    elements.append(Paragraph("TODAY'S TRACKING", styles['h2']))
    for i in range(1, 3):
        elements.append(Paragraph(f"Attempt {i}:", styles['h3']))
        add_fill_line(elements, styles, "Time")
        add_fill_line(elements, styles, "Trigger")
        add_checkbox(elements, styles, "Body signature felt?   Yes / No")
        add_checkbox(elements, styles, "Circuit break said?   Yes / No")
        add_checkbox(elements, styles, "Outcome:   AUTO / PAUSE / REWRITE")
        elements.append(Spacer(1, 6))

    elements.append(Spacer(1, 10))
    elements.append(Paragraph("AUTO is not failure. It's data. Write it down.", styles['body_bold']))
    elements.append(TealRule())
    elements.append(Paragraph("Day 5 complete.", styles['completion']))
    elements.append(Paragraph("Tomorrow we use today's data to do better.", styles['completion']))
    elements.append(PageBreak())


def build_day6(elements, styles):
    elements.append(Paragraph("DAY 6", styles['day_header']))
    elements.append(Paragraph("REFINE AND RETRY", styles['day_sub']))
    elements.append(TealRule())
    elements.append(Spacer(1, 10))
    elements.append(Paragraph("Use yesterday's data", styles['body']))
    elements.append(Spacer(1, 10))

    elements.append(Paragraph("WHAT WENT WRONG YESTERDAY", styles['h2']))
    elements.append(Paragraph("Check what made interruption difficult:", styles['body']))
    add_checkbox(elements, styles, "Pattern ran too fast\u2014didn't catch body signature in time")
    add_checkbox(elements, styles, "Forgot circuit break in the moment")
    add_checkbox(elements, styles, "Body sensation was too intense to think")
    add_checkbox(elements, styles, "Didn't recognize the trigger until after")
    elements.append(Spacer(1, 10))

    elements.append(Paragraph("ADJUSTMENTS", styles['h2']))
    adjustments = [
        ("If pattern ran too fast:", "Pre-load the circuit break. Say it when you wake up. Say it before entering triggering situations. Keep it loaded."),
        ("If you forgot the circuit break:", 'Set phone alarm every 2 hours with the reminder: "What\'s my circuit break?" Keep it front of mind.'),
        ("If body sensation was too intense:", "Add 3 deep breaths before the circuit break. Breath \u2192 Circuit break \u2192 Choose."),
        ("If you missed the trigger:", "Watch specifically for your top 3 triggers today. You know what they are now."),
    ]
    for label, desc in adjustments:
        elements.append(Paragraph(
            f'<font color="#14B8A6"><b>{label}</b></font> {desc}',
            styles['bullet']
        ))
    elements.append(Spacer(1, 10))

    elements.append(Paragraph("TODAY'S TRACKING", styles['h2']))
    for i in range(1, 4):
        elements.append(Paragraph(
            f"Attempt {i}: Trigger: _________________ Outcome: [ ] AUTO  [ ] PAUSE  [ ] REWRITE",
            styles['fill_in']
        ))
    elements.append(Spacer(1, 14))

    elements.append(Paragraph("END OF DAY 6", styles['h2']))
    elements.append(Paragraph("Did you successfully interrupt at least once?", styles['body']))
    add_checkbox(elements, styles, "Yes \u2014 You have proof this works")
    add_checkbox(elements, styles, "No, but I paused \u2014 Progress. You're slowing it down.")
    add_checkbox(elements, styles, "No, still runs automatically \u2014 Some patterns need more time.")

    elements.append(TealRule())
    elements.append(Paragraph("Day 6 complete.", styles['completion']))
    elements.append(Paragraph("Tomorrow you decide what's next.", styles['completion']))
    elements.append(PageBreak())


def build_day7(elements, styles):
    elements.append(Paragraph("DAY 7", styles['day_header']))
    elements.append(Paragraph("DECIDE YOUR NEXT STEP", styles['day_sub']))
    elements.append(TealRule())
    elements.append(Spacer(1, 10))
    elements.append(Paragraph("Time: 15 minutes", styles['body']))
    elements.append(Spacer(1, 10))

    elements.append(Paragraph("YOUR WEEK IN REVIEW", styles['h2']))
    add_fill_line(elements, styles, "Pattern identified")
    add_fill_line(elements, styles, "Body signature")
    add_fill_line(elements, styles, "Top triggers")
    elements.append(Paragraph(
        "Best outcome achieved: [ ] AUTO  [ ] PAUSE  [ ] REWRITE",
        styles['fill_in']
    ))
    elements.append(Spacer(1, 10))

    elements.append(Paragraph("WHAT YOUR RESULTS MEAN", styles['h2']))

    elements.append(Paragraph("IF YOU ACHIEVED REWRITE (even once):", styles['h3']))
    elements.append(Paragraph(
        "The method works for you. You interrupted a pattern that's been running for years. That's not luck. That's proof.",
        styles['body']
    ))
    elements.append(Paragraph(
        "Next step: The Field Guide has your full 90-day protocol.",
        styles['body_bold']
    ))

    elements.append(Paragraph("IF YOU ACHIEVED PAUSE:", styles['h3']))
    elements.append(Paragraph(
        "You're slowing the pattern down. That gap you created will get longer with practice.",
        styles['body']
    ))
    elements.append(Paragraph(
        "Next step: Keep going. You need more reps, not a different method.",
        styles['body_bold']
    ))

    elements.append(Paragraph("IF PATTERN STILL RUNS ON AUTO:", styles['h3']))
    elements.append(Paragraph("Several possibilities:", styles['body']))
    b = '<font color="#14B8A6"><b>&bull;</b></font>'
    elements.append(Paragraph(f"{b}  Wrong pattern \u2014 try a different one", styles['bullet']))
    elements.append(Paragraph(f"{b}  Need more time \u2014 some patterns need 30+ days to start breaking", styles['bullet']))
    elements.append(Paragraph(f"{b}  This method isn't for you \u2014 that's valid data too", styles['bullet']))
    elements.append(Spacer(1, 14))

    elements.append(Paragraph("YOUR DECISION", styles['h2']))
    add_checkbox(elements, styles, "Get The Field Guide \u2014 full 90-day protocol for my pattern")
    add_checkbox(elements, styles, "Get The Complete Archive \u2014 all 9 patterns, full system")
    add_checkbox(elements, styles, "Keep practicing with what I have")
    add_checkbox(elements, styles, "Try a different pattern")
    add_checkbox(elements, styles, "Stop here")

    elements.append(Spacer(1, 14))
    elements.append(TealRule())
    elements.append(Spacer(1, 10))
    elements.append(Paragraph(
        "Whatever you choose, you did something most people never do.",
        styles['body']
    ))
    elements.append(Paragraph(
        "You looked at the pattern. You named it. You tried to interrupt it.",
        styles['body']
    ))
    elements.append(Paragraph(
        "That's not nothing. That's the first step.",
        styles['body_bold']
    ))
    elements.append(Paragraph(
        "The pattern doesn't own you anymore. You see it now.",
        styles['body_bold']
    ))
    elements.append(Spacer(1, 6))
    elements.append(Paragraph(
        "You found the thread. Now pull it.",
        styles['body_bold']
    ))
    elements.append(PageBreak())


def build_whats_next(elements, styles):
    elements.append(Paragraph("WHAT'S NEXT", styles['h1']))
    elements.append(TealRule())
    elements.append(Spacer(1, 10))
    elements.append(Paragraph(
        "You proved the method works. Now what?",
        styles['body']
    ))
    elements.append(Spacer(1, 14))

    elements.append(Paragraph("THE FIELD GUIDE \u2014 $47", styles['h2']))
    elements.append(Paragraph("Your pattern. Full depth. 90 days.", styles['body_bold']))
    b = '<font color="#14B8A6"><b>&bull;</b></font>'
    fg_features = [
        "Complete deep dive on YOUR specific pattern",
        "The 90-day protocol to make interruption permanent",
        "Circuit break scripts for every situation",
        "Crisis protocols for when the pattern runs anyway",
        "All 9 patterns overview (so you see the full picture)",
        "Unlimited access to The Archivist AI",
    ]
    for f in fg_features:
        elements.append(Paragraph(f"{b}  {f}", styles['bullet']))
    elements.append(Spacer(1, 6))
    elements.append(Paragraph("You proved it works. The Field Guide makes it stick.", styles['body_bold']))
    elements.append(Spacer(1, 20))

    elements.append(Paragraph("THE COMPLETE ARCHIVE \u2014 $197", styles['h2']))
    elements.append(Paragraph("Everything. All 9 patterns. For life.", styles['body_bold']))
    ca_features = [
        "Full mastery of all 9 patterns",
        "Pattern combinations (when you run more than one)",
        "Relationship protocols",
        "Workplace applications",
        "Parenting contexts",
        "Advanced interruption techniques",
        "Priority Archivist AI access",
        "Lifetime updates",
    ]
    for f in ca_features:
        elements.append(Paragraph(f"{b}  {f}", styles['bullet']))
    elements.append(Spacer(1, 6))
    elements.append(Paragraph("You found the thread. This is the whole tapestry.", styles['body_bold']))

    elements.append(Spacer(1, 30))
    elements.append(TealRule())
    elements.append(Spacer(1, 10))
    elements.append(Paragraph("thearchivistmethod.com", styles['body_center']))
    elements.append(Spacer(1, 20))
    elements.append(TealRule())
    elements.append(Spacer(1, 14))
    elements.append(Paragraph("THE ARCHIVIST METHOD\u2122", styles['brand']))
    elements.append(Spacer(1, 6))
    brand_text = 'Pattern Archaeology, <font color="#EC4899">NOT</font> Therapy'
    elements.append(Paragraph(brand_text, styles['brand']))
    elements.append(Spacer(1, 20))
    elements.append(Paragraph(
        "You have a pattern destroying your life.",
        styles['subtitle']
    ))
    elements.append(Paragraph(
        "Now you know how to interrupt it.",
        styles['subtitle']
    ))
    elements.append(Spacer(1, 30))
    elements.append(TealRule())
    elements.append(Spacer(1, 10))
    elements.append(Paragraph(
        "THE ARCHIVIST METHOD | END OF CRASH COURSE",
        styles['body_center']
    ))


def generate_crash_course():
    output_dir = os.path.dirname(os.path.abspath(__file__))
    output_dir = os.path.join(os.path.dirname(output_dir))
    downloads_dir = os.path.join(output_dir, "public", "downloads")
    os.makedirs(downloads_dir, exist_ok=True)
    output_file = os.path.join(downloads_dir, "THE-ARCHIVIST-METHOD-CRASH-COURSE.pdf")

    logo_candidates = [
        os.path.join(output_dir, "attached_assets", "archivist-logo-pdf-composited.png"),
        os.path.join(output_dir, "attached_assets", "archivist-logo-pdf.png"),
        os.path.join(output_dir, "attached_assets", "archivist-portrait-circle.jpg"),
        os.path.join(output_dir, "attached_assets", "archivist-portrait.png"),
        os.path.join(output_dir, "public", "archivist-portrait.png"),
    ]
    logo_path = None
    for candidate in logo_candidates:
        if os.path.exists(candidate):
            logo_path = candidate
            break

    print(f"Generating Crash Course PDF...")
    if logo_path:
        print(f"  Logo: {logo_path}")
    else:
        print(f"  Logo: not found (will use teal ring only)")

    styles = create_styles()

    doc = SimpleDocTemplate(
        output_file,
        pagesize=letter,
        leftMargin=MARGIN,
        rightMargin=MARGIN,
        topMargin=MARGIN,
        bottomMargin=0.8 * inch,
    )

    elements = []

    build_title_page(elements, styles, logo_path)
    build_what_this_is(elements, styles)
    build_nine_patterns(elements, styles)
    build_day1(elements, styles)
    build_day2(elements, styles)
    build_day3(elements, styles)
    build_day4(elements, styles)
    build_day5(elements, styles)
    build_day6(elements, styles)
    build_day7(elements, styles)
    build_whats_next(elements, styles)

    doc.build(elements, onFirstPage=draw_title_page, onLaterPages=draw_dark_background)

    size_mb = os.path.getsize(output_file) / (1024 * 1024)
    page_count = 0
    with open(output_file, 'rb') as f:
        content = f.read()
        page_count = content.count(b'/Type /Page') - content.count(b'/Type /Pages')

    print(f"\n  Output: {output_file}")
    print(f"  Pages: ~{page_count}")
    print(f"  Size: {size_mb:.2f} MB")

    return output_file


if __name__ == "__main__":
    print("=" * 60)
    print("THE ARCHIVIST METHOD - CRASH COURSE PDF GENERATOR")
    print("=" * 60)
    generate_crash_course()
    print("\nDone!")
