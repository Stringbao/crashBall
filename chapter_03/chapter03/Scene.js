

function Scene(){
    GNode.call(this, OBJECT_TYPE.SCENE);
    this._launcher = null;
    this.onUpdate = function(dt, mouse){
        for(var index = 0; index < this._objects.length; index++){
            var obj = this._objects[index];
            obj.updated = false;
            if(obj.getType() == OBJECT_TYPE.BALL){
                // 边界碰撞检查
                var pos = obj.getPosition();
                if(pos.x - obj.getRadius() <= DESK_BOUNDS.LEFT
                    ||pos.x + obj.getRadius() >= DESK_BOUNDS.RIGHT){
                    obj.getDirection().negateX();
                    obj.updated = true;
                }
                if(pos.y - obj.getRadius() <= DESK_BOUNDS.TOP
                    ||pos.y + obj.getRadius() >= DESK_BOUNDS.BOTTOM){
                    obj.getDirection().negateY();
                    obj.updated = true;
                }
            }
        }
        
        // 球球碰撞检查
        for(var index = 0; index < this._objects.length; index++){
            var obj = this._objects[index];
            if(obj.getType() == OBJECT_TYPE.BALL && obj.updated == false){
                for(var indexOther = 0; indexOther < this._objects.length; indexOther++){
                    if(indexOther == index){
                        continue;
                    }
                    var objOther = this._objects[indexOther];
                    if(objOther.getType() == OBJECT_TYPE.BALL){
                        var distance = GPointUtils.distance(obj.getPosition(),objOther.getPosition());
                        if(distance <= obj.getRadius() + objOther.getRadius()){
                            // 计算新方向
                            var objPos = obj.getPosition();
                            var objOtherPos = objOther.getPosition();
                            var ccVector = new GVector(objPos.x - objOtherPos.x, objPos.y - objOtherPos.y);
                           
                            var ccNormal = ccVector.getNormal();

                            var angleOfDirection = obj.getDirection().getAngle(objOther.getDirection());
                            if(angleOfDirection == 0){
                                // 方向不变，调整速度
                                var speed = (obj.getSpeed() + objOther.getSpeed())/2;
                                obj.setSpeed(speed);
                                objOther.setSpeed(speed);
                            }else{
                                var angle = obj.getDirection().getAngle(ccNormal);
                                if(angle<90){
                                    obj.getDirection().reflex(GVectorUtils.negate(ccNormal));
                                }else{
                                    obj.getDirection().reflex(ccNormal);
                                }
                                var angleOther = objOther.getDirection().getAngle(ccNormal);
                                if(angleOther < 90){
                                    objOther.getDirection().reflex(GVectorUtils.negate(ccNormal));
                                }else{
                                    objOther.getDirection().reflex(ccNormal);
                                }
                                //调整速度
                                var speed = (obj.getSpeed() + objOther.getSpeed())/2;
                                obj.setSpeed(speed);
                                objOther.setSpeed(speed);
                            }
                            
                            // 有重叠调整位置
                            var adjustValue = obj.getRadius() + objOther.getRadius() - distance;
                            obj.setPosition(objPos.x + obj.getDirection().x * adjustValue,
                                objPos.y + obj.getDirection().y * adjustValue);
                            objOther.setPosition(objOtherPos.x + objOther.getDirection().x * adjustValue,
                                objOtherPos.y + objOther.getDirection().y * adjustValue);

                            obj.updated = true;
                            objOther.updated = true;
                            break;
                        }
                    }
                }
            }
        }

        SceneUpdateLoop.checkBallAndHold(this);

        // 生成新的球
        if(mouse.getState() == GMOUSE_STATE.DOWN){
            if(this.launcher.getCooldown() == 0){
                this.launcher.resetCooldown();
                var ball = new Ball();
                ball.setPosition(this.launcher.getPosition().x, this.launcher.getPosition().y);
                ball.setDirection(this.launcher.getDirection().x, this.launcher.getDirection().y);
                this.addObject(ball);
            }
        }
    },
    this.onInit = function(){
        this.launcher = new Launcher();
        this.launcher.setPosition(DESK_BOUNDS.LEFT + this.launcher.getRadius(),
             DESK_BOUNDS.BOTTOM - this.launcher.getRadius());
        this.addObject(this.launcher);

        var holeLT = new Hole();
        holeLT.setPosition(DESK_BOUNDS.LEFT + holeLT.getRadiusX(), DESK_BOUNDS.TOP + holeLT.getRadiusY());
        this.addObject(holeLT);
        
        var holeRT = new Hole();
        holeRT.setPosition(DESK_BOUNDS.RIGHT - holeLT.getRadiusX(), DESK_BOUNDS.TOP + holeLT.getRadiusY());
        this.addObject(holeRT);

        var holeRB = new Hole();
        holeRB.setPosition(DESK_BOUNDS.RIGHT - holeLT.getRadiusX(), DESK_BOUNDS.BOTTOM - holeLT.getRadiusY());
        this.addObject(holeRB);
    }
}

var SceneUpdateLoop = {
    checkBallAndHold :function(scene){
        // 球球碰撞检查
        for(var index = 0; index < scene._objects.length; index++){
            var ball = scene._objects[index];
            if(ball.getType() != OBJECT_TYPE.BALL || ball.updated != false){
                continue;
            }
            for(var indexOther = 0; indexOther < scene._objects.length; indexOther++){
                if(indexOther == index){
                    continue;
                }
                var hole = scene._objects[indexOther];
                if(hole.getType() != OBJECT_TYPE.HOLE){
                    continue;
                }
                var ballPos = ball.getPosition();
                if(!this.inEllipse(hole.getRadiusX(), hole.getRadiusY(),
                    ballPos.x - hole.getPosition().x,
                    ballPos.y - hole.getPosition().y)){
                    continue;
                }
                // 删除球
                ball.remove();
            }
        }
    },
    inEllipse : function(radiusX, radiusY,x,y){
        return Math.pow((x/radiusX),2) + Math.pow((y/radiusY),2) < 1 ? true : false;
    }
};