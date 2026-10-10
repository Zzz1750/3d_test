import 'aframe'
import './Scene3D.css'

// Default Camera Configuration
const INITIAL_CAMERA_CONFIG = {
  position: { x: -0.15, y: 0.35, z: 5.688 },
  rotation: { x: -18.11, y: 22.12, z: 0 },
  frustumSize: 4.2,
  near: -500,
  far: 20000
}

// Register Orthographic Camera Component
if (typeof window !== 'undefined' && window.AFRAME) {
  if (!window.AFRAME.components['ortho-camera']) {
    window.AFRAME.registerComponent('ortho-camera', {
      schema: {
        frustumSize: { type: 'number', default: INITIAL_CAMERA_CONFIG.frustumSize },
        near: { type: 'number', default: INITIAL_CAMERA_CONFIG.near },
        far: { type: 'number', default: INITIAL_CAMERA_CONFIG.far }
      },

      getAspect: function () {
        const sceneEl = this.el.sceneEl
        const canvas = sceneEl && sceneEl.canvas
        const w = (canvas && canvas.clientWidth) || (sceneEl && sceneEl.clientWidth) || window.innerWidth
        const h = (canvas && canvas.clientHeight) || (sceneEl && sceneEl.clientHeight) || window.innerHeight
        return (w && h) ? (w / h) : (window.innerWidth / window.innerHeight)
      },

      init: function () {
        this.updateCamera = this.updateCamera.bind(this)
        const THREE = window.AFRAME.THREE
        const aspect = this.getAspect()
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
          this.el.sceneEl.addEventListener('render-target-loaded', this.updateCamera)
        }

        window.addEventListener('resize', this.updateCamera)

        if (typeof ResizeObserver !== 'undefined' && this.el.sceneEl) {
          this.resizeObserver = new ResizeObserver(() => {
            this.updateCamera()
          })
          this.resizeObserver.observe(this.el.sceneEl)
        }
      },

      update: function () {
        if (!this.orthoCamera) return
        this.updateCamera()
      },

      updateCamera: function () {
        if (!this.orthoCamera) return
        const aspect = this.getAspect()
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
        if (this.el.sceneEl) {
          this.el.sceneEl.removeEventListener('render-target-loaded', this.updateCamera)
        }
        if (this.resizeObserver) {
          this.resizeObserver.disconnect()
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

  // Component to play GLTF animations as authored and track the 1100 frames
  if (!window.AFRAME.components['glb-animation-player']) {
    window.AFRAME.registerComponent('glb-animation-player', {
      schema: {
        enabled: { type: 'boolean', default: false },
        timeScale: { type: 'number', default: 1.0 },
        totalFrames: { type: 'number', default: 1100 }
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
            animations.forEach((clip) => {
              clip.duration = maxDuration
            })

            // Prepare synchronized tracks
            this.actions = animations.map((clip) => {
              const action = this.mixer.clipAction(clip)
              if (this.data.enabled) {
                action.play()
              }
              return action
            })
            console.log(`[glb-animation-player] Initialized ${this.actions.length} tracks. Master duration: ${maxDuration}s`)
          }

          // Emit event for React loading manager
          window.dispatchEvent(new CustomEvent('glb-model-ready'))
        })
      },
      update: function (oldData) {
        if (this.mixer) {
          this.mixer.timeScale = this.data.timeScale
        }
        if (this.data.enabled && (!oldData || !oldData.enabled)) {
          if (this.mixer && this.actions && this.actions.length > 0) {
            this.mixer.setTime(0)
            this.actions.forEach((action) => {
              action.reset()
              action.play()
            })
          }
        }
      },
      tick: function (t, dt) {
        if (!dt || !this.data.enabled) return
        if (this.mixer) {
          this.mixer.update(dt / 1000)
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

  // Interactive Hover Tilt, Elevation & Animation Reactor
  if (!window.AFRAME.components['hover-3d-reactor']) {
    window.AFRAME.registerComponent('hover-3d-reactor', {
      init: function () {
        this.targetRotX = 0
        this.targetRotY = 0
        this.targetPosY = 0
        this.targetScale = 1.0

        this.currentRotX = 0
        this.currentRotY = 0
        this.currentPosY = 0
        this.currentScale = 1.0

        this.isZoomed = false
        this.isInside = false
        this.lastNx = 0
        this.lastNy = 0

        const sceneEl = this.el.sceneEl
        const container = sceneEl
          ? (sceneEl.closest('.hero-3d-col') || sceneEl.parentElement || sceneEl)
          : null

        this.onFocusStation = (e) => {
          const id = e.detail && e.detail.stationId
          this.isZoomed = Boolean(id)
          // Keep tilt neutral on both zoom-in and zoom-out so the camera transition is completely calm
          this.targetRotX = 0
          this.targetRotY = 0
        }

        window.addEventListener('city-focus-station', this.onFocusStation)

        this.onMouseMove = (e) => {
          if (!container) return
          const rect = container.getBoundingClientRect()
          const nx = (e.clientX - rect.left) / rect.width - 0.5
          const ny = (e.clientY - rect.top) / rect.height - 0.5
          this.lastNx = nx
          this.lastNy = ny
          this.isInside = true

          // While zoomed into any building, turn off cursor tilt completely
          if (this.isZoomed) return

          // Very subtle micro-tilt: ±0.3° pitch and ±0.9° yaw
          this.targetRotY = nx * 1.8
          this.targetRotX = -ny * 0.6
        }

        this.onMouseEnter = () => {
          this.isInside = true
          if (this.isZoomed) return
          this.targetPosY = 0.04
          this.targetScale = 1.015

          // Gently elevate character animation tempo on hover
          const childModel = this.el.querySelector('#hero-3d-model')
          const animComp = childModel && childModel.components['glb-animation-player']
          if (animComp && animComp.mixer) {
            animComp.mixer.timeScale = 1.1
          }
        }

        this.onMouseLeave = () => {
          this.isInside = false
          this.targetRotX = 0
          this.targetRotY = 0
          this.targetPosY = 0
          this.targetScale = 1.0

          // Restore normal playback speed
          const childModel = this.el.querySelector('#hero-3d-model')
          const animComp = childModel && childModel.components['glb-animation-player']
          if (animComp && animComp.mixer) {
            animComp.mixer.timeScale = 1.0
          }
        }

        if (container) {
          container.addEventListener('mousemove', this.onMouseMove)
          container.addEventListener('mouseenter', this.onMouseEnter)
          container.addEventListener('mouseleave', this.onMouseLeave)
        }
      },
      tick: function () {
        // Slow and luxurious cinematic lerp inertia
        const lerpFactor = 0.028
        this.currentRotX += (this.targetRotX - this.currentRotX) * lerpFactor
        this.currentRotY += (this.targetRotY - this.currentRotY) * lerpFactor
        this.currentPosY += (this.targetPosY - this.currentPosY) * lerpFactor
        this.currentScale += (this.targetScale - this.currentScale) * lerpFactor

        this.el.object3D.rotation.x = (this.currentRotX * Math.PI) / 180
        this.el.object3D.rotation.y = (this.currentRotY * Math.PI) / 180
        this.el.object3D.position.y = this.currentPosY
        this.el.object3D.scale.set(this.currentScale, this.currentScale, this.currentScale)
      },
      remove: function () {
        window.removeEventListener('city-focus-station', this.onFocusStation)
        const sceneEl = this.el.sceneEl
        const container = sceneEl
          ? (sceneEl.closest('.hero-3d-col') || sceneEl.parentElement || sceneEl)
          : null
        if (container) {
          container.removeEventListener('mousemove', this.onMouseMove)
          container.removeEventListener('mouseenter', this.onMouseEnter)
          container.removeEventListener('mouseleave', this.onMouseLeave)
        }
      }
    })
  }

  // Interactive Building Camera Zoom & Pan Controller
  const BASE_CAMERA_ROTATION = {
    x: -18.11,
    y: 22.12,
    z: 0
  }

  const CAMERA_TARGETS = {
    default: {
      pos: { x: -0.15, y: 0.35, z: 5.688 },
      frustum: 4.6
    },
    regpulse: {
      pos: { x: -1.05, y: 0.65, z: 5.3 },
      frustum: 1.55
    },
    regulens: {
      pos: { x: -2.6, y: -0.48, z: 3.8 },
      frustum: 1.6
    },
    gapanalyser: {
      pos: { x: -0.12, y: 0.35, z: 5.7 },
      frustum: 1.6
    },
    asklia: {
      pos: { x: -0.88, y: 0.58, z: 4.25 },
      frustum: 0.82
    },
    auditgeniee: {
      pos: { x: 0.70, y: 0.05, z: 5.15 },
      frustum: 1.20
    }
  }

  if (typeof window !== 'undefined') {
    window.__CAMERA_TARGETS = CAMERA_TARGETS
  }

  if (!window.AFRAME.components['camera-zoom-controller']) {
    window.AFRAME.registerComponent('camera-zoom-controller', {
      init: function () {
        this.targetPos = { ...CAMERA_TARGETS.default.pos }
        this.currentPos = { ...CAMERA_TARGETS.default.pos }
        this.targetFrustum = CAMERA_TARGETS.default.frustum
        this.currentFrustum = CAMERA_TARGETS.default.frustum

        this.baseRot = { ...BASE_CAMERA_ROTATION }
        this.targetRot = { ...BASE_CAMERA_ROTATION }
        this.currentRot = { ...BASE_CAMERA_ROTATION }

        this.activeStationId = null
        this.isZoomingOut = false
        this.cinematicStartTime = null
        this.cinematicDuration = 8000 // 8 seconds inspection window

        this.onFocusStation = (e) => {
          const id = e.detail && e.detail.stationId
          const wasZoomed = Boolean(this.activeStationId)
          this.activeStationId = id || null
          const targets = window.__CAMERA_TARGETS || CAMERA_TARGETS
          const target = (id && targets[id]) || targets.default
          this.targetPos = { ...target.pos }
          this.targetFrustum = target.frustum

          if (id) {
            this.isZoomingOut = false
            this.cinematicStartTime = performance.now()
          } else {
            this.isZoomingOut = wasZoomed
            this.cinematicStartTime = null
            this.targetRot = { ...BASE_CAMERA_ROTATION }
          }
        }

        window.addEventListener('city-focus-station', this.onFocusStation)
      },
      tick: function () {
        // Calibrated lerp rates: smooth and responsive transition
        const isZoomed = Boolean(this.activeStationId)
        const posLerp = isZoomed ? 0.020 : 0.024
        const rotLerp = 0.009

        // Calculate ultra-slow, micro-whisper cinematic camera drift during station inspection
        if (isZoomed && this.cinematicStartTime) {
          const elapsed = performance.now() - this.cinematicStartTime
          const rawProgress = Math.min(1.0, Math.max(0, elapsed / this.cinematicDuration))

          // Velvet-smooth S-curve progression across the full 8 seconds
          const eased = (1 - Math.cos(rawProgress * Math.PI)) / 2
          const sweepFactor = (eased - 0.5) * 2 // -1.0 to +1.0

          // Gentle 3.5-second blend so zoom begins rock-solid centered
          const blendIn = Math.min(1.0, elapsed / 3500)

          // Micro-whisper yaw drift (barely ±0.15°, zero roll, zero pitch)
          const sweepYaw = 0.15
          const currentYawOffset = sweepFactor * sweepYaw * blendIn

          this.targetRot = {
            x: BASE_CAMERA_ROTATION.x,
            y: BASE_CAMERA_ROTATION.y + currentYawOffset,
            z: BASE_CAMERA_ROTATION.z
          }

          this.currentPos.x += (this.targetPos.x - this.currentPos.x) * posLerp
        } else {
          this.targetRot = { ...BASE_CAMERA_ROTATION }
          this.currentPos.x += (this.targetPos.x - this.currentPos.x) * posLerp
        }

        this.currentPos.y += (this.targetPos.y - this.currentPos.y) * posLerp
        this.currentPos.z += (this.targetPos.z - this.currentPos.z) * posLerp
        this.currentFrustum += (this.targetFrustum - this.currentFrustum) * posLerp

        this.currentRot.x += (this.targetRot.x - this.currentRot.x) * rotLerp
        this.currentRot.y += (this.targetRot.y - this.currentRot.y) * rotLerp
        this.currentRot.z += (this.targetRot.z - this.currentRot.z) * rotLerp

        // Detect when zoom out reaches default position and signal completion
        if (this.isZoomingOut) {
          const dx = this.targetPos.x - this.currentPos.x
          const dy = this.targetPos.y - this.currentPos.y
          const dz = this.targetPos.z - this.currentPos.z
          const df = Math.abs(this.targetFrustum - this.currentFrustum)
          const distSq = dx * dx + dy * dy + dz * dz

          if (distSq < 0.003 && df < 0.05) {
            this.isZoomingOut = false
            window.dispatchEvent(new CustomEvent('city-zoom-out-complete'))
          }
        }

        this.el.object3D.position.set(this.currentPos.x, this.currentPos.y, this.currentPos.z)
        this.el.object3D.rotation.x = (this.currentRot.x * Math.PI) / 180
        this.el.object3D.rotation.y = (this.currentRot.y * Math.PI) / 180
        this.el.object3D.rotation.z = (this.currentRot.z * Math.PI) / 180

        const cameraEl = this.el.querySelector('#main-camera')
        const orthoComp = cameraEl && cameraEl.components['ortho-camera']
        if (orthoComp && orthoComp.orthoCamera) {
          const aspect = orthoComp.getAspect()
          const halfSize = this.currentFrustum / 2
          orthoComp.orthoCamera.left = -halfSize * aspect
          orthoComp.orthoCamera.right = halfSize * aspect
          orthoComp.orthoCamera.top = halfSize
          orthoComp.orthoCamera.bottom = -halfSize
          orthoComp.orthoCamera.updateProjectionMatrix()
        }
      },
      remove: function () {
        window.removeEventListener('city-focus-station', this.onFocusStation)
      }
    })
  }
}

export default function Scene3D({
  isLoaded = false,
  frustumSize = 4.6,
  modelScale = 1.0,
  modelPosition = "0 0 0",
  timeScale = 1.0
}) {
  return (
    <a-scene
      embedded
      vr-mode-ui="enabled: false"
      device-orientation-permission-ui="enabled: false"
      ar-mode-ui="enabled: false"
      loading-screen="enabled: false"
      renderer="antialias: true; colorManagement: true; toneMapping: ACESFilmic"
      background="color: #ffffff"
    >
      {/* High-Luminance Ambient & Radiance Lighting */}
      <a-entity light="type: ambient; intensity: 3.0; color: #ffffff"></a-entity>
      <a-entity light="type: hemisphere; groundColor: #ffffff; color: #ffffff; intensity: 2.8"></a-entity>
      <a-entity light="type: directional; intensity: 2.2; color: #ffffff; castShadow: false" position="5 12 8"></a-entity>
      <a-entity light="type: directional; intensity: 1.6; color: #ffffff; castShadow: false" position="-5 8 -4"></a-entity>

      {/* Interactive Hover Reactor Rig */}
      <a-entity id="interactive-3d-rig" hover-3d-reactor>
        <a-entity
          id="hero-3d-model"
          gltf-model={`${import.meta.env.BASE_URL}models/default.glb`}
          position={modelPosition}
          scale={`${modelScale} ${modelScale} ${modelScale}`}
          world-brightness
          glb-animation-player={`enabled: ${isLoaded}; timeScale: ${timeScale}; totalFrames: 1100`}
        ></a-entity>
      </a-entity>

      {/* Default Orthographic Camera Rig with Zoom Controller */}
      <a-entity
        id="camera-rig"
        position="-0.15 0.35 5.688"
        rotation="-18.11 22.12 0"
        camera-zoom-controller
      >
        <a-camera
          id="main-camera"
          camera="far: 20000; near: -500"
          ortho-camera={`frustumSize: ${frustumSize}; near: -500; far: 20000`}
          look-controls="enabled: false"
          wasd-controls="enabled: false"
        ></a-camera>
      </a-entity>
    </a-scene>
  )
}
