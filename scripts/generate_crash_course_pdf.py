#!/usr/bin/env python3
"""
The Archivist Method™ 7-Day Crash Course PDF Generator
Branded with dark gothic/industrial aesthetic
"""

from reportlab.lib.pagesizes import letter
from reportlab.lib.colors import HexColor
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.pdfgen import canvas
from reportlab.lib.units import inch
from PIL import Image
import os

DARK_BG = HexColor('#1a1a1a')
CHARCOAL = HexColor('#2a2a2a')
TEAL = HexColor('#14B8A6')
PINK = HexColor('#EC4899')
WHITE = HexColor('#FFFFFF')
LIGHT_GRAY = HexColor('#E5E5E5')
MED_GRAY = HexColor('#9CA3AF')
DARK_GRAY = HexColor('#4B5563')

OUTPUT_PATH = "/home/runner/workspace/generated_pdfs/THE-ARCHIVIST-METHOD-7-DAY-CRASH-COURSE.pdf"


class ArchivistPDFTemplate:
    """Custom page template with dark background and footer"""
    
    def __init__(self, doc):
        self.doc = doc
        self.page_num = 0
        
    def draw_page(self, canvas, doc):
        self.page_num += 1
        width, height = letter
        
        canvas.setFillColor(DARK_BG)
        canvas.rect(0, 0, width, height, fill=1, stroke=0)
        
        if self.page_num > 1:
            canvas.setFillColor(MED_GRAY)
            canvas.setFont("Helvetica-Bold", 8)
            footer_text = f"THE ARCHIVIST METHOD | CLASSIFIED {self.page_num}"
            canvas.drawCentredString(width / 2, 30, footer_text)
            
            grad_y = 45
            canvas.setStrokeColor(TEAL)
            canvas.setLineWidth(0.5)
            canvas.line(72, grad_y, width/2, grad_y)
            canvas.setStrokeColor(PINK)
            canvas.line(width/2, grad_y, width - 72, grad_y)


def create_styles():
    """Create custom paragraph styles matching the gothic aesthetic"""
    styles = getSampleStyleSheet()
    
    styles.add(ParagraphStyle(
        name='TitleMain',
        fontName='Helvetica-Bold',
        fontSize=28,
        textColor=WHITE,
        alignment=TA_CENTER,
        spaceAfter=12,
        leading=34
    ))
    
    styles.add(ParagraphStyle(
        name='Tagline',
        fontName='Helvetica',
        fontSize=11,
        textColor=TEAL,
        alignment=TA_CENTER,
        spaceAfter=6,
        leading=16
    ))
    
    styles.add(ParagraphStyle(
        name='SubTagline',
        fontName='Helvetica-Oblique',
        fontSize=10,
        textColor=LIGHT_GRAY,
        alignment=TA_CENTER,
        spaceAfter=24,
        leading=14
    ))
    
    styles.add(ParagraphStyle(
        name='DayHeader',
        fontName='Helvetica-Bold',
        fontSize=22,
        textColor=TEAL,
        alignment=TA_LEFT,
        spaceBefore=12,
        spaceAfter=6,
        leading=28
    ))
    
    styles.add(ParagraphStyle(
        name='DaySubHeader',
        fontName='Helvetica',
        fontSize=11,
        textColor=MED_GRAY,
        alignment=TA_LEFT,
        spaceAfter=18,
        leading=14
    ))
    
    styles.add(ParagraphStyle(
        name='SectionHeader',
        fontName='Helvetica-Bold',
        fontSize=14,
        textColor=WHITE,
        alignment=TA_LEFT,
        spaceBefore=18,
        spaceAfter=8,
        leading=18
    ))
    
    styles.add(ParagraphStyle(
        name='PatternHeader',
        fontName='Helvetica-Bold',
        fontSize=12,
        textColor=PINK,
        alignment=TA_LEFT,
        spaceBefore=14,
        spaceAfter=4,
        leading=16
    ))
    
    styles['BodyText'].fontName = 'Helvetica'
    styles['BodyText'].fontSize = 10
    styles['BodyText'].textColor = LIGHT_GRAY
    styles['BodyText'].alignment = TA_LEFT
    styles['BodyText'].spaceAfter = 8
    styles['BodyText'].leading = 14
    
    styles.add(ParagraphStyle(
        name='BodyItalic',
        fontName='Helvetica-Oblique',
        fontSize=10,
        textColor=LIGHT_GRAY,
        alignment=TA_LEFT,
        spaceAfter=8,
        leading=14
    ))
    
    styles.add(ParagraphStyle(
        name='BulletItem',
        fontName='Helvetica',
        fontSize=10,
        textColor=LIGHT_GRAY,
        alignment=TA_LEFT,
        leftIndent=20,
        spaceAfter=4,
        leading=14
    ))
    
    styles.add(ParagraphStyle(
        name='FormField',
        fontName='Helvetica',
        fontSize=10,
        textColor=MED_GRAY,
        alignment=TA_LEFT,
        spaceBefore=10,
        spaceAfter=4,
        leading=14
    ))
    
    styles.add(ParagraphStyle(
        name='Classified',
        fontName='Helvetica-Bold',
        fontSize=10,
        textColor=MED_GRAY,
        alignment=TA_CENTER,
        spaceAfter=20
    ))
    
    styles.add(ParagraphStyle(
        name='RuleText',
        fontName='Helvetica-Bold',
        fontSize=11,
        textColor=TEAL,
        alignment=TA_LEFT,
        spaceBefore=12,
        spaceAfter=4,
        leading=14
    ))
    
    styles.add(ParagraphStyle(
        name='QuoteText',
        fontName='Helvetica-Oblique',
        fontSize=11,
        textColor=LIGHT_GRAY,
        alignment=TA_CENTER,
        leftIndent=30,
        rightIndent=30,
        spaceBefore=8,
        spaceAfter=8,
        leading=16
    ))
    
    return styles


