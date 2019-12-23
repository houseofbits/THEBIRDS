
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
        },
        position:function(){
            return new Vector3(this.getImageProp('position'));
        }
    },
    methods: {
        // //mousedown/mouseover or touchstart
        // onGrab:function(){
        //     this.$parent.$emit('sector-grab', this.$vnode.key);
        // },
        // ///mouseup or touchend
        // onRelease(){
        //     //console.log(this.$vnode.key);
        //     this.$parent.$emit('sector-release', this.$vnode.key);
        // },
        // //mouseout
        // onLeave(){
        //     this.$parent.$emit('sector-leave', this.$vnode.key);
        // },
        getImageProp:function(name){
            if(this.data && typeof this.data.mainImage != 'undefined'){
                if(typeof this.data.mainImage[name] != 'undefined'){
                    return this.data.mainImage[name];
                }
            }
            return '';
        },
        blurEffect:function(on){

            Velocity(this.$el,"finish");

            var value = 0;
            if(on){
                value = this.getImageProp('maxBlur');
            }
            Velocity(this.$el,{
                blur:value
            }, { duration: 500});
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
        },
        onMoveOut:function(){

            var parent = this;

            var delay = getRandomArbitrary(0,40)
            
            Velocity(this.$el, {
                translateZ:parent.position.z + 500,
            }, {
                duration: 200,
            });    
        },
        onMoveIn:function(){
            var parent = this;
            Velocity(this.$el, {
                translateZ:parent.position.z,
            }, {
                duration: 200,
            });  
        },
        onShake:function(index){
            if(index == this.$vnode.key){
                var parent = this;

                var rotY = 0;   //getRandomArbitrary(-20,20);
                var mov = getRandomArbitrary(0,50)
                
                Velocity(this.$el, {
                    translateZ:parent.position.z + mov,
                    rotateY:rotY,
                }, {
                    duration: 300,
                    easing: "swing",
                    complete:function(elements){
                                                
                        Velocity(parent.$el, {
                            translateZ:parent.position.z,
                            rotateX:0,
                            rotateY:0,
                        },200);

                    } });                
            }
        }                  
    },
    mounted:function () {

        this.$parent.$on('blur-effect-event', this.blurEffect);
        this.$parent.$on('blur-effect-on', this.onBlurEffectOn);
        this.$parent.$on('blur-effect-off', this.onBlurEffectOff);
        this.$parent.$on('move-out', this.onMoveOut);
        this.$parent.$on('move-in', this.onMoveIn);  
        this.$parent.$on('shake', this.onShake);    

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