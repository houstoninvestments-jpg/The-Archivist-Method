#!/usr/bin/env python3
"""
The Archivist Method™ Complete Archive PDF Generator
Premium $197 product with dark gothic/industrial aesthetic
"""

from reportlab.lib.pagesizes import letter
from reportlab.lib.colors import HexColor
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle
from reportlab.platypus import Image as RLImage
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT
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

OUTPUT_PATH = "/home/runner/workspace/generated_pdfs/THE-ARCHIVIST-METHOD-COMPLETE-ARCHIVE.pdf"
LOGO_PATH = "/home/runner/workspace/attached_assets/archivist-logo-pdf.png"
LOGO_PATH_COMPOSITED = "/home/runner/workspace/attached_assets/archivist-logo-pdf-composited.png"


def prepare_logo_for_pdf():
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
        canvas.drawCentredString(width/2, 0.5*inch, "THE ARCHIVIST METHOD™ | COMPLETE ARCHIVE | CLASSIFIED")
        canvas.drawRightString(width - 0.75*inch, 0.5*inch, f"Page {self.page_num}")


def create_styles():
    styles = getSampleStyleSheet()
    
    styles['BodyText'].fontName = 'Helvetica'
    styles['BodyText'].fontSize = 10
    styles['BodyText'].textColor = LIGHT_GRAY
    styles['BodyText'].alignment = TA_LEFT
    styles['BodyText'].spaceBefore = 3
    styles['BodyText'].spaceAfter = 5
    styles['BodyText'].leading = 14
    
    styles.add(ParagraphStyle(name='TitleMain', fontName='Helvetica-Bold', fontSize=28, textColor=TEAL, alignment=TA_CENTER, spaceAfter=8, leading=34))
    styles.add(ParagraphStyle(name='TitleSub', fontName='Helvetica-Bold', fontSize=20, textColor=WHITE, alignment=TA_CENTER, spaceAfter=16, leading=26))
    styles.add(ParagraphStyle(name='Tagline', fontName='Helvetica-Oblique', fontSize=13, textColor=PINK, alignment=TA_CENTER, spaceBefore=20, spaceAfter=16))
    styles.add(ParagraphStyle(name='PartHeader', fontName='Helvetica-Bold', fontSize=22, textColor=TEAL, alignment=TA_CENTER, spaceBefore=16, spaceAfter=12, leading=28))
    styles.add(ParagraphStyle(name='SectionHeader', fontName='Helvetica-Bold', fontSize=16, textColor=TEAL, alignment=TA_LEFT, spaceBefore=14, spaceAfter=10, leading=20))
    styles.add(ParagraphStyle(name='SubsectionHeader', fontName='Helvetica-Bold', fontSize=13, textColor=WHITE, alignment=TA_LEFT, spaceBefore=10, spaceAfter=6, leading=17))
    styles.add(ParagraphStyle(name='PatternName', fontName='Helvetica-Bold', fontSize=14, textColor=TEAL, alignment=TA_LEFT, spaceBefore=12, spaceAfter=8, leading=18))
    styles.add(ParagraphStyle(name='BodyItalic', fontName='Helvetica-Oblique', fontSize=10, textColor=LIGHT_GRAY, alignment=TA_CENTER, spaceBefore=3, spaceAfter=5, leading=14))
    styles.add(ParagraphStyle(name='BulletItem', fontName='Helvetica', fontSize=10, textColor=LIGHT_GRAY, alignment=TA_LEFT, leftIndent=18, spaceBefore=2, spaceAfter=2, leading=13))
    styles.add(ParagraphStyle(name='ScriptText', fontName='Helvetica-Oblique', fontSize=9, textColor=LIGHT_GRAY, alignment=TA_LEFT, leftIndent=20, rightIndent=20, spaceBefore=6, spaceAfter=6, leading=13))
    styles.add(ParagraphStyle(name='Classified', fontName='Helvetica-Bold', fontSize=9, textColor=MED_GRAY, alignment=TA_CENTER, spaceAfter=16))
    styles.add(ParagraphStyle(name='TealHighlight', fontName='Helvetica-Bold', fontSize=10, textColor=TEAL, alignment=TA_LEFT, spaceBefore=3, spaceAfter=4, leading=14))
    styles.add(ParagraphStyle(name='PinkHighlight', fontName='Helvetica-Bold', fontSize=10, textColor=PINK, alignment=TA_LEFT, spaceBefore=3, spaceAfter=4, leading=14))
    styles.add(ParagraphStyle(name='ScenarioHeader', fontName='Helvetica-Bold', fontSize=11, textColor=WHITE, alignment=TA_LEFT, spaceBefore=8, spaceAfter=4, leading=14))
    styles.add(ParagraphStyle(name='FormField', fontName='Helvetica', fontSize=10, textColor=MED_GRAY, alignment=TA_LEFT, spaceBefore=3, spaceAfter=3, leading=13))
    
    return styles


def build_title_page(styles):
    elements = []
    elements.append(Spacer(1, 0.4*inch))
    
    logo_path = prepare_logo_for_pdf()
    if logo_path and os.path.exists(logo_path):
        logo = RLImage(logo_path, width=2*inch, height=2*inch)
        logo.hAlign = 'CENTER'
        elements.append(logo)
        elements.append(Spacer(1, 0.3*inch))
    
    elements.append(Paragraph("THE ARCHIVIST METHOD™", styles['TitleMain']))
    elements.append(Paragraph("COMPLETE ARCHIVE", styles['TitleSub']))
    elements.append(Spacer(1, 0.2*inch))
    elements.append(Paragraph("The Master Reference Manual for Pattern Interruption", styles['BodyItalic']))
    elements.append(Spacer(1, 0.4*inch))
    elements.append(Paragraph("PATTERN ARCHAEOLOGY, NOT THERAPY", styles['Tagline']))
    elements.append(Spacer(1, 1*inch))
    elements.append(Paragraph("THE ARCHIVIST METHOD™ | CLASSIFIED", styles['Classified']))
    elements.append(PageBreak())
    return elements