def build_title_page(styles):
    """Create the title page elements"""
    elements = []
    
    elements.append(Spacer(1, 1.5*inch))
    elements.append(Paragraph("THE ARCHIVIST METHOD™", styles['TitleMain']))
    elements.append(Paragraph("7-DAY CRASH COURSE", styles['TitleMain']))
    elements.append(Spacer(1, 0.5*inch))
    
    elements.append(Paragraph("You have a pattern destroying your life.", styles['QuoteText']))
    elements.append(Paragraph("You know you have it. You watch yourself do it.", styles['QuoteText']))
    elements.append(Paragraph("You do it anyway.", styles['QuoteText']))
    elements.append(Spacer(1, 0.4*inch))
    
    elements.append(Paragraph("This week, you identify it, feel it activate, and interrupt it once.", styles['BodyItalic']))
    elements.append(Paragraph("Seven days. One pattern. One successful interrupt.", styles['BodyItalic']))
    elements.append(Spacer(1, 0.6*inch))
    
    elements.append(Paragraph("PATTERN ARCHAEOLOGY, NOT THERAPY", styles['Tagline']))
    elements.append(Spacer(1, 1*inch))
    
    elements.append(Paragraph("THE ARCHIVIST METHOD | CLASSIFIED", styles['Classified']))
    elements.append(PageBreak())
    
    return elements


def build_what_this_is(styles):
    """Build the 'What This Is' section"""
    elements = []
    
    elements.append(Paragraph("WHAT THIS IS", styles['SectionHeader']))
    elements.append(Spacer(1, 0.2*inch))
    
    elements.append(Paragraph("THE 90-DAY PROBLEM", styles['PatternHeader']))
    elements.append(Paragraph(
        "Every program wants 90 days. Journal for 90 days. Meditate for 90 days. Track your feelings for 90 days.",
        styles['BodyText']
    ))
    elements.append(Paragraph(
        "You have ADHD. Or depression. Or trauma. Or just a life. 90 days feels impossible before you start.",
        styles['BodyText']
    ))
    elements.append(Paragraph(
        "So you buy the program. You do Day 1. Maybe Day 2. Then it sits in your downloads folder for three years.",
        styles['BodyText']
    ))
    elements.append(Paragraph(
        "You need to know if this works NOW. Not in 90 days.",
        styles['BodyText']
    ))
    elements.append(Spacer(1, 0.2*inch))
    
    elements.append(Paragraph("WHAT WE ARE DOING THIS WEEK", styles['PatternHeader']))
    elements.append(Paragraph("Fuck 90 days. Here is what happens this week:", styles['BodyText']))
    
    days = [
        "Day 1: Identify which pattern is running your life",
        "Day 2: Learn what it feels like in your body before it runs",
        "Day 3: Find what triggers it",
        "Day 4: Learn how to interrupt it",
        "Day 5: Try to interrupt it once",
        "Day 6: Try again, better",
        "Day 7: Decide if you want to keep going"
    ]
    for day in days:
        elements.append(Paragraph(f"• {day}", styles['BulletItem']))
    
    elements.append(Spacer(1, 0.1*inch))
    elements.append(Paragraph(
        "One successful interrupt. That is your proof this works. Everything else is optional.",
        styles['BodyItalic']
    ))
    elements.append(Spacer(1, 0.2*inch))
    
    elements.append(Paragraph("WHAT THIS IS NOT", styles['PatternHeader']))
    elements.append(Paragraph(
        "This is not therapy. We are not processing your trauma. We are not exploring your inner child. We are not journaling about feelings.",
        styles['BodyText']
    ))
    elements.append(Paragraph(
        "This is pattern interruption. Behavioral forensics. You have a program running. We are going to interrupt it mid-execution.",
        styles['BodyText']
    ))
    elements.append(Paragraph(
        "Therapy explains why the house is on fire. This teaches you how to stop lighting matches.",
        styles['BodyItalic']
    ))
    elements.append(PageBreak())
    
    return elements


