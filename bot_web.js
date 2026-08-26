const bedrock = require('bedrock-protocol')
const express = require('express')
const app = express()
const port = process.env.PORT || 3000

let client = null

function startBot() {
  if (client) return 'Bot läuft bereits!'

  client = bedrock.createClient({
    host: 'BreiwalkerSMP.net', // <--- Hier deine Server-IP eintragen
    port: 19132,                     // <--- Hier den Bedrock-Port eintragen
    username: 'King48297',       // Ein Name ohne ungültige Sonderzeichen
    offline: true,
    // Diese Zusatzdaten simulieren einen echten Bedrock-Spieler über Geyser
    skinData: {
      DeviceOS: 1,                   // Simuliert ein Android-Gerät
      CurrentInputMode: 1,
      DefaultInputMode: 1,
      DeviceModel: 'Render Bot Platform'
    }
  })

  client.on('spawn', () => {
    console.log('Bot ist erfolgreich über Geyser gespawnt!')
  })

  client.on('close', () => {
    console.log('Verbindung zum Geyser-Server getrennt.')
    client = null
  })

  client.on('error', (err) => {
    console.error('Verbindungsfehler:', err.message)
  })

  return 'Startbefehl an den Geyser-Bot gesendet!'
}

function stopBot() {
  if (!client) return 'Bot ist nicht online.'
  client.disconnect()
  client = null
  return 'Bot gestoppt.'
}

function sendCommand(cmd) {
  if (!client) return 'Bot ist offline!'
  
  client.write('text', {
    type: 'chat',
    needs_translation: false,
    source_name: client.username,
    xuid: '',
    platform_chat_id: '',
    message: cmd
  })
  return `Befehl "${cmd}" gesendet!`
}

// Webseite
app.get('/', (req, res) => {
  res.send(`
    <h1>Minecraft Geyser Bot Controller</h1>
    <hr>
    <button style="padding:12px; background:#4CAF50; color:white; border:none; border-radius:5px;" onclick="fetch('/start').then(r=>r.text()).then(t=>alert(t))">1. Bot starten</button>
    <button style="padding:12px; background:#f44336; color:white; border:none; border-radius:5px;" onclick="fetch('/stop').then(r=>r.text()).then(t=>alert(t))">Bot stoppen</button>
    <hr>
    <h3>Befehl / Chat senden:</h3>
    <input type="text" id="cmdInput" placeholder="/say Hallo" style="width:70%; padding:10px;">
    <button style="padding:10px;" onclick="sendCmd()">Senden</button>

    <script>
      function sendCmd() {
        const val = encodeURIComponent(document.getElementById('cmdInput').value);
        fetch('/command?cmd=' + val).then(r=>r.text()).then(t=>alert(t));
      }
    </script>
  `)
})

app.get('/start', (req, res) => res.send(startBot()))
app.get('/stop', (req, res) => res.send(stopBot()))
app.get('/command', (req, res) => res.send(sendCommand(req.query.cmd)))

app.listen(port, () => console.log(`Webserver aktiv`))
