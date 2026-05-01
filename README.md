# Personal Portfolio

A developer portfolio where the hero section is a playable claw machine — modeled in Blender, exported as `.glb`, and driven by a React state machine with custom camera math and theme-reactive lighting.

**Live:** [zoraaliu.github.io/Personal-Website](https://zoraaliu.github.io/Personal-Website/)

---

## What's in here

- **Claw machine game** — full 9-phase FSM (`idle → playing → dropping → grabbing → lifting → delivering → releasing → ending`), keyboard + virtual joystick + D-pad input, proximity-based grab, snapshot/restore for instant replay
- **About, Experience, Projects, Contact** — scroll-reveal, drag-to-reorder project cards, Formspree contact form with a honeypot + mailto fallback, dark/light theme synced across DOM and 3D scene

---

## 🤖 Claude + Blender MCP workflow

The 3D asset was built using [Blender's MCP server](https://github.com/ahujasid/blender-mcp), which lets Claude talk directly to a running Blender instance. Instead of the usual loop of editing → exporting → refreshing the browser → tweaking → repeat, the whole feedback cycle happened inside Cursor:

- Describe a change in chat ("move the drop zone to the right corner", "rename this mesh to `Plushie_Bear`")
- Claude sends the command to Blender over MCP — objects move, get renamed, or get reparented in real time
- Export, reload the browser, done

This was especially useful for **getting the node naming convention right**. The React code discovers `Carriage`, `ClawArm`, and all `Plushie_*` objects by name at runtime, so small naming mistakes silently broke the game. Being able to inspect and fix the scene from the same place I was writing the controller meant far fewer "why isn't the grab working" debugging sessions.

It also made iterating on plushie placement easier — the `dropY` and grab radius are derived from actual world positions, so repositioning a toy in Blender and re-exporting was enough to keep the physics feeling right without touching constants.

---

## 🎮 The 3D part

The Blender scene uses a **naming convention as the API**. The runtime discovers nodes by name (`Carriage`, `ClawArm`, regex `^Plushie_[A-Za-z]+$`) and adapts to whatever geometry the model has — no hardcoded positions.

**Camera fit** — instead of magic numbers, `computeCameraDistance` projects the bounding box onto the view plane and solves for the distance that inscribes it at the current FOV and aspect ratio. Near/far planes, OrbitControls limits, the in-cabinet lamp position, and shadow scale all derive from the same bounding box. Resize the window or swap the model and everything re-derives.

**Game loop** — one `useFrame` for the entire game. Hot-path state (phase, input, carriage position, grabbed toy) lives in refs; React state only updates when the HUD needs to re-render.

**Lighting** — two setups (day/night) wired to `data-theme` via `MutationObserver`. Night mode adds Bloom + Vignette in the post-processing pass; the `<EffectComposer>` is keyed on theme so toggling doesn't flicker.

### A few things that took work

| Problem | Fix |
| --- | --- |
| Camera broke after re-modeling | Bounding-box fit math instead of fixed positions |
| Drop depth wrong after model changes | `dropY` computed from actual plushie world-Y at load time |
| Reparenting plushies snapped | Capture world transform, convert back with `worldToLocal` + inverse quaternion |
| Reset reloaded the GLB | Snapshot `parent`/`position`/`quaternion` on mount, replay on reset |
| Day/night toggle flickered post-processing | Key `<EffectComposer>` on theme to force remount |
| Transparent materials sorted wrong | Promote `0.05 < opacity < 1` to `transparent` + `depthWrite: false` on load |

---

## 🛠 Stack

- **React 19 + TypeScript + Vite 6**
- **Three.js** via `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`
- **Blender** — modeling, rigging, GLB export, iterated via Claude + [Blender MCP](https://github.com/ahujasid/blender-mcp)
- **CSS Modules** + design-token CSS variables
- **gh-pages** → GitHub Pages

---

## Running locally

```bash
git clone https://github.com/ZoraaLiu/Personal-Website.git
cd Personal-Website/my-portfolio
npm install
npm run dev
```