def build_rules(styles):
    """Build the Rules section"""
    elements = []
    
    elements.append(Paragraph("RULES FOR THIS WEEK", styles['SectionHeader']))
    elements.append(Spacer(1, 0.2*inch))
    
    rules = [
        ("RULE 1: PICK ONE PATTERN", 
         "You probably have three or four patterns running. Ignore them. Pick one. Work on that. The others can wait.",
         "Trying to fix everything at once is how you fix nothing."),
        ("RULE 2: DO NOT AIM FOR PERFECTION",
         "You are not mastering this pattern in 7 days. You are seeing if the method works for you. That is it.",
         "One successful interrupt = proof of concept. Everything beyond that is bonus."),
        ("RULE 3: TRACK JUST ENOUGH",
         "When the pattern activates, write down what happened. One sentence. Move on.",
         "This is not journaling. This is data collection. Note it and keep living."),
        ("RULE 4: FAILURE IS DATA",
         "You will try to interrupt the pattern and it will run anyway. That is not failure. That is information.",
         "Write down what happened. What triggered it. How fast it ran. That data makes Day 6 better than Day 5.")
    ]
    
    for rule_title, rule_body, rule_note in rules:
        elements.append(Paragraph(rule_title, styles['RuleText']))
        elements.append(Paragraph(rule_body, styles['BodyText']))
        elements.append(Paragraph(rule_note, styles['BodyItalic']))
    
    elements.append(Spacer(1, 0.3*inch))
    elements.append(Paragraph("THE ONLY WAY TO FAIL THIS WEEK", styles['PatternHeader']))
    elements.append(Paragraph("Quit before Day 7.", styles['BodyText']))
    elements.append(Paragraph(
        "The pattern running on Day 5 is not failure. The pattern running on Day 6 is not failure. Closing this PDF on Day 3 and never opening it again is failure.",
        styles['BodyText']
    ))
    elements.append(Paragraph("Seven days. That is all.", styles['BodyItalic']))
    elements.append(PageBreak())
    
    return elements


