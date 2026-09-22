import { ApiDocSection } from '../types/lens';

export const LENS_API_DOCS: ApiDocSection[] = [
  {
    id: 'events-touch',
    title: 'Touch & Tap Events',
    category: 'events',
    description: 'Intercept user screen gestures including single taps, touch down, release, and drag movements.',
    signature: 'script.createEvent("TapEvent").bind((eventData: TapEvent) => void)',
    snippet: `// Listen to single tap anywhere on screen
script.createEvent("TapEvent").bind(function(eventData) {
  print("Screen Tapped!");
});

// Touch Start with coordinates
script.createEvent("TouchStartEvent").bind(function(eventData) {
  var touchPos = eventData.getTouchPosition(); // vec2 (0.0 to 1.0)
  print("Touch at: " + touchPos.x + ", " + touchPos.y);
});`
  },
  {
    id: 'events-face',
    title: 'Facial Expression & Landmarks',
    category: 'events',
    description: 'Trigger actions based on facial blendshapes: mouth opening, eye blinks, brows raising, smile detection.',
    signature: 'script.createEvent("MouthOpenedEvent" | "EyeBlinkEvent" | "BrowsRaisedEvent").bind(fn)',
    snippet: `// Mouth Aperture Trigger
script.createEvent("MouthOpenedEvent").bind(function() {
  print("Mouth opened wide!");
});

// Eye Blink Trigger
script.createEvent("EyeBlinkEvent").bind(function() {
  print("Eye blinked!");
});`
  },
  {
    id: 'math-vectors',
    title: 'Vector & Quaternion Math',
    category: 'math',
    description: 'Snapchat Lens Studio engine provides built-in vec2, vec3, vec4, and quat classes for spatial calculations.',
    signature: 'new vec3(x, y, z) | quat.fromEulerVec(angles) | vec3.lerp(a, b, t)',
    snippet: `var posA = new vec3(0, 10, 0);
var posB = new vec3(0, 20, 5);
var interpolated = vec3.lerp(posA, posB, 0.5);

// Euler to Quaternion Rotation
var eulerAngles = new vec3(0, 90, 0); // deg
var rotationQuat = quat.fromEulerAngles(
  MathUtils.degToRad(eulerAngles.x),
  MathUtils.degToRad(eulerAngles.y),
  MathUtils.degToRad(eulerAngles.z)
);`
  },
  {
    id: 'transform-manipulation',
    title: 'Transform & SceneObject Hierarchy',
    category: 'components',
    description: 'Inspect and modify local and world position, rotation, scale, parenting, and visibility.',
    signature: 'sceneObject.getTransform().setWorldPosition(vec3)',
    snippet: `var transform = script.getSceneObject().getTransform();

// Set local coordinates
transform.setLocalPosition(new vec3(0, 5, -20));
transform.setLocalScale(new vec3(1.5, 1.5, 1.5));

// Hierarchy Traversal
var parent = script.getSceneObject().getParent();
var childrenCount = script.getSceneObject().getChildrenCount();`
  },
  {
    id: 'vfx-particles',
    title: 'VFX & Particle System Control',
    category: 'assets',
    description: 'Programmatically trigger particle bursts, modulate spawn rates, and alter VFX asset properties on the fly.',
    signature: 'vfxComponent.asset.properties["paramName"] = value',
    snippet: `// Modulate VFX Spawn Rate
if (script.vfxComponent) {
  // Set dynamic graph uniform
  script.vfxComponent.asset.properties["spawnRate"] = 120.0;
  script.vfxComponent.asset.properties["particleColor"] = new vec4(1, 0.9, 0, 1);
}`
  },
  {
    id: 'audio-playback',
    title: 'Audio Component Control',
    category: 'assets',
    description: 'Play sound effects, loop background ambiances, adjust volume and stereo panning.',
    signature: 'audioComponent.play(loops: number) | audioComponent.stop(fade: boolean)',
    snippet: `// Play sound once with full volume
if (script.audioComponent) {
  script.audioComponent.volume = 1.0;
  script.audioComponent.play(1); // 1 = play once, -1 = loop forever
}`
  }
];
