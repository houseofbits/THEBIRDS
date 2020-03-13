<template>
    <div class="detail-element" :style="{backgroundImage: 'url(' + detailBackgroundImageUrl + ')'}">
        <div class="detail-content">
            <div class="image" :style="imageStyle"></div>
            <div class="title"><span>{{title}}</span></div>
            <div class="title-latin"><span>{{titleLatin}}</span></div>
            <div class="description" :style="descriptionStyle"><span>{{description}}</span></div>
            <div class="sounds">
                <sound v-for="(sound, soundIndex) in data.audio" :key="soundComponentKey(soundIndex)" :sound="sound"></sound>
            </div>
        </div>
    </div>
</template>

<script>

import {Vector3, Vector2, Rectangle, getRandomArbitrary, radiansToDegrees} from './common.js'
import sound from './sound.vue'

/**
 *
 *  Data structure:
 *      description{
 *          lv,ru,en:"string"
 *          transform:[left, top, fontSize]
 *          transform:{
 *              lv,ru,en:[left, top, fontSize]
 *          }
 *      }
 *      detailImage{
 *          image:url
 *          transform:[width,left,top]
 *          transform:{
 *              lv,ru,en:[width,left,top]
 *          }
 *      }
 *
 */
export default {
    props: ['sector'],
    template:'#detail-template',
    data: function () {
        return {
            data: this.sector,
            imageAspect:1
        }
    },
    components: {
        sound
    },
    computed:{
        imageStyle:function(){
            let ts = this.getImageTransform();
            return {
                width:ts[0] + 'px',
                height:(ts[0] * this.imageAspect) + 'px',
                top:ts[2] + 'px',
                left:ts[1] + 'px',
                backgroundImage: 'url(' + this.getDetailProp('image') + ')'
            };
        },
        descriptionStyle:function(){
            let ts = this.getDescriptionTransform();
            return {
                left:ts[0]+'px',
                top:ts[1]+'px',
                fontSize:ts[2]+'px',
                lineHeight:(ts[2] * 1.2)+'px'
            };
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
        getDescriptionTransform:function(){
            if(typeof this.data.description != 'undefined'){
                var language = this.$parent.getLanguage();
                if(typeof this.data.description.transform != 'undefined'){
                    if(typeof this.data.description.transform[language] != "undefined") {
                        return this.data.description.transform[language]
                    }
                    return this.data.description.transform;
                }
            }
            return [0,0,0];
        },
        getImageTransform:function(){
            if(typeof this.data.detailImage != 'undefined'){
                var language = this.$parent.getLanguage();
                if(typeof this.data.detailImage.transform != 'undefined'){
                    if(typeof this.data.detailImage.transform[language] != "undefined") {
                        return this.data.detailImage.transform[language]
                    }
                    return this.data.detailImage.transform;
                }
            }
            return [0,0,0,0];
        },
        soundComponentKey:function(key){
            return (this.$vnode.key * 30) + key;
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
        let parent = this;
        let img = new Image();
        img.src = this.getDetailProp('image');
        img.onload = function () {
            parent.imageAspect = this.height / this.width;
        }

        this.$parent.$on('carousel-slide-start', this.onCarouselSlideStart);
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
        font-style: italic;
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
        /*border: 1px dashed orange;*/
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
</style>