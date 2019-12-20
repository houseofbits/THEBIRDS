
Vue.component('detail', {
    props: ['sector'],
    template:'#detail-template',
    data: function () {
        return { data: this.sector, originDepth: 3000 }
    },
    computed:{

        

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
        calculateAngle:function(position){
            
            //...
            
            return 0;
        },
    },
    mounted:function () {
        
        this.$parent.$on('carousel-slide-start', this.onCarouselSlideStart);


        //Set default rotation and origin position

        var rotation = this.calculateAngle(this.$vnode.key);

        Velocity(this.$el, { rotateZ:rotation }, 0);

    }
})