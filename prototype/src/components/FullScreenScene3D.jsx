import 'aframe'
import './FullScreenScene3D.css'

// Register Orthographic Camera Component if not registered yet
if (typeof window !== 'undefined' && window.AFRAME) {
  if (!window.AFRAME.components['ortho-camera']) {
    window.AFRAME.registerComponent('ortho-camera', {
      schema: {
        frustumSize: { type: 'number', default: 4.6 },
        near: { type: 'number', default: -500 },
        far: { type: 'number', default: 20000 }
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

        this.el.setObject3D('camera', this.orthoCamera)

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

  // World brightness component
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

  // Animation player for animation.glb
  if (!window.AFRAME.components['glb-animation-player']) {
    window.AFRAME.registerComponent('glb-animation-player', {
      schema: {
        enabled: { type: 'boolean', default: true },
        timeScale: { type: 'number', default: 1.0 },
        totalFrames: { type: 'number', default: 1100 }
      },
      init: function () {
        this.mixer = null
        this.actions = []

        this.el.addEventListener('model-loaded', (e) => {
          const THREE = window.AFRAME.THREE
          const model = e.detail.model || this.el.getObject3D('mesh')
          if (!model) return

          const animations = model.animations || (e.detail.model && e.detail.model.animations)
          if (animations && animations.length > 0) {
            this.mixer = new THREE.AnimationMixer(model)
            this.mixer.timeScale = this.data.timeScale

            const maxDuration = Math.max(...animations.map((c) => c.duration || 0))

            animations.forEach((clip) => {
              clip.duration = maxDuration
            })

            this.actions = animations.map((clip) => {
              const action = this.mixer.clipAction(clip)
              if (this.data.enabled) {
                action.play()
              }
              return action
            })
          }
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

  // Delayed smooth zoom controller (Phase 1 zoom -> 5s delay -> Phase 2 zoom more in & topper)
  if (window.AFRAME.components['delayed-zoom-controller']) {
    delete window.AFRAME.components['delayed-zoom-controller']
  }
  window.AFRAME.registerComponent('delayed-zoom-controller', {
    schema: {
      // Phase 1 (Initial zoom into right-bottom)
      delay: { type: 'number', default: 1000 },
      duration: { type: 'number', default: 2600 },
      targetX: { type: 'number', default: 1.75 },
      targetY: { type: 'number', default: -0.05 },
      targetZ: { type: 'number', default: 4.80 },
      targetFrustum: { type: 'number', default: 1.60 },

      // Phase 2 (5s delay, then zoom more in & little topper)
      delay2: { type: 'number', default: 5000 },
      duration2: { type: 'number', default: 2600 },
      targetX2: { type: 'number', default: 1.75 },
      targetY2: { type: 'number', default: 0.20 },
      targetZ2: { type: 'number', default: 4.80 },
      targetFrustum2: { type: 'number', default: 1.15 }
    },
    init: function () {
      this.startTime = typeof performance !== 'undefined' ? performance.now() : Date.now()
      this.startPos = {
        x: this.el.object3D.position.x || -0.15,
        y: this.el.object3D.position.y || 0.35,
        z: this.el.object3D.position.z || 5.688
      }
      this.startFrustum = 4.6
      this.isComplete = false

      // Fetch initialized camera frustum
      setTimeout(() => {
        const cameraEl = this.el.querySelector('#main-camera')
        const orthoComp = cameraEl && cameraEl.components['ortho-camera']
        if (orthoComp && orthoComp.data && orthoComp.data.frustumSize) {
          this.startFrustum = orthoComp.data.frustumSize
        }
      }, 50)
    },
    tick: function () {
      if (this.isComplete) return
      const now = typeof performance !== 'undefined' ? performance.now() : Date.now()
      const elapsed = now - this.startTime
      if (elapsed < this.data.delay) return

      const p1End = this.data.delay + this.data.duration
      const p2Start = p1End + this.data.delay2
      const p2End = p2Start + this.data.duration2

      let currentX, currentY, currentZ, currentFrustum

      if (elapsed < p1End) {
        // --- Phase 1: Smooth Zoom into target 1 ---
        const progress1 = Math.min(1.0, (elapsed - this.data.delay) / this.data.duration)
        const eased1 = progress1 < 0.5
          ? 4 * progress1 * progress1 * progress1
          : 1 - Math.pow(-2 * progress1 + 2, 3) / 2

        currentX = this.startPos.x + (this.data.targetX - this.startPos.x) * eased1
        currentY = this.startPos.y + (this.data.targetY - this.startPos.y) * eased1
        currentZ = this.startPos.z + (this.data.targetZ - this.startPos.z) * eased1
        currentFrustum = this.startFrustum + (this.data.targetFrustum - this.startFrustum) * eased1
      } else if (elapsed < p2Start) {
        // --- 5s Pause at Phase 1 target ---
        currentX = this.data.targetX
        currentY = this.data.targetY
        currentZ = this.data.targetZ
        currentFrustum = this.data.targetFrustum
      } else if (elapsed < p2End) {
        // --- Phase 2: Smooth Zoom More In and Topper ---
        const progress2 = Math.min(1.0, (elapsed - p2Start) / this.data.duration2)
        const eased2 = progress2 < 0.5
          ? 4 * progress2 * progress2 * progress2
          : 1 - Math.pow(-2 * progress2 + 2, 3) / 2

        currentX = this.data.targetX + (this.data.targetX2 - this.data.targetX) * eased2
        currentY = this.data.targetY + (this.data.targetY2 - this.data.targetY) * eased2
        currentZ = this.data.targetZ + (this.data.targetZ2 - this.data.targetZ) * eased2
        currentFrustum = this.data.targetFrustum + (this.data.targetFrustum2 - this.data.targetFrustum) * eased2
      } else {
        // --- Phase 2 Completed: Hold final framing ---
        currentX = this.data.targetX2
        currentY = this.data.targetY2
        currentZ = this.data.targetZ2
        currentFrustum = this.data.targetFrustum2
        this.isComplete = true
      }

      this.el.object3D.position.set(currentX, currentY, currentZ)

      const cameraEl = this.el.querySelector('#main-camera')
      const orthoComp = cameraEl && cameraEl.components['ortho-camera']
      if (orthoComp && orthoComp.orthoCamera) {
        orthoComp.data.frustumSize = currentFrustum
        const aspect = orthoComp.getAspect()
        const halfSize = currentFrustum / 2
        orthoComp.orthoCamera.left = -halfSize * aspect
        orthoComp.orthoCamera.right = halfSize * aspect
        orthoComp.orthoCamera.top = halfSize
        orthoComp.orthoCamera.bottom = -halfSize
        orthoComp.orthoCamera.updateProjectionMatrix()
      }
    }
  })
}

export default function FullScreenScene3D({
  frustumSize = 4.6,
  modelScale = 1.0,
  modelPosition = "0 0 0",
  timeScale = 1.0,
  isLoaded = true,
  far = 20000,
  near = -500,
  // Phase 1 Zoom
  delay = 1000,
  duration = 2600,
  targetX = 1.75,
  targetY = -0.05,
  targetZ = 4.80,
  targetFrustum = 1.60,
  // Phase 2 Zoom (5s delay, then zoom more in and little topper)
  delay2 = 5000,
  duration2 = 2600,
  targetX2 = 1.75,
  targetY2 = 0.20,
  targetZ2 = 4.80,
  targetFrustum2 = 1.15
}) {
  return (
    <div className="fullscreen-scene-viewport">
      <a-scene
        embedded
        vr-mode-ui="enabled: false"
        device-orientation-permission-ui="enabled: false"
        ar-mode-ui="enabled: false"
        loading-screen="enabled: false"
        renderer="antialias: true; colorManagement: true; toneMapping: ACESFilmic"
        background="color: #ffffff"
      >
        {/* High-Luminance Ambient & Radiance Lighting (Matching Scene3D) */}
        <a-entity light="type: ambient; intensity: 3.0; color: #ffffff"></a-entity>
        <a-entity light="type: hemisphere; groundColor: #ffffff; color: #ffffff; intensity: 2.8"></a-entity>
        <a-entity light="type: directional; intensity: 2.2; color: #ffffff; castShadow: false" position="5 12 8"></a-entity>
        <a-entity light="type: directional; intensity: 1.6; color: #ffffff; castShadow: false" position="-5 8 -4"></a-entity>

        {/* 3D Model Rig using animation.glb (Static / No Tilt / No Tags) */}
        <a-entity id="fullscreen-3d-rig">
          <a-entity
            id="fullscreen-3d-model"
            gltf-model={`${import.meta.env.BASE_URL}models/animation.glb`}
            position={modelPosition}
            scale={`${modelScale} ${modelScale} ${modelScale}`}
            world-brightness
            glb-animation-player={`enabled: ${isLoaded}; timeScale: ${timeScale}; totalFrames: 1100`}
          ></a-entity>
        </a-entity>

        {/* Orthographic Camera Rig — Two-stage smooth delayed zoom: P1 zoom -> 5s pause -> P2 zoom in & topper */}
        <a-entity
          id="camera-rig"
          position="-0.15 0.35 5.688"
          rotation="-18.11 22.12 0"
          delayed-zoom-controller={`delay: ${delay}; duration: ${duration}; targetX: ${targetX}; targetY: ${targetY}; targetZ: ${targetZ}; targetFrustum: ${targetFrustum}; delay2: ${delay2}; duration2: ${duration2}; targetX2: ${targetX2}; targetY2: ${targetY2}; targetZ2: ${targetZ2}; targetFrustum2: ${targetFrustum2}`}
        >
          <a-camera
            id="main-camera"
            camera={`far: ${far}; near: ${near}`}
            ortho-camera={`frustumSize: ${frustumSize}; near: ${near}; far: ${far}`}
            look-controls="enabled: false"
            wasd-controls="enabled: false"
          ></a-camera>
        </a-entity>
      </a-scene>
    </div>
  )
}
