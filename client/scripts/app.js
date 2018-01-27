
// YOUR CODE HERE:
var app = {
  send: function(message) {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: this.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        // console.log('chatterbox: Message sent');
        // console.log(data);
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  },

  fetch: function() {
    return $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: this.server,
//'?where={"createdAt":{"$gte":{"__type":"Date","iso":"2018-01-25T00:00:00.000Z"}}}'
      type: 'GET',
      data: {order: '-createdAt'},
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
        console.log(data);
        app.renderMessage(data['results']);
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  },
  server: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
  renderMessage: function(chats) {
    console.log(chats);
    for (var i = 0; i < chats.length; i++) {
      var $userName = $('<div></div>').addClass('username').text(chats[i].username);
      var $time = $('<div></div>').addClass('time').text(chats[i].createdAt);
      var $message = $('<div></div>').addClass('message').text(chats[i].text);
      var $chatContainer = $('<div></div>').addClass('container');
      $chatContainer.append($userName);
      $chatContainer.append($time);
      $chatContainer.append($message);
      $('#chats').append($chatContainer);
    }
  },

  clearMessages: function() {
    $('#chats').empty();
  },
  renderRoom: function(roomName) { 
    $('#roomSelect').append('<div>' + roomName + '</div>');
  },
  handleUsernameClick: function() {
    console.log('test');
  },

  handleSubmit: function() {
    var message = { username: window.location.search.slice(10), text: $('input').val()};
    app.send(message);
  }
};


app.init = function() {
  $(document).ready(function() {
    $('#main').on('click', '.username', app.handleUsernameClick);
    $('#send').on('click', app.handleSubmit);

    
    
    app.send();

    app.fetch();

  });
};

app.init();