def build_day1(styles):
    """Build Day 1 content"""
    elements = []
    
    elements.append(Paragraph("DAY 1", styles['DayHeader']))
    elements.append(Paragraph("IDENTIFY YOUR PATTERN | Time: 20-30 minutes", styles['DaySubHeader']))
    
    elements.append(Paragraph("THE 7 PATTERNS", styles['SectionHeader']))
    elements.append(Paragraph(
        "One of these is destroying your life. Read all seven. Pick the one that made your stomach drop.",
        styles['BodyText']
    ))
    
    patterns = [
        ("1. THE DISAPPEARING PATTERN",
         "You meet someone. Three months in, they say I love you. Your chest gets tight. You ghost them by Tuesday.",
         "What it looks like: Pulling away when relationships get close. Ghosting. Creating distance when someone wants more intimacy. Ending things before they can end you.",
         "What it costs you: You cannot maintain relationships past 3 months. Chronic loneliness. Serial almost-relationships."),
        ("2. THE APOLOGY LOOP",
         "Sorry to bother you. Sorry, quick question. Sorry, I know you are busy. Sorry for existing.",
         "What it looks like: Constant apologizing. Minimizing your needs. Feeling like a burden. Cannot ask for things directly.",
         "What it costs you: You cannot negotiate salary. You cannot state boundaries. People walk over you because you have trained them to."),
        ("3. THE TESTING PATTERN",
         "You pick fights at 11pm to see if they will still be there at breakfast. You ask loaded questions. You push them away to see if they will fight to stay.",
         "What it looks like: Creating tests to see if people really care. Picking fights to check loyalty. Pushing people away to see if they will come back.",
         "What it costs you: You exhaust partners. You push away people who care. Self-fulfilling abandonment prophecy."),
        ("4. ATTRACTION TO HARM",
         "The nice guy feels boring. The unavailable one feels like chemistry. You see red flags and feel attraction, not warning.",
         "What it looks like: Attracted to unavailable or harmful people. Safe people feel boring. Confusing chaos for chemistry.",
         "What it costs you: Serial abusive or toxic relationships. Cannot stay attracted to healthy partners. The good ones feel wrong."),
        ("5. COMPLIMENT DEFLECTION",
         "Someone says nice work on that project. You say oh it was nothing, anyone could have done it. They stop complimenting you.",
         "What it looks like: Cannot accept praise. Minimize achievements. Self-deprecating jokes when acknowledged. Visibility triggers panic.",
         "What it costs you: Career stagnation. Underpaid despite talent. Invisible to people who could help you. Passed over for promotion."),
        ("6. THE DRAINING BOND",
         "You know you should leave. Your friends tell you to leave. Your therapist tells you to leave. You stay.",
         "What it looks like: Staying bonded to harmful people or situations. Knowing you should leave but feeling unable to. Guilt when thinking about leaving.",
         "What it costs you: Years in toxic jobs or relationships. Chronic depletion. Watching your life pass while staying stuck."),
        ("7. SUCCESS SABOTAGE",
         "You are three weeks from launching. Everything is going well. Suddenly you stop working on it. Or you pick a fight with your business partner. Or you miss the deadline.",
         "What it looks like: Destroying things right before they succeed. Quitting before the breakthrough. Cannot tolerate sustained success or happiness.",
         "What it costs you: Pattern of almost-success then failure. Perpetual struggle. Watching people with less talent succeed because they can tolerate it.")
    ]
    
    for title, quote, looks_like, costs in patterns:
        elements.append(Paragraph(title, styles['PatternHeader']))
        elements.append(Paragraph(quote, styles['BodyItalic']))
        elements.append(Paragraph(looks_like, styles['BodyText']))
        elements.append(Paragraph(costs, styles['BodyText']))
    
    elements.append(PageBreak())
    
    elements.append(Paragraph("DAY 1 TASK: CLAIM YOUR PATTERN", styles['SectionHeader']))
    elements.append(Paragraph("Which pattern made your stomach drop? Which one have you been running for years?", styles['BodyText']))
    elements.append(Spacer(1, 0.2*inch))
    
    elements.append(Paragraph("MY PATTERN: _________________________________________________", styles['FormField']))
    elements.append(Spacer(1, 0.15*inch))
    elements.append(Paragraph("HOW LONG HAVE I BEEN RUNNING IT: _________________________________________________", styles['FormField']))
    elements.append(Spacer(1, 0.15*inch))
    elements.append(Paragraph("WHAT HAS IT COST ME: _________________________________________________", styles['FormField']))
    elements.append(Spacer(1, 0.3*inch))
    
    elements.append(Paragraph("THE ORIGINAL ROOM", styles['PatternHeader']))
    elements.append(Paragraph(
        "Your pattern did not come from nowhere. It installed in childhood. Not because something happened to you - because you learned to DO something to survive.",
        styles['BodyText']
    ))
    elements.append(Paragraph(
        "The Original Room is not a literal room. It is the emotional environment you learned to navigate as a child. The pattern is a survival strategy from that room.",
        styles['BodyText']
    ))
    elements.append(Paragraph(
        "You do not need to process the Original Room. You do not need to heal from it. You just need to know it exists so you understand why the pattern feels so automatic.",
        styles['BodyItalic']
    ))
    elements.append(Spacer(1, 0.2*inch))
    elements.append(Paragraph("Day 1 complete. Tomorrow you learn to feel the pattern activate BEFORE it runs.", styles['Tagline']))
    elements.append(PageBreak())
    
    return elements


def build_day2(styles):
    """Build Day 2 content"""
    elements = []
    
    elements.append(Paragraph("DAY 2", styles['DayHeader']))
    elements.append(Paragraph("LEARN THE BODY SIGNATURE | Time: All day awareness", styles['DaySubHeader']))
    
    elements.append(Paragraph("THE 3-7 SECOND WINDOW", styles['SectionHeader']))
    elements.append(Paragraph(
        "Before your pattern runs, your body signals it. Every time. Chest tightness. Stomach drop. Throat closing. Heart racing. Something.",
        styles['BodyText']
    ))
    elements.append(Paragraph(
        "This is the body signature. It happens 3-7 seconds before the pattern executes.",
        styles['BodyText']
    ))
    elements.append(Paragraph(
        "Right now, you do not notice it. The trigger happens and the pattern runs and you realize what happened afterward. Today you learn to catch it in real time.",
        styles['BodyItalic']
    ))
    
    elements.append(Paragraph("BODY SIGNATURES BY PATTERN", styles['SectionHeader']))
    
    signatures = [
        ("DISAPPEARING:", "Chest tightness. Urge to flee. Claustrophobic feeling. Too much, too close."),
        ("APOLOGY LOOP:", "Guilt. Throat tightening. Shrinking sensation. I am too much, I am a burden."),
        ("TESTING:", "Panic. Heart racing. Hypervigilance. Scanning for signs they will leave."),
        ("ATTRACTION TO HARM:", "Excitement. Chemistry. Finally someone interesting. (The danger feels like attraction.)"),
        ("COMPLIMENT DEFLECTION:", "Squirming. Discomfort. Want to disappear. Make it stop."),
        ("DRAINING BOND:", "Guilt when thinking of leaving. Heavy obligation. I cannot abandon them."),
        ("SUCCESS SABOTAGE:", "Dread. Panic. Something bad is coming. Need to stop this before it gets worse.")
    ]
    
    for sig_name, sig_desc in signatures:
        elements.append(Paragraph(f"<b>{sig_name}</b> {sig_desc}", styles['BodyText']))
    
    elements.append(Paragraph("TODAY'S TASK", styles['SectionHeader']))
    elements.append(Paragraph(
        "When your pattern activates today - and it will - do not try to stop it. Just notice.",
        styles['BodyText']
    ))
    elements.append(Paragraph(
        "What did your body feel BEFORE you executed the pattern?",
        styles['BodyItalic']
    ))
    elements.append(Spacer(1, 0.2*inch))
    
    for i in range(1, 4):
        elements.append(Paragraph(f"Activation {i}:", styles['PatternHeader']))
        elements.append(Paragraph("Time: _______ What happened: _________________________________________________", styles['FormField']))
        elements.append(Paragraph("Body sensation: _________________________________________________", styles['FormField']))
        elements.append(Spacer(1, 0.1*inch))
    
    elements.append(Paragraph(
        "You are not interrupting the pattern yet. You are just seeing it. That is enough for today.",
        styles['BodyItalic']
    ))
    elements.append(Spacer(1, 0.2*inch))
    elements.append(Paragraph("Day 2 complete. Tomorrow you identify what triggers it.", styles['Tagline']))
    elements.append(PageBreak())
    
    return elements