def build_part1_foundations(styles):
    elements = []
    
    elements.append(Paragraph("PART 1: FOUNDATIONS", styles['PartHeader']))
    elements.append(Spacer(1, 0.2*inch))
    
    elements.append(Paragraph("WHAT THIS IS", styles['SectionHeader']))
    elements.append(Paragraph("You bought the premium version. That means one of two things. Either you did the Crash Course, got one successful interrupt, and want to master this. Or you skipped straight here because you're done messing around.", styles['BodyText']))
    elements.append(Paragraph("Either way, this is the complete system.", styles['TealHighlight']))
    elements.append(Paragraph("The Complete Archive is not a longer version of the Quick-Start. It is a different category of tool. The Quick-Start teaches you to interrupt one pattern for 90 days. This teaches you to master pattern interruption across every area of your life, for the rest of your life.", styles['BodyText']))
    elements.append(Paragraph("This is the manual you will use for years.", styles['TealHighlight']))
    elements.append(Spacer(1, 0.15*inch))
    
    elements.append(Paragraph("HOW TO USE THIS ARCHIVE", styles['SectionHeader']))
    elements.append(Paragraph("This is not a book to read cover to cover. This is a reference manual. You will open it when patterns activate. You will return to specific sections when new situations arise. You will mark it up. You will come back.", styles['BodyText']))
    elements.append(Paragraph("If you have not completed the Quick-Start System: Stop. Go back. Do the 90-day protocol on one pattern first. This Archive assumes you already know how to identify, track, and interrupt a pattern.", styles['PinkHighlight']))
    elements.append(Paragraph("<b>If you have completed the Quick-Start:</b> You already interrupted your primary pattern. Now you're ready for:", styles['BodyText']))
    elements.append(Paragraph("• Deep mastery of all 7 patterns", styles['BulletItem']))
    elements.append(Paragraph("• Pattern combinations (when 2-3 run simultaneously)", styles['BulletItem']))
    elements.append(Paragraph("• Advanced scenarios and edge cases", styles['BulletItem']))
    elements.append(Paragraph("• Relationship, parenting, and workplace applications", styles['BulletItem']))
    elements.append(Paragraph("• Crisis protocols for severe activation", styles['BulletItem']))
    elements.append(Paragraph("• Long-term maintenance (years, not months)", styles['BulletItem']))
    elements.append(Spacer(1, 0.15*inch))
    
    elements.append(Paragraph("THE ORIGINAL ROOM", styles['SectionHeader']))
    elements.append(Paragraph("Every pattern installed somewhere. Not randomly. Not because something was wrong with you. Because you learned to survive.", styles['BodyText']))
    elements.append(Paragraph("The Original Room is not a literal room. It is the emotional environment of your childhood. The conditions you had to navigate. The threats you had to manage. The adults whose behavior you could not control.", styles['BodyText']))
    elements.append(Paragraph("In that room, your pattern made perfect sense. It was not dysfunction. It was adaptation. It was survival logic encoded into your nervous system.", styles['TealHighlight']))
    elements.append(Paragraph("<b>The problem:</b> You are no longer in that room. You grew up. You left. You have agency now. You can choose who you spend time with. You can leave unsafe situations. You can communicate boundaries.", styles['BodyText']))
    elements.append(Paragraph("But your nervous system does not know that. It is still running the old protocol. Still protecting you from a room you no longer live in.", styles['BodyText']))
    elements.append(Paragraph("The pattern is not evidence you are broken. The pattern is evidence you survived.", styles['TealHighlight']))
    elements.append(Spacer(1, 0.15*inch))
    
    elements.append(Paragraph("THE FOUR STEPS", styles['SectionHeader']))
    
    elements.append(Paragraph("<b>STEP 1: FOCUS</b> - Observe the pattern without judgment.", styles['SubsectionHeader']))
    elements.append(Paragraph("When a pattern activates, your first instinct is to react emotionally. Shame. Anger. Despair. This is normal. It is also useless. Patterns thrive in emotional chaos.", styles['BodyText']))
    elements.append(Paragraph("FOCUS means: Notice the pattern activating. Do not judge it. Do not analyze why you are \"like this.\" Simply observe.", styles['TealHighlight']))
    elements.append(Paragraph("\"The [pattern] program just activated. The trigger was [specific event]. I feel [sensation] in my [body location]. The automatic response would be [behavior]. I am observing this.\"", styles['ScriptText']))
    
    elements.append(Paragraph("<b>STEP 2: EXCAVATION</b> - Locate the Original Room where the pattern installed.", styles['SubsectionHeader']))
    elements.append(Paragraph("Every pattern has an origin. Not a dramatic trauma narrative, but a specific moment (or series of moments) in childhood when your nervous system learned: This behavior keeps me safe.", styles['BodyText']))
    elements.append(Paragraph("You are not processing trauma. You are identifying when the code was written.", styles['TealHighlight']))
    
    elements.append(Paragraph("<b>STEP 3: INTERRUPTION</b> - Find the circuit break point in the pattern loop.", styles['SubsectionHeader']))
    elements.append(Paragraph("Patterns run in loops: Trigger → Body sensation → Automatic thought → Automatic behavior → Outcome → Reinforcement", styles['BodyText']))
    elements.append(Paragraph("Between body sensation and automatic behavior, there is a gap. Usually 3-7 seconds. In that gap, choice exists.", styles['TealHighlight']))
    
    elements.append(Paragraph("<b>STEP 4: REWRITE</b> - Install new behavioral responses.", styles['SubsectionHeader']))
    elements.append(Paragraph("Interruption stops the pattern from executing. Rewrite gives your nervous system something to do instead. The new behavior must address the same survival need.", styles['BodyText']))
    elements.append(Spacer(1, 0.15*inch))
    
    elements.append(Paragraph("WHAT TO EXPECT", styles['SectionHeader']))
    elements.append(Paragraph("<b>MONTHS 1-3 (POST QUICK-START):</b> The primary pattern is weakening. You interrupt it more often than you execute it. But you notice secondary patterns activating more clearly now.", styles['BodyText']))
    elements.append(Paragraph("<b>MONTHS 4-6:</b> Pattern combinations become visible. You see how your patterns interact and reinforce each other. This is advanced work. Use Part 3 of this Archive.", styles['BodyText']))
    elements.append(Paragraph("<b>MONTHS 7-12:</b> Patterns activate less frequently. When they do activate, you recognize them quickly and interrupt efficiently.", styles['BodyText']))
    elements.append(Paragraph("<b>YEAR 2+:</b> The patterns are dormant, not extinct. They still exist in your nervous system. They may never fully disappear. But they no longer run your life. This is mastery.", styles['TealHighlight']))
    elements.append(Spacer(1, 0.15*inch))
    
    elements.append(Paragraph("CRITICAL DISTINCTIONS", styles['SectionHeader']))
    elements.append(Paragraph("<b>Pattern Archaeology vs. Therapy:</b> Therapy asks: Why do you feel this way? Pattern archaeology asks: When does the program run? What triggers it? How do we interrupt it?", styles['BodyText']))
    elements.append(Paragraph("<b>Patterns vs. Pathology:</b> Patterns are not diagnoses. They are learned behaviors that served a survival function. You do not have a personality disorder. You have patterns that were adaptive responses.", styles['BodyText']))
    elements.append(Paragraph("<b>Interruption vs. Elimination:</b> You cannot delete a pattern. The code remains. The goal is not deletion. It is interruption. The measure of success is not \"I never run the pattern anymore.\" The measure of success is \"I recognize it immediately and interrupt it before it causes damage.\"", styles['TealHighlight']))
    
    elements.append(PageBreak())
    return elements


