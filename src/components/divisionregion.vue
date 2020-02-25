<template>
    <polygon v-if="polygonPoints" :points="polygonPoints" class="polygon-division-reg"
    v-on:mousedown="onGrab"
    v-on:mouseup="onRelease"
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
            if(this.data){
                if(typeof this.data['clipPolygon'] != 'undefined'){
                    return this.data['clipPolygon'];
                }
            }
            return false;
        },
    },
    methods:{
        //mousedown/mouseover or touchstart
        onGrab:function(){
            this.$parent.$emit('division-grab', this.$vnode.key);
        },
        ///mouseup or touchend
        onRelease(){
            this.$parent.$emit('division-release', this.$vnode.key);
        },
    }
}
</script>

<style scoped>
    .polygon-division-reg{
        fill:rgb(255, 0, 43);
        stroke:rgb(190, 0, 111);
        stroke-width:2px;
        fill-rule:evenodd;
        opacity:0.2;
    }
</style>