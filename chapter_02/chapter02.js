//应用代码
var OBJECT_TYPE_DESK = 0x01;
var OBJECT_TYPE_BALL = 0x02;

var DESK_BOUNDS = {right:800,left: 0,top: 0, bottom : 450};
// 摩擦力，1秒减少20
var VAR_FRICTION = 20;
/**
 * 球
 */
function Ball(){
    GObject.call(this, OBJECT_TYPE_BALL);
    this.direction = new Vector2d(1,0);
    // 半径
    this.radius = 20;
    // 速度
    this.speed = 200;
    // 是否已更新
    this.isUpdated = false;
    // 设置方向
    this.setDirection = function(x,y){
        this.direction.x = x;
        this.direction.y = y;
    };
    this.getDirection = function(){
        return this.direction;
    };
    this.update = function(dt){
        // 速度递减
        this.speed -= dt * VAR_FRICTION;
        if(this.speed <0){
            this.speed = 0;
        }
        this.pos.x += this.speed * dt * this.direction.x;
        this.pos.y += this.speed * dt *this.direction.y;
        
        // 边界位置校对
        if(this.pos.x- this.radius < DESK_BOUNDS.left){
            this.pos.x = DESK_BOUNDS.left + this.radius;
        }else if(this.pos.x + this.radius > DESK_BOUNDS.right){
            this.pos.x = DESK_BOUNDS.right - this.radius;
        }
        if(this.pos.y - this.radius < DESK_BOUNDS.top){
            this.pos.y = DESK_BOUNDS.top + this.radius;
        }else if(this.pos.y + this.radius > DESK_BOUNDS.bottom){
            this.pos.y = DESK_BOUNDS.bottom - this.radius;
        }
    };
    this.render = function(dt){
        this.dom.style.left = parseInt(this.pos.x - this.radius);
        this.dom.style.top = parseInt(this.pos.y - this.radius);
    };
    this.createDom = function(){
        this.dom = Dom.create();
        this.dom.className = 'ball';
        this.dom.style.width = (2*this.radius) + 'px';
        this.dom.style.height = (2*this.radius) + 'px';
        this.dom.id = this.id;
        return this.dom;
    }
}

function Chapter02(screenId, fpsId){
    Game.call(this, screenId, fpsId);
    this.onUpdate = function(dt){
        for(var index = 0; index < this.objects.length; index++){
            var obj = this.objects[index];
            obj.isUpdated = false;
            if(obj.getType() == OBJECT_TYPE_BALL){
                // 边界碰撞检查
                var pos = obj.getPosition();
                if(pos.x - obj.radius <= DESK_BOUNDS.left
                    ||pos.x + obj.radius >= DESK_BOUNDS.right){
                    obj.getDirection().negateX();
                    obj.isUpdated = true;
                }
                if(pos.y - obj.radius <= DESK_BOUNDS.top
                    ||pos.y + obj.radius >= DESK_BOUNDS.bottom){
                    obj.getDirection().negateY();
                    obj.isUpdated = true;
                }
            }
        }
        
        // 球球碰撞检查
        for(var index = 0; index < this.objects.length; index++){
            var obj = this.objects[index];
            if(obj.getType() == OBJECT_TYPE_BALL && obj.isUpdated == false){
                for(var indexOther = 0; indexOther < this.objects.length; indexOther++){
                    if(indexOther == index){
                        continue;
                    }
                    var objOther = this.objects[indexOther];
                    if(objOther.getType() == OBJECT_TYPE_BALL){
                        var distance = GPointUtils.distance(obj.getPosition(),objOther.getPosition());
                        if(distance <= obj.radius + objOther.radius){
                            var objDirectionX = obj.getDirection().x;
                            var objDirectionY = obj.getDirection().y;
                            obj.setDirection(objOther.getDirection().x, objOther.getDirection().y);
                            objOther.setDirection(objDirectionX, objDirectionY);
                            
                            // 有重叠调整位置
                            var objPos = obj.getPosition();
                            var objOtherPos = objOther.getPosition();
                            var adjustValue = obj.radius + objOther.radius - distance;
                            obj.setPosition(objPos.x + obj.getDirection().x * adjustValue,
                                objPos.y + obj.getDirection().y * adjustValue);
                            objOther.setPosition(objOtherPos.x + objOther.getDirection().x * adjustValue,
                                objOtherPos.y + objOther.getDirection().y * adjustValue);

                            obj.isUpdated = true;
                            objOther.isUpdated = true;
                            break;
                        }
                    }
                }
            }
        }
    }
}

function createRandomBall(){
    var ball = new Ball();
    ball.setPosition( 100 + Math.random() * 500, 100 + Math.random() * 200);
    ball.getDirection().rotate(Math.random() * 360);
    return ball;
}

// 构建游戏
var game = new Chapter02('game_screen','game_fps');
// 启动游戏
game.start();
// 添加球
game.addObject(createRandomBall());
game.addObject(createRandomBall());
game.addObject(createRandomBall());
game.addObject(createRandomBall());
game.addObject(createRandomBall());
game.addObject(createRandomBall());
game.addObject(createRandomBall());