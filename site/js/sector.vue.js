
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
        blurEffectEventReceived:function(value){
            //console.log('click event received '+value);
            Velocity(this.$el,{
                blur:value
            }, { duration: 1000});
        }
    },
    mounted:function () {

        this.$parent.$on('blur-effect-event', this.blurEffectEventReceived);

        Velocity(this.$el, {
            translateX:this.getImageProp('translateX'),
            translateY:this.getImageProp('translateY'),
            translateZ:this.getImageProp('translateZ'),
            rotateX:this.getImageProp('rotateX'),
            rotateY:this.getImageProp('rotateY'),
            rotateZ:this.getImageProp('rotateZ'),
            width:this.getImageProp('width'),
            height:this.getImageProp('height')
        }, 0);
    }
})