<template>
  <div id="app">
    <div v-if="!view" class="error-message">No view data found!</div>  
    <div class="main-screen" ref="mainScreen">
        <div class="main-background" ref="mainBackground" :style="{backgroundImage: 'url(' + backgroundImageUrl + ')'}">
            <div class="shadow-background" ref="shadowBackground" :style="{backgroundImage: 'url(' + shadowImageUrl + ')'}"></div>
        </div>
        <sector v-for="(sector, index) in sectors" :key="index" :sector="sector"></sector>
    </div>
    <div class="clip-screen">
        <svg v-if="divisions&&!selectedDivision">
            <divisionregion v-for="(sector, index) in sectors" :key="index" :sector="sector"></divisionregion>
        </svg>
        <svg>
            <clipregion v-for="(sector, index) in sectors" :key="index" :sector="sector"></clipregion>
        </svg>
    </div>
    <div class="detail-screen" ref="detailScreen">
        <div class="detail-3d">
            <div class="detail-frame" ref="detailCarousel">
                <detail v-for="(sector, index) in sectors" v-if="renderDetailView(index)" :key="index" :sector="sector"></detail>
            </div>
        </div>
        <div class="navigation">
            <div v-if="getPreviousDetailViewId()!=null" class="button-prev" v-on:click="movePrev"></div>
            <div v-if="getNextDetailViewId()!=null" class="button-next" v-on:click="moveNext"></div>
            <div class="button-exit" v-on:click="closeDetailView"></div>
            <div class="language">
                <div class="flag ru" :class="{active:(getLanguage()=='ru')}" v-on:click="setLanguage('ru')"></div>
                <div class="flag en" :class="{active:(getLanguage()=='en')}" v-on:click="setLanguage('en')"></div>
                <div class="flag lv" :class="{active:(getLanguage()=='lv')}" v-on:click="setLanguage('lv')"></div>
            </div>
        </div>
    </div>
  </div>
</template>
<script>

import sector from './components/sector.vue'
import clipregion from './components/clipregion.vue'
import detail from './components/detail.vue'
import divisionregion from './components/divisionregion.vue'
import {radiansToDegrees} from './components/common.js'

