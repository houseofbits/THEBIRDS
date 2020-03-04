<template>
    <div :style="computeTransform()" class="sector">

        <!--div class="blurred-bg-mask">
            <div class="blurred-bg"></div>
        </div-->
        
        <div class="icon"></div>
        <div class="title"></div>

    </div>
</template>

<script>

    import {Vector3, Vector2, Rectangle, getRandomArbitrary, radiansToDegrees} from './common.js'    

    export default {
        name: "app",
        props: ['sector'],
        data: function(){ return { data: this.sector }},
        methods: {
            computeTransform: function () {
                var rotation = 0;
                return {                  
                    transform:'translateX('+this.data.position[0]+'px)'
                    +' translateY('+this.data.position[1]+'px)'
                    +' translateZ('+this.data.position[2]+'px)'
                    +' rotateY('+rotation+'deg)'
                };
            },
            init:function(){

                //1) calculate rotation angle from global position
                //2) set rotation angle
                //3) set x translation = 0

            }
        },
        mounted:function() {
            this.inint();
        }
    }
</script>

<style scoped>
    .sector{
        position: absolute;
        left: 0px;
        top:0px;
        width:100px;
        height:100px;
        background-color: chartreuse;
        border-radius: 30px;
        transform:translateZ(60px);
        transform-style: preserve-3d;
    /*    transform-origin: 512px 0 -3000px;*/
    }
    .sector .icon{
        position: absolute;
        left: 30px;
        top:-30px;
        width:20px;
        height:150px;
        background-color: burlywood;
        border-radius: 30px;
        transform:translateZ(20px);
        transform-style: preserve-3d;
    }
    .sector .title{
        position: absolute;
        left: -30px;
        top:90px;
        width:150px;
        height:20px;
        background-color: cadetblue;
        border-radius: 30px;
        transform:translateZ(40px);
        transform-style: preserve-3d;
    }
    /*
    .blurred-bg-mask{
        position:relative;
        width:100%;
        height:100%;
        overflow: hidden;    
        border-radius: 30px;
    }
    .blurred-bg{        
        position: absolute;
        left:0;
        top:0;
        width:1024px;
        height:768px;
        background-image: url("/resources/en_flag.png");
    }
    */
</style>