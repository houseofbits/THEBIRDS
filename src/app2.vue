<template>
    <div id="app">

        <div class="background-slider" :style="backgroundSliderStyle()" ref="backgroundSlider"></div>

        <div class="background-v-grad"></div>

        <div class="pos-bg" v-if="!detailViewOpen">
            <div class="pos-slider" :style="posSliderStyle()"></div>
        </div>

        <div v-if="!detailViewOpen" class="sector-frame" ref="sectorFrame" :style="computeTransform()" >
            <sector2 v-for="(sector, index) in sectors" v-if="isVisible(sector.main.position[0])"
            :key="index" 
            :sector="sector.main"
            :title="title(index)" 
            :circleUrl="circleUrl"
            :curve="calculateUnitAngle(sector.main.position[0])"
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
                <div class="button-prev" v-if="!detailViewOpen" v-on:click="autoRotate(10)"></div>
                <div class="button-next" v-if="!detailViewOpen" v-on:click="autoRotate(-10)"></div>
            </div>
            <div class="pos-page-bg" v-if="detailViewOpen">
                <div v-for="(sector, index) in sectors" class="pos-page" :style="posPageStyle(index)"></div>
            </div>
        </div>

        <div class="info-overlay" :class="{infoOverlayOpacity:!passiveMode}"></div>

    </div>
</template>

