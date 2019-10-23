const canvas = document.getElementsByTagName('canvas')[0]
const _ = canvas.getContext('2d')

// ra tio
// vextex
let width = canvas.width = window.innerWidth
let height = canvas.height = window.innerHeight
const displayRatio = height / width

const nStars = 800
const stars = []
const speedFactor = 0.05
const vertexDistance = width / 16

for (let i = 0; i < nStars; i++) {
  const dx = randomRange(-100, 100)
  const dy = randomRange(-100, 100)
  const u = Math.sqrt(dx * dx + dy * dy)

  stars.push({
    id: Math.random(),
    x: randomRange(0, width),
    y: randomRange(0, height),
    radius: randomRange(1.5, 4),
    dx: dx / u,
    dy: dy / u,
    speed: randomRange(1, 10),
  })
}

_.lineWidth = 2
_.strokeStyle = 'white'

function draw() {
  _.globalAlpha = 1
  _.fillStyle = '#0a111c'
  _.fillRect(0, 0, canvas.width, canvas.height)
  _.fillStyle = 'white'

  stars.forEach(star => {
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

    if (x < 0) star.x = width
    if (y < 0) star.y = height
    if (x > width) star.x = 0
    if (y > height) star.y = 0
  })
}

function distance(a, b) {
  return Math.sqrt((b.x - a.x) * (b.x - a.x) + (b.y - a.y) * (b.y - a.y))
}

function randomRange(a, b) {
  return Math.random() * (b - a) + a
}

window.addEventListener('load', draw)

setInterval(() => {
  update()
  draw()
}, 20)
