<?php
session_name('user');
@session_start();

//echo "<p><a>PHP код</a></p>";
//phpinfo();
//echo system("ls /usr/share/locale");
?>

<!DOCTYPE html>

<html>

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="author" content="Dmitry Sokolov Дмитрий Соколов">
    <meta name="description" content="www web creation design jTrace создание сайт веб дизайн">
    <meta name="keywords" content="www html javascript php mysql web jTrace creation design">
    <link rel="stylesheet" type="text/css" href="jtrace/jtrace.css">
    <link rel="stylesheet" type="text/css" href="main/main.css">
    <link rel="shortcut icon" href="/image/logo/favicon.ico" type="image/vnd.microsoft.icon">
    <link rel="icon" href="/image/logo/favicon.ico" type="image/vnd.microsoft.icon">
    <title>Дмитрий Соколов</title>
    <script type="text/javascript">document.getElementsByTagName('title')[0].title = document.getElementsByTagName('title')[0].text</script>
</head>

<body>
<script type="text/javascript" src="lib/jquery-1.5.2.min.js"></script>
<script type="text/javascript" src="jtrace/jtrace.js"></script>
<script type="text/javascript" src="lib/useful.js"></script>
<script type="text/javascript" src="lib/jmenu.js"></script>
<script type="text/javascript" src="lib/gbook.js"></script>
<script type="text/javascript" src="lib/session.js"></script>

<script type="text/javascript">
    pageStatus = {}; pageStatus.menuReady = {general: $.Deferred(), user: $.Deferred()}
    trace = jTrace
    jTrace().tr = jTrace().trace; jTrace().com = jTrace().comment
    jTrace().config({lang: 'rus', show: 'off', wakeup: 'off'/*, mode: 'debug', scroll: 'off', height: 'auto'*/})
    ShowWarning('', 0, '', 0, 0, 'black', 'white')
</script>

<script type="text/javascript" src="pages/citation.js"></script>
<script type="text/javascript" src="main/top.js"></script>
<script type="text/javascript" src="main/box.js"></script>
<script type="text/javascript" src="main/bottom.js"></script>

<script type="text/javascript">
    LoginInit()
    $.when(pageStatus.menuReady.general)
        .done(function(){$.when(LoginCheck('first', pageStatus.menuReady.user))
            .done(function(){$.when(pageStatus.menuReady.user).done(function(){jvMenu.ready('generalmenu&main', 'hash|1')})})
        })
    $(document).ready(trace(jvMenu, BrowserHistory).comment('Menu', 'History'))
</script>

</body>
</html>