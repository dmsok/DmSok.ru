$(arguments[0]).insDiv().addClass('news').addClass('page')
    .append($('<h3>').text('Ну велкам что ли...')/*.click(function(){$(this).next().slideToggle()})*/)
    .insDiv()
        .append($('<div>').css({'text-align': 'justify'}).text(Citation(2)['citat']))
        .append($('<div>').css({margin: '1ex 0', 'text-align': 'right', 'font-style': 'italic'}).text(Citation(2)['sign']))

/*$(parent).insDiv({align: 'center'}).html(
'<object classid="clsid:D27CDB6E-AE6D-11CF-96B8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,40,0" border="0" width="801" height="566">' +
'<param name="movie" value="image/new_year1.swf">' +
'<param name="quality" value="High">' +
'<embed src="image/new_year1.swf" pluginspage="http://www.macromedia.com/go/getflashplayer" type="application/x-shockwave-flash" width="801" height="566">' +
'</object>')*/