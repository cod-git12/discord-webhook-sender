# Discord Webhook Sender 🚀

A simple and powerful web tool to send messages through Discord Webhooks.  
Runs entirely in your browser with support for loop sending, custom timing, and profile overrides.

[日本語のドキュメント](README_ja.md)

## ✨ Features

- **Easy to Use**: Paste your Webhook URL and start sending immediately.
- **Batch Sending**: Send multiple messages automatically with a single click.
- **Advanced Customization**:
    - Adjustable delay (ms) between messages.
    - Override Webhook name and avatar URL.
    - Toggle `@everyone` mentions.
- **Real-time Tracking**: Monitor progress with a visual bar and success/failure counters.
- **Error Handling**: View detailed error logs and download them as a `.txt` file if something goes wrong.
- **Auto-Save**: Your settings (URL, messages, etc.) are automatically saved to your browser's LocalStorage.

## 🚀 How to Use

1. **Get Webhook URL**: In Discord, go to `Server Settings` > `Integrations` > `Webhooks` and copy your URL.
2. **Input Details**: Enter the URL, message content, count, and optional delay in the tool.
3. **Start Sending**: Click the **Send** button.
4. **Stop/Reset**: Use the **Stop** button to interrupt the process or **Reset** to clear the form.

## 🛠️ Project Structure

📁 discord-webhook-sender
├ 📂[README.md](README.md): English documentation
├ 📂[README_ja.md](README_ja.md): Japanese documentation
├ 📂[index.html](index.html): Tool structure
├ 📂[style.css](script.js): Design (responsive)
└ 📂[script.js](script.js): Sending logic and saving functionality

## License
```
This project is licensed under the **Apache License 2.0**.

Copyright (c) 2026 cod-git12

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```
## ⚠️ Disclaimer

- This tool is for educational and productivity purposes only.
- Please follow the **Discord Terms of Service (ToS)**. Do not use this tool for spamming or harassing others.
- Sending too many messages in a short period may result in **Rate Limits** or the deletion of your Webhook by Discord.

---
Developed with ❤️ for Discord Users.
