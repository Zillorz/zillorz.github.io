const canvas = (document.getElementById("canvas") as HTMLCanvasElement)

const context = canvas.getContext('2d')

class Snake {
    // 0 -> left
    // 1 -> right
    // 2 -> up
    // 3 -> down
    direction = 3
    alive = true

    score = 0

    // 0 -> tail, -1 -> head
    arr = Array<number>();

    constructor(body: Array<number>, dir: number) {
        this.score = body.length
        body.forEach((x: number) => {
            this.arr.push(x)
        })
        this.direction = dir
    }

    populate(b: Array<number>) {
        this.arr.forEach((a: number) => {
            b[a] = 1 
        })
        return b
    }

    tick(b: Array<number>) {
        let l = this.arr[this.arr.length - 1]
        let x = l % 25
        let y = Math.floor(l / 25)

        if (this.direction === 1){
            if (x + 1 < 25){
                this.arr.push(x + 1 + y * 25)
            } else {
                this.alive = false;
            }
        } else if(this.direction === 2){
            if (y > 0){
                this.arr.push(x + (y - 1) * 25)
            } else {
                this.alive = false;
            }
        } else if(this.direction === 3){
            if (y + 1 < 25){
                this.arr.push(x + (y + 1) * 25)
            } else {
                this.alive = false;
            }
        } else {
            if (x > 0){
                this.arr.push(x - 1 + y * 25)
            } else {
                this.alive = false;
            }
        }

        if (board[this.arr[this.arr.length - 1]] !== 2) {
            this.arr.splice(0, 1)
        } else {
            this.score++
        }
        // this.arr[this.arr.length - 1]
        if (this.arr.indexOf(this.arr[this.arr.length - 1]) !== this.arr.length - 1) {
            this.alive = false;
        }
    }
}

initCanvas()
let board = [0]
let snake = new Snake([255, 256, 257], 1)

const empty = () => {}

let speed = 1000 / 15;

(document.getElementById("speed") as HTMLInputElement).addEventListener(
    'change', (e) => {
        let fps = Number.parseInt((e.target as HTMLInputElement).value);
        console.log(fps)

        if (Number.isFinite(fps)) {
            speed = 1000 / fps;
        }
    }
)

let execute = empty
for (let x = 1; x !== 500; x++) { board[x] = 0 }
board = snake.populate(board)
drawBoard()

let inter = setInterval(update, speed)
document.addEventListener("keydown", keyinput)

let keys = []
function keyinput(event: KeyboardEvent){

    let ind = ["a", "d", "w", "s"].indexOf(event.key)
    if(event.key === "r"){
        initCanvas()
        board = [0]
        snake = new Snake([255, 256, 256], 1)
        keys = []
        execute = empty
        for (let x = 1; x !== 500; x++) { board[x] = 0 }
        drawBoard()
        drawScore()
        clearInterval(inter)
        inter = setInterval(update, speed)
    } else if(keys.length < 2 && 
        keys.every((s) => s !== ind) && execute === empty && ind != -1) {

        keys.push(ind)
    }
}

function initCanvas() {
    context.fillStyle = "black"
    context.fillRect(0, 0, 1000, 1000)
}

function movement() {
    if(keys.length == 0){
        return;
    }

    move(snake.direction)
}

function move(direction: number) {
    if(keys.length === 1 && keys[0] !== [1, 0, 3, 2][snake.direction]) {
        snake.direction = keys[0]
    }
    else if(keys.length === 2) {
        if(snake.direction === keys[1] || snake.direction === keys[0]) {
            snake.direction = keys[0]
        } else if(keys[0] === [1, 0, 3, 2][snake.direction] || keys[0] === snake.direction) {
            snake.direction = keys[1]

            execute = () => {
                keys = [keys[0]]
                execute = empty
            }
            return;
        } else {
            snake.direction = keys[0]

            execute = () => {
                keys = [keys[1]]
                execute = empty
            }
            return;
        }
    }
    keys = []
}


function update() {
    execute()
    movement()
    snake.tick(board)
    if(!snake.alive) {
        context.fillStyle = "red";
        context.font = "40px sans-serif"
        context.fillText("Game Over!", 400, 500, 500)
        clearInterval(inter)
        return
    }
    let g = GenApple()
    board = new Array<number>(500).fill(0);
    board[g] = 2;
    board = snake.populate(board)
    drawBoard()
    drawScore()
}

function GenApple() {
    if (board.indexOf(2) !== -1){
        return board.indexOf(2)
    }
    
    let b2 = snake.populate(board)
    b2.forEach((x) => {
        if (x == 1) {
            b2.splice(b2.indexOf(1), 1)
        }
    })

    return Math.floor(b2.length * Math.random())
}

function drawScore() {
    context.fillStyle = "lime"
    context.font = "20px sans-serif"
    context.fillText("Score: " + snake.score, 825, 25)
}

// 0 -> black
// 1 -> lime
// 2 -> red
function drawBoard() {
    for (let y = 0; y != 25; y++) {
        for (let x = 0; x != 25; x++) {
            const col = board[y * 25 + x]

            if(col === 1) {
                context.fillStyle = "lime";
            } else if (col === 2) {
                context.fillStyle = "red";
            } else {
                context.fillStyle = "black";
            }

            context.fillRect(x * 40 + 1, y * 40 + 1, 38, 38)
        }
    }
}