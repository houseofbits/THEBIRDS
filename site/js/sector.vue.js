
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
        }        
    },
    methods: {
        getImageProp:function(name){
            if(this.data && typeof this.data.mainImage != 'undefined'){
                if(typeof this.data.mainImage[name] != 'undefined'){
                    return this.data.mainImage[name];
                }
            }
            return '';
        },
        blurEffectEventReceived:function(on){
            var value = 0;    
            if(on){
                value = this.getImageProp('maxBlur');        
            }
            Velocity(this.$el,{
                blur:value
            }, { duration: 1000});
        }
    },
    mounted:function () {

        this.$parent.$on('blur-effect-event', this.blurEffectEventReceived);

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