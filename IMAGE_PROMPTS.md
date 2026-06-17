# ListenUp — Image Generation Prompts

Assets to generate with AI for the immersive kids-illustration design.
All mascot/object images: **transparent PNG, flat-vector kids style, no text, no background.**

Drop generated files into `public/`. Filenames below are the wire-up targets.

---

## CHARACTER block (paste into EVERY mascot prompt for consistency)

> **CHARACTER:** A cute friendly cartoon boy, round face, light tan skin, tidy
> navy-blue hair, big happy dark eyes, cheerful open smile, wearing a
> turquoise/teal short-sleeve t-shirt. Flat vector illustration, bold clean
> rounded shapes, soft minimal shading, thick smooth outlines, bright cheerful
> colors. Children's picture-book style.

---

## Mascot poses (priority)

### 1. Cheering — Results screen  →  `public/mascot-cheer.png`
> [CHARACTER] The boy celebrating with both arms raised up high, huge joyful
> smile, eyes happy/closed, small sparkles and confetti around him. Full body,
> centered. Transparent background, PNG, no background, no text, square 1024x1024.

### 2. Listening — Play screen (sentence phase)  →  `public/mascot-listen.png`
> [CHARACTER] The boy cupping one hand to his ear, leaning slightly, curious
> attentive expression, small teal sound-wave arcs near his ear. Full body,
> centered. Transparent background, PNG, no background, no text, square 1024x1024.

### 3. Pointing / encouraging — empty states + Browse  →  `public/mascot-point.png`
> [CHARACTER] The boy smiling and pointing forward/up with one hand, friendly
> encouraging pose, other hand on hip. Full body, centered. Transparent
> background, PNG, no background, no text, square 1024x1024.

---

## Mode-card objects (optional — chunky 3D look like refs)

Each: transparent PNG, ~512x512, no text.

### 4. Books  →  `public/obj-book.png`
> A cute glossy 3D stack of colorful storybooks, rounded soft shapes, slight
> top-down angle, bright yellow/orange/teal covers, soft shadow. Playful 3D
> render, children's app icon style. Transparent background, PNG, square 512x512.

### 5. Question  →  `public/obj-question.png`
> A cute glossy 3D speech bubble with a bold question mark inside, rounded soft
> shape, bright green, soft shadow. Playful 3D render, children's app icon style.
> Transparent background, PNG, square 512x512.

### 6. Dice  →  `public/obj-dice.png`
> Two cute glossy 3D rounded dice tumbling, bright orange and white, soft shadow.
> Playful 3D render, children's app icon style. Transparent background, PNG,
> square 512x512.

---

## Notes

- Current `public/mascot.png` (waving + book) stays the **Home hero** — already fits, keep it.
- Highest impact: **#1 (Results)** and **#2 (Play)** — do these first.
- Palette: navy `#1B3A6B`, teal `#1AA9B0`, orange `#F58220`, grass `#5FBF3F`, blue `#2E7DD1`, card yellow `#FFC23C`.
- Wire-up after assets land: swap per-screen `mascot.png` refs + replace Home card line-icons with `<img>`.
