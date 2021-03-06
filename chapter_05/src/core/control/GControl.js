var GCONTROL_TYPE={
    LABEL: 0x0001
}

/**
 * @description label组件的父类 该类型不会初始化
 * @param {int} type 
 */
function GControl(type){
    GObject.call(this, null);
    this._el = null;
    this._id = GIdBuilder.newId();
    this._type = type;
    this._position = new GPoint(0,0);
    this._renderFlag = false;
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
            this._renderFlag = true;
        }
    };
    this.getPosition  = function(){
        return this._position;
    };
}