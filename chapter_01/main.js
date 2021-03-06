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
        if(this.time > 1000){
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
function GObject(){
    this.pos = {x:0,y:0},
    this.dom = null;
    this.id = 0;
    this.update = function(){}
    this.createDom = function(id){
        // this.dom = Dom.create();
        // this.dom.id = ++this.idSeed;
        // return this.dom;
    }
    this.render = function(){}
    this.setPosistion = function(x,y){
        this.pos.x = x;
        this.pos.y = y;
    }
}

/**
 * 游戏主类
 * @param {*} domScreenId 
 * @param {*} domFpsId 
 */
function Game(domScreenId, domFpsId){
    this.domScreen = Dom.find(domScreenId);
    this.fps = new FPSCounter(domFpsId);
    this.idSeed = new Date().getTime();
    // this.id = 0;
    this.objects = new Array();
    this.ticks = {last:0, current:0, delta:0};
    this.update = function(dt){
        for(var index = 0; index < this.objects.length; index++){
            this.objects[index].update(dt);
        }
        this.fps.update(dt);
    },
    this.render = function(dt){
        for(var index = 0; index < this.objects.length; index++){
            this.objects[index].render(dt);
        }
        this.fps.render(dt);
    },
    this.addObject = function(obj){
        this.idSeed++;
        obj.createDom(this.idSeed);
        Dom.append(this.domScreen, obj.dom);
        this.objects.push(obj);
    },
    this.start = function(){
        var that = this;
        this.ticks.current = new Date().getTime();
        requestAnimationFrame(function(){
            that.ticks.current = new Date().getTime();
            that.ticks.delta = that.ticks.current - that.ticks.last;
            that.update(that.ticks.delta);
            that.render(that.ticks.delta);
            that.ticks.last = game.ticks.current;
            requestAnimationFrame(arguments.callee);
        });
    }
}

//应用代码
/**
 * 正方形
 */
function Square(){
    GObject.call(this, null);

    this.size = 20;
    this.direction = {x:1, y:1};
    this.update = function(dt){
        this.pos.x +=1*this.direction.x;
        this.pos.y +=1*this.direction.y;
        if(this.pos.x > 790){
            this.direction.x = -1;
        }else if(this.pos.x <10){
            this.direction.x = 1;
        }
        if(this.pos.y > 440){
            this.direction.y = -1;
        }else if(this.pos.y <10){
            this.direction.y = 1;
        }
    },
    this.render = function(dt){
        this.dom.style.left = this.pos.x - this.size / 2;
        this.dom.style.top = this.pos.y - this.size / 2;
    },
    this.createDom = function(id){
        this.dom = Dom.create();
        this.id = id;
        this.dom.style.background = '#c22';
        this.dom.style.width = this.size + 'px';
        this.dom.style.height = this.size + 'px';
        this.dom.id = id;
        return this.dom;
    }
}

function createRandomSuare(){
    var square = new Square();
    square.setPosistion( 100 + Math.random() * 500, 100 + Math.random() * 200);
    return square;
}
// 构建游戏
var game = new Game('game_screen','game_fps');
// 启动游戏
game.start();
// 添加正方形
game.addObject(createRandomSuare());
game.addObject(createRandomSuare());
game.addObject(createRandomSuare());
game.addObject(createRandomSuare());