def build_pattern_section(styles, pattern_num, pattern_name, core_behavior, installation_window, survival_function, mechanics, triggers, body_sigs, original_rooms, scenarios, circuit_breaks, rewrites):
    """Build a complete pattern section"""
    elements = []
    
    elements.append(Paragraph(f"PATTERN {pattern_num}: {pattern_name}", styles['PatternName']))
    elements.append(Paragraph(f"<b>Core behavior:</b> {core_behavior}", styles['BodyText']))
    elements.append(Paragraph(f"<b>Installation window:</b> {installation_window}", styles['BodyText']))
    elements.append(Paragraph(f"<b>Survival function:</b> {survival_function}", styles['BodyText']))
    elements.append(Spacer(1, 0.1*inch))
    
    elements.append(Paragraph("PATTERN MECHANICS", styles['SubsectionHeader']))
    elements.append(Paragraph(mechanics, styles['BodyText']))
    elements.append(Spacer(1, 0.1*inch))
    
    elements.append(Paragraph("COMMON TRIGGERS", styles['SubsectionHeader']))
    for trigger in triggers:
        elements.append(Paragraph(f"• {trigger}", styles['BulletItem']))
    elements.append(Spacer(1, 0.1*inch))
    
    elements.append(Paragraph("BODY SIGNATURES", styles['SubsectionHeader']))
    for sig in body_sigs:
        elements.append(Paragraph(f"• {sig}", styles['BulletItem']))
    elements.append(Spacer(1, 0.1*inch))
    
    elements.append(Paragraph("THE ORIGINAL ROOM", styles['SubsectionHeader']))
    for room in original_rooms:
        elements.append(Paragraph(f"<b>{room[0]}:</b> {room[1]}", styles['BodyText']))
    elements.append(Spacer(1, 0.1*inch))
    
    elements.append(Paragraph("ACTIVATION SCENARIOS", styles['SubsectionHeader']))
    for scenario in scenarios[:3]:
        elements.append(Paragraph(f"<b>{scenario[0]}</b>", styles['ScenarioHeader']))
        elements.append(Paragraph(scenario[1], styles['BodyText']))
        elements.append(Paragraph(f"<b>RECOGNIZE IT:</b> {scenario[2]}", styles['BodyText']))
        elements.append(Paragraph(f"<b>REWRITE:</b> {scenario[3]}", styles['TealHighlight']))
    elements.append(Spacer(1, 0.1*inch))
    
    elements.append(Paragraph("CIRCUIT BREAKS", styles['SubsectionHeader']))
    for cb in circuit_breaks:
        elements.append(Paragraph(f"<b>{cb[0]}:</b> {cb[1]}", styles['BodyText']))
        elements.append(Paragraph(f"Script: \"{cb[2]}\"", styles['ScriptText']))
    elements.append(Spacer(1, 0.1*inch))
    
    elements.append(Paragraph("REWRITE PROTOCOLS", styles['SubsectionHeader']))
    for rw in rewrites:
        elements.append(Paragraph(f"<b>{rw[0]}</b>", styles['BodyText']))
        elements.append(Paragraph(f"Old: {rw[1]}", styles['BodyText']))
        elements.append(Paragraph(f"New: {rw[2]}", styles['TealHighlight']))
    
    elements.append(PageBreak())
    return elements


