import React, { useState, useCallback, useEffect } from 'react';

interface SudokuProps { onClose: () => void; }

type Grid = (number | null)[][];

const SAMPLE_PUZZLE: Grid = [
  [5,3,null,null,7,null,null,null,null],
  [6,null,null,1,9,5,null,null,null],
  [null,9,8,null,null,null,null,6,null],
  [8,null,null,null,6,null,null,null,3],
  [4,null,null,8,null,3,null,null,1],
  [7,null,null,null,2,null,null,null,6],
  [null,6,null,null,null,null,2,8,null],
  [null,null,null,4,1,9,null,null,5],
  [null,null,null,null,8,null,null,7,9],
];

const Sudoku: React.FC<SudokuProps> = ({ onClose }) => {
  const [grid, setGrid] = useState<Grid>(SAMPLE_PUZZLE.map(r => [...r]));
  const [original, setOriginal] = useState<Grid>(SAMPLE_PUZZLE.map(r => [...r]));
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [errors, setErrors] = useState<Set<string>>(new Set());

  const isValid = useCallback((grid: Grid, row: number, col: number, num: number) => {
    for (let i = 0; i < 9; i++) if (i !== col && grid[row][i] === num) return false;
    for (let i = 0; i < 9; i++) if (i !== row && grid[i][col] === num) return false;
    const br = Math.floor(row / 3) * 3, bc = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
      if (br + i !== row && bc + j !== col && grid[br + i][bc + j] === num) return false;
    }
    return true;
  }, []);

  const checkErrors = useCallback(() => {
    const errs = new Set<string>();
    for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) {
      const val = grid[r][c];
      if (val && !isValid(grid, r, c, val)) errs.add(`${r}-${c}`);
    }
    setErrors(errs);
  }, [grid, isValid]);

  useEffect(() => { checkErrors(); }, [grid, checkErrors]);

  const setCell = (num: number | null) => {
    if (!selected) return;
    const [r, c] = selected;
    if (original[r][c] !== null) return;
    const newGrid = grid.map(row => [...row]);
    newGrid[r][c] = num;
    setGrid(newGrid);
  };

  const newGame = () => {
    setGrid(SAMPLE_PUZZLE.map(r => [...r]));
    setOriginal(SAMPLE_PUZZLE.map(r => [...r]));
    setSelected(null);
    setErrors(new Set());
  };

  return (
    <div className="h-full flex flex-col items-center justify-center bg-blue-50 p-4">
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2"><span>🔢</span> Sudoku</h1>
      <div className="bg-white rounded-lg shadow-lg p-4">
        <div className="grid grid-cols-9 gap-0 border-2 border-gray-800">
          {grid.map((row, r) => row.map((cell, c) => {
            const isOrig = original[r][c] !== null;
            const isSel = selected?.[0] === r && selected?.[1] === c;
            const hasErr = errors.has(`${r}-${c}`);
            const brB = (r + 1) % 3 === 0 && r < 8;
            const brR = (c + 1) % 3 === 0 && c < 8;
            return (
              <div key={`${r}-${c}`} onClick={() => !isOrig && setSelected([r, c])}
                className={`w-10 h-10 flex items-center justify-center text-lg font-bold cursor-pointer
                  ${isOrig ? 'bg-gray-200 text-gray-800' : 'bg-white text-blue-600'}
                  ${isSel ? 'bg-blue-200' : ''} ${hasErr ? 'text-red-500' : ''}
                  border-r ${brR ? 'border-r-2 border-r-gray-800' : 'border-r-gray-300'}
                  border-b ${brB ? 'border-b-2 border-b-gray-800' : 'border-b-gray-300'}
                `}
              >
                {cell || ''}
              </div>
            );
          }))}
        </div>
        <div className="mt-4 flex gap-1 justify-center">
          {[1,2,3,4,5,6,7,8,9].map(n => (
            <button key={n} onClick={() => setCell(n)} className="w-8 h-8 bg-blue-500 hover:bg-blue-600 text-white rounded font-bold">{n}</button>
          ))}
          <button onClick={() => setCell(null)} className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded">X</button>
        </div>
        <button onClick={newGame} className="mt-4 w-full py-2 bg-gray-200 hover:bg-gray-300 rounded">New Game</button>
      </div>
    </div>
  );
};

export default Sudoku;
