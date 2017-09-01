<?php

function ReservedUsers($n){
    global $hostset; $ret = false;
    foreach ($hostset['reservedusers'] as $u) {if (mb_strtolower($u, "UTF-8") == mb_strtolower($n, "UTF-8")) {$ret = true;}}
    return $ret;
}

function HTMLHeader(){
    echo "<!DOCTYPE html>\n";
    echo "<html>\n";
    echo "<head>\n</head>\n";
    echo "<body>\n";
}

function HTMLFooter(){
    echo "\n</body>\n";
    echo "</html>\n";
}

function GoToHRef(){
    if (isset($_POST['gotohref'])){$href = $_POST['gotohref'];}
    else {$href = $_POST['page'];}
    //if (stripos($href, "http://")  !== 0){$href = "http://"  . $_SERVER['HTTP_HOST'] . $href;}
    //if (stripos($href, "https://") !== 0){$href = "https://" . $_SERVER['HTTP_HOST'] . $href;}
    //echo "<script type=\"text/javascript\">window.location.replace(\"$href\")</script>";
    //header("Location: newsru.com");
    header("Location: $href");
}

function RetIn($name, $php, $js){
    if ($GLOBALS['requestTarget'] === 'login&reload'){return ;}
    echo "{\"key\": \"in\", \"user\": \"$name\", \"php\": \"$php\", \"js\": \"$js\"}";
}

function RetOut($action){
    if (isset($_SESSION['login_fail_name'])){$fname = $_SESSION['login_fail_name']; $msg = $_SESSION['login_fail_message']; unset($_SESSION['login_fail_name']); unset($_SESSION['login_fail_message']);}
    else {$fname = "";$msg = "";}
    echo "{\"key\": \"out\", \"action\": \"$action\", \"text\": \"$msg\", \"login_name\": \"$fname\"}";
}

function RetMsg($msg){
    if ($GLOBALS['requestTarget'] === 'login&reload'){$_SESSION['login_fail_name'] = $_POST['lgname']; $_SESSION['login_fail_message'] = $msg; return ;}
    echo "{\"key\": \"message\", \"text\": \"$msg\"}";
}

function CryptPass($pass){
    return substr(crypt($pass, '$2a$07$' . substr(crypt($pass, '$2a$05$' . preg_replace('/[^.\/0-9A-Za-z]/', '.', $GLOBALS['hostset']['info'])), -22)), -32);
}

function SetUserDetails(){
    //if (CheckUserS() !== true) {return ;}
    if (! is_array($user = CheckDetailsS())) {return ;}
    if (isset($_POST['name']) && $_POST['name']) {$name = strip_tags($_POST['name']);}
    else {echo "Отсутствует имя пользователя!\n"; return ;}
    if (! $self = $name === $user['name']) {if (CheckRightsT($user, "sud;") !== true) {echo "У Вас нет прав для выполнения данной операции!\n"; return ;}}
    $host = $_SERVER['SERVER_NAME'];
    $sud = "";

    if (isset($_POST['newpass'])) {
        $sud .= "pass='" . CryptPass(strip_tags($_POST['newpass'])) . "'"; // вместо strip_tags - проверку на допустимые символы
        echo "$name: set password: " . $sud . "\n";
    }

    $update = @mysql_query("UPDATE users SET " . $sud . " WHERE BINARY name='" . $name . "' && host='" . $host . "'");
    echo mysql_info() . "\n";
}

function UserSet($user){
    $_SESSION['user'] = $user['name'];
    if ($user['remember'] == 1) {$_SESSION['remember'] = false;}
    if ($user['count'] == 1) {$_SESSION['visitcount'] = false;}
    if ($user['log'] == 1) {$_SESSION['visitlog'] = false;}
    if ($user['gb'] == 1) {$_SESSION['gb'] = false;}
    if ($user['timevisit']) {$_SESSION['timevisit'] = $user['timevisit'];}
}

