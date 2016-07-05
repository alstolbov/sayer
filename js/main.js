var _STORE = {};

function init (parentId) {

    getDefaultState();

    $(parentId).html(' <ul id="myTextWr">\
                        </ul>\
                        <input type="text" id="myInput" value=""/>\
                        <div class="finalBtnsWr">\
                            <div id="clearText" class="btn unactive">Clear</div>\
                            <div id="saveText" class="btn unactive" >Save</div>\
                            <div id="showText" class="btn unactive">Show</div>\
                        </div>\
                        <div id="fullSizeWr" style="display: none;"></div>');

    $('#myTextWr').sortable({
        stop: function (event, ui) {
            var oldPos = ui.item.attr('data-item');
            var newPos = ui.item.index();
            console.log(oldPos, newPos);
            _STORE.text = changePosInArray(_STORE.text, oldPos, newPos);
        }
    });

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
            id = $(this).attr('data-item');
            data = _STORE.text[id].word;
            $('.resWord').each(function () { $(this).removeClass('active'); });
            $(this).addClass('active');
        } else {
            $(this).removeClass('active');
        }

        $('#myInput').val(data);
        _STORE.currentTextPos = id;
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

var lastTextPos = function () {
    return _STORE.text.length;
};

var getDefaultState = function () {
    _STORE.text = [];
    _STORE.isFullView = false;
    _STORE.currentTextPos = lastTextPos();

};

var printText = function () {
    var resText = "";
    _STORE.text.forEach(function (wordData, id) {
        resText += '<li class="resWord" data-item="' + id + '">' + wordData.word + '</li>';
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
} ;
