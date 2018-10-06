import Grid from '../components/grid';
import DFSBuilder from '../builders/dfs-builder';
import BFSBuilder from '../builders/bfs-builder';
import BFSSolver from '../solvers/bfs-solver';
import DFSSolver from '../solvers/dfs-solver';
import AStarSolver from '../solvers/astar-solver';

export const buildMaze = ctx => {
  let grid = new Grid(ctx);
  let dfs = new DFSBuilder(grid);
  let bfs = new BFSBuilder(grid);
  let bfsSolver = new BFSSolver(grid);
  let dfsSolver = new DFSSolver(grid);
  let aStarSolver = new AStarSolver(grid);

  $("#fast").click( () => {
    grid.resetGrid();
    grid.resetCells();
    grid.fillGrid(ctx);
    grid.draw(ctx);
    dfs.quickMaze();
  });

  $("#dfs").click( () => {
    grid.resetGrid();
    grid.resetCells();
    grid.fillGrid(ctx);
    grid.draw(ctx);
    $("button").prop("disabled", true);
    dfs.mazeAnimation(0);
  });

  $("#bfs").click( () => {
    grid.resetGrid();
    grid.resetCells();
    grid.fillGrid(ctx);
    grid.draw(ctx);
    $("button").prop("disabled", true);
    bfs.mazeAnimation(0);
  });

  $("#bfs-solver").click( () => {
    grid.resetSolution();
    $("button").prop("disabled", true);
    bfsSolver.solve();
  });

  $("#dfs-solver").click( () => {
    grid.resetSolution();
    grid.draw(ctx);
    $("button").prop("disabled", true);
    dfsSolver.solve();
  });

  $("#astar-solver").click( () => {
    grid.resetSolution();
    grid.draw(ctx);
    $("button").prop("disabled", true);
    aStarSolver.solve();
  });
};
