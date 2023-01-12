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

    // when target is clicked, do something
    behaviorOnClick() {
        this.isAlive = false
        spawnNext()
        // this.draw()
    }

    // pythagorean theorem to calculate if mouse clicked inside the target
    wasTargetClicked(xInput, yInput) {
        const distance = Math.sqrt(( (xInput - this.x) * (xInput - this.x) ) + ( (yInput - this.y) * (yInput - this.y) ))
        console.log(distance)

        // if target was clicked
        if (this.isAlive === true) {
            if (distance < this.radius) {
                this.behaviorOnClick()
                return true
            }
            
            // if target was not clicked
            else {
                return false
            }
        }
    }

    draw() {
        if (this.isAlive === true) {
            context.save()
            context.beginPath()
            context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
            context.fillStyle = this.color
            context.shadowColor = "#e3eaef"
            context.shadowBlur = 5
            context.fill()
            context.closePath()
            context.restore()
        }

        else {
            context.fillRect(0, 0, canvas.width, canvas.height)
            for (let i = 0; i < targets.length; i++) {
                if (targets[i].isAlive === true) {
                    targets[i].draw()
                }
            }
        }
    }
}

// spawns next target after one was destroyed
function spawnNext() {
    nextItem = targets[Math.floor(Math.random() * targets.length)]
    console.log(nextItem)
    if (nextItem.isAlive === true) {
        // wooooooo, recursion!!
        spawnNext()
    }
    
    else {
        nextItem.draw()
        return nextItem.isAlive = true
    }
}

// create background
const backgroundGradient = context.createLinearGradient(0, 0, 0, canvas.height)
backgroundGradient.addColorStop(0, "#171e26")
backgroundGradient.addColorStop(1, "#3f586b")

// object instantiation and animation
let targets
let grid // 3x3 grid

// object instantiation
function init() {
    // draw background
    context.fillStyle = backgroundGradient
    context.fillRect(0, 0, canvas.width, canvas.height)

    // x and y % coordinates for targets in grid
    grid = [[0.3, 0.3], [0.5, 0.3], [0.7, 0.3],
            [0.3, 0.5], [0.5, 0.5], [0.7, 0.5],
            [0.3, 0.7], [0.5, 0.7], [0.7, 0.7]]

    // stores target objects created
    targets = []

    for (let i = 0; i < 9; i++) {
        // TODO: doesn't respawn next on first click (feature not a bug?)
        if (i === 3 || i === 4 || i === 5) {
            console.log(`${i}: ${grid[i][0]} ${grid[i][1]}`)
            let x = grid[i][0] * canvas.width
            let y = grid[i][1] * canvas.height
            targets.push(new Target(x, y, "cyan", true))
            targets[i].draw()
        }

        else {
            console.log(`${i}: ${grid[i][0]} ${grid[i][1]}`)
            let x = grid[i][0] * canvas.width
            let y = grid[i][1] * canvas.height
            targets.push(new Target(x, y, "cyan", false))
            targets[i].draw()
        }
    }
    console.log(targets)

    // return might not be needed, test without it when event listeners work
    return targets
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
        // console.log(`x: ${x} y: ${y}`)
        // console.log(targets[i].targetClicked(x, y))
    })
}