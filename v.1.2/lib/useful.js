function ShowWarning(msg, time, n, x, y, bcolor, color){
    if ($.isEmptyObject($('#warning-message')[0])){$('body').prepend($('<div>', {id: 'warning-message'}))}
    if (! n){n = 0}
    var wmid = '#warning-message' + n
    if ($.isEmptyObject($(wmid)[0])){
        $('#warning-message').append($('<div>', {id: 'warning-message' + n}).css({position: 'fixed', padding: '4px'}).hide()
            .click(function(){$(this).hide()}).append($('<div>').css({'border-width': '1px', 'border-style': 'solid', padding: '4px'})))
    }
    if (bcolor){$(wmid).css('background-color', bcolor)}
    if (color){$(wmid).css('color', color)}
    if (msg){$(wmid + '>div').html(msg)}
    if (isNaN(x)){x = $(window).width()/2 - $(wmid).width()/2}
    if (isNaN(y)){y = $(window).height()/2 - $(wmid).height()/2}
    if (x >= 0){$(wmid).css('left', x + 'px')}
    if (y >= 0){$(wmid).css('top',  y + 'px')}
    if (time === 0){return}
    if (! time){time = -1}
    if (time < 0){$(wmid).show()}
    else         {$(wmid).show().fadeOut(time)}
}

function RunDelay(d){ // Лисица не показывает - добавить .promise().done() для div (jQuery 1.6+)
    if (! Date || ! Date.now){return false}
    var b = i = Date.now(), e, r, p
    if (isNaN(d)){d = 5000} else {d = d * 1000}; p = d
    $('<div>').attr({id : i}).css({'background-color': 'red', color: 'black', display: 'inline-block', position: 'fixed', top: '2ex', left: '2em'})
        .append($('<span>').text('Waiting: ')).append($('<span>').text(d/1000)).prependTo('body')
    while (true){e = Date.now(); r = d - e + b; if (r <= 0) {break}; if (p - r > 1000){$('#' + i + '>span:eq(1)').text(Math.ceil(r/1000)); p = r}}
    $('#' + i).remove()
    return true
}

function TxtToHTML(txt, p){
    if (p == 'p'){return txt.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\r?\n/g, '</p><p>').replace(/^/, '<p>') + '</p>'}
    else if (p)  {return txt.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\r/g, '').replace(/^(\s*?)\n/gm, '$1<br>\n').replace(/\r?\n/g, '</div><div>').replace(/^/, '<div>') + '</div>'}
    else         {return txt.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\r?\n/g, '<br>')}
}

