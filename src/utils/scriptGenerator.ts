import { ScriptLanguage, EngineVersion } from '../types/lens';

interface GenerationOptions {
  prompt: string;
  language: ScriptLanguage;
  engine: EngineVersion;
}

export function generateLensScript(options: GenerationOptions): string {
  const { prompt, language, engine } = options;
  const isTs = language === 'typescript';
  const cleanPrompt = prompt.toLowerCase();

  // 1. Color / Shader / Material prompt
  if (cleanPrompt.includes('color') || cleanPrompt.includes('shader') || cleanPrompt.includes('material')) {
    return isTs ? `// @input Component.RenderMeshVisual targetMesh
// @input vec4[] colorPalette = [{1,0,0,1}, {0,1,0,1}, {0,0,1,1}, {1,1,0,1}]
// @input float transitionSpeed = 3.5

/**
 * LensScript AI Co-Pilot: Dynamic Color Cycle Shader Driver
 * Generated for ${engine} in TypeScript
 * Prompt: "${prompt}"
 */

let currentColorIndex = 0;
let targetColor = new vec4(1, 0, 0, 1);
let activeColor = new vec4(1, 0, 0, 1);

function onStart() {
  if (!script.targetMesh) {
    print("[LensScript] Please assign targetMesh in the Inspector");
    return;
  }
  print("[LensScript] Color Cycle Initialized with " + script.colorPalette.length + " colors.");
}

function onScreenTap(e: TapEvent) {
  if (!script.colorPalette || script.colorPalette.length === 0) return;

  currentColorIndex = (currentColorIndex + 1) % script.colorPalette.length;
  targetColor = script.colorPalette[currentColorIndex];

  print("[LensScript] Target Color Shifted to Index: " + currentColorIndex);
}

function onUpdate() {
  if (!script.targetMesh) return;

  const dt = getDeltaTime();
  // Smoothly blend color towards target
  activeColor = vec4.lerp(activeColor, targetColor, dt * script.transitionSpeed);

  const mat = script.targetMesh.mainMaterial;
  if (mat && mat.mainPass) {
    mat.mainPass.baseColor = activeColor;
  }
}

script.createEvent("OnStartEvent").bind(onStart);
script.createEvent("TapEvent").bind(onScreenTap);
script.createEvent("UpdateEvent").bind(onUpdate);
` : `// @input Component.RenderMeshVisual targetMesh
// @input vec4[] colorPalette = [{1,0,0,1}, {0,1,0,1}, {0,0,1,1}, {1,1,0,1}]
// @input float transitionSpeed = 3.5

/**
 * LensScript AI Co-Pilot: Dynamic Color Cycle Shader Driver
 * Generated for ${engine} in JavaScript
 * Prompt: "${prompt}"
 */

var currentColorIndex = 0;
var targetColor = new vec4(1, 0, 0, 1);
var activeColor = new vec4(1, 0, 0, 1);

function onStart() {
  if (!script.targetMesh) {
    print("[LensScript] Please assign targetMesh in Inspector");
    return;
  }
  print("[LensScript] Color Cycle Initialized.");
}

function onScreenTap(e) {
  if (!script.colorPalette || script.colorPalette.length === 0) return;

  currentColorIndex = (currentColorIndex + 1) % script.colorPalette.length;
  targetColor = script.colorPalette[currentColorIndex];

  print("[LensScript] Color changed to index: " + currentColorIndex);
}

function onUpdate() {
  if (!script.targetMesh) return;

  var dt = getDeltaTime();
  activeColor = vec4.lerp(activeColor, targetColor, dt * script.transitionSpeed);

  var mat = script.targetMesh.mainMaterial;
  if (mat && mat.mainPass) {
    mat.mainPass.baseColor = activeColor;
  }
}

script.createEvent("OnStartEvent").bind(onStart);
script.createEvent("TapEvent").bind(onScreenTap);
script.createEvent("UpdateEvent").bind(onUpdate);
`;
  }

  // 2. Physics / Collision / Gravity prompt
  if (cleanPrompt.includes('physics') || cleanPrompt.includes('gravity') || cleanPrompt.includes('bounce')) {
    return isTs ? `// @input SceneObject rigidTarget
// @input float bounceVelocity = 8.0
// @input float gravity = -18.0
// @input float groundY = 0.0

/**
 * LensScript AI Co-Pilot: Lightweight AR Physics & Bounce System
 * Generated for ${engine} in TypeScript
 * Prompt: "${prompt}"
 */

let velocityY = 0.0;
let currentY = 5.0;
let isFalling = true;

function onStart() {
  if (!script.rigidTarget) {
    print("[LensScript] Warning: Assign rigidTarget SceneObject");
    return;
  }
  print("[LensScript] Physics Simulation Active.");
}

function onScreenTap(e: TapEvent) {
  // Apply impulse jump upward
  velocityY = script.bounceVelocity;
  isFalling = true;
  print("[LensScript] Physics Jump Impulse Applied!");
}

function onUpdate() {
  if (!script.rigidTarget || !isFalling) return;

  const dt = getDeltaTime();
  velocityY += script.gravity * dt;
  currentY += velocityY * dt;

  // Ground collision check
  if (currentY <= script.groundY) {
    currentY = script.groundY;
    velocityY = -velocityY * 0.65; // Coefficient of restitution

    if (Math.abs(velocityY) < 0.2) {
      velocityY = 0;
      isFalling = false;
    }
  }

  const transform = script.rigidTarget.getTransform();
  const currentPos = transform.getLocalPosition();
  transform.setLocalPosition(new vec3(currentPos.x, currentY, currentPos.z));
}

script.createEvent("OnStartEvent").bind(onStart);
script.createEvent("TapEvent").bind(onScreenTap);
script.createEvent("UpdateEvent").bind(onUpdate);
` : `// @input SceneObject rigidTarget
// @input float bounceVelocity = 8.0
// @input float gravity = -18.0
// @input float groundY = 0.0

/**
 * LensScript AI Co-Pilot: Lightweight AR Physics & Bounce System
 * Generated for ${engine} in JavaScript
 */

var velocityY = 0.0;
var currentY = 5.0;
var isFalling = true;

function onScreenTap(e) {
  velocityY = script.bounceVelocity;
  isFalling = true;
  print("[LensScript] Physics Jump Impulse Triggered!");
}

function onUpdate() {
  if (!script.rigidTarget || !isFalling) return;

  var dt = getDeltaTime();
  velocityY += script.gravity * dt;
  currentY += velocityY * dt;

  if (currentY <= script.groundY) {
    currentY = script.groundY;
    velocityY = -velocityY * 0.65;
    if (Math.abs(velocityY) < 0.2) {
      velocityY = 0;
      isFalling = false;
    }
  }

  var transform = script.rigidTarget.getTransform();
  var pos = transform.getLocalPosition();
  transform.setLocalPosition(new vec3(pos.x, currentY, pos.z));
}

script.createEvent("TapEvent").bind(onScreenTap);
script.createEvent("UpdateEvent").bind(onUpdate);
`;
  }

  // 3. Default Comprehensive Co-Pilot Generator for any AR prompt
  return isTs ? `// @input SceneObject primaryTarget
// @input Component.RenderMeshVisual visualMesh
// @input float rotationSpeed = 45.0
// @input float scalePulseAmount = 0.25
// @input bool enableTapInteraction = true

/**
 * LensScript AI Co-Pilot: Generated AR Experience
 * Target Engine: ${engine}
 * Language: TypeScript
 * Prompt: "${prompt}"
 */

let initialScale: vec3 = new vec3(1, 1, 1);
let pulseTime: number = 0;
let isActivated: boolean = false;

function onStart(): void {
  if (script.primaryTarget) {
    initialScale = script.primaryTarget.getTransform().getLocalScale();
    print("[LensScript] SceneObject bound successfully: " + script.primaryTarget.name);
  } else {
    print("[LensScript Note] Assign primaryTarget in the Inspector panel to view transform effects.");
  }
}

function onScreenTap(eventData: TapEvent): void {
  if (!script.enableTapInteraction) return;

  isActivated = !isActivated;
  pulseTime = 0;

  print("[LensScript] Action Triggered by User Tap! Active state: " + isActivated);
}

function onUpdate(): void {
  if (!script.primaryTarget) return;

  const dt = getDeltaTime();
  const transform = script.primaryTarget.getTransform();

  // 1. Continuous smooth rotation
  const currentRot = transform.getLocalRotation();
  const deltaRot = quat.fromEulerAngles(0, MathUtils.degToRad(script.rotationSpeed * dt), 0);
  transform.setLocalRotation(currentRot.multiply(deltaRot));

  // 2. Pulse modulation when activated
  if (isActivated) {
    pulseTime += dt * 6.0;
    const pulseFactor = 1.0 + (Math.sin(pulseTime) * script.scalePulseAmount);
    transform.setLocalScale(initialScale.uniformScale(pulseFactor));
  }
}

// Lens Studio 5.x Event Registration
script.createEvent("OnStartEvent").bind(onStart);
script.createEvent("TapEvent").bind(onScreenTap);
script.createEvent("UpdateEvent").bind(onUpdate);
` : `// @input SceneObject primaryTarget
// @input Component.RenderMeshVisual visualMesh
// @input float rotationSpeed = 45.0
// @input float scalePulseAmount = 0.25
// @input bool enableTapInteraction = true

/**
 * LensScript AI Co-Pilot: Generated AR Experience
 * Target Engine: ${engine}
 * Language: JavaScript
 * Prompt: "${prompt}"
 */

var initialScale = new vec3(1, 1, 1);
var pulseTime = 0;
var isActivated = false;

function onStart() {
  if (script.primaryTarget) {
    initialScale = script.primaryTarget.getTransform().getLocalScale();
    print("[LensScript] SceneObject bound: " + script.primaryTarget.name);
  }
}

function onScreenTap(eventData) {
  if (!script.enableTapInteraction) return;
  isActivated = !isActivated;
  pulseTime = 0;
  print("[LensScript] Screen Tapped! State: " + isActivated);
}

function onUpdate() {
  if (!script.primaryTarget) return;

  var dt = getDeltaTime();
  var transform = script.primaryTarget.getTransform();

  // Continuous smooth spin
  var currentRot = transform.getLocalRotation();
  var deltaRot = quat.fromEulerAngles(0, MathUtils.degToRad(script.rotationSpeed * dt), 0);
  transform.setLocalRotation(currentRot.multiply(deltaRot));

  if (isActivated) {
    pulseTime += dt * 6.0;
    var pulseFactor = 1.0 + (Math.sin(pulseTime) * script.scalePulseAmount);
    transform.setLocalScale(initialScale.uniformScale(pulseFactor));
  }
}

script.createEvent("OnStartEvent").bind(onStart);
script.createEvent("TapEvent").bind(onScreenTap);
script.createEvent("UpdateEvent").bind(onUpdate);
`;
}
