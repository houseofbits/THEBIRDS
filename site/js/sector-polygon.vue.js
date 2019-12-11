
Vue.component('sector_polygon', {
    props: ['sector'],
    template:'#sector-polygon-template',
    data: function () {
        return { data: this.sector}
    },
    computed:{
        polygonPoints:function(){
            if(this.data && typeof this.data.mainImage != 'undefined'){
                if(typeof this.data.mainImage['clipPolygon'] != 'undefined'){
                    return this.data.mainImage['clipPolygon'];
                }
            }
            return false;
        }
    },
    methods: {
        onClick:function(){
            this.$parent.$emit('sector-on-click', this.$vnode.key);
        }
    },
    mounted:function () {   }
})