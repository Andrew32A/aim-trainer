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

// objects
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
        // console.log(distance) // uncomment this to see specific coordinates in console

        // if target was clicked
        if (distance < this.radius && this.isAlive === true) {
            score++
            spawnNext()
            this.isAlive = false
            draw()
            return true
        } else { 
            // if target was not clicked
            return false
        }
    }
}

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

// display everything on canvas
function draw() {
    drawBackground()
    drawTargets()
    drawScore()
    // console table is super cool! great way to visualize data in console without the clutter
    console.table(targets)
}

// variables that hold array of targets and coordinates
let targets
let grid // 3x3 grid

// loads and displays fill background and object instantiation
function init() {
    // reset score
    score = 0

    // x and y % coordinates for targets in grid
    grid = [[0.3, 0.3], [0.5, 0.3], [0.7, 0.3],
            [0.3, 0.5], [0.5, 0.5], [0.7, 0.5],
            [0.3, 0.7], [0.5, 0.7], [0.7, 0.7]]

    // stores target objects created
    targets = []

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
    draw()
    console.log(targets)
}

// init canvas display
init()

// click events
for (let i = 0; i < targets.length; i++) {
    canvas.addEventListener("click", (event) => {
        const rect = canvas.getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top
        targets[i].wasTargetClicked(x, y)
    })
}