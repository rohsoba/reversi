const ALPHA = "abcdefgh";
const VEC_MAP = [
    {x: -1, y: -1},
    {x: 0, y: -1},
    {x: 1, y: -1},
    {x: -1, y: 0},
    {x: 1, y: 0},
    {x: -1, y: 1},
    {x: 0, y: 1},
    {x: 1, y: 1}];
let board = new Array(8).fill(null).map(() => new Array(8).fill(null));
const historyList = [];
let current = 0;
let phase = "b";

function setup(notation) {
    for (let i = 0; i < notation.length; i += 3) {
        const s = toXyc(notation.substr(i, 3));
        board[s.y][s.x] = s.c;
    }
    candidates(phase).forEach(v => board[v.y][v.x] = "l");
    historyList.push({ phase: phase, board: JSON.parse(JSON.stringify(board)) });
}

function progress(notation) {
    for (let i = 0; i < notation.length; i += 2) {
        for (let bi = 0; bi < 64; bi++) {
            const x = bi % 8, y = bi / 8 | 0;
            if (board[y][x] === "l") board[y][x] = null;
        }
        const s = toXy(notation.substr(i, 2));
        put(s.x, s.y);
        historyList.push({ phase: phase, board: JSON.parse(JSON.stringify(board)) });
    }
}

function toXyc(s) {
    return Object.assign(toXy(s), {c: s[2].toLowerCase()});
}

function toXy(s) {
    return {
        x: ALPHA.indexOf(s[0].toLowerCase()),
        y: Number(s[1]) - 1,
    };
}

function put(x, y) {
    if (phase == null) {
        return;
    }
    const reverseList = check(x, y, phase);
    board[y][x] = phase;
    reverseList.forEach(v => board[v.y][v.x] = phase);
    let nextPhase = phase === "b" ? "w" : "b";
    let canList = candidates(nextPhase);
    if (canList.length === 0) {
        nextPhase = nextPhase === "b" ? "w" : "b";
        canList = candidates(nextPhase);
        if (canList.length === 0) {
            console.log("game set");
            nextPhase = null;
        }
    }
    canList.forEach(v => board[v.y][v.x] = "l");
    phase = nextPhase;
}

function check(x, y, c) {
    if (!isEmpty(board[y][x])) {
        return [];
    }
    return VEC_MAP.map(v => {
        const tmp = [];
        for (let i = 1; ; i++) {
            const cx = x + v.x * i;
            const cy = y + v.y * i;
            if (cx < 0 || 8 <= cx || cy < 0 || 8 <= cy || isEmpty(board[cy][cx])) break;
            if (board[cy][cx] === c) {
                return tmp;
            }
            tmp.push({x: cx, y: cy});
        }
        return [];
    }).flat();
}

function isEmpty(s) {
    return s !== "b" && s !== "w";
}

function candidates(c) {
    const canList = [];
    for (let bi = 0; bi < 64; bi++) {
        const x = bi % 8, y = bi / 8 | 0;
        if (check(x, y, c).length > 0) {
            canList.push({x: x, y: y});
        }
    }
    return canList;
}

let id = null;

function update() {
    const sqs = document.getElementsByClassName("reversi")[0]
        .getElementsByClassName("square");
    for (let bi = 0; bi < 64; bi++) {
        const x = bi % 8, y = bi / 8 | 0, c = board[y][x];
        const disc = sqs[x + y * 8].children[0];
        disc.className = "";
        if (!isEmpty(c)) {
            disc.className = c ?? "";
        }
    }
    document.getElementById("current").className = historyList[current].phase ?? "";
    if (id != null) {
        clearTimeout(id);
    }
    id = setTimeout(highlight, 100);
}

function highlight() {
    const sqs = document.getElementsByClassName("reversi")[0]
        .getElementsByClassName("square");
    for (let bi = 0; bi < 64; bi++) {
        const x = bi % 8, y = bi / 8 | 0, c = board[y][x];
        const disc = sqs[x + y * 8].children[0];
        if (c === "l") {
            disc.className = "l";
        }
    }
    id = null;
}

function prev() {
    if (current - 1 >= 0) {
        board = historyList[--current].board;
        update();
    }
}

function next() {
    if (current + 1 < historyList.length) {
        board = historyList[++current].board;
        update();
    }
}

window.onload = () => {
    document.getElementById("prev").onclick = prev;
    document.getElementById("next").onclick = next;
    setup("d4wd5be4be5w");
    progress("f5f6e6d6e7g5c5f7c4e3f4f3g6d3h5h6h7d8c3c7c6d7c2g4f8e8g7d2d1b5b8c8b4a8a6b6g8a5a4e2b3h8h3h4f1e1f2h2g3g2a7b7a3b2a1a2b1c1g1h1");
    board = historyList[0].board;
    update();
};
