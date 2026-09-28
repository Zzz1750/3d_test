import 'aframe'
import './Scene3D.css'

// Default Camera Configuration
const INITIAL_CAMERA_CONFIG = {
  position: { x: -0.15, y: 0.35, z: 5.688 },
  rotation: { x: -18.11, y: 22.12, z: 0 },
  frustumSize: 4.2,
  near: 0.01,
  far: 2000
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
}

export default function Scene3D({ isLoaded = false, frustumSize = 4.2 }) {
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

      {/* Centered 3D Model with 1100-frame master animation */}
      <a-entity
        gltf-model={`${import.meta.env.BASE_URL}models/animation.glb`}
        position="0 0 0"
        world-brightness
        glb-animation-player={`enabled: ${isLoaded}; totalFrames: 1100`}
      ></a-entity>

      {/* Default Orthographic Camera Rig */}
      <a-entity
        id="camera-rig"
        position="-0.15 0.35 5.688"
        rotation="-18.11 22.12 0"
      >
        <a-camera
          id="main-camera"
          ortho-camera={`frustumSize: ${frustumSize}; near: 0.01; far: 2000`}
          look-controls="enabled: false"
          wasd-controls="enabled: false"
        ></a-camera>
      </a-entity>
    </a-scene>
  )
}
