
Vue.component('clipregion', {
    props: ['sector'],
    template:'#clipregion-template',
    data: function () {
        return { data: this.sector }
    },
    computed:{
        width:function(){
            var size = new Rectangle(this.getImageProp('size'));
            return size.width;
        },
        height:function(){
            var size = new Rectangle(this.getImageProp('size'));
            return size.height;
        },
        polygonPoints:function(){
            return this.getImageProp('clipPolygon');
        }
    },
    methods: {
        //mousedown/mouseover or touchstart
        onGrab:function(){
            this.$parent.$emit('sector-grab', this.$vnode.key);
        },
        ///mouseup or touchend
        onRelease(){
            //console.log(this.$vnode.key);
            this.$parent.$emit('sector-release', this.$vnode.key);
        },
        //mouseout
        onLeave(){
            this.$parent.$emit('sector-leave', this.$vnode.key);
        },
        getImageProp:function(name){
            if(this.data && typeof this.data.mainImage != 'undefined'){
                if(typeof this.data.mainImage[name] != 'undefined'){
                    return this.data.mainImage[name];
                }
            }
            return '';
        },
    },
    mounted:function () {

        var position = new Vector3(this.getImageProp('position'));
        var rotation = new Vector3(this.getImageProp('rotation'));
        var size = new Rectangle(this.getImageProp('size'));
/*
        Velocity(this.$el, {
            translateX:position.x,
            translateY:position.y,
            translateZ:position.z,
            rotateX:rotation.x,
            rotateY:rotation.y,
            rotateZ:rotation.z,
            width:size.width,
            height:size.height
        }, 0);*/
    }
})