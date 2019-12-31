<template>
    <div class="detail-element" :style="{backgroundImage: 'url(' + detailBackgroundImageUrl + ')'}">
        <div class="detail-content">
            <div class="image" :style="{
                width:imageSize.width + 'px',
                height:imageSize.height + 'px',
                top:imagePosition.y + 'px',
                left:imagePosition.x + 'px',
                backgroundImage: 'url(' + imageUrl + ')'
            }"></div>
            <div class="title"><span>{{title}}</span></div>
            <div class="title-latin"><span>{{titleLatin}}</span></div>
            <div class="description" :style="{left:descriptionPosition.x+'px',top:descriptionPosition.y+'px'}"><span>{{description}}</span></div>
            <div class="sounds">
                <div v-for="(sound, index) in sounds" :key="index" :class="{playing:isPlaying(index)}" v-on:click="playSound(index)">
                    <span class="icon"></span>
                    <span class="title">{{soundTitle(index)}}</span>
                    <div class=waveform>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>                        
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import {Vector3, Vector2, Rectangle, getRandomArbitrary, radiansToDegrees} from './common.js'

export default {
    props: ['sector'],
    template:'#detail-template',
    data: function () {
        return { data: this.sector }
    },
    computed:{
        sounds:function(){
            if(typeof this.data.audio != 'undefined'){
                return this.data.audio;
            }
            return null;
        },
        descriptionPosition:function(){
            if(typeof this.data.description != 'undefined'){
                var language = this.$parent.getLanguage();

                if(typeof this.data.description[language] == "object" && 
                typeof this.data.description[language].position != "undefined"){
                    var pos = new Vector2(this.data.description[language].position);
                    return pos;
                }
                if(typeof this.data.description.position != 'undefined'){
                    var pos = new Vector2(this.data.description.position);
                    return pos;
                }
            }
            return new Vector2(null);
        },
        detailBackgroundImageUrl:function(){
            return this.$parent.detailBackgroundImageUrl;
        },
        title:function(){
            var language = this.$parent.getLanguage();

            if(typeof this.data.title != 'undefined'
                && typeof this.data.title[language] != 'undefined'){
                return this.data.title[language];
            }
            return 'No title [' + this.$vnode.key + ']';
        },
        titleLatin:function(){
            if(typeof this.data.titleLatin != 'undefined'){
                return this.data.titleLatin;
            }
            return '';
        },
        description:function(){
            var language = this.$parent.getLanguage();

            if(typeof this.data.description != 'undefined'
                && typeof this.data.description[language] != 'undefined'){

                if(typeof this.data.description[language] == "object" && 
                typeof this.data.description[language].text != "undefined"){
                    return this.data.description[language].text;
                }
                return this.data.description[language];
            }
            return '';
        },
        imageUrl:function(){
            return this.getDetailProp('image');
        },
        imageSize:function(){
            return new Rectangle(this.getDetailProp('size'));
        },        
        imagePosition:function(){
            return new Vector2(this.getDetailProp('position'));
        },                        
    },
    methods: {
        soundTitle:function(index){
            var language = this.$parent.getLanguage();
            if(this.sounds[index] != "undefined" 
                && this.sounds[index].title != "undefined"
                && this.sounds[index].title[language] != "undefined"){
                    return this.sounds[index].title[language];
            }
            return "";
        },
        playSound:function(index){
            var isPlaying = this.isPlaying(index);
            this.$parent.$emit('stop-sounds');
            if(typeof this.sounds[index] != "undefined"){
                if(isPlaying){
                    this.sounds[index].sound.stop();
                }else{
                    this.sounds[index].sound.play();
                } 
            }
            this.$forceUpdate();
        },
        isPlaying:function(index){
            if(typeof this.sounds[index] != "undefined"){
                return this.sounds[index].sound.playing();
            }
            return false;
        },   
        onStopSound:function(){
            if(typeof this.sounds != "undefined" && this.sounds){
                for(var i=0; i<this.sounds.length; i++){
                    if(typeof this.sounds[i].sound != "undefined"){
                        this.sounds[i].sound.stop();
                    }                    
                }
            }
            this.$forceUpdate();            
        },
        getDetailProp:function(name){
            if(this.data && typeof this.data.detailImage != 'undefined'){
                if(typeof this.data.detailImage[name] != 'undefined'){
                    return this.data.detailImage[name];
                }
            }
            return '';
        },
        onCarouselSlideStart:function(currentIndex, targetIndex){
            if(currentIndex == this.$vnode.key){
                Velocity(this.$el,{
                    blur:10
                }, { duration: 100});
            }
            if(targetIndex == this.$vnode.key){
                Velocity(this.$el,{
                    blur:10
                }, 0);
                Velocity(this.$el,{
                    blur:0
                }, { duration: 700});
            }            
        },
        calculateAngle:function(positionIndex){
            var halfAngle = radiansToDegrees(Math.atan((1024/2)/3000));
            return ((halfAngle * 2) * positionIndex);
        },
    },
    mounted:function () {
        this.$parent.$on('carousel-slide-start', this.onCarouselSlideStart);
        this.$parent.$on('stop-sounds', this.onStopSound);

        Velocity(this.$el, { rotateY:this.calculateAngle(this.$vnode.key) }, 0);
    }
}
</script>

