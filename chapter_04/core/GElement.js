function GElement(type){
    GObject.call(this, null);
    this._id = GIdBuilder.newId();
    this._type = type;
    this._position = new GPoint(0,0);
    this._el = null;
    this._renderFlag = false;
    this._isRemoved = false;
    this.getEl = function(){
        return this._el;
    };
    // 获取类型
    this.getType = function(){
        return this._type;
    };
    this.setRenderFlag = function(flag){
        this._renderFlag = flag;
    };
    this.update = function(dt, mouse){
        this.onUpdate(dt, mouse);
    };
    this.render = function(dt){
        if(this._renderFlag){
            this.onRender(dt);
            this._renderFlag = false;
        }
    };
    this.createEl = function(){
        this._el = GDom.create();
        this._el.id = this._id;
        return this._el;
    };
    this.removeEl = function(){
        GDom.remove(this._el);
    };
    this.setPosition = function(x,y){
        if(this._position.x != x || this._position.y != y){
            this._position.x = x;
            this._position.y = y;
            this._renderFlag = true;
        }
    };
    this.getPosition  = function(){
        return this._position;
    };
    this.remove = function(){
        this._isRemoved = true;
    }
}