function VisitLog($action){
    if (! isset($_POST['page'])) {return false;}
    if (isset($_SESSION['visitlog']) && ! $_SESSION['visitlog']) {return false;}
    $lgfile = $_SERVER['SERVER_NAME'] . $_POST['page'];
    $lgfile = str_replace("/", "_", $lgfile);
    $lgfile = str_replace(".", "_", $lgfile);
    $lgfile = $lgfile . ".php";
    if (isset($_POST['logdir'])) {$lgfile = $_SERVER['DOCUMENT_ROOT'] . "/" . $_POST['logdir'] . "/" . $lgfile;}
    else {$lgfile = $_SERVER['DOCUMENT_ROOT'] . "/data/log/" . $lgfile;}
    if (is_writable($lgfile)){
        $lgdate = strftime("%d-%m-%Y %H:%M:%S");
        $lgip = $_SERVER['REMOTE_ADDR'];
        if (isset($_SESSION['user'])) {$lguser = $_SESSION['user'];}
        else {$lguser = "";}

        $lgwrite  = "<tr>";
        $lgwrite .= "<td>" . $lgdate . "</td>";
        $lgwrite .= "<td>" . $lgip . "</td>";
        $lgwrite .= "<td>" . $lguser . "</td>";
        $lgwrite .= "<td>" . $action . "</td>";
        $lgwrite .= "</tr>\n";

        $lgbook = fopen($lgfile, "a+");
        $lgsave = fread($lgbook, filesize($lgfile));
        $lgsave = str_replace("<table border=\"1\">", "", $lgsave);
        $lgsave = str_replace("<tbody align=\"center\">\n", "", $lgsave);
        $lgsave = str_replace("</tbody>", "", $lgsave);
        $lgsave = str_replace("</table>", "", $lgsave);
        ftruncate($lgbook, 0);
        fwrite($lgbook, "<table border=\"1\"><tbody align=\"center\">\n");
        fwrite($lgbook, $lgwrite);
        fwrite($lgbook, $lgsave);
        fwrite($lgbook, "</tbody></table>");
        fclose($lgbook);
    }
}

function VisitCount(/*$action*/){
    $action = "Visit"; $need = true;
    global $timecor, $hostset;

    if (isset($_SESSION['timevisit'])) {$timevisit = $_SESSION['timevisit'];}
    elseif (isset($_POST['timevisit'])) {$timevisit = $_POST['timevisit'];}
    else {$timevisit = $hostset['timevisit'];} // Продолжительность посещения по умолчанию; по истечении считается за новый визит

    $currpage = str_replace("/", "_", $_POST['page']);
    $currpage = str_replace(".", "_", $currpage);

    if (isset($_SESSION['stamp_visittime' . $currpage]) && abs(time() + $timecor - $_SESSION['stamp_visittime' . $currpage]) < $timevisit){$need = false;}
    $_SESSION['stamp_visittime'] = time() + $timecor;
    $_SESSION['stamp_visittime' . $currpage] = time() + $timecor;
    if ($need){
        VisitLog($action);
        if (! isset($_POST['page'])) {return false;}
        if (isset($_SESSION['visitcount']) && ! $_SESSION['visitcount']) {return false;}
        @mysql_query("UPDATE count SET visit=visit+1 WHERE page='" . $_SERVER['SERVER_NAME'] . $_POST['page'] . "' && object IS NULL");
    }
}

function GetCount(){
    if (! isset($_POST['page'])) {return false;}
    $ret = "";
    $lgresult = @mysql_query("SELECT * FROM count WHERE page='" . $_SERVER['SERVER_NAME'] . $_POST['page'] . "'");
    while ($lgrow = @mysql_fetch_array($lgresult)){$ret .= $lgrow['object'] . " Посещений: " . $lgrow['visit'] . " Скачиваний: " . $lgrow['download'] . "<br>";}
    echo $ret;
}

function SetCount(){
    if (! isset($_POST['page'])) {return false;}
    $lgquery = "page='" . $_SERVER['SERVER_NAME'] . $_POST['page'] . "'";
    if (isset($_POST['object']) && $_POST['object']) {$lgquery .= " && object='" . $_POST['object'] . "'";}
    else {$lgquery .= " && object IS NULL";}
    @mysql_query("UPDATE count SET " . $_POST['count'] . "=" . $_POST['count'] . "+1 WHERE " . $lgquery);
}

