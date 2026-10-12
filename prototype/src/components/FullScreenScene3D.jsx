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

  // Delayed smooth zoom controller:
  // Phase 1 (Small delay -> Zoom in)
  // Phase 2 (Delay -> Zoom more in)
  // Phase 3 (3s delay -> Zoom out a bit & tilt camera to left top corner)
  if (window.AFRAME.components['delayed-zoom-controller']) {
    delete window.AFRAME.components['delayed-zoom-controller']
  }
  window.AFRAME.registerComponent('delayed-zoom-controller', {
    schema: {
      // Phase 1 (Small delay -> Zoom in to right-bottom)
      delay: { type: 'number', default: 1000 },
      duration: { type: 'number', default: 2600 },
      targetX: { type: 'number', default: 1.75 },
      targetY: { type: 'number', default: -0.05 },
      targetZ: { type: 'number', default: 4.80 },
      targetFrustum: { type: 'number', default: 1.60 },

      // Phase 2 (Delay -> Zoom more in)
      delay2: { type: 'number', default: 3000 },
      duration2: { type: 'number', default: 2600 },
      targetX2: { type: 'number', default: 1.75 },
      targetY2: { type: 'number', default: 0.20 },
      targetZ2: { type: 'number', default: 4.80 },
      targetFrustum2: { type: 'number', default: 1.15 },

      // Phase 3 (3s delay -> Zoom out a bit towards top left corner, same camera style as Phase 1)
      delay3: { type: 'number', default: 3000 },
      duration3: { type: 'number', default: 2800 },
      targetX3: { type: 'number', default: -1.15 },
      targetY3: { type: 'number', default: 0.65 },
      targetZ3: { type: 'number', default: 5.25 },
      targetFrustum3: { type: 'number', default: 2.10 },

      // Phase 4 (2s pause after reaching top left -> Zoom in towards top left corner & rotate a little more left)
      delay4: { type: 'number', default: 2000 },
      duration4: { type: 'number', default: 2600 },
      targetX4: { type: 'number', default: -1.10 },
      targetY4: { type: 'number', default: 0.70 },
      targetZ4: { type: 'number', default: 5.25 },
      targetFrustum4: { type: 'number', default: 1.25 },
      targetRotX4: { type: 'number', default: -18.11 },
      targetRotY4: { type: 'number', default: 12.0 },
      targetRotZ4: { type: 'number', default: 0 }
    },
    init: function () {
      this.startTime = typeof performance !== 'undefined' ? performance.now() : Date.now()
      this.startPos = {
        x: this.el.object3D.position.x || -0.15,
        y: this.el.object3D.position.y || 0.35,
        z: this.el.object3D.position.z || 5.688
      }
      this.startFrustum = 4.6

      const rot = this.el.getAttribute('rotation') || {}
      this.startRot = {
        x: typeof rot.x === 'number' ? rot.x : -18.11,
        y: typeof rot.y === 'number' ? rot.y : 22.12,
        z: typeof rot.z === 'number' ? rot.z : 0
      }
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

      const p1Start = this.data.delay
      const p1End = p1Start + this.data.duration
      const p2Start = p1End + this.data.delay2
      const p2End = p2Start + this.data.duration2
      const p3Start = p2End + this.data.delay3
      const p3End = p3Start + this.data.duration3
      const p4Start = p3End + this.data.delay4
      const p4End = p4Start + this.data.duration4

      let currentX, currentY, currentZ, currentFrustum
      let currentRotX = this.startRot.x
      let currentRotY = this.startRot.y
      let currentRotZ = this.startRot.z

      if (elapsed < p1End) {
        // --- Phase 1: Smooth Zoom into right bottom corner ---
        const progress1 = Math.min(1.0, (elapsed - p1Start) / this.data.duration)
        const eased1 = progress1 < 0.5
          ? 4 * progress1 * progress1 * progress1
          : 1 - Math.pow(-2 * progress1 + 2, 3) / 2

        currentX = this.startPos.x + (this.data.targetX - this.startPos.x) * eased1
        currentY = this.startPos.y + (this.data.targetY - this.startPos.y) * eased1
        currentZ = this.startPos.z + (this.data.targetZ - this.startPos.z) * eased1
        currentFrustum = this.startFrustum + (this.data.targetFrustum - this.startFrustum) * eased1
      } else if (elapsed < p2Start) {
        // --- Pause at Phase 1 target ---
        currentX = this.data.targetX
        currentY = this.data.targetY
        currentZ = this.data.targetZ
        currentFrustum = this.data.targetFrustum
      } else if (elapsed < p2End) {
        // --- Phase 2: Smooth Zoom More In on right bottom corner ---
        const progress2 = Math.min(1.0, (elapsed - p2Start) / this.data.duration2)
        const eased2 = progress2 < 0.5
          ? 4 * progress2 * progress2 * progress2
          : 1 - Math.pow(-2 * progress2 + 2, 3) / 2

        currentX = this.data.targetX + (this.data.targetX2 - this.data.targetX) * eased2
        currentY = this.data.targetY + (this.data.targetY2 - this.data.targetY) * eased2
        currentZ = this.data.targetZ + (this.data.targetZ2 - this.data.targetZ) * eased2
        currentFrustum = this.data.targetFrustum + (this.data.targetFrustum2 - this.data.targetFrustum) * eased2
      } else if (elapsed < p3Start) {
        // --- 3s Pause at Phase 2 target ---
        currentX = this.data.targetX2
        currentY = this.data.targetY2
        currentZ = this.data.targetZ2
        currentFrustum = this.data.targetFrustum2
      } else if (elapsed < p3End) {
        // --- Phase 3: Smooth Zoom out a bit towards top left corner ---
        const progress3 = Math.min(1.0, (elapsed - p3Start) / this.data.duration3)
        const eased3 = progress3 < 0.5
          ? 4 * progress3 * progress3 * progress3
          : 1 - Math.pow(-2 * progress3 + 2, 3) / 2

        currentX = this.data.targetX2 + (this.data.targetX3 - this.data.targetX2) * eased3
        currentY = this.data.targetY2 + (this.data.targetY3 - this.data.targetY2) * eased3
        currentZ = this.data.targetZ2 + (this.data.targetZ3 - this.data.targetZ2) * eased3
        currentFrustum = this.data.targetFrustum2 + (this.data.targetFrustum3 - this.data.targetFrustum2) * eased3
      } else if (elapsed < p4Start) {
        // --- 2s Pause after reaching top left corner ---
        currentX = this.data.targetX3
        currentY = this.data.targetY3
        currentZ = this.data.targetZ3
        currentFrustum = this.data.targetFrustum3
      } else if (elapsed < p4End) {
        // --- Phase 4: Smooth Zoom in towards top left corner & rotate camera a little more left ---
        const progress4 = Math.min(1.0, (elapsed - p4Start) / this.data.duration4)
        const eased4 = progress4 < 0.5
          ? 4 * progress4 * progress4 * progress4
          : 1 - Math.pow(-2 * progress4 + 2, 3) / 2

        currentX = this.data.targetX3 + (this.data.targetX4 - this.data.targetX3) * eased4
        currentY = this.data.targetY3 + (this.data.targetY4 - this.data.targetY3) * eased4
        currentZ = this.data.targetZ3 + (this.data.targetZ4 - this.data.targetZ3) * eased4
        currentFrustum = this.data.targetFrustum3 + (this.data.targetFrustum4 - this.data.targetFrustum3) * eased4

        currentRotX = this.startRot.x + (this.data.targetRotX4 - this.startRot.x) * eased4
        currentRotY = this.startRot.y + (this.data.targetRotY4 - this.startRot.y) * eased4
        currentRotZ = this.startRot.z + (this.data.targetRotZ4 - this.startRot.z) * eased4
      } else {
        // --- Phase 4 Completed: Hold zoomed-in top left corner framing & rotation ---
        currentX = this.data.targetX4
        currentY = this.data.targetY4
        currentZ = this.data.targetZ4
        currentFrustum = this.data.targetFrustum4
        currentRotX = this.data.targetRotX4
        currentRotY = this.data.targetRotY4
        currentRotZ = this.data.targetRotZ4
        this.isComplete = true
      }

      this.el.object3D.position.set(currentX, currentY, currentZ)
      this.el.object3D.rotation.x = (currentRotX * Math.PI) / 180
      this.el.object3D.rotation.y = (currentRotY * Math.PI) / 180
      this.el.object3D.rotation.z = (currentRotZ * Math.PI) / 180

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
  // Phase 1 Zoom (Small delay -> Zoom in to right bottom)
  delay = 1000,
  duration = 2600,
  targetX = 1.75,
  targetY = -0.05,
  targetZ = 4.80,
  targetFrustum = 1.60,
  // Phase 2 Zoom (Delay -> Zoom more in)
  delay2 = 3000,
  duration2 = 2600,
  targetX2 = 1.75,
  targetY2 = 0.20,
  targetZ2 = 4.80,
  targetFrustum2 = 1.15,
  // Phase 3 (3s delay -> Zoom out a bit towards top left corner)
  delay3 = 3000,
  duration3 = 2800,
  targetX3 = -1.15,
  targetY3 = 0.65,
  targetZ3 = 5.25,
  targetFrustum3 = 2.10,
  // Phase 4 (2s pause after reaching top left -> Zoom in towards top left corner & rotate camera a little more left)
  delay4 = 2000,
  duration4 = 2600,
  targetX4 = -1.10,
  targetY4 = 0.70,
  targetZ4 = 5.25,
  targetFrustum4 = 1.25,
  targetRotX4 = -18.11,
  targetRotY4 = 12.0,
  targetRotZ4 = 0
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

        {/* Orthographic Camera Rig — Four-stage smooth delayed zoom */}
        <a-entity
          id="camera-rig"
          position="-0.15 0.35 5.688"
          rotation="-18.11 22.12 0"
          delayed-zoom-controller={`delay: ${delay}; duration: ${duration}; targetX: ${targetX}; targetY: ${targetY}; targetZ: ${targetZ}; targetFrustum: ${targetFrustum}; delay2: ${delay2}; duration2: ${duration2}; targetX2: ${targetX2}; targetY2: ${targetY2}; targetZ2: ${targetZ2}; targetFrustum2: ${targetFrustum2}; delay3: ${delay3}; duration3: ${duration3}; targetX3: ${targetX3}; targetY3: ${targetY3}; targetZ3: ${targetZ3}; targetFrustum3: ${targetFrustum3}; delay4: ${delay4}; duration4: ${duration4}; targetX4: ${targetX4}; targetY4: ${targetY4}; targetZ4: ${targetZ4}; targetFrustum4: ${targetFrustum4}; targetRotX4: ${targetRotX4}; targetRotY4: ${targetRotY4}; targetRotZ4: ${targetRotZ4}`}
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
