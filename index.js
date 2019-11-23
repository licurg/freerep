var TelegramBot = require('node-telegram-bot-api');
const JSONdb = require('simple-json-db');
const db = new JSONdb('./database.json');
var token = '875658372:AAF9SD3Qs35MtlmTG0xvg2WaYNrbo_jTP-I';

var bot = new TelegramBot(token, {polling: true});

var questions = [
  {
    title:'Представь, что вместо плаката зеркало с предложением товара, который ты хочешь в данный момент. И магазин с товаром в этом же торговом центре!\n\nКруто?',
    buttons: [
        [{ text: 'Да!', callback_data: 'yes' }],
        [{ text: 'Нет!', callback_data: 'no' }]
      ]
  }
];

function newQuestion(msg){
  var arr = questions[0];
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
  newQuestion(msg);
});

bot.on('callback_query', function (msg) {
    if (db.get(msg.from.id.toString()) == 'yes' || db.get(msg.from.id.toString()) == 'no') {
        bot.answerCallbackQuery(msg.id, 'Спасибо, ты уже голосовал!', true);
    }
    else {
        db.set(msg.from.id.toString(), msg.data);
        bot.answerCallbackQuery(msg.id, 'Благодарим тебя за ответ!', true);
    }
});