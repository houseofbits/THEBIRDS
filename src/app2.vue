<template>
    <div id="app">

        <div class="sector-frame" ref="sectorFrame" :style="computeTransform()" >
            <sector2 v-for="(sector, index) in sectors" :key="index" :sector="sector"></sector2>
        </div>

    </div>
</template>

<script>

    import {Vector3, Vector2, Rectangle, getRandomArbitrary, radiansToDegrees} from './components/common.js'
    import sector2 from './components/sector2.vue'

    export default {
        name: "app",
        data: function(){return {
                view: [
                    {
                        title:"KAROŠKNĀBIS",
                        position:[370,60], //y,z
                        angle:-1,
                        diameter:280,
                        iconSize:[300,200],
                        iconPos:[50,20],
                        iconImage:"resources/view_1/images/s10d.png",
                        iconShadow:"resources/view_1/images/s10s.png"
                    },
                    {
                        title:"KAROŠKNĀBIS",
                        position:[370,60],
                        angle:2,
                        diameter:280,
                        iconSize:[300,200],
                        iconPos:[50,20],
                        iconImage:"resources/view_1/images/s9d.png",
                        iconShadow:"resources/view_1/images/s9d.png"
                    },
                    {
                        title:"KAROŠKNĀBIS",
                        position:[100,60],
                        angle:0,
                        diameter:280,
                        iconSize:[300,200],
                        iconPos:[50,20],
                        iconImage:"resources/view_1/images/s8d.png",
                        iconShadow:"resources/view_1/images/s8d.png"
                    },
                    {
                        title:"KAROŠKNĀBIS",
                        position:[100,0],
                        angle:3,
                        diameter:280,
                        iconSize:[300,200],
                        iconPos:[50,20],
                        iconImage:"resources/view_1/images/s7d.png",
                        iconShadow:"resources/view_1/images/s7d.png"
                    },
                ],
                angle:-2,
                prevx:null
            }
        },
        components: {
            sector2
        },
        computed: {
            sectors: function () {
                return this.view;
            },
        },
        methods: {
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
                this.prevx = e.x;
            },
        },
        mounted:function() {

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
        top:0px;
        left:0px;
        overflow: hidden;
        display:block;
        perspective: 400px;
        transform-style: preserve-3d;
        border: 1px dashed yellow;
    }
    .sector-frame{
        transform-style: preserve-3d;
        transform: rotateX(0deg) rotateY(0deg);
        transform-origin: 512px 0 -6000px;
    }

</style>