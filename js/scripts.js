const canvas = document.querySelector("canvas")
const context = canvas.getContext("2d")

canvas.width = innerWidth
canvas.height = innerHeight

// if user resizes window, the canvas will adjust
addEventListener("resize", () => {
    canvas.width = innerWidth
    canvas.height = innerHeight
    init()
})

// target blueprint
class Target {
    constructor(x, y, color, isAlive) {
        this.x = x
        this.y = y
        this.radius = 50
        this.color = color
        this.isAlive = isAlive // true == showing, false == hidden
    }

    // pythagorean theorem to calculate if mouse clicked inside the target
    wasTargetClicked(xInput, yInput) {
        const distance = Math.sqrt(( (xInput - this.x) * (xInput - this.x) ) + ( (yInput - this.y) * (yInput - this.y) ))
        // console.log(distance) // uncomment this to see coordinates in console

        // if target was clicked
        if (distance < this.radius && this.isAlive === true) {
            score += 10
            spawnNext()
            this.isAlive = false
            this.shatter()
            return true
        } else { 
            // if target was not clicked
            return false
        }
    }

    // spawns 8 particles starting from center of target
    shatter() {
        for (let i = 0; i < 8; i++) {
            particles.push(new Particle(this.x, this.y))
        }

        points.push(new Points(this.x, this.y))
        console.table(points)
    }
}

// particle blueprint
class Particle {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.radius = 2
        this.color = "white"
        this.gravity = 0.1
        this.ttl = 100 // time to live
        this.opacity = 1
        this.velocity = {x: randomIntFromRange(-5, 5), y: randomIntFromRange(-15, 15)}
    }

    // displays particle
    drawParticle() {
        context.save()
        context.beginPath()
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        context.fillStyle = `rgba(227, 234, 239, ${this.opacity})`
        context.shadowColor = "#e3eaef"
        context.shadowBlur = 20
        context.fill()
        context.closePath()
        context.restore()
    }

    // updates particle
    updateParticle() {
        this.drawParticle()
        this.velocity.y += this.gravity
        this.x += this.velocity.x
        this.y += this.velocity.y
        this.ttl -= 1
        this.opacity -= 1 / this.ttl
    }
}

// points blueprint
class Points {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.color = "cyan"
        this.gravity = 0.1
        this.ttl = 100
        this.opacity = 1
        this.velocity = {x: randomIntFromRange(-5, 5), y: randomIntFromRange(-8, -5)}
    }

    // displays points
    drawPoints() {
        context.save()
        context.beginPath()
        context.fillStyle = `rgba(227, 234, 239, ${this.opacity})`
        context.fillText(`+10`, this.x, this.y)
        context.font = "16px Arial"
        context.closePath()
        context.restore()
    }

    // updates points
    updatePoints() {
        this.drawPoints()
        this.velocity.y += this.gravity
        this.x += this.velocity.x
        this.y += this.velocity.y
        this.ttl -= 1
        this.opacity -= 1 / this.ttl
    }
}

// displays targets
function drawTargets() {
    for (i = 0; i < targets.length; i++) {
        if (targets[i].isAlive === true) {
            context.save()
            context.beginPath()
            context.arc(targets[i].x, targets[i].y, targets[i].radius, 0, Math.PI * 2, false)
            context.fillStyle = targets[i].color
            context.shadowColor = "#e3eaef"
            context.shadowBlur = 5
            context.fill()
            context.closePath()
            context.restore()
        }
    }
}

// spawns next target after one was destroyed
function spawnNext() {
    nextItem = targets[Math.floor(Math.random() * targets.length)]
    if (nextItem.isAlive === true) {
        // wooooooo, recursion!!
        spawnNext()
    } else {
        nextItem.isAlive = true
    }
}

// helper function for random int
function randomIntFromRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

// displays scoreboard
let score = 0
function drawScore() {
    context.font = "16px Arial"
    context.fillStyle = "cyan"
    context.textAlign = "center"
    context.fillText(`Score: ${score}`, canvas.width / 2, 85)
}

// displays background
const backgroundGradient = context.createLinearGradient(0, 0, 0, canvas.height)
function drawBackground() {
    backgroundGradient.addColorStop(0, "#171e26")
    backgroundGradient.addColorStop(1, "#3f586b")
    context.fillStyle = backgroundGradient
    context.fillRect(0, 0, canvas.width, canvas.height)
}

// displays everything on canvas
function draw() {
    drawBackground()
    drawTargets()
    drawScore()
    
    particles.forEach((item, index) => {
        item.updateParticle()
        if (item.ttl === 0) {
            particles.splice(index, 1)
        }
    })
    
    points.forEach((item, index) => {
        item.updatePoints()
        if (item.ttl === 0) {
            points.splice(index, 1)
        }
    })

    requestAnimationFrame(draw)
}

// variables that hold array of targets, coordinates, particles, and points
let targets
let grid // 3x3 grid
let particles
let points // points that fly off of target when destroyed

// loads and displays initial objects
function init() {
    // reset score
    score = 0

    // resets arrays
    targets = []
    particles = []
    points = []

    // x and y % coordinates for targets in grid
    grid = [[0.3, 0.3], [0.5, 0.3], [0.7, 0.3],
            [0.3, 0.5], [0.5, 0.5], [0.7, 0.5],
            [0.3, 0.7], [0.5, 0.7], [0.7, 0.7]]

    for (let i = 0; i < 9; i++) {
        console.log(`${i}: ${grid[i][0]} ${grid[i][1]}`)
        let x = grid[i][0] * canvas.width
        let y = grid[i][1] * canvas.height

        if (i === 3 || i === 4 || i === 5) {
            targets.push(new Target(x, y, "cyan", true))
        } else {
            targets.push(new Target(x, y, "cyan", false))
        }
    }
    console.log(targets)
    console.table(targets) // console table is super cool! great way to visualize data in console without the clutter
}

// init canvas display
init()
draw()

// click events
for (let i = 0; i < targets.length; i++) {
    canvas.addEventListener("click", (event) => {
        const rect = canvas.getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top
        targets[i].wasTargetClicked(x, y)
    })
}