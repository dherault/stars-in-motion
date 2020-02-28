const canvas = document.getElementsByTagName('canvas')[0]
const _ = canvas.getContext('2d')

// ra tio
// vextex
const width = canvas.width = window.innerWidth
const height = canvas.height = window.innerHeight
const diagonal = Math.sqrt(width * width + height * height)

const nStars = 1024
const stars = []
const speedFactor = 0.05
const vertexDistance = width / 16
const margin = width / 12
const initialColor = 'white'
const initialBackgroundColor = '#0a111c'
const flashInitialSpeed = 1
const flashAcceleration = 1
const flashColors = [
  'AliceBlue',
  'AntiqueWhite',
  'Aqua',
  'Aquamarine',
  'Azure',
  'Beige',
  'Bisque',
  'Black',
  'BlanchedAlmond',
  'Blue',
  'BlueViolet',
  'Brown',
  'BurlyWood',
  'CadetBlue',
  'Chartreuse',
  'Chocolate',
  'Coral',
  'CornflowerBlue',
  'Cornsilk',
  'Crimson',
  'Cyan',
  'DarkBlue',
  'DarkCyan',
  'DarkGoldenRod',
  'DarkGray',
  'DarkGreen',
  'DarkKhaki',
  'DarkMagenta',
  'DarkOliveGreen',
  'DarkOrange',
  'DarkOrchid',
  'DarkRed',
  'DarkSalmon',
  'DarkSeaGreen',
  'DarkSlateBlue',
  'DarkSlateGray',
  'DarkTurquoise',
  'DarkViolet',
  'DeepPink',
  'DeepSkyBlue',
  'DimGray',
  'DodgerBlue',
  'FireBrick',
  'FloralWhite',
  'ForestGreen',
  'Fuchsia',
  'Gainsboro',
  'GhostWhite',
  'Gold',
  'GoldenRod',
  'Gray',
  'Green',
  'GreenYellow',
  'HoneyDew',
  'HotPink',
  'IndianRed',
  'Indigo',
  'Ivory',
  'Khaki',
  'Lavender',
  'LavenderBlush',
  'LawnGreen',
  'LemonChiffon',
  'LightBlue',
  'LightCoral',
  'LightCyan',
  'LightGoldenRodYellow',
  'LightGray',
  'LightGreen',
  'LightPink',
  'LightSalmon',
  'LightSeaGreen',
  'LightSkyBlue',
  'LightSlateGray',
  'LightSteelBlue',
  'LightYellow',
  'Lime',
  'LimeGreen',
  'Linen',
  'Magenta',
  'Maroon',
  'MediumAquaMarine',
  'MediumBlue',
  'MediumOrchid',
  'MediumPurple',
  'MediumSeaGreen',
  'MediumSlateBlue',
  'MediumSpringGreen',
  'MediumTurquoise',
  'MediumVioletRed',
  'MidnightBlue',
  'MintCream',
  'MistyRose',
  'Moccasin',
  'NavajoWhite',
  'Navy',
  'OldLace',
  'Olive',
  'OliveDrab',
  'Orange',
  'OrangeRed',
  'Orchid',
  'PaleGoldenRod',
  'PaleGreen',
  'PaleTurquoise',
  'PaleVioletRed',
  'PapayaWhip',
  'PeachPuff',
  'Peru',
  'Pink',
  'Plum',
  'PowderBlue',
  'Purple',
  'RebeccaPurple',
  'Red',
  'RosyBrown',
  'RoyalBlue',
  'SaddleBrown',
  'Salmon',
  'SandyBrown',
  'SeaGreen',
  'SeaShell',
  'Sienna',
  'Silver',
  'SkyBlue',
  'SlateBlue',
  'SlateGray',
  'Snow',
  'SpringGreen',
  'SteelBlue',
  'Tan',
  'Teal',
  'Thistle',
  'Tomato',
  'Turquoise',
  'Violet',
  'Wheat',
  'White',
  'WhiteSmoke',
  'Yellow',
  'YellowGreen',
]
let backgroundColor = initialBackgroundColor
let flashCircle

flashCircle = createFlashCircle()

for (let i = 0; i < nStars; i++) {
  const dx = randomRange(-100, 100)
  const dy = randomRange(-100, 100)
  const u = Math.sqrt(dx * dx + dy * dy)

  stars.push({
    id: Math.random(),
    x: randomRange(-margin, width + margin),
    y: randomRange(-margin, height + margin),
    radius: randomRange(1.5, 4),
    dx: dx / u,
    dy: dy / u,
    speed: randomRange(1, 10),
    color: initialColor,
  })
}

_.lineWidth = 2

function draw() {
  _.globalAlpha = 1
  _.fillStyle = backgroundColor
  _.fillRect(0, 0, canvas.width, canvas.height)

  _.fillStyle = flashCircle.backgroundColor
  _.beginPath()
  _.arc(flashCircle.x, flashCircle.y, flashCircle.r * 0.95, 0, 2 * Math.PI)
  _.closePath()
  _.fill()

  stars.forEach(star => {
    _.fillStyle = star.color
    _.strokeStyle = star.color

    let minDistance = Infinity

    stars.forEach(nextStar => {
      if (star.id === nextStar.id) return

      const d = distance(star, nextStar)

      if (d < minDistance) {
        minDistance = d
      }

      if (d < vertexDistance) {
        _.globalAlpha = 1 - d / vertexDistance
        _.beginPath()
        _.moveTo(star.x, star.y)
        _.lineTo(nextStar.x, nextStar.y)
        _.closePath()
        _.stroke()
      }
    })

    _.globalAlpha = Math.max(0, 1 - minDistance / vertexDistance)
    _.beginPath()
    _.arc(star.x, star.y, star.radius, 0, 2 * Math.PI)
    _.closePath()
    _.fill()
  })
}

function update() {
  stars.forEach(star => {
    const { dx, dy, speed } = star

    star.x += dx * speed * speedFactor
    star.y += dy * speed * speedFactor

    const { x, y } = star

    if (x < -margin) star.x = width + margin
    if (y < -margin) star.y = height + margin
    if (x > width + margin) star.x = -margin
    if (y > height + margin) star.y = -margin

    if (distance(star, flashCircle) < flashCircle.r) {
      star.color = flashCircle.color
    }
  })

  flashCircle.speed += flashAcceleration
  flashCircle.r += flashCircle.speed

  if (flashCircle.r > diagonal - margin) {
    ({ backgroundColor } = flashCircle)
    flashCircle = createFlashCircle()
  }
}

function distance(a, b) {
  return Math.sqrt((b.x - a.x) * (b.x - a.x) + (b.y - a.y) * (b.y - a.y))
}

function randomRange(a, b) {
  return Math.random() * (b - a) + a
}

function pick(array) {
  return array[Math.floor(Math.random() * array.length)]
}

function createFlashCircle() {
  let color = pick(flashColors)
  let backgroundColor = pick(flashColors)

  if (flashCircle) {
    while (color === flashCircle.color) {
      color = pick(flashColors)
    }

    while (backgroundColor === flashCircle.backgroundColor) {
      backgroundColor = pick(flashColors)
    }
  }

  return {
    x: randomRange(margin, width - margin),
    y: randomRange(margin, height - margin),
    r: 0,
    color,
    backgroundColor,
    speed: flashInitialSpeed,
  }
}

function step() {
  update()
  draw()
  requestAnimationFrame(step)
}

requestAnimationFrame(step)
