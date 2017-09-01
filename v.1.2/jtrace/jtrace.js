/*
   jTrace ver. 1.02
   02.06.2011
   © 2011 Dmitry Sokolov
*/

jQuery.fn.extend({
	ins$:			function(tag, par){return $(tag, par).appendTo(this)},
	insA:			function(par){return $('<a>', par).appendTo(this)},
	insP:			function(par){return $('<p>', par).appendTo(this)},
	insPre:			function(par){return $('<pre>', par).appendTo(this)},
	insDiv:			function(par){return $('<div>', par).appendTo(this)},
	insSpan:		function(par){return $('<span>', par).appendTo(this)},
	insButton:		function(par){return $('<button>', par).appendTo(this)},
	insImg:			function(par){return $('<img>', par).appendTo(this)},
	insInput:		function(par){return $('<input>', par).appendTo(this)},
	insCheckBox:	function(par){
		var txt=''
		if (par){txt = par.text; delete par.text}
		else {par = {}}
		par.type = 'checkbox'
		if (txt){this.append($('<input>', par)); return $('<span>', {text: txt, title: par.title, click: function(){
			if (! $(this).prev()[0].disabled) {$(this).prev().click()}}   }).appendTo(this)}
		else {return $('<input>', par).appendTo(this)}
		},
	insRadio:   	function(par){
		var txt=''
		if (par){txt = par.text; delete par.text}
		else {par = {}}
		par.type = 'radio'
		if (txt){this.append($('<input>', par)); return $('<span>', {text: txt, title: par.title, click: function(){
			if (! $(this).prev()[0].disabled) {$(this).prev().click()}}   }).appendTo(this)}
		else {return $('<input>', par).appendTo(this)}
		}
});
jQuery.fn.extend({
	app$:			function(tag, par, css){if (css){return this.append($(tag, par).css(css))}else {return this.append($(tag, par))}},
	appA:			function(par, css){if (css){return this.append($('<a>', par).css(css))}else {return this.append($('<a>', par))}},
	appP:			function(par, css){if (css){return this.append($('<p>', par).css(css))}else {return this.append($('<p>', par))}},
	appPre:			function(par, css){if (css){return this.append($('<pre>', par).css(css))}else {return this.append($('<pre>', par))}},
	appDiv:			function(par, css){if (css){return this.append($('<div>', par).css(css))}else {return this.append($('<div>', par))}},
	appSpan:		function(par, css){if (css){return this.append($('<span>', par).css(css))}else {return this.append($('<span>', par))}},
	appButton:		function(par, css){if (css){return this.append($('<button>', par).css(css))}else {return this.append($('<button>', par))}},
	appImg:			function(par, css){if (css){return this.append($('<img>', par).css(css))}else {return this.append($('<img>', par))}},
	appInput:		function(par, css){if (css){return this.append($('<input>', par).css(css))}else {return this.append($('<input>', par))}},
	appCheckBox:	function(par){
		var txt=''
		if (par){txt = par.text; delete par.text}
		else {par = {}}
		par.type = 'checkbox'
		if (txt){return this.append($('<input>', par)).append($('<span>', {text: txt, title: par.title, click: function(){
			if (! $(this).prev()[0].disabled) {$(this).prev().click()}}   }))}
		else {return this.append($('<input>', par))}
		},
	appRadio:	function(par){
		var txt=''
		if (par){txt = par.text; delete par.text}
		else {par = {}}
		par.type = 'radio'
		if (txt){return this.append($('<input>', par)).append($('<span>', {text: txt, title: par.title, click: function(){
			if (! $(this).prev()[0].disabled) {$(this).prev().click()}}   }))}
		else {return this.append($('<input>', par))}
		}
});

