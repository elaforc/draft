class Move {
  constructor(ySrc, xSrc, yDst, xDst, size) {
    this.xSrc = xSrc;
    this.ySrc = ySrc;
    this.xDst = xDst
    this.yDst = yDst;
    this.size = size;
  }

  toString() {
    let srcRow = String.fromCharCode(65 + this.xSrc);
    let srcCol = this.size - this.ySrc;
    let dstRow = String.fromCharCode(65 + this.xDst);
    let dstCol = this.size - this.yDst;
    return `${srcRow}${srcCol}${dstRow}${dstCol}`;
  }
}

module.exports.Move = Move;
