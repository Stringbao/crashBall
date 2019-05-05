//应用代码
var OBJECT_TYPE = {
    SCENE : 0x0101,
    DESK : 0x0102,
    BALL : 0x0103,
    BLOCKBALL : 0x0104,
    LAUNCHER : 0x0105,
    HOLE : 0x0106
};

var BALL_STATE ={
    LAUNCHING : 0x0130,
    RUN : 0x0131
};

var GAME_STATE ={
    RUNNING : 0x0201,
    OVER : 0x0202
};

var DESK_BOUNDS = {
    LEFT: 0,
    TOP: 0, 
    RIGHT:800,
    BOTTOM : 450
};

var SETTINGS= {
    BALL_COUNT:10
};
// 摩擦力，1秒减少20
var VAR_FRICTION = 20;
// 冷却时间2秒
var MAX_COOLDOWN_LAUNCH = 1;