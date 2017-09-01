function GetLogCount(page, ret){
    $.ajax({
        url: LoginInit.phpfile,
        type: 'POST',
        data: {action: 'getcount', page: page},
        dataType: 'text',
        error: function(a,b,c){},
        success: function(data){$(ret).data('logcount', data).html(data)}
    })
}

function SetLogCount(object, count, page){
    if (! object) {object = ''}
    if (! count) {count = 'download'}
    if (! page) {page = window.location.pathname}
    $.ajax({
        url: LoginInit.phpfile,
        type: 'POST',
        data: {action: 'setcount', object: object, count: count, page: page},
        dataType: 'json',
        error: function(){},
        success: function(data){}
    })
}

function Log(page, host){
    page.org = page.page
    page.page = host + page.page
    page.page = page.page.replace(/\//g, '_')
    page.page = page.page.replace(/\./g, '_')
    $(page.parent).insDiv({id: 'journal-' + page.page}).addClass('page')
    $('#journal-' + page.page).insDiv().queue(function(){GetLogCount(page.org, this)})
    $('#journal-' + page.page).insDiv().queue(function(){FileInfo(page.dir + page.page + '.php', this)}).css('margin-top', '1ex')
    $('#journal-' + page.page).insDiv().queue(function(){ReadHTMLFile(page.dir + page.page + '.php', this)}).css('margin-top', '1ex')
}

function Login(){ // не используется
    return $.ajax({
            url: LoginInit.phpfile,
            type: 'POST',
            data: {name: $('#lgname').val(), pass: $('#lgpass').val(), remember: (! $('#lgremember').attr('checked')), action: 'login', page: window.location.pathname},
            dataType: 'json',
            error: function(){/*'Произошел сбой при входе!<br>Попробуйте еще раз или обратитесь к администратору сайта.'*/},
            success: function(data){}
    })
}

function Logout(){
    $.ajax({
        url: LoginInit.phpfile,
        type: 'POST',
        data: {action: 'logout', page: window.location.pathname},
        dataType: 'json',
        error: function(){},
        success: function(data){window.location.reload()}
    })
}

function LoginCheck(sw, deferred){
    return $.ajax({
            url: LoginInit.phpfile,
            type: 'POST',
            data: {action: 'checkuser', page: window.location.pathname},
            dataType: 'json',
            error: function(a,b,c){},
            success: function(data){
                if (! (deferred && deferred.promise)){deferred = $.Deferred()}
                if (data.key == 'out' && data.action != 'NOUSER' && sw != 'first') {window.location.reload()}
                else if (sw === 'first') {
                    if (data.key == 'in'){
                        $('#user').text(data.user).show()
                        $('#lgexit').show()
                        if (data.js) {ExecJSFile(RootURL() + '/' + data.js, null, function(a, b){User(a, b)}, data, null, deferred)}
                        else {deferred.resolve()}
                    }
                    else if (data.key == 'out'){
                        if (data.login_name){$('#lgname').val(data.login_name); $('#lgpass').val('')}
                        $('#lgform').show()
                        $('#lgenter').show()
                        if (data.text){ShowWarning('<p align="center">' + data.text + '</p>', -1)}
                        deferred.resolve()
                    }
                    else if (data.key == 'message'){
                        ShowWarning('<p align="center">' + data.text + '</p>', -1)
                        deferred.resolve()
                    }
                }
                else {deferred.resolve()}
            }
    })
}

function LoginInit(){
    var init = arguments.callee
    if (arguments[0] && (arguments[0].innerHTML || typeof(arguments[0]) == 'string')){init.loginbox = arguments[0]}
    else if ($.isPlainObject(arguments[0])){for (var i in arguments[0]){init[i] = arguments[0][i]}}
    if (arguments[1]){init.phpfile = arguments[1]}

    function LoginForm(){
        $(init.loginbox)
            .append($('<form>').attr({id: 'lgform', name: 'lgform', method: 'POST', action: init.phpfile}).hide()
            //.append($('<div>')
                .append($('<table>').append($('<tbody>')
                    .append($('<tr>')
                        .append($('<td>').text('Имя'))
                        .append($('<td>').append($('<input>').attr({id: 'lgname', type: 'text', size: 12, name: 'lgname', maxlength: '32'})
                            .keypress(function(e){if(e.which == 13){$('#lgpass').focus(); e.preventDefault()}})
                            )))
                    .append($('<tr>')
                        .append($('<td>').text('Пароль'))
                        .append($('<td>').append($('<input>').attr({id: 'lgpass', type: 'password', size: 12, name: 'lgpass', maxlength: '32'})
                            .keypress(function(e){if(e.which == 13){$('#lgenter > a').click(); e.preventDefault()}})
                            )))
                ))
                .append($('<div>')
                    .append($('<input>').attr({id: 'lgremember_chb', type: 'checkbox'}).change(function(e){$('#lgremember').val(!e.target.checked)}))
                    .append($('<input>').attr({id: 'lgremember', type: 'hidden', name: 'lgremember'}).val(true))
                    .append($('<span>').text(' Чужой компьютер'))
                )
                .append($('<input>').attr({type: 'hidden', name: 'action'}).val('login'))
                .append($('<input>').attr({type: 'hidden', name: 'method'}).val('reload'))
                .append($('<input>').attr({type: 'hidden', name: 'page'}))
                .append($('<input>').attr({type: 'hidden', name: 'gotohref'}))
                .submit(function(e){e.target.page.value = window.location.pathname; e.target.gotohref.value = window.location.href})
            )
            .append($('<div>').attr({align: 'right', id: 'lgenter'}).css({'margin-top': '0.5ex', 'font-size': '1.2em'}).append($('<a>').text('Войти')
                .css({cursor: 'pointer', 'text-decoration': 'underline'}).click(function(){$('#lgform').submit()})).hide())
    }

    function LoginUser(){
        $(init.loginbox)
            .append($('<div>').attr({align: 'right', id: 'user'}).css({'font-weight': 'bold', 'font-size': '1.5em'}).hide())
            .append($('<div>').attr({align: 'right', id: 'lgexit'}).css({'margin-top': '0.5ex', 'font-size': '1em'}).append($('<a>').text('Выйти')
                .css({cursor: 'pointer', 'text-decoration': 'underline'}).click(Logout)).hide())
    }

    LoginForm(); LoginUser();

}

LoginInit.loginbox = '#login'
LoginInit.phpfile = RootURL() + '/lib/session.php'
