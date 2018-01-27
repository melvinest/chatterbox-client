
// YOUR CODE HERE:
class App {
  constructor() {
    this.server = 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages';
    this.timeStamp;
  }

  init() {
      this.fetch();
      console.log(this);
      $('#main').on('click', '.username', this.handleUsernameClick.bind(this));
      $('#send').on('click', this.handleSubmit.bind(this));
      setInterval(this.update.bind(this), 3000);
  }

  send(message) {
    var application = this;
    console.log(message)
    $.ajax({
      url: this.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',

      success: function (data) {
        application.update();
      },

      error: function (data) {
        console.error('chatterbox: Failed to send message', data);
      }
    });
  }

  fetch() {
    var application = this;
    $.ajax({
      url: this.server,
      type: 'GET',
      data: {order: '-createdAt'},
      contentType: 'application/json',

      success: function (data) {
        console.log('chatterbox: Message sent');
        console.log(data);
        application.timeStamp = data['results'][0].createdAt;
        application.renderMessage(data['results']);
      },

      error: function (data) {
        console.error('chatterbox: Failed to send message', data);
      }
    });
  }

  update() {
    var application = this;
    $.ajax({
      url: this.server,
      type: 'GET',
      data: {order: '-createdAt', where:{createdAt:{'$gt':{'__type':'Date','iso':application.timeStamp}}}},
      contentType: 'application/json',

      success: function (data) {
        console.log('chatterbox: Message sent');
        console.log(data);
        if(data['results'].length > 0) {
          application.timeStamp = data['results'][0].createdAt;
          application.updateMessage(data['results']);
        } 
      },

      error: function (data) {
        console.error('chatterbox: Failed to send message', data);
      }
    });
  }
  
  renderMessage(chats) {
    for (var i = 0; i < chats.length; i++) {
      var $userName = $('<div></div>').addClass('username').text(chats[i].username);
      var $time = $('<div></div>').addClass('time').text(chats[i].createdAt);
      var $message = $('<div></div>').addClass('message').text(chats[i].text);
      // var $message = $('<div>'+chats[i].text+'</div>').addClass('message').text(chats[i].text);
      var $chatContainer = $('<div></div>').addClass('container');
      $chatContainer.append($userName);
      $chatContainer.append($time);
      $chatContainer.append($message);
      $('#chats').append($chatContainer);
    }
  }

  updateMessage(chats) {
    for (var i = 0; i < chats.length; i++) {
      var $userName = $('<div></div>').addClass('username').text(chats[i].username);
      var $time = $('<div></div>').addClass('time').text(chats[i].createdAt);
      var $message = $('<div></div>').addClass('message').text(chats[i].text);

      var $chatContainer = $('<div></div>').addClass('container');
      $chatContainer.append($userName);
      $chatContainer.append($time);
      $chatContainer.append($message);
      $('#chats').prepend($chatContainer);
    }
  }

  clearMessages() {
    $('#chats').empty();
  }

  renderRoom(roomName) { 
    $('#roomSelect').append('<div>' + roomName + '</div>');
  }

  handleUsernameClick() {
    console.log('test');
  }

  handleSubmit() {
    var message = { 'username': window.location.search.slice(10), 'text': $('input').val()};
    console.log(this);
    this.send(message);
  }
};


$(document).ready(function() {
  var app = new App();
  app.init();
});




