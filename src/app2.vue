<template>
    <div id="app">

        <div class="sector-frame" ref="sectorFrame">
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
                        title:"Test title",
                        position:[100,100,60],
                    },
                    {
                        title:"Test title",                        
                        position:[400,100,60],
                    }
                ]
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

        },
        mounted:function() {

        }
    }
</script>

<style scoped>
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
        background-color: rgb(48, 48, 48);
        width:1024px;
        height:768px;
        position:absolute;
        top:0px;
        left:0px;
        overflow: hidden;
        display:block;
        perspective: 400px;
        transform-style: preserve-3d;
    }
    .sector-frame{
        transform-style: preserve-3d;
        transform:rotateY(0deg);        
    }

</style>