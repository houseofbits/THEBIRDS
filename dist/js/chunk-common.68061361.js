(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-common"],{0:function(t,e){},1:function(t,e,i){t.exports=i("56d7")},"2cc6":function(t,e,i){"use strict";var n=i("5772"),a=i.n(n);a.a},5293:function(t,e,i){},"56d7":function(t,e,i){"use strict";i.r(e);var n=i("2b0e"),a=i("28dd"),s=(i("1e5c"),i("589d"),function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{attrs:{id:"app"}},[i("div",{ref:"backgroundSlider",staticClass:"background-slider",style:t.backgroundSliderStyle}),i("div",{staticClass:"background-v-grad"}),t.detailViewOpen?t._e():i("div",{ref:"sectorFrame",staticClass:"sector-frame",style:t.computeTransform()},t._l(t.sectors,(function(e,n){return i("sector2",{key:n,attrs:{sector:e.main,title:t.title(n),circleUrl:t.circleUrl}})})),1),i("div",{ref:"detailScreen",staticClass:"detail-screen"},[i("div",{staticClass:"detail-3d"},[i("div",{ref:"detailCarousel",staticClass:"detail-frame"},t._l(t.sectors,(function(e,n){return t.renderDetailView(n)?i("detail",{key:n,attrs:{sector:e}}):t._e()})),1)]),i("div",{staticClass:"navigation"},[null!=t.getPreviousDetailViewId()?i("div",{staticClass:"button-prev",on:{click:t.movePrev}}):t._e(),null!=t.getNextDetailViewId()?i("div",{staticClass:"button-next",on:{click:t.moveNext}}):t._e(),i("div",{staticClass:"button-exit",on:{click:t.closeDetailView}})])]),i("div",{staticClass:"navigation"},[i("div",{staticClass:"language"},[i("div",{staticClass:"flag ru",class:{active:"ru"==t.getLanguage()},on:{click:function(e){return t.setLanguage("ru")}}}),i("div",{staticClass:"flag en",class:{active:"en"==t.getLanguage()},on:{click:function(e){return t.setLanguage("en")}}}),i("div",{staticClass:"flag lv",class:{active:"lv"==t.getLanguage()},on:{click:function(e){return t.setLanguage("lv")}}}),t.detailViewOpen?t._e():i("div",{staticClass:"button-prev",on:{click:function(e){return t.autoRotate(10)}}}),t.detailViewOpen?t._e():i("div",{staticClass:"button-next",on:{click:function(e){return t.autoRotate(-10)}}})])])])}),o=[];class l{constructor(t){if(this.height=0,this.width=0,t&&t.indexOf(",")>0){var e=t.split(",");"undefined"!=typeof e[0]&&(this.width=parseFloat(e[0])),"undefined"!=typeof e[1]&&(this.height=parseFloat(e[1]))}}}class r{constructor(t){if(this.x=0,this.y=0,t&&t.indexOf(",")>0){var e=t.split(",");"undefined"!=typeof e[0]&&(this.x=parseFloat(e[0])),"undefined"!=typeof e[1]&&(this.y=parseFloat(e[1]))}}}function c(t){var e=Math.PI;return t*(180/e)}function d(t,e){var i=1e-5,n=i,a=1-i;if(e=Math.max(n,Math.min(a,e)),e<.5){e*=2;var s=Math.pow(t,e);return s}e=2*(e-.5);s=Math.pow(t,1/(1-e));return s}var u=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"sector",style:t.computeTransform()},[i("div",{staticClass:"icon-wrap"},[i("div",{staticClass:"icon",style:t.iconStyle(),on:{click:t.onClick,mousedown:t.onMouseDown,mouseup:t.onMouseLeave,mouseleave:t.onMouseLeave}}),i("div",{staticClass:"icon-shadow",style:t.iconStyleShadow})]),i("div",{staticClass:"title",style:t.titleStyle()},[i("span",{style:t.titleTextStyle()},[t._v(t._s(t.title))])]),i("div",{staticClass:"title-shadow"},[i("span",[t._v(t._s(t.title))])]),i("div",{staticClass:"shadow"}),i("div",{staticClass:"circle",style:t.circleStyle()})])},h=[],f={name:"app",props:["sector","title","circleUrl"],data:function(){return{data:this.sector,iconHeight:1,isSelected:!1}},computed:{iconStyleShadow:function(){return{backgroundImage:"url("+this.data.iconShadow+")",width:this.data.iconTransform[0]+"px",height:this.iconHeight+"px",left:this.data.iconTransform[1]+"px",top:this.data.iconTransform[2]+"px"}}},methods:{circleStyle:function(){let t="";return this.isSelected&&(t="brightness(200%) "),{backgroundImage:"url("+this.circleUrl+")",filter:t+"blur("+this.data.blurCircle+"px)"}},titleTextStyle:function(){return{filter:"blur("+this.data.blurTitle+"px)"}},iconStyle:function(){let t=110*this.data.opacity;return{backgroundImage:"url("+this.data.iconImage+")",width:this.data.iconTransform[0]+"px",height:this.iconHeight+"px",left:this.data.iconTransform[1]+"px",top:this.data.iconTransform[2]+"px",filter:"brightness("+t+"%) blur("+this.data.blurIcon+"px)"}},titleStyle:function(){let t=100*this.data.opacity;return{filter:"brightness("+t+"%)"}},computeTransform:function(){let t=parseFloat(this.$parent._data.angle),e=t+parseFloat(this.data.position[0]),i=15,n=.6,a=Math.min(Math.abs(e/i),1);a=d(a,n);let s=this.data.position[2]-150*a+50,o=1-Math.min(.3,a);return this.isSelected&&(s=this.data.position[2]+10-150*a+50,o=1.4),this.data.opacity=o,a=Math.min(Math.abs(e/i),1),a=d(a,.9),this.data.blurCircle=10*a,this.data.blurIcon=8*a,this.data.blurTitle=4*a,{transform:"translateX(512px) translateY("+this.data.position[1]+"px) translateZ("+s+"px) rotateY("+this.data.position[0]+"deg)",width:this.data.diameter+"px",height:this.data.diameter+"px"}},onClick:function(){this.$parent.$emit("detail-select",this.$vnode.key)},onMouseDown:function(){this.isSelected=!0},onMouseLeave:function(){this.isSelected=!1},onDetailSelect:function(t){this.$vnode.key==t&&(this.isSelected=!0)},onDetailClose:function(t){this.isSelected=!1}},mounted:function(){let t=this,e=new Image;e.src=this.data.iconImage,e.onload=function(){t.iconHeight=t.data.iconTransform[0]*(this.height/this.width)},this.data.blur=0,this.data.blurCircle=0,this.data.blurIcon=0,this.data.blurText=0,this.$parent.$on("detail-select",this.onDetailSelect),this.$parent.$on("detail-close",this.onDetailClose)}},p=f,g=(i("ae25"),i("2877")),v=Object(g["a"])(p,u,h,!1,null,"466bfe2e",null),m=v.exports,w=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"detail-element",style:{backgroundImage:"url("+t.detailBackgroundImageUrl+")"}},[i("div",{staticClass:"detail-content"},[i("div",{staticClass:"image",style:t.imageStyle}),i("div",{staticClass:"title"},[i("span",[t._v(t._s(t.title))])]),i("div",{staticClass:"title-latin"},[i("span",[t._v(t._s(t.titleLatin))])]),i("div",{staticClass:"description",style:t.descriptionStyle},[i("span",[t._v(t._s(t.description))])]),i("div",{staticClass:"sounds"},t._l(t.data.audio,(function(e,n){return i("sound",{key:t.soundComponentKey(n),attrs:{sound:e}})})),1)])])},y=[],x=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"sound",class:{playing:t.isPlaying()},on:{click:function(e){return t.playSound()}}},[i("span",{staticClass:"icon"}),i("span",{staticClass:"title"},[t._v(t._s(t.title))]),t._m(0)])},b=[function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"waveform"},[i("div"),i("div"),i("div"),i("div")])}],D={props:["sound"],template:"#sound-template",data:function(){return{data:this.sound}},computed:{title:function(){var t=this.$parent.$parent.getLanguage();return"undefined"!=this.data.title&&"undefined"!=this.data.title[t]?this.data.title[t]:""}},methods:{playSound:function(){var t=this.isPlaying();this.$parent.$parent.$emit("stop-sounds"),t?this.data.sound.stop():this.data.sound.play(),this.$forceUpdate()},isPlaying:function(){return this.data.sound.playing()},onStopSound:function(){this.data.sound.stop(),this.$forceUpdate()}},mounted:function(){this.$parent.$parent.$on("stop-sounds",this.onStopSound)}},$=D,M=(i("2cc6"),Object(g["a"])($,x,b,!1,null,"f788cb82",null)),S=M.exports,C={props:["sector"],template:"#detail-template",data:function(){return{data:this.sector,imageAspect:1}},components:{sound:S},computed:{imageStyle:function(){let t=this.getImageTransform();return{width:t[0]+"px",height:t[0]*this.imageAspect+"px",top:t[2]+"px",left:t[1]+"px",backgroundImage:"url("+this.getDetailProp("image")+")"}},descriptionStyle:function(){let t=this.getDescriptionTransform();return{left:t[0]+"px",top:t[1]+"px",fontSize:t[2]+"px",lineHeight:1.2*t[2]+"px"}},detailBackgroundImageUrl:function(){return this.$parent.detailBackgroundImageUrl},title:function(){var t=this.$parent.getLanguage();return"undefined"!=typeof this.data.title&&"undefined"!=typeof this.data.title[t]?this.data.title[t]:"No title ["+this.$vnode.key+"]"},titleLatin:function(){return"undefined"!=typeof this.data.titleLatin?this.data.titleLatin:""},description:function(){var t=this.$parent.getLanguage();return"undefined"!=typeof this.data.description&&"undefined"!=typeof this.data.description[t]?"object"==typeof this.data.description[t]&&"undefined"!=typeof this.data.description[t].text?this.data.description[t].text:this.data.description[t]:""},imageUrl:function(){return this.getDetailProp("image")},imageSize:function(){return new l(this.getDetailProp("size"))},imagePosition:function(){return new r(this.getDetailProp("position"))}},methods:{getDescriptionTransform:function(){if("undefined"!=typeof this.data.description){var t=this.$parent.getLanguage();if("undefined"!=typeof this.data.description.transform)return"undefined"!=typeof this.data.description.transform[t]?this.data.description.transform[t]:this.data.description.transform}return[0,0,0]},getImageTransform:function(){if("undefined"!=typeof this.data.detailImage){var t=this.$parent.getLanguage();if("undefined"!=typeof this.data.detailImage.transform)return"undefined"!=typeof this.data.detailImage.transform[t]?this.data.detailImage.transform[t]:this.data.detailImage.transform}return[0,0,0,0]},soundComponentKey:function(t){return 30*this.$vnode.key+t},getDetailProp:function(t){return this.data&&"undefined"!=typeof this.data.detailImage&&"undefined"!=typeof this.data.detailImage[t]?this.data.detailImage[t]:""},onCarouselSlideStart:function(t,e){t==this.$vnode.key&&Velocity(this.$el,{blur:10},{duration:100}),e==this.$vnode.key&&(Velocity(this.$el,{blur:10},0),Velocity(this.$el,{blur:0},{duration:700}))},calculateAngle:function(t){var e=c(Math.atan(512/3e3));return 2*e*t}},mounted:function(){let t=this,e=new Image;e.src=this.getDetailProp("image"),e.onload=function(){t.imageAspect=this.height/this.width},this.$parent.$on("carousel-slide-start",this.onCarouselSlideStart),Velocity(this.$el,{rotateY:this.calculateAngle(this.$vnode.key)},0)}},k=C,V=(i("e5d1"),Object(g["a"])(k,w,y,!1,null,"121df730",null)),I=V.exports,_={name:"app",data:function(){return{view:null,angle:0,prevx:null,language:"lv",selectedDetail:null,detailViewOpen:!1,backgroundSliderPos:100,angleMinMax:[0,0],isAutoRotating:!1,rotationStep:0,config:{userInputTimeout:5e3,detailRotationDuration:650}}},components:{sector2:m,detail:I},computed:{isDetailViewVisible:function(){return null!==this.selectedDetail},circleUrl:function(){return this.view?this.view.circleBackground:""},sectors:function(){return!(!this.view||"undefined"===typeof this.view.sectors)&&this.view.sectors},backgroundSliderStyle:function(){return this.view?{backgroundImage:"url("+this.view.mainBackground+")",left:this.backgroundSliderPos+"px"}:{}},detailBackgroundImageUrl:function(){return this.view&&"undefined"!=typeof this.view.detailBackground?this.view.detailBackground:""}},methods:{init:function(){let t=null;if("undefined"!==typeof window.location.search&&window.location.search.length>0){let e=window.location.search.match(/\?id=(\d+)/);"undefined"!==typeof e[1]&&(t=e[1])}else{let e=window.location.pathname.split("/");t=parseInt(e[1])}null!=t&&this.$http.get("/resources/view_"+t+"/config.json").then((function(t){this.view=t.body,this.calculateAutoAngles(),this.calculateMinMaxAngle(),this.initAudio()}),(function(){}))},calculateAutoAngles:function(){let t=-10,e=-5,i=Math.ceil(this.view.sectors.length/2);for(let n=0;n<this.view.sectors.length;n++)this.view.sectors[n].main.position=[0,0,0],n<i?(this.view.sectors[n].main.position[0]=t,this.view.sectors[n].main.position[1]=100,t+=10):(this.view.sectors[n].main.position[0]=e,this.view.sectors[n].main.position[1]=330,e+=10),this.view.sectors[n].main.position[2]=50},calculateMinMaxAngle:function(){this.angleMinMax[0]=360,this.angleMinMax[1]=-360;for(let t=0;t<this.view.sectors.length;t++){let e=this.view.sectors[t];e.main.position[0]<this.angleMinMax[0]&&(this.angleMinMax[0]=e.main.position[0]),e.main.position[0]>this.angleMinMax[1]&&(this.angleMinMax[1]=e.main.position[0])}this.angleMinMax[0]+=4,this.angleMinMax[1]-=4},initDetailView:function(){"undefined"!=typeof this.$refs.detailScreen&&(Velocity(this.$refs.detailScreen,{opacity:0},{display:"none"}),Velocity(this.$refs.detailScreen,"finish"),this.rotateDetailView(this.selectedDetail,!0))},renderDetailView:function(t){if(null==this.selectedDetail)return!1;if(null!=this.selectedDetail&&t==this.selectedDetail)return!0;var e=this.getNextDetailViewId();if(null!=e&&t==e)return!0;var i=this.getPreviousDetailViewId();return null!=i&&t==i},closeDetailView:function(){var t=this;this.$emit("detail-close",this.selectedDetail),this.$emit("stop-sounds"),this.detailViewOpen=!1,Velocity(this.$refs.detailScreen,{opacity:0},{duration:600,display:"none",complete:function(){t.selectedDetail=null,t.detailViewOpen=!1}})},selectDetailView:function(t){if(this.selectedDetail=t,null!=this.selectedDetail){let t=this;this.initDetailView(),Velocity(this.$refs.detailScreen,{opacity:1},{duration:1e3,display:"block",complete:function(){t.detailViewOpen=!0}})}},getNextDetailViewId:function(){return null!=this.selectedDetail&&"undefined"!=typeof this.sectors[this.selectedDetail+1]?this.selectedDetail+1:null},getPreviousDetailViewId:function(){return null!=this.selectedDetail&&this.selectedDetail>0&&"undefined"!=typeof this.sectors[this.selectedDetail-1]?this.selectedDetail-1:null},rotateDetailView:function(t,e=!1){var i=t*this.rotationStep,n=this,a=this.config.detailRotationDuration;e&&(a=0),Velocity(this.$refs.detailCarousel,"finish"),n.selectedDetail=t,Velocity(this.$refs.detailCarousel,{rotateY:-i},{duration:a,easing:"ease"})},moveNext:function(){this.$emit("stop-sounds");var t=this.getNextDetailViewId();null!=t&&this.rotateDetailView(t)},movePrev:function(){this.$emit("stop-sounds");var t=this.getPreviousDetailViewId();null!=t&&this.rotateDetailView(t)},initAudio:function(){var t=this;if(this.view&&"undefined"!=typeof this.view.sectors)for(var e=0;e<this.view.sectors.length;e++)if("undefined"!=typeof this.view.sectors[e].audio)for(var i=0;i<this.view.sectors[e].audio.length;i++){var n=this.view.sectors[e].audio[i].fileName;this.view.sectors[e].audio[i].sound=new Howl({src:[n],preload:!0,onload:function(){this.play(),this.stop()},onend:function(){t.$emit("stop-sounds")}})}},title:function(t){if(this.view&&"undefined"!==typeof this.view.sectors){let e=this.getLanguage();if("undefined"!==typeof this.view.sectors[t].title&&"undefined"!==typeof this.view.sectors[t].title[e])return this.view.sectors[t].title[e]}return"NO TITLE"},getLanguage:function(){return this.language},setLanguage:function(t){this.language=t},computeTransform:function(){return{transform:"rotateY("+this.angle+"deg)"}},onDrag:function(t){if(null!==this.selectedDetail)return;if(null==this.prevx)return void(this.prevx=t.x);let e=t.x-this.prevx;t.buttons>0&&(this.angle+=.03*e,-this.angle<this.angleMinMax[0]&&(this.angle=-this.angleMinMax[0]),-this.angle>this.angleMinMax[1]&&(this.angle=-this.angleMinMax[1]));let i=10*this.angle;this.backgroundSliderPos=i-100,this.prevx=t.x},autoRotate:function(t){if(null!==this.selectedDetail||this.isAutoRotating)return;let e=this,i=this.angle;this.isAutoRotating=!0,Velocity(this.$el,{vueRotate:t},{duration:500,progress:function(n,a,s,o,l){e.angle=i+t*a,-e.angle<e.angleMinMax[0]&&(e.angle=-e.angleMinMax[0]),-e.angle>e.angleMinMax[1]&&(e.angle=-e.angleMinMax[1]);let r=10*e.angle;e.backgroundSliderPos=r-100,e.$forceUpdate()},complete:function(){e.isAutoRotating=!1}})}},mounted:function(){this.init(),document.addEventListener("mousemove",this.onDrag),this.initDetailView(),this.rotationStep=2*c(Math.atan(512/3e3)),this.$on("detail-select",this.selectDetailView)}},L=_,T=(i("b28b"),Object(g["a"])(L,s,o,!1,null,null,null)),P=T.exports;n["a"].use(a["a"]),new n["a"]({render:t=>t(P)}).$mount("#app")},5772:function(t,e,i){},ae25:function(t,e,i){"use strict";var n=i("5293"),a=i.n(n);a.a},b28b:function(t,e,i){"use strict";var n=i("b6d9"),a=i.n(n);a.a},b6d9:function(t,e,i){},dc77:function(t,e,i){},e5d1:function(t,e,i){"use strict";var n=i("dc77"),a=i.n(n);a.a}}]);
//# sourceMappingURL=chunk-common.68061361.js.map