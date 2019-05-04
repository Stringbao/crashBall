GMOUSE_STATE = {
    NONE:0,
    DOWN:0x0101,
    UP:0x0102
};
/**
 * dom辅助类
 */
var Dom = {
    find : function(id){
        return document.getElementById(id);
    },
    create : function(){
        var dom = document.createElement('div');
        dom.style.position='absolute';
        return dom;
    },
    append:function(parent, child){
        return parent.append(child);
    }
};

/**
 * fps计数器类
 * @param {*} domFpsId 
 */
function FPSCounter(domFpsId){
    this.dom = Dom.find(domFpsId);
    this.counter = 0;
    this.time = 0;
    this.fps = 0;
    this.lastFps = 0;
    this.update = function(dt){
        this.time += dt;
        this.counter++;
        if(this.time > 1){
            this.fps = this.counter;
            this.counter = 0;
            this.time = 0;
        }
    };
    this.render = function(dt){
        if(this.lastFps != this.fps){
            this.lastFps = this.fps;
            this.dom.innerText = 'FPS:'+this.fps;
        }
    }
}

/**
 * 游戏对象类
 */
function GObject(type){
    this.position = {x:0,y:0},
    this.dom = null;
    this.id = new Date().getTime();
    this.type = type;
    // 获取类型
    this.getType = function(){
        return this.type;
    }
    this.update = function(){
    },
    this.createDom = function(){
        this.dom = Dom.create();
        this.dom.id = this.id;
        return this.dom;
    },
    this.setPosition = function(x,y){
        this.position.x = x;
        this.position.y = y;
    }
    this.getPosition  = function(){
        return this.position;
    }
}

function GMouse(){
    this.state = GMOUSE_STATE.NONE;
    this.position = {x:0,y:0};

    this.lastState = GMOUSE_STATE.NONE;
    this.lastPosition = {x:0,y:0};

    this.newState = GMOUSE_STATE.NONE;
    this.newPosition = {x:0,y:0};
    this.update = function(){
        this.lastPosition.x = this.position.x;
        this.lastPosition.y = this.position.y;
        this.position.x = this.newPosition.x;
        this.position.y = this.newPosition.y;

        this.lastState = this.state;
        this.state = this.newState;
    };
    this.receive = function(state, x, y){
        this.newPosition.x = x;
        this.newPosition.y = y;
        this.newState = state;
    }
}

//游戏主类
//domScreenId
//domFpsId 
function Game(domScreenId, domFpsId){
    this.domScreen = Dom.find(domScreenId);
    this.fps = new FPSCounter(domFpsId);
    this.id = new Date().getTime();
    this.mouse = new GMouse();
    this.objects = new Array();
    this.update = function(dt){
        this.mouse.update();
        this.onUpdate(dt, this.mouse);
        for(var index = 0; index < this.objects.length; index++){
            this.objects[index].update(dt,this.mouse);
        }
        this.fps.update(dt);
    };
    this.onUpdate = function(dt, mouse){

    };
    this.render = function(dt){
        for(var index = 0; index < this.objects.length; index++){
            this.objects[index].render(dt);
        }
        this.fps.render(dt);
    },
    this.addObject = function(obj){
        obj.createDom();
        Dom.append(this.domScreen, obj.dom);
        this.objects.push(obj);
    },
    this.start = function(){
        var currentTicks = new Date().getTime();
        var lastTicks =  currentTicks;
        var delta = 0;
        var that = this;
        this.domScreen.onmousemove = function(e){
            that.mouse.receive(0, e.x, e.y);
        };
        this.domScreen.onmousedown = function(e){
            that.mouse.receive(GMOUSE_STATE.DOWN, e.x, e.y);
        };
        this.domScreen.onmouseup = function(e){
            that.mouse.receive(GMOUSE_STATE.UP, e.x, e.y);
        };
        requestAnimationFrame(function(){
            currentTicks = new Date().getTime();
            delta = (currentTicks - lastTicks ) / 1000;
            that.update(delta);
            that.render(delta);
            lastTicks = currentTicks;
            requestAnimationFrame(arguments.callee);
        });
    }
}