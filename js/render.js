var _Render = function () {
    if (_STORE.panel == 'templates') {
        var HTML = '<div class="btn editabledTpl unactive">' + _Lang[LS.get('lang')]['editTpl'] + '</div>';
        Object.keys(LS.get('myTpl')).forEach(function(key, index) {
            HTML += '<div class="btn tplItem" data-item="' + key + '">' ;
            HTML += buildTextString(LS.get('myTpl')[key].data);
            HTML += '</div>';
        });
        showFullSize(HTML);
        editTpl();
    } else if (_STORE.panel == 'showPhrase') {
        showFullSize(
            '<ul>' +
            buildTextString(_STORE.text) + 
            '</ul>'
        );
    } else {
        showFullSize();
    }



};

var _Localizer = function () {
    var locale = LS.get('lang');
    $('#myTempl').html(_Lang[locale]['myTemplates']);
    $('#delWord').html(_Lang[locale]['delWord']);
    $('#clearText').html(_Lang[locale]['clearText']);
    $('#saveText').html(_Lang[locale]['saveText']);
    $('#showText').html(_Lang[locale]['showText']);
}
