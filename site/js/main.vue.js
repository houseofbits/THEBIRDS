
class Rectangle {
  constructor(str) {
    this.height = 0;
    this.width = 0;
    if(str && str.indexOf(',') > 0){
        var arr = str.split(',');
        if(typeof arr[0] != 'undefined')this.width = parseFloat(arr[0]);
        if(typeof arr[1] != 'undefined')this.height = parseFloat(arr[1]);        
    }
  }
}

class Vector3 {
  constructor(str) {
    this.x = 0;
    this.y = 0;
    this.z = 0;
    if(str && str.indexOf(',') > 0){
        var arr = str.split(',');
        if(typeof arr[0] != 'undefined')this.x = parseFloat(arr[0]);
        if(typeof arr[1] != 'undefined')this.y = parseFloat(arr[1]);
        if(typeof arr[2] != 'undefined')this.z = parseFloat(arr[2]);                
    }
  }
}

var app = new Vue({
    el: '#appplication',
    data: {
        view: null,
        language:'lv',
        faded:false,
        selectedDetail:null
    },
    computed:{
        sectors:function () {
            if(this.view && typeof this.view.sectors != 'undefined'){
                return this.view.sectors;
            }
            return false;
        },
        backgroundImageUrl:function(){
            if(this.view && typeof this.view.mainBackground != "undefined"){
                return this.view.mainBackground;
            }
            return '';
        },
        detailBackgroundImageUrl:function(){
            if(this.view && typeof this.view.detailBackground != "undefined"){
                return this.view.detailBackground;
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
                rotateX:scaley*10,
                rotateY:scalex*20
            }, { duration: 10});

        },
        onClick:function (e) {

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
        nextDetailView:function(){


        },
        previousDetailView:function(){


        },
        //Play sound from active detail view
        playSound:function(soundId){

            

        },
        switchLanguage:function(language){
            this.language = language;
        },
        blurEffectEventReceived:function(on){
            var value = 0;
            var zoom = 600;
            if(on){
                value = 3;
                zoom = 300;
            }
            Velocity(this.$refs.mainBackground,{
                blur:value
            }, { duration: 1000});

            Velocity(this.$refs.mainScreen,{
                perspective:zoom
            }, { duration: 1000});

        },
        sectorOnClickEvent:function (index) {
            console.log("sector on click "+index);
            this.fade = !this.fade;
            this.$emit('blur-effect-event', this.fade);
        }
    },
    mounted:function () {
        this.getView(this.$el.attributes.viewid.value);

        document.addEventListener('mousemove', this.onMouseMove);
        document.addEventListener('click', this.onClick);

//        document.addEventListener('drag', this.onClick);
//        document.addEventListener('touchstart', this.onClick);
//        document.addEventListener('touchend', this.onClick);
//        document.addEventListener('touchmove', this.onClick);                

        this.$on('blur-effect-event', this.blurEffectEventReceived);
        this.$on('sector-on-click', this.sectorOnClickEvent);
    },
    beforeDestroy: function () {
        document.removeEventListener('mousemove', this.onMouseMove);
        document.removeEventListener('click', this.onClick);
    },
});