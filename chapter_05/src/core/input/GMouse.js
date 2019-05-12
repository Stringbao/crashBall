GMOUSE_STATE = {
    NONE:0,
    DOWN:0x0101,
    UP:0x0102
};

function GMouse(){
    this.state = GMOUSE_STATE.NONE;
    this._position = new GPoint(0,0);

    this._lastState = GMOUSE_STATE.NONE;
    this._lastPosition = new GPoint(0,0);

    this._newState = GMOUSE_STATE.NONE;
    this._newPosition = new GPoint(0,0);
    this.update = function(){
        this._lastPosition.x = this._position.x;
        this._lastPosition.y = this._position.y;
        this._position.x = this._newPosition.x;
        this._position.y = this._newPosition.y;

        this._lastState = this._state;
        this._state = this._newState;
    };
    this.receive = function(state, x, y){
        this._newPosition.x = x;
        this._newPosition.y = y;
        this._newState = state;
    };
    this.getPosition = function(){
        return this._position;
    };

    this.getState = function(){
        return this._state;
    };
}