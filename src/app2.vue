<template>
    <div id="app">

        <div class="sector-frame" ref="sectorFrame" :style="computeTransform()" >
            <sector2 v-for="(sector, index) in sectors" :key="index" :sector="sector.main" :title="title(index)"></sector2>
        </div>


        <div class="navigation">
            <!--div v-if="getPreviousDetailViewId()!=null" class="button-prev" v-on:click="movePrev"></div>
            <div v-if="getNextDetailViewId()!=null" class="button-next" v-on:click="moveNext"></div>
            <div class="button-exit" v-on:click="closeDetailView"></div-->
            <div class="language">
                <div class="flag ru" :class="{active:(getLanguage()=='ru')}" v-on:click="setLanguage('ru')"></div>
                <div class="flag en" :class="{active:(getLanguage()=='en')}" v-on:click="setLanguage('en')"></div>
                <div class="flag lv" :class="{active:(getLanguage()=='lv')}" v-on:click="setLanguage('lv')"></div>
            </div>
        </div>
    </div>
</template>

<script>

    import {Vector3, Vector2, Rectangle, getRandomArbitrary, radiansToDegrees} from './components/common.js'
    import sector2 from './components/sector2.vue'

    export default {
        name: "app",
        data: function(){return {
                view: null,
                angle:0,
                prevx:null,
                language:'lv'
            }
        },
        components: {
            sector2
        },
        computed: {
            sectors:function () {
                if(this.view && typeof this.view.sectors !== 'undefined'){
                    return this.view.sectors;
                }
                return false;
            },
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
                        //this.initAudio();
                    }, function(){});
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
                }
                //console.log(angle);
                this.prevx = e.x;
            },
        },
        mounted:function() {
            this.init();
            document.addEventListener('mousemove', this.onDrag);
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
        /*background-color: rgb(48, 48, 48);*/
        background-repeat: round;
        background-image: url('/resources/view_1/images/bg2.png');
        width:1024px;
        height:768px;
        position:absolute;
        top:0;
        left:0;
        overflow: hidden;
        display:block;
        perspective: 400px;
        transform-style: preserve-3d;
        border: 1px dashed yellow;
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

</style>