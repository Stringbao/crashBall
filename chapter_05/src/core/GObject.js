
/**
 * @description GNode，GElement，GControl的父类 必须要实现update方法
 */
function GObject(){
    /**
     * @description update
     */
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