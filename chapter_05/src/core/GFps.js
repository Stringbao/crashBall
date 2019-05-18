
/**
 * @description FPS对象，为_labelFps对象提供数据
 */
function GFps(){
    GObject.call(this, null);
    this._counter = 0;
    this._time = 0;
    this._value = 0;
    this.update = function(dt, mouse){
        this._time += dt;
        this._counter++;
        //1s内绘制，计算fps的值
        if(this._time >= 1){
            this._value = this._counter;
            this._counter = 0;
            this._time = 0;
        }
    };
    this.getValue = function(){
        return this._value;
    }
}