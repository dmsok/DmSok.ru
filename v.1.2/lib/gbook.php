<?php

function GBName(){
    $gbname = $_POST['name'];
    //if (isset($_POST['gbdir'])) {$gbname = $_SERVER['DOCUMENT_ROOT'] . "/" . $_POST['gbdir'] . "/" . $gbname;}
    //else {$gbname = $_SERVER['DOCUMENT_ROOT'] . "/data/gbook/" . $gbname;}
    return $gbname;
}

function GBUser(){
    $ret = array();
    $ret['user'] = "";
    if (isset($_SESSION['user'])) {$ret['user'] = $_SESSION['user'];}
    $ret['gbuser'] = "";
    if (isset($_SESSION['save_gbuser'])) {$ret['gbuser'] = $_SESSION['save_gbuser'];}
    $ret['gbsite'] = "";
    if (isset($_SESSION['save_gbsite'])) {$ret['gbsite'] = $_SESSION['save_gbsite'];}
    return $ret;
}

function GBCheckAccess(){
    $gbname = GBName();
    if (file_exists($gbname) && ! is_writable($gbname)){$ret = 0;}
    else {$ret = 1;}
    return $ret;
}

function GBCheck(){
    $ret = "{\"open\": \"" . GBCheckAccess() . "\"";
    $user = GBUser();
    $ret .= ", \"user\": \"" . $user['user'] . "\"";
    $ret .= ", \"gbuser\": \"" . $user['gbuser'] . "\"";
    $ret .= ", \"gbsite\": \"" . $user['gbsite'] . "\"";
    $ret .= "}";
    echo $ret;
}

function GBAccessToggle(){
    $gbname = GBName();
    if     ($_POST['access'] == 'on')  {chmod($gbname, 0666);}
    elseif ($_POST['access'] == 'off') {chmod($gbname, 0444);}
}

function GBDeleteMessage(){
    $gbname = GBName();
    $gbid = $_POST['id'];
    $gblock = false;
    $gblines = file($gbname);
    $gbkey = array_search("<div id=\"$gbid\">\n", $gblines);
    for ($i = $gbkey; $i < $gbkey + 5; $i++){unset($gblines[$i]);}
    if (! GBCheckAccess()){$_POST['access'] = 'on'; GBAccessToggle(); $gblock = true;}
    $gbook = fopen($gbname, "a+"); ftruncate($gbook, 0); fwrite($gbook, implode("", $gblines)); fclose($gbook);
    if ($gblock){$_POST['access'] = 'off'; GBAccessToggle();}
}

