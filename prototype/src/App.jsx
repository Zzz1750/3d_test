import React from 'react'
import 'aframe'
import './App.css'

// Remembered Initial Camera State
export const INITIAL_CAMERA_CONFIG = {
  position: { x: -0.15, y: 0.35, z: 5.688 },
  rotation: { x: -18.11, y: 22.12, z: 0 },
  frustumSize: 2.9,
  near: 0.01,
  far: 2000
}

// Smooth easing function for fluid camera motion
function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

// Camera Keyframe Sequence
export const CAMERA_KEYFRAMES = [
  // Stage 0: Initial default view (0s to 4.0s)
  {
    type: 'hold',
    startTime: 0.0,
    endTime: 4.0,
    pos: { x: -0.15, y: 0.35, z: 5.688 },
    rot: { x: -18.11, y: 22.12, z: 0 },
    frustum: 2.9
  },
  // Stage 1: 1st Animation - Zoom into right (4.0s to 6.5s, duration 2.5s)
  {
    type: 'transition',
    startTime: 4.0,
    endTime: 6.5,
    fromPos: { x: -0.15, y: 0.35, z: 5.688 },
    fromRot: { x: -18.11, y: 22.12, z: 0 },
    fromFrustum: 2.9,
    toPos: { x: 1.85, y: 0.2, z: 5.688 },
    toRot: { x: -18.11, y: 22.12, z: 0 },
    toFrustum: 1.6
  },
  // Stage 2: Hold at right view for 3 seconds (6.5s to 9.5s)
  {
    type: 'hold',
    startTime: 6.5,
    endTime: 9.5,
    pos: { x: 1.85, y: 0.2, z: 5.688 },
    rot: { x: -18.11, y: 22.12, z: 0 },
    frustum: 1.6
  },
  // Stage 3: 2nd Animation - Small gentle turn to the left with increased zoom (9.5s to 12.2s, duration 2.7s)
  {
    type: 'transition',
    startTime: 9.5,
    endTime: 12.2,
    fromPos: { x: 1.85, y: 0.2, z: 5.688 },
    fromRot: { x: -18.11, y: 22.12, z: 0 },
    fromFrustum: 1.6,
    toPos: { x: 1.15, y: 0.2, z: 5.688 },
    toRot: { x: -18.11, y: 22.12, z: 0 },
    toFrustum: 1.35
  },
  // Stage 4: Hold after 2nd animation for 10 seconds (12.2s to 22.2s)
  {
    type: 'hold',
    startTime: 12.2,
    endTime: 22.2,
    pos: { x: 1.15, y: 0.2, z: 5.688 },
    rot: { x: -18.11, y: 22.12, z: 0 },
    frustum: 1.35
  },
  // Stage 5: 3rd Animation - Move further left with zoom out (22.2s to 24.9s, duration 2.7s)
  {
    type: 'transition',
    startTime: 22.2,
    endTime: 24.9,
    fromPos: { x: 1.15, y: 0.2, z: 5.688 },
    fromRot: { x: -18.11, y: 22.12, z: 0 },
    fromFrustum: 1.35,
    toPos: { x: -0.25, y: 0.2, z: 5.688 },
    toRot: { x: -17.11, y: 22.12, z: 0 },
    toFrustum: 1.6
  },
  // Stage 6: Hold after 3rd animation for 5 seconds (24.9s to 29.9s)
  {
    type: 'hold',
    startTime: 24.9,
    endTime: 29.9,
    pos: { x: -0.25, y: 0.2, z: 5.688 },
    rot: { x: -17.11, y: 22.12, z: 0 },
    frustum: 1.6
  },
  // Stage 7: 4th Animation - Zoom in more, rot X back to -18.11, slightly more left (29.9s to 32.5s, duration 2.6s)
  {
    type: 'transition',
    startTime: 29.9,
    endTime: 32.5,
    fromPos: { x: -0.25, y: 0.2, z: 5.688 },
    fromRot: { x: -17.11, y: 22.12, z: 0 },
    fromFrustum: 1.6,
    toPos: { x: -0.65, y: 0.2, z: 5.688 },
    toRot: { x: -18.11, y: 22.12, z: 0 },
    toFrustum: 0.8
  }
]

