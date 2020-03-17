<template>
    <div :style="computeTransform()" class="sector">
        <div class="icon-wrap">
            <div class="icon" :style="iconStyle()"
                v-on:click="onClick" 
                v-on:mousedown="onMouseDown"
                v-on:mouseup="onMouseLeave"
                v-on:mouseleave="onMouseLeave"></div>
            <div class="icon-shadow" :style="iconStyleShadow()"></div>
        </div>
        <div class="title" :style="titleStyle()"><span :style="titleTextStyle()">{{title}}</span></div>
        <div class="title-shadow" :style="{transform: 'translateZ('+(this.calculateZPos() + 30)+'px)'}"><span>{{title}}</span></div>
        <div class="shadow" :style="{transform: 'translateZ('+(this.calculateZPos() - 30)+'px)'}"></div>
        <div class="circle" :style="circleStyle()"></div>
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
        }},
        computed:{

        },
        methods: {
            isVisible:function(){
                let globalAngle = parseFloat(this.$parent._data.angle);
                let angle = globalAngle + parseFloat(this.data.position[0]);

                if(angle < -25 || angle > 25)return false;

                return true;
            },
            circleStyle:function(){
                let bright = '';
                if(this.isSelected){
                    bright = 'brightness(200%) ';
                }
                return {
                    backgroundImage: 'url(' + this.circleUrl + ')',
                    filter:bright + 'blur('+(this.curve.blurCurve * 10)+'px)',
                    transform: 'translateZ('+this.calculateZPos()+'px)',
                };
            },
            titleTextStyle:function(){
                return {
                    filter:'blur('+(this.curve.blurCurve * 4)+'px)'
                };
            },
            iconStyle:function(){
                let val = this.data.opacity * 110;
                return {
                    backgroundImage: 'url(' + this.data.iconImage + ')',
                    width:this.data.iconTransform[0]+'px',
                    height:this.iconHeight+'px',
                    left:this.data.iconTransform[1]+'px',
                    top:this.data.iconTransform[2]+'px',
                    filter:'brightness('+val+'%) blur('+(this.curve.blurCurve * 8)+'px)',
                    transform: 'translateZ('+(this.calculateZPos()+30)+'px)',
                };
            },
            iconStyleShadow:function(){
                return {
                    backgroundImage: 'url(' + this.data.iconShadow + ')',
                    width:this.data.iconTransform[0]+'px',
                    height:this.iconHeight+'px',
                    left:this.data.iconTransform[1]+'px',
                    top:this.data.iconTransform[2]+'px',
                    transform: 'translateZ('+(this.calculateZPos()+20)+'px)',
                };
            },
            titleStyle:function(){
                let val = this.data.opacity * 100;
                return {
                    filter:'brightness('+val+'%)',
                    transform: 'translateZ('+(this.calculateZPos()+40)+'px)',
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
            calculateZPos:function(){
                if(this.isSelected){
                    return (this.data.position[2] + 10) - (this.curve.sliderCurve * 150) + 50;
                }
                return this.data.position[2] - (this.curve.sliderCurve * 150) + 50;
            },
            onClick:function(){
                this.$parent.$emit('detail-select', this.$vnode.key);                
            },
            onMouseDown:function(){
                this.isSelected = true;
            },   
            onMouseLeave:function(){
                this.isSelected = false;
            },
            onDetailSelect:function(index){
                if(this.$vnode.key == index){
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