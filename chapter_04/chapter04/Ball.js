
function Ball(){
    GElement.call(this, OBJECT_TYPE.BALL);
    // 半径
    this._radius = 20;
    // 速度
    this._speed = 200;
    this._direction = new GVector(0,0);
    // 正在发射中，不与BlockBall碰撞检测
    this._state = BALL_STATE.LAUNCHING;
    this.updated = false;
    this.setState = function(state){
        this._state = state;
    };
    this.getState = function(){
        return this._state;
    };
    this.getSpeed = function(){
        return this._speed;
    };
    this.setSpeed = function(speed){
        if(speed < 0.01){
            this.speed = 0;
        }else{
            this._speed = speed;
        }
    };
    this.getRadius = function(){
        return this._radius;
    };
    // 设置方向
    this.setDirection = function(x,y){
        this._direction.x = x;
        this._direction.y = y;
    };
    this.getDirection = function(){
        return this._direction;
    };
    this.onUpdate = function(dt, mouse){
        // 速度递减
        this._speed -= dt * VAR_FRICTION;
        if(this._speed <0){
            this._speed = 0;
        }
        this._position.x += this._speed * dt * this._direction.x;
        this._position.y += this._speed * dt *this._direction.y;
        
        // 边界位置校对
        if(this._position.x- this._radius < DESK_BOUNDS.LEFT){
            this._position.x = DESK_BOUNDS.LEFT + this._radius;
        }else if(this._position.x + this._radius > DESK_BOUNDS.RIGHT){
            this._position.x = DESK_BOUNDS.RIGHT - this._radius;
        }
        if(this._position.y - this._radius < DESK_BOUNDS.TOP){
            this._position.y = DESK_BOUNDS.TOP + this._radius;
        }else if(this._position.y + this._radius > DESK_BOUNDS.BOTTOM){
            this._position.y = DESK_BOUNDS.BOTTOM - this._radius;
        }
        this._renderFlag = true;
    };
    this.onRender = function(dt){
        this._el.style.left = parseInt(this._position.x - this._radius) + 'px';
        this._el.style.top = parseInt(this._position.y - this._radius) + 'px';
    };
    this.createEl = function(){
        this._el = GDom.create();
        this._el.id = this._id;
        this._el.className = 'ball';
        this._el.style.width = (2*this._radius) + 'px';
        this._el.style.height = (2*this._radius) + 'px';
        return this._el;
    }
}
