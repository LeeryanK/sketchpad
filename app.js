(function() {
  var mainCanvas = document.getElementById('main-canvas');
  var frameSelector = document.getElementById('frame-selector'); // TODO: Add corresponding HTML element
  var frameSelectBtn = document.getElementById('change-frame'); // TODO: Change id to 'change-frame'
  var addFrameBtn = document.getElementById('new-frame');
  var deleteFrameBtn = document.getElementById('delete-frame');
  var downloadFrameBtn = document.getElementsById('download-frame'); // TODO: Add corresponding HTML element
  var colorPicker = document.getElementById('color-picker');
  var thicknessSlider = document.getElementById('thickness-slider'); // TODO: Add corresponding HTML element
  
  function Sketchpad(mainCanvas, changeFrameBtn, addFrameBtn, deleteFrameBtn, downloadFrameBtn, colorPicker, thicknessSlider, frameSelector) {
    if (Sketchpad.instance_) {
      return Sketchpad.instance_;
    }
    Sketchpad.instance_ = this;
    
    this.frames = [new Frame()];
    this.currentFrame = this.frames[0];
    this.currentColor = '#000000';
    this.currentThickness = 1;
    
    this.mainCanvas = mainCanvas;
    this.changeFrameBtn = changeFrameBtn;
    this.addFrameBtn = addFrameBtn;
    this.deleteFrameBtn = deleteFrameBtn;
    this.downloadFrameBtn downloadFrameBtn;
    this.colorPicker = colorPicker;
    this.thicknessSlider = thicknessSlider;
    this.frameSelector = frameSelector;
    
    this.mainCanvas.addEventListener('touchstart', Sketchpad.Handlers.onTouchStart.bind(this));
    this.mainCanvas.addEventListener('touchmove', Sketchpad.Handlers.onTouchMove.bind(this));
    
    this.addFrameBtn.addEventListener('click', Sketchpad.Handlers.addFrame.bind(this));
    this.changeFrameBtn.addEventListener('click', Sketchpad.Handlers.Handlers.openChangeFrameMenu.bind(this));
    this.deleteFrameBtn.addEventListener('click', Sketchpad.Handlers.openDeleteFrameMenu.bind(this));
    this.downloadFrameBtn.addEventListener('click', Sketchpad.Handlers.downloadCurrentFrame.bind(this));
    this.colorPicker.addEventListener('change', Sketchpad.Handlers.changeColor.bind(this));
    this.thicknessSlider.addEventListener('change', Sketchpad.Handlers.changeThickness.bind(this));
  }
  
  Sketchpad.prototype.openSelectFrameMenu = function() {
    this.selectFrameMenu.style.display = 'block';
    this.selectFrameMenu.innerHTML = '';
    for (var i = 0; i < this.frames.length; i++) {
      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('2d');
      canvas.width = Sketchpad.config.WIDTH;
      canvas.height = Sketchpad.config.HEIGHT;
      canvas.setAttribute('data-frame-number', i);
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, Sketchpad.config.WIDTH, Sketchpad.config.HEIGHT);
      this.frames[i].render(ctx);
      var thisSketchpad = this;
      canvas.addEventListener('click', function() {
        thisSketchpad.onFrameSelect(~~this.getAttribute('data-frame-number'));
      });
      this.selectFrameMenu.appendChild(canvas);
    }
  };
  
  Sketchpad.prototype.onFrameSelect = function(frameNumber) {
    if (this.selectedFrameAction === FrameActions.CHANGE) {
      this.currentFrame = this.frames[frameNumber];
    } else if (this.selectedFrameAction === FrameActions.DELETE) {
      if (this.frames.length === 1) {
        window.alert('You cannot delete your last frame.');
      } else {
        var currentFrameIndex = this.frames.indexOf(this.currentFrame);
        if (this.currentFrameIndex === frameNumber) {
          currentFrameIndex = currentFrameIndex > 0 ? currentFrameIndex - 1 : 1;
          this.currentFrame = this.frames[currentFrameIndex];
        }
        this.frames.splice(frameNumber, 1);
      }
    }
    this.closeSelectFrameMenu();
  };
  
  Sketchpad.prototype.closeSelectMenu = function() {
    this.selectFrameMenu.style.display = 'none';
  };
  
  Sketchpad.Handlers = {
    onTouchStart: function(e) {
      var firstTouch = e.touches[0];
      var newPath = new Path(firstTouch.pageX, firstTouch.pageY, this.currentColor, this.currentThickness);
      newPath.renderLatestVertex(this.ctx);
      this.currentFrame.addPath(newPath);
    },
    onTouchMove: function(e) {
      var firstTouch = e.touches[0];
      var latestPath = this.currentFrame.getLatestPath();
      latestPath.addVertex(firstTouch.pageX, firstTouch.pageY);
      latestPath.renderLatestVertex(this.ctx);
    },
    
    addFrame: function() {
      var newFrame = new Frame();
      this.frames.push(newFrame);
      this.currentFrame = newFrame;
    },
    openChangeFrameMenu: function() {
      this.selectedFrameAction = FrameActions.CHANGE;
      this.openSelectFrameMenu();
    },
    openDeleteFrameMenu: function() {
      this.selectedFrameAction = FrameActions.DELETE;
      this.openSelectFrameMenu();
    },
    downloadCurrentFrame: function() {
      var downloadName = window.prompt('File name:');
      var downloadAnchor = document.createElement('a');
      downloadAnchor.href = this.mainCanvas.toDataURL('image/png', 1);
      downloadAnchor.download = downloadName;
      downloadAnchor.click();
    },
    changeColor: function() {
      this.currentColor = this.colorPicker.value;
    },
    changeThickness: function() {
      this.currentThickness = this.thicknessSlider.value;
    }
  };
  
  var FrameActions = {
    CHANGE: 0,
    DELETE: 1
  };
  
  function Frame() {
    this.paths = [];
  }
  
  Frame.prototype.addPath = function(path) {
    this.paths.push(path);
  };
  
  Frame.prototype.getLatestPath = function() {
    return this.paths[this.paths.length - 1];
  };
  
  Frame.prototype.render = function(ctx) {
    for (var i = 0; i < this.paths.length; i++) {
      this.paths[i].render(ctx);
    }
  };
  
  function Path(startX, startY, color, thickness) {
    this.color = color;
    this.thickness = thickness;
    this.vertices = [new Vertex(x, y)];
  }
  
  Path.prototype.addVertex = function(vertex) {
    this.vertices.push(vertex);
  };
  
  Path.prototype.changeColor = function(color) {
    this.color = color;
  };
  
  Path.prototype.changeThickness = function(thickness) {
    this.thickness = thickness;
  };
  
  Path.prototype.deleteLatestVertex = function() {
    this.vertices.pop();
  };
  
  Path.prototype.render = function(ctx) {
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.thickness;
    
    ctx.arc(this.vertices[0].x, this.vertices[0].y, this.thickness, 0, 2 * Math.PI, false);
    ctx.moveTo(this.vertices[0].x, this.vertices[0].y);
    for (var i = 1; i < this.vertices.length; i++) {
      ctx.lineTo(this.vertices[i].x, this.vertices[i].y);
    }
    
    ctx.stroke();
    ctx.closePath();
  };
  
  Path.prototype.renderLatestVertex = function(ctx) {
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.thickness;
    
    if (this.vertices.length === 0) {
      ctx.arc(this.vertices[0].x, this.vertices[0].y, this.thickness, 0, 2 * Math.PI, false);
    } else {
      var secondToLastVertex = this.vertices[this.vertices.length - 2];
      var lastVertex = this.vertices[this.vertices.length - 1];
      
      ctx.moveTo(secondToLastVertex.x, secondToLastVertex.y);
      ctx.lineTo(lastVertex.x, lastVertex.y);
    }
    
    ctx.stroke();
    ctx.closePath();
  };
  
  function Vertex(x, y) {
    this.x = x;
    this.y = y;
  }
})();
