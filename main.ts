const canvas = (document.getElementById("canvas") as HTMLCanvasElement)

const context = canvas.getContext('2d')

class Snake {
    // 0 -> left
    // 1 -> right
    // 2 -> up
    // 3 -> down
    direction = 3
    alive = true

    // 0 -> tail, -1 -> head
    arr = Array<number>();

    constructor(body: Array<number>, dir: number) {
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
        } else if(this.direction == 2){
            if (y > 0){
                this.arr.push(x + (y - 1) * 25)
            } else {
                this.alive = false;
            }
        } else if(this.direction == 3){
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
for (let x = 1; x !== 500; x++) { board[x] = 0 }
board = snake.populate(board)
drawBoard()

let inter = setInterval(update, 67)

document.addEventListener("keydown", (event: KeyboardEvent) => {
    if (event.key === "w" && snake.direction !== 3){
        snake.direction = 2
    } else if (event.key === "a" && snake.direction !== 1){
        snake.direction = 0
    } else if (event.key === "s" && snake.direction !== 2){
        snake.direction = 3
    } else if (event.key === "d" && snake.direction !== 0){
        snake.direction = 1
    } else if(event.key === "r"){
        initCanvas()
        board = [0]
        snake = new Snake([255, 256, 256], 1)
        for (let x = 1; x !== 500; x++) { board[x] = 0 }
        drawBoard()
        clearInterval(inter)
        inter = setInterval(update, 67)
    }
})

function initCanvas() {
    context.fillStyle = "black"
    context.fillRect(0, 0, 1000, 1000)
}

function update() {
    snake.tick(board)
    if(!snake.alive){
        context.fillStyle = "red";
        context.fillText("Game Over!", 400, 400, 500)
        clearInterval(inter)
        return
    }
    let g = GenApple()
    board = new Array<number>(500).fill(0);
    board[g] = 2;
    board = snake.populate(board)
    drawBoard()
}

function GenApple() {
    for (let i = 0; i != board.length; i++) {
        if (board[i] == 2) {
            return i;
        }
    }

    let b2 = snake.populate(board)
    for (let i = 0; i != board.length; i++) {
        if(b2[i] == 1){
            b2[i] = -1
        } else {
            b2[i] = i
        }
    }

    for (let i = 0; i != board.length; i++) {
        if(b2[i] == -1) {
            b2.splice(i, 1)
        }
    }

    return b2[Math.floor(Math.random() * b2.length)]
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