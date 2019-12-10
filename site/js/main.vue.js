
var app = new Vue({
    el: '#appplication',
    data: {
        view: null,
        language:'lv',
    },
    computed:{
        sectors:function () {
            if(this.view && typeof this.view.sectors != 'undefined'){
                return this.view.sectors;
            }
            return false;
        },
        backgroundImageUrl:function(){
            if(typeof this.data.view.background != "undefined"){
                return this.data.view.background;
            }
            return '';
        },
    },
    methods: {

        init:function (viewData) {
            this.view = viewData;



        },
        getView:function (id) {
            this.$http.get('api.php?id='+id).then(function(response) {
                this.init(response.body);
            }, function(){});
        },
        onMouseMove:function (e) {

            var px = e.clientX;
            var py = e.clientY;

            var scalex = 0.5 - (px / 1024.0);
            var scaley = -0.5 + (py / 768.0);

            Velocity(this.$refs.mainScreen, {
                rotateX:scaley*30,
                rotateY:scalex*30
            }, { duration: 10});

        },
        onClick:function (e) {
            //console.log('document click event '+e.clientX+", "+e.clientY);
            this.$emit('test-event', 1);
        },
        selectDetailView:function(id){
            //1) rotate to focused perspective
            //2) fade to blurred main images
            //3) fade in detail view background
            //4) fade in detail view content
            //5) scroll in language tags and buttons
        },
        selectMainView: function(){
            //1) fade oiut detail view
            //2) fade to sharp images in main view
            //3) move/rotate to normal perspective
        },
        switchLanguage:function(language){
            this.language = language;
        }
    },
    mounted:function () {
        this.getView(this.$el.attributes.viewid.value);

        document.addEventListener('mousemove', this.onMouseMove);
        document.addEventListener('click', this.onClick);

    },
    beforeDestroy: function () {
        document.removeEventListener('mousemove', this.onMouseMove);
        document.removeEventListener('click', this.onClick);
    },
});