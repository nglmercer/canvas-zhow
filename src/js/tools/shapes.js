export class ShapeTool {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.ctx;
      this.isDrawing = false;
      this.startX = 0;
      this.startY = 0;
    }
  
    drawShape(shape, e, fill) {
      const rect = this.canvas.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
  
      this.ctx.beginPath();
      this.ctx.strokeStyle = this.canvas.color;
      this.ctx.fillStyle = this.canvas.color;
      this.ctx.lineWidth = this.canvas.lineWidth;
  
      switch (shape) {
        case 'rectangle':
          this.ctx.rect(this.startX, this.startY, x - this.startX, y - this.startY);
          break;
        case 'circle':
          const radius = Math.sqrt(Math.pow(x - this.startX, 2) + Math.pow(y - this.startY, 2));
          this.ctx.arc(this.startX, this.startY, radius, 0, 2 * Math.PI);
          break;
        case 'line':
          this.ctx.moveTo(this.startX, this.startY);
          this.ctx.lineTo(x, y);
          break;
      }
      
      if (fill && shape !== 'line') {
        this.ctx.fill();
      }
      this.ctx.stroke();
    }
  
    startDrawing(e) {
      const rect = this.canvas.canvas.getBoundingClientRect();
      this.startX = e.clientX - rect.left;
      this.startY = e.clientY - rect.top;
      this.isDrawing = true;
    }
  
    stopDrawing() {
      this.isDrawing = false;
    }
  }