
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

class Vector2 {
    constructor(str) {
        this.x = 0;
        this.y = 0;
        if(str && str.indexOf(',') > 0){
            var arr = str.split(',');
            if(typeof arr[0] != 'undefined')this.x = parseFloat(arr[0]);
            if(typeof arr[1] != 'undefined')this.y = parseFloat(arr[1]);
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

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

var app = new Vue({
    el: '#appplication',
    data: {
        view: null,
        language:'lv',
        selectedDetail:null,
        mouseState:[0, 0, 0, 0, 0, 0, 0, 0, 0],
        mouseDownCount:0,
        rotationStep:0,
        currentShakeIndex:0,
        passiveMode:false,
        userInputTimer:null,
        config:{
            userInputTimeout:5000,
            detailRotationDuration:650,
        },
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
        shadowImageUrl:function(){
            if(this.view && typeof this.view.mainShadow != "undefined"){
                return this.view.mainShadow;
            }
            return '';
        }
    },
    methods: {
        detailBackgroundImageUrl:function(){
            if(this.view && typeof this.view.detailBackground != "undefined"){
                return this.view.detailBackground;
            }
            return '';
        },
        init:function (viewData) {
            this.view = viewData;
            this.initAudio();
        },
        getView:function (id) {
            this.$http.get('/resources/view_'+id+'/config.json').then(function(response) {
                this.init(response.body);
            }, function(){});
        },
        getSector:function(index){
            var sect = this.sectors;
            if(typeof sect[index] != 'undefined'){
                return sect[index];
            }
            return null;
        },
        onMouseMove:function (e) {
            this.userInputActivation();
        },
        selectDetailView:function(id){
            if (this.selectedDetail != null) {
                //Init detail view to default state
                this.initDetailView();
                this.$emit('move-out', id);
                //Fade in detail view background
                Velocity(this.$refs.detailScreen,{
                    opacity:1
                }, { duration: 1000,
                    display: "block"
                });
                Velocity(this.$refs.shadowBackground, {
                    opacity: 0,
                }, {duration:300,delay: 100,});
            }
        },
        //Set up default position, visibility and opacity
        initDetailView:function(){
            Velocity(this.$refs.detailScreen,{ opacity: 0 }, { display: "none" });
            this.rotateDetailView(this.selectedDetail, true);
        },
        closeDetailView:function(){

            var parent = this;

            //Fade off detail view background
            Velocity(this.$refs.detailScreen,{
                opacity:0
            }, { duration: 600, 
                display: "none",
                complete:function(){
                    parent.selectedDetail = null;
                }
            });

            this.$emit('stop-sounds');

            this.$emit('move-in');

            Velocity(parent.$refs.shadowBackground, {
                opacity: 1,
            }, {duration:500});

            Velocity(this.$refs.mainBackground,{
                blur:0
            }, { duration: 1000});

            this.userInputActivation();
        },
        getNextDetailViewId:function(){
            if(this.selectedDetail != null){
                if(typeof this.sectors[(this.selectedDetail + 1)] != 'undefined'){
                    return (this.selectedDetail + 1);
                }
            }
            return null;
        },
        getPreviousDetailViewId:function(){
            if(this.selectedDetail != null){
                if(this.selectedDetail > 0 
                    && typeof this.sectors[(this.selectedDetail - 1)] != 'undefined'){
                    
                    return (this.selectedDetail - 1);
                }
            }
            return null;
        },
        renderDetailView:function(index){
            if(this.selectedDetail != null && index == this.selectedDetail)return true;

            var next = this.getNextDetailViewId();
            if(next != null && index == next)return true;

            var prev = this.getPreviousDetailViewId();
            if(prev != null && index == prev)return true;

            return false;
        },
        rotateDetailView:function(targetIndex, imediate = false){
            var angle = targetIndex * this.rotationStep;
            var parent = this;
            var duration = this.config.detailRotationDuration;
            if(imediate)duration = 0;

            Velocity(this.$refs.detailCarousel,"finish");

            this.$emit('carousel-slide-start', this.selectedDetail, targetIndex);

            parent.selectedDetail = targetIndex;

            Velocity(this.$refs.detailCarousel,{
                rotateY:-angle
            }, {
                duration: duration,
                easing: "ease"
            });
        },
        moveNext:function(){
            this.$emit('stop-sounds');
            var index = this.getNextDetailViewId();
            if(index != null) {
                this.rotateDetailView(index);
            }
        },
        movePrev:function(){
            this.$emit('stop-sounds');
            var index = this.getPreviousDetailViewId();
            if(index != null) {
                this.rotateDetailView(index);
            }
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
        },
        getLanguage:function(){
            return this.language;
        },
        setLanguage:function(lang){
            this.language = lang;
        },

        startShakeNext:function(){
            if(this.passiveMode && this.selectedDetail == null){
                this.currentShakeIndex = (this.currentShakeIndex + 1)%this.sectors.length;
                this.$emit('shake', this.currentShakeIndex);
                setTimeout(this.startShakeNext, 500);
            }
        },
        userInputActivation:function(){
            this.passiveMode = false;

            if(this.userInputTimer){
                clearTimeout(this.userInputTimer);
                this.userInputTimer = null;
            }
            var parent = this;
            this.userInputTimer = setTimeout(function(){
                if(this.selectedDetail != null)return;
                parent.passiveMode = true;
                parent.startShakeNext();
            }, this.config.userInputTimeout);
        },
        initAudio:function(){
            if(this.view && typeof this.view.sectors != 'undefined'){
                for(var i=0; i<this.view.sectors.length; i++){
                    if(typeof this.view.sectors[i].audio != "undefined"){
                        for(var a=0; a<this.view.sectors[i].audio.length; a++){
                            var audioFile = this.view.sectors[i].audio[a].fileName;    
                            this.view.sectors[i].audio[a].sound = new Howl({
                                src: [audioFile],
                                preload:true,
                                onload:function(){
                                    this.play();
                                    this.stop();
                                }
                              });
                        }
                    }
                }
            }        
        }
    },
    mounted:function () {
        this.getView(this.$el.attributes.viewid.value);

        document.addEventListener('mousedown', this.onMouseDown);
        document.addEventListener('mouseup', this.onMouseUp);
        document.addEventListener('mousemove', this.onMouseMove);
        document.addEventListener('touchmove', this.onMouseMove);

        this.$on('blur-effect-event', this.blurEffect);
        this.$on('blur-effect-on', this.onBlurEffectOn);
        this.$on('blur-effect-off', this.onBlurEffectOff);
        this.$on('sector-grab', this.onSectorGrabEvent);
        this.$on('sector-release', this.onSectorReleaseEvent);
        this.$on('sector-leave', this.onSectorLeaveEvent);

        this.initDetailView();

        this.rotationStep = 2 * radians_to_degrees(Math.atan((1024/2)/3000));

        this.userInputActivation();

        

    },
    beforeDestroy: function () {
        document.removeEventListener('mousemove', this.onMouseMove);
        document.removeEventListener('click', this.onClick);
    },
});