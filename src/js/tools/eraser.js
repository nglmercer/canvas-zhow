export class EraserTool {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.ctx;
    }
  
    erase(x, y) {
      // Set the drawing color to the background color (white)
      this.ctx.strokeStyle = 'white';
      
      // Use the same line width and line cap as the current brush
      this.ctx.lineWidth = this.canvas.lineWidth;
      this.ctx.lineCap = 'round';
      this.ctx.lineJoin = 'round';
  
      // Draw a line to create the erasing effect
      this.ctx.beginPath();
      this.ctx.moveTo(this.canvas.lastX || x, this.canvas.lastY || y);
      this.ctx.lineTo(x, y);
      this.ctx.stroke();
  
      // Restore the original stroke style after erasing
      this.ctx.strokeStyle = this.canvas.color;
    }
  }