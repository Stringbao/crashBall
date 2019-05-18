
/**
 * @description 洞对象
 */
function Hole(){
    GElement.call(this, OBJECT_TYPE.HOLE);
    // 半径
    this._radiusX = 49;
    this._radiusY = 32;
    this.getRadiusX = function(){
        return this._radiusX;
    };
    this.getRadiusY = function(){
        return this._radiusY;
    };
    this.onUpdate = function(dt, mouse){
    };
    this.onRender = function(dt){
        this._el.style.left = parseInt(this._position.x - this._radiusX) + 'px';
        this._el.style.top = parseInt(this._position.y - this._radiusY) + 'px';
    };
    this.createEl = function(){
        this._el = GDom.create();
        this._el.id = this._id;
        this._el.className = 'hole';
        // this._el.style.width = (2*this._radiusX) + 'px';
        // this._el.style.height = (2*this._radiusY) + 'px';
        return this._el;
    }
}
