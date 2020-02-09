let board = new Array(8).map(g => new Array(8));
const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function load(fumen) {
    for (let i=0; i<fumen.length; i+=3) {
        let s = fumen.substr(i, 3);
        let x = alpha.indexOf(s[0]) + 1;
        let y = s[1];
        let c = s[2];
        console.log(x + y + c);
        board[y][x] = c;
    }
}

load("D4WD5BE4BE5W");