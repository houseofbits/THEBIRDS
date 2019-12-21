<!DOCTYPE html>
<html lang="en">
<head>
    <title>The Birds</title>
    <meta name="revisit-after" content="20 days" />
    <meta http-equiv="content-type" content="text/html; charset=utf-8" />
    <meta name="robots" content="no-index, no-follow" />
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="/css/style.css" type="text/css" />
    <script src="js/vendor/velocity123.min.js"></script>
    <script src="js/vendor/vue.js"></script>
    <script src="js/vendor/vue-resource.js"></script>
    <script src="js/vendor/howler.js"></script>
</head>
<body>

<div id="appplication" viewid="<?=(isset($_GET['id'])?intval($_GET['id']):1)?>">

    <div class="main-screen" ref="mainScreen">

        <div class="main-background" ref="mainBackground" :style="{backgroundImage: 'url(' + backgroundImageUrl + ')'}">
            <div class="shadow-background" ref="shadowBackground" :style="{backgroundImage: 'url(' + shadowImageUrl + ')'}"></div>
        </div>

        <sector v-for="(sector, index) in sectors" :key="index" :sector="sector"></sector>

    </div>

    <div class="main-screen">

        <clipregion v-for="(sector, index) in sectors" :key="index" :sector="sector"></clipregion>

    </div>

    <div class="detail-screen" ref="detailScreen" :style="{backgroundImage: 'url(' + detailBackgroundImageUrl + ')'}">

        <div class="detail-3d">
            <div class="detail-frame" ref="detailCarousel">
                <detail v-for="(sector, index) in sectors" v-if="renderDetailView(index)" :key="index" :sector="sector"></detail>
            </div>
        </div>

        <div class="language"></div>

        <div class="navigation">
            <a href="#" class="dev-button" v-on:click="movePrev">Prev</a>
            <a href="#" class="dev-button" v-on:click="closeDetailView">Close</a>
            <a href="#" class="dev-button" v-on:click="moveNext">Next</a>
        </div>

    </div>

    <!--devsector v-for="(sector, index) in sectors" :key="index" :sector="sector" v-if="index==0"></devsector-->

</div>

<script type="text/x-template" id="sector-template">
    <div class="sector" :style="{backgroundImage: 'url(' + backgroundImageUrl + ')'}">
        <div v-if="backgroundImageActiveUrl" class="active" :style="{backgroundImage: 'url(' + backgroundImageActiveUrl + ')'}"></div>
    </div>
</script>
<script type="text/x-template" id="dev-sector-template">
    <div class="dev-sector" :style="{backgroundImage: 'url(' + backgroundImageUrl + ')', width:width+'px', height:height+'px'}">
        <svg :width="width" :height="height" style="position:absolute;">
            <polygon v-if="polygonPoints" :points="polygonPoints" class="polygon"/>
        </svg>
    </div>
</script>
<script type="text/x-template" id="clipregion-template">
    <div class="clip-region">
        <svg :width="width" :height="height" style="position:absolute;">
            <polygon v-if="polygonPoints" :points="polygonPoints" class="polygon"
            v-on:mousedown="onGrab"
            v-on:mouseup="onRelease"
            v-on:mouseover="onGrab"
            v-on:mouseleave="onLeave"
            v-on:touchstart="onGrab"
            v-on:touchend="onRelease"/>
        </svg>
    </div>
</script>
<script type="text/x-template" id="detail-template">
    <div class="detail-element">
        <div class="title">
            <span class="gradient-text-shadow" :data-text="title"></span>
        </div>

        <div class="description">{{description}}</div>

        <div class="image" :style="{
            width:width + 'px',
            height:height + 'px',            
            top:positionY + 'px',            
            left:positionX + 'px',
            backgroundImage: 'url(' + imageUrl + ')'                        
        }"></div>

        <div class="sounds"></div>
    </div>
</script>

<div class="dev-frame"></div>

<script src="js/sector.vue.js"></script>
<script src="js/detail.vue.js"></script>
<script src="js/clipregion.vue.js"></script>
<script src="js/devsector.vue.js"></script>
<script src="js/main.vue.js"></script>
</body>
</html>
