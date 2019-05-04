function Game(screenId){
    this._el = GDom.find(screenId);
    this._fps = new GFps();
    this._mouse = new GMouse();
    this._objects = new Array();
    this._fpsLabel = null;
    this.update = function(dt){
        this._mouse.update();
        for(var index = 0; index < this._objects.length; index++){
            this._objects[index].update(dt,this._mouse);
        }
        this._fps.update(dt);
        this._fpsLabel.setText(this._fps.getValue());
    };
    this.render = function(dt){
        for(var index = 0; index < this._objects.length; index++){
            this._objects[index].render(dt);
        }
    };
    this.addObject = function(obj){
        if(obj.createEl != undefined){
            obj.createEl();
            GDom.append(this._el, obj.getEl());
        }
        this._objects.push(obj);
        obj.init();
    };
    this.start = function(){
        this.init();
        var currentTicks = new Date().getTime();
        var lastTicks =  currentTicks;
        var delta = 0;
        var that = this;
        this._el.onmousemove = function(e){
            that._mouse.receive(GMOUSE_STATE.NONE, e.x, e.y);
        };
        this._el.onmousedown = function(e){
            that._mouse.receive(GMOUSE_STATE.DOWN, e.x, e.y);
        };
        this._el.onmouseup = function(e){
            that._mouse.receive(GMOUSE_STATE.UP, e.x, e.y);
        };
        requestAnimationFrame(function(){
            currentTicks = new Date().getTime();
            delta = (currentTicks - lastTicks ) / 1000;
            that.update(delta);
            that.render(delta);
            lastTicks = currentTicks;
            requestAnimationFrame(arguments.callee);
        });
    };
    this.init = function(){
        this._fpsLabel = new GLabel();
        this._fpsLabel.setPosition(10,10);
        this.addObject(this._fpsLabel);
    };
}