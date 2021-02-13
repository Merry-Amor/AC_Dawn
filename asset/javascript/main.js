

    var socket = io();

    var system_list = []

    socket.emit('get system list');
    socket.on('post system list', function(msg){
      for (var i = 0; i < msg.length; i++) {
          select_system.options[i] = new Option(msg[i][0], i);
          system_list.push(msg[i][1])
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
            system_num = $("#select_system").val();
            system_name = system_list[system_num];
            chatText = $('#chatText').val();
            chatName = $("#chatName").val();
            chat_detail = {
               message: chatText,
               name: chatName,
               system: system_name
            }
            socket.emit('chat message', chat_detail);
            $('#chatText').val('') + ':' + $('#chatText').val('');
            return false;
        });
        socket.on('chat message', function(msg){
            $('#timeline').append($('<li>').text(msg));
        });
    });
