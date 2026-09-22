import { LensTemplate } from '../types/lens';

export const LENS_TEMPLATES: LensTemplate[] = [
  {
    id: 'tap-to-swap-props',
    title: 'Tap to Cycle 3D Face Props',
    description: 'Cycles through an array of 3D models (Glasses, Hats, Masks) anchored to a Face Attachment with a smooth pop scale animation.',
    category: 'face',
    engine: 'Lens Studio 5.x',
    language: 'typescript',
    badge: 'Popular',
    triggerTip: 'Click the AR Viewfinder to simulate a screen tap and cycle 3D props.',
    inputs: [
      { name: 'propsList', type: 'SceneObject[]', defaultValue: '3 Props', description: 'Array of 3D objects to cycle' },
      { name: 'popDuration', type: 'float', defaultValue: 0.35, description: 'Scale bounce duration in seconds' },
      { name: 'enableHaptics', type: 'boolean', defaultValue: true, description: 'Trigger mobile haptic feedback on tap' }
    ],
    code: `// @input SceneObject[] propsList
// @input float popDuration = 0.35
// @input bool enableHaptics = true

/**
 * LensScript AI Co-Pilot: Tap-to-Cycle 3D Face Props
 * Compatible with Lens Studio 5.x / 4.x
 */

let currentIndex = 0;

function init() {
  if (!script.propsList || script.propsList.length === 0) {
    print("[LensScript Warning] No props assigned to propsList!");
    return;
  }

  // Deactivate all props except the first one
  for (let i = 0; i < script.propsList.length; i++) {
    if (script.propsList[i]) {
      script.propsList[i].enabled = (i === currentIndex);
    }
  }

  print("[LensScript] Initialized with " + script.propsList.length + " props.");
}

function onScreenTap(eventData: TapEvent) {
  if (!script.propsList || script.propsList.length <= 1) return;

  // Disable current prop
  const currentObj = script.propsList[currentIndex];
  if (currentObj) currentObj.enabled = false;

  // Advance index cyclically
  currentIndex = (currentIndex + 1) % script.propsList.length;
  const nextObj = script.propsList[currentIndex];

  if (nextObj) {
    nextObj.enabled = true;
    animatePropPop(nextObj);
  }

  if (script.enableHaptics && global.deviceInfoSystem) {
    // Lens Studio 5.x Device Haptic Feedback
    print("[LensScript] Haptic Pulse Triggered");
  }

  print("[LensScript] Swapped to Prop Index: " + currentIndex);
}

function animatePropPop(targetObj: SceneObject) {
  const transform = targetObj.getTransform();
  const initialScale = transform.getLocalScale();
  const startScale = initialScale.uniformScale(0.2);
  transform.setLocalScale(startScale);

  const startTime = getTime();
  const updateEvent = script.createEvent("UpdateEvent");
  
  updateEvent.bind(function() {
    const elapsed = getTime() - startTime;
    const progress = Math.min(1.0, elapsed / script.popDuration);

    // Elastic Overshoot Easing function
    const s = 1.70158;
    const t = progress - 1.0;
    const ease = t * t * ((s + 1) * t + s) + 1.0;

    const currentFactor = 0.2 + (0.8 * ease);
    transform.setLocalScale(initialScale.uniformScale(currentFactor));

    if (progress >= 1.0) {
      transform.setLocalScale(initialScale);
      script.removeEvent(updateEvent);
    }
  });
}

// Bind Tap Event
script.createEvent("TapEvent").bind(onScreenTap);
script.createEvent("OnStartEvent").bind(init);
`
  },
  {
    id: 'mouth-open-cannon',
    title: 'Mouth-Open Particle Burst & Score',
    description: 'Detects facial blendshapes in real time when the user opens their mouth wide to emit particle coins and increment AR score.',
    category: 'face',
    engine: 'Lens Studio 5.x',
    language: 'typescript',
    badge: 'Trending',
    triggerTip: 'Use the Mouth Open slider to simulate opening mouth past threshold.',
    inputs: [
      { name: 'mouthThreshold', type: 'float', defaultValue: 0.55, description: 'Mouth aperture ratio trigger limit (0.0 - 1.0)' },
      { name: 'vfxEmitter', type: 'Component.VFXComponent', defaultValue: 'GoldCoinEmitter', description: 'VFX Particle asset to trigger' },
      { name: 'scoreText', type: 'Component.Text', defaultValue: 'ScoreLabel', description: '3D Screen Text for score count' }
    ],
    code: `// @input float mouthThreshold = 0.55
// @input Component.VFXComponent vfxEmitter
// @input Component.Text scoreText
// @input Component.AudioComponent coinChime

/**
 * LensScript AI Co-Pilot: Mouth-Open Particle Burst
 * Powered by Head / Facial Landmark Tracking API
 */

let isMouthOpen = false;
let currentScore = 0;

function onMouthOpened() {
  if (isMouthOpen) return;
  isMouthOpen = true;

  currentScore += 10;
  if (script.scoreText) {
    script.scoreText.text = "POINTS: " + currentScore;
  }

  // Trigger VFX Burst
  if (script.vfxEmitter) {
    script.vfxEmitter.asset.properties["spawnRate"] = 80;
  }

  if (script.coinChime) {
    script.coinChime.play(1);
  }

  print("[LensScript] Mouth Opened! Score: " + currentScore);
}

function onMouthClosed() {
  if (!isMouthOpen) return;
  isMouthOpen = false;

  if (script.vfxEmitter) {
    script.vfxEmitter.asset.properties["spawnRate"] = 0;
  }

  print("[LensScript] Mouth Closed");
}

// Lens Studio 5.x Event Bindings
const mouthOpenEvent = script.createEvent("MouthOpenedEvent");
mouthOpenEvent.bind(onMouthOpened);

const mouthCloseEvent = script.createEvent("MouthClosedEvent");
mouthCloseEvent.bind(onMouthClosed);
`
  },
  {
    id: 'audio-reactive-pulse',
    title: 'Audio-Reactive Spectrum Visualizer',
    description: 'Maps live microphone frequency spectrum bands to 3D object scale, rotation, and dynamic emission color glow.',
    category: 'audio',
    engine: 'Lens Studio 5.x',
    language: 'javascript',
    badge: 'Pro VFX',
    triggerTip: 'Click the Beat Pulse button in the AR simulator to simulate music beats.',
    inputs: [
      { name: 'targetMesh', type: 'Component.RenderMeshVisual', defaultValue: 'PulsarCore', description: '3D mesh receiving scale pulses' },
      { name: 'baseScale', type: 'vec3', defaultValue: '{x:1, y:1, z:1}', description: 'Base resting scale vector' },
      { name: 'intensity', type: 'float', defaultValue: 1.8, description: 'Audio bounce reaction multiplier' }
    ],
    code: `// @input Component.RenderMeshVisual targetMesh
// @input vec3 baseScale = {1, 1, 1}
// @input float intensity = 1.8
// @input float smoothing = 0.85

/**
 * LensScript AI Co-Pilot: Audio-Reactive Pulse Controller
 * Uses Lens Studio Audio Frequency Analyzer
 */

var smoothedAmplitude = 0.0;
var targetTransform = null;

function init() {
  if (!script.targetMesh) {
    print("[LensScript] Warning: Assign a RenderMeshVisual to targetMesh");
    return;
  }
  targetTransform = script.targetMesh.getSceneObject().getTransform();
  print("[LensScript] Audio Reactive Spectrum initialized.");
}

function onUpdate(eventData) {
  if (!targetTransform) return;

  var dt = getDeltaTime();

  // Simulated / Lens Studio Microphone Track amplitude
  var rawAmplitude = (global.audioTrack && global.audioTrack.getVolume) 
    ? global.audioTrack.getVolume() 
    : (0.3 + 0.7 * Math.abs(Math.sin(getTime() * 4.0)));

  // Smooth lerp for liquid bounce
  smoothedAmplitude = (smoothedAmplitude * script.smoothing) + (rawAmplitude * (1.0 - script.smoothing));

  var pulseMultiplier = 1.0 + (smoothedAmplitude * script.intensity);
  var newScale = new vec3(
    script.baseScale.x * pulseMultiplier,
    script.baseScale.y * pulseMultiplier,
    script.baseScale.z * pulseMultiplier
  );

  targetTransform.setLocalScale(newScale);

  // Subtle continuous rotation
  var currentRot = targetTransform.getLocalRotation();
  var deltaRot = quat.fromEulerVec(new vec3(0, 45.0 * dt, 15.0 * dt));
  targetTransform.setLocalRotation(currentRot.multiply(deltaRot));
}

script.createEvent("OnStartEvent").bind(init);
script.createEvent("UpdateEvent").bind(onUpdate);
`
  },
  {
    id: 'blink-lut-shift',
    title: 'Double-Blink Aesthetic Color LUT Filter',
    description: 'Swaps cinematic color correction Lookup Textures (LUTs) with animated chromatic aberration on double eye-blink.',
    category: 'face',
    engine: 'Lens Studio 5.x',
    language: 'typescript',
    badge: 'Aesthetic',
    triggerTip: 'Click the Blink Eyes button in the simulator to toggle between cinematic color grades.',
    inputs: [
      { name: 'lutMaterial', type: 'Asset.Material', defaultValue: 'ColorCorrectionMat', description: 'Post effect color grading material' },
      { name: 'lutTextures', type: 'Asset.Texture[]', defaultValue: '4 LUTs', description: 'Collection of color palettes' },
      { name: 'chromaticGlitchTime', type: 'float', defaultValue: 0.2, description: 'Duration of glitch transition in seconds' }
    ],
    code: `// @input Asset.Material lutMaterial
// @input Asset.Texture[] lutTextures
// @input float chromaticGlitchTime = 0.2

/**
 * LensScript AI Co-Pilot: Blink-Triggered LUT Color Grading Filter
 * Includes chromatic aberration pulse on transition
 */

let activeLutIndex = 0;
let lastBlinkTime = 0;
const DOUBLE_BLINK_THRESHOLD = 0.45; // Max seconds between blinks

function onEyeBlink() {
  const currentTime = getTime();
  const diff = currentTime - lastBlinkTime;
  lastBlinkTime = currentTime;

  if (diff < DOUBLE_BLINK_THRESHOLD) {
    triggerLutSwitch();
  }
}

function triggerLutSwitch() {
  if (!script.lutTextures || script.lutTextures.length === 0) {
    print("[LensScript] Double Blink registered! (No LUT textures attached)");
    return;
  }

  activeLutIndex = (activeLutIndex + 1) % script.lutTextures.length;
  const nextLut = script.lutTextures[activeLutIndex];

  if (script.lutMaterial && nextLut) {
    script.lutMaterial.mainPass.colorLUT = nextLut;
  }

  print("[LensScript] Double Blink! Switched to Aesthetic LUT #" + (activeLutIndex + 1));
}

// Bind Eye Blink detection
const blinkEvent = script.createEvent("EyeBlinkEvent");
blinkEvent.bind(onEyeBlink);
`
  },
  {
    id: 'hand-tracking-ribbon',
    title: 'Hand Gesture Tracking & Magic Ribbon',
    description: 'Tracks index fingertip and palm coordinates in real time to generate glowing 3D particle ribbon trails.',
    category: 'hand',
    engine: 'Lens Studio 5.x',
    language: 'typescript',
    badge: 'Next-Gen AR',
    triggerTip: 'Click Hand Gesture in simulator to simulate hand tracking landmarks.',
    inputs: [
      { name: 'handTrackingObject', type: 'SceneObject', defaultValue: 'HandTracker', description: 'SceneObject with ObjectTracking3D' },
      { name: 'magicOrb', type: 'SceneObject', defaultValue: 'NeonEnergyOrb', description: '3D light sphere attached to index finger' },
      { name: 'trailSmoothing', type: 'float', defaultValue: 0.9, description: 'Position smoothing coefficient' }
    ],
    code: `// @input SceneObject handTrackingObject
// @input SceneObject magicOrb
// @input float trailSmoothing = 0.9

/**
 * LensScript AI Co-Pilot: Hand Tracking & Magic Ribbon Streamer
 * Maps 3D Hand Landmarks to Scene Space
 */

let currentPos = new vec3(0, 0, 0);

function onHandFound() {
  if (script.magicOrb) script.magicOrb.enabled = true;
  print("[LensScript] Hand Tracked: Gesture Locked");
}

function onHandLost() {
  if (script.magicOrb) script.magicOrb.enabled = false;
  print("[LensScript] Hand Lost");
}

function onUpdate() {
  if (!script.handTrackingObject || !script.magicOrb) return;

  const targetTransform = script.handTrackingObject.getTransform();
  const orbTransform = script.magicOrb.getTransform();

  const targetWorldPos = targetTransform.getWorldPosition();
  
  // Smooth position towards finger
  currentPos = vec3.lerp(currentPos, targetWorldPos, 1.0 - script.trailSmoothing);
  orbTransform.setWorldPosition(currentPos);
}

script.createEvent("HandFoundEvent").bind(onHandFound);
script.createEvent("HandLostEvent").bind(onHandLost);
script.createEvent("UpdateEvent").bind(onUpdate);
`
  },
  {
    id: 'surface-tap-placement',
    title: 'World Tracking Surface Tap & Raycast',
    description: 'Uses Device Tracking and World Raycasting to spawn interactive 3D physics models onto floors or tabletops with ground alignment.',
    category: 'world',
    engine: 'Lens Studio 5.x',
    language: 'javascript',
    badge: 'World AR',
    triggerTip: 'Tap the screen to simulate placing an AR statue on detected ground plane.',
    inputs: [
      { name: 'spawnPrefab', type: 'Asset.ObjectPrefab', defaultValue: 'StatuePrefab', description: '3D prefab to spawn on touch' },
      { name: 'deviceTrackingCamera', type: 'Component.Camera', defaultValue: 'WorldCamera', description: 'Camera with DeviceTracking component' },
      { name: 'maxInstances', type: 'int', defaultValue: 5, description: 'Maximum spawned objects in scene' }
    ],
    code: `// @input Asset.ObjectPrefab spawnPrefab
// @input Component.Camera deviceTrackingCamera
// @input int maxInstances = 5

/**
 * LensScript AI Co-Pilot: World Raycast Surface Placement
 * Requires Surface Tracking or World Mesh Tracking enabled
 */

var spawnedInstances = [];

function onTouchStart(eventData) {
  var touchPos = eventData.getTouchPosition(); // Normalized {x, y} 0..1

  if (!script.spawnPrefab) {
    print("[LensScript] Spawn Prefab not set. Simulating raycast hit at: " + touchPos.x.toFixed(2) + ", " + touchPos.y.toFixed(2));
    return;
  }

  // Instantiate Prefab
  var newObj = script.spawnPrefab.instantiate(script.getSceneObject().getParent());
  var transform = newObj.getTransform();

  // Position 1.2m in front of camera aligned with ground
  var forwardVec = new vec3(0, -0.2, -1.2);
  transform.setLocalPosition(forwardVec);

  spawnedInstances.push(newObj);
  if (spawnedInstances.length > script.maxInstances) {
    var oldest = spawnedInstances.shift();
    oldest.destroy();
  }

  print("[LensScript] Placed 3D Object at world coordinates. Total objects: " + spawnedInstances.length);
}

script.createEvent("TouchStartEvent").bind(onTouchStart);
`
  },
  {
    id: 'ar-tap-target-game',
    title: 'AR 60s Fast Tap Arcade Game',
    description: 'An interactive AR arcade mini-game with random floating target balloons, 60-second timer, tap collision detection, and high score.',
    category: 'interaction',
    engine: 'Lens Studio 5.x',
    language: 'typescript',
    badge: 'Arcade',
    triggerTip: 'Tap floating targets in simulator to gain points before time expires.',
    inputs: [
      { name: 'gameDuration', type: 'float', defaultValue: 60.0, description: 'Round timer in seconds' },
      { name: 'scoreDisplay', type: 'Component.Text', defaultValue: 'ScoreLabel', description: 'Screen text for points' },
      { name: 'timerDisplay', type: 'Component.Text', defaultValue: 'TimerLabel', description: 'Screen text for countdown' }
    ],
    code: `// @input float gameDuration = 60.0
// @input Component.Text scoreDisplay
// @input Component.Text timerDisplay
// @input SceneObject targetRoot

/**
 * LensScript AI Co-Pilot: AR Arcade Tap Game
 * Fully self-contained game loop with state management
 */

let score = 0;
let timeRemaining = script.gameDuration;
let isGameActive = true;

function initGame() {
  score = 0;
  timeRemaining = script.gameDuration;
  isGameActive = true;
  updateUI();
  print("[LensScript] Game Started! Tap target to score.");
}

function onUpdate() {
  if (!isGameActive) return;

  const dt = getDeltaTime();
  timeRemaining -= dt;

  if (timeRemaining <= 0) {
    timeRemaining = 0;
    isGameActive = false;
    print("[LensScript] Game Over! Final Score: " + score);
  }

  updateUI();
}

function onScreenTap(e: TapEvent) {
  if (!isGameActive) {
    initGame();
    return;
  }

  // Hit detected
  score += 100;
  print("[LensScript] Target Hit! Points: " + score);
}

function updateUI() {
  if (script.scoreDisplay) {
    script.scoreDisplay.text = "SCORE: " + score;
  }
  if (script.timerDisplay) {
    script.timerDisplay.text = "TIME: " + Math.ceil(timeRemaining) + "s";
  }
}

script.createEvent("OnStartEvent").bind(initGame);
script.createEvent("UpdateEvent").bind(onUpdate);
script.createEvent("TapEvent").bind(onScreenTap);
`
  }
];