function JSBacklight(obj){
    if (typeof(obj) == 'object' && (obj.innerHTML || obj.jquery)){text = $(obj).html()}
    else if (typeof(obj) == 'string'){text = obj; obj = null}
    if (! text){return ''}

    function S(s, c){return '<span class="' + c + '">' + s.replace(/<.*?>/g, '') + '</span>'}
    function B(s, c){
        rs = new RegExp(s, 'g')
        text = text.replace(rs, function(ss){return S(ss, c)})
    }
    function BS(s, c){
        tag = false
        rs = new RegExp('(<[^>]*?)?' + '(>[^<]*?)?(' + s + ')', 'g')
        text = text.replace(rs, function(ss, p1, p2, ps, os, str){
            p1 = p1 || ''; p2 = p2 || ''
            if (p1 && ! p2){tag = true; return ss}
            else if (tag && p2){tag = false}
            else if (tag){return ss}
            return p1 + p2 + S(ps, c)
        })
    }
    /*BS('[\\{\\}\\(\\)\\[\\]]+', 'sign')
    BS('(&amp;){2,}', 'sign'); BS('\\|\\|', 'sign')
    BS('[=!+*.,:?%~^\\x2D]+', 'sign')
    BS('(&lt;)+', 'sign'); BS('(&gt;)+', 'sign')
    B("'.*?'", 'string')
    text = text.replace(/([^<])\/(.*?)(([^<]\/\w*)|(<\/div>))/g, function(ss, p1, p2, p3, p4, p5, os, str){
        p1 = p1 || ''; p2 = p2 || ''; p3 = p3 || ''; p4 = p4 || ''; p5 = p5 || ''
        if (p5){return p1 + S('/', 'sign') + p2 + p3}
        else if ((p2 + p3.charAt(0)).replace(/<.*?>/g, '').search('\\s') == -1){return p1 + S('/' + p2 + p3, 'regexp')}
        return ss
    })*/

    var i, r, rs, text, ch, tag, beg_q, beg_s, beg_sn, beg_m, beg_d, beg_w, beg_c, quote1, quote2, slash, regexp, sign, mnemo, digit, word, comment
    var sns = '{}()[]=!|+*-.,;:?%~^', ms = ['&amp;', '&lt;', '&gt;'], ds = '0123456789'
    var ws_b = new RegExp('[A-Za-z_]'), ws_e = new RegExp('\\W'), ws = ['break', 'const', 'continue', 'do', 'while', 'export', 'for', 'in', 'function', 'if', 'else', 'import', 'return', 'switch', 'case', 'default', 'throw', 'try', 'catch', 'var', 'with', 'delete', 'instanceof', 'new', 'this', 'typeof', 'void']
    function SI(s, c, b, e){
        b = b || 0; e = e || s.length; //i = i + c.length + 22
        r = s.substring(0, b) + '<span class="' + c + '">' + s.substring(b, e).replace(/<.*?>/g, '') + '</span>' + s.substring(e)
        i = i + r.length - s.length
        return r
    }
    text = text.replace(/(.*?)((\n)|(<br>)|(<\/p>)|(<\/div>)|$)/g, function(ss, ps, es){// (\n) - не проверял
        tag = false; beg_c = -1; quote1 = false; quote2 = false; slash = false; regexp = false; sign = false; mnemo = false; digit = false; word = false
        for (i = 0; i < ps.length + 1; i++){
            ch = ps.charAt(i)
            if (ch == '<'){tag = true}
            else if (tag && ch == '>'){tag = false}
            else if (! tag){
                if (comment && beg_c == -1){beg_c = i}
                if (comment && ps.charAt(i - 1) == '*' && ch == '/'){
                    quote1 = false; quote2 = false; slash = false; regexp = false; sign = false; mnemo = false; digit = false; word = false; comment = false
                    ps = SI(ps, 'comment', beg_c, i + 1); continue
                }
                else if (comment && ! ch){ps = SI(ps, 'comment', beg_c); break}
                else if (comment){continue}
                if (regexp && ch.search('[gim]') == -1){
                    quote1 = false; quote2 = false; slash = false; regexp = false; sign = false; mnemo = false; digit = false; word = false
                    ps = SI(ps, 'regexp', beg_s, i)
                }
                if      (sign && (sns.indexOf(ch) == -1 || ! ch)){sign = false; ps = SI(ps, 'sign', beg_sn, i)}
                if      (digit && (ds.indexOf(ch) == -1 || ! ch)){digit = false; ps = SI(ps, 'digit', beg_d, i)}
                if      (word && (ch.search(ws_e) != -1 || ! ch) && $.inArray(word, ws) != -1){word = false; ps = SI(ps, 'oper', beg_w, i)}
                else if (word && ch.search(ws_e) != -1){word = false}
                else if (word){word = word + ch}
                if      (! quote1 && ! quote2 && ! mnemo && ! word && ch && ch.search(ws_b) != -1){word = ch; beg_w = i}
                if      (! quote1 && ! quote2 && ! mnemo && ! word && ! digit && ch && ds.indexOf(ch) != -1){digit = true; beg_d = i}
                if      (! quote1 && ! quote2 && ! mnemo && ! word && ! digit && ! sign && ch && sns.indexOf(ch) != -1){sign = true; beg_sn = i}

                if      (! quote1 && ! quote2 && ! mnemo && ch == '&'){mnemo = '&'; beg_m = i}
                else if (mnemo && ch == ';' && $.inArray(mnemo + ch, ms) != -1){mnemo = false; ps = SI(ps, 'sign', beg_m, i + 1)}
                else if (mnemo && ch == ';'){mnemo = false}
                else if (mnemo){mnemo = mnemo + ch}
                if      (! quote1 && ! quote2 && ch == "'"){quote1 = true; beg_q = i}
                else if (quote1 && (ch == "'" || ! ch)){quote1 = false; ps = SI(ps, 'string', beg_q, i + 1)}
                else if (! quote1 && ! quote2 && ch == '"'){quote2 = true; beg_q = i}
                else if (quote2 && (ch == '"' || ! ch)){quote2 = false; ps = SI(ps, 'string', beg_q, i + 1)}
                if      (! quote1 && ! quote2 && ! slash && ch == '/'){slash = true; beg_s = i}
                else if (slash && (ch == ' ' || ! ch)){slash = false; ps = SI(ps, 'sign', beg_s, beg_s + 1)}
                else if (slash && ch == '/' && (i == beg_s + 1)){slash = false; ps = SI(ps, 'comment', beg_s); break}
                else if (slash && ch == '*' && (i == beg_s + 1)){slash = false; comment = true; beg_c = beg_s}
                else if (slash && ch == '/'){slash = false; regexp = true}
            }
        }
        return ps + es
    })

    if (obj){$(obj).html(text)}
    return text
}

