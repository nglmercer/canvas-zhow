import { ShapeTool } from './tools/shapes.js';
import { EraserTool } from './tools/eraser.js';
import { FillTool } from './tools/fill.js';
import { HistoryManager } from './history.js';

export class DrawingCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.isDrawing = false;
    this.color = '#000000';
    this.lineWidth = 5;
    this.currentTool = 'brush';
    this.fill = false;
    
    this.shapeTool = new ShapeTool(this);
    this.eraserTool = new EraserTool(this);
    this.fillTool = new FillTool(this);
    this.history = new HistoryManager(this);
    
    this.setupCanvas();
    this.addEventListeners();
  }

  setupCanvas() {
    this.canvas.width = 800;
    this.canvas.height = 600;
    
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.strokeStyle = this.color;
    this.ctx.lineWidth = this.lineWidth;
    
    // Fill with white background and save initial state
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.history.saveState(); // Save the initial white canvas state
  }

  addEventListeners() {
    this.canvas.addEventListener('mousedown', this.startDrawing.bind(this));
    this.canvas.addEventListener('mousemove', this.draw.bind(this));
    this.canvas.addEventListener('mouseup', this.stopDrawing.bind(this));
    this.canvas.addEventListener('mouseout', this.stopDrawing.bind(this));
    
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z') {
          e.preventDefault();
          if (e.shiftKey) {
            this.history.redo();
          } else {
            this.history.undo();
          }
        }
      }
    });
  }

  startDrawing(e) {
    this.isDrawing = true;
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (this.currentTool === 'fill') {
      this.fillTool.fill(Math.floor(x), Math.floor(y));
      this.history.saveState();
      return;
    }

    if (this.currentTool === 'brush' || this.currentTool === 'eraser') {
      this.draw(e);
    } else {
      this.shapeTool.startDrawing(e);
      // Save state before starting to draw a shape
      this.savedState = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  draw(e) {
    if (!this.isDrawing) return;

    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (this.currentTool === 'eraser') {
      this.eraserTool.erase(x, y);
    } else if (this.currentTool === 'brush') {
      this.ctx.beginPath();
      this.ctx.moveTo(this.lastX || x, this.lastY || y);
      this.ctx.lineTo(x, y);
      this.ctx.stroke();
    } else {
      this.ctx.putImageData(this.savedState, 0, 0);
      this.shapeTool.drawShape(this.currentTool, e, this.fill);
    }

    [this.lastX, this.lastY] = [x, y];
  }

  stopDrawing() {
    if (this.isDrawing) {
      this.history.saveState();
    }
    this.isDrawing = false;
    this.lastX = null;
    this.lastY = null;
    if (this.currentTool !== 'brush' && this.currentTool !== 'eraser') {
      this.shapeTool.stopDrawing();
    }
  }

  setColor(color) {
    this.color = color;
    this.ctx.strokeStyle = color;
    this.ctx.fillStyle = color;
  }

  setLineWidth(width) {
    this.lineWidth = width;
    this.ctx.lineWidth = width;
  }

  setTool(tool) {
    this.currentTool = tool;
  }

  setFill(fill) {
    this.fill = fill;
  }

  clear() {
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.history.saveState();
  }

  undo() {
    this.history.undo();
  }

  redo() {
    this.history.redo();
  }
}