<template>
    <div :style="computeTransform()" class="sector">
        <div class="icon" :style="iconStyle"></div>
        <div class="icon-shadow" :style="iconStyleShadow"></div>
        <div class="title"><span>{{title}}</span></div>
        <div class="title-shadow"><span>{{title}}</span></div>
        <div class="shadow"></div>
        <div class="circle"></div>
    </div>
</template>

<script>

    import {Vector3, Vector2, Rectangle, getRandomArbitrary, radiansToDegrees} from './common.js'

    function exponentialEasing (x, a){

        var epsilon = 0.00001;
        var min_param_a = epsilon;
        var max_param_a = 1.0 - epsilon;
        a = Math.max(min_param_a, Math.min(max_param_a, a));

        if (a < 0.5){
            // emphasis
            a = 2.0*(a);
            var y = Math.pow(x, a);
            return y;
        } else {
            // de-emphasis
            a = 2.0*(a-0.5);
            var y = Math.pow(x, 1.0/(1-a));
            return y;
        }
    }

    export default {
        name: "app",
        props: ['sector', 'title'],
        data: function(){ return { data: this.sector }},
        computed:{
            // title:function(){
            //     return this.data.title;
            // },
            iconStyle:function(){
                return {
                    backgroundImage: 'url(' + this.data.iconImage + ')',
                    width:this.data.iconSize[0]+'px',
                    height:this.data.iconSize[1]+'px',
                    left:this.data.iconPos[0]+'px',
                    top:this.data.iconPos[1]+'px',
                };
            },
            iconStyleShadow:function(){
                return {
                    backgroundImage: 'url(' + this.data.iconShadow + ')',
                    width:this.data.iconSize[0]+'px',
                    height:this.data.iconSize[1]+'px',
                    left:this.data.iconPos[0]+'px',
                    top:this.data.iconPos[1]+'px',
                };
            }
        },
        methods: {
            computeTransform: function () {
                let globalAngle = parseFloat(this.$parent._data.angle);
                let angle = globalAngle + parseFloat(this.data.angle);
                let limit = 5.0;
                let exponent = 0.7;

                let unitAngle = 1.0 - Math.abs(angle / limit);
                unitAngle = 1.0 - exponentialEasing(unitAngle, exponent);
                if(angle < 0)unitAngle = -unitAngle;

                angle = (unitAngle * limit) - parseFloat(this.$parent._data.angle);

                angle = this.data.angle;

                let posx = 512 - (this.data.diameter * 0.5);

                console.log(posx);

                return {
                    transform:'translateX('+posx+'px)'
                    +' translateY('+this.data.position[1]+'px)'
                    +' translateZ('+this.data.position[2]+'px)'
                    +' rotateY('+this.data.position[0]+'deg)',
                    width:this.data.diameter+'px',
                    height:this.data.diameter+'px',
                };
            }
        },
        mounted:function() {

        }
    }
</script>

<style scoped>
    .sector{
        position: absolute;
        width:200px;
        height:200px;
        transform-style: preserve-3d;
        transform-origin: 512px 0 -2000px;
    }
    .sector .shadow{
        position: absolute;
        width:100%;
        height:100%;
        transform-style: preserve-3d;
        transform:translateZ(-30px);
        background-repeat: round;
        background-image: url('/resources/segment_shadow.png');
        /*border: 1px dashed dodgerblue;*/
    }
    .sector .circle{
        position: absolute;
        width:100%;
        height:100%;
        transform-style: preserve-3d;
        background-repeat: round;
        background-image: url('/resources/segment_circle.png');
    }
    .sector .icon{
        position: absolute;
        left: 30px;
        top:-30px;
        width:100px;
        height:150px;
        transform:translateZ(30px);
        transform-style: preserve-3d;
        background-repeat: round;
    }
    .sector .icon-shadow{
        position: absolute;
        left: 30px;
        top:-30px;
        width:100px;
        height:150px;
        transform:translateZ(20px);
        transform-style: preserve-3d;
        background-repeat: round;
    }
    .sector .title {
        position:absolute;
        text-align: center;
        font-size: 35px;
        width:100%;
        bottom: 35px;
        line-height: 30px;
        transform:translateZ(40px);
        transform-style: preserve-3d;
    }
    .sector .title span{
        display: inline;
        background: linear-gradient(to top, #f5ff81, white);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
    }
    .sector .title-shadow {
        position:absolute;
        text-align: center;
        font-size: 35px;
        width:100%;
        bottom: 35px;
        line-height: 30px;
        transform:translateZ(30px);
        transform-style: preserve-3d;
    }
    .sector .title-shadow span{
        display: inline;
        color: rgba(0,0,0,1);
        filter:blur(3px);
    }

    .sector.dev{
        border: 1px dashed dodgerblue;
    }
    .sector.dev .icon{
        border: 1px dashed yellowgreen;
    }
    .sector.dev .title{
        border: 1px dashed red;
    }

</style>