def build_day3(styles):
    """Build Day 3 content"""
    elements = []
    
    elements.append(Paragraph("DAY 3", styles['DayHeader']))
    elements.append(Paragraph("FIND YOUR TRIGGERS | Time: 15 minutes + all day awareness", styles['DaySubHeader']))
    
    elements.append(Paragraph("WHAT IS A TRIGGER", styles['SectionHeader']))
    elements.append(Paragraph(
        "The situation that happens RIGHT BEFORE your pattern activates. Your pattern does not run randomly. It runs in response to specific triggers.",
        styles['BodyText']
    ))
    elements.append(Paragraph(
        "Know your triggers and you can see the pattern coming before it runs.",
        styles['BodyItalic']
    ))
    
    elements.append(Paragraph("COMMON TRIGGERS BY PATTERN", styles['SectionHeader']))
    
    triggers = [
        ("DISAPPEARING:", "Partner says I love you. Making future plans. Relationship getting serious. Someone wanting more of you."),
        ("APOLOGY LOOP:", "Needing to ask for help. Wanting something. Taking up someone's time. Having to state a boundary."),
        ("TESTING:", "Partner takes too long to text back. Someone seems distant. Relationship is going too well."),
        ("ATTRACTION TO HARM:", "Meeting someone with red flags. Safe person shows interest (feels boring). Stability."),
        ("COMPLIMENT DEFLECTION:", "Being praised. Achievement acknowledged. Visibility in any form. Someone noticing you."),
        ("DRAINING BOND:", "Thinking about leaving. Someone suggesting you deserve better. Glimpse of life without them."),
        ("SUCCESS SABOTAGE:", "Approaching milestone. Things going well for too long. About to succeed at something.")
    ]
    
    for trig_name, trig_desc in triggers:
        elements.append(Paragraph(f"<b>{trig_name}</b> {trig_desc}", styles['BodyText']))
    
    elements.append(Paragraph("TODAY'S TASK", styles['SectionHeader']))
    elements.append(Paragraph(
        "Track what triggers your pattern today. Not what the pattern does - what happens RIGHT BEFORE.",
        styles['BodyText']
    ))
    elements.append(Spacer(1, 0.15*inch))
    
    for i in range(1, 4):
        elements.append(Paragraph(f"TRIGGER {i}: _________________________________________________", styles['FormField']))
        elements.append(Spacer(1, 0.1*inch))
    
    elements.append(Paragraph("END OF DAY: YOUR TOP 3 TRIGGERS", styles['SectionHeader']))
    elements.append(Paragraph("These are the situations where you need to be ready:", styles['BodyText']))
    
    for i in range(1, 4):
        elements.append(Paragraph(f"{i}. _________________________________________________", styles['FormField']))
        elements.append(Spacer(1, 0.1*inch))
    
    elements.append(Paragraph("Day 3 complete. Tomorrow you learn how to interrupt it.", styles['Tagline']))
    elements.append(PageBreak())
    
    return elements


