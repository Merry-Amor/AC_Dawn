

    var socket = io();

    socket.emit('get system list');
    socket.on('post system list', function(msg){
      for (var i = 0; i < msg.length; i++) {
          select_system.options[i] = new Option(msg[i][0], i);
      };
    });

    $(function () {
          $("a.open").click(function(){
              $("#floatWindow").fadeIn("fast");
              return false;
          })

          $("#floatWindow a.close").click(function(){
              $("#floatWindow").fadeOut("fast");
              return false;
          })
          $("#floatWindow dl dt").mousedown(function(e){

              $("#floatWindow")
                  .data("clickPointX" , e.pageX - $("#floatWindow").offset().left)
                  .data("clickPointY" , e.pageY - $("#floatWindow").offset().top);

              $(document).mousemove(function(e){
                  $("#floatWindow").css({
                      top:e.pageY  - $("#floatWindow").data("clickPointY")+"px",
                      left:e.pageX - $("#floatWindow").data("clickPointX")+"px"
                  })
              })

          }).mouseup(function(){
              $(document).unbind("mousemove")

          })

        $('form').submit(function(){
            socket.emit('chat message', $('#chatName').val() + ':' + $('#chatText').val());
            $('#chatText').val('') + ':' + $('#chatText').val('');
            return false;
        });
        socket.on('chat message', function(msg){
            $('#timeline').append($('<li>').text(msg));
        });
    });
