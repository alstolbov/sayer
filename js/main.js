var _STORE = {};
var LS = $.localStorage;

function initlocalStorage () {
    if (!LS.isSet('myTpl')) {
        LS.set('myTpl', []);
    }
}

function init () {

    initlocalStorage();

    getDefaultState();

    getUpdate(function (err, html) {
        if (!err && html !== "false") {
            $('#messageWr').html(html);
        } else {
            $('#messageWr').css('display', 'none');
        }
    });

    $("#myTextWr .resWord").draggable();

    $("#delWord").droppable({
        hoverClass: "hover",
        drop: function( event, ui ) {
            var id = ui.draggable.attr('data-item');
            eventDispatcher({
                wordId: id,
                // wordPos: getPosById(ui.draggable.attr('data-item')),
                event: 'delete'
            });
            _STORE.currentTextPos = lastTextPos();
            checkBtns();
            $('.resWord[data-item="' + id + '"]').remove();
        }
    });

    $('#myTextWr').sortable({
        start: function () {
            $("#delWord").css('display', 'inline-block');
        },
        stop: function (event, ui) {
            $("#delWord").css('display', 'none');
            eventDispatcher({
                wordId: ui.item.attr('data-item'),
                oldPos: getPosById(ui.item.attr('data-item')),
                event: 'moveToPos',
                newPos: ui.item.index()
            });
        }
    });

    $('#myInput').focus();

    $('body').on('keyup', '#myInput', function (e) {
        var code = e.which;
        var val = $(this).val();
        // if (val.slice(-1) == " ") {
        if (code == 32 || code == 13) {
            if (code == 13) {
                e.preventDefault();
            }
            _STORE.text[_STORE.currentTextPos] = {};
            _STORE.text[_STORE.currentTextPos].word = code == 32 ? val.slice(0,-1) : val;
            _STORE.text[_STORE.currentTextPos].id = uuid();
            $(this).val("");
            _STORE.currentTextPos = lastTextPos();
            checkBtns();
            printText();
        }
    });

    $('body').on('click', '.resWord', function () {
        var id = lastTextPos();
        var data = "";
        if (!$(this).hasClass('active')) {
            id = getPosById($(this).attr('data-item'));
            data = _STORE.text[id].word;
            $('.resWord').each(function () { $(this).removeClass('active'); });
            $(this).addClass('active');
        } else {
            $(this).removeClass('active');
        }

        $('#myInput').val(data);
        eventDispatcher({
            wordId: id,
            event: 'editWord'
        });
    });

    $('body').on('click', '#showText', function () {
        var resText = "";
        _STORE.text.forEach(function (wordData, id) {
            resText += '<span>' + wordData.word + ' </span>';
        });
        showFullSize(resText);
    });

    $('body').on('click', '#fullSizeWr', function () {
        showFullSize();
    });

    $('body').on('click', '#clearText', function () {
        $('#myInput').val('');
        getDefaultState();
        checkBtns();
        printText();
    });

    $('body').on('click', '#myTempl', function () {
        var HTML = '';
        LS.get('myTpl').forEach(function (tpl) {
            HTML += '<div class="btn test">';
            tpl.forEach(function (wordData) {
                HTML += '<span>' + wordData.word + ' </span>';
            });
            HTML += '</div>';
        });
        showFullSize(HTML);
        $(".test").draggable();
    });

    $('body').on('click', '#saveText', function () {
        var tmp = LS.get('myTpl');
        tmp.push(_STORE.text);
        LS.set('myTpl', tmp);
        $('#myInput').val('');
        getDefaultState();
        checkBtns();
        printText();
    });

}

var printText = function () {
    var resText = "";
    _STORE.text.forEach(function (wordData) {
        resText += '<li class="resWord" data-item="' + wordData.id + '">' + wordData.word + '</li>';
    });
    $('#myTextWr').html(resText);
};

var showFullSize = function (text) {
    if (text) {
        $('#fullSizeWr').css('display', 'block');
        $('#fullSizeWr').html(text);
    } else {
        $('#fullSizeWr').css('display', 'none');
        $('#fullSizeWr').html('');
    }
    _STORE.isFullView = !_STORE.isFullView;
};

var checkBtns = function () {
    var show = false;
    if (lastTextPos()) {
        show = true;
    }

    $('.finalBtnsWr .btn').each(function (ind, el) {
        var isToggle = false;
        if (!show && !$(el).hasClass('unactive')) {
            isToggle = true;
        }
        if (show && !$(el).hasClass('active')) {
            isToggle = true;
        }
        if (isToggle) {
            $(el).toggleClass('unactive active');
        }
    });
};

var getUpdate = function (back) {
    $.ajax({
        type: "GET",
        url: "http://10.10.10.40:8080/upd.html",
        cache: false,
        success: function (data) { back (null, data); },
        error: function (err) { back (err, null); }
    });
};