(function(window){

   function quirkmode(){
      if ($.browser.msie && parseInt($.browser.version) < 8){return true}
      else return false
   }

   function toStr(str){
      str += 'Z'
      return str.substr(0, str.length - 1)
   }

   function toNumber(str){
      str = parseInt(str, 10)
      return isNaN(str) ? 0 : str
   }

   function valid(str){
      if (str == null || typeof(str) == 'undefined'){return false}
      return true
   }

   function validObj(obj){
      var ret = false
      if (obj === null) {ret = null}
      else if (typeof(obj) == 'object') {ret = $.isArray(obj) ? 'array' : 'object'}
      else if (typeof(obj) == 'function') {ret = 'function'}
      return ret
   }

   function keyDebug(e){
      str = ''; key = String.fromCharCode(e.which)
      if (keyTrace){
         if (e.ctrlKey) {str += 'Ctrl+'}
         if (e.altKey) {str += 'Alt+'}
         if (e.shiftKey) {str += 'Shift+'}
         str = str + key + '-' + e.which
         jTrace().printVal(str, 'Key Code')
      }
      n = pass.indexOf(key)
      if (n === 0){if (pass.length === 1){pass = password; $(node.jTrace).show()} else {pass = pass.substr(1)}}
      else {pass = password}
   }

   function switchStack(){
      stackIsOn = ! stackIsOn
      $(node.Debug).toggleClass('jt-debug').toggleClass('jt-stack')
      if (stackIsOn) {$(node.swStack).attr('src', imgCol.debug).attr('alt', 'Debug')}
      else {$(node.swStack).attr('src', imgCol.stack).attr('alt', 'Stack')}
      return false
   }

   //Не используется
   function closeAll(){
      $(node.Config).hide('fast')
      if (debugIsOn){runDebug()}
      $(node.Title).hide()
   }

   function initConfig(){
      $(sel.jTrace).insDiv({className: 'jt-config', click: eventConfigC, keypress: eventConfigK}).addClass('jt-back').hide().focusin(saveVal)
      $(sel.Config).insDiv({className: 'jt-sep'}).ins$('<table>', {align: 'center', cellspacing: 0}).ins$('<tbody>', {align: 'left'})
      .append($('<tr>')
         .append($('<td>'))
         .append($('<td>').appInput({type: 'text', size: 2, maxlength: 3}).appSpan({text: 'px'}))
         .append($('<td>').appButton({text: 'OK'}).appButton({text: 'R'}).appButton({text: 'A'})) )
      .append($('<tr>')
         .append($('<td>'))
         .append($('<td>').appInput({type: 'text', size: 2, maxlength: 4}).appSpan({text: 'px'}))
         .append($('<td>').appButton({text: 'OK'}).appButton({text: 'R'}).appButton({text: 'A'})) )
      .append($('<tr>')
         .append($('<td>'))
         .append($('<td>').appInput({type: 'text', size: 2, maxlength: 2}).appSpan({text: 'px'}))
         .append($('<td>').appButton({text: 'OK'}).appButton({text: 'R'})) )
      
      $(sel.Config).insDiv({className: 'jt-sep'})
      .appInput({type: 'text', size: 18, value: '--- Test ---'})
      .appButton({text: 'Test', click: function(){jTrace($(node.Text).val())}})
      
      $(sel.Config).insDiv({className: 'jt-sep'})
      .appCheckBox({text: 'N ', click: function(){configTrace({coltoggle: 0})}})
      .appCheckBox({text: 'V ', click: function(){configTrace({coltoggle: 1})}})
      .appCheckBox({text: 'T ', click: function(){configTrace({coltoggle: 2})}})
      .appCheckBox({text: 'C ', click: function(){configTrace({coltoggle: 3})}})
      
      $(sel.Config).insDiv({className: 'jt-sep'})
      .appCheckBox({text: 'Sc ', click: function(){configTrace({scroll: 'toggle'})}})
      .appCheckBox({text: 'K ',  click: function(){configTrace({keytrace: 'toggle'})}})
      .appCheckBox({text: 'St ', click: function(){configTrace({stopon: 'toggle'})}})
      .appCheckBox({text: 'Q '})
      
      $(sel.Config).insDiv({className: 'jt-sep'})
      .appCheckBox({text: 'T ', click: function(){configTrace({trace: 'toggle'})}})
      .appCheckBox({text: 'W ', click: function(){configTrace({wakeup: 'toggle'})}})
      .appCheckBox({text: 'Turn Off '})

      $(sel.Config).insDiv({className: 'jt-sep'})
      .appButton({text: 'Clear', click: function(){configTrace({clear: ''})}})
      .appButton({text: 'PrintStack', click: printStack})
      .appButton({text: 'Browser', click: function(){$.each(jQuery.browser, function(i, val){jTrace(i + ': ' + val)})}})

      $(sel.Config).insDiv({className: 'jt-sep'})
      .appButton({text: 'English', click: function(){configTrace({lang: 'eng'})}})
      .appButton({text: 'Русский', click: function(){configTrace({lang: 'rus'})}})

      $(sel.Config).insDiv({align: 'center'}).addClass('jt-blue').append($('<a>').html('&copy 2011 Dmitry Sokolov'))
      $(sel.Config).insDiv({align: 'center'}).addClass('jt-blue').append($('<a>').attr('target', '_blank')
         .attr('href', 'http://newsru.com/').html('Welcome'))
   }

   function eventConfigC(event){
      bt = $(sel.Config + ' *').index(event.target)
      switch (bt){
         case $(sel.Config + ' *').index($(node.hResize)): configTrace({height: $(node.hSize).val()}); break
         case $(sel.Config + ' *').index($(node.hReset)):  configTrace({height: heightDI}); break
         case $(sel.Config + ' *').index($(node.hAuto)):   configTrace({height: 'auto'}); break
         case $(sel.Config + ' *').index($(node.wResize)): configTrace({width: $(node.wSize).val()}); break
         case $(sel.Config + ' *').index($(node.wReset)):  configTrace({width: widthDI}); break
         case $(sel.Config + ' *').index($(node.wAuto)):   configTrace({width: 'auto'}); break
         case $(sel.Config + ' *').index($(node.fResize)): configTrace({fontSize: $(node.fSize).val()}); break
         case $(sel.Config + ' *').index($(node.fReset)):  configTrace({fontSize: fontDI}); break
         case $(sel.Config + ' *').index($(node.Quirk)):
            quirk = ! quirk; $(node.QuirkIcon).toggle();resetDebug()
            break
         case $(sel.Config + ' *').index($(node.TurnOff)):
            if (turnOff) {turnOff = ! turnOff; configTrace({turn: 'chon'})}
            else {configTrace({turn: 'choff'})}
            break
      }
      event.stopPropagation()
   }

   function eventConfigK(event){
      bt = $(sel.Config + ' *').index(event.target)
      switch (bt){
         case $(sel.Config + ' *').index($(node.hSize)):
               if (event.which == 13) {$(node.hResize).click(); saveVal(event)}
               if (event.which == 27) {$(node.hSize).val(tempval)}
            break
         case $(sel.Config + ' *').index($(node.wSize)):
               if (event.which == 13) {$(node.wResize).click(); saveVal(event)}
               if (event.which == 27) {$(node.wSize).val(tempval)}
            break
         case $(sel.Config + ' *').index($(node.fSize)):
               if (event.which == 13) {$(node.fResize).click(); saveVal(event)}
               if (event.which == 27) {$(node.fSize).val(tempval)}
            break
         case $(sel.Config + ' *').index($(node.Text)):
               if (event.which == 13) {$(node.Test).click(); saveVal(event)}
               if (event.which == 27) {$(node.Text).val(tempval)}
            break
      }
      event.stopPropagation()
   }

   function saveVal(event){
      if ($(event.target)[0].nodeName === 'INPUT'){tempval = $(event.target).val()}
      event.stopPropagation()
   }

   function trDebug(p1, p2, p3, p4, n, o){
      td[0] = $('<td>', {className: 'jt-col0'}).append($('<div>').text(p1))
      if (validObj(p3)){
      td[1] = $('<td>', {className: 'jt-col1'}).append($('<div>').append($('<a>').text(p2).css('cursor', 'pointer').click(openObject)))
         if (quirk) {
            td[1].children('div:first')//.css('position', 'relative')
               .append($('<img>', {src: imgCol.update, alt: 'R', width: '0.75em', height: '0.75em'})//.attr({'width': '12', 'height': '12'})
                  .attr('title', title[lang].update).click(updateObject)
                  .css({/*'position': 'absolute', 'right': '0px', 'bottom': '0px', */'cursor': 'pointer'}))
         }
         else {
            td[1].children('div:first').css('position', 'relative')
               .append($('<img>', {src: imgCol.update, alt: 'R', width: '0.75em', height: '0.75em'})//.attr({'width': '12', 'height': '12'})
                  .attr('title', title[lang].update).click(updateObject)
                  .css({'position': 'absolute', 'right': '0px', 'bottom': '0px', 'cursor': 'pointer'}))
         }
      }
      else {
      td[1] = $('<td>', {className: 'jt-col1'}).append($('<div>').text(p2))
      }
      td[2] = $('<td>', {className: 'jt-col2'}).append($('<div>').text(typeof(p3)))
      td[3] = $('<td>', {className: 'jt-col3'}).append($('<div>').text(p4)).click(editComment)
      
      for (l = 0; l < colkol; l++){if (! column[l]){$(td[l]).hide()}}
      if (prnObj){padObj = n.match(/\./g); td[1].css({'padding-left': (padObj.length * 1) + 'em'}).addClass('jt-darkgreen')}
      
      td[4] = $('<tr>').append(td[0]).append(td[1]).append(td[2]).append(td[3]).click(markTr).data('n', n).data('open', o)
      if (innerObj.tr){innerObj.tr = td[4].insertBefore(innerObj.tr)}
      else {$(node.TBody).prepend(td[4])}
   }

   function trComment(num){
      l = $(sel.TBody + '>tr:first')
      k = num - comm.length
      do {
         if (l.data('n').toString().search(/\./) != -1) {continue}
         if (k > 0) {k--; continue}
         l.children('td:eq(3)').children('div:first').text(m = comm.pop())
         dumb[l.data('n')].comment = m
         if (comm.length == 0) {break}
      } while ((l = l.next())[0])
   }

   function markTr(event){
      $(this).children().toggleClass('jt-mark')
      return false
   }

   function updateObject(){
      innerObj.parent = $(this).parent().parent().parent()
      innerObj.tr = innerObj.parent
      innerObj.n = innerObj.parent.data('n')
      hideOpenObj('delete')
      innerObj.parent.data('open', 'na')
      dumb[innerObj.n].open = 'na'
      innerObj = {}
      $(this).prev().click()
      return false
   }

   function openObject(){
      innerObj.parent = $(this).parent().parent().parent()
      innerObj.tr = innerObj.parent
      innerObj.n = innerObj.parent.data('n')
      innerObj.open = innerObj.parent.data('open')
      innerObj.val = dumb[innerObj.n].val
      innerObj.prev = innerObj.n
      innerObj.next = dumb[innerObj.n].next
      if (validObj(innerObj.val)) {
         if (innerObj.open == 'yes'){hideOpenObj('hide'); innerObj.parent.data('open', 'no'); dumb[innerObj.n].open = 'no'}
         else if (innerObj.open == 'no'){hideOpenObj('show'); innerObj.parent.data('open', 'yes'); dumb[innerObj.n].open = 'yes'}
         else {jTrace().printObjOne(innerObj.val); innerObj.parent.data('open', 'yes'); dumb[innerObj.n].open = 'yes'}
      }
      innerObj = {}
      return false
   }

   function hideOpenObj(mode){
      innerObj.tr = innerObj.tr.prev()
      while (innerObj.tr.data('n').toString().indexOf(innerObj.n) === 0){
         if (mode == 'hide'){innerObj.tr.hide()}
         else if (mode == 'show'){
            if (innerObj.tr.data('n').toString().indexOf(innerObj.temp) === 0) {}
            else {
               if (innerObj.tr.data('open') == 'no') {innerObj.temp = innerObj.tr.data('n')}
               innerObj.tr.show()
            }
         }
         else if (mode == 'delete'){innerObj.del = innerObj.tr}
         innerObj.tr = innerObj.tr.prev()
         if (mode == 'delete'){
            dumb[dumb[innerObj.del.data('n')].prev].next = dumb[innerObj.del.data('n')].next
            if (dumb[innerObj.del.data('n')].next) {
            dumb[dumb[innerObj.del.data('n')].next].prev = dumb[innerObj.del.data('n')].prev
            } else {prevN = dumb[innerObj.del.data('n')].prev}
            delete dumb[innerObj.del.data('n')];
            innerObj.del.remove()
            dumb.len--
         }
         if (! innerObj.tr[0]){break}
      }
   }

   function editComment(event){
      div = $(this).children('div:first').hide()
      $(this).insInput({type: 'text', size: 16}).val(div.text()).focus()
         .focusout(function() {div.text($(this).val()).show(); dumb[$(this).parents('tr').data('n')].comment = $(this).val(); $(this).remove()})
         .keypress(function(e){
            if (e.which == 13){div.text($(this).val()).show(); dumb[$(this).parents('tr').data('n')].comment = $(this).val(); $(this).remove()}
            else if (e.which == 27){div.show();$(this).remove()}
            })
      return false
   }

   function printStack(){
      var i = 0
      $(sel.TBody + ' *').remove()
      while (valid(i)){
         if (dumb[i].open == 'no') {dumb[i].open = 'yes'}
         if (i.toString().search(/\./) != -1) {prnObj = true} else {prnObj = false}
         trDebug(dumb[i].prnN, dumb[i].name + dumb[i].prnname, dumb[i].val, dumb[i].comment, i, dumb[i].open)
         i = dumb[i].next
      }
      prnObj = false
      return false
   }

   //Нужна только для quirk
   function resetDebug(){
      if (debugIsOn){$(node.Debug).slideToggle('fast', function(){$(node.Debug).removeClass('jt-stack').addClass('jt-debug')})}
      $(node.swDebug).attr('src', imgCol.run)
      $(node.swStack).attr('src', imgCol.stack)
      debugIsOn = false
      stackIsOn = false
   }

   function runDebug(){
      $(node.Debug).slideToggle('fast')
      debugIsOn = ! debugIsOn
      if (debugIsOn){$(node.swDebug).attr('src', imgCol.stop).attr('alt', 'Stop'); $(node.count).removeClass('jt-red')}
      else {$(node.swDebug).attr('src', imgCol.run).attr('alt', 'Run')}
      return false
   }

   function initTools(){
      $(sel.Tool).insDiv()
         .append($('<div>').text('<').css('float', 'left').click(function(){wMarker = slideLeft(node.WatchList, wMarker);return false})
            .addClass('jt-wleft')).addClass('jt-blue')
         .append($('<div>').text('>').css('float', 'right').click(function(){wMarker = slideRight(node.WatchList, wMarker);return false})
            .addClass('jt-right')).addClass('jt-blue')
         .append($('<div>').css('overflow', 'hidden').append($('<div>').css('position', 'relative')
            .append($('<table>').css({'border-collapse': 'collapse', 'border-spacing': '0px'}).append($('<tbody>').append($('<tr>'))))
         ))
         .append($('<div>').css('clear', 'both'))
   }

// Для таблицы обязательно задавать border-spacing - даже если оно не нужно
// Если используется th - сделать нулевую строку с td.hide() - она и будет использоваться для прокрутки
   function slideRight(watchlist, marker, speed, step){
      var k, l, m, n, s, w
      if ($(watchlist).length == 0 || typeof(marker) != 'number'){return}
      if (! speed){speed = 'normal'}
      k = $(watchlist).find('tr:eq(0)>td').length
      m = marker, s = 0, l = $(watchlist).width()
      do {
         if (m >= k){return marker}
         w = $(watchlist).find('td:eq(' + m + ')')
         n = w.width() + toNumber(w.css('padding-left')) + toNumber(w.css('padding-right'))
            + toNumber(w.css('border-left-width')) + toNumber(w.css('border-right-width')) + toNumber(w.css('border-spacing'))
         s += n; m++
      } while (s < l)
      if (m == marker + 1){if (m == k){return marker};step = 1}
      if (step == 1){
         w = $(watchlist).find('td:eq(' + marker + ')')
         s = w.width() + toNumber(w.css('padding-left')) + toNumber(w.css('padding-right'))
            + toNumber(w.css('border-left-width')) + toNumber(w.css('border-right-width')) + toNumber(w.css('border-spacing'))
         marker++
      }
      else {s-= n; marker = m - 1}
      $(watchlist).animate({left: '-=' + s}, speed)
      return marker
   }

   function slideLeft(watchlist, marker, speed, step){
      var k, l, m, n, s, w
      if ($(watchlist).length == 0 || typeof(marker) != 'number'){return}
      if (! speed){speed = 'normal'}
      k = -1
      m = marker, s = 0, l = $(watchlist).width()
      do {
         if (m <= k){break}
         w = $(watchlist).find('td:eq(' + (m - 1) + ')')
         n = w.width() + toNumber(w.css('padding-left')) + toNumber(w.css('padding-right'))
            + toNumber(w.css('border-left-width')) + toNumber(w.css('border-right-width')) + toNumber(w.css('border-spacing'))
         s += n; m--
      } while (s < l)
      if (m == marker - 1){if (m == k){return marker};step = 1}
      if (step == 1){
         w = $(watchlist).find('td:eq(' + (marker - 1) + ')')
         s = w.width() + toNumber(w.css('padding-left')) + toNumber(w.css('padding-right'))
            + toNumber(w.css('border-left-width')) + toNumber(w.css('border-right-width')) + toNumber(w.css('border-spacing'))
         marker--
      }
      else {s-= n; marker = m + 1}
      $(watchlist).animate({left: '+=' + s}, speed)
      return marker
   }

   function initDebug(){
      $(sel.jTrace).insDiv({className: 'jt-debug'}).addClass('jt-back').hide()
      $(sel.Debug).insDiv({className: 'jt-title'}).addClass('jt-red')
      $(sel.Debug).insDiv({className: 'jt-tool'}).hide()
      $(sel.Debug).insDiv({className: 'jt-data'}).addClass('jt-green')
      $(sel.Data).insDiv().hide()
      $(sel.Data).append($('<table>').addClass('jt-table').attr('cellspacing', '0')
         .append($('<thead>').append($('<tr>').css('text-align', 'center').css('font-weight', 'bold')
            .append($('<td>', {className: 'jt-col0'}).css('text-align', 'center'))
            .append($('<td>', {className: 'jt-col1'}))
            .append($('<td>', {className: 'jt-col2'}))
            .append($('<td>', {className: 'jt-col3'})) ))
            .append($('<tbody>'))
      )
   }

   function initTitle(){
      $('body').insDiv({id: 'jTrace'})
      $(sel.jTrace).insDiv({align: 'right', className: 'jtrace-title'})
      $(sel.Title).insSpan({text: '«Sc»', className: 'jt-blue'}).hide()
      $(sel.Title).insSpan({text: '«K»', className: 'jt-blue'}).hide()
      $(sel.Title).insSpan({text: '«St»', className: 'jt-blue'}).hide()
      $(sel.Title).insSpan({text: '«Q»', className: 'jt-red'}).hide()
      $(sel.Title).insSpan({text: '«T»', className: 'jt-red'}).hide()
      $(sel.Title).insSpan({text: '«W»', className: 'jt-red'}).hide()
      $(sel.Title).insSpan({text: '«Turn Off»', className: 'jt-red'}).hide()
      $(sel.Title).insSpan({text: '«0»', className: 'jt-green'})
      $(sel.Title).insImg({click: function(){$(node.Config).toggle('fast'); return false}}).attr('src', imgCol.config).attr('alt', 'Config')
      $(sel.Title).insImg({click: switchStack}).attr('src', imgCol.stack).attr('alt', 'Stack')
      $(sel.Title).insImg({click: runDebug}).attr('src', imgCol.run).attr('alt', 'Run')
      $(sel.Title + ' > *').css('vertical-align', 'middle')
      $(sel.Title).insImg({click: function(){$(node.jTrace).hide(); return false}}).attr('src', imgCol.close).css('vertical-align', 'top').attr('alt', 'Close')
   }

   function refreshDebug(){
      if (debugIsOn){$(node.Debug).hide(0, function(){$(node.Debug).show(0)})}
   }

   function configTrace(con){
      if (typeof(con) != 'object'){return false}
      $.each(con, function(i, val){
         switch (i){
            case 'height':
               if (val === 'auto'){$(node.Data).css('height', 'auto'); break}
               if (isNaN(val) || val < 0) {break}
               $(node.Data).css('height', val + 'px')
               $(node.hSize).val(val)
               break
            case 'width':
               if (val === 'auto'){$(node.Debug).css('width', 'auto'); break}
               if (isNaN(val) || val < 0) {break}
               $(node.Debug).css('width', val + 'px')
               $(node.wSize).val(val)
               break
            case 'fontSize':
               if (isNaN(val) || val < 8 || val > 32) {break}
               $(node.Debug).css('fontSize', val + 'px')
               refreshDebug()
               $(node.fSize).val(val)
               break
            case 'mode':
               if (val == 'debug'){if (stackIsOn){switchStack()};   if (! debugIsOn){runDebug()}}
               if (val == 'stack'){if (! stackIsOn){switchStack()}; if (! debugIsOn){runDebug()}}
               break
            case 'clear':
               $(sel.TBody + ' *').remove()
               break
            case 'scroll':
               if (val == 'on')    {$(node.Data).addClass('jt-scroll');    /*$(node.ScrollIcon).show();*/ node.Scroll.checked = true}
               if (val == 'off')   {$(node.Data).removeClass('jt-scroll'); /*$(node.ScrollIcon).hide();*/ node.Scroll.checked = false}
               if (val == 'toggle'){$(node.Data).toggleClass('jt-scroll'); /*$(node.ScrollIcon).toggle()*/}
               break
            case 'keytrace':
               if (val == 'on')    {keyTrace = true;  $(node.KeyIcon).show(); node.KeyTrace.checked = true}
               if (val == 'off')   {keyTrace = false; $(node.KeyIcon).hide(); node.KeyTrace.checked = false}
               if (val == 'toggle'){keyTrace = ! keyTrace; $(node.KeyIcon).toggle()}
               break
            case 'stopon':
               if (val == 'on')    {stopOn = true;  $(node.StopIcon).show(); node.StopOn.checked = true}
               if (val == 'off')   {stopOn = false; $(node.StopIcon).hide(); node.StopOn.checked = false}
               if (val == 'toggle'){stopOn = ! stopOn; $(node.StopIcon).toggle()}
               break
            case 'message':
               stMes = val
               break
            case 'password':
               password = val
               pass = password
               break
            case 'column':
               for (l = 0; l < colkol; l++){
                  if (val.substr(l, 1) === '0' && column[l] === 1){
                     column[l] = 0
                     $(node.N).parent().find(':checkbox:eq(' + l + ')')[0].checked = false
                     $('td.jt-col' + l).hide()
                     refreshDebug()
                  }
                  if (val.substr(l, 1) === '1' && column[l] === 0){
                     column[l] = 1
                     $(node.N).parent().find(':checkbox:eq(' + l + ')')[0].checked = true
                     $('td.jt-col' + l).show()
                     refreshDebug()
                  }
               }
               break
            case 'coltoggle':
               if (column[val]){column[val] = 0; $('td.jt-col' + val).hide()}
               else {column[val] = 1; $('td.jt-col' + val).show()}
               refreshDebug()
               break
            case 'lang':
               if (val == 'eng'){lang = 'eng'; addText()}
               if (val == 'rus'){lang = 'rus'; addText()}
               break
            case 'icondir':
               imgCol.Dir = val
               reloadIcon()
               break
         }
      })

      if (turnOff){return false}
      $.each(con, function(i, val){
         switch (i){
            case 'show':
               if (val == 'on')  {$(node.jTrace).show()}
               if (val == 'off') {$(node.jTrace).hide()}
               break
            case 'trace':
               if (val == 'on')    {traceOff = false; $(node.TraceIcon).hide(); node.TraceOff.checked = false}
               if (val == 'off')   {traceOff = true;  $(node.TraceIcon).show(); node.TraceOff.checked = true}
               if (val == 'toggle'){traceOff = ! traceOff; $(node.TraceIcon).toggle()}
               break
            case 'wakeup':
               if (val == 'on')    {wakeUp = true;  $(node.WakeIcon).show(); node.WakeUp.checked = true}
               if (val == 'off')   {wakeUp = false; $(node.WakeIcon).hide(); node.WakeUp.checked = false}
               if (val == 'toggle'){wakeUp = ! wakeUp; $(node.WakeIcon).toggle()}
               break
            case 'turn':
               if (val == 'off') {me.config({show: 'off'}); node.TurnOff.checked = true}
               if (val == 'chon') {
                  node.TraceOff.disabled = false
                  node.WakeUp.disabled = false
                  $(node.TurnIcon).hide()
                  turnOff = false
                  }
               if (val == 'off' || val == 'choff') {
                  node.TraceOff.disabled = true
                  node.WakeUp.disabled = true
                  $(node.TurnIcon).show()
                  me.config({trace: 'off', wakeup: 'off'})
                  turnOff = true
                  }
               break
         }
      })
   }

   function initNode(){
      //Div
      node.jTrace      = $(sel.jTrace)[0]
      node.Title       = $(sel.Title)[0]
      node.Config      = $(sel.Config)[0]
      node.Debug       = $(sel.Debug)[0]
      node.DebugTitle  = $(sel.DebugTitle)[0]
      node.Tool        = $(sel.Tool)[0]
      node.Data        = $(sel.Data)[0]
      node.Str         = $(sel.Str)[0]
      node.Table       = $(sel.Table)[0]
      node.THead       = $(sel.THead)[0]
      node.TBody       = $(sel.TBody)[0]

      // Title
      n = 0
      node.ScrollIcon  = $(sel.Title + ' span:eq(' + n + ')')[0]; n++
      node.KeyIcon     = $(sel.Title + ' span:eq(' + n + ')')[0]; n++
      node.StopIcon    = $(sel.Title + ' span:eq(' + n + ')')[0]; n++
      node.QuirkIcon   = $(sel.Title + ' span:eq(' + n + ')')[0]; n++
      node.TraceIcon   = $(sel.Title + ' span:eq(' + n + ')')[0]; n++
      node.WakeIcon    = $(sel.Title + ' span:eq(' + n + ')')[0]; n++
      node.TurnIcon    = $(sel.Title + ' span:eq(' + n + ')')[0]; n++
      node.count       = $(sel.Title + ' span:eq(' + n + ')')[0]; n++
      n = 0
      node.cfDebug     = $(sel.Title + ' img:eq(' + n + ')')[0]; n++
      node.swStack     = $(sel.Title + ' img:eq(' + n + ')')[0]; n++
      node.swDebug     = $(sel.Title + ' img:eq(' + n + ')')[0]; n++
      node.Close       = $(sel.Title + ' img:eq(' + n + ')')[0]; n++

      // Config
      n = 0
      node.hSize       = $(sel.Config + ' :text:eq(' + n + ')')[0]; n++
      node.wSize       = $(sel.Config + ' :text:eq(' + n + ')')[0]; n++
      node.fSize       = $(sel.Config + ' :text:eq(' + n + ')')[0]; n++
      node.Text        = $(sel.Config + ' :text:eq(' + n + ')')[0]; n++
      n = 0
      node.hResize     = $(sel.Config + ' button:eq(' + n + ')')[0]; n++
      node.hReset      = $(sel.Config + ' button:eq(' + n + ')')[0]; n++
      node.hAuto       = $(sel.Config + ' button:eq(' + n + ')')[0]; n++
      node.wResize     = $(sel.Config + ' button:eq(' + n + ')')[0]; n++
      node.wReset      = $(sel.Config + ' button:eq(' + n + ')')[0]; n++
      node.wAuto       = $(sel.Config + ' button:eq(' + n + ')')[0]; n++
      node.fResize     = $(sel.Config + ' button:eq(' + n + ')')[0]; n++
      node.fReset      = $(sel.Config + ' button:eq(' + n + ')')[0]; n++
      node.Test        = $(sel.Config + ' button:eq(' + n + ')')[0]; n++
      n = 0
      node.N           = $(sel.Config + ' :checkbox:eq(' + n + ')')[0]; n++
      node.Value       = $(sel.Config + ' :checkbox:eq(' + n + ')')[0]; n++
      node.Type        = $(sel.Config + ' :checkbox:eq(' + n + ')')[0]; n++
      node.Comment     = $(sel.Config + ' :checkbox:eq(' + n + ')')[0]; n++
      node.Scroll      = $(sel.Config + ' :checkbox:eq(' + n + ')')[0]; n++
      node.KeyTrace    = $(sel.Config + ' :checkbox:eq(' + n + ')')[0]; n++
      node.StopOn      = $(sel.Config + ' :checkbox:eq(' + n + ')')[0]; n++
      node.Quirk       = $(sel.Config + ' :checkbox:eq(' + n + ')')[0]; n++
      node.TraceOff    = $(sel.Config + ' :checkbox:eq(' + n + ')')[0]; n++
      node.WakeUp      = $(sel.Config + ' :checkbox:eq(' + n + ')')[0]; n++
      node.TurnOff     = $(sel.Config + ' :checkbox:eq(' + n + ')')[0]; n++

      //Tool
      n = 0
      node.Watch       = $(sel.Tool + '>div:eq(0)')[0]
      node.WatchList   = $(node.Watch).find('div:eq(3)')[0]
   }

   function initText(){
      // Name, Title
      text['eng'] = {}; title['eng'] = {}
      text['rus'] = {}; title['rus'] = {}
   
      title['eng'].ok       = 'OK';                     title['rus'].ok       = 'ОК'
      title['eng'].reset    = 'Reset';                  title['rus'].reset    = 'Сброс'
      title['eng'].auto     = 'Auto';                   title['rus'].auto     = 'Авто'
         
      title['eng'].n        = 'N';                      title['rus'].n        = 'N'
      title['eng'].value    = 'Value';                  title['rus'].value    = 'Значение'
      title['eng'].type     = 'Type';                   title['rus'].type     = 'Тип'
      title['eng'].comment  = 'Comment';                title['rus'].comment  = 'Примечание'
         
      title['eng'].scroll   = 'Scrollbar';              title['rus'].scroll   = 'Полоса прокрутки'
      title['eng'].key      = 'Trace pressed key';      title['rus'].key      = 'Трассировка нажатых клавиш'
      title['eng'].stop     = 'Stop on trace';          title['rus'].stop     = 'Остановка'
      title['eng'].quirk    = 'Quirks mode';            title['rus'].quirk    = 'Режим совместимости'
         
      title['eng'].traceoff = 'Trace off';              title['rus'].traceoff = 'Трассировка'
      title['eng'].wakeup   = 'Wake Up on trace';       title['rus'].wakeup   = 'Просыпаться'
      title['eng'].turnoff  = 'All turn off';           title['rus'].turnoff  = 'Выключить все'
         
      title['eng'].count    = 'Trace count';            title['rus'].count    = 'Счетчик'
      title['eng'].config   = 'Trace Config';           title['rus'].config   = 'Настройка'
      title['eng'].stack    = 'Trace window mode';      title['rus'].stack    = 'Положение окна трассировки'
      title['eng'].run      = 'Show/Hide trace window'; title['rus'].run      = 'Показать/Скрыть'
      title['eng'].off      = 'Turn Off';               title['rus'].off      = 'Закрыть'
      title['eng'].update   = 'Update';                 title['rus'].update   = 'Обновить'
         
      text['eng'].title     = 'Trace Window';   text['rus'].title   = 'Окно отладки'
      text['eng'].n         = 'N';              text['rus'].n       = 'N'
      text['eng'].value     = 'Value';          text['rus'].value   = 'Значение'
      text['eng'].type      = 'Type';           text['rus'].type    = 'Тип'
      text['eng'].comment   = 'Comment';        text['rus'].comment = 'Примечание'
      text['eng'].height    = 'Height';         text['rus'].height  = 'Высота'
      text['eng'].width     = 'Width';          text['rus'].width   = 'Ширина'
      text['eng'].font      = 'Font';           text['rus'].font    = 'Шрифт'
   }

   function addText(){
      $(node.ScrollIcon).attr('title', title[lang].scroll)
      $(node.KeyIcon).attr('title', title[lang].key)
      $(node.StopIcon).attr('title', title[lang].stop)
      $(node.QuirkIcon).attr('title', title[lang].quirk)
      $(node.TraceIcon).attr('title', title[lang].traceoff)
      $(node.WakeIcon).attr('title', title[lang].wakeup)
      $(node.TurnIcon).attr('title', title[lang].turnoff)
      $(node.count).attr('title', title[lang].count)
      $(node.cfDebug).attr('title', title[lang].config)
      $(node.swStack).attr('title', title[lang].stack)
      $(node.swDebug).attr('title', title[lang].run)
      $(node.Close).attr('title', title[lang].off)

      $(node.N).attr('title', title[lang].n).next().attr('title', title[lang].n)
      $(node.Value).attr('title', title[lang].value).next().attr('title', title[lang].value)
      $(node.Type).attr('title', title[lang].type).next().attr('title', title[lang].type)
      $(node.Comment).attr('title', title[lang].comment).next().attr('title', title[lang].comment)
      $(node.Scroll).attr('title', title[lang].scroll).next().attr('title', title[lang].scroll)
      $(node.KeyTrace).attr('title', title[lang].key).next().attr('title', title[lang].key)
      $(node.StopOn).attr('title', title[lang].stop).next().attr('title', title[lang].stop)
      $(node.Quirk).attr('title', title[lang].quirk).next().attr('title', title[lang].quirk)
      $(node.TraceOff).attr('title', title[lang].traceoff).next().attr('title', title[lang].traceoff)
      $(node.WakeUp).attr('title', title[lang].wakeup).next().attr('title', title[lang].wakeup)
      $(node.TurnOff).attr('title', title[lang].turnoff).next().attr('title', title[lang].turnoff)

      $(node.hResize).attr('title', title[lang].ok)
      $(node.hReset).attr('title', title[lang].reset)
      $(node.hAuto).attr('title', title[lang].auto)
      $(node.wResize).attr('title', title[lang].ok)
      $(node.wReset).attr('title', title[lang].reset)
      $(node.wAuto).attr('title', title[lang].auto)
      $(node.fResize).attr('title', title[lang].ok)
      $(node.fReset).attr('title', title[lang].reset)

      $(node.DebugTitle).text(text[lang].title)
      $(sel.THead + ' td:eq(0)').text(text[lang].n)
      $(sel.THead + ' td:eq(1)').text(text[lang].value)
      $(sel.THead + ' td:eq(2)').text(text[lang].type)
      $(sel.THead + ' td:eq(3)').text(text[lang].comment)
      
      $(sel.Config + ' div:eq(0) td:eq(0)').text(text[lang].height)
      $(sel.Config + ' div:eq(0) td:eq(3)').text(text[lang].width)
      $(sel.Config + ' div:eq(0) td:eq(6)').text(text[lang].font)
   }
   
   function reloadIcon(){
   
      imgCol.run       = imgCol.Dir + 'Run.png'
      imgCol.stop      = imgCol.Dir + 'Stop.png'
      imgCol.stack     = imgCol.Dir + 'Stack.png'
      imgCol.debug     = imgCol.Dir + 'Debug.png'
      imgCol.config    = imgCol.Dir + 'Config.png'
      imgCol.close     = imgCol.Dir + 'Close.png'
      imgCol.update    = imgCol.Dir + 'Update.png'
      
      if (debugIsOn) {$(node.swDebug).attr('src', imgCol.stop)}
      else           {$(node.swDebug).attr('src', imgCol.run)}
      if (stackIsOn) {$(node.swStack).attr('src', imgCol.debug)}
      else           {$(node.swStack).attr('src', imgCol.stack)}
      $(node.cfDebug).attr('src', imgCol.config)
      $(node.Close).attr('src', imgCol.close)
   }

   var me, jTrace = function(){
         me.printArg(arguments)
         return me
      }

   jTrace.fn = jTrace.prototype = {
      num: 0,
      init: function(arg){
         return this
      },
      fake: function(len){
         if (traceOff){return true}
         if (wakeUp){me.config({show: 'on'})}
         if (len === 0){return true}
         return false
      },
      trace: function(){
         me.printArg(arguments)
         return this
      },
      printVal: function(val, i){
         me.num = 0
         if (me.fake(arguments.length)){return this}
         me.printRow(val, i)
         me.printEnd()
         return this
      },
      printObj: function(){
         me.num = 0
         if (me.fake(arguments.length)){return this}
         $.each(arguments, function(i, val){
            if (val === null){me.printRow(val); me.printEnd()}
            else if (validObj(val)) {
               me.printRow(val, null, 'yes')
               me.printObjOne(val)
            }
            else {me.printRow(val); me.printEnd()}
         })
         return this
      },
      // internal usage only
      printObjOne: function(obj){
         if (! valid(obj)){return}
         prnObj = true
         for (ii in obj){me.printRow(obj[ii], ii)}
         if ($.isFunction(obj)) {prnFunc = true; me.printRow(obj, 'body'); prnFunc = false}
         prnObj = false
         me.printEnd()
      },
      // internal usage only
      printArg: function(arg){
         me.num = 0
         if (me.fake(arg.length)){return}
         $.each(arg, function(i, val){me.printRow(val)})
         me.printEnd()
      },
      // internal usage only
      printRow: function(val, i, o){
         if (! prnObj){mm = ++dumbN} else {mm = ''}
         if (valid(innerObj.n)){nn = innerObj.n + '.' + i; pp = innerObj.prev; if (prevN === innerObj.prev){prevN = nn}; innerObj.prev = nn}
         else {nn = prnObj ? dumbN + '.' + i : dumbN; pp = prevN; prevN = nn}
         if (val === null) {vv = '[null]'}
         else if (typeof(val) == 'object') {vv = $.isArray(val) ? '[Array]' : toStr(val)}
         else if (typeof(val) == 'function' && ! prnFunc) {vv = '[Function]'} else {vv = toStr(val)}
         if (valid(i)) {i += ': '} else {i = ''}
         if (! valid(o)) {o = 'na'}
         trDebug(mm, i + vv, val, '', nn, o)
         dumb[nn] = {n: nn, val: val, name: i, prnN: mm, prnname: vv, num: this.num, prev: pp, next: innerObj.next, open: o}
         if (pp != -1){dumb[pp].next = nn}
         if (innerObj.next){dumb[innerObj.next].prev = nn}
         dumb.len++
         if (! prnObj){me.num++}
      },
      // internal usage only
      printEnd: function(){
         if (! debugIsOn){$(node.count).addClass('jt-red')}
         $(node.count).text('«' + dumb.len + '»')
         if (stopOn) {alert(stMes)}
      },
      comment: function(){
         if (me.fake(arguments.length)){return this}
         comm = []
         $.each(arguments, function(i, val){
            if (me.num - comm.length <= 0) {return false}
            comm.push(toStr(val))
         })
         if (comm.length){trComment(me.num)}
         return this
      },
      message: function(){
         if (me.fake(arguments.length)){return this}
         $.each(arguments, function(i, val){alert(val)})
         return this
      },
      config: function(con){
         configTrace(con)
         return this
      },
      autoid: 0,
      watchObj: {},
      watchPrint: function(){
         me.num = 0
         if (me.fake(arguments.length)){return this}
         $.each(arguments, function(i, val){
            if (me.watchObj[val]){me.printObj(me.watchObj[val].val); if (me.watchObj[val].comment){me.comment(me.watchObj[val].comment)}}
         })
         me.printEnd()
         return this
      },
      watch: function(val, id, comment){
         if (typeof(id) != 'number' && typeof(id) != 'string'){id = 'watch' + me.autoid; me.autoid++}
         if (/[\s\(\)\[\]]/.test(id)){id = id.replace(/[\s\(\)\[\]]+/g, '_')}
         if (! comment){comment = ''}
         if (! me.watchObj[id]){
            $(node.WatchList).find('tr').ins$('<td>').css({'padding-left': '0px', 'padding-right': '0.75em'})
               .insDiv({text: id}).css('cursor', 'pointer').addClass('jt-blue').data('id', id).attr('title', comment)
               .click(function(){me.watchPrint($(this).data('id')); return false})
         }
         me.watchObj[id] = {}; me.watchObj[id].val = val; me.watchObj[id].comment = comment
         $(node.Tool).show()
         return this
      }
   }
   jTrace.fn.init.prototype = jTrace.fn;
   me = new jTrace.fn.init()
   
   // Внешний вызов - jTrace.toStr()
   jTrace.toStr = toStr; jTrace.toNumber = toNumber; jTrace.quirkmode = quirkmode; jTrace.valid = valid; jTrace.validObj = validObj;
   jTrace.slideLeft = slideLeft; jTrace.slideRight = slideRight
   //$.each(jTrace.fn, function(i, val){jTrace[i] = jTrace.fn[i]})


   var dumb = {}; dumb.len = 0; var comm = []
   var imgCol = {}, sel = {}, node = {}, password = 'traceon', pass = password
   var debugIsOn = false, stackIsOn = false
   var keyTrace = false, stopOn = false, stMes = 'Debug Stop!'
   var traceOff = false, wakeUp = false, turnOff = false
   var heightDI, widthDI, fontDI
   var column = [1, 1, 1, 1], colkol = 4, td = []
   var quirk = quirkmode(), wMarker = 0
   var text = {}, title = {}, lang = 'eng'
   var padObj = [], dumbN = -1, prnObj, prnFunc, innerObj = {}, prevN = -1
   var i, k, l, m, n, s, w, tempval, str, key, bt, div, mm, nn, pp, ii, vv

   imgCol.Dir = 'jtrace/'
   reloadIcon()

   // Selectors
   sel.jTrace      = '#jTrace'
   sel.Title       = sel.jTrace + '>div:eq(0)'
   sel.Config      = sel.jTrace + '>div:eq(1)'
   sel.Debug       = sel.jTrace + '>div:eq(2)'
   sel.DebugTitle  = sel.Debug  + '>div:eq(0)'
   sel.Tool        = sel.Debug  + '>div:eq(1)'
   sel.Data        = sel.Debug  + '>div:eq(2)'
   sel.Str         = sel.Data   + '>div:eq(0)'
   sel.Table       = sel.Data   + ' table:eq(0)'
   sel.THead       = sel.Data   + ' thead:eq(0)'
   sel.TBody       = sel.Data   + ' tbody:eq(0)'

   initTitle()
   initConfig()
   initDebug()
   initTools()
   
   initNode()
   initText()
   addText()

   if (quirk){$(node.QuirkIcon).toggle()}
   $(node.Quirk).hide().next().hide()
   $(document).keypress(function(e){keyDebug(e)})

   $(document).ready(function(){
      heightDI = $(node.Data).height()
      $(node.hSize).val(heightDI)
      
      widthDI = $(node.Debug).width()
      $(node.wSize).val(widthDI)
      
      fontDI = $(node.Data).css('fontSize')
      fontDI = Number(fontDI.substr(0, fontDI.length-2))
      $(node.fSize).val(fontDI)
      
      node.N.checked       = true
      node.Value.checked   = true
      node.Type.checked    = true
      node.Comment.checked = true
      
   })

   jTrace().config({scroll: 'on'})

   jTrace.dumb = dumb
   window.jTrace = jTrace;

})(window);