//应用代码
var OBJECT_TYPE_DESK = 0x01;
var OBJECT_TYPE_BALL = 0x02;
var OBJECT_TYPE_LAUNCHER = 0x03;

var DESK_BOUNDS = {right:800,left: 0,top: 0, bottom : 450};
// 摩擦力，1秒减少20
var VAR_FRICTION = 0;
// 冷却时间2秒
var MAX_COOLDOWN_LAUNCH = 2;
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
    this.update = function(dt, mouse){
        // 速度递减
        this.speed -= dt * VAR_FRICTION;
        if(this.speed <0){
            this.speed = 0;
        }
        this.position.x += this.speed * dt * this.direction.x;
        this.position.y += this.speed * dt *this.direction.y;
        
        // 边界位置校对
        if(this.position.x- this.radius < DESK_BOUNDS.left){
            this.position.x = DESK_BOUNDS.left + this.radius;
        }else if(this.position.x + this.radius > DESK_BOUNDS.right){
            this.position.x = DESK_BOUNDS.right - this.radius;
        }
        if(this.position.y - this.radius < DESK_BOUNDS.top){
            this.position.y = DESK_BOUNDS.top + this.radius;
        }else if(this.position.y + this.radius > DESK_BOUNDS.bottom){
            this.position.y = DESK_BOUNDS.bottom - this.radius;
        }
    };
    this.render = function(dt){
        this.dom.style.left = parseInt(this.position.x - this.radius);
        this.dom.style.top = parseInt(this.position.y - this.radius);
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

function Launcher(){
    GObject.call(this, OBJECT_TYPE_LAUNCHER);
    this.direction = new Vector2d(1,0);
    // 是否已更新
    this.isUpdated = false;
    this.radius = 40;
    this.angle = 0;
    // 冷却时间
    this.cooldown = 0;
    this.direction = new Vector2d(0,0);
    // 设置方向
    this.setDirection = function(x,y){
        this.direction.x = x;
        this.direction.y = y;
    };
    this.getDirection = function(){
        return this.direction;
    };
    this.update = function(dt, mouse){
        var direction = new Vector2d(mouse.position.x - 0, mouse.position.y - DESK_BOUNDS.bottom);
        this.direction.x= direction.x;
        this.direction.y = direction.y;
        this.direction.normalize();
        this.angle = 90 - new Vector2d(1,0).getAngle(direction);
        this.cooldown -= dt;
        if(this.cooldown < 0){
            this.cooldown = 0;
        }
    };
    this.render = function(dt){
        this.dom.style.left = parseInt(this.position.x - this.radius);
        this.dom.style.top = parseInt(this.position.y - this.radius);

        this.dom.style.transform = 'rotate(' + this.angle + 'deg)';
    };
    this.createDom = function(){
        this.dom = Dom.create();
        this.dom.className = 'launcher';
        this.dom.style.width = (2*this.radius) + 'px';
        this.dom.style.height = (2*this.radius) + 'px';
        this.dom.id = this.id;
        return this.dom;
    }
}

function Chapter03(screenId, fpsId){
    Game.call(this, screenId, fpsId);
    this.launcher = null;
    this.onUpdate = function(dt, mouse){
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
                            // 计算新方向
                            var objPos = obj.getPosition();
                            var objOtherPos = objOther.getPosition();
                            var ccVector = new Vector2d(objPos.x - objOtherPos.x, objPos.y - objOtherPos.y);
                           
                            var ccNormal = ccVector.getNormal();

                            var objDirectionX = obj.getDirection().x;
                            var objDirectionY = obj.getDirection().y;
                            //obj.setDirection(objOther.getDirection().x, objOther.getDirection().y);
                            //obj.getDirection().reflex(ccVector);
                            //var p = obj.getDirection().getNormal();

                            var angleOfDirection = obj.getDirection().getAngle(objOther.getDirection());
                            if(angleOfDirection == 0){
                                // 方向不变，调整速度
                                var speed = (obj.speed + objOther.speed)/2;
                                obj.speed = speed;
                                objOther.speed = speed;
                            }else{
                                var angle = obj.getDirection().getAngle(ccNormal);
                                if(angle<90){
                                    obj.getDirection().reflex(GVector2dUtils.negate(ccNormal));
                                }else{
                                    obj.getDirection().reflex(ccNormal);
                                }
                                var angleOther = objOther.getDirection().getAngle(ccNormal);
                                if(angleOther < 90){
                                    objOther.getDirection().reflex(GVector2dUtils.negate(ccNormal));
                                }else{
                                    objOther.getDirection().reflex(ccNormal);
                                }
                                //调整速度
                                var speed = (obj.speed + objOther.speed)/2;
                                obj.speed = speed;
                                objOther.speed = speed;
                            }
                            
                            // 有重叠调整位置
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

        // 生成新的球
        if(mouse.state == GMOUSE_STATE.DOWN){
            if(this.launcher.cooldown == 0){
                this.launcher.cooldown = MAX_COOLDOWN_LAUNCH;
                var ball = new Ball();
                ball.setPosition(this.launcher.position.x, this.launcher.position.y);
                ball.direction.x = this.launcher.direction.x;
                ball.direction.y = this.launcher.direction.y;
                this.addObject(ball);
            }
        }
    },
    this.init = function(){
        this.launcher = new Launcher();
        this.launcher.position.x = DESK_BOUNDS.left + this.launcher.radius;
        this.launcher.position.y = DESK_BOUNDS.bottom - this.launcher.radius;
        this.addObject(this.launcher);
    },
    this.init();
}

function createLauncher(){
    var launcher = new Launcher();
    launcher.position.x = DESK_BOUNDS.left + launcher.radius;
    launcher.position.y = DESK_BOUNDS.bottom - launcher.radius;
    return launcher;
}

function createRandomBall(){
    var ball = new Ball();
    ball.setPosition( 100 + Math.random() * 500, 100 + Math.random() * 200);
    ball.getDirection().rotate(Math.random() * 360);
    return ball;
}
function createRandomBall1(){
    var ball = new Ball();
    ball.setPosition(100, 110);
    ball.getDirection().rotate(0);
    ball.speed=100;
    return ball;
}
function createRandomBall2(){
    var ball = new Ball();
    ball.setPosition(200, 110);
    ball.getDirection().rotate(0);
    return ball;
}

// 构建游戏
var game = new Chapter03('game_screen','game_fps');
// 启动游戏
game.start();