def build_part2_patterns(styles):
    elements = []
    
    elements.append(Paragraph("PART 2: THE SEVEN CORE PATTERNS", styles['PartHeader']))
    elements.append(Paragraph("COMPLETE ANALYSIS", styles['SubsectionHeader']))
    elements.append(Spacer(1, 0.2*inch))
    
    elements.extend(build_pattern_section(styles,
        pattern_num=1,
        pattern_name="THE DISAPPEARING PATTERN",
        core_behavior="Pull away when intimacy increases.",
        installation_window="Typically ages 4-10.",
        survival_function="Protect against abandonment or engulfment by preemptively creating distance.",
        mechanics="The Disappearing Pattern operates on a proximity alarm. As emotional closeness increases, the program activates and initiates distancing protocols. The pattern creates safety through control. If you leave first, you cannot be left. If you maintain distance, you cannot be trapped.",
        triggers=["Declaration of love", "Commitment escalation (moving in, engagement)", "Deep emotional conversations", "Partner becoming more present and consistent", "Physical intimacy combined with emotional connection", "Someone making you a priority"],
        body_sigs=["Chest tightness or constriction", "Throat closing", "Urgent need to escape", "Legs wanting to move, pace, leave", "Fight-or-flight activation"],
        original_rooms=[
            ("Unpredictable Abandonment", "A parent leaves suddenly. Divorce, death, deployment. The child learns: People I love disappear without warning."),
            ("Enmeshment", "Primary caregiver uses child to meet emotional needs. The child learns: Closeness means losing myself."),
            ("Betrayal", "The child trusts completely. That person violates trust profoundly. The child learns: People I trust most hurt me most."),
            ("Conditional Love", "Caregiver's love is conditional on performance. The child learns: Love can be withdrawn at any moment.")
        ],
        scenarios=[
            ("The 'I Love You' Trigger", "Partner says 'I love you' for the first time. You feel chest tightness, say 'Thank you' instead of reciprocating, then become distant.", "The problem is not them. The problem is the pattern.", "\"I'm noticing the Disappearing Pattern activating. I'm scared about how close we're getting. I'm not going to run.\""),
            ("The Moving In Conversation", "They bring up moving in together. You feel nausea, restlessness. You avoid the conversation, pick fights, find reasons to end it.", "The sudden uncertainty appeared at the exact moment commitment was requested. That is pattern.", "\"I'm feeling scared about moving in together. Not because something's wrong with us. Can we talk about what I'm afraid of?\""),
            ("The Partner Who Stays", "You've been terrible. They stayed. Their staying makes you panic more. You escalate until they finally leave.", "Their staying did not make you feel safe. It made you feel more panicked. That is pattern.", "\"You stayed when I pushed you away. That scares me more than if you had left. I'm working on this pattern.\"")
        ],
        circuit_breaks=[
            ("Body Sensation Recognition", "When you feel chest tightness and urge to flee after intimacy increases", "The Disappearing Pattern just activated. This is my proximity alarm. The program wants me to create distance. I am observing this."),
            ("Thought Interruption", "When thoughts like 'This is too much' or 'I need space' arise", "These are not my thoughts. This is the pattern generating reasons to leave."),
            ("Behavior Intervention", "Right before canceling, ghosting, or creating distance", "I am about to execute the Disappearing Pattern. What would it look like to stay instead?")
        ],
        rewrites=[
            ("Verbal Transparency", "Feel panic → create distance silently", "Feel panic → name the panic → stay in proximity"),
            ("Controlled Micro-Distances", "Panic → disappear completely for days or weeks", "Panic → communicate need for brief space → return on schedule"),
            ("Intimacy Titration", "Intimacy increases beyond threshold → full retreat", "Intimacy increases → pause at threshold → integrate → allow next level")
        ]
    ))
    
    elements.extend(build_pattern_section(styles,
        pattern_num=2,
        pattern_name="THE APOLOGY LOOP",
        core_behavior="Apologize for existing, taking up space, having needs.",
        installation_window="Typically ages 3-8.",
        survival_function="Minimize visibility and needs to avoid caregiver's anger, overwhelm, or rejection.",
        mechanics="The Apology Loop operates on the belief that your existence is an imposition. That your needs are burdensome. That you must apologize for taking up space in the world. The pattern creates safety through smallness.",
        triggers=["Requesting help or someone's time", "Taking up physical space", "Having and expressing opinions", "Receiving compliments, gifts, or attention", "Making requests at restaurants, stores", "Setting boundaries or saying no"],
        body_sigs=["Throat tightening, voice becoming small", "Body becoming smaller, shoulders rounding", "Shame, shrinking sensation", "Guilt surge when asserting needs", "Face flushing"],
        original_rooms=[
            ("Overwhelmed Caregiver", "Caregiver was overwhelmed. Child's needs were 'one more thing.' The child learned: I am a burden."),
            ("Punished for Needs", "Having needs led to punishment. The child learned: Needs are dangerous."),
            ("Parentified Child", "Child had to take care of caregiver. The child learned: My needs don't matter; theirs do."),
            ("Perfectionism Environment", "Nothing was ever good enough. The child learned: I must minimize my impact.")
        ],
        scenarios=[
            ("The Work Email", "You need to email a colleague. You start with 'Sorry to bother you, but...'", "Asking a work question is not bothering someone. It is normal professional communication.", "Delete the apology. Write directly: 'Hi, I have a question about the project. Thanks for your help.'"),
            ("The Hallway Pass", "You walk past someone. There's plenty of room. You say 'Sorry' automatically.", "You were walking in a hallway. This is what hallways are for.", "Nod, make brief eye contact, say nothing or say 'Hi.' Do not apologize."),
            ("Asking for a Raise", "You've performed well but can't ask directly. You minimize: 'I totally understand if it's not possible, but...'", "Asking for compensation you have earned is not greed. It is professional.", "'I'd like to discuss my compensation. Based on my performance, I'm requesting [specific number].'")
        ],
        circuit_breaks=[
            ("Pre-Apology Awareness", "When 'sorry' is about to come out for existing or needing something", "I am about to apologize for [existing/needing/asking]. I have done nothing wrong."),
            ("Size Awareness", "When you notice yourself physically shrinking", "I am making myself small. I am allowed to take up space."),
            ("Need Legitimacy", "When minimizing your needs", "I have a need. Needs are legitimate. I am allowed to ask.")
        ],
        rewrites=[
            ("Sorry → Thank You", "'Sorry to bother you...'", "'Thank you for your time.'"),
            ("Direct Requests", "'I was wondering if maybe you might possibly...'", "'Can you help me with this?'"),
            ("Space Claiming", "Make yourself physically smaller", "Take up the space you need. Stand straight. Speak at full volume.")
        ]
    ))
    
    elements.extend(build_pattern_section(styles,
        pattern_num=3,
        pattern_name="THE TESTING PATTERN",
        core_behavior="Create tests to see if people will stay.",
        installation_window="Typically ages 5-12.",
        survival_function="Predict abandonment before it happens so you can prepare for it.",
        mechanics="The Testing Pattern operates on abandonment anticipation. You expect people to leave. Not because you are pessimistic, but because people have left before. Testing is your attempt to control the timeline.",
        triggers=["Attachment deepening—realizing you care", "Someone becoming important to you", "Vulnerability exposure—they see you at your worst", "Consistency that feels suspicious", "Any perceived distance or slow response"],
        body_sigs=["Pounding heart, racing", "Stomach dropping, nausea", "Hypervigilance—scanning for signs they will leave", "Panic attacks", "Obsessive thoughts about their behavior"],
        original_rooms=[
            ("Sudden Abandonment", "Primary caregiver leaves suddenly. No warning. The child learns: People leave without warning. I must find out when."),
            ("Conditional Presence", "Caregiver's presence conditional on behavior. The child learns: One mistake and they will leave."),
            ("Intermittent Presence", "Caregiver in and out. Sometimes present, sometimes gone. The child learns: I cannot trust consistency."),
            ("Trust Betrayal", "Complete trust followed by profound betrayal. The child learns: The more I trust, the worse the betrayal.")
        ],
        scenarios=[
            ("The 'Do You Really Love Me?' Fight", "You realize you like someone. This triggers abandonment anxiety. You pick a fight over something minor.", "The fight was a test.", "\"I'm feeling anxious about us. Not because of anything you did, but because I'm starting to care and that scares me. Can you reassure me?\""),
            ("The Late Text Spiral", "Partner takes three hours to respond. They were busy. This is normal. You send follow-up texts, become cold, punish.", "Three hours is normal. Your reaction is pattern.", "Wait. Respond normally. If needed: 'I got anxious when I didn't hear from you. Can you tell me we're okay?'"),
            ("The Reliable Friend Suspicion", "A friend is consistently there for you. This reliability feels suspicious. You become demanding, create crises.", "Reliability feels unfamiliar. That is not evidence it is fake.", "\"You've been really consistent with me. Part of me is waiting for you to stop. That's not fair to you.\"")
        ],
        circuit_breaks=[
            ("Abandonment Anxiety Recognition", "When attachment deepens and panic begins", "The Testing Pattern is activating. This is not evidence they are leaving. This is my nervous system running the old program."),
            ("Test Impulse Identification", "When you notice yourself planning a test", "I am about to test them. This is not about them. This is the pattern.")
        ],
        rewrites=[
            ("Direct Vulnerability", "Feel fear → create test → see if they pass", "Feel fear → state it directly → ask for reassurance"),
            ("Trust Intervals", "Constant testing", "Scheduled check-ins: 'Can we have a weekly check-in about how we're doing?'"),
            ("Evidence Collection", "Hypervigilance for signs they will leave", "Deliberate attention to evidence they are staying")
        ]
    ))
    
    elements.extend(build_pattern_section(styles,
        pattern_num=4,
        pattern_name="ATTRACTION TO HARM",
        core_behavior="Attracted to unavailable, harmful, or chaotic people.",
        installation_window="Typically ages 6-14.",
        survival_function="Familiar chaos feels safer than unfamiliar stability.",
        mechanics="The Attraction to Harm pattern operates on familiarity confusion. Your nervous system learned what 'love' felt like in the Original Room. If love came with chaos, unavailability, or harm, that is what love feels like to you. Stable, available, healthy people do not feel like love. They feel boring.",
        triggers=["Meeting safe, stable people (triggers boredom)", "Meeting unavailable, chaotic people (triggers 'chemistry')", "Red flags that feel like attraction", "People who need fixing", "Drama and intensity"],
        body_sigs=["With harmful people: Excitement, butterflies, 'chemistry,' feeling alive", "With safe people: Flat, nothing, boredom, 'no spark'", "Heart racing interpreted as desire with harmful people", "Looking for reasons to leave safe people"],
        original_rooms=[
            ("Chaotic Caregiver", "Love came from someone unpredictable. Sometimes warm, sometimes cold. The child learns: Love is chaotic."),
            ("Unavailable Caregiver", "Primary caregiver emotionally unavailable. The child learns: Love is longing. If I can have them, I do not want them."),
            ("Harmful Caregiver", "Love packaged with harm. Abuse intertwined with affection. The child learns: Love hurts. If it does not hurt, it is not love.")
        ],
        scenarios=[
            ("The 'Boring' Good Person", "You meet someone kind, stable, emotionally available. You feel nothing. 'No chemistry.'", "The absence of chaos feels like absence of attraction. That is pattern.", "\"This person is safe and I feel nothing. That might mean my attraction system is calibrated to harm. I'm going to give this six weeks before I decide.\""),
            ("The Red Flag Chemistry", "You meet someone with obvious red flags. You feel intense attraction. 'Finally, someone interesting.'", "The 'chemistry' is your nervous system recognizing the Original Room.", "\"I feel intense attraction. Let me check: are they safe or familiar? This might be pattern recognition, not love.\""),
            ("The Fixer Project", "You meet someone who is a mess. You feel drawn to help them, make their problems your purpose.", "You are recreating the Original Room. Drawn to chaos you can try to manage.", "\"I am attracted to their brokenness. That is not love. That is familiarity.\"")
        ],
        circuit_breaks=[
            ("Chemistry Check", "When you feel intense attraction", "I feel chemistry. Let me check: Is this person safe, or are they familiar?"),
            ("Boredom Check", "When you feel nothing with a safe person", "I feel no chemistry. Is this person actually boring, or is safety unfamiliar to me?")
        ],
        rewrites=[
            ("Red Flag = Exit", "Red flag → excitement → pursue", "Red flag → recognition → do not pursue"),
            ("Safety Tolerance Training", "Safe person → boredom → leave", "Safe person → discomfort → stay and observe for six weeks"),
            ("Chemistry Reframe", "'Chemistry' = this is the one", "'Chemistry' = check for harm patterns")
        ]
    ))
    
    elements.extend(build_pattern_section(styles,
        pattern_num=5,
        pattern_name="COMPLIMENT DEFLECTION",
        core_behavior="Cannot accept positive acknowledgment.",
        installation_window="Typically ages 5-12.",
        survival_function="Visibility was dangerous. Stay invisible.",
        mechanics="Compliment Deflection operates on visibility fear. When someone acknowledges you positively, your nervous system treats it as threat. Being seen feels dangerous. Being valued feels suspicious. Being praised feels like exposure.",
        triggers=["Being praised for work", "Being told you are attractive, smart, talented", "Achievement acknowledged", "Receiving awards or recognition", "Someone expressing admiration", "Being the center of positive attention"],
        body_sigs=["Squirming, physical discomfort", "Heat, flushing", "Urge to disappear", "Throat tightening", "Nervous laughter", "Eyes looking away, body shrinking"],
        original_rooms=[
            ("Praise Preceded Punishment", "Praise followed by criticism. 'Don't get a big head.' The child learns: Being seen as good leads to being knocked down."),
            ("Jealous Caregiver", "Caregiver threatened by child's achievements. The child learns: My success hurts people I love. I must minimize."),
            ("Perfectionism Environment", "Nothing ever good enough. Praise rare; criticism constant. The child learns: I do not deserve praise.")
        ],
        scenarios=[
            ("The Work Compliment", "Your boss says 'Great job on that project.' You say 'Oh, it was nothing. Anyone could have done it.'", "You just rejected a professional compliment. This affects your career.", "\"Thank you.\" That is it. Nothing else."),
            ("The Personal Compliment", "Someone tells you that you look good today. You say 'What? No. I look terrible.'", "You corrected someone's positive perception of you. That is pattern.", "\"Thank you.\" Full stop.")
        ],
        circuit_breaks=[
            ("Deflection Impulse Recognition", "Compliment received, deflection incoming", "Compliment Deflection just activated. I want to minimize. I am going to accept instead.")
        ],
        rewrites=[
            ("Two-Word Maximum", "Compliment → deflection → minimization", "Compliment → 'Thank you' — no deflection, no explanation"),
            ("Receive and Sit", "Compliment → immediate rejection", "Compliment → receive → sit with discomfort without acting on it")
        ]
    ))
    
    elements.extend(build_pattern_section(styles,
        pattern_num=6,
        pattern_name="THE DRAINING BOND",
        core_behavior="Stay bonded to harmful people or situations past when you should leave.",
        installation_window="Typically ages 4-12.",
        survival_function="Leaving felt more dangerous than staying.",
        mechanics="The Draining Bond operates on departure guilt. You know you should leave. Your friends tell you. Your therapist tells you. Your body tells you. But you stay. Not because you are weak. Because leaving, in the Original Room, was impossible or catastrophic.",
        triggers=["Thinking about leaving a relationship", "Someone suggesting you deserve better", "Glimpse of life without them", "Recognizing the harm clearly", "Having the resources to leave", "Someone else leaving a similar situation"],
        body_sigs=["Heavy guilt", "Obligation that feels physical (like weight)", "Anxiety when thinking about leaving", "Relief when deciding to stay", "Nausea at thought of abandoning them"],
        original_rooms=[
            ("Dependent Caregiver", "Child could not leave because caregiver depended on them. The child learns: I am responsible for their survival. Leaving is betrayal."),
            ("Threatened Abandonment", "Leaving explicitly punished. 'If you leave, I'll kill myself.' The child learns: Leaving causes catastrophe."),
            ("Normalized Harm", "Child never learned leaving was an option. Harm was normal. The child learns: This is just how it is.")
        ],
        scenarios=[
            ("The Relationship You Know You Should Leave", "Everyone sees it. You see it. But you stay. 'It's not that bad. They need me.'", "The guilt is pattern, not moral obligation.", "\"Leaving is self-preservation, not betrayal. I am allowed to leave.\""),
            ("The Job That Is Killing You", "The job is toxic. Your health is suffering. 'They depend on me. I can't leave them in a lurch.'", "You are more loyal to a job than to yourself.", "\"I am allowed to leave jobs that harm me. That is not abandonment.\"")
        ],
        circuit_breaks=[
            ("Departure Guilt Recognition", "Thinking about leaving triggers guilt", "This guilt is pattern, not moral truth. Leaving is allowed.")
        ],
        rewrites=[
            ("Departure Planning", "Think about leaving → guilt → stay", "Think about leaving → make concrete plan → follow through"),
            ("Obligation Audit", "'I can't leave them'", "List actual obligations versus felt obligations. Act on actual only.")
        ]
    ))
    
    elements.extend(build_pattern_section(styles,
        pattern_num=7,
        pattern_name="SUCCESS SABOTAGE",
        core_behavior="Destroy things right before they succeed.",
        installation_window="Typically ages 8-14.",
        survival_function="Success was punished or threatening.",
        mechanics="Success Sabotage operates on breakthrough panic. As you approach success, your nervous system activates. Not with excitement. With dread. Something bad is coming. You need to stop this before it gets worse.",
        triggers=["Approaching a major goal", "Things going well for 'too long'", "About to be promoted", "Relationship reaching milestone", "Almost completing a project", "Getting attention for achievement"],
        body_sigs=["Dread as success nears", "Panic", "Sabotage impulse (urge to quit, destroy, create crisis)", "Relief when you sabotage", "Shame after sabotage"],
        original_rooms=[
            ("Success Punished", "Achievement led to punishment. 'Don't get cocky.' Increased demands without support. The child learns: Success is dangerous."),
            ("Success as Betrayal", "Success threatened family identity. 'You think you're better than us?' The child learns: Success means losing belonging."),
            ("Failure Identity", "Child's role was to be the problem. The child learns: If I am not failing, who am I?")
        ],
        scenarios=[
            ("The Almost-Promotion", "You are about to be promoted. Everything is aligned. You sabotage the interview.", "You did not fail. You sabotaged.", "\"Success Sabotage is activating. I am allowed to succeed. I am continuing forward.\""),
            ("The Almost-Completed Project", "You are 90% done with something important. You stop working on it.", "The stopping is not laziness. It is pattern.", "\"I am approaching completion and want to quit. That is pattern. I am finishing.\""),
            ("The Almost-Happy Relationship", "The relationship is the best you have had. You create a crisis that destroys it.", "You did not have problems. You created them.", "\"I am sabotaging a good relationship because good feels dangerous. I am choosing to stay.\"")
        ],
        circuit_breaks=[
            ("Breakthrough Recognition", "70-90% toward goal and panic starts", "I am approaching success. Success Sabotage is activating. This is pattern, not reality."),
            ("Sabotage Delay", "Urge to quit, destroy, or create crisis", "I am going to wait 48 hours. If I still want to sabotage, I'll reconsider.")
        ],
        rewrites=[
            ("48-Hour Rule", "Sabotage impulse → immediate execution", "Sabotage impulse → 48-hour delay → reassess"),
            ("Success Statements", "'Something bad is coming'", "'I am allowed to succeed. Success is safe now.'"),
            ("Finish Protocol", "Get to 90% → stop", "Get to 90% → recognize pattern → push hardest to finish")
        ]
    ))
    
    return elements


