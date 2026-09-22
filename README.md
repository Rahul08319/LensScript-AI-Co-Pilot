<div align="center">

# ⚡ LensScript AI Co-Pilot

<p align="center">
  <strong>Next-Generation AI Developer Studio & Interactive AR Script Co-Pilot for Snapchat Lens Studio</strong>
</p>

<p align="center">
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 18" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript 5" /></a>
  <a href="https://vitejs.dev/"><img src="https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite 6" /></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" /></a>
  <a href="https://developers.snap.com/lens-studio"><img src="https://img.shields.io/badge/Snapchat-Lens%20Studio%205.x-FFFC00?style=for-the-badge&logo=snapchat&logoColor=black" alt="Lens Studio 5" /></a>
  <a href="https://modelcontextprotocol.io/"><img src="https://img.shields.io/badge/MCP-Bridge%20Enabled-00F0FF?style=for-the-badge&logo=ant-design&logoColor=black" alt="MCP Bridge" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-orange.svg?style=for-the-badge" alt="MIT License" /></a>
  <a href="https://github.com/Rahul08319/LensScript-AI-Co-Pilot/pulls"><img src="https://img.shields.io/badge/PRs-Welcome-10B981.svg?style=for-the-badge" alt="PRs Welcome" /></a>
</p>

---

<p align="center">
  <img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" style="border-radius: 20px; box-shadow: 0 25px 50px -12px rgba(255, 252, 0, 0.25);" />
</p>

<p align="center">
  <a href="#-about-the-project"><b>📖 About</b></a> •
  <a href="#-features-showcase"><b>✨ Features</b></a> •
  <a href="#-interactive-ar-viewfinder"><b>📱 AR Simulator</b></a> •
  <a href="#-lens-studio-mcp-bridge"><b>🔌 MCP Bridge</b></a> •
  <a href="#-code-gallery"><b>💻 Code Examples</b></a> •
  <a href="#-getting-started"><b>🚀 Quick Start</b></a> •
  <a href="#-architecture"><b>⚡ Architecture</b></a>
</p>

</div>

---

## 📖 About The Project

> *"The fastest path from prompt to augmented reality production."*

**LensScript AI Co-Pilot** is a **luxury-tier AR developer studio** engineered specifically for **Snapchat Lens Studio** creators, developers, and technical artists. Built with **React 18**, **TypeScript**, **Vite**, and **Tailwind CSS**, it bridges the gap between natural language ideas and production-grade AR scripting.

Whether you are authoring face filters with elastic tween scales, building mouth-triggered particle cannons, creating audio-reactive spectrum visualizers, or implementing world-space raycast placement, **LensScript** automatically generates, validates, and simulates authentic Lens Studio **JavaScript** and **TypeScript** code in real time.

---

## ✨ Features Showcase

<table>
  <tr>
    <td width="50%" valign="top">
      <h3>⚡ AI-Powered AR Script Co-Pilot</h3>
      <p>Transform natural language prompts into battle-tested, typed scripts formatted specifically for Lens Studio v5.x / v4.x runtime engines.</p>
    </td>
    <td width="50%" valign="top">
      <h3>📱 Live 9:16 AR Viewfinder Simulator</h3>
      <p>Interactive mobile viewport simulating Snapchat camera with real-time face tracking landmarks, mouth blendshapes, eye blinks, and particle bursts.</p>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <h3>🎛️ Dynamic <code>@input</code> Inspector</h3>
      <p>Automatically parses <code>// @input</code> variable declarations in real time and renders interactive GUI sliders, checkboxes, and color pickers.</p>
    </td>
    <td width="50%" valign="top">
      <h3>🩺 Lens Studio AST Linter & Diagnostics</h3>
      <p>Detects non-sandbox DOM APIs (<code>window</code>, <code>document</code>), deprecated methods (<code>global.touchSystem</code>), and mobile GC memory allocations inside update loops.</p>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <h3>🔌 Lens Studio MCP Server Bridge</h3>
      <p>Native Model Context Protocol (MCP) bridge configured for <code>http://localhost:50049/mcp</code>, allowing AI coding assistants to manipulate SceneObjects directly.</p>
    </td>
    <td width="50%" valign="top">
      <h3>🎭 8+ Battle-Tested AR Templates</h3>
      <p>One-click load templates for 3D Face Prop cycling, Mouth Particle Cannon, Audio Spectrum Visualizer, Double-Blink LUT switch, and Hand Tracking.</p>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <h3>📚 Searchable Lens API Cheatsheet</h3>
      <p>Instant categorized reference covering Lifecycle Events, Vector & Quaternion Math (<code>vec3</code>, <code>quat</code>), SceneObject transforms, and VFX controls.</p>
    </td>
    <td width="50%" valign="top">
      <h3>💾 Multi-Format Export Engine</h3>
      <p>1-Click instant copy or download as clean <code>.ts</code> or <code>.js</code> files ready to drag-and-drop into your Lens Studio Asset Browser.</p>
    </td>
  </tr>
</table>

---

## 📱 Interactive AR Viewfinder

The built-in simulator provides an authentic Snapchat mobile camera experience with real-time interactive triggers:

```
+-------------------------------------------------------+
|                SNAPCHAT AR VIEWFINDER                 |
+-------------------------------------------------------+
|  [Score: 120]                       [Lens Preview]   |
|                                                       |
|                     ( 3D Hat Prop )                   |
|                        .-----.                        |
|                       / [o] [o] \   <-- Blink Eye     |
|                      |     |     |                    |
|                       \   ===   /   <-- Open Mouth    |
|                        '-------'                      |
|                                                       |
|                 ( 🖐️ Hand Landmark Orb )              |
|                                                       |
|             [ 👆 Tap Screen to Cycle Props ]          |
|                                                       |
|                       ( ( O ) )                       |
+-------------------------------------------------------+
| Triggers: [👁️ Blink]  [🎵 Beat Pulse]  [🖐️ Hand]     |
| Mouth Aperture: [=======>-------------] 55%          |
| Console Feed: [LensScript] Swapped to Prop Index: 2   |
+-------------------------------------------------------+
```

