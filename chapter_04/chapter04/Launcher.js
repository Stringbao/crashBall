
function Launcher(){
    GElement.call(this, OBJECT_TYPE.LAUNCHER);
    this._direction = new GVector(1,0);
    this._radius = 40;
    this._angle = 0;
    // 冷却时间
    this._cooldown = 0;
    this._direction = new GVector(0,0);
    this.getDirection = function(){
        return this._direction;
    };
    this.getCooldown = function(){
        return this._cooldown;
    };
    this.resetCooldown = function(){
        this._cooldown = MAX_COOLDOWN_LAUNCH;
    };
    this.getRadius = function(){
        return this._radius;
    };
    this.onUpdate = function(dt, mouse){
        var direction = new GVector(mouse.getPosition().x - 0, mouse.getPosition().y - DESK_BOUNDS.BOTTOM);
        this._direction.x= direction.x;
        this._direction.y = direction.y;
        this._direction.normalize();
        var angle = 90 - new GVector(1,0).getAngle(direction);
        if(angle != this._angle){
            this._angle = angle;
            this._renderFlag = true;
        }
        this._cooldown -= dt;
        if(this._cooldown < 0){
            this._cooldown = 0;
        }
    };
    this.onRender = function(dt){
        this._el.style.left = parseInt(this.getPosition().x - this._radius) + 'px';
        this._el.style.top = parseInt(this.getPosition().y - this._radius) + 'px';

        this._el.style.transform = 'rotate(' + this._angle + 'deg)';
    };
    this.createEl = function(){
        this._el = GDom.create();
        this._el.id = this._id;
        this._el.className = 'launcher';
        this._el.style.width = (2*this._radius) + 'px';
        this._el.style.height = (2*this._radius) + 'px';
        return this._el;
    }
}
