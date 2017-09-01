$('body').insDiv({id: 'bottom'})
    .ins$('<table>').css({width: '100%'}).append($('<tr>')
        .append($('<td>').css({width: '35%', 'text-align': 'left', 'vertical-align': 'bottom'})
            .append($('<div>').append($('<div>').text('$').css({'font-size': '0.6em'})).click(function(){
                    $(this).children().not(':first').remove()
                    $(this).insA({text: 'Test Main'}).attr({href: '/test/'})
                    $(this).ins$('<br>')
                    $(this).insA({text: 'Test.php'}).attr({href: '/test/test.php'})
                    VarSession('user', this)
                }))
        )
        .append($('<td>').css({width: '30%', 'text-align': 'center', 'vertical-align': 'top'})
            .append($('<span>').html('&copy 2011-2017 Дмитрий Соколов, dmsok@yandex.ru'))
        )
        .append($('<td>').css({width: '35%', 'text-align': 'right'}))
    );

(function(){
var n = $(window).height() - $('#top').height() - $('#bottom').height() - 80
if (n > 0) {$('#box').css('min-height', n + 'px')}
})();
