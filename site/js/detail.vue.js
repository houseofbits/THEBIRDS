
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

        title:function(){
            var language = this.$parent.getLanguage();

            if(typeof this.data.title != 'undefined'
                && typeof this.data.title[language] != 'undefined'){
                return this.data.title[language];
            }
            return 'No title [' + this.$vnode.key + ']';
        }

    },
    methods: {
        getImageProp:function(name){
            // if(this.data && typeof this.data.mainImage != 'undefined'){
            //     if(typeof this.data.mainImage[name] != 'undefined'){
            //         return this.data.mainImage[name];
            //     }
            // }
            // return '';
        },
        onCarouselSlideStart:function(currentIndex, targetIndex){
            
        },
        calculateAngle:function(positionIndex){

            var halfAngle = radians_to_degrees(Math.atan((1024/2)/3000));

            //console.log(positionIndex + ' / ' + ((halfAngle * 2) * positionIndex));

            return ((halfAngle * 2) * positionIndex);
        },
    },
    mounted:function () {
        
        this.$parent.$on('carousel-slide-start', this.onCarouselSlideStart);

        Velocity(this.$el, { rotateY:this.calculateAngle(this.$vnode.key) }, 0);
    }
})