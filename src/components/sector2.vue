<template>
    <div :style="computeTransform()" class="sector">
        <div class="icon-wrap">
            <div class="icon" :style="iconStyle()"></div>
            <div class="icon-shadow" :style="iconStyleShadow()"></div>
        </div>
        <div class="title" :style="titleStyle()">
            <span :style="titleTextStyle()">{{title}}</span></div>
        <div class="title-shadow" :style="titleShadowStyle()"><span>{{title}}</span></div>
        <div class="shadow" :style="{transform: 'translateZ('+(this.calculateZPos() - 30)+'px)'}"></div>
        <div class="circle" :style="circleStyle()"></div>
        <div class="active-circle"
             :style="activeCircleStyle()"
             v-on:click="onClick"
             v-on:mousedown="onMouseDown"
             v-on:mouseup="onMouseLeave"
             v-on:mousemove="onMouseMove"
             v-on:mouseleave="onMouseLeave"
             v-on:mouseenter="onMouseEnter"></div>
    </div>
</template>

<script>

    import {Vector3, Vector2, Rectangle, getRandomArbitrary, radiansToDegrees, exponentialEasing} from './common.js'

    export default {
        name: "app",
        props: ['sector', 'title', 'circleUrl', 'curve'],
        data: function(){ return {
            data: this.sector,
            iconHeight:1,
            isSelected:false,
            angleOnMouseDown:0
        }},
        computed:{

        },
        methods: {
            activeCircleStyle:function(){
                return {
                    transform: 'translateZ('+(this.calculateZPos()+30)+'px)',
                };
            },
            circleStyle:function(){
                let filterVal = null;
                if(this.isSelected){
                    filterVal = 'brightness(200%) ';
                }
                let blur = (this.curve.blurCurve * 10);
                if(blur > 2){
                    if(filterVal == null)filterVal = '';
                    filterVal += ' blur('+blur+'px)';
                }
                return {
                    backgroundImage: 'url(' + this.circleUrl + ')',
                    filter:filterVal,
                    transform: 'translateZ('+this.calculateZPos()+'px)',
                };
            },
            titleTextStyle:function(){
                return {
                    filter:'blur('+(this.curve.blurCurve * 4)+'px)'
                };
            },
            titleShadowStyle:function(){
                let cc = (1-this.curve.iconCurve) * 20;
                return {
                    transform: 'translateZ('+(this.calculateZPos() + 20+cc)+'px)',
                    filter:'blur('+(this.curve.blurCurve * 4)+'px)'
                };
            },
            iconStyle:function(){
                let filterVal = null;
                let val = this.data.opacity * 110;
                let blur = (this.curve.blurCurve * 8);

                let cc = (1-this.curve.iconCurve) * 20;

                if(blur > 1){
                    if(filterVal == null)filterVal = '';
                    filterVal += ' blur('+blur+'px)';
                }
                return {
                    backgroundImage: 'url(' + this.data.iconImage + ')',
                    width:this.data.iconTransform[0]+'px',
                    height:this.iconHeight+'px',
                    left:this.data.iconTransform[1]+'px',
                    top:this.data.iconTransform[2]+'px',
                    filter:'brightness('+val+'%) blur('+(this.curve.blurCurve * 8)+'px)',
                    transform: 'translateZ('+(this.calculateZPos()+20 + cc)+'px)',
                };
            },
            iconStyleShadow:function(){
                return {
                    backgroundImage: 'url(' + this.data.iconShadow + ')',
                    width:this.data.iconTransform[0]+'px',
                    height:this.iconHeight+'px',
                    left:this.data.iconTransform[1]+'px',
                    top:this.data.iconTransform[2]+'px',
                    transform: 'translateZ('+(this.calculateZPos()+10)+'px)',
                };
            },
            titleStyle:function(){
                let val = this.data.opacity * 100;
                return {
                    filter:'brightness('+val+'%)',
                    transform: 'translateZ('+(this.calculateZPos()+43)+'px)',
                };
            },
            computeTransform: function () {
                let opacity = 1 - Math.min(0.3, this.curve.sliderCurve);
                if(this.isSelected){
                    opacity = 1.4;
                }
                this.data.opacity = opacity;

                return {
                    transform:
                     'translateX(512px)'
                    +' translateY('+this.data.position[1]+'px)'
                    +' translateZ(0px)'
                    +' rotateY('+this.data.position[0]+'deg)'
                    ,
                    width:this.data.diameter+'px',
                    height:this.data.diameter+'px',
                };
            },
            calculateZPos:function(min, max){
                if(typeof min == 'undefined'){
                    let min  = 0;
                }
                if(typeof max == 'undefined'){
                    let max  = 0;
                }

                if(this.isSelected){
                    return (this.data.position[2] + 10) - (this.curve.sliderCurve * 150) + 50;
                }
                return this.data.position[2] - (this.curve.sliderCurve * 150) + 50;
            },
            onClick:function(){
                let diff = Math.abs(this.angleOnMouseDown - this.$parent.angle);
                if(diff > 0.3)return;
                this.$parent.$emit('detail-select', this.$vnode.key);
            },
            onMouseDown:function(){
                this.isSelected = true;
                this.angleOnMouseDown = this.$parent.angle;
            },
            onMouseMove:function(){
                let diff = Math.abs(this.angleOnMouseDown - this.$parent.angle);
                if(diff > 0.3){
                    this.isSelected = false;
                }
            },
            onMouseLeave:function(){
                this.isSelected = false;
            },
            onMouseEnter:function(e){
                // if(e.buttons > 0) {
                //     this.isSelected = true;
                //     this.angleOnMouseDown = this.$parent.angle;
                // }
            },
            onDetailSelect:function(index){
                if(this.$vnode.key === index){
                    this.isSelected = true;   
                }
            },
            onDetailClose:function(index){
                this.isSelected = false;
            },            
        },
        mounted:function() {
            let parent = this;
            let img = new Image();
            img.src = this.data.iconImage;
            img.onload = function () {
                parent.iconHeight = parent.data.iconTransform[0] * (this.height / this.width);
            }
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
        pointer-events: none;
        position: absolute;
        left:-50%;
        width:100%;
        height:100%;
        transform-style: preserve-3d;
        background-repeat: round;
    }
    .sector .active-circle{
        pointer-events: auto;
        position: absolute;
        left:-50%;
        width:100%;
        height:100%;
        border-radius: 50%;
        transform-style: preserve-3d;
        /*border: 1px dashed yellowgreen;*/
        /*background-color: rgba(255,255,255,0.2);*/
    }
    .sector .icon-wrap{
        pointer-events: none;
        position: absolute;
        left: -50%;
        width:100%;
        height:100%;
        transform-style: preserve-3d;
    }
    .icon-wrap .icon{
        pointer-events: none;
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
        pointer-events: none;
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
        pointer-events: none;
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
        pointer-events: none;
        display: inline;
        background: linear-gradient(to top, #f5ff81, white);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
    }
    .sector .title-shadow {
        pointer-events: none;
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
        pointer-events: none;
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