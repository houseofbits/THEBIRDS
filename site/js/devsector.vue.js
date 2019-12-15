
Vue.component('devsector', {
    props: ['sector'],
    template:'#dev-sector-template',
    data: function () {
        return { data: this.sector }
    },
    computed:{
        backgroundImageUrl:function(){
            return this.getImageProp('image');
        },
        backgroundImageActiveUrl:function(){
            return this.getImageProp('imageActive');
        },
        width:function(){
            var size = new Rectangle(this.getImageProp('size'));
            return size.width;
        },
        height:function(){
            var size = new Rectangle(this.getImageProp('size'));
            return size.height;
        },
        polygonPoints:function(){
            return this.getImageProp('clipPolygon');
        }
    },
    methods: {
        getImageProp:function(name){
            if(this.data && typeof this.data.mainImage != 'undefined'){
                if(typeof this.data.mainImage[name] != 'undefined'){
                    return this.data.mainImage[name];
                }
            }
            return '';
        },
    },
    mounted:function () {

    }
})