def build_part3_combinations(styles):
    elements = []
    
    elements.append(Paragraph("PART 3: PATTERN COMBINATIONS", styles['PartHeader']))
    elements.append(Spacer(1, 0.2*inch))
    
    elements.append(Paragraph("HOW PATTERNS INTERACT", styles['SectionHeader']))
    elements.append(Paragraph("You do not run one pattern in isolation. Patterns interact. They reinforce each other. They create complex loops that are harder to interrupt than single patterns.", styles['BodyText']))
    elements.append(Paragraph("Most people run 2-4 core patterns simultaneously. One primary pattern (loudest, most disruptive) and several secondary patterns that activate in specific contexts.", styles['TealHighlight']))
    elements.append(Spacer(1, 0.15*inch))
    
    combinations = [
        ("DISAPPEARING + TESTING", "You pull away when intimacy increases (Disappearing). But you frame the distance as a test (Testing). 'If they really care, they'll pursue me.'", "Relationships where you are never fully present. Partners exhausted from pursuing you. Self-fulfilling prophecy: 'No one stays.'", "Interrupt Testing first. When Disappearing activates, ask: 'Am I disappearing, or am I testing? Or both?' If both: 'I am not going to test them. I'm going to tell them directly that I'm scared.'"),
        ("TESTING + ATTRACTION TO HARM", "You are attracted to unreliable people (Attraction to Harm). They frequently fail your tests (Testing). This confirms 'everyone leaves.'", "You choose people who will fail tests. Abandonment is guaranteed.", "Interrupt Attraction to Harm first. If you choose reliable people, they will pass tests."),
        ("APOLOGY LOOP + COMPLIMENT DEFLECTION", "You apologize for existing (Apology Loop) AND deflect positive acknowledgment (Compliment Deflection). Together: complete invisibility.", "Chronic under-earning. Relationship imbalance. Depression from invisibility.", "Interrupt based on trigger. Apology Loop when requesting. Compliment Deflection when receiving. Track both."),
        ("DISAPPEARING + SUCCESS SABOTAGE", "Relationship is going well (success). You disappear right before a milestone or commitment.", "You destroy relationships at exactly the moment they could become stable.", "Interrupt Success Sabotage first. The disappearing is the method. The intolerance of success is the driver."),
        ("DRAINING BOND + APOLOGY LOOP", "You apologize for your needs (Apology Loop). This allows others to ignore them. You stay in situations where your needs are dismissed (Draining Bond).", "You train people to dismiss you, then stay with them while they dismiss you.", "Interrupt Apology Loop first. If you believe your needs matter, you stop tolerating people who dismiss them."),
        ("ATTRACTION TO HARM + DRAINING BOND", "You are attracted to harmful people (Attraction to Harm). Then you cannot leave them (Draining Bond).", "You choose harm, then cannot escape it.", "Interrupt Attraction to Harm first. If you do not choose harmful people, Draining Bond has less opportunity to activate."),
        ("SUCCESS SABOTAGE + COMPLIMENT DEFLECTION", "You approach success. Someone acknowledges the achievement. You deflect, which triggers shame, which triggers sabotage.", "Recognition becomes a sabotage trigger.", "Interrupt Compliment Deflection. Accept the praise. Let it land. This reduces the shame that triggers sabotage.")
    ]
    
    for name, how_it_works, danger, strategy in combinations:
        elements.append(Paragraph(name, styles['SubsectionHeader']))
        elements.append(Paragraph(f"<b>How it works:</b> {how_it_works}", styles['BodyText']))
        elements.append(Paragraph(f"<b>Why it's dangerous:</b> {danger}", styles['BodyText']))
        elements.append(Paragraph(f"<b>Interruption strategy:</b> {strategy}", styles['TealHighlight']))
        elements.append(Spacer(1, 0.1*inch))
    
    elements.append(PageBreak())
    return elements


