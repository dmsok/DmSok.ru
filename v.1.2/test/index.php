<!DOCTYPE html>
<html>

<head>
    <meta http-equiv="content-type" content="text/html; charset=utf-8">
    <meta name="author" content="Dmitry Sokolov">
    <link rel="stylesheet" type="text/css" href="../jtrace/jtrace.css">
    <title>Test main</title>
</head>

<body>
<script type="text/javascript" src="../lib/jquery-1.5.2.min.js"></script>
<script type="text/javascript" src="../lib/useful.js"></script>
<script type="text/javascript" src="../lib/session.js"></script>
<!--<script type="text/javascript" src="../jtrace/jtrace.js"></script>
<script type="text/javascript">
    trace = jTrace
    //jTrace().config({icondir: '../jtrace/'})
    //alert(window.location.pathname)
</script>-->

<div id="login" align="right"></div>
<script type="text/javascript">
LoginInit(); LoginCheck('first');
</script>

<h3>/test/index.php</h3>
<a href="/" target=""><h4>Главная</h4></a>

<script type="text/javascript">
//$('body').insButton({text: 'Count download', click: function(e){SetLogCount()}})
</script>

<br>
<?php
//$tt = flock(fopen("deltest.1", "r+"), LOCK_EX);
//$tt = system("chflags sunlink deltest.1");
//$tt = system("chflags 0 ../tt/*");
//$tt = system("chflags uunlink ../data/gbook/*");
//echo "lock " . $tt;
//echo "<br>";
//$ttt = system("ls -lo ../data/gbook/*");
//echo "see " . $ttt
?>

</body>
</html>