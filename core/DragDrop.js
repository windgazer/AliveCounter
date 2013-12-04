var DragDrop = (function(body){

    var DragDropMouseDown,
        DragDropTouchDown,
        DragDropMouseUp,
        DragDropTouchUp,
        DragDropMove,
        handlers = {},
        source = null,
        handle = null,
        promise = null;

    function dragStart(e) {
        var e = e||event,
            target = e.target||e.srcElement,
            dragSource = target,
            dragHandle = null,
            handler;
        
        while (dragSource && !(dragHandle = dragSource.getAttribute("data-dragsource"))){
            dragSource = dragSource.parentNode;
        }
        
        handler = handlers[dragHandle]

        if(dragSource && dragHandle && handler) {
            handle = dragHandle;
            source = dragSource;
            //Create Promise
            promise = new RSVP.Promise();
            //Create .then()...
            promise.then( function(dragTarget) {
                //console.log(dragSource, dragTarget);
                handler(dragSource,dragTarget);
            });
            //Create mouse/touch up handler to fullfill promise
            DragDropMouseUp = events.attach( body, "mouseup", dragStop );
            DragDropTouchUp = events.attach( body, "touchend", dragStop );
            //For Android, must kill touchMove or no touchEnd is fired?!?
            DragDropMove = events.attach( body, 'touchmove', function (e) { e.preventDefault(); });

        }
        
    }

    function dragStop(e) {
        DragDropMouseUp = events.detach(DragDropMouseUp);
        DragDropTouchUp = events.detach(DragDropTouchUp);
        DragDropMove = events.detach(DragDropMove);

        var e = e||event,
            target = e.target||e.srcElement,
            dragTarget = target,
            dragHandle = null;

        if (e.changedTouches && document.elementFromPoint) {
            dragTarget = document.elementFromPoint(
                e.changedTouches[0].pageX,
                e.changedTouches[0].pageY
            );
        }

        while (
            dragTarget &&
            !(dragHandle = dragTarget.getAttribute("data-dragtarget"))
        ){
            dragTarget = dragTarget.parentNode;
        }

        if(dragTarget && dragHandle && dragHandle === handle) {
            promise.resolve(dragTarget);
        } else {
            promise.reject();
        }
    }

    function init() {
        DragDropMouseDown = Events.attach( body, "mousedown", dragStart );
        DragDropTouchDown = Events.attach( body, "touchstart", dragStart );
        Events.attach( body, 'touchstart', function (e) { e.preventDefault(); });
        Events.attach( body, 'touchmove', function (e) { e.preventDefault(); });
    }

    function finish() {
        DragDropMouseDown = Events.detach( DragDropMouseDown );
        DragDropTouchDown = Events.detach( DragDropTouchDown );
    }
    
    init();

    return DragDrop = {
        addHandler: function(handle, handler) {
            handlers[handle] = handler;
        }
    };

}(document.documentElement));