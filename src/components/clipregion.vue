<template>
    <polygon v-if="polygonPoints" :points="polygonPoints" class="polygon"
    v-on:mousedown="onGrab"
    v-on:mouseup="onRelease"
    v-on:mouseover="onGrab"
    v-on:mouseleave="onLeave"
    v-on:touchstart="onGrab"
    v-on:touchend="onRelease">
    </polygon>
</template>

<script>
export default {
    props: ['sector'],
    data: function () {
        return { data: this.sector }
    },
    computed:{
        polygonPoints:function(){
            if(this.data && typeof this.data.mainImage != 'undefined'){
                if(typeof this.data.mainImage['clipPolygon'] != 'undefined'){
                    return this.data.mainImage['clipPolygon'];
                }
            }
            return false;            
        },
    },
    methods:{
        //mousedown/mouseover or touchstart
        onGrab:function(){
            this.$parent.$emit('sector-grab', this.$vnode.key);
        },
        ///mouseup or touchend
        onRelease(){
            this.$parent.$emit('sector-release', this.$vnode.key);
        },
        //mouseout
        onLeave(){
            this.$parent.$emit('sector-leave', this.$vnode.key);
        }
    }
}
</script>

<style scoped>
    .polygon{
        fill:yellow;
        stroke:blue;
        stroke-width:2px;
        fill-rule:evenodd;
        opacity:0.3;
    }
</style>