<style scoped>
    .detail-screen .image {
        position: absolute;
        /*border: 1px dashed orange;*/
        background-repeat: round;    
    }
    .title {
        margin-top:20px;
        margin-left:20px;
        font-size: 60px;
        width:600px;
        line-height: 60px;
    }
    .title span{
        display: inline;
        background: linear-gradient(to top, #f5ff81, white);
        -webkit-background-clip: text;
        background-clip: text; 
        -webkit-text-fill-color: transparent;      
        filter: drop-shadow(2px 4px 3px #000);     
    }
    .title-latin{
        margin-top:10px;
        margin-left:50px;
        font-size: 40px;
        width:800px;    
    }
    .title-latin span{
        display: inline;
        background: linear-gradient(to top, #e5e5e5, white);
        -webkit-background-clip: text;
        background-clip: text; 
        -webkit-text-fill-color: transparent;    
        filter: drop-shadow(2px 2px 2px #000); 
    }
    .description{
        text-align: justify;
        font-size: 30px;
        line-height: 35px;
        position:absolute;
        top:300px;
        left:20px;
        width:90%;
        padding-left: 30px;
    }
    .description span{
        display: inline;
        background: linear-gradient(to top, #f5ff81, white);
        -webkit-background-clip: text;
        background-clip: text; 
        -webkit-text-fill-color: transparent;    
        filter: drop-shadow(2px 2px 2px #000);    
    }
    .detail-element{
        position:absolute;
        left:0px;
        top:-100px;
        width:1024px;
        height:968px;
        transform-origin: 512px 0 -3000px;
        background-repeat: round;
    }
    .detail-content{
        position:absolute;
        left:0px;
        top:100px;
        width:1024px;
        height:768px;
    }

    .sounds{
        margin-top: 40px;
    }

    .sounds div{
        display: block;
        width: 50%;
        height: 55px;
        margin: 0px;
        margin-left: 50px;
    }
    .sounds .icon{
        display: inline-block;
        margin:0;
        width:60px;
        height:60px;
        background-image: url('/resources/button_play.png');
        background-repeat: round;
    }
    .sounds .title{
        display: inline-block;
        width:auto;
        height:50px;
        margin:0;
        vertical-align: top;
        color: #f5ff81;
        font-size: 25px;
        line-height: 50px;
        margin-left: 10px;

        background: linear-gradient(to bottom, rgba(252,234,187,1) 0%, rgba(252,205,77,1) 70%, rgba(248,181,0,1) 71%, rgba(251,223,147,1) 100%);
        -webkit-background-clip: text;
        background-clip: text; 
        -webkit-text-fill-color: transparent;    
        filter: drop-shadow(2px 2px 2px #000);     
    }
    .sounds .waveform{
        display:none;
        vertical-align: top;
        position: relative;
        width:50px;
        height:35px;
        margin:0;
        margin-left: 5px;
    }
    .sounds .waveform div{
        position: absolute;
        margin:0;
        bottom: 0px;
        background-color: yellowgreen;
        width:6px;
        height: 20px;
        background: linear-gradient(to bottom, rgba(214,252,0,1) 0%, rgba(117,137,12,1) 100%);
        filter: drop-shadow(1px 1px 1px #000);   
        animation-duration: 2s;
        animation-iteration-count: infinite;
        border-radius: 2px;
    }
    .sounds .waveform div:nth-child(1){
        animation-name: wkf1;
        left:0px;
    }
    .sounds .waveform div:nth-child(2){
        animation-name: wkf2;
        left:10px;
        height:5px;
    }
    .sounds .waveform div:nth-child(3){
        animation-name: wkf3;
        left:20px;
        height:10px;
    }
    .sounds .waveform div:nth-child(4){
        animation-name: wkf4;
        left:30px;
        height:25px;
    }

    @keyframes wkf1 {
        0%   {height: 35px;}
        50%   {height: 5px;}    
        100% {height: 35px;}
    }
    @keyframes wkf2 {
        0%   {height: 5px;}
        50%   {height: 35px;}    
        100% {height: 5px;}
    }
    @keyframes wkf3 {
        0%   {height: 10px;}
        33%   {height: 35px;}    
        66%   {height: 5px;}        
        100% {height: 10px;}
    }
    @keyframes wkf4 {
        0%   {height: 25px;}
        50%   {height: 5px;}    
        100% {height: 25px;}
    }      

    .sounds .playing .title{
        background: linear-gradient(to bottom, rgba(214,252,0,1) 0%, rgba(117,137,12,1) 100%);
        -webkit-background-clip: text;
        background-clip: text; 
        -webkit-text-fill-color: transparent;    
        filter: drop-shadow(2px 2px 2px #000);     
    }
    .sounds .playing .icon{
        background-image: url('/resources/button_play_on.png');
    }
    .sounds .playing .waveform{
        display:inline-block;
    }    
</style>