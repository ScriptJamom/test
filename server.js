const express = require('express');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;
const validKeys = [];

app.use(express.json());

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="ru">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Ключи</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
          text-align: center;
          background-color: #f4f4f4;
        }
        header {
          background-color: #007bff;
          color: white;
          padding: 1rem;
        }
        main {
          padding: 2rem;
        }
        section {
          margin: 2rem 0;
        }
        input {
          padding: 0.5rem;
          margin-right: 0.5rem;
        }
        button {
          padding: 0.5rem 1rem;
          background-color: #007bff;
          color: white;
          border: none;
          cursor: pointer;
        }
        button:hover {
          background-color: #0056b3;
        }
        footer {
          background-color: #333;
          color: white;
          padding: 1rem;
          position: fixed;
          bottom: 0;
          width: 100%;
        }
      </style>
    </head>
    <body>
      <header>
        <h1>Система ключей</h1>
      </header>
      <main>
        <section>
          <h2>Сгенерировать ключ</h2>
          <button onclick="generateKey()">Сгенерировать</button>
          <p id="generated-key"></p>
        </section>
        <section>
          <h2>Проверить ключ</h2>
          <input type="text" id="key-input" placeholder="Введите ключ">
          <button onclick="verifyKey()">Проверить</button>
          <p id="verify-result"></p>
        </section>
      </main>
      <footer>
        <p>© 2025</p>
      </footer>
      <script>
        async function generateKey() {
          const response = await fetch('/generate-key', { method: 'POST' });
          const data = await response.json();
          document.getElementById('generated-key').textContent = 'Ключ: ' + data.key;
        }
        async function verifyKey() {
          const key = document.getElementById('key-input').value;
          const response = await fetch('/verify-key', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key })
          });
          const data = await response.json();
          document.getElementById('verify-result').textContent = data.message;
        }
      </script>
    </body>
    </html>
  `);
});

app.post('/generate-key', (req, res) => {
  const rawKey = uuidv4();
  const hash = crypto.createHash('sha256').update(rawKey).digest('hex');
  validKeys.push(hash);
  res.json({ key: hash });
});

app.post('/verify-key', (req, res) => {
  const { key } = req.body;
  if (!key) {
    return res.status(400).json({ valid: false, message: 'Ключ не указан' });
  }
  const isValid = validKeys.includes(key);
  res.json({ valid: isValid, message: isValid ? 'Ключ действителен' : 'Ключ недействителен' });
});

app.listen(PORT, () => {
  console.log(`Сервер на порту ${PORT}`);
});
