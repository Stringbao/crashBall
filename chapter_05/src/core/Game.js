function Game(screenId){
    this._el = GDom.find(screenId);
    this._fps = new GFps();
    this._mouse = new GMouse();
    this._objects = new Array();
    this._labelFps = null;
    this._labelMouseX = null;
    this._labelMouseY = null;
    this._labelMouseState = null;
    this.update = function(dt){
        this._mouse.update();
        for(var index = 0; index < this._objects.length; index++){
            this._objects[index].update(dt,this._mouse);
        }
        this._fps.update(dt);
        this._labelFps.setText("fps:" + this._fps.getValue());
        this._labelMouseX.setText('x:' + this._mouse.getPosition().x);
        this._labelMouseY.setText('y:' + this._mouse.getPosition().y);
        this._labelMouseState.setText('state:'+ this._mouse.getState());
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
        obj.init();
        this._objects.push(obj);
    };
    this.start = function(){
        this.init();
        var currentTicks = new Date().getTime();
        var lastTicks =  currentTicks;
        var delta = 0;
        var that = this;
        document.onmousemove = function(e){
            that._mouse.receive(GMOUSE_STATE.NONE, e.x, e.y);
        };
        document.onmousedown = function(e){
            that._mouse.receive(GMOUSE_STATE.DOWN, e.x, e.y);
        };
        document.onmouseup = function(e){
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
        this._labelFps = new GLabel();
        this._labelFps.setPosition(DESK_BOUNDS.LEFT +10, DESK_BOUNDS.TOP + 50);
        this.addObject(this._labelFps);
        
        this._labelMouseX = new GLabel();
        this._labelMouseX.setPosition(DESK_BOUNDS.LEFT +10, DESK_BOUNDS.TOP + 80);
        this.addObject(this._labelMouseX);

        this._labelMouseY = new GLabel();
        this._labelMouseY.setPosition(DESK_BOUNDS.LEFT +10, DESK_BOUNDS.TOP + 110);
        this.addObject(this._labelMouseY);

        this._labelMouseState = new GLabel();
        this._labelMouseState.setPosition(DESK_BOUNDS.LEFT +10, DESK_BOUNDS.TOP + 140);
        this.addObject(this._labelMouseState);
        
    };
}