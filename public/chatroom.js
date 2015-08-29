    var socket = io();

    function checkEmpty(input) {
        return (input.length === 0 || !input.trim());

    }

    function OnSubmit(from) {
        if (from == "fromChatWindow") {
            if (checkEmpty($('#m').val())) {
                return;
            }

            var atom = {
                what: $('#m').val(),
                who: $('#m1').val(),
                //when: (new Date).toUTCString()
                when: (new Date).getTime()
            }
            socket.emit('inputMessage', JSON.stringify(atom));
            $('#m').val('');

        } else if (from == "fromLogin") {
            if (checkEmpty($('#m1').val())) {
                return;
            }

            socket.connect();
            $('#chatroom').show();
            $('#logout').show();
            $('#username').text('Hi ' + $('#m1').val() + '!')
            $('#login').hide();

        } else if (from == "fromLogout") {
            socket.disconnect();
            showPageOne();
        }
    }


    $(function() {
        showPageOne();
    })

    function showPageOne() {
        $('#chatroom').hide();
        $('#logout').hide();
        $('#username').hide();
        $('#login').show();
        $('#m1').val('');
    }

    function prepareChatBubble(emittedAtom) {

        var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
        d.setUTCMilliseconds(emittedAtom.when);
        var when = "<li><div style=\"color:grey; text-align:center; font-size:x-small\">" + d.toString() + "</div>";
        var who = "<div style=\"color:Red; text-align:center; font-size:x-small\">" + emittedAtom.who + "</div>";
        var what = "<div style=\"font-size:small\">" + emittedAtom.what + "</div></li>";
        $('#messages').append(when + who + what);
    }

    socket.on('inputMessage', function(msg) {
        var emittedAtom = JSON.parse(msg.toString());
        prepareChatBubble(emittedAtom);
        $('#messages').scrollTop($('#messages')[0].scrollHeight);
    });