def build_day4(styles):
    """Build Day 4 content"""
    elements = []
    
    elements.append(Paragraph("DAY 4", styles['DayHeader']))
    elements.append(Paragraph("LEARN YOUR CIRCUIT BREAK | Time: 15 minutes to memorize", styles['DaySubHeader']))
    
    elements.append(Paragraph("WHAT IS A CIRCUIT BREAK", styles['SectionHeader']))
    elements.append(Paragraph(
        "A pre-written script you say when the pattern activates. Out loud or in your head. It interrupts the automatic sequence.",
        styles['BodyText']
    ))
    elements.append(Paragraph(
        "Right now: Trigger > Body signature > Pattern runs (3-7 seconds, automatic)",
        styles['BodyText']
    ))
    elements.append(Paragraph(
        "With circuit break: Trigger > Body signature > CIRCUIT BREAK > Choose different behavior",
        styles['BodyText']
    ))
    elements.append(Paragraph(
        "The circuit break creates a gap. In that gap, you can choose.",
        styles['BodyItalic']
    ))
    
    elements.append(Paragraph("YOUR CIRCUIT BREAK SCRIPT", styles['SectionHeader']))
    elements.append(Paragraph("Find your pattern. Memorize this script. Say it when the body signature hits.", styles['BodyText']))
    
    scripts = [
        ("DISAPPEARING:", '"The Disappearing Pattern just activated. I feel [chest tightness/panic/urge to flee]. The program wants me to pull away. I am choosing to stay and communicate instead."'),
        ("APOLOGY LOOP:", '"I am about to apologize for [asking/needing/existing]. I have done nothing wrong. I am replacing sorry with thank you."'),
        ("TESTING:", '"The Testing Pattern activated. I want to test if they really care. I am not creating a test. I am asking directly instead."'),
        ("ATTRACTION TO HARM:", '"I feel chemistry with this person. Let me check: are they safe or familiar? This is pattern recognition, not love. I am choosing not to pursue."'),
        ("COMPLIMENT DEFLECTION:", '"Someone just complimented me. I want to deflect. I am saying only: thank you. No deflection. No minimization."'),
        ("DRAINING BOND:", '"I know I should leave this [relationship/job/situation]. I am staying out of pattern, not love or necessity. Leaving is self-preservation, not betrayal."'),
        ("SUCCESS SABOTAGE:", '"I am approaching [milestone/success]. Success Sabotage is activating. This is the pattern, not reality. I am allowed to succeed. I am continuing forward."')
    ]
    
    for script_name, script_text in scripts:
        elements.append(Paragraph(f"<b>{script_name}</b>", styles['PatternHeader']))
        elements.append(Paragraph(script_text, styles['BodyItalic']))
    
    elements.append(Paragraph("TODAY'S TASK", styles['SectionHeader']))
    elements.append(Paragraph("1. Write your circuit break script on paper or in your phone", styles['BulletItem']))
    elements.append(Paragraph("2. Say it out loud 5 times", styles['BulletItem']))
    elements.append(Paragraph("3. Imagine your most recent trigger and practice saying it", styles['BulletItem']))
    elements.append(Spacer(1, 0.2*inch))
    elements.append(Paragraph("Tomorrow you use it for real.", styles['Tagline']))
    elements.append(PageBreak())
    
    return elements


def build_day5(styles):
    """Build Day 5 content"""
    elements = []
    
    elements.append(Paragraph("DAY 5", styles['DayHeader']))
    elements.append(Paragraph("FIRST INTERRUPT ATTEMPT | Success = attempting the circuit break", styles['DaySubHeader']))
    
    elements.append(Paragraph("WHAT TO EXPECT", styles['SectionHeader']))
    elements.append(Paragraph("Today your pattern will activate. When it does:", styles['BodyText']))
    elements.append(Paragraph("Step 1: Feel the body signature", styles['BulletItem']))
    elements.append(Paragraph("Step 2: Say your circuit break", styles['BulletItem']))
    elements.append(Paragraph("Step 3: Attempt different behavior", styles['BulletItem']))
    
    elements.append(Paragraph("LIKELY OUTCOMES", styles['SectionHeader']))
    elements.append(Paragraph(
        "<b>70% chance - AUTO:</b> Pattern runs anyway. You feel it, you say the circuit break, the pattern executes anyway. This is normal. This is data. You TRIED.",
        styles['BodyText']
    ))
    elements.append(Paragraph(
        "<b>20% chance - PAUSE:</b> You pause before the pattern runs. Maybe 2 seconds. Maybe 10. Then it runs anyway. This is progress. You created a GAP.",
        styles['BodyText']
    ))
    elements.append(Paragraph(
        "<b>10% chance - REWRITE:</b> You successfully interrupt. Rare on Day 5. If it happens, you are ahead of schedule.",
        styles['BodyText']
    ))
    
    elements.append(Paragraph("TODAY'S TRACKING", styles['SectionHeader']))
    
    for i in range(1, 3):
        elements.append(Paragraph(f"Attempt {i}:", styles['PatternHeader']))
        elements.append(Paragraph("Time: _______ Trigger: _________________________________________________", styles['FormField']))
        elements.append(Paragraph("Body signature felt?  [ ] Yes  [ ] No", styles['FormField']))
        elements.append(Paragraph("Circuit break said?  [ ] Yes  [ ] No", styles['FormField']))
        elements.append(Paragraph("Outcome:  [ ] AUTO (ran anyway)  [ ] PAUSE (paused then ran)  [ ] REWRITE (interrupted)", styles['FormField']))
        elements.append(Spacer(1, 0.1*inch))
    
    elements.append(Paragraph("AUTO is not failure. It is data. Write it down. Tomorrow we use it.", styles['BodyItalic']))
    elements.append(PageBreak())
    
    return elements