<script>

    import {Vector3, Vector2, Rectangle, getRandomArbitrary, radiansToDegrees, exponentialEasing} from './components/common.js'
    import sector2 from './components/sector2.vue'
    import detail from './components/detail.vue'

    export default {
        name: "app",
        data: function(){return {
                view: null,
                angle:-95,
                prevx:null,
                language:'lv',
                selectedDetail:null,
                detailViewOpen:false,
                backgroundSliderPos:0,
                angleMinMax:[0,0],
                isAutoRotating:false,
                rotationStep:0,
                config:{
                    userInputTimeout:80000,
                    detailRotationDuration:650,
                },
                isDraging:false,
                userInputTimer:null,
                passiveMode:false,

                loadDetail:null,
            }
        },
        components: {
            sector2, detail
        },
        computed: {
            isDetailViewVisible:function(){
                return (this.selectedDetail !== null);
            },
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

                    let det = path[1].split('-');
                    if(typeof det[1] != 'undefined') {
                        this.loadDetail =parseInt(det[1]);
                    }
                }
                if (id != null) {
                    this.$http.get('/resources/view_'+id+'/config.json').then(function(response) {
                        this.view = response.body;
                        this.calculateAutoAngles();
                        this.calculateMinMaxAngle();
                        this.initAudio();
                        if (this.loadDetail !== null) {
                            this.selectDetailView(this.loadDetail);
                        }
                    }, function(){});
                }
            },
            userInputActivation:function(){

                this.passiveMode = false;

                if(this.userInputTimer){
                    clearTimeout(this.userInputTimer);
                    this.userInputTimer = null;
                }
                let parent = this;
                this.userInputTimer = setTimeout(function(){
                    if(parent.selectedDetail != null)parent.closeDetailView();
                    parent.passiveMode = true;
                }, this.config.userInputTimeout);
            },
            isVisible:function(localAngle){
                let angle = this.angle + localAngle;
                return  (angle > -25 && angle < 25);
            },
            calculateUnitAngle:function(localAngle){
                if(!this.isVisible(localAngle))return 0;
                let angle = this.angle + localAngle;
                let unitAngle = Math.min(Math.abs(angle / 15), 1);
                return {
                    iconCurve: exponentialEasing(unitAngle, 0.4),
                    sliderCurve: exponentialEasing(unitAngle, 0.6),
                    blurCurve:exponentialEasing(unitAngle, 0.9)
                };
            },
            posPageStyle:function(index){
                let w = 1024 / this.sectors.length;
                let color = 'rgba(255,255,255,0.2)';
                if(index == this.selectedDetail){
                    color = 'rgba(0,255,0,0.4)';
                }
                return {
                    width:(w-2)+'px',
                    left:((w+1)*index)+'px',
                    backgroundColor: color
                };
            },
            posSliderStyle:function(){
                let absWidth = Math.abs(this.angleMinMax[0]) + Math.abs(this.angleMinMax[1]);
                let width = Math.min((10000 / absWidth), 512);
                let angle = Math.abs(this.angle + this.angleMinMax[0]);
                let pos = (angle * (1024 - width)) / absWidth;
                return {
                    'right':pos+'px',
                    'width':width+'px'
                };
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
            calculateAutoAngles:function(){
                let initTop = -10;
                let initBottom = -5;
                //let topNum = Math.ceil(this.view.sectors.length / 2);
                let updown=true;
                for(let i=0; i<this.view.sectors.length; i++){
                    this.view.sectors[i].main.position = [0,0,0];
                    if(updown){
                        this.view.sectors[i].main.position[0] = initTop;
                        this.view.sectors[i].main.position[1] = 110;
                        initTop += 10;
                    }else{
                        this.view.sectors[i].main.position[0] = initBottom;
                        this.view.sectors[i].main.position[1] = 330;
                        initBottom += 10;
                    }
                    this.view.sectors[i].main.position[2] = 50;
                    updown = !updown;
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
                this.angleMinMax[0] += 4;
                this.angleMinMax[1] -= 4;
            },
            //Set up default position, visibility and opacity
            initDetailView:function(){
                if(typeof this.$refs.detailScreen != 'undefined') {
                    Velocity(this.$refs.detailScreen, {opacity: 0}, {display: "none"});
                    Velocity(this.$refs.detailScreen,"finish");
                    this.rotateDetailView(this.selectedDetail, true);
                }
            },
            renderDetailView:function(index){

                if(this.selectedDetail == null)return false;

                if(this.selectedDetail != null && index == this.selectedDetail)return true;

                let next = this.getNextDetailViewId();
                if(next != null && index == next)return true;

                let prev = this.getPreviousDetailViewId();
                if(prev != null && index == prev)return true;

                return false;
            },
            closeDetailView:function(){

                if(this.selectedDetail == null)return;

                let parent = this;

                this.$emit('detail-close', this.selectedDetail);

                this.$emit('stop-sounds');

                this.detailViewOpen = false;

                //Fade off detail view background
                Velocity(this.$refs.detailScreen,{
                    opacity:0
                }, { duration: 600,
                    display: "none",
                    complete:function(){
                        parent.selectedDetail = null;
                        parent.detailViewOpen = false;
                    }
                });
                this.userInputActivation();
            },  
            selectDetailView:function(id){

                this.selectedDetail = id;

                if (this.selectedDetail != null) {

                    let parent = this;

                    this.initDetailView();

                    Velocity(this.$refs.detailScreen,{
                        opacity:1
                    }, { duration: 1000,
                        display: "block",
                        complete:function () {
                            parent.detailViewOpen = true;
                        }
                    });
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

                this.userInputActivation();

                if(this.selectedDetail !== null)return;

                if(this.prevx==null){
                    this.prevx = e.x;
                    return;
                }
                let diff = e.x - this.prevx;
                if(e.buttons > 0) {
                    this.isDraging = true;
                    this.angle += (diff * 0.03); //0.03
                    if(-this.angle < this.angleMinMax[0]){
                        this.angle = -this.angleMinMax[0]
                    }
                    if(-this.angle > this.angleMinMax[1]){
                        this.angle = -this.angleMinMax[1]
                    }
                }

                let displacement = this.angle * 10;
                this.backgroundSliderPos = displacement - 100;

                //this.$forceUpdate();

                this.prevx = e.x;
            },
            onMouseUp:function(){
                this.isDraging = false;
                this.userInputActivation();
            },
            autoRotate:function(step){

                if(this.selectedDetail !== null || this.isAutoRotating)return;

                let parent = this;
                let angleStart = this.angle;

                this.isAutoRotating = true;

                Velocity(this.$el,{vueRotate:step}, {
                    duration: 500,
                    progress: function(elements, complete, remaining, start, tweenValue) {
                        parent.angle = angleStart + (step * complete);
                        if(-parent.angle < parent.angleMinMax[0]){
                            parent.angle = -parent.angleMinMax[0]
                        }
                        if(-parent.angle > parent.angleMinMax[1]){
                            parent.angle = -parent.angleMinMax[1]
                        }
                        let displacement = parent.angle * 10;
                        parent.backgroundSliderPos = displacement - 100;
                       // parent.$forceUpdate();
                    },
                    complete:function(){
                        parent.isAutoRotating = false;
                    }
                });
            },
        },
        mounted:function() {
            this.init();
            document.addEventListener('mousemove', this.onDrag);
            document.addEventListener('mouseup', this.onMouseUp);

            // document.addEventListener('touchstart', this.onTouchMove, false);
            // document.addEventListener('touchmove', this.onTouchMove, false);
            // document.addEventListener('touchcancel', this.onTouchMove, false);
            // document.addEventListener('touchend', this.onTouchMove, false);

            this.initDetailView();

            this.rotationStep = 2 * radiansToDegrees(Math.atan((1024/2)/3000));

            this.$on('detail-select', this.selectDetailView);

            this.userInputActivation();

            // let timeout = setTimeout("location.reload(true);",5000);
            // function resetTimeout() {
            //     clearTimeout(timeout);
            //     timeout = setTimeout("location.reload(true);",5000);
            // }

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
        width:3386px;
        height:768px;
        position:absolute;
        top:0;
    }
    .background-v-grad{
        width:1024px;
        height:768px;
        position:absolute;
        background: rgb(2,0,36);
        background: linear-gradient(180deg, rgba(0,0,0,0.6838936258096988) 0%, rgba(0,0,0,0.3785714969581583) 5%, rgba(0,0,0,0) 11%, rgba(0,0,0,0) 27%, rgba(0,0,0,0.4289916650253851) 44%, rgba(0,0,0,0) 61%, rgba(0,0,0,0) 87%, rgba(0,0,0,0.4598039899553571) 95%, rgba(0,0,0,0.5382353625043768) 100%);
    }

    .pos-bg{
        position:absolute;
        width:1024px;
        height:10px;
        bottom:0px;
        background-color: rgba(255,255,255,0.2);
    }
    .pos-slider{
        position:absolute;
        width:50px;
        height:10px;
        background-color: rgba(0,255,0,0.4);
    }
    .pos-page-bg{
        position:absolute;
        width:1024px;
        height:10px;
        bottom:0px;
    }
    .pos-page{
        position:absolute;
        width:50px;
        height:10px;
        background-color: rgba(255,255,255,0.2);
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
        bottom:10px;
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
        bottom:10px;
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
        bottom:10px;
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
    .info-overlay{
        visibility: visible;
        width:1024px;
        height:768px;
        position:absolute;
        top:0;
        left:0;
        display:block;
        background-image: url("/resources/finger_icon.png");
        background-repeat: no-repeat;
        background-attachment: fixed;
        background-position: center;
        opacity: 1;
        transition: opacity 400ms, visibility 400ms;
    }
    .infoOverlayOpacity{
        opacity: 0;
        visibility: hidden;
        transition: opacity 400ms, visibility 400ms;
    }
</style>