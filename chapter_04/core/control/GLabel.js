function GLabel(){
    GControl.call(this, GCONTROL_TYPE.LABEL);
    this.text = null;
    this.onUpdate = function(dt, mouse){
        this._el.style.left = parseInt(this._position.x) + 'px';
        this._el.style.top = parseInt(this._position.y) + 'px';
    };
    //override
    this.onRender = function(dt){
        this._el.innerText = this.text;
    };
    
    this.setText = function(value){
        if(this.text!=value){
            this.text = value;
            this._renderFalg = true;
        }
    }
}