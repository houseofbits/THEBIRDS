
Vue.component('sector', {
    props: ['data'],
    template:'#sector-template',
    data: function () {
        return {}
    },
    computed:{

    },
    methods: {
        animIn:function (event) {
            Velocity(event.target, { opacity: 1
            }, { duration: 200})
        },
        animOff:function (event) {
            // Velocity(event.target, { opacity: 0.5, rotateX:0, rotateY:0//, translateZ:-15
            // }, { duration: 200})
        },
        updateMove:function (event) {
            var px = event.offsetX;
            var py = event.offsetY;
            var scalex = 0.5 - (px / 300.0);
            var scaley = -0.5 + (py / 300.0);
            Velocity(event.target, {
                rotateX:scaley*5,
                rotateY:scalex*5,
                boxShadowX:scalex*-30,
                boxShadowY:scaley*30,
            }, { duration: 10})
        }
    },
    mounted:function () {
        
    }
})