// Register Orthographic Camera Component
if (typeof window !== 'undefined' && window.AFRAME) {
  if (!window.AFRAME.components['ortho-camera']) {
    window.AFRAME.registerComponent('ortho-camera', {
      schema: {
        frustumSize: { type: 'number', default: INITIAL_CAMERA_CONFIG.frustumSize },
        near: { type: 'number', default: INITIAL_CAMERA_CONFIG.near },
        far: { type: 'number', default: INITIAL_CAMERA_CONFIG.far }
      },

      init: function () {
        this.updateCamera = this.updateCamera.bind(this)
        const THREE = window.AFRAME.THREE
        const aspect = window.innerWidth / window.innerHeight
        const halfSize = this.data.frustumSize / 2

        this.orthoCamera = new THREE.OrthographicCamera(
          -halfSize * aspect,
          halfSize * aspect,
          halfSize,
          -halfSize,
          this.data.near,
          this.data.far
        )
        this.orthoCamera.updateProjectionMatrix()

        // Replace default camera on entity
        this.el.setObject3D('camera', this.orthoCamera)

        // Ensure scene uses this camera
        if (this.el.sceneEl) {
          this.el.sceneEl.camera = this.orthoCamera
        }

        window.addEventListener('resize', this.updateCamera)
      },

      update: function () {
        if (!this.orthoCamera) return
        this.updateCamera()
      },

      updateCamera: function () {
        if (!this.orthoCamera) return
        const aspect = window.innerWidth / window.innerHeight
        const halfSize = this.data.frustumSize / 2
        this.orthoCamera.left = -halfSize * aspect
        this.orthoCamera.right = halfSize * aspect
        this.orthoCamera.top = halfSize
        this.orthoCamera.bottom = -halfSize
        this.orthoCamera.near = this.data.near
        this.orthoCamera.far = this.data.far
        this.orthoCamera.updateProjectionMatrix()

        if (this.el.sceneEl) {
          this.el.sceneEl.camera = this.orthoCamera
        }
      },

      remove: function () {
        window.removeEventListener('resize', this.updateCamera)
      }
    })
  }

  // Multi-Keyframe Camera Animator Component
  if (!window.AFRAME.components['camera-animator']) {
    window.AFRAME.registerComponent('camera-animator', {
      schema: {
        enabled: { type: 'boolean', default: true }
      },
      init: function () {
        this.elapsedTime = 0
        this.cameraEl = this.el.querySelector('[ortho-camera]') || this.el
        this.initialPos = { ...INITIAL_CAMERA_CONFIG.position }
        this.initialRot = { ...INITIAL_CAMERA_CONFIG.rotation }
        this.initialFrustum = INITIAL_CAMERA_CONFIG.frustumSize

        // Explicitly set initial position and rotation from remembered state
        this.el.object3D.position.set(this.initialPos.x, this.initialPos.y, this.initialPos.z)
        const THREE = window.AFRAME.THREE
        this.el.object3D.rotation.set(
          THREE.MathUtils.degToRad(this.initialRot.x),
          THREE.MathUtils.degToRad(this.initialRot.y),
          THREE.MathUtils.degToRad(this.initialRot.z)
        )
      },
      tick: function (t, dt) {
        if (!dt || !this.data.enabled) return

        this.elapsedTime += dt / 1000
        const time = this.elapsedTime
        const THREE = window.AFRAME.THREE

        // Find active keyframe stage
        let activeKeyframe = null
        for (let i = 0; i < CAMERA_KEYFRAMES.length; i++) {
          const kf = CAMERA_KEYFRAMES[i]
          if (time >= kf.startTime && time < kf.endTime) {
            activeKeyframe = kf
            break
          }
        }

        // If beyond last keyframe, hold at the last frame's final state
        if (!activeKeyframe) {
          const lastKf = CAMERA_KEYFRAMES[CAMERA_KEYFRAMES.length - 1]
          if (time >= lastKf.endTime) {
            const finalPos = lastKf.type === 'transition' ? lastKf.toPos : lastKf.pos
            const finalRot = lastKf.type === 'transition' ? lastKf.toRot : lastKf.rot
            const finalFrustum = lastKf.type === 'transition' ? lastKf.toFrustum : lastKf.frustum

            this.applyTransform(finalPos, finalRot, finalFrustum)
            return
          }
          activeKeyframe = CAMERA_KEYFRAMES[0]
        }

        if (activeKeyframe.type === 'hold') {
          this.applyTransform(activeKeyframe.pos, activeKeyframe.rot, activeKeyframe.frustum)
        } else if (activeKeyframe.type === 'transition') {
          const progress = Math.min(
            Math.max((time - activeKeyframe.startTime) / (activeKeyframe.endTime - activeKeyframe.startTime), 0),
            1
          )
          const ease = easeInOutCubic(progress)

          const currentX = activeKeyframe.fromPos.x + (activeKeyframe.toPos.x - activeKeyframe.fromPos.x) * ease
          const currentY = activeKeyframe.fromPos.y + (activeKeyframe.toPos.y - activeKeyframe.fromPos.y) * ease
          const currentZ = activeKeyframe.fromPos.z + (activeKeyframe.toPos.z - activeKeyframe.fromPos.z) * ease

          const currentRotX = activeKeyframe.fromRot.x + (activeKeyframe.toRot.x - activeKeyframe.fromRot.x) * ease
          const currentRotY = activeKeyframe.fromRot.y + (activeKeyframe.toRot.y - activeKeyframe.fromRot.y) * ease
          const currentRotZ = activeKeyframe.fromRot.z + (activeKeyframe.toRot.z - activeKeyframe.fromRot.z) * ease

          const currentFrustum =
            activeKeyframe.fromFrustum + (activeKeyframe.toFrustum - activeKeyframe.fromFrustum) * ease

          this.applyTransform(
            { x: currentX, y: currentY, z: currentZ },
            { x: currentRotX, y: currentRotY, z: currentRotZ },
            currentFrustum
          )
        }
      },
      applyTransform: function (pos, rot, frustum) {
        const THREE = window.AFRAME.THREE

        // Set Position
        if (pos) {
          this.el.object3D.position.set(pos.x, pos.y, pos.z)
        }

        // Set Rotation
        if (rot) {
          this.el.object3D.rotation.set(
            THREE.MathUtils.degToRad(rot.x),
            THREE.MathUtils.degToRad(rot.y),
            THREE.MathUtils.degToRad(rot.z)
          )
        }

        // Set Orthographic Camera Frustum Size
        if (frustum) {
          const orthoComp = this.cameraEl.components && this.cameraEl.components['ortho-camera']
          if (orthoComp && orthoComp.orthoCamera) {
            orthoComp.data.frustumSize = frustum
            const aspect = window.innerWidth / window.innerHeight
            const halfSize = frustum / 2
            orthoComp.orthoCamera.left = -halfSize * aspect
            orthoComp.orthoCamera.right = halfSize * aspect
            orthoComp.orthoCamera.top = halfSize
            orthoComp.orthoCamera.bottom = -halfSize
            orthoComp.orthoCamera.updateProjectionMatrix()
          }
        }
      }
    })
  }

  // Component to ensure all materials receive full ambient environment brightness
  if (!window.AFRAME.components['world-brightness']) {
    window.AFRAME.registerComponent('world-brightness', {
      schema: {
        boost: { type: 'number', default: 1.0 }
      },
      init: function () {
        this.el.addEventListener('model-loaded', () => {
          const mesh = this.el.getObject3D('mesh')
          if (mesh) {
            mesh.traverse((node) => {
              if (node.isMesh && node.material) {
                const mats = Array.isArray(node.material) ? node.material : [node.material]
                mats.forEach((mat) => {
                  mat.roughness = Math.min(mat.roughness, 0.7)
                  mat.metalness = Math.min(mat.metalness, 0.1)
                  mat.needsUpdate = true
                })
              }
            })
          }
        })
      }
    })
  }
  // Component to play GLTF animations as authored and track the 1000 frames
  if (!window.AFRAME.components['glb-animation-player']) {
    window.AFRAME.registerComponent('glb-animation-player', {
      schema: {
        timeScale: { type: 'number', default: 1.0 },
        totalFrames: { type: 'number', default: 1000 }
      },
      init: function () {
        this.mixer = null
        this.actions = []
        this.frameEl = null
        this.maxDuration = 0
        this.fps = 60
        this.fpsFrames = 0
        this.fpsLastTime = typeof performance !== 'undefined' ? performance.now() : 0

        this.el.addEventListener('model-loaded', (e) => {
          const THREE = window.AFRAME.THREE
          const model = e.detail.model || this.el.getObject3D('mesh')
          if (!model) return

          const animations = model.animations || (e.detail.model && e.detail.model.animations)
          if (animations && animations.length > 0) {
            this.mixer = new THREE.AnimationMixer(model)
            this.mixer.timeScale = this.data.timeScale

            // Find the master timeline duration across all tracks
            const maxDuration = Math.max(...animations.map((c) => c.duration || 0))
            this.maxDuration = maxDuration

            // Synchronize all clips to the full master duration
            // This prevents shorter/delayed tracks from looping early on their own
            animations.forEach((clip) => {
              clip.duration = maxDuration
            })

            // Play all synchronized tracks
            this.actions = animations.map((clip) => {
              const action = this.mixer.clipAction(clip)
              action.play()
              return action
            })
            console.log(`[glb-animation-player] Playing ${this.actions.length} synchronized animation tracks. Master duration: ${maxDuration}s`)
          } else {
            console.warn('[glb-animation-player] No animations found in model.')
          }
        })
      },
      update: function () {
        if (this.mixer) {
          this.mixer.timeScale = this.data.timeScale
        }
      },
      tick: function (t, dt) {
        if (!dt) return

        // Compute stable real-time FPS
        this.fpsFrames++
        const now = typeof performance !== 'undefined' ? performance.now() : Date.now()
        if (now - this.fpsLastTime >= 300) {
          this.fps = Math.round((this.fpsFrames * 1000) / (now - this.fpsLastTime))
          this.fpsFrames = 0
          this.fpsLastTime = now
        }

        if (this.mixer) {
          this.mixer.update(dt / 1000)

          if (this.actions && this.actions.length > 0) {
            const duration = this.maxDuration || (this.actions[0].getClip().duration) || 1
            const currentTime = this.actions[0] ? (this.actions[0].time % duration) : 0

            const totalFrames = this.data.totalFrames || 1000
            const progress = currentTime / duration
            const currentFrame = Math.min(Math.floor(progress * totalFrames), totalFrames)

            if (!this.frameEl) {
              this.frameEl = document.getElementById('animation-frame-info')
            }

            if (this.frameEl) {
              this.frameEl.textContent = `Frame: ${currentFrame} / ${totalFrames} • ${currentTime.toFixed(1)}s / ${duration.toFixed(1)}s • ${this.fps} FPS`
            }
          }
        }
      },
      remove: function () {
        if (this.mixer) {
          this.mixer.stopAllAction()
          this.mixer = null
          this.actions = []
        }
      }
    })
  }
}

