<?php

function SafeInclude($file){ // не используется
    ob_start(); $tt = include $file; ob_end_clean(); return $tt;
}

function Host(){
    echo $_SERVER['SERVER_NAME'];
}

function FileInfo(){
    if (! isset($_POST['file'])) {return ;}
    $file = $_SERVER['DOCUMENT_ROOT'] . "/" . $_POST['file'];
    if (file_exists($file)){
        $lastmod = date("d-m-Y H:i:s", filemtime($file));
        $size = filesize($file);
        echo "{\"file\": \"$file\", \"lastmod\": \"$lastmod\", \"size\": \"$size\"}";
    }
    else {
        echo "{\"file\": \"$file\", \"error\": \"File not exists\"}";
    }
}

function VarSession(){
    if (! isset($_POST['name'])) {echo "{\"error\": \"Name not set\"}"; return false;}
    session_name($_POST['name']);
    session_start();
    $a = session_name();
    $ret = "\"session_name\": \"$a\"";
    $a = session_id();
    $ret = $ret . ", \"SID\": \"$a\"";
    foreach($_SESSION as $key => $value) {
        if (strpos($key, "stamp_") === 0) {
            if (isset($_POST['stamp']) && $_POST['stamp'] == "") {}
            elseif (isset($_POST['stamp'])) {$value = date($_POST['stamp'], $value);}
            else {$value = date("d-m-Y H:i:s", $value);}
        }
        $ret = $ret . ", \"$key\": \"$value\"";
    }
    $ret = "{" . $ret . "}";
    echo $ret;
}

function SetVarSession(){ // не используется
    global $timecor;
    if (! isset($_POST['name']) || ! isset($_POST['key']) || ! isset($_POST['value'])) {return ;}
    session_name($_POST['name']);
    session_start();
    $currpage = str_replace("/", "_", $_POST['page']);
    $currpage = str_replace(".", "_", $currpage);
    if ($_POST['key'] == "visittime") {
        $_SESSION['stamp_visittime'] = time() + $timecor;
        $_SESSION['stamp_visittime' . $currpage] = time() + $timecor;
    }
    else {$_SESSION[$_POST['key']] = $_POST['value'];}
}

function SysCommand(){
    if (isset($_POST['action'])) {$action = $_POST['action'];} else {echo "FAIL: action is missed!!!"; return ;}
    switch ($action) {
        case 010:   // dir list
            if (! isset($_POST['file']) || ! $_POST['file']) {echo "FAIL: parameter(s) is missed!!!"; return ;}
            $file = $_SERVER['DOCUMENT_ROOT'] . "/" . $_POST['file'];
            system("ls -lo " . $file);
            break;
        case 011:   // set 'undeletable' flag
            if (! isset($_POST['file']) || ! $_POST['file']) {echo "FAIL: parameter(s) is missed!!!"; return ;}
            $file = $_SERVER['DOCUMENT_ROOT'] . "/" . $_POST['file'];
            echo $file . " - set undeletable flag\n";
            system("chflags uunlink " . $file);
            break;
        case 012:   // remove 'undeletable' flag
            if (! isset($_POST['file']) || ! $_POST['file']) {echo "FAIL: parameter(s) is missed!!!"; return ;}
            $file = $_SERVER['DOCUMENT_ROOT'] . "/" . $_POST['file'];
            echo $file . " - remove undeletable flag\n";
            system("chflags nouunlink " . $file);
            break;
    }
echo "--- done ---\n";
}

/* для SetVarSession взято из session.php
if ($_SERVER['SERVER_NAME'] === "localhost") {$GLOBALS['timecor'] = 3600;} else {$GLOBALS['timecor'] = 0;}
if (! isset($_POST['page'])) {$_POST['page'] = "/";}
if (strlen(strrchr($_POST['page'], "/")) === 1) {$_POST['page'] = substr($_POST['page'], 0, strlen($_POST['page']) - 1);}
*/

if (isset($_POST['func'])) {call_user_func($_POST['func']);}

?>