function CodePHP($php){
    clearstatcache();
    if (! ($php && file_exists($php))) {return true;}
    ob_start();
    if (include $php) {$php = ob_get_contents();} // даже пустое echo вернет true - важно для json! доступ разрешается/запрещается return'ом
    else {$php = false;}
    ob_end_clean();
    return $php;
}

function CodeJS($js){ // не используется
    if ($js && file_exists($js)) {$js = @fread(@fopen($js, "r"), filesize($js));}
    else {$js = "";}
    return $js;
}

function Login(){
    VisitCount();
    if (isset($_POST['lgname'])) {$lgname = strip_tags($_POST['lgname']);}
    else {$lgname = "";}
    if (isset($_POST['lgpass'])) {$lgpass = strip_tags($_POST['lgpass']);}
    else {$lgpass = "";}

    $lgip = $_SERVER['REMOTE_ADDR'];
    $lghost = $_SERVER['SERVER_NAME'];

    $lgresult = @mysql_query("SELECT * FROM users WHERE BINARY name='" . $lgname . "' && host='" . $lghost . "'");
    if ($lgresult){
        $lgresult = @mysql_fetch_array($lgresult);
        if ($lgresult['pass'] === CryptPass($lgpass)) {
        //if ($lgresult['pass'] === $lgpass) {
            $lgphp = CodePHP($lgresult['php']);
            $lgjs = $lgresult['js'];
            if ($lgphp){
                $lgupdate = @mysql_query("UPDATE users SET SID='" . session_id() . "', visit=visit+1, ip='" . $lgip . "' WHERE BINARY name='" . $lgname . "' && host='" . $lghost . "'");
                if ($lgupdate) {
                    UserSet($lgresult);
                    VisitLog("LogIn");
                    RetIn($lgname, $lgphp, $lgjs);
                }
                else {RetMsg("Error (5): Ошибка выполнения запроса!");}
            }
            else {RetMsg("Error (4): Отказано в доступе! Обратитесь к администратору сайта!");}
        }
        else {RetMsg("Неверное имя пользователя или пароль!");}
    }
    else {RetMsg("Error (3): Ошибка выполнения запроса!");}
}

function Logout($hard, $action){
    VisitCount();
    if ($action/* && $action !== "NAME"*/) {VisitLog("LogOut " . $action);}
    DeleteSession($hard);
    RetOut($action);
}

function CheckRightsT($user, $rights){
    $ret = true;
    if (! $rights) {return false;}
    if (strpos($user['rights'], "allrights;") !== false) {return true;}
    foreach (explode(";", $rights) as $rt) {if (strpos($user['rights'], $rt . ";") === false) {$ret = false;}}
    return $ret;
}

function CheckUserT($sw, $param){
    global $timecor;
    if (isset($_SESSION['user'])) {
        $lgname = $_SESSION['user'];
        $lghost = $_SERVER['SERVER_NAME'];
        $lgresult = @mysql_query("SELECT * FROM users WHERE BINARY name='" . $lgname . "' && host='" . $lghost . "'");
        if ($lgresult) {
            $lgresult = @mysql_fetch_array($lgresult);
            if ($lgresult) {
                if (($lgresult['multi'] == 1) || ($lgresult['SID'] === session_id())) {
                    $lgphp = CodePHP($lgresult['php']);
                    $lgjs = $lgresult['js'];
                    if ($lgphp){
                        if (is_null($lgresult['timesession']) || ($lgresult['timesession'] == 0) || (abs(time() + $timecor - $_SESSION['stamp_visittime']) < $lgresult['timesession'])){
                            VisitCount();
                            //if (isset($GLOBALS['gbuserfake']) && $GLOBALS['gbuserfake']){Logout(false, "NAME"); return true;} // - заглушка для gb
                            switch ($sw) {
                                case 1:
                                    RetIn($lgname, $lgphp, $lgjs); return true;
                                    break;
                                case 2:
                                    $tt = CheckRightsT($lgresult, $param); RetMsg($tt); return $tt;
                                    break;
                                case 3:
                                    return $lgresult;
                                    break;
                            }
                        }
                        else {Logout(false, "TIME"); return "TIME";}
                    }
                    else {Logout(true, "PHP"); return "PHP";}
                }
                else {Logout(true, "SID"); return "SID";}
            }
            else {Logout(false, "NAME"); return "NAME";} // if (ReservedUsers($lgname)) {return "NAME";} {else return true;}} // - заглушка для gb
        }
        else {Logout(false, "SQL"); return "SQL";}
    }
    else {VisitCount(); RetOut("NOUSER");}
    return "NOUSER";
}

