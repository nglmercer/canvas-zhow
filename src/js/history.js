export class HistoryManager {
    constructor(canvas) {
      this.canvas = canvas;
      this.undoStack = [];
      this.redoStack = [];
      this.maxStates = 50;
      // Don't save initial state in constructor
      // It will be saved after the white background is drawn
    }
  
    saveState() {
      const state = this.canvas.ctx.getImageData(0, 0, this.canvas.canvas.width, this.canvas.canvas.height);
      this.undoStack.push(state);
      this.redoStack = [];
  
      if (this.undoStack.length > this.maxStates) {
        this.undoStack.shift();
      }
    }
  
    undo() {
      if (this.undoStack.length > 1) {
        const currentState = this.undoStack.pop();
        this.redoStack.push(currentState);
        const previousState = this.undoStack[this.undoStack.length - 1];
        this.canvas.ctx.putImageData(previousState, 0, 0);
      }
    }
  
    redo() {
      if (this.redoStack.length > 0) {
        const nextState = this.redoStack.pop();
        this.undoStack.push(nextState);
        this.canvas.ctx.putImageData(nextState, 0, 0);
      }
    }
  }