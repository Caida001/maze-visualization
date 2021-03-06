import Cell from './cell';

class Grid {
  constructor(ctx) {
    this.ctx = ctx;
    this.cells = [];
    this.startPos = [0, 0];
    this.startCell = null;
    this.endCell = null;
    this.getCell = this.getCell.bind(this);
  }

  fillGrid(ctx){
    this.cells = [];
    for(let x = 0; x < 80; x++){
      let row = [];
      for(let y = 0; y < 80; y++){
        let cellRow = (x * 10) + 10;
        let cellCol = (y * 10) + 10;
        let cell = new Cell(cellRow, cellCol, x, y, this, ctx);
        row.push(cell);
      }
      this.cells.push(row);
    }
    this.cells.forEach(row => {
      row.forEach(cell => {
        cell.setNeighbors();
      });
    });
  }

  getCell(x, y) {
    if((x < 0) || (y < 0) || (x >= 80) || (y >= 80)) return false;
    return this.cells[x][y];
  }

  makeCellStart() {
    const start = this.getCell(this.startPos[0], this.startPos[1]);
    start.state.startingCell = true;
    this.startCell = start;
  }

  resetGrid() {
    this.endCell = null;
    this.cells.forEach( (row) => {
      row.forEach( (cell) => {
        cell.clear();
        cell.distance = null;
        cell.draw(this.ctx);
      });
    });
  }

  resetSolution() {
    this.cells.forEach( (row) => {
      row.forEach( (cell) => {
        cell.clearSolution();
        cell.draw(this.ctx);
      });
    });
  }

  validPath(cell) {
    let validNeighbors = cell.validNeighbors();
    validNeighbors.forEach( (cell) => {
      if(cell.state.type === 'p') {
        return false;
      }
    });
    return true;
  }

  resetCells() {
    this.cells.forEach ( (row) => {
      row.forEach( (cell) => {
        cell.childNodes = [];
        cell.parentNode = null;
        cell.clearSolution();
      });
    });
  }

  inGrid(x, y) {
    if(x >= 0 && x < 80 && y >= 0 && y < 80) return true;
    return false;
  }

  draw(ctx) {
    for(let i = 0; i < this.cells.length; i++){
      let row = this.cells[i];
      for(let j = 0; j < row.length; j++){
        let cell = row[j];
        cell.draw(ctx);
      }
    }
  }
}

export default Grid;
