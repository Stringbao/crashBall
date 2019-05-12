var GDom = {
    find : function(id){
        return document.getElementById(id);
    },
    create : function(){
        var dom = document.createElement('div');
        dom.style.position='absolute';
        return dom;
    },
    remove : function(el){
        el.parentNode.removeChild(el);
    },
    append:function(parent, child){
        if(parent && child){
            parent.append(child);
        }
        
    },
    hide:function(el){
        el.style.display = "none";
    }
};