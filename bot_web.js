const mineflayer = require('mineflayer')
const express = require('express')
const app = express()
const port = process.env.PORT || 3000

let bot = null

function startBot() {
  if (bot) return 'Bot läuft bereits!'

  bot = mineflayer.createBot({
    host: 'DEINE_SERVER_IP', // <--- Hier die Server-IP eintragen!
    port: 25565,
    username: 'WebBot'
  })

  bot.on('spawn', () => console.log('Bot eingeloggt!'))
  bot.on('end', () => {
    console.log('Bot ausgeloggt!')
    bot = null
  })
  
  return 'Bot-Startbefehl gesendet!'
}

function stopBot() {
  if (!bot) return 'Bot ist gar nicht online.'
  bot.quit()
  bot = null
  return 'Bot-Stoppbefehl gesendet!'
}

app.get('/', (req, res) => {
  res.send(`
    <h1>Minecraft Bot Controller</h1>
    <button onclick="fetch('/start').then(r => r.text()).then(t => alert(t))">Bot starten</button>
    <button onclick="fetch('/stop').then(r => r.text()).then(t => alert(t))">Bot stoppen</button>
  `)
})

app.get('/start', (req, res) => res.send(startBot()))
app.get('/stop', (req, res) => res.send(stopBot()))

app.listen(port, () => {
  console.log(`Website läuft!`)
})

