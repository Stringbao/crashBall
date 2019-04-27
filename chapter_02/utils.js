// 工具类
var Vector2d = function vector2d(x, y) {
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
    //标准化
    this.normalize= function () {
        var len = Math.sqrt(this.x * this.x + this.y * this.y);
        if (len) {
            this.x /= len;
            this.y /= len;
        }
        return len;
    };
    //旋转
    this.rotate = function (angle) {
        var vx = this.x,  
        vy = this.y, 
        cosVal = Math.cos(angle), 
        sinVal = Math.sin(angle);
        this.x = vx * cosVal - vy * sinVal;
        this.y = vx * sinVal + vy * cosVal;
    };
    //调试
    this.toString= function () {
        return '(' + this.x.toFixed(3) + ',' + this.y.toFixed(3) + ')';
    };
}

var GPointUtils = {
    // 获取距离
    distance : function(p1, p2){
        var dx = p1.x - p2.x;
        var dy = p1.y - p2.y;
        return Math.sqrt(Math.pow(dx,2)+Math.pow(dy,2))
    }
}