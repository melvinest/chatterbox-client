
// YOUR CODE HERE:
class App {
  constructor() {
    this.server = 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages';
    this.timeStamp;
    this.roomNames = {};
    this.currentSetInterval;
  }

  init() {
    var application = this;

    var showRoomMessages = function() {
      event.stopPropagation();
      console.log($(this).val());
      var roomQuery = {where: {roomname: $(this).val()}};
      $('#chats').empty();
      application.fetch(roomQuery);
      clearInterval(application.currentSetInterval);
      application.currentSetInterval = setInterval(application.update.bind(application,roomQuery), 5000); 
    }

    this.fetch();
    $('#main').on('click', '.username', this.handleUsernameClick.bind(this));
    $('#send').on('click', this.handleSubmit.bind(this));
    $('.dropdown').on('change', showRoomMessages);
    this.currentSetInterval = setInterval(this.update.bind(this), 5000);

  }

  

  send(message) {
    var application = this;
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

  fetch(query) {
    var application = this;
    var queryData = {order: '-createdAt'};

    if (query !== undefined) {
      _.extend(queryData, query);
    }

    $.ajax({
      url: this.server,
      type: 'GET',
      data: queryData,
      contentType: 'application/json',

      success: function (data) {
        application.timeStamp = data['results'][0].createdAt;
        application.renderMessage(data['results']);
      
      },

      error: function (data) {
        console.error('chatterbox: Failed to send message', data);
      }
    });
  }

  update(query) {
    var application = this;
    var queryData = {order: '-createdAt', where:{createdAt:{'$gt':{'__type':'Date','iso':application.timeStamp}}}};

    if (query !== undefined) {
      // _.extend(queryData, query);
      queryData = {order: '-createdAt', where:{roomname: query['where'], createdAt:{'$gt':{'__type':'Date','iso':application.timeStamp}}}}
    }

    $.ajax({
      url: this.server,
      type: 'GET',
      data: queryData,
      contentType: 'application/json',

      success: function (data) {
        if(data['results'].length > 0) {
          application.timeStamp = data['results'][0].createdAt;
          application.updateMessage(data['results']);
        } 
      },

      error: function (data) {
        console.error('chatterbox: Failed to send message');
      }
    });
  }
  
  renderMessage(chats) {
    for (var i = 0; i < chats.length; i++) {
      var $userName = $('<div></div>').addClass('username').text(chats[i].username);
      var $time = $('<div></div>').addClass('time').text(new Date(chats[i].createdAt));
      var $message = $('<div></div>').addClass('message').text(chats[i].text);  
      var $chatContainer = $('<div></div>').addClass('container');
      // console.log(chats[i]['roomname'])
      if(chats[i]['roomname'] !== undefined) {
        this.roomNames[chats[i].roomname] = chats[i].roomname;
      }
      $chatContainer.append($userName);
      $chatContainer.append($time);
      $chatContainer.append($message);
      $('#chats').append($chatContainer);
    }
    this.showRoom();
  }

  updateMessage(chats) {
    for (var i = 0; i < chats.length; i++) {
      var $userName = $('<div></div>').addClass('username').text(chats[i].username);
      var $time = $('<div></div>').addClass('time').text(new Date(chats[i].createdAt));
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
    event.stopPropagation();
    var message = { 'username': window.location.search.slice(10), 'text': $('input').val()};
    $('input').val('');
    this.send(message);
  }

  showRoom() {
    var val = $('.dropdown').val()
    $('.dropdown').empty();
    $('.dropdown').append('<option disabled selected value> -- select an option -- </option>')
    $('.dropdown').append('<option>General</option>');
    for (var key in (this.roomNames)){
      console.log('this is showing');
      var $roomName = $('<option></option>').text(this.roomNames[key]);
      $('.dropdown').append($roomName);
    }
    $('.dropdown').val(val);
  }

};


$(document).ready(function() {
  var app = new App();
  app.init();
});




