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

//        console.log(dragSource, dragHandle, handler);
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
        
//        console.log(dragTarget, dragHandle, promise);
        if(dragTarget && dragHandle && dragHandle === handle) {
            promise.resolve(dragTarget);
        } else {
            promise.reject();
        }
    }

    function init() {
        DragDropMouseDown = events.attach( body, "mousedown", dragStart );
        DragDropTouchDown = events.attach( body, "touchstart", dragStart );
    }

    function finish() {
        DragDropMouseDown = events.detach( DragDropMouseDown );
        DragDropTouchDown = events.detach( DragDropTouchDown );
    }

    return DragDrop = {
        addHandler: function(handle, handler) {
            handlers[handle] = handler;
            if (!DragDropMouseDown) {
                init();
            }
        }
    };

}(document.documentElement));