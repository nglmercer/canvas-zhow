export class Toolbox {
  constructor(canvas) {
    this.canvas = canvas;
    this.colors = ['#000000', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'];
    this.sizes = [2, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50];
    this.tools = ['brush', 'eraser', 'fill', 'rectangle', 'circle', 'line'];
    
    this.setupToolbox();
  }

  setupToolbox() {
    this.createColorPickers();
    this.createCustomColorPicker();
    this.createSizePicker();
    this.createToolButtons();
    this.createFillToggle();
    this.createUndoRedoButtons();
    this.createClearButton();
  }

  createColorPickers() {
    const colorContainer = document.getElementById('color-picker');
    
    this.colors.forEach(color => {
      const colorBtn = document.createElement('div');
      colorBtn.className = `color-picker ${color === '#000000' ? 'active' : ''}`;
      colorBtn.style.backgroundColor = color;
      
      colorBtn.addEventListener('click', () => {
        this.canvas.setColor(color);
        document.querySelectorAll('.color-picker').forEach(btn => 
          btn.classList.remove('active'));
        colorBtn.classList.add('active');
      });
      
      colorContainer.appendChild(colorBtn);
    });
  }

  createCustomColorPicker() {
    const colorContainer = document.getElementById('custom-color-picker');
    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.className = 'h-8 w-8';
    
    colorInput.addEventListener('input', (e) => {
      this.canvas.setColor(e.target.value);
      document.querySelectorAll('.color-picker').forEach(btn => 
        btn.classList.remove('active'));
    });
    
    colorContainer.appendChild(colorInput);
  }

  createSizePicker() {
    const sizeContainer = document.getElementById('size-picker');
    const sizeInput = document.createElement('input');
    sizeInput.type = 'range';
    sizeInput.min = '2';
    sizeInput.max = '50';
    sizeInput.value = '5';
    sizeInput.className = 'w-32';
    
    sizeInput.addEventListener('input', (e) => {
      this.canvas.setLineWidth(parseInt(e.target.value));
    });
    
    sizeContainer.appendChild(sizeInput);
  }

  createToolButtons() {
    const toolContainer = document.getElementById('tool-picker');
    
    this.tools.forEach(tool => {
      const button = document.createElement('button');
      button.textContent = tool.charAt(0).toUpperCase() + tool.slice(1);
      button.className = `px-3 py-1 rounded ${tool === 'brush' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`;
      
      button.addEventListener('click', () => {
        this.canvas.setTool(tool);
        toolContainer.querySelectorAll('button').forEach(btn => {
          btn.className = 'px-3 py-1 rounded bg-gray-200';
        });
        button.className = 'px-3 py-1 rounded bg-blue-500 text-white';
      });
      
      toolContainer.appendChild(button);
    });
  }

  createFillToggle() {
    const container = document.getElementById('tool-picker');
    const fillToggle = document.createElement('div');
    fillToggle.className = 'flex items-center gap-2 ml-4';
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = 'fill-toggle';
    checkbox.className = 'form-checkbox h-4 w-4 text-blue-500';
    
    const label = document.createElement('label');
    label.htmlFor = 'fill-toggle';
    label.textContent = 'Fill Shapes';
    label.className = 'text-sm';
    
    checkbox.addEventListener('change', (e) => {
      this.canvas.setFill(e.target.checked);
    });
    
    fillToggle.appendChild(checkbox);
    fillToggle.appendChild(label);
    container.appendChild(fillToggle);
  }

  createUndoRedoButtons() {
    const container = document.getElementById('tool-picker');
    
    const undoBtn = document.createElement('button');
    undoBtn.textContent = '↩ Undo';
    undoBtn.className = 'px-3 py-1 rounded bg-gray-200 ml-4';
    undoBtn.addEventListener('click', () => this.canvas.undo());
    
    const redoBtn = document.createElement('button');
    redoBtn.textContent = '↪ Redo';
    redoBtn.className = 'px-3 py-1 rounded bg-gray-200 ml-2';
    redoBtn.addEventListener('click', () => this.canvas.redo());
    
    container.appendChild(undoBtn);
    container.appendChild(redoBtn);
  }

  createClearButton() {
    const clearBtn = document.getElementById('clear-btn');
    clearBtn.addEventListener('click', () => {
      this.canvas.clear();
    });
  }
}