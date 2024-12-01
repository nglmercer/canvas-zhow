import './styles/main.css';
import { DrawingCanvas } from './js/canvas.js';
import { Toolbox } from './js/toolbox.js';

document.addEventListener('DOMContentLoaded', () => {
  const canvas = new DrawingCanvas('canvas');
  new Toolbox(canvas);
});