def build_day6(styles):
    """Build Day 6 content"""
    elements = []
    
    elements.append(Paragraph("DAY 6", styles['DayHeader']))
    elements.append(Paragraph("REFINE AND RETRY | Use yesterday's data", styles['DaySubHeader']))
    
    elements.append(Paragraph("WHAT WENT WRONG YESTERDAY", styles['SectionHeader']))
    elements.append(Paragraph("Check what made interruption difficult:", styles['BodyText']))
    elements.append(Paragraph("[ ] Pattern ran too fast - did not catch body signature in time", styles['FormField']))
    elements.append(Paragraph("[ ] Forgot circuit break in the moment", styles['FormField']))
    elements.append(Paragraph("[ ] Body sensation was too intense to think", styles['FormField']))
    elements.append(Paragraph("[ ] Did not recognize the trigger until after", styles['FormField']))
    
    elements.append(Paragraph("ADJUSTMENTS", styles['SectionHeader']))
    elements.append(Paragraph(
        "<b>If pattern ran too fast:</b> Pre-load the circuit break. When you wake up, say it. Before entering triggering situations, say it. Keep it loaded.",
        styles['BodyText']
    ))
    elements.append(Paragraph(
        "<b>If you forgot the circuit break:</b> Set phone alarm every 2 hours: What is my circuit break? Keep it front of mind.",
        styles['BodyText']
    ))
    elements.append(Paragraph(
        "<b>If body sensation was too intense:</b> Add 3 deep breaths before the circuit break. Breath > Circuit break > Choose.",
        styles['BodyText']
    ))
    elements.append(Paragraph(
        "<b>If you missed the trigger:</b> Watch specifically for your top 3 triggers today. You know what they are now.",
        styles['BodyText']
    ))
    
    elements.append(Paragraph("TODAY'S TRACKING", styles['SectionHeader']))
    for i in range(1, 4):
        elements.append(Paragraph(f"Attempt {i}: Trigger: _________________ Outcome: [ ] AUTO  [ ] PAUSE  [ ] REWRITE", styles['FormField']))
    
    elements.append(Paragraph("END OF DAY 6", styles['SectionHeader']))
    elements.append(Paragraph("Did you successfully interrupt at least once?", styles['BodyText']))
    elements.append(Paragraph("[ ] Yes - You have proof this works", styles['FormField']))
    elements.append(Paragraph("[ ] No, but I paused - Progress. You are slowing it down.", styles['FormField']))
    elements.append(Paragraph("[ ] No, pattern still runs automatically - Some patterns need more than 7 days. That is tomorrow's decision.", styles['FormField']))
    elements.append(PageBreak())
    
    return elements


def build_day7(styles):
    """Build Day 7 content"""
    elements = []
    
    elements.append(Paragraph("DAY 7", styles['DayHeader']))
    elements.append(Paragraph("DECIDE YOUR NEXT STEP | Time: 15 minutes", styles['DaySubHeader']))
    
    elements.append(Paragraph("YOUR WEEK IN REVIEW", styles['SectionHeader']))
    elements.append(Paragraph("Pattern identified: _________________________________________________", styles['FormField']))
    elements.append(Paragraph("Body signature: _________________________________________________", styles['FormField']))
    elements.append(Paragraph("Top triggers: _________________________________________________", styles['FormField']))
    elements.append(Paragraph("Best outcome achieved:  [ ] AUTO  [ ] PAUSE  [ ] REWRITE", styles['FormField']))
    
    elements.append(Paragraph("WHAT YOUR RESULTS MEAN", styles['SectionHeader']))
    
    elements.append(Paragraph("IF YOU ACHIEVED REWRITE (even once):", styles['PatternHeader']))
    elements.append(Paragraph(
        "The method works for you. You interrupted a pattern that has been running for years. That is not luck. That is proof.",
        styles['BodyText']
    ))
    elements.append(Paragraph("Next step: Continue with 30-day or 90-day protocol to make interruption automatic.", styles['BodyItalic']))
    
    elements.append(Paragraph("IF YOU ACHIEVED PAUSE:", styles['PatternHeader']))
    elements.append(Paragraph(
        "You are slowing the pattern down. That gap you created will get longer with practice.",
        styles['BodyText']
    ))
    elements.append(Paragraph("Next step: Continue. You need more reps, not a different method.", styles['BodyItalic']))
    
    elements.append(Paragraph("IF PATTERN STILL RUNS ON AUTO:", styles['PatternHeader']))
    elements.append(Paragraph("Several possibilities:", styles['BodyText']))
    elements.append(Paragraph("• Wrong pattern: Try a different one", styles['BulletItem']))
    elements.append(Paragraph("• Pattern too severe: May need professional support alongside this method", styles['BulletItem']))
    elements.append(Paragraph("• Need more time: Some patterns need 30+ days to begin interrupting", styles['BulletItem']))
    elements.append(Paragraph("• This method is not for you: That is valid data too", styles['BulletItem']))
    
    elements.append(Paragraph("YOUR DECISION", styles['SectionHeader']))
    elements.append(Paragraph("[ ] Continue with 30-Day Protocol (saw progress, want to solidify)", styles['FormField']))
    elements.append(Paragraph("[ ] Continue with 90-Day Protocol (ready to master this)", styles['FormField']))
    elements.append(Paragraph("[ ] Try a different pattern", styles['FormField']))
    elements.append(Paragraph("[ ] Seek therapy/professional support first", styles['FormField']))
    elements.append(Paragraph("[ ] Stop here", styles['FormField']))
    elements.append(PageBreak())
    
    return elements


