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

function load(notation) {
    for (let i = 0; i < notation.length; i += 3) {
        const s = toXyc(notation.substr(i, 3));
        board[s.y][s.x] = s.c;
    }
    candidates(phase).forEach(v => board[v.y][v.x] = "l");
    historyList.push(JSON.parse(JSON.stringify(board)));
}

function progress(notation) {
    for (let i = 0; i < notation.length; i += 2) {
        for (let bi = 0; bi < 64; bi++) {
            const x = bi % 8, y = bi / 8 | 0;
            if (board[y][x] === "l") board[y][x] = null;
        }
        const s = toXy(notation.substr(i, 2));
        put(s.x, s.y);
        historyList.push(JSON.parse(JSON.stringify(board)));
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
        const st = sqs[x + y * 8].children[0];
        st.className = "";
        if (!isEmpty(c)) {
            st.className = c ?? "";
        }
    }
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
        const st = sqs[x + y * 8].children[0];
        if (c === "l") {
            st.className = "l";
        }
    }
    id = null;
}

function prev() {
    if (current - 1 >= 0) {
        board = historyList[--current];
        update();
    }
}

function next() {
    if (current + 1 < historyList.length) {
        board = historyList[++current];
        update();
    }
}

window.onload = () => {
    document.getElementById("prev").onclick = prev;
    document.getElementById("next").onclick = next;
    load("D4WD5BE4BE5W");
    progress("f5f6e6f4g5g6h6c5g4e7d6f7d7c6e8c8d8f8e3f3g3h3h5e2d1f2e1f1g1d2c1d3c7c2b1c4g2h4h2h1c3a1g7h7b2b3b4a4a3a2a5h8g8b8b7a8b5b6a7a6");
    board = historyList[0];
    update();
};
