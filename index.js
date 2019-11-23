var TelegramBot = require('node-telegram-bot-api');
const JSONdb = require('simple-json-db');
const db = new JSONdb('./database.json');
var token = '875658372:AAF9SD3Qs35MtlmTG0xvg2WaYNrbo_jTP-I';

var bot = new TelegramBot(token, {
  polling: true
});

var questions = [{
  title: 'Представь, что вместо плаката зеркало с предложением товара, который ты хочешь в данный момент. И магазин с товаром в этом же торговом центре!\n\nКруто?',
  buttons: [
    [{
      text: 'Да!',
      callback_data: '1_1'
    }],
    [{
      text: 'Нет!',
      callback_data: '1_0'
    }]
  ]
},{
  title: 'Какая реклама интереснее: аудио с анимацией или текст?',
  buttons: [
    [{
      text: 'Интерактивная анимация',
      callback_data: '2_1'
    }],
    [{
      text: 'Обычный текст с картинкой',
      callback_data: '2_0'
    }]
  ]
},{
  title: 'Интересно ли вам, если товар будет сразу интерактивно примерятся к вам в виде голограммы? И вы сможете увидеть это в зеркале.',
  buttons: [
    [{
      text: 'Да!',
      callback_data: '3_1'
    }],
    [{
      text: 'Нет!',
      callback_data: '3_0'
    }]
  ]
},{
  title: 'Интересно ли вам, если вы сможете получить консультацию о товаре не отходя от зеркала?',
  buttons: [
    [{
      text: 'Да!',
      callback_data: '4_1'
    }],
    [{
      text: 'Нет!',
      callback_data: '4_0'
    }]
  ]
}];

function newQuestion(msg, index) {
  var arr = questions[index];
  var text = arr.title;
  var options = {
    reply_markup: JSON.stringify({
      inline_keyboard: arr.buttons
    })
  };
  chat = msg.hasOwnProperty('chat') ? msg.chat.id : msg.from.id;
  bot.sendMessage(chat, text, options);
}

bot.onText(/\/start/, function (msg, match) {
  newQuestion(msg, 0);
});

bot.onText(/\/super_info/, function (msg, match) {
  var text = 'Статистика:\n1 вопрос: За - ' + db.get('1_1') + ', Против - ' + db.get('1_0') + '\n' 
  + '2 вопрос: За - ' + db.get('2_1') + ', Против - ' + db.get('2_0') +
  '\n3 вопрос: За - ' + db.get('3_1') + ', Против - ' + db.get('3_0') +
  '\n4 вопрос: За - ' + db.get('4_1') + ', Против - ' + db.get('4_0');
  chat = msg.hasOwnProperty('chat') ? msg.chat.id : msg.from.id;
  bot.sendMessage(chat, text);
});

bot.on('callback_query', function (msg) {
  let next_question = msg.data.split('_')[0];
  //console.log(msg.data);
  if (next_question < questions.length) {
    newQuestion(msg, parseInt(next_question));
  }
  else {
    bot.answerCallbackQuery(msg.id, 'Благодарим тебя за ответы!', true);
  }
  db.set(msg.data, db.get(msg.data) + 1);
});