
var app = new Vue({
    el: '#mainApp',
    data: {
        view: null,
    },
    computed:{
        sectors:function () {
            if(this.view && typeof this.view.sectors != 'undefined'){
                return this.view.sectors;
            }
            return false;
        }
    },
    methods: {
        // play:function () {
        //     if(this.sound.playing())this.sound.stop();
        //     else this.sound.play();
        // },
        init:function (viewData) {
            this.view = viewData;



        },
        getView:function (id) {
            this.$http.get('api.php?id='+id).then(function(response) {
                this.init(response.body);
            }, function(){});
        },
        onMouseMove:function (e) {
        //    console.log('document mousemove event '+e.clientX+", "+e.clientY);



        },
        onClick:function (e) {
            console.log('document click event '+e.clientX+", "+e.clientY);
            this.$emit('test-event', 1);
        }
    },
    mounted:function () {
        this.getView(this.$el.attributes.viewid.value);

        document.addEventListener('mousemove', this.onMouseMove);
        document.addEventListener('click', this.onClick);

        // this.sound = new Howl({
        //     src: ['views/sound.wav']
        // });

    },
    beforeDestroy: function () {
        document.removeEventListener('mousemove', this.onMouseMove);
        document.removeEventListener('click', this.onClick);
    },
});