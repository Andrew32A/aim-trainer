const canvas = document.querySelector("canvas")
const context = canvas.getContext("2d")

canvas.width = innerWidth
canvas.height = innerHeight

let canvasLeft = canvas.offsetLeft + canvas.clientLeft
let canvasTop = canvas.offsetTop + canvas.clientTop

// if user resizes window, the canvas will adjust
addEventListener("resize", () => {
    canvas.width = innerWidth
    canvas.height = innerHeight
    init()
})

// objects
class Target {
    constructor(x, y, color) {
        this.x = x
        this.y = y
        this.radius = 25
        this.color = color
        this.status = "destroyed" // destroyed for hidden, active for showing
    }

    targetClicked() {
        console.log("something was clicked!")
        this.color = "black"
        this.draw()
    }

    draw() {
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
        console.log(`${i}: ${grid[i][0]} ${grid[i][1]}`)
        let x = grid[i][0] * canvas.width
        let y = grid[i][1] * canvas.height
        targets.push(new Target(x, y, "cyan"))
        targets[i].draw()
    }
    console.log(targets)
}

// init canvas display
init()

// click events
// canvas.addEventListener("click", function(event) {
//     let x = event.pageX - canvasLeft
//     let y = event.pageY - canvasTop

//     targets.forEach(function(item) {
//         if (y > item.top && y < item.top + item.height && x > item.left && x < item.left + item.width) {
//             console.log("click")
//         }
//     })
// }, false)

// canvas.addEventListener("mousemove", function(event) {
//     if (targets.isPointInPath(targets[0], event.offsetX, event.offsetY)) {
//         targets[0].fillStyle = "green"
//     }
// })

canvas.onclick = function() {console.log("click")}