function GuestBookWindow(gbset){
    var gbname = gbset.name, gbparentw = gbset.parentw, gb = gbset.gb, gbreload = gbset.reload
    if (! gbname){return false}
    if (! gbparentw){gbparentw = 'body'}
    if (! gb) {gb = 'default'}
    for (var i = 0; i < 4; i++) {if (! gbreload[i]) {gbreload[i] = 0}}
    gb = 'gbw-' + gb
    if ($.isEmptyObject($(gbparentw).children('#' + gb)[0])) {$(gbparentw).insDiv({id: gb}).data('gbset', gbset)}
    
    $.ajax({
        url: gbname,
        cache: false,
        dataType: 'html',
        error: function(a, b, c){ShowWarning('<p align="center">Произошел сбой при открытии гостевой книги!<br>Попробуйте еще раз или обратитесь к администратору сайта.</p>', -1)},
        success: function(data){
            $('#' + gb).addClass(gb).html(data)
            $('#' + gb + '> div').find('>div:eq(0)').addClass(gb + '-message')
            $('#' + gb + '> div').find('>div:eq(1) span:eq(0)').addClass(gb + '-sign')
            $('#' + gb + '> div').find('>div:eq(1) span:eq(1)').addClass(gb + '-date')
            $('#' + gb).prepend($('<div>').attr({id: gb + '-control', align: 'right'}).data('reload', gbreload[2]).each(GuestBookControl))
            $('#' + gb).insDiv().attr({id: gb + '-control', align: 'right'}).data('reload', gbreload[3]).each(GuestBookControl)
            if (window.GBWindowSystem){GBWindowSystem()}
        }
    })
}

