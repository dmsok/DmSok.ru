function User(param, deferred){
    switch (window.location.pathname){
        case '/':
            $.when(jvMenu.menu({filename: 'users/dmsok.mnu', menuname: 'main', line_box: '#menuline', menu_box: '#menu', page_box: '#page', sectionName: param.user}, ['login-full', 'firstchildren']))
                .done(function(){if (deferred && deferred.promise){deferred.resolve()}})
                .fail(function(){if (deferred && deferred.promise){deferred.reject()}})
            GBMessageSystem()
            GBWindowSystem()
            break
    }
}

function GBMessageSystem(){
    $('div[id^="gb-"] div[id$="-system"]').show().click(GBMessageSystemEvent)
        .each(function(){var a='Открыть'; if ($(this).parent().data('open')){a='Закрыть'};$(this).appButton({text: a})})
}

function GBWindowSystem(){
    $('div[id^="gbw-"] > div').not('div:first').not('div:last').click(GBWindowSystemEvent).find('>div:last')
        .each(function(){var a=$(this).parent().attr('id'); $(this).appSpan({text: ' - id: ' + a +' '}).appButton({text: 'Удалить'})})
}

function GBMessageSystemEvent(event){
    switch ($(this).find('*').index(event.target)){
        case 0:
            var open = 'on', gb = $(this).parent()
            if ($(gb).data('open')){open = 'off'}
            $.ajax({
                url: $(gb).data('gbset').file,
                type: 'POST',
                data: {name: $(gb).data('gbset').name, action: 'gbaccesstoggle', access: open},
                dataType: 'text',
                error: function(){},
                success: function(data){GuestBookMessage($(gb).data('gbset'))}
            })
            break
    }
}

function GBWindowSystemEvent(event){
    switch ($(this).find('button').index(event.target)){
        case 0:
            var gb = $(this).parent(), id = $(this).attr('id')
            var str = $(this).children('div:eq(0)').html().replace(/<br>/g, '\n').replace(/<[^>]*>/g, '').substr(0, 50) + '...\n' + $(this).children('div:eq(1)').find('span:eq(0)').text() + '\n' + $(this).children('div:eq(1)').find('span:eq(1)').text()
            if (! confirm('Удалить сообщение?\n' + str)){break}
            $.ajax({
                url: $(gb).data('gbset').file,
                type: 'POST',
                data: {name: $(gb).data('gbset').name, action: 'gbdeletemessage', id: id},
                dataType: 'text',
                error: function(){},
                success: function(data){GuestBookWindow($(gb).data('gbset'))}
            })
            break
    }
}

function HostSetup(parent, page){
    console = $(parent).insDiv().addClass('page').insDiv({text: 'Console'}).css({'font-weight': 'bold'})
        //.insDiv().css({'background-color': 'black', color: 'white', 'font-weight': 'normal'})
        .insDiv().css({'margin-top': '1ex', 'margin-left': '1em', 'font-weight': 'normal'})
            .ins$('<textarea>').attr({cols: 100, rows: 8}).css({'background-color': 'black', color: 'white'})

    $(parent).insDiv().addClass('page').insDiv({text: 'Files'}).css({'font-weight': 'bold'}).click(Go1)
        .append($('<div>').css({'margin-top': '1ex', 'margin-left': '1em', 'font-weight': 'normal'})
            .append($('<div>').appSpan({text: 'File: '}).appInput({type: 'text', size: 80}).appButton({text: 'List'}))
            .append($('<div>').appSpan({text: 'Undeletable: '}).appRadio({text: 'On ', name: 'hsr1'}).appRadio({text: 'Off ', name: 'hsr1'}).appButton({text: 'Go'}, {'margin-left': '1em'})))
    
    function Go1(event){
        switch ($(this).find('button').index(event.target)){
            case 0:
                SysCommand({action: 010, file: $(this).find('input:first').val()}, console)
                break
            case 1:
                if ($(this).find('input:radio:eq(0)').attr('checked')) {SysCommand({action: 011, file: $(this).find('input:first').val()}, console)}
                if ($(this).find('input:radio:eq(1)').attr('checked')) {SysCommand({action: 012, file: $(this).find('input:first').val()}, console)}
                break
        }
    }

    $(parent).insDiv().addClass('page').insDiv({text: 'Users'}).css({'font-weight': 'bold'}).click(Go2)
        .append($('<div>').css({'margin-top': '1ex', 'margin-left': '1em', 'font-weight': 'normal'})
            .append($('<div>').appSpan({text: 'Name: '}).appInput({type: 'text', size: 28, maxlength: 32}).appSpan({text: ' Pass: '}).appInput({type: 'password', size: 28, maxlength: 32}).appButton({text: 'Set'}, {'margin-left': '1em'})))
    
    function Go2(event){
        switch ($(this).find('button').index(event.target)){
            case 0:
                $.ajax({
                    url: RootURL() + '/lib/session.php',
                    type: 'POST',
                    data: {action: 'setuserdetails', name: $(this).find('input:eq(0)').val(), newpass: $(this).find('input:eq(1)').val()},
                    dataType: 'text',
                    error: function(a,b,c){},
                    success: function(data){$(console).val($(console).val() + data)}
                })
                break
        }
    }
}
