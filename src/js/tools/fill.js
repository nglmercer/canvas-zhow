export class FillTool {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.ctx;
    }
  
    fill(startX, startY) {
      const imageData = this.ctx.getImageData(0, 0, this.canvas.canvas.width, this.canvas.canvas.height);
      const pixels = imageData.data;
      
      const startPos = (startY * this.canvas.canvas.width + startX) * 4;
      const startR = pixels[startPos];
      const startG = pixels[startPos + 1];
      const startB = pixels[startPos + 2];
      const startA = pixels[startPos + 3];
      
      const fillColor = this.hexToRgb(this.canvas.color);
      
      if (this.compareColors(startR, startG, startB, startA, fillColor.r, fillColor.g, fillColor.b, 255)) {
        return;
      }
      
      const stack = [[startX, startY]];
      
      while (stack.length > 0) {
        const [x, y] = stack.pop();
        const pos = (y * this.canvas.canvas.width + x) * 4;
        
        if (x < 0 || x >= this.canvas.canvas.width || y < 0 || y >= this.canvas.canvas.height) {
          continue;
        }
        
        if (!this.compareColors(
          pixels[pos], pixels[pos + 1], pixels[pos + 2], pixels[pos + 3],
          startR, startG, startB, startA
        )) {
          continue;
        }
        
        pixels[pos] = fillColor.r;
        pixels[pos + 1] = fillColor.g;
        pixels[pos + 2] = fillColor.b;
        pixels[pos + 3] = 255;
        
        stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
      }
      
      this.ctx.putImageData(imageData, 0, 0);
    }
    
    hexToRgb(hex) {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    }
    
    compareColors(r1, g1, b1, a1, r2, g2, b2, a2) {
      const threshold = 5;
      return Math.abs(r1 - r2) <= threshold &&
             Math.abs(g1 - g2) <= threshold &&
             Math.abs(b1 - b2) <= threshold &&
             Math.abs(a1 - a2) <= threshold;
    }
  }