export default {
    name: 'app',
    data: function(){return {
            view: null,
            language:'lv',
            selectedDetail:null,
            mouseState:[0, 0, 0, 0, 0, 0, 0, 0, 0],
            mouseDownCount:0,
            rotationStep:0,
            currentShakeIndex:0,
            passiveMode:false,
            userInputTimer:null,
            config:{
                userInputTimeout:5000,
                detailRotationDuration:650,
            },
            hasDivisions:false,
            selectedDivision:null
        }
    },    
    components: {
        sector,
        clipregion,
        detail,
        divisionregion
    },
    computed:{
        divisions:function(){

            return false;
        },
        sectors:function () {
            if(this.view && typeof this.view.sectors != 'undefined'){
                return this.view.sectors;
            }
            return false;
        },
        backgroundImageUrl:function(){
            if(this.view && typeof this.view.mainBackground != "undefined"){
                return this.view.mainBackground;
            }
            return '';
        },
        shadowImageUrl:function(){
            if(this.view && typeof this.view.mainShadow != "undefined"){
                return this.view.mainShadow;
            }
            return '';
        },
        detailBackgroundImageUrl:function(){
            if(this.view && typeof this.view.detailBackground != "undefined"){
                return this.view.detailBackground;
            }
            return '';
        }
    },
    methods:{
        init:function () {
            var id = null;            
            if (typeof window.location.search != 'undefined'
               && window.location.search.length > 0
            ) {
                var result = window.location.search.match(/\?id=(\d+)/);                
                if(typeof result[1] != 'undefined') {                
                    id = result[1];
                }
            } else {
                var path = window.location.pathname.split('/');
                id = parseInt(path[1]);
            }
            if (id != null) {
                this.$http.get('/resources/view_'+id+'/config.json').then(function(response) {
                    this.view = response.body;
                    this.initAudio();
                }, function(){});
            }
        },
        selectDetailView:function(id){
            if (this.selectedDetail != null) {
                //Init detail view to default state
                this.initDetailView();
                this.$emit('move-out', id);
                //Fade in detail view background
                Velocity(this.$refs.detailScreen,{
                    opacity:1
                }, { duration: 1000,
                    display: "block"
                });
                Velocity(this.$refs.shadowBackground, {
                    opacity: 0,
                }, {duration:300,delay: 100,});
            }
        },
        //Set up default position, visibility and opacity
        initDetailView:function(){
            Velocity(this.$refs.detailScreen,{ opacity: 0 }, { display: "none" });
            this.rotateDetailView(this.selectedDetail, true);
        },
        closeDetailView:function(){

            var parent = this;

            //Fade off detail view background
            Velocity(this.$refs.detailScreen,{
                opacity:0
            }, { duration: 600,
                display: "none",
                complete:function(){
                    parent.selectedDetail = null;
                }
            });

            this.$emit('stop-sounds');

            this.$emit('move-in');

            Velocity(parent.$refs.shadowBackground, {
                opacity: 1,
            }, {duration:500});

            Velocity(this.$refs.mainBackground,{
                blur:0
            }, { duration: 1000});

            this.userInputActivation();
        },
        getNextDetailViewId:function(){
            if(this.selectedDetail != null){
                if(typeof this.sectors[(this.selectedDetail + 1)] != 'undefined'){
                    return (this.selectedDetail + 1);
                }
            }
            return null;
        },
        getPreviousDetailViewId:function(){
            if(this.selectedDetail != null){
                if(this.selectedDetail > 0
                    && typeof this.sectors[(this.selectedDetail - 1)] != 'undefined'){

                    return (this.selectedDetail - 1);
                }
            }
            return null;
        },
        renderDetailView:function(index){
            if(this.selectedDetail != null && index == this.selectedDetail)return true;

            var next = this.getNextDetailViewId();
            if(next != null && index == next)return true;

            var prev = this.getPreviousDetailViewId();
            if(prev != null && index == prev)return true;

            return false;
        },
        rotateDetailView:function(targetIndex, imediate = false){
            var angle = targetIndex * this.rotationStep;
            var parent = this;
            var duration = this.config.detailRotationDuration;
            if(imediate)duration = 0;

            Velocity(this.$refs.detailCarousel,"finish");

            this.$emit('carousel-slide-start', this.selectedDetail, targetIndex);

            parent.selectedDetail = targetIndex;

            Velocity(this.$refs.detailCarousel,{
                rotateY:-angle
            }, {
                duration: duration,
                easing: "ease"
            });
        },
        moveNext:function(){
            this.$emit('stop-sounds');
            var index = this.getNextDetailViewId();
            if(index != null) {
                this.rotateDetailView(index);
            }
        },
        movePrev:function(){
            this.$emit('stop-sounds');
            var index = this.getPreviousDetailViewId();
            if(index != null) {
                this.rotateDetailView(index);
            }
        },
        switchLanguage:function(language){
            this.language = language;
        },
        blurEffect:function(on){

            Velocity(this.$refs.mainBackground,"finish");

            var value = 0;
            var zoom = 600;
            if(on){
                value = 3;
                zoom = 300;
            }
            Velocity(this.$refs.mainBackground,{
                blur:value
            }, { duration: 1000});

            // Velocity(this.$refs.mainScreen,{
            //     perspective:zoom
            // }, { duration: 1000});
        },
        //Sector is grabbed => hightlight it or blur out rest
        onSectorGrabEvent:function (index) {
        //    console.log('grab '+index);
            if(typeof index == 'undefined')return;
            if(this.selectedDetail == null){
                this.$emit('blur-effect-on', index);
            }
        },
        //Sector is released => activate detail view
        onSectorReleaseEvent:function (index) {
            if(typeof index == 'undefined')return;
            if(this.selectedDetail == null){
                this.selectedDetail = index;
                this.selectDetailView(index);
            }
        },
        //Sector is left => return to normal state
        onSectorLeaveEvent:function (index) {
        //    console.log('leave '+index);
            if(typeof index == 'undefined')return;
            if(this.selectedDetail == null){
                this.$emit('blur-effect-off');
            }
        },
        onBlurEffectOn:function(excludeIndex){
            this.blurEffect(true);
        },
        onBlurEffectOff:function(){
            this.blurEffect(false);
        },
        onMouseDown:function (e) {
            ++this.mouseState[e.button];
            ++this.mouseDownCount;
        },
        onMouseUp:function (e) {
            --this.mouseState[e.button];
            --this.mouseDownCount;
        },
        getLanguage:function(){
            return this.language;
        },
        setLanguage:function(lang){
            this.language = lang;
        },

        startShakeNext:function(){
            if(this.passiveMode && this.selectedDetail == null){
                this.currentShakeIndex = (this.currentShakeIndex + 1)%this.sectors.length;
                this.$emit('shake', this.currentShakeIndex);
                setTimeout(this.startShakeNext, 500);
            }
        },
        userInputActivation:function(){

            this.passiveMode = false;

            if(this.userInputTimer){
                clearTimeout(this.userInputTimer);
                this.userInputTimer = null;
            }
            var parent = this;
            this.userInputTimer = setTimeout(function(){
                if(this.selectedDetail != null)return;
                parent.passiveMode = true;
                parent.startShakeNext();
            }, this.config.userInputTimeout);
        },
        initAudio:function(){
            var parent = this;
            if(this.view && typeof this.view.sectors != 'undefined'){
                for(var i=0; i<this.view.sectors.length; i++){
                    if(typeof this.view.sectors[i].audio != "undefined"){
                        for(var a=0; a<this.view.sectors[i].audio.length; a++){
                            var audioFile = this.view.sectors[i].audio[a].fileName;
                            this.view.sectors[i].audio[a].sound = new Howl({
                                src: [audioFile],
                                preload:true,
                                onload:function(){
                                    this.play();
                                    this.stop();
                                },
                                onend:function(){
                                    parent.$emit('stop-sounds');
                                }
                            });
                        }
                    }
                }
            }
        },
        onMouseMove:function (e) {
            this.userInputActivation();
        },
    },
    mounted:function(){

        this.init();

        document.addEventListener('mousedown', this.onMouseDown);
        document.addEventListener('mouseup', this.onMouseUp);
        document.addEventListener('mousemove', this.onMouseMove);
        document.addEventListener('touchmove', this.onMouseMove);

        this.$on('blur-effect-event', this.blurEffect);
        this.$on('blur-effect-on', this.onBlurEffectOn);
        this.$on('blur-effect-off', this.onBlurEffectOff);
        this.$on('sector-grab', this.onSectorGrabEvent);
        this.$on('sector-release', this.onSectorReleaseEvent);
        this.$on('sector-leave', this.onSectorLeaveEvent);

        this.initDetailView();

        this.rotationStep = 2 * radiansToDegrees(Math.atan((1024/2)/3000));

        this.userInputActivation();

        // Velocity(this.$refs.mainScreen, {
        //     translateX:'250px',            
        //     translateY:'-50px',
        //     translateZ:'1000px'
        // }, 0);
    },
    beforeDestroy: function () {
        document.removeEventListener('mousemove', this.onMouseMove);
        document.removeEventListener('click', this.onClick);
    },
}
</script>
<style>
    @font-face {
        font-family: "customFont";
        src: url("/resources/font.ttf");
    }
    body{
        background-color: rgb(48, 48, 48);
        font-family: "customFont";
        overflow: hidden;
        user-select: none;
    }
    #app {
        width:1024px;
        height:768px;
        position:absolute;
        top:0px;
        left:0px;
        overflow: hidden;
        display:block;
        perspective: 4000px;
        transform-style: preserve-3d;
    }
    .main-screen{
        position:absolute;
        left:0px;
        top:0px;
        width:1024px;
        height:768px;
        perspective: 600px;
        transform: rotateX(0deg) rotateY(0deg);
        transform-style: preserve-3d;
    }
    .main-background{
        position:absolute;
        left:-215px;
        top:-69px;
        width:1378px;
        height:868px;
        background-repeat: round;
    }
    .main-background .shadow-background{
        position:relative;
        width:100%;
        height:100%;
        background-repeat: round;
    }    
    .clip-screen{
        position:absolute;
        left:0px;
        top:0px;
        width:1024px;
        height:768px;
    }
    .clip-screen svg{
        width:100%;
        height:100%;
    }
    .detail-screen{
        width:1024px;
        height:768px;
        position:absolute;
        top:0px;
        left:0px;
        background-repeat: round;
    }
    .detail-3d{
        position:absolute;
        left:0px;
        top:0px;
        width:1024px;
        height:768px;
        perspective: 300px;
        transform: rotateX(0deg) rotateY(0deg);
    }
    .detail-frame{
        position:absolute;
        left:0px;
        top:0px;
        width:1024px;
        height:768px;
        transform-style: preserve-3d;
        transform: rotateX(0deg) rotateY(0deg);
        transform-origin: 512px 0 -3000px;
    }
    .detail-screen .navigation {
        position: absolute;
        bottom:0px;
        left:0px;
        width:1024px;
        height:80px;
    }

    .language{
        width:100%;
        position:fixed;
        bottom:0px;
        text-align:center;
        z-index:500;
    }
    .flag{
        display: inline-block;
        width:50px;
        height:37px;
        background-repeat: round;
        transition: width 400ms, height 400ms,  opacity 400ms;
        box-shadow: 0px -4px 8px 1px rgba(0,0,0,0.75);
        border-radius: 5px;
        opacity:0.5;
        margin-left:3px;
        mergin-right:3px;
    }
    .flag.lv{
        background-image: url("/resources/lv_flag.png");
    }
    .flag.ru{
        background-image: url("/resources/ru_flag.png");
    }
    .flag.en{
        background-image: url("/resources/en_flag.png");
    }
    .flag.active{
        width:90px;
        height:60px;
        transition: width 400ms, height 400ms, opacity 400ms;
        border-radius: 9px;
        opacity:1;
    }

    .button-prev{
        position:fixed;
        left: 0px;
        bottom:0px;
        background-image: url("/resources/button_return.png");
        width:100px;
        height:100px;
        background-repeat: round;
        z-index:999;
        opacity: 0.4;
        transition: opacity 200ms;
    }
    .button-prev:hover{
        background-image: url("/resources/button_return_on.png");
        opacity: 1;
        transition: opacity 200ms;
    }
    .button-next{
        position:fixed;
        right: 0px;
        bottom:0px;
        background-image: url("/resources/button_return.png");
        width:100px;
        height:100px;
        background-repeat: round;
        transform: scaleX(-1);
        z-index:999;
        opacity: 0.4;
        transition: opacity 200ms;
    }
    .button-next:hover{
        background-image: url("/resources/button_return_on.png");
        opacity: 1;
        transition: opacity 200ms;
    }
    .button-exit{
        position:fixed;
        right: 0px;
        top:0px;
        background-image: url("/resources/button_exit.png");
        width:100px;
        height:100px;
        background-repeat: round;
        z-index:999;
        opacity: 0.4;
        transition: opacity 200ms;
    }
    .button-exit:hover{
        background-image: url("/resources/button_exit_on.png");
        opacity: 1;
        transition: opacity 200ms;
    }
    .error-message{
        margin:20px;
        color: rgb(221, 0, 0);
        font-size: 30px;
    }    
</style>