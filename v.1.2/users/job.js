function User(param, deferred){
    $.when(jvMenu.menu({filename: 'users/job.mnu', menuname: 'job', line_box: '#menuline', menu_box: '#menu', page_box: '#page', sectionName: param.user}, ['login-full', 'firstchildren', ResumeForJob]))
        .done(function(){if (deferred && deferred.promise){deferred.resolve()}})
        .fail(function(){if (deferred && deferred.promise){deferred.reject()}})
}

function ResumeForJob(parent){
    var res
    if (typeof(parent) == 'string'){res = $('<div>').prependTo($('#page > #job').hide())}
    else {res = $(parent).insDiv()}
    res.addClass('page')
        //.append($('<div>')
            .append($('<figure>').css({'float': 'right', margin: '3ex 1em', width: '50%'})
                .appImg({src: 'image/goto.png', alt: 'GOTO', width: '100%'}, {border: '2px solid black'})
                .append($('<figcaption>').css({'text-align': 'center', 'font-size': '0.7em'}).appA({href: 'http://xkcd.com/292', target: '_blank', text: 'http://xkcd.com/292'}))
            )
            .app$('<h3>', {text: 'Web-программист, Frontend, HTML, PHP'}, {'text-align': 'center'})
            .app$('<h4>', {text: 'HTML5, CSS3, JavaScript, Node.js, AngularJS, Bootstrap, NativeJS, PHP7, MySQL, SPA-сайты, адаптивная верстка'}, {'text-align': 'center'})
            .append($('<div>', {text: 'Условия работы: '}).appSpan({text: 'удаленно'}, {'text-decoration': 'underline'}))
            .appDiv({text: 'E-mail: dmsok@yandex.ru'})
            .appDiv({text: 'Телефон: +7 (911) 935-14-33'})
            .appDiv({text: 'Skype: dmsok101'})
            .appDiv({text: 'Дмитрий Соколов'}, {'font-weight': 'bold'})
            //.append($('<div>').append($('<a>', {href: 'test/Resume.pdf', target: '_blank'}).text('Открыть резюме')).css({'font-weight': 'bold', 'margin': '1ex 0'}))
            .app$('<br>')
            .appDiv('', {clear: 'right'})
        //)
}

function ScriptForJob_B(parent, page){// пример кода - $.last()
    switch (page.file){
        case 'lib/jmenu.js':
            page.parent = $(parent).insDiv({'class': 'page'})
                .app$('<h3>', {text: 'Создание меню и загрузка страниц с добавлением записей в историю браузера'})
            break
        case 'lib/gbook.js':
            page.parent = $(parent).insDiv({'class': 'page'})
                .app$('<h3>', {text: 'Гостевая книга - JavaScript'})
                .appDiv({text: 'Используются небольшие расширения jQuery:'}, {'font-style': 'italic'})
                .append($('<div>', {'class': 'code'})
                    .appDiv({html: "&nbsp&nbsp&nbsp&nbsp" + "insDiv: function(par){return $('&lt;div&gt;', par).appendTo(this)}"})
                    .appDiv({html: "&nbsp&nbsp&nbsp&nbsp" + "appDiv: function(par, css){if (css){return this.append($('&lt;div&gt;', par).css(css))} else {return this.append($('&lt;div&gt;', par))}}"})
                )
                .app$('<br>')
                .appDiv({html: "&nbsp&nbsp&nbsp&nbsp" + "GuestBookR({file: 'gbook.php', name: 'main.gb', parent: 'body', parentw: 'body', gb: 'main', reload: [,1], size: {mw: 100}, revers: true, mailto: 'mail@dmsok.ru', strong: false})", 'class': 'code'})
            JSBacklight(page.parent.children('div:eq(1)')); JSBacklight(page.parent.children('div:eq(2)'))
            break
        case 'test/gbook_php.txt':
            page.parent = $(parent).insDiv({'class': 'page'})
                .app$('<h3>', {text: 'Гостевая книга - PHP'})
            break
    }
}

function ScriptForJob_A(parent, page){JSBacklight(page.parent.children('div').last().addClass('code').css('font-family', ''))}
