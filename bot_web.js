const mineflayer = require('mineflayer')
const express = require('express')
const app = express()
const port = process.env.PORT || 3000

let bot = null

function startBot() {
  if (bot) return 'Bot läuft bereits!'

    bot = mineflayer.createBot({
    host: 'DEINE_SERVER_IP', 
    port: 25565,             
    auth: 'microsoft'        // <--- Zeile 'version' wurde komplett gelöscht!
  })

  bot.on('spawn', () => {
    console.log('Premium-Bot erfolgreich eingeloggt!')
  })

  bot.on('end', () => {
    console.log('Bot getrennt.')
    bot = null
  })

  bot.on('error', (err) => {
    console.error('Fehler:', err.message)
  })

  return 'Authentifizierung gestartet! Bitte prüfe das Render-Log auf deinem Handy!'
}

function stopBot() {
  if (!bot) return 'Bot ist offline.'
  bot.quit()
  bot = null
  return 'Bot gestoppt.'
}

// Webinterface
app.get('/', (req, res) => {
  res.send(`
    <h1>Premium Minecraft Bot Controller</h1>
    <hr>
    <button style="padding:12px; background:#4CAF50; color:white; border:none;" onclick="fetch('/start').then(r=>r.text()).then(t=>alert(t))">Bot starten (Code anfordern)</button>
    <button style="padding:12px; background:#f44336; color:white; border:none;" onclick="fetch('/stop').then(r=>r.text()).then(t=>alert(t))">Bot stoppen</button>
  `)
})

app.get('/start', (req, res) => res.send(startBot()))
app.get('/stop', (req, res) => res.send(stopBot()))

app.listen(port, () => console.log(`Webserver läuft`))