function GuestBookMessage(gbset){
    
    var gbfile = gbset.file, gbname = gbset.name, gbparent = gbset.parent, gbparentw = gbset.parentw, gb = gbset.gb, gbreload = gbset.reload, gbsize = gbset.size, gbrevers = gbset.revers, gbmailto = gbset.mailto, gbstrong = gbset.strong
    var gbx, gby, gbz, user
    
    if (! gbfile) {return false}
    if (! gbname) {return false}
    if (! gb) {gb = 'default'}
    if (! gbparent) {gbparent = 'body'}
    else if (typeof(gbparent) == 'object') {}
    else if (gbparent == 'body') {}
    else if (gbparent.indexOf('#') != 0) {gbparent = '#' + gbparent}
    if (typeof(gbsize) != 'object' || gbsize === null) {gbsize = {}}
    if (! gbsize.nw) {gbsize.nw = 20}
    if (! gbsize.sw) {gbsize.sw = 28}
    if (! gbsize.mw) {gbsize.mw = 70}
    if (! gbsize.mh) {gbsize.mh = 5}
    for (var i = 0; i < 4; i++) {if (! gbreload[i]) {gbreload[i] = 0}}
    gb = 'gb-' + gb
    
    if ($.isEmptyObject($(gbparent).children('#' + gb)[0])){$(gbparent).insDiv({id: gb}).data('gbset', gbset)}
    else {$(gbparent).children('#' + gb).children().remove()}
    $('#' + gb).insDiv({id: gb + '-system'}).hide().css('margin-bottom', '1ex')
    $('#' + gb).insDiv({id: gb + '-header'}).hide().css('margin-bottom', '1ex')
    $('#' + gb).insDiv().ins$('<table>').attr('width', '100%').ins$('<tr>')
        .append($('<td>')
            .appSpan({text: 'Имя:'}).appSpan({text: '* '}, {color: 'red'})
            .appInput({type: 'text', id: gb + '-name', size: gbsize.nw, maxlength: 32})
            .appSpan({text: 'Сайт: '}, {'margin-left': '1em'})
            .appInput({type: 'text', id: gb + '-site', size: gbsize.sw, maxlength: 255}) )
        .append($('<td>').append($('<div>', {id: gb + '-control', align: 'right'}).data('reload', gbreload[0]).each(GuestBookControl)))
    $('#' + gb).insDiv().css('margin-top', '1ex').append($('<textarea>').attr({id: gb + '-message', cols: gbsize.mw, rows: gbsize.mh})
        .keypress(function(e){if(e.ctrlKey && e.which == 13){$('#' + gb + '-send').click()}}))
    $('#' + gb).insDiv().css('margin-top', '1ex').ins$('<table>').attr('width', '100%').ins$('<tr>')
        .append($('<td>')
            .append($('<span>', {id: gb + '-antispamblock'})
                .appSpan({text: 'Антиспам:'}).appSpan({text: '* '}, {color: 'red'}).appSpan({text: '', id: gb + '-formula'})
                .appInput({type: 'text', id: gb + '-antispam', size: 2, maxlength: 2}))
            .appButton({text: 'Отправить', id: gb + '-send', click: SendMessage}, {'margin-left': '1em'})
            .appButton({text: 'Сброс', click: Reset}, {'margin-left': '1em'}) )
        .append($('<td>').append($('<div>', {id: gb + '-control', align: 'right'}).data('reload', gbreload[1]).each(GuestBookControl)))
    GetAntiSpam()
    CheckAccess()
    if (window.LoginCheck){$('#' + gb + ' button').not('#' + gb + '-send').click(function(e){LoginCheck()})}
    $('#' + gb + '-antispam').keypress(function(e){if(e.which == 13){$('#' + gb + '-send').click()}})
    
    function Reset(){
        $('#' + gb + '-message').val('')
        $('#' + gb + '-antispam').val('')
        GetAntiSpam()
    }
    
    function GetAntiSpam(){
        gbx = Math.round(Math.random() * 9) + 1
        gby = Math.round(Math.random() * 9) + 1
        gbz = gbx + ' + ' + gby + ' = '
        $('#' + gb + '-formula').text(gbz)
    }
    
    function SendMessage(){
        if (! $('#' + gb + '-message').val()){ShowWarning('Сообщение отсутствует!'); return}
        if (! $('#' + gb + '-name').val()){ShowWarning('Пожалуйста, введите свое имя или ник!'); return}
        if (! user && ! gbstrong && $('#' + gb + '-antispam').val() != gbx +gby){ShowWarning('Неверное значение антиспам суммы!'); return}
        $.ajax({
            url: gbfile,
            type: 'POST',
            data: {name: gbname, user: $('#' + gb + '-name').val(), site: $('#' + gb + '-site').val(), message: $('#' + gb + '-message').val(), revers: gbrevers, mailto: gbmailto, strong: gbstrong},
            dataType: 'text',
            error: function(){
                ShowWarning('<p align="center">Произошел сбой при отправке сообщения!<br>Попробуйте еще раз или обратитесь к администратору сайта.</p>', -1)
                GetAntiSpam()
            },
            success: function(data){
                if (data.replace(/#.*/, '') == 'Success'){if (gbparentw){GuestBookWindow(gbset)}; Reset(); $('#' + gb + '-message')[0].focus()}
                else {ShowWarning('<p align="center">' + data.replace(/#.*/, '') + '</p>', -1); GetAntiSpam()}
                var comm = data.match(/#.*/)
                if (comm && comm.length > 0) {if (comm[0] === '#reload') {$(document).click(function(){window.location.reload()})}}
            }
        })
    }
    
    function CheckAccess(){
        $.ajax({
            url: gbfile,
            type: 'POST',
            data: {name: gbname, action: 'gbcheck'},
            dataType: 'json',
            error: function(){},
            success: function(data){//trace(data)
                if (data.open == 0) {
                    $('#' + gb + '-header').show().insDiv({id: gb + '-warning'}).text('Книга временно закрыта!').css({color: 'red'})
                    $('#' + gb).find('input, textarea, button').attr('disabled', 'true')
                    $('#' + gb + ' div[id$="-control"]').find('input, textarea, button').attr('disabled', '')
                    $('#' + gb).data('open', false)
                }
                else {$('#' + gb).data('open', true)}
                if (data.user) {user = data.user; $('#' + gb + '-antispam').attr('disabled', 'true')}
                if (gbstrong) {
                    if (data.user) {$('#' + gb + '-name').val(data.user)}
                    else {$('#' + gb + '-name').val('Гость')}
                    $('#' + gb + '-name').attr('disabled', 'true')
                    $('#' + gb + '-antispamblock').hide()
                }
                else {
                    if (data.gbuser) {$('#' + gb + '-name').val(data.gbuser)}
                    else if (data.user) {$('#' + gb + '-name').val(data.user)}
                    else {$('#' + gb + '-name').val('Гость')}
                }
                if (data.gbsite) {$('#' + gb + '-site').val(data.gbsite)}
                if (window.GBMessageSystem){GBMessageSystem()}
                $('#' + gb + '-message')[0].focus()
            }
        })
    }
}

function GuestBookControl(){
    $(this).click(GuestBookControlEvent)
    if ($(this).data('reload')) {$(this).append($('<button>', {text: 'Обновить'}))}
}

function GuestBookControlEvent(event){
    var gbset = $(this).parents('div[id^="gb-"]').data('gbset')
    if (! gbset) {gbset = $(this).parents('div[id^="gbw-"]').data('gbset')}
    GuestBookR(gbset)
}

function GuestBook(gbset){
    GuestBookWindow(gbset)
    GuestBookMessage(gbset)
}

function GuestBookR(gbset){
    GuestBookMessage(gbset)
    GuestBookWindow(gbset)
}