function ExecJSFile(file, errmsg, callback, param, obj, deferred){
    return $.ajax({
        url: file,
        cache: false,
        dataType: 'text',
        error: function(){if (errmsg) {ShowWarning(errmsg, -1)}},
        success: function(data){$.globalEval(data); if (callback) {callback.call(obj, param, deferred)}}
    })
}

function RootURL(){
    return window.location.protocol + '//' + window.location.host
}

function Host(callback, param, obj){
    $.ajax({
        url: RootURL() + '/lib/useful.php',
        type: 'POST',
        data: {func: 'Host'},
        dataType: 'text',
        error: function(a,b,c){},
        success: function(data){if (callback) {callback.call(obj, param, data)}}
    })
}

function FileInfo(file, ret){ // можно добавить callback() и не передавать ret
    $.ajax({
        url: RootURL() + '/lib/useful.php',
        type: 'POST',
        data: {func: 'FileInfo', file: file},
        dataType: 'json',
        error: function(a,b,c){},
        success: function(data){$(ret).data('fileinfo', data).ins$('<table>').attr('border', '1').ins$('<tbody>').ins$('<tr>').app$('<td>', {text: data.file}).app$('<td>', {text: data.lastmod}).app$('<td>', {text: data.size + ' b'})}
    })
}

function ReadHTMLFile(file, ret){ // можно добавить callback() и не передавать ret
    $.ajax({
        url: RootURL() + file,
        type: 'POST',
        data: {},
        dataType: 'html',
        error: function(a,b,c){},
        success: function(data){$(ret).html(data)}
    })
}

function VarSession(name, ret, stamp){
    $.ajax({
        url: RootURL() + '/lib/useful.php',
        type: 'POST',
        data: {func: 'VarSession', name: name, stamp: stamp},
        dataType: 'json',
        error: function(a,b,c){},
        success: function(data){
            $(ret).data('varsession', data).ins$('<table>').attr('border', '1')
            $.each(data, function(i, val){$(ret).children('table:last').ins$('<tr>').app$('<td>', {text: i}).app$('<td>', {text: val})})
        }
    })
}

function SetVarSession(name, key, value, page){ // не используется
    $.ajax({
        url: RootURL() + '/lib/useful.php',
        type: 'POST',
        data: {func: 'SetVarSession', name: name, key: key, value: value, page: page},
        dataType: 'text',
        error: function(a,b,c){},
        success: function(data){}
    })
}

function SysCommand(param, con, ret){
    param.func = 'SysCommand'
    $.ajax({
        url: RootURL() + '/lib/useful.php',
        type: 'POST',
        data: param,
        dataType: 'text',
        error: function(a,b,c){},
        success: function(data){
            var hdata = '<div>' + data.replace(/\n/g, '<br>') + '</div>'
            //if (con) {$(con).html($(con).html() + hdata)}
            if (con) {$(con).val($(con).val() + data)}
            if (ret) {$(ret).html(hdata)}
        }
    })
}