---

## 🔌 Lens Studio MCP Bridge

LensScript AI Co-Pilot integrates with the **Lens Studio Model Context Protocol (MCP)** server running locally on port `50049`.

### Configuration (`mcp_config.json`)

Add the following block to your agent configuration (Antigravity, Claude Desktop, or Cursor):

```json
{
  "servers": {
    "lens-studio": {
      "type": "http",
      "url": "http://localhost:50049/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_LENS_STUDIO_AUTH_TOKEN"
      }
    }
  }
}
```

### Supported MCP Automation Tools

| Tool Name | Description |
| :--- | :--- |
| `inspect_scene_graph` | Queries full JSON tree of active SceneObjects, components, and materials. |
| `create_scene_object` | Spawns new 3D meshes, Face Attachments, Head Trackers, or Cameras. |
| `attach_script_component` | Attaches the generated script directly to a target SceneObject. |
| `set_component_property` | Updates `@input` values programmatically via MCP bridge. |
| `reload_lens` | Triggers immediate hot-reload in Lens Studio's preview window. |

---

## 💻 Code Examples

### 1. Tap-to-Cycle 3D Face Props (TypeScript)

```typescript
// @input SceneObject[] propsList
// @input float popDuration = 0.35
// @input bool enableHaptics = true

let currentIndex = 0;

function onScreenTap(eventData: TapEvent) {
  if (!script.propsList || script.propsList.length <= 1) return;

  script.propsList[currentIndex].enabled = false;
  currentIndex = (currentIndex + 1) % script.propsList.length;
  
  const nextObj = script.propsList[currentIndex];
  nextObj.enabled = true;
  animatePropPop(nextObj);
  
  print("[LensScript] Swapped to Prop Index: " + currentIndex);
}

script.createEvent("TapEvent").bind(onScreenTap);
```

### 2. Audio-Reactive Spectrum Scale (JavaScript)

```javascript
// @input Component.RenderMeshVisual targetMesh
// @input vec3 baseScale = {1, 1, 1}
// @input float intensity = 1.8
// @input float smoothing = 0.85

var smoothedAmp = 0.0;

function onUpdate() {
  var dt = getDeltaTime();
  var rawAmp = global.audioTrack ? global.audioTrack.getVolume() : 0.5;
  smoothedAmp = (smoothedAmp * script.smoothing) + (rawAmp * (1.0 - script.smoothing));

  var mult = 1.0 + (smoothedAmp * script.intensity);
  var transform = script.targetMesh.getSceneObject().getTransform();
  transform.setLocalScale(new vec3(script.baseScale.x * mult, script.baseScale.y * mult, script.baseScale.z * mult));
}

script.createEvent("UpdateEvent").bind(onUpdate);
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Snapchat Lens Studio**: v5.0+ recommended (or v4.x)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Rahul08319/LensScript-AI-Co-Pilot.git
   cd LensScript-AI-Co-Pilot
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Build for production**:
   ```bash
   npm run build
   ```
   The production-ready assets will be compiled into the `dist/` directory.

---

## ⚡ Architecture & Pipeline

```mermaid
flowchart LR
    A["👤 Creator Prompt"] --> B["⚡ LensScript AI Engine"]
    B --> C["📝 Script Tokenizer & AST"]
    C --> D["🩺 Engine Diagnostics / Linter"]
    C --> E["🎛️ @input Parameter Inspector"]
    C --> F["📱 9:16 AR Viewfinder Simulator"]
    F --> G["👆 Real-Time Triggers (Tap, Mouth, Blink, Hand)"]
    G --> H["📜 Live Console Logger"]
    C --> I["🔌 Lens Studio MCP Bridge"]
    I --> J["🚀 Snapchat Lens Studio 5.x"]
```

---

## 📊 Lens Studio Compatibility Matrix

| Feature | Lens Studio 5.x | Lens Studio 4.x | LensScript Support |
| :--- | :---: | :---: | :---: |
| **TypeScript Support** | Native (ESNext) | Babel Plugin | Full (`.ts`) |
| **JavaScript Standard** | QuickJS / Modern | ES6+ | Full (`.js`) |
| **`@input` Declarations** | Supported | Supported | Full Parsing |
| **Event Creation (`script.createEvent`)** | Supported | Supported | Verified |
| **Model Context Protocol (MCP)** | Port 50049 | Manual | Native Bridge |
| **Face Blendshapes & Landmarks** | 68+ points | 68 points | Live Simulator |
| **VFX Particle Properties** | VFX Graph | Legacy Particles | Dynamic Uniforms |

---

## 🤝 Contributing

Contributions are warmly welcome! If you'd like to improve the linter, add new AR script templates, or enhance the simulator:

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingLensTemplate`)
3. Commit your Changes (`git commit -m 'Add amazing new AR template'`)
4. Push to the Branch (`git push origin feature/AmazingLensTemplate`)
5. Open a Pull Request

---

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<div align="center">
  <p>Crafted with 💛 for the global Snapchat AR Creator Community by <b><a href="https://github.com/Rahul08319">Rahul Kumar</a></b></p>
  <a href="https://github.com/Rahul08319/LensScript-AI-Co-Pilot">⭐ Star us on GitHub</a>
</div>
