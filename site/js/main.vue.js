
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
        selectedDetail:null,
        mouseState:[0, 0, 0, 0, 0, 0, 0, 0, 0],
        mouseDownCount:0
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
            this.$http.get('/resources/view_'+id+'/config.json').then(function(response) {
                this.init(response.body);
            }, function(){});
        },
        onMouseMove:function (e) {

            //Move only if main view is selected
            if(this.selectedDetail == null
                && this.mouseDownCount
            ){

                var px = e.clientX;
                var py = e.clientY;

                var scalex = 0.5 - (px / 1024.0);
                var scaley = -0.5 + (py / 768.0);

                Velocity(this.$refs.mainScreen, {
                    rotateX:scaley*10,
                    rotateY:scalex*20
                }, { duration: 10});
            }
        },
        onClick:function (e) {

        },
        selectDetailView:function(id){

            console.log("select detail "+id);

            if (this.selectedDetail != null) {

                //Init detail view to default state
                this.initDetailView();

                //Fade off main view
                this.$emit('blur-effect-event', true);

                //Fade in detail view background
                Velocity(this.$refs.detailScreen,{
                    opacity:1
                }, { duration: 1000,
                    delay: 100,
                    display: "block",
                    complete:function(elements){

                        //bring in buttons and content

                    } });

            } else {


                //Slide to next detail coontent view

            }
        },

        //Set up default position, visibility and opacity
        initDetailView:function(){
            
            Velocity(this.$refs.detailScreen,{ opacity: 0 }, { display: "none" });

            //1) Button positions
            //2) Content positions/opacity?

        },
        closeDetailView: function(){

            var parent = this;

            //Fade off detail view background
            Velocity(this.$refs.detailScreen,{
                opacity:0
            }, { duration: 600, 
                display: "none",
                complete:function(elements){

                    //Fade in main view
                    parent.$emit('blur-effect-event', false);

                } });
            this.selectedDetail = null;
        },
        getNextDetailViewId:function(){
            if(this.selectedDetail != null){
                if(typeof this.sectors[(this.sectors.size() + 1)] != 'undefined'){
                    return (this.sectors.size() + 1);
                }
            }
            return null;
        },
        getPreviousDetailViewId:function(){
            if(this.selectedDetail != null){
                if(this.selectedDetail > 0 
                    && typeof this.sectors[(this.sectors.size() - 1)] != 'undefined'){
                    
                    return (this.sectors.size() - 1);
                }
            }
            return null;
        },
        //Play sound from active detail view
        playSound:function(soundId){

            

        },
        switchLanguage:function(language){
            this.language = language;
        },
        blurEffect:function(on){

            Velocity(this.$refs.mainBackground,"finish");

            var value = 0;
            var zoom = 600;
            if(on){
                value = 3;
                zoom = 300;
            }
            Velocity(this.$refs.mainBackground,{
                blur:value
            }, { duration: 1000});

            // Velocity(this.$refs.mainScreen,{
            //     perspective:zoom
            // }, { duration: 1000});
        },
        //Sector is grabbed => hightlight it or blur out rest
        onSectorGrabEvent:function (index) {
            if(typeof index == 'undefined')return;
            if(this.selectedDetail == null){
                this.$emit('blur-effect-on', index);
            }
        },
        //Sector is released => activate detail view
        onSectorReleaseEvent:function (index) {
            if(typeof index == 'undefined')return;
            if(this.selectedDetail == null){
                this.selectedDetail = index;
                this.selectDetailView(index);
            }
        },
        //Sector is left => return to normal state
        onSectorLeaveEvent:function (index) {
            if(typeof index == 'undefined')return;
            if(this.selectedDetail == null){
                this.$emit('blur-effect-off');
            }
        },
        onBlurEffectOn:function(excludeIndex){
            this.blurEffect(true);
        },
        onBlurEffectOff:function(){
            this.blurEffect(false);
        },
        onMouseDown:function (e) {
            ++this.mouseState[e.button];
            ++this.mouseDownCount;
        },
        onMouseUp:function (e) {
            --this.mouseState[e.button];
            --this.mouseDownCount;
        }
    },
    mounted:function () {
        this.getView(this.$el.attributes.viewid.value);

        document.addEventListener('mousedown', this.onMouseDown);
        document.addEventListener('mouseup', this.onMouseUp);
        document.addEventListener('mousemove', this.onMouseMove);
        document.addEventListener('touchmove', this.onMouseMove);

        this.$on('blur-effect-event', this.blurEffect);
        //this.$on('sector-on-click', this.onSectorClickEvent);

        this.$on('blur-effect-on', this.onBlurEffectOn);
        this.$on('blur-effect-off', this.onBlurEffectOff);
        this.$on('sector-grab', this.onSectorGrabEvent);
        this.$on('sector-release', this.onSectorReleaseEvent);
        this.$on('sector-leave', this.onSectorLeaveEvent);

        this.initDetailView();
    },
    beforeDestroy: function () {
        document.removeEventListener('mousemove', this.onMouseMove);
        document.removeEventListener('click', this.onClick);
    },
});