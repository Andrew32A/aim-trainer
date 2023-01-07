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
function Target(x, y, color) {
    this.x = x
    this.y = y
    this.radius = 25
    this.color = color
}

Target.prototype.draw = function() {
    context.save()
    context.beginPath()
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    context.fillStyle = this.color
    context.shadowColor = "#e3eaef"
    context.shadowBlur = 20
    context.fill()
    context.closePath()
    context.restore()
}

// draw background
const backgroundGradient = context.createLinearGradient(0, 0, 0, canvas.height)
backgroundGradient.addColorStop(0, "#171e26")
backgroundGradient.addColorStop(1, "#3f586b")
context.fillStyle = backgroundGradient
context.fillRect(0, 0, canvas.width, canvas.height)

// object instantiation and animation
let targets
let grid // 4x4 grid

function init() {
    targets = []
    grid = {
        "item1" : false,
        "item2" : false,
        "item3" : false
    }

    for (let i = 0; i < 16; i++) {
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height
        targets.push(new Target(x, y, "cyan"))
        targets[i].draw()
    }
}

init()