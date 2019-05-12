
function Obstacle(){
    GElement.call(this, OBJECT_TYPE.OBSTACLE);
    // 半径
    this._radius = 39;
    // 速度
    this._speed = 0;
    this._direction = new GVector(0,0);
    this.updated = false;
    this.getRadius = function(){
        return this._radius;
    };
    this.onUpdate = function(dt, mouse){
    };
    this.onRender = function(dt){
        this._el.style.left = parseInt(this._position.x - this._radius) + 'px';
        this._el.style.top = parseInt(this._position.y - this._radius) + 'px';
    };
    this.createEl = function(){
        this._el = GDom.create();
        this._el.id = this._id;
        this._el.className = 'block-ball';
        this._el.style.width = (2*this._radius) + 'px';
        this._el.style.height = (2*this._radius) + 'px';
        return this._el;
    }
    this.setRadius = function(radius){
        this._radius = radius;
    }
}
