# Discord Webhook Sender 🚀

A simple and powerful web tool to send messages through Discord Webhooks.  
Runs entirely in your browser with support for loop sending, custom timing, and profile overrides.

[日本語の説明](README_ja.md)

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

- `index.html`: Web structure
- `style.css`: Modern responsive UI
- `script.js`: Core logic, Fetch API, and storage management

## ⚠️ Disclaimer

- This tool is for educational and productivity purposes only.
- Please follow the **Discord Terms of Service (ToS)**. Do not use this tool for spamming or harassing others.
- Sending too many messages in a short period may result in **Rate Limits** or the deletion of your Webhook by Discord.

---
Developed with ❤️ for Discord Users.
