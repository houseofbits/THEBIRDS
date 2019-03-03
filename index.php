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
    <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/vue-resource@1.5.1"></script>
    <script src="js/howler.js"></script>
</head>
<body>

<div id="mainApp" viewid="<?=(isset($_GET['īd'])?intval($_GET['īd']):1)?>">

    <div v-for="(sector, index) in view.sectors">



    </div>


</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/velocity/1.2.3/velocity.min.js"></script>
<script src="js/main.vue.js"></script>
</body>
</html>
