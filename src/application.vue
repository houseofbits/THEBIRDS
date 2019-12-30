<template>
  <div id="app">
    <div class="main-screen" ref="mainScreen">
        <div class="main-background" ref="mainBackground" :style="{backgroundImage: 'url(' + backgroundImageUrl + ')'}">
            <div class="shadow-background" ref="shadowBackground" :style="{backgroundImage: 'url(' + shadowImageUrl + ')'}"></div>
        </div>
        <sector v-for="(sector, index) in sectors" :key="index" :sector="sector"></sector>
    </div>
    <div class="clip-screen">
        <svg>
            <clipregion v-for="(sector, index) in sectors" :key="index" :sector="sector"></clipregion>
        </svg>
    </div>
    <div class="detail-screen" ref="detailScreen">    

    </div>
  </div>
</template>
<script>

import sector from './components/sector.vue'
import clipregion from './components/clipregion.vue'
import detail from './components/detail.vue'

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
        }
    },    
    components: {
        sector,
        clipregion,
        detail
    },
    computed:{
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
        }        

    },
    methods:{
        init:function () {
            var id = 1;
            var path = window.location.pathname.split('/');
            id = parseInt(path[1]);
            this.$http.get('/resources/view_'+id+'/config.json').then(function(response) {
                this.view = response.body;
            }, function(){});
        },
        //Sector is grabbed => hightlight it or blur out rest
        onSectorGrabEvent:function (index) {
            console.log('grab ' + index);
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
            //    this.selectDetailView(index);
            }
        },
        //Sector is left => return to normal state
        onSectorLeaveEvent:function (index) {
            if(typeof index == 'undefined')return;
            if(this.selectedDetail == null){
                this.$emit('blur-effect-off');
            }
        },


    },
    mounted:function(){

        this.$on('sector-grab', this.onSectorGrabEvent);
        this.$on('sector-release', this.onSectorReleaseEvent);
        this.$on('sector-leave', this.onSectorLeaveEvent);

        //console.log(this.$http);

        // Velocity(this.$refs.mainScreen,{
        //     blur:5
        // }, { duration: 1600});

        this.init();

    }
}
</script>
<style>
    @font-face {
        font-family: "customFont";
        src: url("/resources/font.ttf");
    }
    body{
        background-color: slategrey;
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
        display: none;
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
</style>