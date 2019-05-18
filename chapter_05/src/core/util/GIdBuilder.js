
/**
 * @description ID工具类
 */
var GIdBuilder = {
    _seed :0,
    newId : function(){
        return this._seed++;
    }
};