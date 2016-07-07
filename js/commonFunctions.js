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

var removeTpl = function (id) {
    var tmp = LS.get('myTpl');
    delete tmp[id];

    return tmp;
};
