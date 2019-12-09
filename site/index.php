<?php

// 1024 x 768 px
/*
View 1

1) Brūnais ibiss
2) Karošknābis
3) Nakts gārnis
4) Mazais dumpis
5) Mazais baltais gārnis
6) Lielais baltais gārnis
7) Lielais dumpis
8) Zivju gārnis
9) Baltais stārķis
10) Melnais stārķis





*/
?>
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
    <script src="js/vendor/vue.js"></script>
    <script src="js/vendor/vue-resource.js"></script>
    <script src="js/vendor/howler.js"></script>
</head>
<body>

<div id="mainApp" viewid="<?=(isset($_GET['īd'])?intval($_GET['īd']):1)?>">

    <div class="mainBackground" ref="mainBackground"></div>

    <div class="mainBackgroundBlurred" ref="mainBackgroundBlurred"></div>

    <sector v-for="(sector, index) in sectors" :key="index"></sector>

    <div class="mainScreenOverlay"></div>

</div>

<script type="text/x-template" id="sector-template">
    <div class="sector" v-on:mouseenter="animIn" v-on:mouseleave="animOff" v-on:mousemove="updateMove">
        <div id="div1"></div>
        <div id="div2"></div>
    </div>
</script>


<script src="js/vendor/velocity.min.js"></script>
<script src="js/sector.vue.js"></script>
<script src="js/main.vue.js"></script>
</body>
</html>