def build_next_steps(styles):
    """Build What Comes Next page"""
    elements = []
    
    elements.append(Paragraph("WHAT COMES NEXT", styles['SectionHeader']))
    elements.append(Spacer(1, 0.2*inch))
    
    elements.append(Paragraph("IF YOU WANT TO CONTINUE", styles['PatternHeader']))
    elements.append(Paragraph("The 7-Day Crash Course is proof of concept. Here is the full system:", styles['BodyText']))
    elements.append(Spacer(1, 0.2*inch))
    
    elements.append(Paragraph("THE ARCHIVIST METHOD QUICK-START ($47)", styles['RuleText']))
    elements.append(Paragraph(
        "Full 90-day protocol. All 7 patterns. Circuit break library. Crisis protocols. Tracking templates. Relationship scripts.",
        styles['BodyText']
    ))
    elements.append(Paragraph("Portal access + Unlimited Archivist AI (your pattern-interruption assistant)", styles['BodyItalic']))
    elements.append(Spacer(1, 0.2*inch))
    
    elements.append(Paragraph("THE COMPLETE ARCHIVE ($197)", styles['RuleText']))
    elements.append(Paragraph(
        "Everything in Quick-Start plus: Advanced pattern combinations. Workplace applications. Relationship protocols. Parenting with patterns.",
        styles['BodyText']
    ))
    elements.append(Paragraph("Portal access + Priority Archivist AI + Lifetime updates", styles['BodyItalic']))
    elements.append(Spacer(1, 0.5*inch))
    
    elements.append(Paragraph("thearchivistmethod.com", styles['Tagline']))
    elements.append(Spacer(1, 0.5*inch))
    
    elements.append(Paragraph("THE ARCHIVIST METHOD™", styles['TitleMain']))
    elements.append(Paragraph("Pattern Archaeology, Not Therapy", styles['Tagline']))
    elements.append(Spacer(1, 0.3*inch))
    elements.append(Paragraph("You have a pattern destroying your life.", styles['QuoteText']))
    elements.append(Paragraph("Now you know how to interrupt it.", styles['QuoteText']))
    elements.append(Spacer(1, 0.5*inch))
    elements.append(Paragraph("THE ARCHIVIST METHOD | END OF CRASH COURSE", styles['Classified']))
    
    return elements


def generate_pdf():
    """Generate the complete branded PDF"""
    
    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    
    doc = SimpleDocTemplate(
        OUTPUT_PATH,
        pagesize=letter,
        leftMargin=0.75*inch,
        rightMargin=0.75*inch,
        topMargin=0.75*inch,
        bottomMargin=0.75*inch
    )
    
    template = ArchivistPDFTemplate(doc)
    styles = create_styles()
    
    elements = []
    elements.extend(build_title_page(styles))
    elements.extend(build_what_this_is(styles))
    elements.extend(build_rules(styles))
    elements.extend(build_day1(styles))
    elements.extend(build_day2(styles))
    elements.extend(build_day3(styles))
    elements.extend(build_day4(styles))
    elements.extend(build_day5(styles))
    elements.extend(build_day6(styles))
    elements.extend(build_day7(styles))
    elements.extend(build_next_steps(styles))
    
    doc.build(elements, onFirstPage=template.draw_page, onLaterPages=template.draw_page)
    
    print(f"PDF generated successfully: {OUTPUT_PATH}")
    return OUTPUT_PATH


if __name__ == "__main__":
    generate_pdf()
