$(document).ready(function () {
    $('#plus-set').click(function () {
        $('#full-ajax').css('transform', 'translateY(-0%)');
    });
    /*
    $('.set').click(function(){
    $('.tile, #site-id').css('opacity', '0.2');
    $(this).css({'opacity': '1', 'z-index': '300'});
    $('.fab' + $(this).data('id')).css({'opacity': '1', 'z-index': '300'});
    });
    */
    $('.set').click(function () {
        questionsPreview($(this).data('id'));
        retrieveCombos($(this).data('id'));
        $('#game-title').html($(this).data('name'));
        $('#questions-ajax').css('transform', 'translateX(-0%)');
        $('.game-menu-screen').css('transform', 'translateY(-0%)');
    });

    $('.viewport-x').on('click', function () {
        $('#' + $(this).data('viewname')).css('transform', 'translateY(' + $(this).data('value') + ')');
        $('#questions-ajax').css('transform', 'translateX(100%)');
        $('#questions-ajax').html('');
        combos = [];
        $('#save-set').addClass('hidden');
    });

    $('.game-menu').on('click', function () {
        $('.game-menu-screen').css('transform', 'translateY(100%)');
        $('#questions-ajax').css('transform', 'translateX(100%)');
        $('#game-over').css({ 'transform': 'translateX(100%)' });
        $('#stars').html('');

    });

    $('#save-set').click(function () {
        saveSet(JSON.stringify(combos), $('#set-title').html());
    });

    $('#set-title').focus(function () {
        if ($(this).html() == 'Question Set Title Here') {
            $(this).html('');
        }
    });

    $('#set-title').blur(function () {
        if ($(this).html() == '<br>') {
            $(this).html('Question Set Title Here');
        }
    });
});

function questionsPreview(setId){
    $.post(
    "/setquestions.cshtml",
    {
        'setid': setId
    },
    function (data, status) {
        if (status == 'success') {
            $('#questions-ajax').html(data);
            return;
        }
        alert('something went wrong.:( please refresh the page and try again.');
    });
}

function retrieveCombos(setId){
    $.post(
    "/qjson.cshtml",
    {
        'setid': setId
    },
    function (data, status) {
        if (status == 'success') {
            combos = JSON.parse(data);
            for (var i = 0; i < combos.length; i++) {
                combos[i].done = false;
            }
            return;
        }
        alert('something went wrong.:( please refresh the page and try again.');
    });
}

function saveSet(json, title){
    $.post(
    "/saveset.cshtml",
    {
        'data': json,
        'title': title
    },
    function (data, status) {
        if (status == 'success') {
            location.reload();
            return;
        }
        alert('something went wrong.:( please refresh the page and try again.');
    });
}
