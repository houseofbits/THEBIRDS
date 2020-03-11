<template>
    <div :style="computeTransform()" class="sector">
        <div class="icon-wrap">
            <div class="icon" :style="iconStyle()" v-on:click="onClick"></div>
            <div class="icon-shadow" :style="iconStyleShadow"></div>
        </div>
        <div class="title" :style="titleStyle()"><span :style="titleTextStyle()">{{title}}</span></div>
        <div class="title-shadow"><span>{{title}}</span></div>
        <div class="shadow"></div>
        <div class="circle" :style="circleStyle()"></div>
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
        props: ['sector', 'title', 'circleUrl'],
        data: function(){ return { data: this.sector }},
        computed:{
            iconStyleShadow:function(){
                return {
                    backgroundImage: 'url(' + this.data.iconShadow + ')',
                    width:this.data.iconSize[0]+'px',
                    height:this.data.iconSize[1]+'px',
                    left:this.data.iconPos[0]+'px',
                    top:this.data.iconPos[1]+'px',
                };
            },
        },
        methods: {
            circleStyle:function(){
                return {
                    backgroundImage: 'url(' + this.circleUrl + ')',                    
                    filter:'blur('+this.data.blurCircle+'px)'
                };
            },            
            titleTextStyle:function(){
                return {
                    filter:'blur('+this.data.blurTitle+'px)'
                };
            },
            iconStyle:function(){
                let val = this.data.opacity * 110;
                return {
                    backgroundImage: 'url(' + this.data.iconImage + ')',
                    width:this.data.iconSize[0]+'px',
                    height:this.data.iconSize[1]+'px',
                    left:this.data.iconPos[0]+'px',
                    top:this.data.iconPos[1]+'px',
                    filter:'brightness('+val+'%) blur('+this.data.blurIcon+'px)'
                };
            },
            titleStyle:function(){
                let val = this.data.opacity * 100;
                return {
                    filter:'brightness('+val+'%)'
                };
            },            
            computeTransform: function () {
                let globalAngle = parseFloat(this.$parent._data.angle);
                let angle = globalAngle + parseFloat(this.data.position[0]);
                let limit = 15.0;
                let exponent = 0.6;

                let unitAngle = Math.min(Math.abs(angle / limit), 1);
                unitAngle = exponentialEasing(unitAngle, exponent);

                let zpos = this.data.position[2] - (unitAngle * 150) + 50;

                let opacity = 1 - Math.min(0.3, unitAngle);

                this.data.opacity = opacity;

                unitAngle = Math.min(Math.abs(angle / limit), 1);
                unitAngle = exponentialEasing(unitAngle, 0.9);

                this.data.blurCircle = unitAngle * 10;
                this.data.blurIcon = unitAngle * 8;
                this.data.blurTitle = unitAngle * 4;

                return {
                    transform:
                     'translateX(512px)'
                    +' translateY('+this.data.position[1]+'px)'
                    +' translateZ('+zpos+'px)'
                    +' rotateY('+this.data.position[0]+'deg)'
                    ,
                    width:this.data.diameter+'px',
                    height:this.data.diameter+'px',
                };
            },
            blur:function(blurVal){            
                
                 let parent = this;
                // let brightness = " brightness(" + (parent.data.opacity * 100) + "%)";

                // let refs = [
                //     this.$refs.icon, 
                //     this.$refs.circle,
                //     this.$refs.title
                // ];

                // Velocity(refs,"finish");                

                // Velocity(refs,{
                //     blur:blurVal,
                //     brightness:'50%',
                // }, { duration: 1000});                

               Velocity(this.$el,{
                    vueBlur:blurVal,
                }, { 
                    duration: 1000,    
                    progress: function(elements, complete, remaining, start, tweenValue) {
                        parent.data.blur = complete * blurVal;
                        parent.$forceUpdate();
                    },
                });                
            },
            onClick:function(){
                this.$parent.$emit('detail-select', this.$vnode.key);                
                //this.blur(4);
            },
            onDetailSelect:function(index){
             //   this.blur(4);
            },
            onDetailClose:function(index){
            //    this.blur(0);
            },            
        },
        mounted:function() {
            this.data.blur = 0;
            this.data.blurCircle = 0;
            this.data.blurIcon = 0;
            this.data.blurText = 0;
            this.$parent.$on('detail-select', this.onDetailSelect);
            this.$parent.$on('detail-close', this.onDetailClose);
        }
    }
</script>

<style scoped>
    .sector{
        position: absolute;
        transform-style: preserve-3d;
        transform-origin: 0 0 -2000px;
    }
    .sector .shadow{
        position: absolute;
        left:-50%;
        width:100%;
        height:100%;
        transform-style: preserve-3d;
        transform:translateZ(-30px);
        background-repeat: round;
        background-image: url('/resources/segment_shadow.png');
    }
    .sector .circle{
        position: absolute;
        left:-50%;
        width:100%;
        height:100%;
        transform-style: preserve-3d;
        background-repeat: round;
    }
    .sector .icon-wrap{
        position: absolute;
        left: -50%;
        width:100%;
        height:100%;
        transform-style: preserve-3d;
    }
    .icon-wrap .icon{
        position: absolute;
        left: 30px;
        top:-30px;
        width:100px;
        height:150px;
        transform:translateZ(30px);
        transform-style: preserve-3d;
        background-repeat: round;
    }
    .icon-wrap .icon-shadow{
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
        left:-50%;
        position:absolute;
        text-align: center;
        font-size: 30px;
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
        left:-50%;
        position:absolute;
        text-align: center;
        font-size: 30px;
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