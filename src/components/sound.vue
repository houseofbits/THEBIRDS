<template>
    <div class="sound">
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
    // data: function () {
    //     return { data: this.sound }    
    // },
    computed:{
    //     sounds:function(){
    //         if(typeof this.data.audio != 'undefined'){
    //             return this.data.audio;
    //         }
    //         return null;
    //     },                       
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
    //     playSound:function(){
    //         // var isPlaying = this.isPlaying(index);
    //         // this.$parent.$emit('stop-sounds');
    //         // if(typeof this.sounds[index] != "undefined"){
    //         //     if(isPlaying){
    //         //         this.sounds[index].sound.stop();
    //         //     }else{
    //         //         this.sounds[index].sound.play();
    //         //     } 
    //         // }
    //         this.$forceUpdate();
    //     },
    //     isPlaying:function(){
    //         return this.sound.playing();
    //     },   
    //     onStopSound:function(){
    //         this.sound.stop();
    //         this.$forceUpdate();            
    //     },
    },
    mounted:function () {
    ///    this.$parent.$on('stop-sounds', this.onStopSound);
    }
}

</script>

<style scoped>

    .sound{
        display: block;
        width: 50%;
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

</style>