/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/

const myColor = readline(); // r or b

// game loop
while (true) {
    for (let i = 0; i < 8; i++) {
        const inputLine = readline(); // board line
    }
    const numLegalMoves = parseInt(readline()); // number of legal moves
    let legalMoves = [];
    for (let i = 0; i < numLegalMoves; i++) {
        const moveString = readline(); // move
        legalMoves.push(moveString);
        console.error(`legalMove ${i} - ${moveString}`)
    }

    console.log(legalMoves[0]);
}