def build_part4_advanced(styles):
    elements = []
    
    elements.append(Paragraph("PART 4: ADVANCED APPLICATIONS", styles['PartHeader']))
    elements.append(Spacer(1, 0.2*inch))
    
    elements.append(Paragraph("PATTERNS IN ROMANTIC RELATIONSHIPS", styles['SectionHeader']))
    elements.append(Paragraph("Every pattern shows up in romantic relationships. They activate more intensely because intimacy is the highest-stakes environment for your nervous system.", styles['BodyText']))
    elements.append(Paragraph("<b>Key principles:</b>", styles['BodyText']))
    elements.append(Paragraph("• Your patterns are not your partner's responsibility to fix", styles['BulletItem']))
    elements.append(Paragraph("• But your partner can be an ally in interruption", styles['BulletItem']))
    elements.append(Paragraph("• Patterns will activate—the question is what you do when they do", styles['BulletItem']))
    elements.append(Paragraph("• Telling your partner about your patterns is not an excuse. It is accountability.", styles['BulletItem']))
    elements.append(Spacer(1, 0.1*inch))
    
    elements.append(Paragraph("PATTERN DISCLOSURE TO PARTNERS", styles['SubsectionHeader']))
    elements.append(Paragraph("<b>When to tell them:</b> After you have identified and are working on a pattern. Not before you understand it yourself.", styles['BodyText']))
    elements.append(Paragraph("<b>How to tell them:</b> 'I have a pattern called [name]. It activates when [trigger]. What you'll see is [behavior]. I'm working on it. Here's what would help: [specific request].'", styles['BodyText']))
    elements.append(Paragraph("<b>What not to do:</b> Do not use pattern disclosure as an excuse. 'Sorry I ghosted you, I have Disappearing Pattern' is not accountability. It is using your trauma as a get-out-of-jail-free card.", styles['PinkHighlight']))
    elements.append(Spacer(1, 0.15*inch))
    
    elements.append(Paragraph("PATTERNS IN PARENTING", styles['SectionHeader']))
    elements.append(Paragraph("Children learn patterns by watching you.", styles['TealHighlight']))
    elements.append(Paragraph("• If you run Apology Loop, they learn their needs are burdensome", styles['BulletItem']))
    elements.append(Paragraph("• If you run Compliment Deflection, they learn visibility is dangerous", styles['BulletItem']))
    elements.append(Paragraph("• If you run Success Sabotage, they learn success is punished", styles['BulletItem']))
    elements.append(Spacer(1, 0.1*inch))
    
    elements.append(Paragraph("<b>DO NOT INSTALL PATTERNS IN YOUR CHILDREN:</b>", styles['SubsectionHeader']))
    elements.append(Paragraph("• To avoid Disappearing: Do not withdraw when your child needs closeness", styles['BulletItem']))
    elements.append(Paragraph("• To avoid Apology Loop: Do not make your child responsible for your emotional state", styles['BulletItem']))
    elements.append(Paragraph("• To avoid Testing: Be consistent. Do not make love conditional on behavior", styles['BulletItem']))
    elements.append(Paragraph("• To avoid Attraction to Harm: Model healthy relationships", styles['BulletItem']))
    elements.append(Paragraph("• To avoid Compliment Deflection: Praise them AND let them accept it", styles['BulletItem']))
    elements.append(Paragraph("• To avoid Draining Bond: Leave situations that are harmful. Show them leaving is an option", styles['BulletItem']))
    elements.append(Paragraph("• To avoid Success Sabotage: Celebrate achievements without adding increased expectations", styles['BulletItem']))
    elements.append(Spacer(1, 0.15*inch))
    
    elements.append(Paragraph("PATTERNS AT WORK", styles['SectionHeader']))
    elements.append(Paragraph("<b>Apology Loop at work:</b> You do not negotiate salary. You apologize for professional communication. Track your work apologies for one week.", styles['BodyText']))
    elements.append(Paragraph("<b>Compliment Deflection at work:</b> Your boss praises your work. You say 'It was nothing.' Now they think it was nothing. You get passed over for promotion.", styles['BodyText']))
    elements.append(Paragraph("<b>Success Sabotage at work:</b> You are about to be promoted. You sabotage the interview. You quit right before the breakthrough.", styles['BodyText']))
    elements.append(Paragraph("<b>Disappearing at work:</b> A mentor takes interest in you. You become distant, miss meetings, create reasons for them to stop investing.", styles['BodyText']))
    elements.append(Spacer(1, 0.15*inch))
    
    elements.append(Paragraph("CRISIS PROTOCOLS", styles['SectionHeader']))
    elements.append(Paragraph("<b>Definition of crisis:</b> Pattern activation so intense you cannot think, cannot use circuit breaks, cannot function.", styles['BodyText']))
    elements.append(Paragraph("<b>Signs of crisis:</b> Panic attack during pattern activation, dissociation, unable to remember circuit break scripts, suicidal thoughts connected to pattern shame.", styles['BodyText']))
    elements.append(Spacer(1, 0.1*inch))
    
    elements.append(Paragraph("IMMEDIATE CRISIS INTERVENTION", styles['SubsectionHeader']))
    elements.append(Paragraph("<b>Step 1: Physical interrupt</b> — Ice on face or wrists, cold water, intense physical sensation", styles['BodyText']))
    elements.append(Paragraph("<b>Step 2: Grounding</b> — 5 things you see, 4 things you hear, 3 things you touch, 2 things you smell, 1 thing you taste", styles['BodyText']))
    elements.append(Paragraph("<b>Step 3: One-word naming</b> — Just name the pattern. 'Disappearing.' 'Testing.' 'Sabotage.'", styles['BodyText']))
    elements.append(Paragraph("<b>Step 4: Breathe</b> — 4 seconds in. 7 seconds hold. 8 seconds out. Repeat 4 times.", styles['BodyText']))
    elements.append(Paragraph("<b>Step 5: Do not make decisions</b> — In crisis, you make pattern-driven decisions. Do not make major decisions while in crisis.", styles['TealHighlight']))
    elements.append(Spacer(1, 0.1*inch))
    
    elements.append(Paragraph("WHEN TO SEEK PROFESSIONAL HELP", styles['SubsectionHeader']))
    elements.append(Paragraph("Pattern work is not a replacement for professional mental health treatment. Seek help if: Suicidal thoughts, self-harm urges, severe PTSD symptoms, pattern work makes things worse, stuck after 6+ months with no progress.", styles['BodyText']))
    elements.append(Paragraph("<b>Types of therapy that complement pattern work:</b> EMDR, DBT, IFS (Internal Family Systems), Schema Therapy", styles['BodyText']))
    
    elements.append(PageBreak())
    return elements


