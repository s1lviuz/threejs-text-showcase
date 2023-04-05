import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import * as dat from 'lil-gui'
import gsap from 'gsap'

/**
 * Constants
 */
const guiParameters = {
  enableAutoRotateGeometries: true,
  geometriesSpeedRotate: 1
}
const geometryList = []

/**
 * Functions
 */

/**
 * Função que retorna uma Mesh aleatoria entre 4 opções.
 * @param {*} geometryIndex Number
 * @returns new Mesh = donut / sphere / box / octahedron
 */
const getRandomGeometryMesh = () => {
  const randonNumber0to3 = Number((Math.random() / 3.33).toPrecision(1).at(2))
  switch (randonNumber0to3) {
    case 0: {
      return new THREE.Mesh(donutGeometry, geometriesMatcapMaterial1)
    }
    case 1: {
      return new THREE.Mesh(sphereGeometry, geometriesMatcapMaterial2)
    }
    case 2: {
      return new THREE.Mesh(boxGeometry, geometriesMatcapMaterial3)
    }
    case 3: {
      return new THREE.Mesh(octahedronGeometry, geometriesMatcapMaterial4)
    }
  }
}
const zoomOut = () => {
  gsap.to(controls.object.position, { duration: 1, z: 10 })
}
const zoomIn = () => {
  gsap.to(controls.object.position, { duration: 1, z: 4.81 })
}

/**
 * Base
 */
// Debug
const gui = new dat.GUI()
const guiEnableAutoRotateGeometries = gui.add(
  guiParameters,
  'enableAutoRotateGeometries'
)
const guiGeometriesSpeedRotate = gui
  .add(guiParameters, 'geometriesSpeedRotate')
  .options([1, 2, 4, 8, 16, 32])

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Axes helper
// const axesHelper = new THREE.AxesHelper()
// scene.add(axesHelper)

/**
 * Geometries
 */
const donutGeometry = new THREE.TorusGeometry()
const sphereGeometry = new THREE.SphereGeometry()
const boxGeometry = new THREE.BoxGeometry()
const octahedronGeometry = new THREE.OctahedronGeometry()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

const matcapTexture1 = textureLoader.load('/textures/matcaps/1.png')
const matcapTexture2 = textureLoader.load('/textures/matcaps/2.png')
const matcapTexture3 = textureLoader.load('/textures/matcaps/3.png')
const matcapTexture4 = textureLoader.load('/textures/matcaps/4.png')
const matcapTexture5 = textureLoader.load('/textures/matcaps/5.png')

/**
 * Materials
 */
const geometriesMatcapMaterial1 = new THREE.MeshMatcapMaterial({
  matcap: matcapTexture2
})
const geometriesMatcapMaterial2 = new THREE.MeshMatcapMaterial({
  matcap: matcapTexture3
})
const geometriesMatcapMaterial3 = new THREE.MeshMatcapMaterial({
  matcap: matcapTexture4
})
const geometriesMatcapMaterial4 = new THREE.MeshMatcapMaterial({
  matcap: matcapTexture5
})

/**
 * Fonts
 */
const fontLoader = new FontLoader()

fontLoader.load('/fonts/helvetiker_regular.typeface.json', font => {
  // Text
  const textMatcapMaterial = new THREE.MeshMatcapMaterial({
    matcap: matcapTexture1
  })
  const textGeometry = new TextGeometry('O Poder do 3D na Web!\n por S1lviuz', {
    font,
    size: 0.5,
    height: 0.2,
    curveSegments: 5,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 4
  })

  const text = new THREE.Mesh(textGeometry, textMatcapMaterial)
  text.geometry.center()

  const guiTextSpin = gui.add(
    {
      textSpin: () =>
        gsap.to(text.rotation, {
          duration: 0.75,
          y: text.rotation.y + Math.PI * 2
        })
    },
    'textSpin'
  )
  guiTextSpin.name('Girar texto')

  scene.add(text)

  // Donuts
  console.time('geometries load')

  const safeAreaForSpawn = 3.15

  for (let i = 0; i < 1000; i++) {
    const geometry = getRandomGeometryMesh()

    geometry.position.x = (Math.random() - 0.5) * 12
    geometry.position.y = (Math.random() - 0.5) * 12
    geometry.position.z = (Math.random() - 0.5) * 12

    const nx = geometry.position.x.toString().includes('-')
    const ny = geometry.position.y.toString().includes('-')
    const nz = geometry.position.z.toString().includes('-')
    if (
      (ny && geometry.position.y >= -safeAreaForSpawn) ||
      (!ny && geometry.position.y <= safeAreaForSpawn)
    )
      if (
        (nx && geometry.position.x >= -safeAreaForSpawn) ||
        (!nx && geometry.position.x <= safeAreaForSpawn)
      )
        if (
          (nz &&
            geometry.position.z >=
              -safeAreaForSpawn + safeAreaForSpawn - 0.5) ||
          (!nz &&
            geometry.position.z <= safeAreaForSpawn + safeAreaForSpawn / 2)
        )
          ny
            ? (geometry.position.y -= safeAreaForSpawn)
            : (geometry.position.y += safeAreaForSpawn)

    geometry.rotation.x = Math.random() * Math.PI
    geometry.rotation.y = Math.random() * Math.PI

    const scale = Math.random() * 0.25
    geometry.scale.set(scale, scale, scale)

    geometryList.push(geometry)
    scene.add(geometry)
  }

  console.timeEnd('geometries load')
})

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
)

scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enabled = true
controls.autoRotateSpeed = 3.5

controls.object.position.set(-0.57, 0.51, 5.81)
controls.object.rotation.set(-0.11, -0.13, -0.01, 'XYZ')
controls.update()

const guiAutoRotate = gui.add(controls, 'autoRotate')
const guiEnableControls = gui.add(controls, 'enabled')
const guiZoomOut = gui.add({ value: zoomOut }, 'value')
const guiZoomIn = gui.add({ value: zoomIn }, 'value')

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Gui titles
 */
gui.title('Controles')
guiAutoRotate.name('Rotação automática da câmera')
guiEnableControls.name('Controle livre com o mouse')
guiEnableAutoRotateGeometries.name('Rotação das geometrias')
guiZoomOut.name('Reduzir zoom')
guiZoomIn.name('Acrescentar zoom')
guiGeometriesSpeedRotate.name('Velocidade da rotação')

/**
 * Animate
 */
const clock = new THREE.Clock()
let savedRotate = 0

const tick = () => {
  guiParameters.enableAutoRotateGeometries && !clock.running && clock.start()
  const elapsedTime = clock.getElapsedTime()

  // Objects update
  guiParameters.enableAutoRotateGeometries &&
    geometryList.forEach(geometry => {
      geometry.rotation.x = savedRotate
      geometry.rotation.y = savedRotate
      geometry.rotation.x +=
        elapsedTime * 0.25 * guiParameters.geometriesSpeedRotate
      geometry.rotation.y +=
        elapsedTime * 0.25 * guiParameters.geometriesSpeedRotate
    })

  if (!guiParameters.enableAutoRotateGeometries) {
    savedRotate = geometryList[0].rotation.x
    clock.stop()
  }

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
