﻿$('body').insDiv({id: 'top'}).ins$('<table>').attr({width: '100%'}).ins$('<tbody>').append($('<tr>')
    .append($('<td>').css('height', '100px').append($('<a>').attr('href', '').append($('<img>').attr({'src': 'image/logo/dmsok-300-100.png', 'border': '0'}))))
    .append($('<td>')/*.css({'vertical-align': 'top'})*/.append($('<div>').attr('id', 'header').css({'margin-left': '1em'}).css({'font-family': '"Book Antiqua", Georgia, serif'}).hide()
        .append($('<div>').attr('id', 'header-citat')/*.css().text(Citation(1)['citat'])*/)
        .append($('<div>').attr('id', 'header-sign').attr('align', 'right')/*.css().text(Citation(1)['sign'])*/)
        ))
    .append($('<td>').attr({align: 'right', valign: 'top'}).append($('<div>').attr({id: 'login', align: 'right'})
            .css({'font-weight': 'bold', 'font-size': '0.8em', width: '12em'})
        ))
    )