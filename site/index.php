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

        <div class="main-background" ref="mainBackground" :style="{backgroundImage: 'url(' + backgroundImageUrl + ')'}"></div>

        <sector v-for="(sector, index) in sectors" :key="index" :sector="sector"></sector>
        

        <!-- https://stackoverflow.com/questions/1998866/how-to-visualise-debug-an-imagemap -->
        <!--img src = "resources/view_1/images/bg.png" alt = "HTML Map" border = "0" usemap = "#tutorials"/>

        <map name = "tutorials">
            <area shape="poly" 
                coords = "74,0,113,29,98,72,52,72,38,27"
                href = "/perl/index.htm" alt = "Perl Tutorial"
                target = "_self"
                onMouseOver = "showTutorial('perl')" 
                onMouseOut = "showTutorial('')"/>

            <area shape = "rect" 
                coords = "22,83,126,125"
                href = "/html/index.htm" alt = "HTML Tutorial" 
                target = "_self" 
                onMouseOver = "showTutorial('html')" 
                onMouseOut = "showTutorial('')"/>

            <area shape = "circle" 
                coords = "73,168,32"
                href = "/php/index.htm" alt = "PHP Tutorial"
                target = "_self" 
                onMouseOver = "showTutorial('php')" 
                onMouseOut = "showTutorial('')"/>
        </map-->

    </div>

    <div class="detail-screen" ref="detailScreen">

        <div class="title"></div>
        
        <div class="description"></div>

        <div class="image"></div>

        <div class="sounds"></div>

        <div class="language"></div>

        <div class="navigation"></div>

    </div>

</div>

<script type="text/x-template" id="sector-template">
    <div class="sector" :style="{backgroundImage: 'url(' + backgroundImageUrl + ')'}">
        <div v-if="backgroundImageActiveUrl" class="active" :style="{backgroundImage: 'url(' + backgroundImageActiveUrl + ')'}"></div>
    </div>
</script>

<div class="dev-frame"></div>

<!--script src="js/vendor/velocity123.min.js"></script-->
<script src="js/sector.vue.js"></script>
<script src="js/main.vue.js"></script>
</body>
</html>
