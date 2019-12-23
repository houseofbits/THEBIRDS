
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
        detailBackgroundImageUrl:function(){
            return this.$parent.detailBackgroundImageUrl();
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
                return this.data.description[language];
            }
            return '';
        },
        imageUrl:function(){
            return this.getDetailProp('image');
        },
        width:function(){
            var size = new Rectangle(this.getDetailProp('size'));
            return size.width;
        },
        height:function(){
            var size = new Rectangle(this.getDetailProp('size'));
            return size.height;
        },        
        positionX:function(){
            var size = new Rectangle(this.getDetailProp('position'));
            return size.width;
        },
        positionY:function(){
            var size = new Rectangle(this.getDetailProp('position'));
            return size.height;
        },                
    },
    methods: {
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

        Velocity(this.$el, { rotateY:this.calculateAngle(this.$vnode.key) }, 0);
    }
})