News([
    $(arguments[0]).insDiv().addClass('news').addClass('page'),
    {header: 'Достаточно ли умышленного автогола для победы?'},
    {figure: 1, figcaption: '', 'float': 'right', img: 'image/Zhestokaya-igra.jpg', width: '100%', css: {width: '30%'}},
    {div: 1, func: function(){var curr = this; $.get('pages/autogoal.txt', function(data){curr.html(TxtToHTML(data, true)).children('div').addClass('p')})}},
    {p: 1, a: 'Есть даже видио', href: 'http://www.youtube.com/watch?v=ThpYsN-4p7w'},
    {p: 1, a: 'Википедия про этот матч (англ.)', href: 'http://en.wikipedia.org/wiki/1994_Caribbean_Cup#Group_1'},
    {p: 1, a: 'Взято с ЗИА - Прихожанин, Санкт-Петербург, Россия - Вторник, Август 30, 2011, 11:37:10', href: 'http://www.zenitspb.org/guestbook/guestbook.shtml'},
    //{div: '&nbsp;'},
    {sign: '31.03.2014'}
])
News([
    $(arguments[0]).insDiv().addClass('news').addClass('page'),
    {header: 'Рабона Халка'},
    {div: 1, url: 'https://www.youtube.com/embed/W6Qn412wJZg', ratio: '16:9'},
    {div: '&nbsp;'},
    {tag: '<a>', css: {'text-decoration': 'none'}, href: 'http://otvet.mail.ru/question/27998269', p: 'Этот финт представляет собой удар, который наносится по мячу позади опорной ноги. В правильном исполнении, ноги игрока скрещиваются одна за другой. Также известен, как «crossing-kick» и «maradona chip». Трюк изобретён и впервые использован седьмым номером итальянского клуба «Асколли» Джованни Рокотелли (Giovanni Roccotelli) в игре против «Модены» в январе 1978-го. За что Джованни прозвали ’il padre della rabona’(папа «рабоны»). Сначала этот финт называли перекрёстный удар (crossing-kick). Но потом в Аргентине придумали новое обозначение — «рабона» (rabona). Термин взят из танго по названию движения, которое выглядит точно так же, как этот финт.'},
    {sign: '19.05.2013'}
])
/*News([
    $(arguments[0]).insDiv().addClass('news').addClass('page'),
    {header: 'iPhone 5 Concept Features'},
    {div: 1, url: 'http://www.youtube.com/embed/lzsBwnv_dAg', ratio: '16:9'},
    {div: '&nbsp;'},
    {sign: 1, a: 'http://www.youtube.com/user/AatmaStudio'},
    {sign: '23.08.2011'}
])
*/