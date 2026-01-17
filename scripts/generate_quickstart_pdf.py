#!/usr/bin/env python3
"""
The Archivist Method™ Quick-Start System PDF Generator
Branded with dark gothic/industrial aesthetic
"""

from reportlab.lib.pagesizes import letter
from reportlab.lib.colors import HexColor
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle, Image as RLImage
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.pdfgen import canvas
from reportlab.lib.units import inch
from PIL import Image
import os
import shutil

DARK_BG = HexColor('#1a1a1a')
CHARCOAL = HexColor('#2a2a2a')
TEAL = HexColor('#14B8A6')
PINK = HexColor('#EC4899')
WHITE = HexColor('#FFFFFF')
LIGHT_GRAY = HexColor('#E5E5E5')
MED_GRAY = HexColor('#9CA3AF')
DARK_GRAY = HexColor('#4B5563')

OUTPUT_PATH = "/home/runner/workspace/generated_pdfs/ARCHIVIST-METHOD-QUICK-START-SYSTEM.pdf"
LOGO_PATH = "/home/runner/workspace/attached_assets/archivist-logo-pdf.png"
LOGO_PATH_COMPOSITED = "/home/runner/workspace/attached_assets/archivist-logo-pdf-composited.png"


def prepare_logo_for_pdf():
    """Pre-composite the logo onto dark background to avoid transparency issues in PDF"""
    if not os.path.exists(LOGO_PATH):
        return None
    
    try:
        logo = Image.open(LOGO_PATH).convert('RGBA')
        dark_bg = Image.new('RGBA', logo.size, (26, 26, 26, 255))
        composited = Image.alpha_composite(dark_bg, logo)
        final = composited.convert('RGB')
        final.save(LOGO_PATH_COMPOSITED, 'PNG', quality=95)
        return LOGO_PATH_COMPOSITED
    except Exception as e:
        print(f"Error preparing logo: {e}")
        return LOGO_PATH


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
        
        canvas.setFont("Helvetica", 8)
        canvas.setFillColor(MED_GRAY)
        footer_text = "THE ARCHIVIST METHOD™ | CLASSIFIED"
        canvas.drawCentredString(width/2, 0.5*inch, footer_text)
        
        canvas.setFont("Helvetica", 8)
        canvas.drawRightString(width - 0.75*inch, 0.5*inch, f"Page {self.page_num}")


