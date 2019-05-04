// 工具类
var Vector2d = function(x, y) {
    this.x= x;
    this.y = y;
    // 缩放
    this.scale= function (scale) {
        this.x *= scale;
        this.y *= scale;
    };
    //加 另一个向量
    this.add = function (vec2) {
        this.x += vec2.x;
        this.y += vec2.y;
    };
    //减 另一个向量
    this.sub= function (vec2) {
        this.x -= vec2.x;
        this.y -= vec2.y;
    };
    //相反方向
    this.negate= function () {
        this.x = -this.x;
        this.y = -this.y;
    };
    //X相反方向
    this.negateX= function () {
        this.x = -this.x;
    };
    //Y相反方向
    this.negateY= function () {
        this.y = -this.y;
    };
    //向量长度
    this.length= function () {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    };
    //向量长度的平方
    this.lengthSquared= function () {
        return this.x * this.x + this.y * this.y;
    };
    //点积
    this.dotMul = function(v){
        return this.x*v.x+this.y*v.y;
    };
    //平方根
    this.getMod = function(){
        return Math.sqrt(this.x*this.x+this.y*this.y);
    };
    //标准化
    this.normalize= function () {
        var len = Math.sqrt(this.x * this.x + this.y * this.y);
        if (len) {
            this.x /= len;
            this.y /= len;
        }
        return len;
    };
    /**
     *获取夹角,注意返回的是角度
     */
    this.getAngle = function(v){
        return Math.acos(this.dotMul(v)/(this.getMod()*v.getMod()))* 180/Math.PI;
 
    };
    //乘 除
    this.mulNum = function(num){
        return new Vector2d(this.x*num,this.y*num);
    };
    /**
     *求某向量的法向量,返回一个单位向量,其模为1,返回的向量总是指向this向量的右边
     * @return
     */
    this.getNormal = function(){
        return new Vector2d(this.y/(Math.sqrt(this.x*this.x+this.y*this.y)),-this.x/(Math.sqrt(this.x*this.x+this.y*this.y)));
    };
    this.reflex = function(v){
        var normal=v.getNormal();
        return this.sub(normal.mulNum(2*this.dotMul(normal)));
    };
    this.mirror = function(v){
        return this.reflex(v).getNegative();
    };
    //旋转
    this.rotate = function (angle) {
        var vx = this.x,  
        vy = this.y, 
        cosVal = Math.cos(angle), 
        sinVal = Math.sin(angle);
        this.x = vx * cosVal - vy * sinVal;
        this.y = vx * sinVal + vy * cosVal;
    }
    //调试
    this.toString= function () {
        return '(' + this.x.toFixed(3) + ',' + this.y.toFixed(3) + ')';
    }
}

var GVector2dUtils={
    angle : function(start,end){
        var diff_x = end.x - start.x,
            diff_y = end.y - start.y;
        //返回角度,不是弧度
        return 360*Math.atan(diff_y/diff_x)/(2*Math.PI);
    },
    negate:function(v){
        return new Vector2d(-v.x, -v.y);
    },
    // 比较两个向量是否一样
    equals:function(v1, v2){
        if(v1.y ==0 && v1.x!=v2.x){
            return false;
        }else if(v1.x ==0 && v1.y!=v2.y){
            return false;
        } else if(v1.x / v1.y == v2.x/v2.y && ((v1.x >0 && v2.x >0 )||(v1.x <0 && v2.x<0))){
            return true;
        }else{
            return false;
        }
    }
}

var GPointUtils = {
    // 获取距离
    distance : function(p1, p2){
        var dx = p1.x - p2.x;
        var dy = p1.y - p2.y;
        return Math.sqrt(Math.pow(dx,2)+Math.pow(dy,2))
    }
}