$('body').insDiv({id: 'box'})
    .append($('<div>', {id: 'menuline'}).addClass('page').hide())
    .append($('<div>', {id: 'left'}).append($('<div>', {id: 'menu'})).css('float', 'left'))
    .append($('<div>', {id: 'center'}).append($('<div>', {id: 'page'})))
    .append($('<div>').css('clear', 'left'))

pageStatus.menuReady.general = jvMenu.menu({filename: 'main/main.mnu', menuname: 'main', line_box: '#menuline', menu_box: '#menu', page_box: '#page', sectionName: 'general'}, ['login-full', 'firstchildren'])

function ChangeCitation(parent, page){
    if (page.citat && page.citat != arguments.callee.curr){
        $('#header').hide()//.slideUp('fast', function(){
        $('#header-citat').text(Citation(page.citat)['citat'])
        if (page.citat_css && page.citat_css.citat){$('#header-citat').css(page.citat_css.citat)}
        $('#header-sign').text(Citation(page.citat)['sign'])
        if (page.citat_css && page.citat_css.sign){$('#header-sign').css(page.citat_css.sign)}
        //}).slideDown('fast')
        $('#header').show()
        arguments.callee.curr = page.citat
    }
}
