function Scene() {
    GNode.call(this, OBJECT_TYPE.SCENE);
    this._loop = null;
    this._launcher = null;
    this._labelCooldown = null;
    this._labelScore = null;
    this._labelBallCount = null;
    this._state = GAME_STATE.RUNNING;
    this._data = {
        score: 0,
        maxBallCount:SETTINGS.BALL_COUNT,
        ballCount: SETTINGS.BALL_COUNT
    };
    this.onUpdate = function (dt, mouse) {
            this._labelCooldown.setText('cooldown:' + this._launcher.getCooldown().toFixed(2));
            this._labelScore.setText('score:' + this._data.score);
            this._labelBallCount.setText('ball:' + this._data.ballCount);
            if(this._state== GAME_STATE.RUNNING){
                this._loop.checkBallWithEdge(this);
                this._loop.checkBallWithBall(this);
                this._loop.checkBallWithHold(this);
                this._loop.checkLaunch(this, mouse);
                if(this._loop.checkOver(this)){
                    if(this._data.score!= this._data.maxBallCount){
                        alert('failure');
                    }else{
                        alert('success');
                    }
                    this._state = GAME_STATE.OVER;
                }
            }
        },
        this.onInit = function () {
            this._loop = new SceneLoop();
            this._labelCooldown = new GLabel();
            this._labelCooldown.setPosition(DESK_BOUNDS.LEFT + 300, DESK_BOUNDS.TOP + 10);
            this.addObject(this._labelCooldown);

            this._labelScore = new GLabel();
            this._labelScore.setPosition(DESK_BOUNDS.LEFT + 200, DESK_BOUNDS.TOP + 10);
            this.addObject(this._labelScore);

            this._labelBallCount = new GLabel();
            this._labelBallCount.setPosition(DESK_BOUNDS.LEFT + 100, DESK_BOUNDS.TOP + 10);
            this.addObject(this._labelBallCount);

            this._launcher = new Launcher();
            this._launcher.setPosition(DESK_BOUNDS.LEFT + this._launcher.getRadius(),
                DESK_BOUNDS.BOTTOM - this._launcher.getRadius());
            this.addObject(this._launcher);

            var blockBall = new BlockBall();
            blockBall.setPosition(DESK_BOUNDS.LEFT, DESK_BOUNDS.BOTTOM);
            this.addObject(blockBall);

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
};

function SceneLoop(){
    this.checkBallWithEdge=function (scene) {
        for (var index = 0; index < scene._objects.length; index++) {
            var obj = scene._objects[index];
            obj.updated = false;
            if (obj.getType() == OBJECT_TYPE.BALL) {
                // 边界碰撞检查
                var pos = obj.getPosition();
                if (pos.x - obj.getRadius() <= DESK_BOUNDS.LEFT ||
                    pos.x + obj.getRadius() >= DESK_BOUNDS.RIGHT) {
                    obj.getDirection().negateX();
                    obj.updated = true;
                }
                if (pos.y - obj.getRadius() <= DESK_BOUNDS.TOP ||
                    pos.y + obj.getRadius() >= DESK_BOUNDS.BOTTOM) {
                    obj.getDirection().negateY();
                    obj.updated = true;
                }
            }
        }
    };
    this.checkBallWithBall= function (scene) {
        // 球球碰撞检查
        for (var index = 0; index < scene._objects.length; index++) {
            var obj = scene._objects[index];
            if (obj.getType() != OBJECT_TYPE.BALL || obj.updated != false) {
                continue;
            }
            for (var indexOther = 0; indexOther < scene._objects.length; indexOther++) {
                if (indexOther == index) {
                    continue;
                }
                var objOther = scene._objects[indexOther];
                if (objOther.getType() == OBJECT_TYPE.BALL) {
                    var distance = GPointUtils.distance(obj.getPosition(), objOther.getPosition());
                    if (distance <= obj.getRadius() + objOther.getRadius()) {
                        // 计算新方向
                        var objPos = obj.getPosition();
                        var objOtherPos = objOther.getPosition();
                        var ccVector = new GVector(objPos.x - objOtherPos.x, objPos.y - objOtherPos.y);

                        var ccNormal = ccVector.getNormal();

                        var angleOfDirection = obj.getDirection().getAngle(objOther.getDirection());
                        if (angleOfDirection == 0) {
                            // 方向不变，调整速度
                            var speed = (obj.getSpeed() + objOther.getSpeed()) / 2;
                            obj.setSpeed(speed);
                            objOther.setSpeed(speed);
                        } else {
                            var angle = obj.getDirection().getAngle(ccNormal);
                            if (angle < 90) {
                                obj.getDirection().reflex(GVectorUtils.negate(ccNormal));
                            } else {
                                obj.getDirection().reflex(ccNormal);
                            }
                            var angleOther = objOther.getDirection().getAngle(ccNormal);
                            if (angleOther < 90) {
                                objOther.getDirection().reflex(GVectorUtils.negate(ccNormal));
                            } else {
                                objOther.getDirection().reflex(ccNormal);
                            }
                            //调整速度
                            var speed = (obj.getSpeed() + objOther.getSpeed()) / 2;
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
                } else if (objOther.getType() == OBJECT_TYPE.BLOCKBALL) {
                    var distance = GPointUtils.distance(obj.getPosition(), objOther.getPosition());
                    if (obj.getState() == BALL_STATE.RUN && distance <= obj.getRadius() + objOther.getRadius()) {
                        // 计算新方向
                        var objPos = obj.getPosition();
                        var objOtherPos = objOther.getPosition();
                        var ccVector = new GVector(objPos.x - objOtherPos.x, objPos.y - objOtherPos.y);

                        var ccNormal = ccVector.getNormal();

                        var angle = obj.getDirection().getAngle(ccNormal);
                        if (angle < 90) {
                            obj.getDirection().reflex(GVectorUtils.negate(ccNormal));
                        } else {
                            obj.getDirection().reflex(ccNormal);
                        }

                        // 有重叠调整位置
                        var adjustValue = obj.getRadius() + objOther.getRadius() - distance;
                        obj.setPosition(objPos.x + obj.getDirection().x * adjustValue,
                            objPos.y + obj.getDirection().y * adjustValue);

                        obj.updated = true;
                        objOther.updated = true;
                        break;
                    } else if (obj.getState() == BALL_STATE.LAUNCHING && distance > obj.getRadius() + objOther.getRadius()) {
                        obj.setState(BALL_STATE.RUN);
                    }
                }
            }
        }
    };
    this.checkBallWithHold= function (scene) {
        // 球球碰撞检查
        for (var index = 0; index < scene._objects.length; index++) {
            var ball = scene._objects[index];
            if (ball.getType() != OBJECT_TYPE.BALL || ball.updated != false) {
                continue;
            }
            for (var indexOther = 0; indexOther < scene._objects.length; indexOther++) {
                if (indexOther == index) {
                    continue;
                }
                var hole = scene._objects[indexOther];
                if (hole.getType() != OBJECT_TYPE.HOLE) {
                    continue;
                }
                var ballPos = ball.getPosition();
                if (!this.inEllipse(hole.getRadiusX(), hole.getRadiusY(),
                        ballPos.x - hole.getPosition().x,
                        ballPos.y - hole.getPosition().y)) {
                    continue;
                }
                // 删除球
                ball.remove();
                scene._data.score++;
            }
        }
    };
    this.inEllipse= function (radiusX, radiusY, x, y) {
        return Math.pow((x / radiusX), 2) + Math.pow((y / radiusY), 2) < 1 ? true : false;
    };
    this.checkLaunch = function (scene, mouse) {
        // 生成新的球
        if (mouse.getState() == GMOUSE_STATE.DOWN && scene._data.ballCount > 0) {
            if (scene._launcher.getCooldown() == 0) {
                scene._launcher.resetCooldown();
                var ball = new Ball();
                ball.setPosition(scene._launcher.getPosition().x, scene._launcher.getPosition().y);
                ball.setDirection(scene._launcher.getDirection().x, scene._launcher.getDirection().y);
                ball.setState(BALL_STATE.LAUNCHING);
                scene.addObject(ball);
                scene._data.ballCount--;
            }
        }
    };
    this.checkOver = function(scene){
        var isOver = true;
        for (var index = 0; index < scene._objects.length; index++) {
            var ball = scene._objects[index];
            if (ball.getType() != OBJECT_TYPE.BALL || ball.updated != false) {
                continue;
            }
            if(ball.getSpeed() != 0){
                isOver = false;
                break;
            }
        }
        if(scene._data.ballCount > 0){
            return false;
        }else{
            return isOver;
        }
    }
};