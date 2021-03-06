var _STORE = {};
var LS = $.localStorage;

function initlocalStorage () {
    if (!LS.isSet('myTpl')) {
        LS.set('myTpl', {});
    }
    if (!LS.isSet('lang')) {
        LS.set('lang', 'ru');
    }
    if (!LS.isSet('colorSheme')) {
        LS.set('colorSheme', 'default');
    }
}

function init () {

    initlocalStorage();
    getDefaultState();
    _STORE.panel = 'writer';
    _STORE.backToPanel = 'writer';
    app ();

}

function app () {
    _Render();

    _Localizer();

    getUpdate(function (err, html) {
        if (!err && html !== "false") {
            $('#messageWr').html(html);
        } else {
            $('#messageWr').css('display', 'none');
        }
    });

    // $("#phraseWr .resWord").draggable();

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

    $('#phraseWr').sortable({
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
        var code = e.keyCode || e.which;
        var val = $(this).val();
        if (code == 0 || code == 229) { //for android chrome keycode fix
            code = val.charCodeAt(val.length - 1);
        }
        if (code == 13) {
            $(this).blur();
            _STORE.panel = 'showPhrase';
            _Render();
        }
        if (code == 32) {
            if (!_STORE.text.hasOwnProperty(_STORE.currentTextPos)) {
                _STORE.text[_STORE.currentTextPos] = {};
                _STORE.text[_STORE.currentTextPos].id = uuid();
            }
            _STORE.text[_STORE.currentTextPos].word = code == 32 ? val.slice(0,-1) : val;
            $(this).val("");
            _STORE.currentTextPos = lastTextPos();
            checkBtns();
            printText();
        }
    });

    $('body').on('blur', '#myInput', function (e) {
        var val = $(this).val();
        if (val !== '') {
            if (!_STORE.text.hasOwnProperty(_STORE.currentTextPos)) {
                _STORE.text[_STORE.currentTextPos] = {};
                _STORE.text[_STORE.currentTextPos].id = uuid();
            }
            _STORE.text[_STORE.currentTextPos].word = val;
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
        _STORE.panel = 'showPhrase';
        _Render();
    });

    $('body').on('click', '.fullSizeExit', function () {
        _STORE.panel = 'writer';
        var targ = _STORE.backToPanel;
        _STORE.panel = targ;
        _STORE.backToPanel = targ;
        _Render();
    });

    $('body').on('click', '#clearText', function () {
        $('#myInput').val('');
        getDefaultState();
        checkBtns();
        printText();
    });

    $('body').on('click', '#myTempl', function () {
        _STORE.panel = 'templates';
        _STORE.isTplView = false;
        _STORE.backToPanel = 'writer';
        _Render();
    });

    $('body').on('click', '#saveText', function () {
        var tmp = LS.get('myTpl');
        var tpl = {};
        if (!_STORE.isTplEditView) {
            tpl.range = 0;
            tpl.data = _STORE.text;
            tmp[uuid()] = tpl;
        } else if (_STORE.isTplEditView) {
            tmp[_STORE.isTplEditView].data = _STORE.text;
        }
        LS.set('myTpl', tmp);
        $('#myInput').val('');
        getDefaultState();
        checkBtns();
        printText();
    });

    $('body').on('click', '#mySettings', function () {
        _STORE.panel = 'settings';
        _Render();
        settingsTpl();
    });
};

var editTpl = function () {
    var isEditable = false;
    $('.editabledTpl').on('click', function () {
        isEditable = !isEditable;
        $(this).toggleClass('unactive active');
    });


    // $(".tplItem").draggable();

    $("#delTpl").droppable({
        hoverClass: "hover",
        drop: function( event, ui ) {
            var id = ui.draggable.attr('data-item');
            eventDispatcher({
                tplId: id,
                // wordPos: getPosById(ui.draggable.attr('data-item')),
                event: 'deleteTpl'
            });
            // $('.resWord[data-item="' + id + '"]').remove();
            _STORE.panel == 'templates';
            _Render();
        }
    });

    $('#tplList').sortable({
        start: function () {
            $("#delTpl").css('display', 'inline-block');
        },
        stop: function (event, ui) {
            $("#delTpl").css('display', 'none');
            eventDispatcher({
                wordId: ui.item.attr('data-item'),
                oldPos: getPosById(ui.item.attr('data-item')),
                event: 'rangeTpl',
                newPos: ui.item.index()
            });
        }
    });

    $('#tplList .tplItem').on('click', function () {
        var tplId = $(this).attr('data-item');
        if (LS.get('myTpl').hasOwnProperty(tplId)) {
            if (!isEditable) {
                _STORE.isTplView = true;
                _STORE.backToPanel = 'templates';
                showFullSize(
                    '<div class="fullPhrase">' +
                    buildSimpleText(LS.get('myTpl')[tplId].data) +
                    '</div>'
                );
            } else {
                _STORE.isTplView = false;
                _STORE.backToPanel = 'writer';
                showFullSize();
                $('#myInput').val();
                eventDispatcher({
                    tpl: LS.get('myTpl')[tplId].data,
                    tplId: tplId,
                    event: 'editTpl'
                });
                checkBtns();
                printText();
            }
        }
    });

}

var settingsTpl = function () {
    $('body').on('click', '#langChouse', function () {
        _STORE.panel = 'lang';
        _STORE.backToPanel = 'settings';
        _Render();
        changeLang();
    });
    aboutProg
    $('body').on('click', '#aboutProg', function () {
        _STORE.panel = 'about';
        _STORE.backToPanel = 'settings';
        _Render();
    });
};

var changeLang = function () {
    $('body').on('change', '#langChanger', function () {
        LS.set('lang', $(this).val());
        _STORE.panel = 'settings';
        _Render();
        _Localizer();
    });
};

var printText = function () {
    $('#phraseWr').html(buildTextString(_STORE.text, 'resWord'));
};

var buildTextString = function (src, className) {
    var resText = '';
    var className = className ? 'class="' + className + '" ' : '';
    var dataItem;
    src.forEach(function (wordData) {
        dataItem = wordData.id ? ' data-item="' + wordData.id + '" ' : '';
        resText += '<li ' + className + dataItem + '>' + wordData.word + '</li>';
    });
    return resText;
};

var buildSimpleText = function (src, className) {
    var resText = '';
    var className = className ? 'class="' + className + '" ' : '';
    var dataItem;
    src.forEach(function (wordData) {
        dataItem = wordData.id ? ' data-item="' + wordData.id + '" ' : '';
        resText += '<span ' + className + dataItem + '>' + wordData.word + '</span>';
    });
    return resText;
};

var showFullSize = function (text) {
    if (text) {
        $('#fullSizeWr').css('display', 'block');
        $('.fullSizeContent').html(text);
    } else {
        $('#fullSizeWr').css('display', 'none');
        $('.fullSizeContent').html('');
    }
    _STORE.isFullView = !_STORE.isFullView;
};

var checkBtns = function () {
    var show = false;
    if (lastTextPos()) {
        show = true;
    }

    $('.finalBtnsWr .btn, .finalBtnsWr .iconBtn').each(function (ind, el) {
        var isToggle = false;
        if (!show && !$(el).hasClass('disabled')) {
            isToggle = true;
        }
        if (show && !$(el).hasClass('active')) {
            isToggle = true;
        }
        if (isToggle) {
            $(el).toggleClass('disabled active');
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
