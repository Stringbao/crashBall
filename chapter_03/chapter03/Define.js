//应用代码
var OBJECT_TYPE = {
    SCENE : 0x0101,
    DESK : 0x0102,
    BALL : 0x0103,
    LAUNCHER : 0x0104,
    HOLE : 0x0105
};
var DESK_BOUNDS = {
    LEFT: 0,
    TOP: 0, 
    RIGHT:800,
    BOTTOM : 450
};
// 摩擦力，1秒减少20
var VAR_FRICTION = 0;
// 冷却时间2秒
var MAX_COOLDOWN_LAUNCH = 2;