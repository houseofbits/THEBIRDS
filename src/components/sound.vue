<template>
    <div class="sound" :class="{playing:isPlaying()}" v-on:click="playSound()">
        <span class="icon"></span>
        <span class="title">{{title}}</span>
        <div class=waveform>
            <div></div>
            <div></div>
            <div></div>
            <div></div>                        
        </div>
    </div>
</template>

<script>

export default {
    props: ['sound'],
    template:'#sound-template',
    data: function () {
        return { data: this.sound }    
    },
    computed:{                    
        title:function(){
            var language = this.$parent.$parent.getLanguage();
            if(this.data.title != "undefined"
                && this.data.title[language] != "undefined"){
                    return this.data.title[language];
            }
            return "";
        },    
    },
    methods: {
        playSound:function(){
            var isPlaying = this.isPlaying();
            this.$parent.$parent.$emit('stop-sounds');
            if(isPlaying){
                this.data.sound.stop();
            }else{
                this.data.sound.play();
            } 
            this.$forceUpdate();
        },
        isPlaying:function(){
            return this.data.sound.playing();
        },   
        onStopSound:function(){
            this.data.sound.stop();
            this.$forceUpdate();            
        },
    },
    mounted:function () {
        this.$parent.$parent.$on('stop-sounds', this.onStopSound);
    }
}

</script>

<style scoped>

    .sound{
        display: block;
        width: 60%;
        height: 55px;
        margin: 0px;
        margin-left: 50px;
    }
    .sound .icon{
        display: inline-block;
        margin:0;
        width:60px;
        height:60px;
        background-image: url('/resources/button_play.png');
        background-repeat: round;
    }
    .sound .title{
        display: inline-block;
        width:auto;
        height:50px;
        margin:0;
        vertical-align: top;
        color: #f5ff81;
        font-size: 25px;
        line-height: 50px;
        margin-left: 10px;

        background: linear-gradient(to bottom, rgba(252,234,187,1) 0%, rgba(252,205,77,1) 70%, rgba(248,181,0,1) 71%, rgba(251,223,147,1) 100%);
        -webkit-background-clip: text;
        background-clip: text; 
        -webkit-text-fill-color: transparent;    
        filter: drop-shadow(2px 2px 2px #000);     
    }
    .sound .waveform{
        display:none;
        vertical-align: top;
        position: relative;
        width:50px;
        height:35px;
        margin:0;
        margin-left: 5px;
    }
    .sound .waveform div{
        position: absolute;
        margin:0;
        bottom: 0px;
        background-color: yellowgreen;
        width:6px;
        height: 20px;
        background: linear-gradient(to bottom, rgba(214,252,0,1) 0%, rgba(117,137,12,1) 100%);
        filter: drop-shadow(1px 1px 1px #000);   
        animation-duration: 2s;
        animation-iteration-count: infinite;
        border-radius: 2px;
    }
    .sound .waveform div:nth-child(1){
        animation-name: wkf1;
        left:0px;
    }
    .sound .waveform div:nth-child(2){
        animation-name: wkf2;
        left:10px;
        height:5px;
    }
    .sound .waveform div:nth-child(3){
        animation-name: wkf3;
        left:20px;
        height:10px;
    }
    .sound .waveform div:nth-child(4){
        animation-name: wkf4;
        left:30px;
        height:25px;
    }
    @keyframes wkf1 {
        0%   {height: 35px;}
        50%   {height: 5px;}    
        100% {height: 35px;}
    }
    @keyframes wkf2 {
        0%   {height: 5px;}
        50%   {height: 35px;}    
        100% {height: 5px;}
    }
    @keyframes wkf3 {
        0%   {height: 10px;}
        33%   {height: 35px;}    
        66%   {height: 5px;}        
        100% {height: 10px;}
    }
    @keyframes wkf4 {
        0%   {height: 25px;}
        50%   {height: 5px;}    
        100% {height: 25px;}
    } 
    .playing .title{
        background: linear-gradient(to bottom, rgba(214,252,0,1) 0%, rgba(117,137,12,1) 100%);
        -webkit-background-clip: text;
        background-clip: text; 
        -webkit-text-fill-color: transparent;    
        filter: drop-shadow(2px 2px 2px #000);     
    }
    .playing .icon{
        background-image: url('/resources/button_play_on.png');
    }
    .playing .waveform{
        display:inline-block;
    }

</style>