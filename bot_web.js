const bedrock = require('bedrock-protocol')
const express = require('express')
const app = express()
const port = process.env.PORT || 3000

let client = null

function startBot() {
  if (client) return 'Bot läuft bereits!'

  client = bedrock.createClient({
    host: 'DEINE_BEDROCK_SERVER_IP', // <--- Hier die Server-IP eintragen!
    port: 19132,                     // <--- Standard-Bedrock-Port ist 19132
    username: 'BedrockBot',          // Name des Bots
    offline: true                    // 'true' für Cracked/Offline-Server, 'false' für Xbox-Live-Zwang
  })

  client.on('spawn', () => console.log('Bedrock-Bot ist erfolgreich gespawnt!'))
  client.on('close', () => {
    console.log('Verbindung getrennt.')
    client = null
  })
  client.on('error', (err) => console.error('Fehler:', err))

  return 'Startbefehl an den Bedrock-Bot gesendet!'
}

function stopBot() {
  if (!client) return 'Bot ist nicht online.'
  client.disconnect()
  client = null
  return 'Bot gestoppt.'
}

// Funktion, um Commands über das Webinterface zu senden
function sendCommand(cmd) {
  if (!client) return 'Bot ist offline! Kann keinen Befehl senden.'
  
  // Formatieren und Absenden des Textes/Befehls in das Bedrock-Netzwerk
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

// Erweiterte Webseite mit Eingabefeld für Commands
app.get('/', (req, res) => {
  res.send(`
    <h1>Minecraft Bedrock Bot Controller</h1>
    <hr>
    <button style="padding:10px;" onclick="fetch('/start').then(r=>r.text()).then(t=>alert(t))">1. Bot starten</button>
    <button style="padding:10px;" onclick="fetch('/stop').then(r=>r.text()).then(t=>alert(t))">Bot stoppen</button>
    <hr>
    <h3>Command ausführen:</h3>
    <input type="text" id="cmdInput" placeholder="/say Hallo Welt" style="width:70%; padding:8px;">
    <button style="padding:8px;" onclick="sendCmd()">Senden</button>

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

app.listen(port, () => console.log(`Webserver läuft!`))
