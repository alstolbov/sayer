var _Render = function () {
    var HTML = '';
    if (_STORE.panel == 'templates') {
        HTML = '<div class="btn editabledTpl unactive">' + _Lang[LS.get('lang')]['editTpl'] + '</div>';
        Object.keys(LS.get('myTpl')).forEach(function(key, index) {
            HTML += '<div class="btn tplItem" data-item="' + key + '">' ;
            HTML += buildTextString(LS.get('myTpl')[key].data);
            HTML += '</div>';
        });
        showFullSize(HTML);
    } else if (_STORE.panel == 'showPhrase') {
        showFullSize(
            '<ul>' +
            buildTextString(_STORE.text) + 
            '</ul>'
        );
    } else if (_STORE.panel == 'settings') {
        HTML += '\
            <ul>\
                <li class="btn" id="langChouse">' + _Lang[LS.get('lang')]['langChouse'] + '</li>\
            </ul>\
        ';
        showFullSize(HTML);
    } else if (_STORE.panel == 'lang') {
        HTML = '<select id="langChanger">'
        Object.keys(_LangNames).forEach(function(key, index) {
            HTML += '<option value="' + key + '" ' + 
                (key == LS.get('lang') ? 'selected' : '') +
                ' >' + _LangNames[key] + '</option>';
        });
        HTML += '</select>';
        showFullSize(HTML);
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
    $('#mySettings').html(_Lang[locale]['mySettings']);
}
