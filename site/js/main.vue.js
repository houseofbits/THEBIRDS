
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
            this.$http.get('views/view.php?id='+id).then(function(response) {
                this.init(response.body);
            }, function(){});
        },
    },
    mounted:function () {
        this.getView(this.$el.attributes.viewid.value);

        // this.sound = new Howl({
        //     src: ['views/sound.wav']
        // });

    }
});