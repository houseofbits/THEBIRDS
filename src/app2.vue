<template>
    <div id="app">

        <div class="background-slider" :style="backgroundSliderStyle" ref="backgroundSlider"></div>

        <div class="sector-frame" ref="sectorFrame" :style="computeTransform()" >
            <sector2 v-for="(sector, index) in sectors" 
            :key="index" 
            :sector="sector.main" 
            :title="title(index)" 
            :circleUrl="circleUrl" 
            ></sector2>
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
            </div>
        </div>

        <div class="navigation">
            <div class="language">
                <div class="flag ru" :class="{active:(getLanguage()=='ru')}" v-on:click="setLanguage('ru')"></div>
                <div class="flag en" :class="{active:(getLanguage()=='en')}" v-on:click="setLanguage('en')"></div>
                <div class="flag lv" :class="{active:(getLanguage()=='lv')}" v-on:click="setLanguage('lv')"></div>
                <!--div class="button-prev" v-on:click="movePrev"></div>
                <div class="button-next" v-on:click="moveNext"></divp-->
            </div>
        </div>

    </div>
</template>

<script>

    import {Vector3, Vector2, Rectangle, getRandomArbitrary, radiansToDegrees} from './components/common.js'
    import sector2 from './components/sector2.vue'
    import detail from './components/detail.vue'

    export default {
        name: "app",
        data: function(){return {
                view: null,
                angle:0,
                prevx:null,
                language:'lv',
                selectedDetail:null,
                backgroundSliderPos:100,
                angleMinMax:[0,0],
                rotationStep:0,
                config:{
                    userInputTimeout:5000,
                    detailRotationDuration:650,
                },                
            }
        },
        components: {
            sector2, detail
        },
        computed: {
            circleUrl:function(){
                if(this.view) {
                    return this.view.circleBackground;
                }
                return '';
            },
            sectors:function () {
                if(this.view && typeof this.view.sectors !== 'undefined'){
                    return this.view.sectors;
                }
                return false;
            },
            backgroundSliderStyle:function(){
                if(this.view) {
                    return {
                        backgroundImage: 'url(' + this.view.mainBackground + ')',
                        left: this.backgroundSliderPos + 'px'
                    };
                }
                return {};
            },
            detailBackgroundImageUrl:function(){
                if(this.view && typeof this.view.detailBackground != "undefined"){
                    return this.view.detailBackground;
                }
                return '';
            }            
        },
        methods: {
            init:function () {
                let id = null;
                if (typeof window.location.search !== 'undefined'
                    && window.location.search.length > 0
                ) {
                    let result = window.location.search.match(/\?id=(\d+)/);
                    if(typeof result[1] !== 'undefined') {
                        id = result[1];
                    }
                } else {
                    let path = window.location.pathname.split('/');
                    id = parseInt(path[1]);
                }
                if (id != null) {
                    this.$http.get('/resources/view_'+id+'/config2.json').then(function(response) {
                        this.view = response.body;
                        this.calculateMinMaxAngle();
                        this.initAudio();
                    }, function(){});
                }
            },
            //Set up default position, visibility and opacity
            initDetailView:function(){
                Velocity(this.$refs.detailScreen,{ opacity: 0 }, { display: "none" });
                this.rotateDetailView(this.selectedDetail, true);
            },
            renderDetailView:function(index){
                if(this.selectedDetail != null && index == this.selectedDetail)return true;

                var next = this.getNextDetailViewId();
                if(next != null && index == next)return true;

                var prev = this.getPreviousDetailViewId();
                if(prev != null && index == prev)return true;

                return false;
            },
            closeDetailView:function(){

                var parent = this;

                this.$emit('detail-close', this.selectedDetail);

                //Fade off detail view background
                Velocity(this.$refs.detailScreen,{
                    opacity:0
                }, { duration: 600,
                    display: "none",
                    complete:function(){
                        parent.selectedDetail = null;
                    }
                });

                Velocity(this.$refs.backgroundSlider,{
                    blur:0
                }, { duration: 1000});

                // this.userInputActivation();
            },  
            selectDetailView:function(id){
                
                this.selectedDetail = id;
                
                if (this.selectedDetail != null) {
                    
                    //Init detail view to default state
                    this.initDetailView();
//                    this.$emit('move-out', id);
                    //Fade in detail view background

                    Velocity(this.$refs.backgroundSlider,{
                        blur:5
                    }, { duration: 1000});

                    Velocity(this.$refs.detailScreen,{
                        opacity:1
                    }, { duration: 1000,
                        display: "block"
                    });
                    // Velocity(this.$refs.shadowBackground, {
                    //     opacity: 0,
                    // }, {duration:300,delay: 100,});
                }
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
            rotateDetailView:function(targetIndex, imediate = false){
                var angle = targetIndex * this.rotationStep;
                var parent = this;
                var duration = this.config.detailRotationDuration;
                if(imediate)duration = 0;

                Velocity(this.$refs.detailCarousel,"finish");

//                this.$emit('carousel-slide-start', this.selectedDetail, targetIndex);

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
            calculateMinMaxAngle:function(){
                this.angleMinMax[0] = 360; //Min
                this.angleMinMax[1] = -360; //Max
                for(let i=0; i<this.view.sectors.length; i++){
                    let s = this.view.sectors[i];
                    if(s.main.position[0] < this.angleMinMax[0]){
                        this.angleMinMax[0] = s.main.position[0];
                    }
                    if(s.main.position[0] > this.angleMinMax[1]){
                        this.angleMinMax[1] = s.main.position[0];
                    }                    
                }
                this.angleMinMax[0] += 9;
                this.angleMinMax[1] -= 9;
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
            title:function (index) {
                if(this.view && typeof this.view.sectors !== 'undefined'){
                    let language = this.getLanguage();
                    if(typeof this.view.sectors[index].title !== 'undefined'
                        && typeof this.view.sectors[index].title[language] !== 'undefined'){
                        return this.view.sectors[index].title[language];
                    }
                }
                return "NO TITLE";
            },
            getLanguage:function(){
                return this.language;
            },
            setLanguage:function(lang){
                this.language = lang;
            },
            computeTransform: function () {
                return {
                    transform: 'rotateY(' + this.angle + 'deg)'
                };
            },
            onDrag:function (e) {
                if(this.prevx==null){
                    this.prevx = e.x;
                    return;
                }
                var diff = e.x - this.prevx;
                if(e.buttons == 1) {
                    this.angle += (diff * 0.01);
                    if(-this.angle < this.angleMinMax[0]){
                        this.angle = -this.angleMinMax[0]
                    }
                    if(-this.angle > this.angleMinMax[1]){
                        this.angle = -this.angleMinMax[1]
                    }
                }

                let displacement = this.angle * 10;
                this.backgroundSliderPos = displacement - 100;

                this.prevx = e.x;
            },
        },
        mounted:function() {
            this.init();
            document.addEventListener('mousemove', this.onDrag);
            this.initDetailView();

            this.rotationStep = 2 * radiansToDegrees(Math.atan((1024/2)/3000));

            this.$on('detail-select', this.selectDetailView);

        }
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
        top:0;
        left:0;
        overflow: hidden;
        display:block;
        perspective: 400px;
        transform-style: preserve-3d;
      /*  border: 1px dashed yellow; */
    }
    .background-slider{
        width:2240px;
        height:768px;
        position:absolute;
        top:0;
    }
    .sector-frame{
        transform-style: preserve-3d;
        transform: rotateX(0deg) rotateY(0deg);
        transform-origin: 512px 0 -2000px;
    }

    .navigation {
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
        margin-right:3px;
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
</style>