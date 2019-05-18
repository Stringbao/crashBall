
/**
 * @description 点对象
 * @param {int} x 
 * @param {int} y 
 */
function GPoint(x,y){
    this.x = x;
    this.y = y;
};

/**
 * @description 获取2点的距离
 */
var GPointUtils = {
    // 获取距离
    distance : function(p1, p2){
        var dx = p1.x - p2.x;
        var dy = p1.y - p2.y;
        return Math.sqrt(Math.pow(dx,2)+Math.pow(dy,2))
    }
};
