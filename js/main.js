var _STORE = {};

function init (parentId) {

    getDefaultState();

    $(parentId).html('  <div class="functWr">\
                            <div id="delWord" class="btn" style="display: none;">Delete</div>\
                        </div>\
                        <ul id="myTextWr">\
                        </ul>\
                        <input type="text" id="myInput" value=""/>\
                        <div class="finalBtnsWr">\
                            <div id="clearText" class="btn unactive">Clear</div>\
                            <div id="saveText" class="btn unactive" >Save</div>\
                            <div id="showText" class="btn unactive">Show</div>\
                        </div>\
                        <div id="fullSizeWr" style="display: none;"></div>');


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
        $('#fullSizeWr').css('display', 'block');
        $('#fullSizeWr').html(resText);
        _STORE.isFullView = !_STORE.isFullView;
    });

    $('body').on('click', '#fullSizeWr', function () {
        $('#fullSizeWr').css('display', 'none');
        $('#fullSizeWr').html('');
        _STORE.isFullView = !_STORE.isFullView;
    });

    $('body').on('click', '#clearText', function () {
        getDefaultState();
        checkBtns();
        printText();
    });
}

var uuid = function () {
    return Math.random().toString(36).substring(7);
};

var getPosById = function (id) {
    var res = -1;
    _STORE.text.forEach(function (el, iter) {
        if (el.id == id) {
            res = iter;
        }
    });
    return res;
};

var lastTextPos = function () {
    return _STORE.text.length;
};

var getDefaultState = function () {
    _STORE.text = [];
    _STORE.isFullView = false;
    _STORE.currentTextPos = lastTextPos();
    _STORE.wordEvent = {};

};

var printText = function () {
    var resText = "";
    _STORE.text.forEach(function (wordData) {
        resText += '<li class="resWord" data-item="' + wordData.id + '">' + wordData.word + '</li>';
    });
    $('#myTextWr').html(resText);
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

var changePosInArray = function (arr, old_index, new_index) {  
    while (old_index < 0) {  
        old_index += arr.length;  
    }  
    while (new_index < 0) {  
        new_index += arr.length;  
    }  
    if (new_index >= arr.length) {  
        var k = new_index - arr.length;  
        while ((k--) + 1) {  
            arr.push(undefined);  
        }  
    }  
     arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);    
   return arr;  
};

var removeWordFromArray = function (id) {
    var pos = getPosById(id);
    if (pos + 1) {
        _STORE.text.splice(pos, 1); 
    }
    return _STORE.text;
};

var eventDispatcher = function (evnt) {
    console.log(evnt);
    switch (evnt.event) {
        case "editWord":
             _STORE.currentTextPos = evnt.wordId;
            break;
        case "moveToPos":
            if (evnt.oldPos !== evnt.newPos) {    
                _STORE.text = changePosInArray(_STORE.text, evnt.oldPos, evnt.newPos);
            }
            break;
        case "delete":
            _STORE.text = removeWordFromArray(evnt.wordId);
            break;
    }
};