def build_part5_toolkit(styles):
    elements = []
    
    elements.append(Paragraph("PART 5: THE TOOLKIT", styles['PartHeader']))
    elements.append(Spacer(1, 0.2*inch))
    
    elements.append(Paragraph("EMERGENCY CIRCUIT BREAKS", styles['SectionHeader']))
    elements.append(Paragraph("When you cannot remember the specific circuit break for your pattern, use this universal one:", styles['BodyText']))
    elements.append(Paragraph("\"A pattern is running. I feel it in my body. I do not have to execute the automatic behavior. I can choose something different.\"", styles['ScriptText']))
    elements.append(Paragraph("Then: breathe, pause, observe.", styles['TealHighlight']))
    elements.append(Spacer(1, 0.15*inch))
    
    elements.append(Paragraph("PATTERN TRACKING TEMPLATE", styles['SectionHeader']))
    elements.append(Paragraph("<b>Daily tracking (during active work):</b>", styles['BodyText']))
    elements.append(Paragraph("Date: _______________________", styles['FormField']))
    elements.append(Paragraph("Pattern: _______________________", styles['FormField']))
    elements.append(Paragraph("Activations today:", styles['FormField']))
    elements.append(Paragraph("• Time: ________  Trigger: ________________________________________", styles['FormField']))
    elements.append(Paragraph("• Body sensation: ________________________________________________", styles['FormField']))
    elements.append(Paragraph("• Automatic thought: _____________________________________________", styles['FormField']))
    elements.append(Paragraph("• What I did: ____________________________________________________", styles['FormField']))
    elements.append(Paragraph("• Outcome: ______________________________________________________", styles['FormField']))
    elements.append(Paragraph("Successful interrupts: ___", styles['FormField']))
    elements.append(Paragraph("What worked: ____________________________________________________", styles['FormField']))
    elements.append(Paragraph("What didn't: ____________________________________________________", styles['FormField']))
    elements.append(Spacer(1, 0.15*inch))
    
    elements.append(Paragraph("WEEKLY REVIEW TEMPLATE", styles['SectionHeader']))
    elements.append(Paragraph("Week of: _______________________", styles['FormField']))
    elements.append(Paragraph("Total activations: ___", styles['FormField']))
    elements.append(Paragraph("Successful interrupts: ___", styles['FormField']))
    elements.append(Paragraph("Interrupt rate: ___%", styles['FormField']))
    elements.append(Paragraph("Most common trigger: ____________________________________________", styles['FormField']))
    elements.append(Paragraph("Most common body sensation: _____________________________________", styles['FormField']))
    elements.append(Paragraph("What I learned: _________________________________________________", styles['FormField']))
    elements.append(Paragraph("Focus for next week: ____________________________________________", styles['FormField']))
    elements.append(Spacer(1, 0.15*inch))
    
    elements.append(Paragraph("LONG-TERM MAINTENANCE", styles['SectionHeader']))
    elements.append(Paragraph("<b>Monthly:</b> Review pattern activations. Check if pattern is re-strengthening. Adjust as needed.", styles['BodyText']))
    elements.append(Paragraph("<b>Quarterly:</b> Deep reflection on pattern status. Assess if new triggers have emerged. Consider secondary patterns.", styles['BodyText']))
    elements.append(Paragraph("<b>Yearly:</b> Comprehensive pattern system review. Are there new patterns emerging? What growth has occurred?", styles['BodyText']))
    elements.append(Spacer(1, 0.3*inch))
    
    elements.append(Paragraph("FINAL WORDS", styles['SectionHeader']))
    elements.append(Paragraph("You now have the complete system. Not a self-help book. Not a 90-day program. A manual you will use for years.", styles['BodyText']))
    elements.append(Paragraph("The patterns do not disappear. They weaken. They become manageable. They stop running your life. But only if you do the work.", styles['TealHighlight']))
    elements.append(Paragraph("Reading this is not doing the work. Knowing your pattern is not interrupting it. Understanding why is not changing what.", styles['BodyText']))
    elements.append(Spacer(1, 0.15*inch))
    
    elements.append(Paragraph("<b>The work is:</b> Tracking. Observing. Catching yourself. Interrupting. Trying the new behavior. Failing. Trying again. For months. For years.", styles['BodyText']))
    elements.append(Paragraph("This is not a quick fix. This is a discipline.", styles['TealHighlight']))
    elements.append(Paragraph("You have the tools. You have the knowledge. You have the protocols.", styles['BodyText']))
    elements.append(Paragraph("Now do the work.", styles['TealHighlight']))
    elements.append(Spacer(1, 0.5*inch))
    
    elements.append(Paragraph("THE ARCHIVIST METHOD™", styles['TitleMain']))
    elements.append(Paragraph("Pattern Archaeology, Not Therapy", styles['Tagline']))
    elements.append(Spacer(1, 0.2*inch))
    elements.append(Paragraph("You have a pattern destroying your life.", styles['BodyItalic']))
    elements.append(Paragraph("Now you know how to interrupt it.", styles['BodyItalic']))
    elements.append(Spacer(1, 0.4*inch))
    elements.append(Paragraph("END OF ARCHIVE", styles['Classified']))
    
    return elements


def generate_pdf():
    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    
    doc = SimpleDocTemplate(
        OUTPUT_PATH,
        pagesize=letter,
        leftMargin=0.7*inch,
        rightMargin=0.7*inch,
        topMargin=0.7*inch,
        bottomMargin=0.7*inch
    )
    
    template = ArchivistPDFTemplate(doc)
    styles = create_styles()
    
    elements = []
    elements.extend(build_title_page(styles))
    elements.extend(build_part1_foundations(styles))
    elements.extend(build_part2_patterns(styles))
    elements.extend(build_part3_combinations(styles))
    elements.extend(build_part4_advanced(styles))
    elements.extend(build_part5_toolkit(styles))
    
    doc.build(elements, onFirstPage=template.draw_page, onLaterPages=template.draw_page)
    print(f"PDF generated successfully: {OUTPUT_PATH}")


if __name__ == "__main__":
    generate_pdf()
