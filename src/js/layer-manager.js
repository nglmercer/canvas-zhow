export class Layer {
    constructor(canvas, image = null, x = 0, y = 0) {
      this.id = Date.now(); // Unique identifier
      this.canvas = canvas;
      this.image = image;
      this.x = x;
      this.y = y;
      this.width = image ? image.width : canvas.width;
      this.height = image ? image.height : canvas.height;
      this.visible = true;
      this.opacity = 1;
      this.selected = false;
    }
  
    draw(ctx) {
      if (!this.visible || !this.image) return;
  
      ctx.globalAlpha = this.opacity;
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
      ctx.globalAlpha = 1;
  
      // Draw selection border if selected
      if (this.selected) {
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
      }
    }
  
    contains(x, y) {
      return (
        x >= this.x && 
        x <= this.x + this.width && 
        y >= this.y && 
        y <= this.y + this.height
      );
    }
  
    resize(newWidth, newHeight) {
      this.width = newWidth;
      this.height = newHeight;
    }
  
    move(newX, newY) {
      this.x = newX;
      this.y = newY;
    }
  }
  
export class LayerManager {
constructor(drawingCanvas) {
    this.drawingCanvas = drawingCanvas;
    this.layers = [];
    this.activeLayer = null;
}

addImageLayer(image, x = 0, y = 0) {
    const layer = new Layer(this.drawingCanvas.canvas, image, x, y);
    this.layers.push(layer);
    this.selectLayer(layer);
    this.render();
    return layer;
}

selectLayer(layer) {
    // Deselect previous layers
    this.layers.forEach(l => l.selected = false);
    layer.selected = true;
    this.activeLayer = layer;
}

deleteActiveLayer() {
    if (!this.activeLayer) return;

    const index = this.layers.indexOf(this.activeLayer);
    if (index > -1) {
    this.layers.splice(index, 1);
    this.activeLayer = this.layers.length > 0 ? this.layers[0] : null;
    this.render();
    }
}

render() {
    const ctx = this.drawingCanvas.ctx;
    ctx.clearRect(0, 0, this.drawingCanvas.canvas.width, this.drawingCanvas.canvas.height);
    
    // Render layers from bottom to top
    this.layers.forEach(layer => layer.draw(ctx));
}

handleMouseDown(e) {
    const rect = this.drawingCanvas.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Try to select a layer
    const clickedLayer = this.layers.find(layer => layer.contains(x, y));
    if (clickedLayer) {
    this.selectLayer(clickedLayer);
    return true;
    }
    return false;
}
}
export default LayerManager;