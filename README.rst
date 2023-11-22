jQuery Draggable Touch
======================

Make HTML elements draggable, and supports multi touch. Main implementation uses 
touch events, but the plugin also has a fallback that uses mouse events.

The main reason that this plugin exist is that there are currently no 
good jQuery plugin for making elements draggable, that has touch devices 
as it's main target (at least that I know of). `jQuery UI <http://jqueryui.com/draggable/>`_ 
has a draggable plugin which, together with `jQuery UI Touch Punch <http://touchpunch.furf.com/>`_, 
can be used to make elements draggable on touch devices. However, due to 
Touch Punch generating fake mouse events, and jQuery UI's draggable plugin, using these fake 
mouse events when dragging elements, it's error prone and contains weird bugs.

I decided it was simpler to just write a draggable plugin whose main target 
was touch devices, and that uses touch events (even though it still has a 
fallback on mouseevents when the browser/device doesn't support touch events).

Features
--------

* Main target is touch devices
* Small and simple
* Supports dragging multiple elements at the same time


Usage example
-------------

::

    $(".my-draggables")
        .draggableTouch()
        .bind("dragstart", function(event, pos) {
            //called when the object's drag is started on touch devices.
            console.log("drag started on:", this, "at position:", pos);
        })
        .bind("dragmove", function(event, pos) {
            //called when the object's drag is continued on touch devices.
            console.log("drag continued on:", this, "at position:", pos);
        })
        .bind("dragend", function(event, pos) {
            //called when the object's drag is ended (let go) on touch devices.
            console.log("drag ended on:", this, "at position:", pos);
        });

The following options for enabling draggable touch::

    $(".my-draggables").draggableTouch(
        {
            useTransform: <bool> //enables/disables movement via transform (defaults to false)
            noHorizontal: <bool> //enables/disables horizontal movement (defaults to false)
            noVertical: <bool> //enables/disables vertical movement (defaults to false)
            topBound: <numerical> //sets top bound for object (defaults to unbounded)
            leftBound: <numerical> //sets left bound for object (defaults to unbounded)
            bottomBound: <numerical> //sets bottom bound for object (defaults to unbounded)
            rightBound: <numerical> //sets right bound for object (defaults to unbounded)
        }
    );

To disable dragability::

    $(".my-draggables").draggableTouch("disable");


See example
-----------

`Here <https://heyman.github.io/jquery-draggable-touch/example.html>`_ is a super simple
- and frankly quite ugly - example page.


Copyright & License
-------------------

This plugin is written by `Jonatan Heyman <http://heyman.info>`_ and is licenced as 
`Beerware <http://en.wikipedia.org/wiki/Beerware>`_.


