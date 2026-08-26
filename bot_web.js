const mineflayer = require('mineflayer')
const express = require('express')
const app = express()
const port = process.env.PORT || 3000

let bot = null
let afkInterval = null

function startBot() {
  if (bot) return 'Bot läuft bereits!'

  bot = mineflayer.createBot({
    host: 'BreiwalkerSMP.net', // <--- Hier die normale Java-IP eintragen
    port: 19132,                  // <--- Hier den Java-Port eintragen (Standard: 25565)
    username: 'King4729f',    // Name des Bots
    version: '26.2'               // Mineflayer übersetzt dies passend für den Server
  })

  bot.on('spawn', () => {
    console.log('Bot ist auf dem Java-Server gespawnt!')
    
    // Anti-AFK System: Der Bot springt alle 4 Sekunden, damit Aternos ihn nicht kickt
    afkInterval = setInterval(() => {
      if (bot) {
        bot.setControlState('jump', true)
        setTimeout(() => bot.setControlState('jump', false), 500)
      }
    }, 4000)
  })

  bot.on('end', () => {
    console.log('Bot hat die Verbindung verloren.')
    clearInterval(afkInterval)
    bot = null
  })

  bot.on('error', (err) => {
    console.error('Fehler:', err.message)
  })

  return 'Java-Bot gestartet und Anti-AFK aktiviert!'
}

function stopBot() {
  if (!bot) return 'Bot ist offline.'
  clearInterval(afkInterval)
  bot.quit()
  bot = null
  return 'Bot gestoppt.'
}

function sendChat(message) {
  if (!bot) return 'Bot ist offline!'
  bot.chat(message) // Sendet echten Text oder Befehle wie /say in den Chat
  return `Nachricht "${message}" gesendet!`
}

// Webinterface
app.get('/', (req, res) => {
  res.send(`
    <h1>Aternos Anti-AFK Bot Controller</h1>
    <hr>
    <button style="padding:12px; background:#008CBA; color:white; border:none; border-radius:5px;" onclick="fetch('/start').then(r=>r.text()).then(t=>alert(t))">Bot auf Server schicken</button>
    <button style="padding:12px; background:#f44336; color:white; border:none; border-radius:5px;" onclick="fetch('/stop').then(r=>r.text()).then(t=>alert(t))">Bot trennen</button>
    <hr>
    <h3>Chat / Server-Befehl senden:</h3>
    <input type="text" id="msgInput" placeholder="/register meinpasswort123" style="width:70%; padding:10px;">
    <button style="padding:10px;" onclick="sendMsg()">Senden</button>

    <script>
      function sendMsg() {
        const val = encodeURIComponent(document.getElementById('msgInput').value);
        fetch('/chat?msg=' + val).then(r=>r.text()).then(t=>alert(t));
      }
    </script>
  `)
})

app.get('/start', (req, res) => res.send(startBot()))
app.get('/stop', (req, res) => res.send(stopBot()))
app.get('/chat', (req, res) => res.send(sendChat(req.query.msg)))

app.listen(port, () => console.log(`Webserver läuft`))
