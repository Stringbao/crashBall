function GLabel(){
    GControl.call(this, GCONTROL_TYPE.LABEL);
    this.text = null;
    this.needUpdate = false;
    this.onUpdate = function(dt, mouse){
        this.getEl().style.left = parseInt(this.getPosition().x) + 'px';
        this.getEl().style.top = parseInt(this.getPosition().y) + 'px';
    };
    //override
    this.onRender = function(dt){
        if(this.needUpdate){
            this.dom.innerText = this.text;
            this.needUpdate = false;
        }
    };
    
    this.setText = function(value){
        if(this.text!=value){
            this.text = value;
            this.needUpdate = true;
        }
    }
}