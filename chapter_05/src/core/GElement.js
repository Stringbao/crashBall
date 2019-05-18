/**
 * @description 球 发射器 隔断物 障碍物的父类，GElement类不会实例化
 * @param {type} 类型
 */
function GElement(type){
    GObject.call(this, null);
    //指定唯一id
    this._id = GIdBuilder.newId();
    //对象类型
    this._type = type;
    this._position = new GPoint(0,0);
    this._el = null;
    //是否渲染标识，为了避免多余的dom更新，进行性能优化
    this._renderFlag = false;
    //移除标识
    this._isRemoved = false;
    this.getEl = function(){
        return this._el;
    };
    // 获取类型
    this.getType = function(){
        return this._type;
    };
    //设置是否渲染标识 
    this.setRenderFlag = function(flag){
        this._renderFlag = flag;
    };
    //子类调用udpate方法，执行自身的onUpdate方法
    this.update = function(dt, mouse){
        this.onUpdate(dt, mouse);
    };
    //判断渲染状态，避免多余的渲染，在下一次setPosition完成之前，不会进行渲染
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
    this.hide = function(){
        GDom.hide(this._el);
    };
    //设置对象的位置，同时重置_renderFlag，准备执行render方法
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
    //设置移除标识，自身不会移除，通过打标记来移除当前对象和dom对象
    this.remove = function(){
        this._isRemoved = true;
    }
}