function GBAddMessage(){
    $gberror = false; $gbcommand = "";
    $gbdate = strftime("%d %B %Y, %A, %H:%M:%S");
    $gbtime = time();
    $gbip = $_SERVER['REMOTE_ADDR'];
    $gbserver = $_SERVER['SERVER_NAME'];

    $gbname = GBName();
    $gbuser = strip_tags($_POST['user']);

    if (file_exists('session.php')) { // проверка легальности имени
        //$GLOBALS['gbuserfake'] = false;
        //if (! isset($_SESSION['user'])) {$_SESSION['user'] = $gbuser; $GLOBALS['gbuserfake'] = true;}
        if (isset($_POST['strong']) && $_POST['strong'] == "true") {$gbstrong = true;} else {$gbstrong = false;}
        if (! isset($_SESSION['user']) && $gbstrong) {die("Чтобы оставить сообщение, необходимо войти в систему или зарегистрироваться!");}
        ob_start();
        include 'session.php';
        $tt = CheckUserS(); $ttt = "";
        if ($tt === true) {}
        elseif (strpos($tt, "Error") === 0)  {$ttt = $tt;}
        elseif ($tt === "NOUSER" && ! $gbstrong) {if (ReservedUsers($gbuser)) {$ttt = "К сожалению, это имя зарезервировано!";}}
        elseif ($tt === "NAME") {$ttt = "Ошибка проверки имени! Попробуйте еще раз!";}
        elseif ($tt === "SID")  {$ttt = "К сожалению, это имя уже используется!";}
        elseif ($tt === "PHP")  {$ttt = "Отказано в доступе! Обратитесь к администратору сайта!#reload";}
        elseif ($tt === "TIME") {$gbcommand = "Сообщение отправлено!<br>Но Ваша сессия устарела! Войдите в систему заново!#reload";}
        elseif ($tt === "SQL")  {$ttt = "Ошибка выполнения запроса! Попробуйте еще раз!#reload";}
        else                    {$ttt = "Неизвестная ошибка! Попробуйте еще раз!";}
        ob_end_clean();
        if ($ttt) {die($ttt);}
        if ($gbstrong) {$gbuser = $_SESSION['user'];}
    }

    $gbsite = strip_tags($_POST['site']);
    //if (stripos($gbsite, '@') !== false){$gbsite = 'mailto:' . $gbsite;}
    if ($gbsite && stripos($gbsite, 'http://') !== 0){$gbsite = 'http://' . $gbsite;}
    $gbmessage = strip_tags($_POST['message'], '<a><img><b><i><s><u><em><p><pre><div><span><sub><sup><h3><h4><h5><h6><code><ul><ol><li><dl><dt><dd><abbr><blockquote>');
    $gbmessage = preg_replace("/\n/", "<br>", $gbmessage);

    //$gbmail = substr(strip_tags($_POST['message']), 0, 68);
    $gbmail = strip_tags($_POST['message']);
    $gbmail = wordwrap($gbmail, 70);
    if (isset($_SESSION['gb']) && ! $_SESSION['gb']) {$gbmailto = "";}
    elseif (isset($_POST['mailto'])) {$gbmailto = $_POST['mailto'];}
    else {$gbmailto = "";}

    if (isset($_POST['revers']) && $_POST['revers'] == "true") {$revers = true;}
    else {$revers = false;}

    $gbwrite  = "<div id=\"gbm-$gbtime\">\n"; // добавил gbm- 01.12.2011
    if ($revers){
    $gbwrite .= "    <hr>\n";
    }
    $gbwrite .= "    <div>" . $gbmessage . "</div>\n";
    $gbwrite .= "    <div>";
    if ($gbsite){
    $gbwrite .= "<a href=\"" . $gbsite . "\" target=\"_blank\"><span>" . $gbuser . "</span></a><br>";
    }
    else {
    $gbwrite .= "<span>" . $gbuser . "</span><br>";
    }
    $gbwrite .= "<span>" . $gbdate . " - IP: " . $gbip . "</span>";
    $gbwrite .= "</div>\n";
    if (! $revers){
    $gbwrite .= "    <hr>\n";
    }
    $gbwrite .= "</div>\n";

    if (! GBCheckAccess()){die("Книга временно закрыта!");}
    if (! file_exists($gbname)){
        $gbdate = strftime("%d.%m.%Y %H:%M:%S");
        $gbook = fopen($gbname, "x+");
        if ($revers) {fwrite($gbook, "<hr>\n<!-- $gbdate -->\n");}
        else         {fwrite($gbook, "<!-- $gbdate -->\n<hr>\n");}
        fclose($gbook);
    }

    if (is_writable($gbname)){
        $gbook = fopen($gbname, "a+") or exit("Error (2): Ошибка открытия файла!");
        if ($revers) {
            $gbsave = fread($gbook, filesize($gbname)) ?: $gberror = "Error (3): Ошибка чтения файла!";
            if (! $gberror){
                if (! (ftruncate($gbook, 0) && fwrite($gbook, $gbwrite) && fwrite($gbook, $gbsave))){$gberror = "Error (4): Ошибка записи в файл!";}
            }
        }
        else {if (! fwrite($gbook, $gbwrite)){$gberror = "Error (5): Ошибка записи в файл!";}}
        fclose($gbook);
    }
    else {$gberror = "Error (1): Файл книги занят или не найден!";}

    if ($gberror){echo $gberror;}
    else {
        $_SESSION['save_gbuser'] = $gbuser;
        $_SESSION['save_gbsite'] = $gbsite;
        if ($gbserver != 'localhost' && $gbmailto){mail($gbmailto, "Сообщение на $gbserver - '$gbname'", "$gbmail", "From: $gbuser guestbook@$gbserver");}
        if ($gbcommand) {echo $gbcommand;} else {echo "Success";}
    }
}

setlocale(LC_ALL, "ru_RU.UTF-8");
session_name('user');
session_start();

if (isset($_POST['action'])){
    if ($_POST['action'] === "gbcheck") {GBCheck();}
    elseif ($_POST['action'] === "gbaccesstoggle") {GBAccessToggle();}
    elseif ($_POST['action'] === "gbdeletemessage") {GBDeleteMessage();}
}
else {GBAddMessage();}

//echo "Success";

?>
