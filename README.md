# FlexiLayout Studio

FlexiLayout Studio is a front-end layout builder. It helps developers visually create and experiment with **Flexbox** and **CSS Grid** layouts, preview them instantly, and export the generated code.

## Why this project stands out

This is not a basic CRUD app or another common beginner project.

FlexiLayout Studio is designed to showcase:

- strong UI/UX design sense
- modern glassmorphism-style interface
- advanced CSS knowledge
- dynamic DOM rendering
- client-side state management
- responsive design
- local persistence with `localStorage`
- export features
- real product thinking

It is a practical tool that developers and designers can actually use while also looking visually impressive on a GitHub profile.

---

## Features

### Core Layout Builder
- Switch between **Flexbox** and **CSS Grid**
- Configure layout properties visually
- Change item count dynamically
- Live preview updates instantly

### Flex Controls
- `flex-direction`
- `justify-content`
- `align-items`
- `flex-wrap`
- `gap`

### Grid Controls
- `grid-template-columns`
- `grid-template-rows`
- `grid-auto-flow`
- `justify-items`
- `align-items`
- `gap`

### Visual Customization
- Multiple canvas surfaces:
  - Aurora
  - Midnight
  - Sunset
  - Frost
- Multiple item styles:
  - Gradient
  - Glass
  - Solid
  - Outline
- Hue controls for design system personalization

### Output & Export
- Generated **CSS**
- Generated **HTML**
- Copy CSS to clipboard
- Copy HTML to clipboard
- Export current config as JSON

### Productivity Features
- Presets for quick starting points
- Random layout generator
- Device preview modes:
  - Desktop
  - Tablet
  - Mobile
- Local save/load
- Keyboard shortcuts

---

## Keyboard Shortcuts

- `Ctrl/Cmd + S` → Save locally
- `Ctrl/Cmd + R` → Randomize layout
- `Ctrl/Cmd + E` → Export JSON

---

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript

No frameworks.  
No external packages.  
No third-party libraries.  
No CDN dependency.

---

## Project Structure
```txt
flexilayout-studio/
├── index.html
├── styles.css
├── app.js
└── README.md
