
Vue.component('sector', {
    props: ['sector'],
    template:'#sector-template',
    data: function () {
        return { data: this.sector }
    },
    computed:{
        backgroundImageUrl:function(){
            return this.getImageProp('image');
        },
        backgroundImageActiveUrl:function(){
            return this.getImageProp('imageActive');
        },
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
        onClick:function(){
            this.$parent.$emit('sector-on-click', this.$vnode.key);
        },
        //mousedown/mouseover or touchstart
        onGrb:function(){
            this.$parent.$emit('sector-grab', this.$vnode.key);
        },
        ///mouseup or touchend
        onRelease(){
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
        blurEffect:function(on){
            var value = 0;
            if(on){
                value = this.getImageProp('maxBlur');
            }
            Velocity(this.$el,{
                blur:value
            }, { duration: 1000});
        },
        onBlurEffectOn:function(excludeIndex){
            if (excludeIndex != this.$vnode.key) {
                this.blurEffect(true);
            } else {
                this.blurEffect(false);
            }
        },
        onBlurEffectOff:function(){
            this.blurEffect(false);
        }                        
    },
    mounted:function () {

        this.$parent.$on('blur-effect-event', this.blurEffect);
        this.$parent.$on('blur-effect-on', this.onBlurEffectOn);
        this.$parent.$on('blur-effect-off', this.onBlurEffectOff);

        var position = new Vector3(this.getImageProp('position'));
        var rotation = new Vector3(this.getImageProp('rotation'));
        var size = new Rectangle(this.getImageProp('size'));

        Velocity(this.$el, {
            translateX:position.x,
            translateY:position.y,
            translateZ:position.z,
            rotateX:rotation.x,
            rotateY:rotation.y,
            rotateZ:rotation.z,
            width:size.width,
            height:size.height
        }, 0);
    }
})