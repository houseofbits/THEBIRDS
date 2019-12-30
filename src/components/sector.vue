<template>
    <div class="sector" :style="{backgroundImage: 'url(' + backgroundImageUrl + ')'}">
        <div v-if="backgroundImageActiveUrl" class="active" :style="{backgroundImage: 'url(' + backgroundImageActiveUrl + ')'}"></div>
    </div>
</template>

<script>

import {Vector3, Vector2, Rectangle, getRandomArbitrary} from './common.js'

export default {
    props: ['sector'],
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
        onMoveOut:function(selectedIndex){
            var parent = this;
            var delay = getRandomArbitrary(0,300);
            var blurValue = this.getImageProp('maxBlur');
            if(selectedIndex == this.$vnode.key){
                delay = 0;
            }
            Velocity(this.$el, {
                translateZ:parent.position.z + 800,
                blur:blurValue
            }, {
                delay:delay,
                duration: 600,
            });
        },
        onMoveIn:function(){
            var parent = this;
            var delay = getRandomArbitrary(0,300);
            Velocity(this.$el, {
                translateZ:parent.position.z,
                blur:4
            }, {
                delay:delay,
                duration: 400,
            });
            Velocity(this.$el, {
                blur:0
            }, 100);
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
}
</script>

<style scoped>

  .sector{
      position: absolute;
      background-repeat: round;
  }
  .sector .active{
      position:relative;
      width:100%;
      height:100%;
      top:0px;
      left:0px;
      background-repeat: round;
  }

</style>