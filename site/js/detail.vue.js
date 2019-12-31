
function radians_to_degrees(radians)
{
    var pi = Math.PI;
    return radians * (180/pi);
}

Vue.component('detail', {
    props: ['sector'],
    template:'#detail-template',
    data: function () {
        return { data: this.sector }
    },
    computed:{
        sounds:function(){
            if(typeof this.data.audio != 'undefined'){
                return this.data.audio;
            }
            return null;
        },
        descriptionPosition:function(){
            if(typeof this.data.description != 'undefined'){
                var language = this.$parent.getLanguage();

                if(typeof this.data.description[language] == "object" && 
                typeof this.data.description[language].position != "undefined"){
                    var pos = new Vector2(this.data.description[language].position);
                    return pos;
                }
                if(typeof this.data.description.position != 'undefined'){
                    var pos = new Vector2(this.data.description.position);
                    return pos;
                }
            }
            return new Vector2(null);
        },
        detailBackgroundImageUrl:function(){
            return this.$parent.detailBackgroundImageUrl;
        },
        title:function(){
            var language = this.$parent.getLanguage();

            if(typeof this.data.title != 'undefined'
                && typeof this.data.title[language] != 'undefined'){
                return this.data.title[language];
            }
            return 'No title [' + this.$vnode.key + ']';
        },
        titleLatin:function(){
            if(typeof this.data.titleLatin != 'undefined'){
                return this.data.titleLatin;
            }
            return '';
        },
        description:function(){
            var language = this.$parent.getLanguage();

            if(typeof this.data.description != 'undefined'
                && typeof this.data.description[language] != 'undefined'){

                if(typeof this.data.description[language] == "object" && 
                typeof this.data.description[language].text != "undefined"){
                    return this.data.description[language].text;
                }
                return this.data.description[language];
            }
            return '';
        },
        imageUrl:function(){
            return this.getDetailProp('image');
        },
        imageSize:function(){
            return new Rectangle(this.getDetailProp('size'));
        },        
        imagePosition:function(){
            return new Vector2(this.getDetailProp('position'));
        },                        
    },
    methods: {
        soundTitle:function(index){
            var language = this.$parent.getLanguage();
            if(this.sounds[index] != "undefined" 
                && this.sounds[index].title != "undefined"
                && this.sounds[index].title[language] != "undefined"){
                    return this.sounds[index].title[language];
            }
            return "";
        },
        playSound:function(index){
            var isPlaying = this.isPlaying(index);
            this.$parent.$emit('stop-sounds');
            if(typeof this.sounds[index] != "undefined"){
                if(isPlaying){
                    this.sounds[index].sound.stop();
                }else{
                    this.sounds[index].sound.play();
                } 
            }
            this.$forceUpdate();
        },
        isPlaying:function(index){
            if(typeof this.sounds[index] != "undefined"){
                return this.sounds[index].sound.playing();
            }
            return false;
        },   
        onStopSound:function(){
            if(typeof this.sounds != "undefined" && this.sounds){
                for(var i=0; i<this.sounds.length; i++){
                    if(typeof this.sounds[i].sound != "undefined"){
                        this.sounds[i].sound.stop();
                    }                    
                }
            }
            this.$forceUpdate();            
        },     
        getDetailProp:function(name){
            if(this.data && typeof this.data.detailImage != 'undefined'){
                if(typeof this.data.detailImage[name] != 'undefined'){
                    return this.data.detailImage[name];
                }
            }
            return '';
        },
        onCarouselSlideStart:function(currentIndex, targetIndex){
            if(currentIndex == this.$vnode.key){
                Velocity(this.$el,{
                    blur:10
                }, { duration: 100});
            }
            if(targetIndex == this.$vnode.key){
                Velocity(this.$el,{
                    blur:10
                }, 0);
                Velocity(this.$el,{
                    blur:0
                }, { duration: 700});
            }            
        },
        calculateAngle:function(positionIndex){
            var halfAngle = radians_to_degrees(Math.atan((1024/2)/3000));
            return ((halfAngle * 2) * positionIndex);
        },
    },
    mounted:function () {
        this.$parent.$on('carousel-slide-start', this.onCarouselSlideStart);
        this.$parent.$on('stop-sounds', this.onStopSound);

        Velocity(this.$el, { rotateY:this.calculateAngle(this.$vnode.key) }, 0);
    }
})