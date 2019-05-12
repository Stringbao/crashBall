function GNode(type){
    GObject.call(this, null);
    this._id = GIdBuilder.newId();
    this._type = type;
    this._el = null;
    this._objects = new Array();
    this.getEl = function(){
        return this._el;
    };
    // 获取类型
    this.getType = function(){
        return this._type;
    };
    this.update = function(dt, mouse){
        for(var index = 0; index < this._objects.length; ){
            if(this._objects[index]._isRemoved){
                this._objects[index].removeEl();
                this._objects.splice(index,1);
            }else{
                this._objects[index].update(dt, mouse);
                index++;
            }
        }
        this.onUpdate(dt, mouse);
    };
    this.render = function(dt){
        for(var index = 0; index < this._objects.length; index++){
            this._objects[index].render(dt);
        }
    };
    this.createEl = function(){
        this._el = GDom.create();
        this._el.id = this._id;
        return this._el;
    };
    this.addObject = function(obj){
        if(obj.createEl != undefined){
            obj.createEl();
            GDom.append(this._el, obj.getEl());
        }
        obj.init();
        this._objects.push(obj);
    };
}