def create_styles():
    """Create custom paragraph styles for the PDF"""
    styles = getSampleStyleSheet()
    
    # Override default BodyText style with our dark theme version
    styles['BodyText'].fontName = 'Helvetica'
    styles['BodyText'].fontSize = 11
    styles['BodyText'].textColor = LIGHT_GRAY
    styles['BodyText'].alignment = TA_LEFT
    styles['BodyText'].spaceBefore = 4
    styles['BodyText'].spaceAfter = 6
    styles['BodyText'].leading = 16
    
    styles.add(ParagraphStyle(
        name='TitleMain',
        fontName='Helvetica-Bold',
        fontSize=28,
        textColor=TEAL,
        alignment=TA_CENTER,
        spaceAfter=12,
        leading=34
    ))
    
    styles.add(ParagraphStyle(
        name='TitleSub',
        fontName='Helvetica-Bold',
        fontSize=22,
        textColor=WHITE,
        alignment=TA_CENTER,
        spaceAfter=20,
        leading=28
    ))
    
    styles.add(ParagraphStyle(
        name='Tagline',
        fontName='Helvetica-Oblique',
        fontSize=14,
        textColor=PINK,
        alignment=TA_CENTER,
        spaceBefore=30,
        spaceAfter=20
    ))
    
    styles.add(ParagraphStyle(
        name='SectionHeader',
        fontName='Helvetica-Bold',
        fontSize=20,
        textColor=TEAL,
        alignment=TA_CENTER,
        spaceBefore=20,
        spaceAfter=16,
        leading=26
    ))
    
    styles.add(ParagraphStyle(
        name='SubsectionHeader',
        fontName='Helvetica-Bold',
        fontSize=16,
        textColor=TEAL,
        alignment=TA_LEFT,
        spaceBefore=16,
        spaceAfter=10,
        leading=20
    ))
    
    styles.add(ParagraphStyle(
        name='PatternHeader',
        fontName='Helvetica-Bold',
        fontSize=14,
        textColor=WHITE,
        alignment=TA_LEFT,
        spaceBefore=14,
        spaceAfter=8,
        leading=18
    ))
    
    styles.add(ParagraphStyle(
        name='BodyItalic',
        fontName='Helvetica-Oblique',
        fontSize=11,
        textColor=LIGHT_GRAY,
        alignment=TA_CENTER,
        spaceBefore=4,
        spaceAfter=6,
        leading=16
    ))
    
    styles.add(ParagraphStyle(
        name='BulletItem',
        fontName='Helvetica',
        fontSize=11,
        textColor=LIGHT_GRAY,
        alignment=TA_LEFT,
        leftIndent=20,
        spaceBefore=2,
        spaceAfter=2,
        leading=15
    ))
    
    styles.add(ParagraphStyle(
        name='ScriptText',
        fontName='Helvetica-Oblique',
        fontSize=10,
        textColor=LIGHT_GRAY,
        alignment=TA_LEFT,
        leftIndent=25,
        rightIndent=25,
        spaceBefore=8,
        spaceAfter=8,
        leading=14,
        borderColor=CHARCOAL,
        borderWidth=1,
        borderPadding=10
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
    
    styles.add(ParagraphStyle(
        name='FormField',
        fontName='Helvetica',
        fontSize=11,
        textColor=MED_GRAY,
        alignment=TA_LEFT,
        spaceBefore=4,
        spaceAfter=4,
        leading=14
    ))
    
    styles.add(ParagraphStyle(
        name='TealHighlight',
        fontName='Helvetica-Bold',
        fontSize=11,
        textColor=TEAL,
        alignment=TA_LEFT,
        spaceBefore=4,
        spaceAfter=4,
        leading=15
    ))
    
    styles.add(ParagraphStyle(
        name='PinkHighlight',
        fontName='Helvetica-Bold',
        fontSize=11,
        textColor=PINK,
        alignment=TA_LEFT,
        spaceBefore=4,
        spaceAfter=4,
        leading=15
    ))
    
    return styles


def build_title_page(styles):
    """Create the title page elements with logo"""
    elements = []
    
    elements.append(Spacer(1, 0.5*inch))
    
    logo_path = prepare_logo_for_pdf()
    if logo_path and os.path.exists(logo_path):
        logo = RLImage(logo_path, width=2*inch, height=2*inch)
        logo.hAlign = 'CENTER'
        elements.append(logo)
        elements.append(Spacer(1, 0.4*inch))
    else:
        elements.append(Spacer(1, 1*inch))
    
    elements.append(Paragraph("THE ARCHIVIST METHOD™", styles['TitleMain']))
    elements.append(Paragraph("QUICK-START SYSTEM", styles['TitleSub']))
    elements.append(Spacer(1, 0.3*inch))
    
    elements.append(Paragraph("Your 90-Day Protocol for Pattern Interruption", styles['QuoteText']))
    elements.append(Spacer(1, 0.5*inch))
    
    elements.append(Paragraph("PATTERN ARCHAEOLOGY, NOT THERAPY", styles['Tagline']))
    elements.append(Spacer(1, 1.5*inch))
    
    elements.append(Paragraph("THE ARCHIVIST METHOD™ | CLASSIFIED", styles['Classified']))
    elements.append(PageBreak())
    
    return elements


def build_what_this_is(styles):
    """Build the intro section"""
    elements = []
    
    elements.append(Paragraph("WHAT THIS IS", styles['SectionHeader']))
    elements.append(Spacer(1, 0.2*inch))
    
    elements.append(Paragraph(
        "You have a pattern destroying your life.",
        styles['BodyText']
    ))
    elements.append(Paragraph(
        "You already bought the programs. You did Day 1. Maybe Day 2. Then it joined the graveyard in your downloads folder.",
        styles['BodyText']
    ))
    elements.append(Paragraph(
        "You're here because something different needs to happen.",
        styles['BodyText']
    ))
    elements.append(Paragraph(
        "This is that something.",
        styles['TealHighlight']
    ))
    elements.append(Spacer(1, 0.3*inch))
    
    elements.append(Paragraph("THIS IS NOT THERAPY", styles['SubsectionHeader']))
    elements.append(Paragraph(
        "We're not processing your trauma. We're not exploring your feelings. We're not journaling about your inner child.",
        styles['BodyText']
    ))
    elements.append(Paragraph(
        "This is pattern interruption. Behavioral forensics. You have code running. We're going to interrupt it mid-execution.",
        styles['BodyText']
    ))
    elements.append(Paragraph(
        "Therapy explains why the house is on fire. This teaches you how to stop lighting matches.",
        styles['TealHighlight']
    ))
    elements.append(Spacer(1, 0.3*inch))
    
    elements.append(Paragraph("WHAT YOU'RE HERE TO DO", styles['SubsectionHeader']))
    elements.append(Paragraph("One pattern. 90 days. By Day 90:", styles['BodyText']))
    elements.append(Paragraph("• Pattern activates 50-70% less frequently", styles['BulletItem']))
    elements.append(Paragraph("• When it activates, you catch it within seconds", styles['BulletItem']))
    elements.append(Paragraph("• You interrupt it more than it runs you", styles['BulletItem']))
    elements.append(Paragraph("• It no longer controls your life", styles['BulletItem']))
    elements.append(Paragraph("That's it.", styles['TealHighlight']))
    elements.append(Spacer(1, 0.3*inch))
    
    elements.append(Paragraph("HOW THIS GUIDE WORKS", styles['SubsectionHeader']))
    elements.append(Paragraph("<b>Section 1:</b> Identify which pattern is running", styles['BodyText']))
    elements.append(Paragraph("<b>Section 2:</b> The 90-Day Protocol (the actual work)", styles['BodyText']))
    elements.append(Paragraph("<b>Section 3:</b> Circuit Break Library (pre-written scripts)", styles['BodyText']))
    elements.append(Paragraph("<b>Section 4:</b> Original Room Excavation (where it installed)", styles['BodyText']))
    elements.append(Paragraph("<b>Section 5:</b> Tracking Instructions", styles['BodyText']))
    elements.append(Paragraph("<b>Section 6:</b> Crisis Protocols", styles['BodyText']))
    elements.append(Paragraph("<b>Section 7:</b> Relationship Scripts", styles['BodyText']))
    elements.append(Spacer(1, 0.2*inch))
    elements.append(Paragraph("Pick one pattern. Work the protocol. Everything else is reference material.", styles['TealHighlight']))
    
    elements.append(PageBreak())
    return elements


def build_pattern_assessment(styles):
    """Build Section 1: Pattern Assessment"""
    elements = []
    
    elements.append(Paragraph("SECTION 1: PATTERN ASSESSMENT", styles['SectionHeader']))
    elements.append(Spacer(1, 0.2*inch))
    
    elements.append(Paragraph("IDENTIFY YOUR PRIMARY PATTERN", styles['SubsectionHeader']))
    elements.append(Paragraph(
        "You run multiple patterns. You can only fix one at a time.",
        styles['BodyText']
    ))
    elements.append(Paragraph(
        "This assessment finds your primary—the one causing the most damage right now.",
        styles['BodyText']
    ))
    elements.append(Spacer(1, 0.3*inch))
    
    elements.append(Paragraph("THE 7 CORE PATTERNS", styles['SubsectionHeader']))
    elements.append(Paragraph("Read all seven. Pick the one that made your stomach drop.", styles['BodyItalic']))
    elements.append(Spacer(1, 0.2*inch))
    
    patterns = [
        ("1. THE DISAPPEARING PATTERN",
         "Someone says \"I love you.\" Your chest gets tight. You ghost them by Tuesday.",
         "Pulling away when relationships get close. Ghosting. Creating distance when someone wants more. Ending things before they can end you.",
         "Can't maintain relationships past 3 months. Chronic loneliness. Serial almost-relationships."),
        
        ("2. THE APOLOGY LOOP",
         "Sorry to bother you. Sorry, quick question. Sorry, I know you're busy. Sorry for existing.",
         "Constant apologizing. Minimizing your needs. Feeling like a burden. Can't ask for things directly.",
         "Can't negotiate salary. Can't state boundaries. People walk over you because you trained them to."),
        
        ("3. THE TESTING PATTERN",
         "You pick fights at 11pm to see if they'll still be there at breakfast. You push them away to see if they'll fight to stay.",
         "Creating tests to prove people care. Picking fights to check loyalty. Pushing people away to see if they come back.",
         "Exhaust partners. Push away people who care. Self-fulfilling abandonment prophecy."),
        
        ("4. ATTRACTION TO HARM",
         "The nice guy feels boring. The unavailable one feels like chemistry. Red flags feel like attraction, not warning.",
         "Attracted to unavailable or harmful people. Safe people feel boring. Confusing chaos for chemistry.",
         "Serial toxic relationships. Can't stay attracted to healthy partners. The good ones feel wrong."),
        
        ("5. COMPLIMENT DEFLECTION",
         "Boss says \"nice work.\" You say \"oh, it was nothing, anyone could have done it.\" They stop complimenting you.",
         "Can't accept praise. Minimize achievements. Self-deprecating jokes when acknowledged. Visibility triggers panic.",
         "Career stagnation. Underpaid despite talent. Invisible to people who could help you. Passed over for promotion."),
        
        ("6. THE DRAINING BOND",
         "You know you should leave. Your friends tell you. Your therapist tells you. You stay.",
         "Staying bonded to harmful people or situations. Knowing you should leave but can't. Guilt when thinking about leaving.",
         "Years in toxic jobs or relationships. Chronic depletion. Watching your life pass while staying stuck."),
        
        ("7. SUCCESS SABOTAGE",
         "Three weeks from launching. Everything's going well. You stop working. Or pick a fight with your business partner. Or miss the deadline.",
         "Destroying things right before they succeed. Quitting before breakthrough. Can't tolerate sustained success or happiness.",
         "Pattern of almost-success then failure. Perpetual struggle. Watching people with less talent succeed because they can tolerate it.")
    ]
    
    for name, desc, looks_like, costs in patterns:
        elements.append(Paragraph(name, styles['PatternHeader']))
        elements.append(Paragraph(desc, styles['ScriptText']))
        elements.append(Paragraph(f"<b>What it looks like:</b> {looks_like}", styles['BodyText']))
        elements.append(Paragraph(f"<b>What it costs you:</b> {costs}", styles['BodyText']))
        elements.append(Spacer(1, 0.15*inch))
    
    elements.append(PageBreak())
    return elements


def build_assessment_quiz(styles):
    """Build the assessment quiz section"""
    elements = []
    
    elements.append(Paragraph("ASSESSMENT QUIZ", styles['SectionHeader']))
    elements.append(Spacer(1, 0.15*inch))
    
    elements.append(Paragraph("Rate each statement:", styles['BodyText']))
    elements.append(Paragraph("0 = Never  |  1 = Rarely  |  2 = Sometimes  |  3 = Often  |  4 = Very often  |  5 = Almost always", styles['TealHighlight']))
    elements.append(Spacer(1, 0.2*inch))
    
    quiz_patterns = [
        ("PATTERN 1: DISAPPEARING", [
            "I pull away when someone says \"I love you\"",
            "I sabotage relationships when they're going well",
            "Past partners called me emotionally unavailable",
            "I ghost instead of having difficult conversations",
            "I'm more comfortable alone than close to others"
        ]),
        ("PATTERN 2: APOLOGY LOOP", [
            "I say \"sorry\" multiple times daily for normal things",
            "I minimize my needs so I don't inconvenience anyone",
            "I can't state my needs without guilt",
            "I feel responsible when others are upset (even if not my fault)",
            "I believe my existence inconveniences people"
        ]),
        ("PATTERN 3: TESTING", [
            "I create tests to prove people care",
            "I pick fights to see how they'll respond",
            "I assume people will leave eventually",
            "I've been called paranoid or insecure",
            "I test boundaries to see if people mean what they say"
        ]),
        ("PATTERN 4: ATTRACTION TO HARM", [
            "Healthy, stable people feel boring",
            "I feel chemistry with people who are bad for me",
            "I replicate unhealthy childhood dynamics",
            "Friends/family warn me about people I pursue",
            "Dysfunction feels familiar and comfortable"
        ]),
        ("PATTERN 5: COMPLIMENT DEFLECTION", [
            "I minimize achievements automatically",
            "I redirect compliments to others",
            "I believe compliments aren't genuine",
            "I downplay my skills and talents",
            "Recognition makes me want to hide"
        ]),
        ("PATTERN 6: DRAINING BOND", [
            "I know I should leave but can't",
            "Leaving feels more dangerous than staying",
            "I've stayed in toxic situations for years",
            "I feel responsible for others' wellbeing (to my detriment)",
            "Loyalty keeps me bonded past when I should leave"
        ]),
        ("PATTERN 7: SUCCESS SABOTAGE", [
            "I quit when I'm close to achieving something",
            "I destroy opportunities when they're going well",
            "I create crisis right before breakthroughs",
            "I've blown up opportunities I worked hard for",
            "I believe I don't deserve good things"
        ])
    ]
    
    for pattern_name, questions in quiz_patterns:
        elements.append(Paragraph(pattern_name, styles['SubsectionHeader']))
        for q in questions:
            elements.append(Paragraph(f"___ {q}", styles['FormField']))
        elements.append(Paragraph("<b>TOTAL: ___ / 25</b>", styles['BodyText']))
        elements.append(Spacer(1, 0.15*inch))
    
    elements.append(PageBreak())
    
    elements.append(Paragraph("YOUR SCORES", styles['SubsectionHeader']))
    elements.append(Paragraph("<b>20-25:</b> This is your primary pattern. Start here.", styles['TealHighlight']))
    elements.append(Paragraph("<b>15-19:</b> Strong presence. Primary or secondary.", styles['BodyText']))
    elements.append(Paragraph("<b>10-14:</b> Pattern exists but may be secondary.", styles['BodyText']))
    elements.append(Paragraph("<b>5-9:</b> Occasionally present.", styles['BodyText']))
    elements.append(Paragraph("<b>0-4:</b> Not significant.", styles['BodyText']))
    elements.append(Spacer(1, 0.3*inch))
    
    elements.append(Paragraph("MY PRIMARY PATTERN: _______________________  SCORE: ___", styles['FormField']))
    elements.append(Spacer(1, 0.1*inch))
    elements.append(Paragraph("MY SECONDARY PATTERN: _______________________  SCORE: ___", styles['FormField']))
    elements.append(Spacer(1, 0.3*inch))
    
    elements.append(Paragraph("Work your primary. Ignore the rest for now.", styles['TealHighlight']))
    elements.append(PageBreak())
    
    return elements


def build_90_day_protocol(styles):
    """Build Section 2: The 90-Day Protocol"""
    elements = []
    
    elements.append(Paragraph("SECTION 2: THE 90-DAY PROTOCOL", styles['SectionHeader']))
    elements.append(Spacer(1, 0.2*inch))
    
    elements.append(Paragraph("YOUR PATTERN INTERRUPTION ROADMAP", styles['SubsectionHeader']))
    elements.append(Paragraph("Four phases:", styles['BodyText']))
    elements.append(Paragraph("<b>Weeks 1-3:</b> OBSERVATION (notice, don't change)", styles['BulletItem']))
    elements.append(Paragraph("<b>Weeks 4-5:</b> PAUSE (create gap between trigger and behavior)", styles['BulletItem']))
    elements.append(Paragraph("<b>Weeks 6-8:</b> CIRCUIT BREAK (verbal interruption)", styles['BulletItem']))
    elements.append(Paragraph("<b>Weeks 9-12:</b> REWRITE (new behavior)", styles['BulletItem']))
    elements.append(Spacer(1, 0.3*inch))
    
    elements.append(Paragraph("WEEKS 1-3: OBSERVATION PHASE", styles['SubsectionHeader']))
    elements.append(Paragraph("<b>OBJECTIVE:</b> Pattern recognition without judgment.", styles['BodyText']))
    elements.append(Paragraph("<b>THE WORK:</b> Track every activation. Note trigger, body sensation, automatic thought, behavior.", styles['BodyText']))
    elements.append(Paragraph("Do NOT try to change anything yet.", styles['PinkHighlight']))
    elements.append(Paragraph("<b>WHY:</b> Most people skip this. They try to change immediately. Then they can't recognize pattern activation fast enough to interrupt it. You need to train recognition first.", styles['BodyText']))
    elements.append(Paragraph("<b>SUCCESS CRITERIA:</b> Identify pattern within 10 seconds of activation by end of Week 3.", styles['TealHighlight']))
    elements.append(Spacer(1, 0.2*inch))
    
    elements.append(Paragraph("WHAT TO TRACK", styles['PatternHeader']))
    
    track_items = [
        ("1. TRIGGER", "What happened right before pattern activated. Examples: Partner said \"I love you\", Needed to ask for help, Partner took 3 hours to text back"),
        ("2. BODY SIGNATURE", "Physical feeling 3-7 seconds before automatic behavior: Chest tightness, Stomach drop, Throat closing, Heart racing, Nausea, Panic, Dread"),
        ("3. AUTOMATIC THOUGHT", "What your mind says: \"This is too much\", \"I'm being a burden\", \"They're going to leave anyway\", \"They don't mean it\""),
        ("4. BEHAVIOR", "What you did automatically: Pulled away, Apologized before asking, Picked fight, Deflected to others, Stayed when you should have left")
    ]
    
    for title, desc in track_items:
        elements.append(Paragraph(f"<b>{title}</b>", styles['BodyText']))
        elements.append(Paragraph(desc, styles['BulletItem']))
    
    elements.append(Spacer(1, 0.2*inch))
    
    elements.append(Paragraph("WEEK-BY-WEEK EXPECTATIONS", styles['PatternHeader']))
    elements.append(Paragraph("<b>WEEK 1:</b> You forget to track. Normal. You catch pattern AFTER it runs. Success: Recognizing activation within 1-2 minutes.", styles['BodyText']))
    elements.append(Paragraph("<b>WEEK 2:</b> Recognition speed increases. Catch it within 30 seconds. You start feeling body signature BEFORE automatic behavior executes.", styles['BodyText']))
    elements.append(Paragraph("<b>WEEK 3:</b> Pattern recognition becomes automatic. Body sensation = instant recognition. Success: Identify pattern within 10 seconds. Ready for interruption phase.", styles['BodyText']))
    
    elements.append(PageBreak())
    
    elements.append(Paragraph("WEEKS 4-5: PAUSE PHASE", styles['SubsectionHeader']))
    elements.append(Paragraph("<b>OBJECTIVE:</b> Create a gap between trigger and behavior.", styles['BodyText']))
    elements.append(Paragraph("<b>THE WORK:</b> When pattern activates, PAUSE for 10 seconds. Just pause. Don't do anything else. Count to 10. Breathe. Then track.", styles['BodyText']))
    elements.append(Paragraph("<b>WHY:</b> Patterns run automatically: Trigger → Sensation → Thought → Behavior (3-7 seconds total). You need to slow that down. The pause creates space.", styles['BodyText']))
    elements.append(Paragraph("<b>SUCCESS CRITERIA:</b> 30% of activations include a 10-second pause.", styles['TealHighlight']))
    elements.append(Spacer(1, 0.2*inch))
    
    elements.append(Paragraph("THE 10-SECOND PAUSE", styles['PatternHeader']))
    elements.append(Paragraph("1. STOP whatever you're about to do", styles['BulletItem']))
    elements.append(Paragraph("2. COUNT to 10 (out loud or in head)", styles['BulletItem']))
    elements.append(Paragraph("3. BREATHE (doesn't have to be deep)", styles['BulletItem']))
    elements.append(Paragraph("4. THEN decide what to do", styles['BulletItem']))
    elements.append(Paragraph("The goal is NOT to stop the pattern yet. The goal is to CREATE A GAP.", styles['TealHighlight']))
    elements.append(Spacer(1, 0.2*inch))
    
    elements.append(Paragraph("<b>WEEK 4:</b> Pause feels impossible. Pattern runs too fast. Success: Pause BEFORE automatic behavior 20% of the time.", styles['BodyText']))
    elements.append(Paragraph("<b>WEEK 5:</b> Pause becomes slightly easier. 30-40% of activations include a pause. Success: Pause happening 30%+. Ready for circuit break.", styles['BodyText']))
    
    elements.append(PageBreak())
    
    elements.append(Paragraph("WEEKS 6-8: CIRCUIT BREAK PHASE", styles['SubsectionHeader']))
    elements.append(Paragraph("<b>OBJECTIVE:</b> Add verbal interruption statement.", styles['BodyText']))
    elements.append(Paragraph("<b>THE WORK:</b> When pattern activates: Pause AND say circuit break statement. Out loud or in your head. THEN track.", styles['BodyText']))
    elements.append(Paragraph("<b>SUCCESS CRITERIA:</b> 40% of activations include circuit break statement.", styles['TealHighlight']))
    elements.append(Spacer(1, 0.2*inch))
    
    elements.append(Paragraph("CIRCUIT BREAK STATEMENTS", styles['PatternHeader']))
    
    circuit_breaks = [
        ("DISAPPEARING:", "\"The Disappearing Pattern just activated. I feel [chest tightness/panic/urge to flee]. The program wants me to pull away. I am choosing to stay and communicate instead.\""),
        ("APOLOGY LOOP:", "\"I'm about to apologize for [existing/asking/needing]. I have done nothing wrong. I am replacing 'sorry' with 'thank you.'\""),
        ("TESTING:", "\"The Testing Pattern activated. I want to test if they really care. I am not creating a test. I am asking directly instead.\""),
        ("ATTRACTION TO HARM:", "\"I feel chemistry with this person. Let me check: are they safe or familiar? This is pattern recognition, not love. I am choosing not to pursue.\""),
        ("COMPLIMENT DEFLECTION:", "\"Someone just complimented me. I want to deflect. I am saying only: Thank you. No deflection. No minimization.\""),
        ("DRAINING BOND:", "\"I know I should leave this [relationship/job/situation]. I'm staying out of pattern, not love or necessity. Leaving is self-preservation, not betrayal.\""),
        ("SUCCESS SABOTAGE:", "\"I'm approaching [milestone/success]. Success Sabotage is activating. This is the pattern, not reality. I am allowed to succeed. I am continuing forward.\"")
    ]
    
    for pattern, script in circuit_breaks:
        elements.append(Paragraph(f"<b>{pattern}</b>", styles['BodyText']))
        elements.append(Paragraph(script, styles['ScriptText']))
    
    elements.append(PageBreak())
    
    elements.append(Paragraph("WEEKS 9-12: REWRITE PHASE", styles['SubsectionHeader']))
    elements.append(Paragraph("<b>OBJECTIVE:</b> Execute new behavior more often than automatic behavior.", styles['BodyText']))
    elements.append(Paragraph("<b>THE WORK:</b> Pause + Circuit Break + NEW BEHAVIOR. The new behavior is the Rewrite.", styles['BodyText']))
    elements.append(Paragraph("<b>SUCCESS CRITERIA:</b> Execute Rewrite more often than you execute automatic behavior. 51%+.", styles['TealHighlight']))
    elements.append(Spacer(1, 0.2*inch))
    
    elements.append(Paragraph("REWRITES BY PATTERN", styles['PatternHeader']))
    
    rewrites = [
        ("DISAPPEARING PATTERN", "Automatic: Pulling away, creating distance, canceling plans", "Rewrite: Stay. Communicate fear instead of disappearing.", "Partner says \"I love you\" → Pattern activates → Pause + Circuit break → Stay in the moment → Say: \"I love you too. And I'm scared. This is new for me. Can we go slow?\""),
        ("APOLOGY LOOP", "Automatic: \"Sorry to bother you, but...\"", "Rewrite: \"Thank you for your time. Can you help me with X?\"", "Need to ask boss for help → Pattern activates → Pause + Circuit break → Replace \"sorry\" with \"thank you\" → Say: \"Thank you for making time. I need help with [specific thing].\""),
        ("TESTING PATTERN", "Automatic: Creating test (picking fight, pushing away)", "Rewrite: Ask directly for reassurance.", "Partner takes 3 hours to text back → Pattern activates → Pause + Circuit break → Don't create test → Say: \"I noticed you took a while to respond and I felt scared. Can you reassure me you're still here?\""),
        ("COMPLIMENT DEFLECTION", "Automatic: Deflecting (\"Oh, it was nothing\" / self-deprecating joke)", "Rewrite: Say \"Thank you\" only.", "Boss: \"Great work on that project\" → Pattern activates → Pause + Circuit break → Say: \"Thank you.\" → Say nothing else. No deflection. No minimization."),
        ("SUCCESS SABOTAGE", "Automatic: Quitting before success, creating crisis, self-destructing", "Rewrite: Continue forward despite panic.", "Approaching promotion/milestone → Pattern activates → Pause + Circuit break → Do the next right thing anyway → Don't quit. Don't sabotage. Keep going.")
    ]
    
    for name, auto, rewrite, example in rewrites:
        elements.append(Paragraph(name, styles['SubsectionHeader']))
        elements.append(Paragraph(auto, styles['BodyText']))
        elements.append(Paragraph(rewrite, styles['TealHighlight']))
        elements.append(Paragraph(f"<b>Example:</b> {example}", styles['BodyText']))
        elements.append(Spacer(1, 0.15*inch))
    
    elements.append(PageBreak())
    
    elements.append(Paragraph("DAY 90: WHAT TO EXPECT", styles['SubsectionHeader']))
    elements.append(Paragraph("The pattern is not dead. It's weakened.", styles['BodyText']))
    elements.append(Paragraph("<b>What \"weakened\" means:</b>", styles['BodyText']))
    elements.append(Paragraph("• Activates 50-70% less frequently", styles['BulletItem']))
    elements.append(Paragraph("• When it activates, intensity is lower", styles['BulletItem']))
    elements.append(Paragraph("• You catch it faster", styles['BulletItem']))
    elements.append(Paragraph("• You interrupt it more often than you execute it", styles['BulletItem']))
    elements.append(Paragraph("• It no longer controls your life", styles['BulletItem']))
    elements.append(Spacer(1, 0.15*inch))
    elements.append(Paragraph("Pattern interruption is not pattern elimination. It's pattern management.", styles['TealHighlight']))
    elements.append(Paragraph("You're learning to interrupt code that's been running 10, 20, 30+ years. 90 days weakens it significantly. Continue the work. It gets easier.", styles['BodyText']))
    
    elements.append(PageBreak())
    return elements


def build_circuit_break_library(styles):
    """Build Section 3: Circuit Break Library"""
    elements = []
    
    elements.append(Paragraph("SECTION 3: CIRCUIT BREAK LIBRARY", styles['SectionHeader']))
    elements.append(Spacer(1, 0.15*inch))
    elements.append(Paragraph("PRE-WRITTEN SCRIPTS FOR ALL 7 PATTERNS", styles['SubsectionHeader']))
    elements.append(Paragraph("Copy these. Paste them in your phone. Say them verbatim when pattern activates.", styles['BodyItalic']))
    elements.append(Spacer(1, 0.2*inch))
    
    elements.append(Paragraph("DISAPPEARING PATTERN SCRIPTS", styles['SubsectionHeader']))
    
    elements.append(Paragraph("<b>SCRIPT 1: FOR ROMANTIC PARTNERS</b>", styles['BodyText']))
    elements.append(Paragraph(
        "\"I need to tell you something. When we get close—like when you say 'I love you' or we make future plans—I feel panic. This is my Disappearing Pattern. It installed when I was younger and intimacy led to abandonment. It makes me want to pull away even though you're safe. I'm working on interrupting it. If you notice me creating distance, you can say 'Is the pattern running?' That helps me catch it. I'm not leaving. I'm just scared.\"",
        styles['ScriptText']
    ))
    
    elements.append(Paragraph("<b>SCRIPT 2: MID-ACTIVATION</b>", styles['BodyText']))
    elements.append(Paragraph(
        "\"I'm feeling my pattern right now. I want to cancel our plans / pull away / create distance. This is the Disappearing Pattern, not reality. You haven't done anything wrong. Can I have 10 minutes alone to regulate? I'll come back.\"",
        styles['ScriptText']
    ))
    elements.append(Paragraph("(Then actually come back in 10 minutes.)", styles['BodyItalic']))
    
    elements.append(Paragraph("<b>SCRIPT 3: AFTER YOU'VE DISAPPEARED</b>", styles['BodyText']))
    elements.append(Paragraph(
        "\"I disappeared on you. That was my pattern running. I pulled away because intimacy triggered my nervous system, not because you did anything wrong. I'm sorry for the confusion and hurt this caused. I'm working on catching this earlier. Next time, I'll tell you when I'm feeling the urge to disappear instead of just doing it.\"",
        styles['ScriptText']
    ))
    
    elements.append(Spacer(1, 0.2*inch))
    elements.append(Paragraph("APOLOGY LOOP SCRIPTS", styles['SubsectionHeader']))
    
    elements.append(Paragraph("<b>SCRIPT 1: REPLACING \"SORRY\" WITH \"THANK YOU\"</b>", styles['BodyText']))
    elements.append(Paragraph("Instead of: \"Sorry to bother you...\" → Say: \"Thank you for your time...\"", styles['BulletItem']))
    elements.append(Paragraph("Instead of: \"Sorry for needing help...\" → Say: \"Thank you for helping me with this...\"", styles['BulletItem']))
    elements.append(Paragraph("Instead of: \"Sorry I'm so needy...\" → Say: \"Thank you for being patient with me...\"", styles['BulletItem']))
    
    elements.append(Paragraph("<b>SCRIPT 2: WHEN ASKING FOR WHAT YOU NEED</b>", styles['BodyText']))
    elements.append(Paragraph(
        "\"I need [specific thing]. This is hard for me to ask because my pattern makes me feel like a burden. But I'm working on stating my needs without apologizing. Can you [specific request]?\"",
        styles['ScriptText']
    ))
    
    elements.append(Spacer(1, 0.2*inch))
    elements.append(Paragraph("TESTING PATTERN SCRIPTS", styles['SubsectionHeader']))
    
    elements.append(Paragraph("<b>SCRIPT 1: INSTEAD OF CREATING A TEST</b>", styles['BodyText']))
    elements.append(Paragraph(
        "\"I'm feeling insecure right now. My pattern wants me to test if you really care by [pushing you away / picking a fight / creating drama]. I'm not doing that. Instead, I'm asking directly: Are you still here? Are we okay?\"",
        styles['ScriptText']
    ))
    
    elements.append(Paragraph("<b>SCRIPT 2: WHEN YOU'VE ALREADY CREATED A TEST</b>", styles['BodyText']))
    elements.append(Paragraph(
        "\"I just tested you. I [picked that fight / pushed you away / said something harsh] because my Testing Pattern activated. I was scared you were going to leave, so I tested if you'd stay through conflict. This wasn't fair to you. You've shown me you're consistent. I'm working on trusting that without creating tests.\"",
        styles['ScriptText']
    ))
    
    elements.append(PageBreak())
    
    elements.append(Paragraph("COMPLIMENT DEFLECTION SCRIPTS", styles['SubsectionHeader']))
    
    elements.append(Paragraph("<b>SCRIPT 1: WHEN COMPLIMENTED</b>", styles['BodyText']))
    elements.append(Paragraph("\"Great work on that project.\" → \"Thank you.\" (Stop there. Say nothing else.)", styles['BulletItem']))
    elements.append(Paragraph("\"You're so talented.\" → \"Thank you.\" (No deflection. No joke.)", styles['BulletItem']))
    elements.append(Paragraph("\"I'm proud of you.\" → \"Thank you.\" (Just accept it.)", styles['BulletItem']))
    
    elements.append(Paragraph("<b>SCRIPT 2: IN PERFORMANCE REVIEWS / SALARY NEGOTIATIONS</b>", styles['BodyText']))
    elements.append(Paragraph(
        "\"Thank you for the feedback. I'd like to discuss a raise based on my performance. Specifically: [List 3-5 achievements without minimizing them]. Based on this and market rates, I'm requesting [specific number].\"",
        styles['ScriptText']
    ))
    
    elements.append(Spacer(1, 0.2*inch))
    elements.append(Paragraph("SUCCESS SABOTAGE SCRIPTS", styles['SubsectionHeader']))
    
    elements.append(Paragraph("<b>SCRIPT 1: WHEN APPROACHING MILESTONE</b>", styles['BodyText']))
    elements.append(Paragraph(
        "\"I'm at [90 days sober / promotion approaching / relationship going well]. I feel [panic / dread / 'something bad is coming']. This is Success Sabotage. The pattern wants me to destroy this before external disaster does. But there is no disaster coming. This is safe. I'm allowed to succeed. I'm continuing forward.\"",
        styles['ScriptText']
    ))
    
    elements.append(Paragraph("<b>SCRIPT 2: WHEN YOU WANT TO QUIT</b>", styles['BodyText']))
    elements.append(Paragraph(
        "\"I want to quit right now. I want to blow this up. I want to self-destruct. This is the pattern activating at the exact moment of potential breakthrough. I'm not quitting. I'm calling my support person. I'm waiting 48 hours before making any decision.\"",
        styles['ScriptText']
    ))
    
    elements.append(PageBreak())
    return elements


def build_original_room(styles):
    """Build Section 4: Original Room Excavation"""
    elements = []
    
    elements.append(Paragraph("SECTION 4: ORIGINAL ROOM EXCAVATION", styles['SectionHeader']))
    elements.append(Spacer(1, 0.15*inch))
    
    elements.append(Paragraph("FINDING WHERE YOUR PATTERN WAS INSTALLED", styles['SubsectionHeader']))
    elements.append(Paragraph(
        "Every pattern has an origin point—the Original Room where it was installed. Usually childhood. Sometimes adulthood from severe trauma.",
        styles['BodyText']
    ))
    elements.append(Spacer(1, 0.15*inch))
    
    elements.append(Paragraph("WHY THIS MATTERS", styles['PatternHeader']))
    elements.append(Paragraph("Understanding origin helps you:", styles['BodyText']))
    elements.append(Paragraph("1. See it's not random—it made sense at the time", styles['BulletItem']))
    elements.append(Paragraph("2. Differentiate THEN (when pattern was necessary) from NOW (when it's not)", styles['BulletItem']))
    elements.append(Paragraph("3. Thank the pattern for protecting you when you had no other options", styles['BulletItem']))
    elements.append(Paragraph("4. Release its function (you have other tools now)", styles['BulletItem']))
    elements.append(Paragraph("You don't need to process the Original Room. You don't need to heal from it. You just need to know it exists.", styles['TealHighlight']))
    elements.append(Spacer(1, 0.2*inch))
    
    elements.append(Paragraph("THE EXCAVATION PROCESS", styles['SubsectionHeader']))
    
    elements.append(Paragraph("<b>STEP 1: NAME THE BEHAVIOR</b>", styles['BodyText']))
    elements.append(Paragraph("What does your pattern make you do?", styles['BodyText']))
    elements.append(Paragraph("Example (Disappearing): \"When someone gets close, I pull away without explanation\"", styles['ScriptText']))
    elements.append(Paragraph("YOUR ANSWER: _________________________________________________", styles['FormField']))
    elements.append(Spacer(1, 0.15*inch))
    
    elements.append(Paragraph("<b>STEP 2: IDENTIFY THE BODY SIGNATURE</b>", styles['BodyText']))
    elements.append(Paragraph("What physical sensation happens RIGHT BEFORE the automatic behavior?", styles['BodyText']))
    elements.append(Paragraph("Example: Chest tightness, urge to flee, throat closing", styles['ScriptText']))
    elements.append(Paragraph("YOUR ANSWER: _________________________________________________", styles['FormField']))
    elements.append(Spacer(1, 0.15*inch))
    
    elements.append(Paragraph("<b>STEP 3: FIND THE ORIGINAL ROOM</b>", styles['BodyText']))
    elements.append(Paragraph("Close your eyes. Remember the FIRST TIME you felt this exact body signature + automatic thought combination.", styles['BodyText']))
    elements.append(Paragraph("• How old were you?", styles['BulletItem']))
    elements.append(Paragraph("• Where were you?", styles['BulletItem']))
    elements.append(Paragraph("• Who was there?", styles['BulletItem']))
    elements.append(Paragraph("• What was happening?", styles['BulletItem']))
    elements.append(Paragraph("• What did you need that you didn't get?", styles['BulletItem']))
    elements.append(Spacer(1, 0.15*inch))
    
    elements.append(Paragraph("<b>STEP 4: UNDERSTAND THE SURVIVAL LOGIC</b>", styles['BodyText']))
    elements.append(Paragraph("In that Original Room, what would have happened if you DIDN'T develop this pattern?", styles['BodyText']))
    elements.append(Paragraph("The pattern's job: Protect you from a threat you had no other way to handle.", styles['TealHighlight']))
    elements.append(Paragraph("YOUR ANSWER: _________________________________________________", styles['FormField']))
    elements.append(Spacer(1, 0.15*inch))
    
    elements.append(Paragraph("<b>STEP 5: WRITE THE ACKNOWLEDGMENT LETTER</b>", styles['BodyText']))
    elements.append(Paragraph(
        "\"Dear [Pattern Name], You were installed when I was [age] during [event/situation]. At that time, you protected me from [threat]. If you hadn't existed, I would have [consequence]. Thank you for keeping me safe when I had no other options. I'm [current age] now. The threat that created you no longer exists. I have [resources/skills/support] now that I didn't have then. I don't need you to protect me the same way anymore. I'm working on interrupting you. This doesn't mean you were wrong. It means circumstances have changed. Thank you for your service. I'm taking it from here.\"",
        styles['ScriptText']
    ))
    
    elements.append(PageBreak())
    return elements


def build_tracking_instructions(styles):
    """Build Section 5: Tracking Instructions"""
    elements = []
    
    elements.append(Paragraph("SECTION 5: TRACKING INSTRUCTIONS", styles['SectionHeader']))
    elements.append(Spacer(1, 0.15*inch))
    
    elements.append(Paragraph("THE 4 ESSENTIAL DATA POINTS", styles['SubsectionHeader']))
    
    elements.append(Paragraph("<b>1. TRIGGER</b> - What happened right before pattern activated. Be specific:", styles['BodyText']))
    elements.append(Paragraph("✗ \"Partner was distant\" → ✓ \"Partner took 3 hours to text back\"", styles['BulletItem']))
    
    elements.append(Paragraph("<b>2. BODY SIGNATURE</b> - Physical feeling before automatic behavior:", styles['BodyText']))
    elements.append(Paragraph("Chest tightness, Stomach drop, Throat closing, Heart racing, Nausea, Hypervigilance, Shakiness, Dread", styles['BulletItem']))
    
    elements.append(Paragraph("<b>3. AUTOMATIC THOUGHT</b> - The story your pattern tells:", styles['BodyText']))
    elements.append(Paragraph("\"This is too much\", \"I'm a burden\", \"They're going to leave\", \"They don't mean it\", \"I can't abandon them\", \"I don't deserve this\"", styles['BulletItem']))
    
    elements.append(Paragraph("<b>4. BEHAVIOR</b> - What you did:", styles['BodyText']))
    elements.append(Paragraph("AUTO = Executed automatic behavior | REWRITE = Interrupted successfully", styles['TealHighlight']))
    elements.append(Spacer(1, 0.2*inch))
    
    elements.append(Paragraph("HOW TO TRACK", styles['SubsectionHeader']))
    
    methods = [
        ("METHOD 1: PHONE NOTES", "Date: 12/6 | Trigger: Partner said ILY | Body: Chest tight | Thought: Too much | Behavior: AUTO (pulled away)", "Pro: Always available, fast, private | Con: Easy to forget"),
        ("METHOD 2: VOICE MEMOS", "\"Okay, pattern activated. Partner just said they love me, I felt chest tightness, thought 'this is too much,' and I pulled away. That's AUTO. Moving on.\"", "Pro: Fastest method, no writing | Con: Need to transcribe later if you want data"),
        ("METHOD 3: PRINTABLE TRACKER", "Paper template you can print. See bonus download.", "Pro: Tactile, satisfying to fill in | Con: Have to carry it, can lose it"),
        ("METHOD 4: SPREADSHEET", "Columns: Date, Trigger, Body, Thought, Behavior (AUTO/REWRITE), Notes", "Pro: Trackable metrics, graphs possible | Con: More complex, not fast")
    ]
    
    for method, example, pros_cons in methods:
        elements.append(Paragraph(f"<b>{method}</b>", styles['BodyText']))
        elements.append(Paragraph(example, styles['ScriptText']))
        elements.append(Paragraph(pros_cons, styles['BulletItem']))
        elements.append(Spacer(1, 0.1*inch))
    
    elements.append(Spacer(1, 0.15*inch))
    elements.append(Paragraph("TRACKING TIPS", styles['SubsectionHeader']))
    elements.append(Paragraph("<b>Missed a day?</b> Start again next day. Don't spiral.", styles['BodyText']))
    elements.append(Paragraph("<b>When to stop daily tracking?</b> 90 days is the protocol. After that, switch to weekly reviews.", styles['BodyText']))
    elements.append(Paragraph("<b>For ADHD:</b> Use voice memos (easiest), Track weekly instead of daily, Have accountability partner text you daily: \"Did you track today?\"", styles['BodyText']))
    elements.append(Paragraph("<b>Minimum tracking goals:</b> Week 1: 3-4 days | Week 2: 5-6 days | Week 3-12: 6-7 days per week", styles['TealHighlight']))
    elements.append(Paragraph("Missing days is normal. Quitting forever is failure. Keep starting again.", styles['TealHighlight']))
    
    elements.append(PageBreak())
    return elements


def build_crisis_protocols(styles):
    """Build Section 6: Crisis Protocols"""
    elements = []
    
    elements.append(Paragraph("SECTION 6: CRISIS PROTOCOLS", styles['SectionHeader']))
    elements.append(Spacer(1, 0.15*inch))
    elements.append(Paragraph("WHAT TO DO WHEN PATTERN CAUSES MAJOR DAMAGE", styles['SubsectionHeader']))
    elements.append(Spacer(1, 0.15*inch))
    
    elements.append(Paragraph("CRISIS PROTOCOL 1: 5-MINUTE EMERGENCY INTERRUPT", styles['SubsectionHeader']))
    elements.append(Paragraph("<b>USE WHEN:</b> Pattern activated, you're spiraling, can't think clearly. <b>TIME:</b> 5 minutes", styles['BodyText']))
    
    steps = [
        ("STEP 1: STOP EVERYTHING (60 SECONDS)", "Set timer for 60 seconds. Do nothing. Move to different location if possible. Just exist for 60 seconds."),
        ("STEP 2: NAME THE PATTERN (30 SECONDS)", "Say out loud or write down: \"The [pattern name] just activated.\" Don't know which pattern? Just say: \"A pattern just activated.\""),
        ("STEP 3: IDENTIFY THE DAMAGE (60 SECONDS)", "Write one sentence: \"What I just did:\" _______________ \"The damage is:\" _______________"),
        ("STEP 4: DELAY FURTHER DAMAGE", "Set timer for 2 hours. I will not make this worse for 2 hours. No more texts. No more calls. No more decisions. No more automatic behaviors. Just 2 hours of pause."),
        ("STEP 5: EMERGENCY CONTACT (90 SECONDS)", "Text or call ONE person: \"My [pattern] just ran. I did [behavior]. I'm using emergency protocol. I need to not be alone for 2 hours. Can you talk/text with me?\" No support person? Text Crisis Text Line: HOME to 741741")
    ]
    
    for step, desc in steps:
        elements.append(Paragraph(f"<b>{step}</b>", styles['BodyText']))
        elements.append(Paragraph(desc, styles['BulletItem']))
    
    elements.append(Spacer(1, 0.2*inch))
    
    elements.append(Paragraph("CRISIS PROTOCOL 2: SUICIDAL IDEATION FROM PATTERN ACTIVATION", styles['SubsectionHeader']))
    elements.append(Paragraph("<b>WARNING:</b> If you have plan and means, call 988 or 911 NOW. Don't use this protocol.", styles['PinkHighlight']))
    elements.append(Paragraph("<b>USE WHEN:</b> Passive suicidal thoughts triggered by pattern damage (\"I want to die because I ruined everything again\")", styles['BodyText']))
    elements.append(Spacer(1, 0.1*inch))
    
    elements.append(Paragraph("When pattern causes major damage, your brain says: \"I did it again. I'll never change. Everyone would be better off without me.\" The pattern WANTS you to believe you're unfixable. Suicidal ideation after pattern activation = pattern's last-ditch effort to avoid interruption.", styles['BodyText']))
    elements.append(Spacer(1, 0.1*inch))
    
    elements.append(Paragraph("<b>STEP 1: NAME IT</b> - \"I'm having suicidal thoughts because my pattern just ran. This is not evidence I should die. This is the pattern trying to protect itself.\"", styles['BodyText']))
    elements.append(Paragraph("<b>STEP 2: DELAY THE DECISION</b> - \"I don't have to decide about dying right now. I can choose to die tomorrow. But not today. Just 24 hours.\" Set timer for 24 hours.", styles['BodyText']))
    elements.append(Paragraph("<b>STEP 3: CALL SUPPORT</b> - 988 (Suicide & Crisis Lifeline) or text HOME to 741741 (Crisis Text Line)", styles['TealHighlight']))
    elements.append(Paragraph("<b>STEP 4: PHYSICAL INTERRUPT</b> - 50 jumping jacks, Cold shower (60 seconds), Hold ice in hands until it melts, Run around the block. Physical intensity interrupts thought spiral.", styles['BodyText']))
    
    elements.append(PageBreak())
    
    elements.append(Paragraph("CRISIS PROTOCOL 3: RELATIONSHIP DESTRUCTION EMERGENCY", styles['SubsectionHeader']))
    elements.append(Paragraph("<b>USE WHEN:</b> Pattern just destroyed a relationship (or is about to)", styles['BodyText']))
    
    elements.append(Paragraph("<b>IF IT JUST HAPPENED:</b>", styles['PatternHeader']))
    elements.append(Paragraph("1. STOP TALKING - Do not try to explain while dysregulated. You will make it worse.", styles['BulletItem']))
    elements.append(Paragraph("2. REQUEST TIME - \"I need [X hours] to calm down and think clearly. I'm not abandoning this conversation. I will reach out at [specific time]. I'm sorry for [specific behavior you did].\" Then actually follow through.", styles['BulletItem']))
    elements.append(Paragraph("3. REGULATE - 5-4-3-2-1 grounding: 5 things you see, 4 things you can touch, 3 things you hear, 2 things you smell, 1 thing you taste. Repeat until you can think clearly.", styles['BulletItem']))
    elements.append(Paragraph("4. DOCUMENT - Which pattern ran? What was trigger? What did I do automatically? What damage did it cause?", styles['BulletItem']))
    elements.append(Paragraph("5. REPAIR LATER - You will repair this. But not right now. When you're calm (6-24 hours later), use repair script from Section 7.", styles['BulletItem']))
    
    elements.append(Paragraph("<b>IF IT'S ABOUT TO HAPPEN:</b>", styles['PatternHeader']))
    elements.append(Paragraph(
        "Say out loud to your partner: \"I need to tell you something. My pattern is activating right now. I feel [physical sensation]. The pattern wants me to [automatic behavior]. I don't want to do that. Can I take 10 minutes and come back?\" Then leave room. Set timer for 10 minutes. Regulate. Return.",
        styles['ScriptText']
    ))
    
    elements.append(Spacer(1, 0.2*inch))
    
    elements.append(Paragraph("EMERGENCY CONTACTS", styles['SubsectionHeader']))
    elements.append(Paragraph("<b>Suicide & Crisis Lifeline:</b> 988", styles['TealHighlight']))
    elements.append(Paragraph("<b>Crisis Text Line:</b> Text HOME to 741741", styles['TealHighlight']))
    elements.append(Spacer(1, 0.1*inch))
    elements.append(Paragraph("My Support Person: Name: _______________ Phone: _______________", styles['FormField']))
    elements.append(Paragraph("My Therapist/Sponsor: Name: _______________ Phone: _______________", styles['FormField']))
    elements.append(Paragraph("Backup Contact: Name: _______________ Phone: _______________", styles['FormField']))
    
    elements.append(PageBreak())
    return elements


def build_relationship_scripts(styles):
    """Build Section 7: Relationship Communication Scripts"""
    elements = []
    
    elements.append(Paragraph("SECTION 7: RELATIONSHIP COMMUNICATION SCRIPTS", styles['SectionHeader']))
    elements.append(Spacer(1, 0.15*inch))
    elements.append(Paragraph("HOW TO TALK ABOUT YOUR PATTERNS", styles['SubsectionHeader']))
    elements.append(Spacer(1, 0.15*inch))
    
    elements.append(Paragraph("SCRIPT 1: TELLING A PARTNER ABOUT YOUR PATTERN (FIRST TIME)", styles['SubsectionHeader']))
    elements.append(Paragraph("<b>When to use:</b> Early in relationship, things getting serious.", styles['BodyText']))
    elements.append(Paragraph(
        "\"I want to talk to you about something important. It's about how I sometimes react in relationships. I run a pattern called [pattern name]. What that means is: when [trigger], I automatically [behavior]. This pattern was installed when I was younger during [brief Original Room—only if you want to share]. At that time, it kept me safe by [survival logic]. This pattern is not about you. You're safe and you've shown me that. But my nervous system doesn't know that yet. Sometimes it will react as if you're [childhood threat], even though you're not. When this pattern runs, it might look like: [specific behaviors they'll see]. What would help me: if you notice me [pattern behavior], you can say '[specific phrase like \"Is the pattern running?\"]' and that helps me recognize it. Then I can tell you what I'm feeling instead of just doing the automatic behavior. I'm working on interrupting this. It will happen less over time. I just wanted you to know what you might see and that it's not about you.\"",
        styles['ScriptText']
    ))
    
    elements.append(Spacer(1, 0.2*inch))
    elements.append(Paragraph("SCRIPT 2: REPAIR AFTER PATTERN DAMAGED RELATIONSHIP", styles['SubsectionHeader']))
    elements.append(Paragraph("<b>When to use:</b> Pattern ran, hurt partner, need to repair.", styles['BodyText']))
    elements.append(Paragraph(
        "\"I need to talk about what happened. I [specific behavior—disappeared/tested you/picked fight/etc.]. That hurt you and damaged your trust in me. This was my [pattern name]. When [trigger happened], my nervous system interpreted it as [threat], even though you're safe. Instead of communicating that, I [automatic behavior]. I should have told you what I was feeling. That's on me. I'm responsible for managing my pattern, even though it runs automatically. I'm working on interrupting this pattern. Specifically, next time [trigger] happens, I will [specific circuit break/Rewrite]. To repair the damage, I will [specific action if appropriate]. Is there anything else you need from me?\"",
        styles['ScriptText']
    ))
    
    elements.append(Spacer(1, 0.2*inch))
    elements.append(Paragraph("SCRIPT 3: MID-ACTIVATION (PREVENTING DAMAGE)", styles['SubsectionHeader']))
    elements.append(Paragraph("<b>When to use:</b> Pattern activating RIGHT NOW, want to interrupt before damage.", styles['BodyText']))
    elements.append(Paragraph(
        "\"I need to pause this conversation. My [pattern] is activating. I feel [body sensation—chest tight/panic/etc.]. The pattern wants me to [automatic behavior—pull away/pick fight/test you/etc.]. I don't want to do that. Can I have [10 minutes/an hour] to regulate? I'll come back and we can finish this conversation. I'm not abandoning it.\" (Then actually come back in specified time.)",
        styles['ScriptText']
    ))
    
    elements.append(PageBreak())
    
    elements.append(Paragraph("SCRIPT 5: WHEN PARTNER IS UNSAFE (WEAPONIZING YOUR PATTERN)", styles['SubsectionHeader']))
    elements.append(Paragraph("<b>When to use:</b> Partner uses your pattern against you, mocks it, or triggers it intentionally.", styles['BodyText']))
    elements.append(Paragraph("<b>Red flags:</b>", styles['BodyText']))
    elements.append(Paragraph("• \"You're just running your pattern\" (dismissing legitimate concerns)", styles['BulletItem']))
    elements.append(Paragraph("• Mocking your vulnerability", styles['BulletItem']))
    elements.append(Paragraph("• Intentionally triggering pattern", styles['BulletItem']))
    elements.append(Paragraph("• Using pattern knowledge to manipulate you", styles['BulletItem']))
    elements.append(Paragraph(
        "\"I shared my pattern with you so you could understand me better, not so you could use it against me. When you [specific behavior—mock it/dismiss my concerns by blaming pattern/trigger it intentionally], that's abuse. A safe partner supports my growth. An unsafe partner weaponizes my wounds. This needs to stop immediately, or I need to reconsider if this relationship is safe for me to do pattern work in.\"",
        styles['ScriptText']
    ))
    
    elements.append(Spacer(1, 0.2*inch))
    elements.append(Paragraph("SCRIPT 8: ASKING FOR PATIENCE DURING 90-DAY PROTOCOL", styles['SubsectionHeader']))
    elements.append(Paragraph("<b>When to use:</b> Beginning protocol, want partner to know this is temporary intensity.", styles['BodyText']))
    elements.append(Paragraph(
        "\"I'm starting a 90-day pattern interruption protocol. For the next 90 days, I'm going to be tracking my [pattern] and working on interrupting it. You might notice me: Pausing mid-conversation, Asking for reassurance more than usual, Naming my pattern out loud, Seeming more self-aware of my reactions. This is me doing the work. It will be intense for 90 days, then it gets easier. I'd appreciate your patience while I work through this.\"",
        styles['ScriptText']
    ))
    
    elements.append(PageBreak())
    return elements


def build_conclusion(styles):
    """Build the Conclusion section"""
    elements = []
    
    elements.append(Paragraph("CONCLUSION: WHAT HAPPENS AFTER 90 DAYS", styles['SectionHeader']))
    elements.append(Spacer(1, 0.15*inch))
    
    elements.append(Paragraph("The pattern is weaker. It still exists.", styles['BodyText']))
    elements.append(Spacer(1, 0.15*inch))
    
    elements.append(Paragraph("YOUR OPTIONS AFTER 90 DAYS", styles['SubsectionHeader']))
    
    elements.append(Paragraph("<b>OPTION 1: CONTINUE 90 MORE DAYS (SAME PATTERN)</b>", styles['BodyText']))
    elements.append(Paragraph("• Deepen the work on same pattern", styles['BulletItem']))
    elements.append(Paragraph("• Get to 80-90% interruption rate", styles['BulletItem']))
    elements.append(Paragraph("• Strengthen the Rewrite", styles['BulletItem']))
    
    elements.append(Paragraph("<b>OPTION 2: MAINTENANCE MODE</b>", styles['BodyText']))
    elements.append(Paragraph("• Track weekly instead of daily", styles['BulletItem']))
    elements.append(Paragraph("• Monthly check-ins", styles['BulletItem']))
    elements.append(Paragraph("• Pattern still activates occasionally but manageable", styles['BulletItem']))
    
    elements.append(Paragraph("<b>OPTION 3: START NEW PATTERN</b>", styles['BodyText']))
    elements.append(Paragraph("• Use same 90-Day Protocol", styles['BulletItem']))
    elements.append(Paragraph("• Apply what you learned from first pattern", styles['BulletItem']))
    
    elements.append(Paragraph("<b>OPTION 4: COMBO</b>", styles['BodyText']))
    elements.append(Paragraph("• Maintenance on primary", styles['BulletItem']))
    elements.append(Paragraph("• Start work on secondary", styles['BulletItem']))
    elements.append(Paragraph("• Deepen as needed", styles['BulletItem']))
    
    elements.append(Spacer(1, 0.2*inch))
    
    elements.append(Paragraph("MAINTENANCE MODE (After 90 Days)", styles['SubsectionHeader']))
    elements.append(Paragraph("<b>WEEKLY CHECK-IN:</b> How many times did pattern activate? How many successful Rewrites? Any new triggers identified? Adjustments needed?", styles['BodyText']))
    elements.append(Paragraph("<b>MONTHLY REVIEW:</b> Compare to 30 days ago. Overall trajectory? Pattern intensity changes? Life improvements?", styles['BodyText']))
    
    elements.append(Spacer(1, 0.2*inch))
    
    elements.append(Paragraph("WHEN PATTERNS REACTIVATE AFTER MONTHS/YEARS", styles['SubsectionHeader']))
    elements.append(Paragraph("It happens. Extreme stress, anniversary of trauma, new relationship that mirrors childhood—pattern can reactivate after being dormant.", styles['BodyText']))
    elements.append(Paragraph("<b>What to do:</b>", styles['BodyText']))
    elements.append(Paragraph("1. \"Oh, [pattern] is back.\"", styles['BulletItem']))
    elements.append(Paragraph("2. \"I've interrupted this before. I can do it again.\"", styles['BulletItem']))
    elements.append(Paragraph("3. Return to basics: Same circuit breaks that worked before", styles['BulletItem']))
    elements.append(Paragraph("4. Adjust as needed: You're different now. Update Rewrites.", styles['BulletItem']))
    
    elements.append(Spacer(1, 0.3*inch))
    
    elements.append(Paragraph("FINAL WORDS", styles['SubsectionHeader']))
    elements.append(Paragraph("The goal is not pattern elimination. The goal is pattern management.", styles['TealHighlight']))
    elements.append(Paragraph("Weak enough is good enough.", styles['BodyText']))
    elements.append(Paragraph("The pattern will still activate. But you'll catch it faster. Interrupt it more often. It won't control your life anymore.", styles['BodyText']))
    elements.append(Paragraph("That's the work.", styles['TealHighlight']))
    
    elements.append(Spacer(1, 0.5*inch))
    
    elements.append(Paragraph("THE ARCHIVIST METHOD™", styles['TitleMain']))
    elements.append(Paragraph("Pattern Archaeology, Not Therapy", styles['Tagline']))
    elements.append(Spacer(1, 0.3*inch))
    elements.append(Paragraph("You have a pattern destroying your life.", styles['QuoteText']))
    elements.append(Paragraph("Now you know how to interrupt it.", styles['QuoteText']))
    
    elements.append(Spacer(1, 0.5*inch))
    elements.append(Paragraph("THE ARCHIVIST METHOD™ | END OF QUICK-START SYSTEM", styles['Classified']))
    
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
    elements.extend(build_pattern_assessment(styles))
    elements.extend(build_assessment_quiz(styles))
    elements.extend(build_90_day_protocol(styles))
    elements.extend(build_circuit_break_library(styles))
    elements.extend(build_original_room(styles))
    elements.extend(build_tracking_instructions(styles))
    elements.extend(build_crisis_protocols(styles))
    elements.extend(build_relationship_scripts(styles))
    elements.extend(build_conclusion(styles))
    
    doc.build(elements, onFirstPage=template.draw_page, onLaterPages=template.draw_page)
    
    print(f"PDF generated successfully: {OUTPUT_PATH}")


if __name__ == "__main__":
    generate_pdf()
