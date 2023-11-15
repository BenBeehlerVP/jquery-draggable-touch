/**
 * jQuery Draggable Touch v0.6
 * Jonatan Heyman | http://heyman.info 
 *
 * Make HTML elements draggable by using uses touch events.
 * The plugin also has a fallback that uses mouse events, 
 * in case the device doesn't support touch events.
 * 
 * Licenced under THE BEER-WARE LICENSE (Revision 42):
 * Jonatan Heyman (http://heyman.info) wrote this file. As long as you retain this 
 * notice you can do whatever you want with this stuff. If we meet some day, and 
 * you think this stuff is worth it, you can buy me a beer in return.
 */
;(function($){
    /*
        {
            useTransform: value
            noHorizontal: bool
            noVertical: bool
            topBound: value
            leftBound: value
        }
    */

    $.fn.draggableTouch = function(actionOrSettings) {
        // check if the device has touch support, and if not, fallback to use mouse
        // draggableMouse which uses mouse events
        if (window.ontouchstart === undefined) {
            //return this.draggableMouse(actionOrSettings);

            return this;
        }

        if (typeof(actionOrSettings) == "string") {
            // check if we shall make it not draggable
            if (actionOrSettings == "disable") {
                this.unbind("touchstart.draggableTouch");
                this.unbind("touchmove.draggableTouch");
                this.unbind("touchend.draggableTouch");
                this.unbind("touchcancel.draggableTouch");
                
                this.trigger("dragdisabled");

                return this;
            }
        } else {
            var useTransform = actionOrSettings && actionOrSettings.useTransform;
        }

        horizontal = () => {
            if(actionOrSettings == undefined || actionOrSettings == null) {
                return true;
            } else {
                if(actionOrSettings.noHorizontal == null || actionOrSettings.noHorizontal == undefined)  {
                    return true;
                } else {
                    return !actionOrSettings.noHorizontal;
                }
            }
        };

        vertical = () => {
            if(actionOrSettings == undefined || actionOrSettings == null) {
                return true;
            } else {
                if(actionOrSettings.noVertical == null || actionOrSettings.noVertical == undefined)  {
                    return true;
                } else {
                    return !actionOrSettings.noVertical;
                }
            }
        };

        topBound = () => {
            if(actionOrSettings == undefined || actionOrSettings == null) {
                return null;
            } else {
                if(actionOrSettings.topBound == null || actionOrSettings.topBound == undefined)  {
                    return null;
                } else {
                    return actionOrSettings.topBound;
                }
            }
        };

        leftBound = () => {
            if(actionOrSettings == undefined || actionOrSettings == null) {
                return null;
            } else {
                if(actionOrSettings.leftBound == null || actionOrSettings.noVertical == leftBound)  {
                    return null;
                } else {
                    return actionOrSettings.leftBound;
                }
            }
        };

        bottomBound = () => {
            if(actionOrSettings == undefined || actionOrSettings == null) {
                return null;
            } else {
                if(actionOrSettings.bottomBound == null || actionOrSettings.bottomBound == undefined)  {
                    return null;
                } else {
                    return actionOrSettings.bottomBound;
                }
            }
        };

        rightBound = () => {
            if(actionOrSettings == undefined || actionOrSettings == null) {
                return null;
            } else {
                if(actionOrSettings.rightBound == null || actionOrSettings.noVertical == rightBound)  {
                    return null;
                } else {
                    return actionOrSettings.rightBound;
                }
            }
        };

        canMoveHorizontal = (leftPos) => {
            if((leftBound() == null && rightBound() == null) && horizontal()) {
                return true;
            }

            let leftcov = ( leftBound() != null && leftPos < leftBound() );
            let rightcov = ( rightBound() != null && leftPos >= rightBound() );

            if( leftcov || 
                rightcov ) {
                return false;
            }

            return horizontal();
        }

        canMoveVertical = (topPos) => {
            if((topBound() == null && bottomBound() == null) && vertical()) {
                return true;
            }

            let topcov = ( topBound() != null && topPos < topBound() );
            let bottomcov = ( bottomBound() != null && topPos >= bottomBound() );

            if( topcov || 
                bottomcov ) {
                return false;
            }

            return vertical();
        }
        
        this.each(function() {
            var element = $(this);
            var offset = null;
            var draggingTouchId = null;
            var end = function(e) {
                e.preventDefault();
                var orig = e.originalEvent;
                for (var i=0; i<orig.changedTouches.length; i++) {
                    var touch = orig.changedTouches[i];
                    // the only touchend/touchcancel event we care about is the touch
                    // that started the dragging
                    if (touch.identifier != draggingTouchId) {
                        continue;
                    }
                    element.trigger("dragend", {
                        top: orig.changedTouches[0].pageY - offset.y,
                        left: orig.changedTouches[0].pageX - offset.x
                    });
                    draggingTouchId = null;
                }
            };
            
            element.bind("touchstart.draggableTouch", function(e) {
                e.preventDefault();
                var orig = e.originalEvent;
                // if this element is already being dragged, we can early exit, otherwise
                // we need to store which touch started dragging the element
                if (draggingTouchId) {
                    return;
                } else {
                    draggingTouchId = orig.changedTouches[0].identifier;
                }
                var pos = $(this).position();
                offset = {
                    x: orig.changedTouches[0].pageX - pos.left,
                    y: orig.changedTouches[0].pageY - pos.top
                };
                element.trigger("dragstart", pos);
            });
            element.bind("touchmove.draggableTouch", function(e) {
                e.preventDefault();
                var orig = e.originalEvent;
                
                for (var i=0; i<orig.changedTouches.length; i++) {
                    var touch = orig.changedTouches[i];
                    // the only touchend/touchcancel event we care about is the touch
                    // that started the dragging
                    if (touch.identifier != draggingTouchId) {
                        continue;
                    }

                    let leftPos = touch.pageX - offset.x;
                    let topPos = touch.pageY - offset.y;

                    let newpos = { left: e.pageX, top: e.pageY };

                    if(canMoveHorizontal(leftPos)) {
                        newpos.left = leftPos;
                    }

                    if(canMoveVertical(topPos)) {
                        newpos.top = topPos;
                    }

                    element.trigger("dragmove", newpos);

                    if (useTransform) {
                        $(this).css({
                            "transform": "translate3d(" + (leftPos) + "px, " + (topPos) + "px, 0px)",
                        });
                    } else {
                        $(this).css(newpos);
                    }
                }
            });
            element.bind("touchend.draggableTouch touchcancel.draggableTouch", end);
        });
        return this;
    };
    
    /**
     * Draggable fallback for when touch is not available
     */
    $.fn.draggableMouse = function (actionOrSettings) {
        if (typeof(actionOrSettings) == "string") {
            // check if we shall make it not draggable
            if (actionOrSettings == "disable") {
                this.unbind("mousedown.draggableTouch");
                this.unbind("mouseup.draggableTouch");
                $(document).unbind("mousemove.draggableTouch");

                this.trigger("dragdisabled");

                return this;
            }
        } else {
            var useTransform = actionOrSettings && actionOrSettings.useTransform;
        }
        
        this.each(function() {
            var element = $(this);
            var offset = null;
            
            var move = function(e) {
                if (useTransform) {
                    element.css({
                        "transform": "translate3d(" + (e.pageX - offset.x) + "px, " + (e.pageY - offset.y) + "px, 0px)",
                    });
                } else {
                    element.css({
                        top: e.pageY - offset.y,
                        left: e.pageX - offset.x,
                    });
                }
            };
            
            var up = function(e) {
                element.unbind("mouseup.draggableTouch", up);
                $(document).unbind("mousemove.draggableTouch", move);
                element.trigger("dragend", {
                    top: e.pageY - offset.y,
                    left: e.pageX - offset.x
                });
            };
            element.bind("mousedown.draggableTouch", function(e) {
                var pos = element.position();
                offset = {
                    x: e.pageX - pos.left,
                    y: e.pageY - pos.top
                };
                $(document).bind("mousemove.draggableTouch", move);
                element.bind("mouseup.draggableTouch", up);
                element.trigger("dragstart", pos);
                e.preventDefault();
            });
        });
        return this;
    };
})(jQuery);
