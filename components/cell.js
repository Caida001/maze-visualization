class Cell {
  constructor(renderX, renderY, x, y, grid, ctx) {
    this.renderX = renderX;
    this.renderY = renderY;
    this.x = x;
    this.y = y;
    this.grid = grid;
    this.width = 10;
    this.childNodes = [];
    this.parentNode = null;
    this.distance = null;
    this.gCost = null;
    this.hCost = null;
    this.neighborCoords = {
      up: [-1, 0],
      rightUp: [-1, 1],
      right: [0, 1],
      rightDown: [1, 1],
      down: [1, 0],
      leftDown: [1, -1],
      left: [0, -1],
      leftUp: [-1, -1],
    };
    this.neighborCells = {
      up: "",
      rightUp: "",
      right: "",
      rightDown: "",
      down: "",
      leftDown: "",
      left: "",
      leftUp: "",
    };
    this.state = {
      type: 'w',
      startingCell: false,
      endingCell: false,
      genStart: false,
      genEnd: false,
      checked: false,
      stack: false,
      visited: false,
      solution: false,
      neighbor: false,
      probe: false
    };
    this.vectorDir = {
      right: ['up', 'rightUp', 'right', 'rightDown', 'down'],
      left: ['up', 'leftUp', 'left', 'leftDown', 'down'],
      up: ['left', 'leftUp', 'up', 'rightUp', 'right'],
      down: ['left', 'leftDown', 'down', 'rightDown', 'right']
    };
    this.ctx = ctx;
  }

  bounds(x, y) {
    if(x >= 80 || x < 0){
      return false;
    } else if (y >= 80 || y < 0) {
      return false;
    } else { return true; }
  }

  setNeighbors() {
    const x = this.x;
    const y = this.y;
    const upY = y - 1;
    const downY = y + 1;
    const rightX = x + 1;
    const leftX = x - 1;
    this.neighborCells = {
      up: this.bounds(x, upY) ? this.grid.getCell(x, upY) : "",
      rightUp: this.bounds(rightX, upY) ? this.grid.getCell(rightX, upY) : "",
      right: this.bounds(rightX, y) ? this.grid.getCell(rightX, y) : "",
      rightDown: this.bounds(rightX, downY) ? this.grid.getCell(rightX, downY) : "",
      down: this.bounds(x, downY) ? this.grid.getCell(x, downY) : "",
      leftDown: this.bounds(leftX, downY) ? this.grid.getCell(leftX, downY) : "",
      left: this.bounds(leftX, y) ? this.grid.getCell(leftX, y) : "",
      leftUp: this.bounds(leftX, upY) ? this.grid.getCell(leftX, upY) : "",
    };
  }

  clear() {
    this.state.childNodes = [];
    this.state.parentNode = null;
    this.state.type = 'w';
    this.state.stack = false;
    this.state.solution = false;
    this.state.endingCell = false;
    this.state.visited = false;
  }

  clearSolution() {
    this.state.probe = false;
    this.state.visited = false;
    this.state.solution = false;
    this.state.checked = false;
  }

  makeToPath() {
    this.state.type = "p";
  }

  isMatch(cell) {
    if(cell.x === this.x && cell.y === this.y) {
      return true;
    } else {
      return false;
    }
  }

  makeChild(childCell) {
    childCell.parentNode = this;
    this.childNodes.push(childCell);
  }

  addMoves(moves) {
    moves.forEach( (move) => {
      let cell = this.grid.getCell(move[0], move[1]);
      this.makeChild(cell);
    });
  }

  isChild(cell) {
    let children = this.childNodes;
    for(let i = 0; i < children.length; i++){
      let child = children[i];
      if(child.isMatch(cell)) {
        return true;
      }
    }
    return false;
  }

  getParentNode() {
    if(this.state.startingCell) return this;

    if(this.parentNode) {
      return this.parentNode;
    } else {
      return -1;
    }
  }

  getMove(direction) {
    let curPos = [this.x, this.y];
    let dir = this.neighborCoords[direction];
    return [curPos[0] + dir[0], curPos[1] + dir[1]];
  }

  getAllMoves() {
    let dir = ['down', 'right', 'up', 'left'];
    let moves = [];
    dir.forEach( (d) => {
      moves.push(this.getMove(d));
    });
    return moves;
  }

  validMove(coord) {
    if(!this.grid.inGrid(coord[0], coord[1])) return false;
    let nextMoveCell = this.grid.getCell(coord[0], coord[1]);
    let parent = this.getParentNode();

    if(nextMoveCell.isMatch(parent)) return false;
    return this.checkMoveValidity(nextMoveCell);
  }

  checkMoveValidity(moveCell) {
    let validNeighbors = this.validNeighbors(moveCell);

    for(let i = 0; i < validNeighbors.length; i++){
      let neighbor = validNeighbors[i];
      if(neighbor.state.type === "p") return false;
    }
    return true;
  }

  getValidMoves() {
    let moves = this.getAllMoves();
    let validMoves = moves.filter( (move) => {
      return this.validMove(move);
    });
    if(validMoves.length > 0){
      this.addMoves(validMoves);
      return validMoves;
    } else { return null; }
  }

  validNeighbors(moveCell) {
    let vector = this.vector(moveCell);
    let vectorDir = this.vectorDir[vector];
    moveCell.setNeighbors();
    let valids = [];

    for (let i = 0; i < vectorDir.length; i++){
      let vect = vectorDir[i];
      if(moveCell.neighborCells[vect] === ""){
        continue;
      } else {
        valids.push(moveCell.neighborCells[vect]);
      }
    }
    return valids;
  }

  removeChild(cell) {
    let children = this.childNodes;
    let valids = [];
    for(let i = 0; i < children.length; i++){
      let child = children[i];
      if(!child.isMatch(cell)){
        valids.push(child);
      }
    }
  }

  vector(moveCell) {
    this.makeChild(moveCell);
    let parent = moveCell.getParentNode();
    let [px, py] = [parent.x, parent.y];
    let [mx, my] = [moveCell.x, moveCell.y];
    let vector;
    let [dirx, diry] = [mx - px, my - py];
    this.removeChild(moveCell);

    if(dirx === 1 && diry === 0){
      vector = "right";
    } else if (dirx === -1 && diry === 0) {
      vector = "left";
    } else if (dirx === 0 && diry === 1){
      vector = "down";
    } else { vector = "up"; }
    return vector;
  }

  draw(ctx) {
    if(this.state.startingCell) {
      ctx.fillStyle = '#0bb20b';
    } else if(this.state.endingCell){
      ctx.fillStyle = 'black';
    } else if(this.state.solution) {
      ctx.fillStyle = 'black';
    } else if(this.state.visited) {
      ctx.fillStyle = 'gray';
    } else if(this.state.probe) {
      ctx.fillStyle = "orange";
    } else if (this.state.stack || this.state.queue) {
      ctx.fillStyle = "blue";
    } else if(this.state.type === "w"){
      ctx.fillStyle = "white";
    } else if(this.state.type === "p"){
      ctx.fillStyle = "red";
    }
    ctx.fillRect(this.renderX, this.renderY, this.width, this.width);
  }

}
export default Cell;
