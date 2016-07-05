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