function CheckUser(){return CheckUserT(1, "");}
function CheckUserS(){ob_start(); $tt = CheckUserT(1, ""); ob_end_clean(); return $tt;}
function CheckRights($rights){return CheckUserT(2, $rights);}
function CheckRightsS($rights){ob_start(); $tt = CheckUserT(2, $rights); ob_end_clean(); return $tt;}
function CheckDetailsS(){ob_start(); $tt = CheckUserT(3, ""); ob_end_clean(); return $tt;}

setlocale(LC_ALL, "ru_RU.UTF-8");

if (isset($_POST['hostdir'])) {$lgset = $_SERVER['DOCUMENT_ROOT'] . "/" . $_POST['hostdir'] . "/" . $_SERVER['SERVER_NAME'] . ".php";}
else {$lgset = $_SERVER['DOCUMENT_ROOT'] . "/data/host/" . $_SERVER['SERVER_NAME'] . ".php";}

ob_start();
$lgset = include $lgset;
include $_SERVER['DOCUMENT_ROOT'] . "/lib/useful.lib";
ob_end_clean();

if (! isset($_POST['page'])) {$_POST['page'] = "/";}
if (strlen(strrchr($_POST['page'], "/")) === 1) {$_POST['page'] = substr($_POST['page'], 0, strlen($_POST['page']) - 1);}

if ((isset($_POST['action']) && $_POST['action'] === 'login') && (isset($_POST['method']) && $_POST['method'] === 'reload')){$GLOBALS['requestTarget'] = 'login&reload';}
else {$GLOBALS['requestTarget'] = false;}

$lgerror = false;
@mysql_connect($lgset['base']['host'], $lgset['base']['name'], $lgset['base']['pass']) ?: $lgerror = "Error (1): Ошибка подключения к хосту!";
if (! $lgerror) { @mysql_select_db($lgset['base']['main']) ?: $lgerror = "Error (2): Ошибка подключения к базе данных!";}
unset($lgset['base']);
if ($lgerror) {RetMsg($lgerror); return $lgerror;}

$GLOBALS['hostset'] = $lgset;
//if ($_SERVER['SERVER_NAME'] === "localhost") {$GLOBALS['timecor'] = 3600;} else {$GLOBALS['timecor'] = 0;}
$GLOBALS['timecor'] = 0;

session_name('user');
@session_start();

if (isset($_POST['lgremember'])) {if ($_POST['lgremember'] == "true") {$_SESSION['remember'] = true;} else {$_SESSION['remember'] = false;}}
if (isset($_SESSION['remember'])) {$remember = $_SESSION['remember'];}
else {$remember = true;}

if (isset($_POST['action'])) {
    if     ($_POST['action'] === "checkuser") {CheckUser();}
    elseif ($_POST['action'] === "login") {Login();}
    elseif ($_POST['action'] === "logout"){Logout(! $remember, "USER");}
    elseif ($_POST['action'] === "getcount"){GetCount();}
    elseif ($_POST['action'] === "setcount"){SetCount();}
    elseif ($_POST['action'] === "setuserdetails"){SetUserDetails();}
}
//else {return CheckUser();}

if ($GLOBALS['requestTarget'] === 'login&reload'){GoToHRef();}

?>