function News(news){
    function Prop(p){
        if (! curr){return}
        if (curr[0].tagName == 'A' && p.href){curr.attr({href: p.href, target: '_blank'})}
        if (p.html){curr.html(p.html)}
        if (p.text){curr.text(p.text)}
        if (p.attr){curr.attr(p.attr)}
        if (p['class']){curr.addClass(p['class'])}
        if (p.css){curr.css(p.css)}
        if (p['float']){curr.css('float', p['float'])}
        if (p.clear){curr.css('clear', p.clear)}
    }
    if (! news || ! news[0] || ! $(news[0]).length){return}
    var content = $('<div>').appendTo($(news[0])), curr
    $.each(news, function(n, val){
        if (n == 0){return}
        curr = false
        if ($.isFunction(val)){val = val.call(null, val, n, news)}
        if (! val){return}
        if (! $.isPlainObject(val)){val = {p: val}}
        if (val.frame || val.url){
            curr = $('<iframe>').attr({src: val.src || val.url || ''}).css('border', 0).text('Извините, но Ваш браузер не может отобразить содержимое этого фрейма!').appendTo(content)
            curr.attr({width: val.width || '50%'}).attr({height: val.height || (val.ratio == '16:9' ? curr.width() * 9 / 16 : curr.width() * 3 / 4)})
            if ($.isPlainObject(val.frame)){Prop(val.frame)}
            else if (typeof(val.frame) == 'string'){curr.html(val.frame)}
        }
        if (val.img){
            curr = $('<img>').attr({src: val.src || val.img || '', alt: val.alt || 'Изображение'}).appendTo(content)
            if (val.width){curr.css('width', val.width)}; if (val.height){curr.css('height', val.height)}
            if ($.isPlainObject(val.img)){Prop(val.img)}
            //else if (typeof(val.img) == 'string'){curr.html(val.img)}
        }
        if (val.a){
            curr = curr ? curr.wrap('<a>').parent() : $('<a>').appendTo(content)
            if ($.isPlainObject(val.a)){Prop(val.a)}
            else if (typeof(val.a) == 'string'){curr.html(val.a).attr({href: val.href || val.a, target: '_blank'})}
        }
        if (val.p){
            curr = curr ? curr.wrap('<p>').parent() : $('<p>').appendTo(content)
            if ($.isPlainObject(val.p)){Prop(val.p)}
            else if (typeof(val.p) == 'string'){curr.html(val.p)}
        }
        if (val.div){
            curr = curr ? curr.wrap('<div>').parent() : $('<div>').appendTo(content)
            if ($.isPlainObject(val.div)){Prop(val.div)}
            else if (typeof(val.div) == 'string'){curr.html(val.div)}
        }
        if (val.figure){
            curr = curr ? curr.wrap('<figure>').parent() : $('<figure>').appendTo(content)
            if ($.isPlainObject(val.figure)){Prop(val.figure)}
            else if (typeof(val.figure) == 'string'){curr.html(val.figure)}
            if (val.figcaption){
                curr = val.figcaption == -1 ? $('<figcaption>').prependTo(curr) : $('<figcaption>').appendTo(curr)
                if ($.isPlainObject(val.figcaption)){Prop(val.figcaption)}
                else if (typeof(val.figcaption) == 'string'){curr.html(val.figcaption)}
                curr = curr.parent()
            }
        }
        if (val.sign){
            curr = curr ? curr.wrap(val.tag || '<h6>').parent() : $(val.tag || '<h6>').appendTo(content)
            if ($.isPlainObject(val.sign)){Prop(val.sign)}
            else if (typeof(val.sign) == 'string'){curr.html(val.sign)}
        }
        if (val.header){
            curr = curr ? curr.wrap(val.tag || '<h3>').parent() : $(val.tag || '<h3>'); content.before(curr.click(function(){content.slideToggle()}))
            if ($.isPlainObject(val.header)){Prop(val.header)}
            else if (typeof(val.header) == 'string'){curr.html(val.header)}
        }
        if (val.tag){curr = curr ? curr.wrap(val.tag).parent() : $(val.tag).appendTo(content)}
        if (val.wrap){curr = curr ? curr.wrap(val.wrap).parent() : curr/*$(val.wrap).appendTo(content)*/}
        Prop(val)
        if (val.func){val.func.call(curr, val, n, news)}
    })
}

function Stories(obj){
    $(obj).html($(obj).html().replace(new RegExp('http://([^\\s<>])*', 'g'), '<a href="$&" target="_blank">$&</a>').replace((new RegExp('(<[^>]*?>)\\s+(</.*?>)', 'g')), '$1&nbsp;$2'))
    $(obj).addClass('stories').children().first().addClass('comment').next().addClass('link').next().addClass('author').next().addClass('title').nextAll().addClass('text')
}

function Links(obj, sign, nsign){
    $(obj).addClass('links').children('div').each(function(i){
        var a = $(this).children('a').first(), s = $(this).children('span'), n
        if (! sign){n = '&bull; '}
        else if (sign == 'number'){n = nsign ? (i + 1) + nsign : (i + 1) + '. '}
        else {n = sign}
        if (! a.length){return}
        if (! a.attr('href')){a.attr('href', a.text())}
        if (! a.attr('target')){a.attr('target', '_blank')}
        if (s.length){a.append(s)}
        $('<p>').addClass('title').append('<span>' + n + '</span>').append(a).prependTo(this)
        $(this).children().not(':first').addClass('comment')
    })
}