var GCONTROL_TYPE={
    LABEL: 0x0001
}

function GControl(type){
    GObject.call(this, null);
    this._el = null;
    this._id = GIdBuilder.newId();
    this._type = type;
    this._position = new GPoint(0,0);
    this._renderFlag = false;
    this._updateFlag = false;
    this.getEl = function(){
        return this._el;
    };
    // 获取类型
    this.getType = function(){
        return this._type;
    };
    this.update = function(dt, mouse){
        if(this._updateFlag){
            this.onUpdate(dt, mouse);
            this._updateFlag = false;
        }
    };
    this.onUpdate = function(dt, mouse){

    };
    this.render = function(dt){
        if(this._renderFlag){
            this.onRender(dt);
            this.renderFlag = false;
        }
    };
    this.onRender = function(dt){
    };
    this.createEl = function(){
        this._el = GDom.create();
        this._el.id = this._id;
        return this._el;
    };
    this.setPosition = function(x,y){
        if(this._position.x != x || this._position.y != y){
            this._position.x = x;
            this._position.y = y;
            this._updateFlag = true;
        }
    };
    this.getPosition  = function(){
        return this._position;
    };
}