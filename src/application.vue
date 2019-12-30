<template>
  <div id="app">

    <segment personName="Travis" />

    <div class="main-screen" ref="mainScreen">
        dsfgdfgsd

    </div>
    <div class="clip-screen">

    </div>
    <div class="detail-screen" ref="detailScreen">    

    </div>
  </div>
</template>
<script>

import segment from './components/segment.vue'

export default {
    name: 'app',
    components: {
        segment
    },
    mounted:function(){

        //console.log(window.location.pathname);

        //console.log(this.$http);

        // Velocity(this.$refs.mainScreen,{
        //     blur:5
        // }, { duration: 1600});

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

</style>