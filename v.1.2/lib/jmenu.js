(function(window){

    var load = {}, curr = {}, files = [], sect = {}, uin_sep = '___jvmenu___', uin_sep_alt = '&'

    var jvMenu = new function(){
    this.create = function(menu){
        var n, me, deep, page

        me = this
        if (! menu.filename || ! menu.menuname){Alarm('При вызове метода jvMenu.create() не заданы обязательные параметры: filename, menuname!'); return false}
        var ajax_menu = $.ajax({url: menu.filename, cache: false, dataType: 'text'})
        ajax_menu.fail(function(){Alarm('Ошибка загрузки файла меню ' + menu.filename); return false})
            .done(function(data){
                //eval('data = ' + data)
                var ts = (Date && Date.now) ? 'jvMenu' + Date.now() : 'jvMenu' + (new Date().getTime())
                $.globalEval(ts + ' = ' + data)
                data = window[ts]
                delete window[ts]

                if (! data[menu.menuname]){Alarm('Не найдено меню ' + menu.menuname); return false}
                $.each(data[menu.menuname]['init'], function(i, val){menu[i] = menu[i] || val})
                if (! menu.line_box || ! menu.menu_box || ! menu.page_box){Alarm('Не заданы обязательные параметры: line_box, menu_box, page_box!'); return false}

                menu.line_box = (typeof(menu.line_box) == 'string' && menu.line_box.search(/^#+/) == -1) ? menu.line_box : $(menu.line_box).attr('id')
                menu.menu_box = (typeof(menu.menu_box) == 'string' && menu.menu_box.search(/^#+/) == -1) ? menu.menu_box : $(menu.menu_box).attr('id')
                menu.page_box = (typeof(menu.page_box) == 'string' && menu.page_box.search(/^#+/) == -1) ? menu.page_box : $(menu.page_box).attr('id')
                menu.menu_id = menu.menu_id || 'jvmenu_menu'
                menu.page_id = menu.page_id || 'jvmenu_page'
                menu.line_sign = menu.line_sign || ' >>> '
                menu.backlight = menu.backlight || {}
                menu.size = menu.size || '1em'
                menu.speed = menu.speed || 'fast'
                menu.plus = menu.plus || {}
                menu.minus = menu.minus || {}
                menu.deep = deep = menu.deep || 10
                menu.action = $.isPlainObject(menu.action) ? menu.action : {}
                menu.set = menu.set || 0
                menu.uin = menu.menu_box + uin_sep + menu.menu_id
                if ((menu.history || menu.history === 0) && BrowserHistory){BrowserHistory(menu.history)}
                else if ((typeof(menu.history) == 'undefined' || typeof(menu.history) == 'string') && BrowserHistory){BrowserHistory(); menu.history = true}
                else {menu.history = false}
                if (! menu.history_walk_wait){menu.history_walk_wait = false}

                load[menu.uin] = []
                curr[menu.uin] = []
                if (! sect[menu.set]){sect[menu.set] = {name: menu.set, set: [menu.uin], curr_sect: [menu.uin]}} else {sect[menu.set].set.push(menu.uin)}
                me[menu.uin] = {}

                $.each(data[menu.menuname], function(i, val){
                    if(isNaN(Number(i))){return true} else {i = Number(i)}
                    if (typeof(val) != 'object'){return true}
                    $.each(menu, function(i, valm){if (! val[i]){val[i] = valm}})
                    val.n = i
                    val.id = val.page_id + i
                    val.idm = val.menu_id + (i || '')
                    if (i === 0){n = '#' + val.menu_box}
                    else {n = '#' + val.menu_box + ' #' + val.menu_id + (Math.floor(i/deep) || '')}
                    n = $('<div>', {id: val.idm}).data('page', val).appendTo($(n))
                    n.append($('<span>').text(val.text))
                    if (i){n.hide()}
                    if (val.size){n.css('padding-left', val.size)}
                    if (val.className){n.addClass(val.className)}
                    if (val.css){n.css(val.css)}
                    if (val.title){n.attr('title', val.title)}
                })
                $('#' + menu.menu_box + '>#' + menu.menu_id + ', #' + menu.menu_box + '>#' + menu.menu_id + ' div').each(function(i){
                    page = $(this).data('page')
                    //Math.floor(page.n/deep) ? $(this).hide() : {}
                    if ($(this).children('div').length){$(this).css(page.plus).data('close', true)}
                })

                me[menu.uin].ajax_menu = ajax_menu
                me[menu.uin].menu = menu
                me[menu.uin].head = $('#' + menu.menu_box + '>#' + menu.menu_id)
                if (menu.callback){
                    if ($.isFunction(menu.callback)){menu.callback = [menu.callback]}
                    if ($.isArray(menu.callback)){$.each(menu.callback, function(i, val){if ($.isFunction(val)){val.call(me, menu.uin)}})}
                }
            })
        return ajax_menu
    }
    }

    function Alarm(msg){$('body').prepend($('<p>').text(msg).css('background-color', 'red'))}

    function GetRealUIN(uin){return uin.search(uin_sep) != -1 ? uin : uin.replace(uin_sep_alt, uin_sep)}

    function GetMenu(uin){uin = GetRealUIN(uin); return $('#' + uin.split(uin_sep)[0] + ' > #' + uin.split(uin_sep)[1])[0]}

    function GetPage(event){
        if (! event) {return false}
        if (event.jvMenu && event.jvMenu.page){return event.jvMenu.page}
        if (! event.jvMenu && (event.target || event.jquery)){event.jvMenu = {}}
        var target = event.target || $(event)[0]
        //target = target.tagName != 'DIV' ? $(target).parent()[0] : target
        target = $(target).closest('div')
        if (! target.data('page')){return false}
        function Template(){this.selector = event; this.target = target[0]}
        Template.prototype = target.data('page')
        if (event.jvMenu){return event.jvMenu.page = new Template()} else {return new Template()}
    }

    function GetSection(page, obj){
        var p, s, i, n
        function Selector(page){
            return (p.section && p.section[obj]) ? p.section[obj] :
                        ((p.sectionTag && p.sectionTag[obj] && p.section_id && p.section_id[obj]) ?
                            p.sectionTag[obj] + '#' + p.section_id[obj] : 0)
        }
        p = page && page.uin ? page : GetPage(page)
        n = Selector(p) || Selector(GetPage('#' + p.menu_box + ' > #' + p.menu_id))
        if (isNaN(+n)){
            s = $('#' + p[obj + '_box']).closest(n)
        }
        else {
            s = $('#' + p[obj + '_box'])
            for (i = 0; i > n; i--){s = s.parent()}
        }
        return s[0]
    }

    function TogglePage(o, n){
        $(GetSection(GetMenu(o), 'page')).hide()
        $(GetSection(GetMenu(n), 'page')).show()
        $(GetSection(GetMenu(o), 'line')).hide()
        $(GetSection(GetMenu(n), 'line')).show()
    }

    function Children(event, action){
        var page = GetPage(event), last = $(page.target)
        if (/*page.n && */last.children('div').length){
            switch (action) {
                case 'open':
                    last.css(page.minus).data('close', false).children('div').show(page.speed)
                    break
                case 'close':
                    last.css(page.plus).data('close', true).children('div').hide(page.speed)
                    break
                default:
                    last.children('div').slideToggle(page.speed)
                    last.data('close') ? last.css(page.minus).data('close', false) : last.css(page.plus).data('close', true)
            }
        }
    }

    function MenuLine(event){
        var page = GetPage(event), step = $(page.target), k = true, sign
        $('#' + page.line_box + ' > span').remove()
        while (k){
            $('#' + page.line_box).prepend($('<span>', {text: step.data('page').text})) // или .title
            sign = step.data('page').line_sign
            step = step.parent()
            if (step.attr('id') === page.menu_box){k = false}
            else {
                if (! event.originalEvent){Children(step[0], 'open')}
                $('#' + page.line_box).prepend($('<span>', {text: sign}))
            }
        }
    }

    function Backlight(o, n){
        $(o).children('span:first').removeClass('backlight')
        $(n).children('span:first').addClass('backlight')
    }

    function ShowPage(event, hide){

        var page = GetPage(event), last = $(), need, shell, load_page, curr_page, p, t, h, curr_sect, ajax, parent

        need = true; load_page = load[page.uin]; curr_page = curr[page.uin]; curr_sect = sect[page.set].curr_sect
        if (page.always_before){page.always_before.call(window, last[0], page, event)}
        if (page.reload || page.append || page.prepend){page.refresh = true}
        if (page.file && page.refresh){}
        else if (page.file){$.each(load_page, function(i, val){if (val === page.id){need = false; return false}})}
        else {need = false}

        if (need){
            if (page.nopage) {hide = true}
            else {
                if ($.isEmptyObject($('#' + page.page_box + ' > #' + page.id)[0])){
                    last = $('<div>').attr('id', page.id).hide().appendTo('#' + page.page_box)}
                else {
                    if (! page.append && ! page.prepend){$('#' + page.page_box + ' > #' + page.id + ' *').remove()}
                    last = $('#' + page.page_box + ' > #' + page.id)}
            }
            if ($.isFunction(page.file)) {
                if (page.before){page.before.call(window, last[0], page, event)}
                page.file.call(window, last[0], page, event)
                if (page.after){page.after.call(window, last[0], page, event)}
                if (! page.refresh){load_page.push(page.id)}
            }
            else if (! page.reload && $.inArray(page.file, files) > -1) {
                if (page.before){page.before.call(window, last[0], page, event)}
                if (page.after){page.after.call(window, last[0], page, event)}
                if (! page.refresh){load_page.push(page.id)}
            }
            else {
                ajax = {url: page.file, dataType: 'text'}
                if (typeof(page.before_ajax) == 'undefined' || page.before_ajax.call(window, last[0], page, event, ajax)){
                    jvMenu[page.uin].ajax_page = $.ajax(ajax)
                        .fail(function(){last.append($('<p>').text('Ошибка загрузки страницы ' + page.text)).append($('<p>').text(page.file))})
                        .done(function(data, status, jqxhr){
                            ajax = {data: data, status: status, jqxhr: jqxhr, request: ajax}
                            if (page.before){page.before.call(window, last[0], page, event, ajax)}
                            parent = page.parent ? $(page.parent) : last
                            if (page.type == 'none'){}
                            else if (page.type == 'html'){if (page.prepend){parent.prepend(ajax.data)} else {parent.append(ajax.data)}}
                            else if (page.type == 'code'){
                                parent = page.prepend ? $('<div>').prependTo(parent) : $('<div>').appendTo(parent)
                                parent.css({overflow: 'auto', 'font-family': 'monospace'})
                                parent.html(ajax.data.replace(/</g, '&lt;').replace(/>/g, '&gt;')
                                    .replace(/\r/g, '').replace(/^(\s*?)\n/gm, '$1<br>\n')
                                    .replace(/\r?\n/g, '</div><div>').replace(/^/, '<div>') + '</div>')
                                parent.html(parent.html().replace(/\s{2,}/g, function(s){return s.replace(/\s/g, '&nbsp;')}))
                                parent.children('div').css({'white-space': 'nowrap'})
                            }
                            else if (page.type == 'txt'){
                                parent = page.prepend ? $('<div>').prependTo(parent) : $('<div>').appendTo(parent)
                                parent.html(ajax.data.replace(/</g, '&lt;').replace(/>/g, '&gt;')
                                    .replace(/\r?\n/g, '<br>'))
                            }
                            else if (page.type == 'txt+p'){
                                parent = page.prepend ? $('<div>').prependTo(parent) : $('<div>').appendTo(parent)
                                parent.html(ajax.data.replace(/</g, '&lt;').replace(/>/g, '&gt;')
                                    .replace(/\r?\n/g, '</p><p>').replace(/^/, '<p>') + '</p>')
                            }
                            else {
                                jvMenu[page.uin].temp = {parent: last[0], page: page, event: event, ajax: ajax}
                                if (page.safety){
                                    shell = '(function(){' + ajax.data + '})(jvMenu.' + page.uin + '.temp.parent, jvMenu.' + page.uin + '.temp.page, jvMenu.' + page.uin + '.temp.event, jvMenu.' + page.uin + '.temp.ajax);'
                                    $.globalEval(shell)
                                }
                                else {$.globalEval(ajax.data)}
                            }
                            if (page.after){page.after.call(window, last[0], page, event, ajax)}
                            if (! page.refresh){load_page.push(page.id)}
                            if (! page.reload){files.push(page.file)}
                        })
                }
            }
        }

        need = true
        if (page.before_change){need = page.before_change.call(window, last[0], page, event, curr[curr_sect[0]]); if (typeof(need) == 'undefined'){need = true}}
        if (need){
            if(curr_page[0] != page.id && page.file && ! hide){
                Children(event, 'open')
                Backlight('#' + curr[curr_sect[0]][3] + ' #' + curr[curr_sect[0]][2], '#' + page.menu_box + ' #' + page.idm)
                MenuLine(event)
                $('#' + page.page_box + ' > #' + curr_page[0]).hide()
                $('#' + page.page_box + ' > #' + page.id).show()
                if (page.set && curr_sect[0] != page.uin){TogglePage(curr_sect[0], page.uin); curr_sect[0] = page.uin}
                curr_page[0] = page.id; curr_page[1] = page.page_box; curr_page[2] = page.idm; curr_page[3] = page.menu_box
                jvMenu[page.uin].open_page = {page_box: page.page_box, id: page.id, page: page, $:$('#' + page.page_box + ' > #' + page.id)}
            }
            else if (page.set && curr_sect[0] != page.uin && (page.file || page.action.showSection) && ! hide){
                Children(event, 'open')
                Backlight('#' + curr[curr_sect[0]][3] + ' #' + curr[curr_sect[0]][2], '#' + curr[page.uin][3] + ' #' + curr[page.uin][2])
                MenuLine(event)
                TogglePage(curr_sect[0], page.uin)
                curr_sect[0] = page.uin
            }
            else if (! hide){
                need = false
                Children(event)
            }
            if(need && ! hide && (p = GetPage('#' + curr[page.uin][3] + ' #' + curr[page.uin][2]))){
                $('head>title').text($('head>title')[0].title + ' - ' + (p.title || p.text))
                if ((p.history || p.history === 0) && BrowserHistory){
                    t = p.history_no_title ? false : $('head>title').text()//$('head').children('title').text() + ' - ' + (page.title || page.text)
                    h = p.history_no_hash ? false : '#' + p.menu_box + '-' + p.idm
                    BrowserHistory(
                        {menu_box: p.menu_box, idm: p.idm},
                        t,
                        h,
                        function(){$('#' + this.menu_box + ' #' + this.idm).click()},
                        p.menu_box + '-' + p.idm,
                        p.history_walk_wait,
                        p.history
                    )
                }
                if (page.after_change){page.after_change.call(window, last[0], page, event)}
            }
        }
        if (page.always_after){page.always_after.call(window, last[0], page, event)}
        if (! curr_page[0] && ! page.file && page.action.showSection && page.action.defaultPage){$('#' + page.menu_box + ' #' + page.menu_id + page.action.defaultPage).click()}

        return jvMenu[page.uin].ajax_page
    }

    jvMenu.menu = function(menu, callback_init){

        menu.set = menu.set || 'jvmenu_main'
        if (! menu.sectionTag || ! $.isPlainObject(menu.sectionTag)){menu.sectionTag = {}}
        if (! menu.section_id || ! $.isPlainObject(menu.section_id)){menu.section_id = {}}
        menu.sectionTag['line'] = menu.sectionTag['line'] || 'div'; menu.sectionTag['menu'] = menu.sectionTag['menu'] || 'div'; menu.sectionTag['page'] = menu.sectionTag['page'] || 'div'
        menu.section_id['line'] = menu.section_id['line'] || menu.sectionName || 'jvmenu_section'; menu.section_id['menu'] = menu.section_id['menu'] || menu.sectionName || 'jvmenu_section'; menu.section_id['page'] = menu.section_id['page'] || menu.sectionName || 'jvmenu_section'
        menu.line_box = $('<div>', {id: menu.section_id['line'] + 'line'}).appendTo($('<' + menu.sectionTag['line'] + '>', {id: menu.section_id['line']}).appendTo($(menu.line_box)))
        menu.menu_box = $('<div>', {id: menu.section_id['menu'] + 'menu'}).appendTo($('<' + menu.sectionTag['menu'] + '>', {id: menu.section_id['menu']}).appendTo($(menu.menu_box)))
        menu.page_box = $('<div>', {id: menu.section_id['page'] + 'page'}).appendTo($('<' + menu.sectionTag['page'] + '>', {id: menu.section_id['page']}).appendTo($(menu.page_box)))

        if (! $.isArray(callback_init)){callback_init = [callback_init]}
        menu.callback = function(uin){
            var me = this
            $.each(arguments.callee.callback_init, function(i, val){
                switch (val) {
                    case 'full':
                        me[uin].head.click(me.full)
                        break
                    case 'login':
                        if (menu.deferred){me[uin].head.click(function(){menu.deferred.call()})}
                        break
                    case 'login-full':
                        if (menu.deferred){
                            me[uin].head.click(function(e){
                                var deferred = $.Deferred()
                                $.when(menu.deferred.call(null, null, deferred), deferred)
                                    .done(function(){me.full(e); if (BrowserHistory && BrowserHistory.walk_wait){BrowserHistory.walk_wait.resolve()}})
                            })
                        }
                        else {me[uin].head.click(me.full)}
                        break
                    case 'firstchildren':
                        me.children(me[uin].head, 'open')
                        break
                    default:
                        if ($.isFunction(val)){val.call(me, uin)}
                        else {me.ready(uin, val)}
                }
            })
        }
        if ($.inArray('login-full', callback_init) > -1){menu.history_walk_wait = true}
        menu.callback.callback_init = callback_init
        return jvMenu.create(menu)
    }
    jvMenu.ready = function(uin, callback_init){
        var me = this
        uin = GetRealUIN(uin)
        if (! $.isArray(callback_init)){callback_init = [callback_init]}
        $.each(callback_init, function(i, val){
            if (typeof(val) == 'string' && val.search('hash') == 0){
                var hash = me.hash()
                if (hash[0] && hash[1] && $('#' + hash[0] + ' #' + hash[1]).data('page') && $('#' + hash[0] + ' #' + hash[1]).data('page').file){$('#' + hash[0] + ' #' + hash[1]).click(); return true}
                else if (val = val.split('|')[1]){if (! isNaN(+val)){val = +val}}
                else {return true}
            }
            if (typeof(val) == 'number'){
                if (val == 0)    {me[uin].head.click()}
                else if (val > 0){me[uin].head.children('div:eq(' + (val - 1) + ')').click()}
                return true
            }
            switch (val) {
                case 'head+load':
                    me[uin].head.click(); me.load(me[uin].head.find('div'))
                    break
                case 'head>load':
                    me[uin].head.children('div:first').click(); me.load(me[uin].head.find('div').not('div:first'))
                    break
                case 'load+*':
                    me.load(me[uin].head); me.load(me[uin].head.find('div'))
                    break
                case 'load*':
                    me.load(me[uin].head.find('div'))
                    break
                default:
                    if ($.isFunction(val)){val.call(me, uin)}
            }
        })
    }
    jvMenu.hash = function(){var ret = location.hash.match(/[^#]+/); if (ret){return ret[0].split('-')} else {return ['']}}
    jvMenu.load = function(name, pp, hide){
        if (! name) {return this}
        if (typeof(hide) == 'undefined'){hide = true}
        if (typeof(name) == 'object'){$(name).each(function(){ShowPage({target: this}, hide)})}
        else if ($.isArray(pp)) {$.each(pp, function(i, val){ShowPage({target: $('#' + name + (val || ''))[0]}, hide)})}
        else if (! pp || pp == '+*') {$('#' + name + ', #' + name + ' div').each(function(){ShowPage({target: this}, hide)})}
        else if (pp == '+>')         {$('#' + name + ', #' + name + '>div').each(function(){ShowPage({target: this}, hide)})}
        else if (pp == '*') {$('#' + name + ' div').each(function(){ShowPage({target: this}, hide)})}
        else if (pp == '>') {$('#' + name + '>div').each(function(){ShowPage({target: this}, hide)})}
        return this
    }
    jvMenu.loadPage  = function(e){ShowPage(e, true)}
    jvMenu.showPage  = ShowPage
    jvMenu.children = Children
    //jvMenu.toggleSection = ToggleSection
    jvMenu.full = function(e){ShowPage(e)}
    window.jvMenu = jvMenu;
})(window);

function BrowserHistory(){

    var history_init = arguments.callee, history_name
    if (! history_init.called){history_init.called = false}
    if (! history_init.walk_wait){history_init.walk_wait = $.Deferred()}
    if (! history_init.handlers){history_init.handlers = {}}
    if (! (history && history.pushState && JSON)){return history_init}

    if (arguments.length == 1 && typeof(arguments[0]) == 'object'){history_name = arguments[0].name}
    else if (arguments.length == 1){history_name = arguments[0]}
    else if (arguments.length  > 1){history_name = arguments[6]}

    if (typeof(history_name) != 'number' && typeof(history_name) != 'string'){history_name = 0 /*'BrowserHistoryDefaultHandler'*/}
    if (! history_init.handlers[history_name]){history_init.handlers[history_name] = Handler(history_name); history_init.handlers[history_name].pop.call()}

    if (arguments.length == 1 && typeof(arguments[0]) == 'object'){history_init.handlers[history_name].set(arguments[0].state, arguments[0].title, arguments[0].url, arguments[0].func, arguments[0].last, arguments[0].walk_wait)}
    else if (arguments.length  > 1){history_init.handlers[history_name].set(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5])}

    return history_init

    function Handler(name){
        return new function(name){
            var me = this, history_func, history_walk, history_last = NaN
            this.name = name
            this.set = function(state, title, url, func, last, walk_wait){
                state = JSON.stringify(state)
                if (typeof(title) != 'number' && typeof(title) != 'string'){title = ''}
                if (typeof(url) != 'number' && typeof(url) != 'string'){url = null}
                if ($.isFunction(last)){last = last.call()}
                if (! history_walk && history_last != last){
                    if (func && $.isFunction(func)){
                        state = {state: state, func: func.toString(), walk_wait: JSON.stringify(walk_wait), name: JSON.stringify(me.name)}
                    }
                    if (! history_init.called){history.replaceState(state, title, url); history_init.called = true}
                    else {history.pushState(state, title, url)}
                }
                if (last){history_last = last}
            }
            this.get = function(event){
                if (history_init.called && history.state && history.state.name && (JSON.parse(history.state.name) === me.name)
                        && history.state.state && (typeof(history.state.state) == 'string')
                        && history.state.func && (typeof(history.state.func) == 'string') && $.isFunction(history_func = eval('(' + history.state.func + ')'))){
                    history_walk = true
                    history_init.walk_wait = $.Deferred()
                    history_func.call(JSON.parse(history.state.state))
                    if (JSON.parse(history.state.walk_wait)){
                        $.when(history_init.walk_wait).done(function(){history_walk = false}).fail(function(){history_walk = false})
                    }
                    else {history_walk = false}
                }
            }
            this.pop = function(){window.addEventListener('popstate', me.get, false)}
        }(name)
    }
}
