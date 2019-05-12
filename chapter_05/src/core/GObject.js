function GObject(){
    this.update = function(dt, mouse){
        throw "not implememnt";
    };
    this.init = function(){
        try{
            this.onInit();
        }catch(e){
            console.log('init error:'+e);
        }
    };
    this.onInit = function(){

    }
}