
/**
 * @description 所有场景的父类，场景1，场景2，场景3，GNode派生出来的对象里面允许有子节点，会跟随Parent一起更新
 * @description GNode不会实例化，只会派生出对象
 */
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
    //GNode派生出来的对象没有update方法，子类全部走父类update方法, 然后派生出来的对象实现自身的onUpdate方法
    this.update = function(dt, mouse){
        for(var index = 0; index < this._objects.length; ){
            //当子对象的_isRemoved为移除的时候，移除对象和dom元素
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
    //render，Scene对象自身没有Render，会执行GNode的Render方法，循环所有子节点并进行render
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
    //添加子节点
    this.addObject = function(obj){
        if(obj.createEl != undefined){
            obj.createEl();
            GDom.append(this._el, obj.getEl());
        }
        //执行的是添加到Scene对象里面的对象的初始化方法，比如Ball--->Element--->GObject里面的init-->onInit
        //如果当前obj对象需要初始化，那么需要重写onInit方法
        obj.init();
        this._objects.push(obj);
    };
}