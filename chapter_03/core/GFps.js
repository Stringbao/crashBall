function GFps(){
    GObject.call(this, null);
    this._counter = 0;
    this._time = 0;
    this._value = 0;
    this.update = function(dt, mouse){
        this._time += dt;
        this._counter++;
        if(this._time >= 1){
            this._value = this.counter;
            this._counter = 0;
            this._time = 0;
        }
    };
    this.getValue = function(){
        return this._value;
    }
}