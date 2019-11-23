// Dependencies
const express = require('express');
const app = express();
const axios = require('axios');
const bodyParser = require('body-parser');
const port = 3000;
const url = 'https://api.telegram.org/bot';
const apiToken = '875658372:AAF9SD3Qs35MtlmTG0xvg2WaYNrbo_jTP-I';
app.use(bodyParser.json());
app.post('/', (req, res) => {
    // console.log(req.body);
    const chatId = req.body.message.chat.id;
    const sentMessage = req.body.message.text;     // Regex for hello
    if (sentMessage.match(/hello/gi)) {
         axios.post(`${url}${apiToken}/sendMessage`,
              {
                   chat_id: chatId,
                   text: 'hello back 👋'
              })
              .then((response) => { 
                   res.status(200).send(response);
              }).catch((error) => {
                   res.send(error);
              });
    } else {
         // if no hello present, just respond with 200 
         res.status(200).send({});
    }
});
app.listen(port, () => {
     console.log(`Listening on port ${port}`);
});