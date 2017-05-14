(function() {
  var mainCanvas = document.getElementById('main-canvas');
  var frameSelectBtn = document.getElementById('select-frame');
  var addFrameBtn = document.getElementById('new-frame');
  var deleteFrameBtn = document.getElementById('delete-frame');
  var downloadFrameBtn = document.getElementsById('download-frame'); // TODO: Add corresponding HTML element
  var colorPicker = document.getElementById('color-picker');
  
  var frames = [];
  
  function Frame() {
    this.paths = [];
  }
  
  Frame.prototype.addPath = function(path) {
    this.paths.push(path);
  };
  
  function Path(color) {
    this.color = color;
    this.vertices = [];
  }
  
  Path.prototype.addVertex = function(vertex) {
    this.vertices.push(vertex);
  };
  
  Path.prototype.changeColor = function(color) {
    this.color = color;
  };
  
  function Vertex(x, y) {
    this.x = x;
    this.y = y;
  }
  
  function onCanvasTouchStart(touch) {
    
  }
})();
