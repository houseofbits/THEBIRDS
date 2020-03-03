<template>
    <div id="app">


        <div v-for="(sector, index) in sectors" class="sector" v-bind:style="computeTransform(sector)">
            <div class="icon"></div>
            <div class="title"></div>
        </div>


    </div>
</template>

<script>
    export default {
        name: "app",
        data: function(){return {
                view: [
                    {
                        positionX:'100px',
                        positionY:'100px',
                    },
                    {
                        positionX:'400px',
                        positionY:'100px',
                    }
                ]
            }
        },
        computed: {
            sectors: function () {
                return this.view;
            },
        },
        methods: {
            computeTransform: function (sector) {

                return {
                    transform:'translateX('+sector.positionX+')'
                    +' translateY('+sector.positionY+')'
                };
            }
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
  /*      transform:rotateY(0deg); */
    }
    .sector{
        position: absolute;
        left: 0px;
        top:0px;
        width:100px;
        height:100px;
        background-color: chartreuse;
        border-radius: 30px;
        transform:translateZ(60px);
        transform-style: preserve-3d;
    }
    .sector .icon{
        position: absolute;
        left: 30px;
        top:-30px;
        width:20px;
        height:150px;
        background-color: burlywood;
        border-radius: 30px;
        transform:translateZ(20px);
        transform-style: preserve-3d;
    }
    .sector .title{
        position: absolute;
        left: -30px;
        top:90px;
        width:150px;
        height:20px;
        background-color: cadetblue;
        border-radius: 30px;
        transform:translateZ(40px);
        transform-style: preserve-3d;
    }
</style>