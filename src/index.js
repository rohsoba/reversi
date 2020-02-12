const ALPHA = "ABCDEFGH";
const VEC_MAP = [
    {x: -1, y: -1},
    {x:  0, y: -1},
    {x:  1, y: -1},
    {x: -1, y:  0},
    {x:  1, y:  0},
    {x: -1, y:  1},
    {x:  0, y:  1},
    {x:  1, y:  1}];
let board = new Array(8).fill(null).map(() => new Array(8).fill(null));
const historyList = [];
let current = 0;

function load(notation) {
    for (let i=0; i<notation.length; i+=3) {
        const s = toSqInfo(notation.substr(i, 3));
        board[s.y][s.x] = s.c;
    }
    historyList.push(JSON.parse(JSON.stringify(board)));
}
function progress(notation) {
    for (let i=0; i<notation.length; i+=3) {
        const s = toSqInfo(notation.substr(i, 3));
        put(s.x, s.y, s.c);
        historyList.push(JSON.parse(JSON.stringify(board)));
    }
}
function toSqInfo(s) {
    return {
        x: ALPHA.indexOf(s[0]),
        y: Number(s[1]) - 1,
        c: s[2]
    }
}
function put(x, y, c) {
    const reverseList = [];
    VEC_MAP.forEach(v => {
        const tmp = [];
        for (let i=1; ; i++) {
            const cx = x + v.x*i;
            const cy = y + v.y*i;
            if (cx < 0 || 8 <= cx || cy < 0 || 8 <= cy || board[cy][cx] == null) break;
            if (board[cy][cx] === c) {
                reverseList.splice(reverseList.length, 0, ...tmp);
                break;
            }
            tmp.push({x: cx, y: cy});
        }
    });
    board[y][x] = c;
    reverseList.forEach(v => board[v.y][v.x] = c);
}
function update() {
    const sqs = document.getElementsByClassName("reversi")[0]
        .getElementsByClassName("square");
    board.forEach((r, y) => {
        r.forEach((c, x) => {
            sqs[x + y * 8].children[0].className = c?.toLowerCase() ?? "";
        });
    });
}
function prev() {
    if (current-1 >= 0) {
        board = historyList[--current];
        update();
    }
}
function next() {
    if (current+1 < historyList.length) {
        board = historyList[++current];
        update();
    }
}

window.onload = () => {
    document.getElementById("prev").onclick = prev;
    document.getElementById("next").onclick = next;
    load("D4WD5BE4BE5W");
    progress("F5BF6WE6BD6W");
    board = historyList[0];
    update();
};