export default function App() {
  return (
    <div className="app-viewport">
      {/* Top Navigation Bar */}
      <header className="app-navbar">
        {/* Left: Brand Logo */}
        <div className="navbar-logo">
          <img src="/images/logo.png" alt="Comply2Reg Logo" />
        </div>

        {/* Center: Navigation Links */}
        <nav className="navbar-links" aria-label="Main Navigation">
          <a href="#solutions" className="nav-item">Solutions</a>
          <a href="#fintech" className="nav-item">Fintech</a>
          <a href="#resource" className="nav-item">Resource</a>
          <a href="#pricing" className="nav-item">Pricing</a>
          <a href="#about" className="nav-item">About us</a>
        </nav>

        {/* Right: Demo Action Button */}
        <div className="navbar-actions">
          <button className="btn-demo" type="button">
            <img src="/images/icon.png" alt="" className="demo-icon" />
            <span>Demo</span>
          </button>
        </div>
      </header>

      {/* Bottom Left Hero Headline */}
      <div className="hero-headline-container">
        <h1 className="hero-headline">
          AI-Powered Compliance<br />Solution
        </h1>
      </div>

      {/* Bottom Live Frame Counter Badge */}
      <div className="frame-overlay-bottom">
        <div className="frame-badge">
          <span id="animation-frame-info">Frame: 0 / 1000 • 0.0s / 33.3s • 60 FPS</span>
        </div>
      </div>

      {/* Bottom Right Avatar */}
      <div className="app-footer-avatar">
        <img src="/images/avatar.png" alt="Avatar" />
      </div>

      {/* Black Edge Vignette */}
      <div className="edge-gradient-overlay" aria-hidden="true"></div>

      <a-scene
        embedded
        vr-mode-ui="enabled: false"
        device-orientation-permission-ui="enabled: false"
        ar-mode-ui="enabled: false"
        loading-screen="enabled: false"
        renderer="antialias: true; colorManagement: true; toneMapping: ACESFilmic"
        background="color: #ffffff"
      >
        {/* Increased High-Luminance Ambient & Radiance Lighting */}
        <a-entity light="type: ambient; intensity: 3.0; color: #ffffff"></a-entity>
        <a-entity light="type: hemisphere; groundColor: #ffffff; color: #ffffff; intensity: 2.8"></a-entity>
        <a-entity light="type: directional; intensity: 2.2; color: #ffffff; castShadow: false" position="5 12 8"></a-entity>
        <a-entity light="type: directional; intensity: 1.6; color: #ffffff; castShadow: false" position="-5 8 -4"></a-entity>

        {/* Centered 3D Model with 1000-frame master animation */}
        <a-entity
          gltf-model="/models/animation.glb"
          position="0 0 0"
          world-brightness
          glb-animation-player="totalFrames: 1000"
        ></a-entity>

        {/* Orthographic Camera Rig with Multi-Keyframe Animation Sequence */}
        <a-entity
          id="camera-rig"
          position="-0.15 0.35 5.688"
          rotation="-18.11 22.12 0"
          camera-animator
        >
          <a-camera
            id="main-camera"
            ortho-camera="frustumSize: 2.9; near: 0.01; far: 2000"
            look-controls="enabled: false"
            wasd-controls="enabled: false"
          ></a-camera>
        </a-entity>
      </a-scene>
    </div>
  )
}

