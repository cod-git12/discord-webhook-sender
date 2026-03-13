const i18n = {
    ja: {
        title: "Discord Webhook 送信ツール",
        labelWebhook: "Webhook URL:",
        labelMessage: "送信内容:",
        labelCount: "送信回数:",
        labelDelay: "送信間隔（ms）:",
        labelUsername: "表示名（Webhook名）:",
        labelAvatar: "アイコンURL:",
        checkEveryone: "@everyone を付ける",
        btnSend: "送信",
        btnStop: "停止",
        btnReset: "リセット",
        btnYes: "はい",
        btnCancel: "キャンセル",
        btnClose: "閉じる",
        modalErrorTitle: "失敗詳細",
        modalResetTitle: "確認",
        modalResetBody: "本当にリセットしますか？",
        msgStopped: "実行を停止しました。",
        msgSuccess: "送信成功",
        msgFail: "送信失敗",
        msgSummary: "{t}回中 {s}回成功、{f}回失敗 成功率{p}%",
        btnViewError: "エラーを表示",
        placeholderMsg: "メッセージ（空欄で「こんにちは」）",
        placeholderCount: "回数（空欄で5回）",
        placeholderDelay: "ミリ秒（空欄で0）",
        placeholderUser: "空欄で変更なし",
        placeholderAvatar: "画像URL（空欄で変更なし）",
        alertNoUrl: "Webhook URLを入力してください",
        msgResetOk: "リセットしました"
    },
    en: {
        title: "Discord Webhook Sender",
        labelWebhook: "Webhook URL:",
        labelMessage: "Message Content:",
        labelCount: "Send Count:",
        labelDelay: "Delay (ms):",
        labelUsername: "Display Name:",
        labelAvatar: "Avatar URL:",
        checkEveryone: "Tag @everyone",
        btnSend: "Send",
        btnStop: "Stop",
        btnReset: "Reset",
        btnYes: "Yes",
        btnCancel: "Cancel",
        btnClose: "Close",
        modalErrorTitle: "Error Details",
        modalResetTitle: "Confirm",
        modalResetBody: "Are you sure you want to reset?",
        msgStopped: "Execution stopped.",
        msgSuccess: "Success",
        msgFail: "Failed",
        msgSummary: "{s} success, {f} fail out of {t}. success rate {p}.",
        btnViewError: "View Errors",
        placeholderMsg: "Message (default: Hello)",
        placeholderCount: "Count (default: 5)",
        placeholderDelay: "ms (default: 0)",
        placeholderUser: "Default if empty",
        placeholderAvatar: "Image URL if empty",
        alertNoUrl: "Please enter Webhook URL",
        msgResetOk: "Reset complete"
    }
};

const langConfig = {
    ja: { flag: "🇺🇸", next: "en" },
    en: { flag: "🇯🇵", next: "ja" }
};

let currentLang = navigator.language.startsWith('ja') ? 'ja' : 'en';
let isStopped = false;
let successCount = 0;
let failCount = 0;
let errors = [];
let fullLogs = [];

function updateLanguage() {
    const langData = i18n[currentLang];
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (langData[key]) el.textContent = langData[key];
    });

    document.getElementById("messageInput").placeholder = langData.placeholderMsg;
    document.getElementById("countInput").placeholder = langData.placeholderCount;
    document.getElementById("delayInput").placeholder = langData.placeholderDelay;
    document.getElementById("usernameInput").placeholder = langData.placeholderUser;
    document.getElementById("avatarInput").placeholder = langData.placeholderAvatar;

    document.getElementById("flagIcon").textContent = langConfig[currentLang].flag;
}

document.getElementById("langToggleBtn").addEventListener("click", () => {
    currentLang = langConfig[currentLang].next;
    updateLanguage();
    saveFormData();
});

function addResultMessage(message, detail = "") {
    const container = document.getElementById('resultContainer');
    const wrapper = document.createElement('div');
    wrapper.className = 'result-message';

    fullLogs.push(`[${new Date().toLocaleTimeString('ja-JP', { hour12: false })}.${String(new Date().getMilliseconds()).padStart(3, '0')}] ${message}${detail ? ' : ' + detail : ''}`);

    wrapper.innerHTML = `
        <svg class="result-message-icon" role="img" viewBox="0 0 512 512" aria-hidden="true">
            <path fill="currentColor"
                d="M256 512a256 256 0 1 0 0-512 256 256 0 1 0 0 512z
                   M224 160a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z
                   M216 224h80c13.3 0 24 10.7 24 24v88h8
                   c13.3 0 24 10.7 24 24s-10.7 24-24 24h-80
                   c-13.3 0-24-10.7-24-24s10.7-24 24-24h24v-64h-24
                   c-13.3 0-24-10.7-24-24s10.7-24 24-24z"></path>
        </svg>
        <div class="result-text">
            ${message}
            ${detail ? `<pre style="margin-top:8px;">${detail}</pre>` : ""}
        </div>
    `;
    container.prepend(wrapper);
}

function updateLiveSummary(currentTotal, maxCount) {
    const lang = i18n[currentLang];
    const text = lang.msgSummary
        .replace('{t}', maxCount)
        .replace('{s}', successCount)
        .replace('{f}', failCount)
        .replace('{p}', ((successCount / maxCount) * 100).toFixed(1))
    
    document.getElementById("summary").innerHTML = `<div class="result-message">${text}</div>`;
}

async function action() {
    const lang = i18n[currentLang];
    const webhookInput = document.getElementById("webhookInput").value.trim();

    successCount = 0; failCount = 0; errors = []; fullLogs = [];
    document.getElementById("summary").innerHTML = "";
    document.getElementById("resultContainer").innerHTML = "";
    const progressBar = document.getElementById("progressBar");
    if (progressBar) progressBar.style.width = "0%";

    if (!webhookInput) {
        addResultMessage(currentLang === 'ja' ? "Webhook URLが入力されていないため、送信を開始できませんでした" : "Webhook URL is missing; cannot start.");
        return; 
    }

    const msgVal = document.getElementById("messageInput").value.trim();
    if (msgVal === "") addResultMessage(currentLang === 'ja' ? "送信内容が空欄だったので「こんにちは」を使用します" : "Message empty; using default.");
    const message = msgVal || (currentLang === 'ja' ? "こんにちは" : "Hello");

    const countVal = document.getElementById("countInput").value.trim();
    let count = 5;
    if (countVal === "") {
        addResultMessage(currentLang === 'ja' ? "送信回数が空欄だったので5回に設定しました" : "Count empty; set to 5.");
    } else if (isNaN(parseInt(countVal)) || parseInt(countVal) <= 0) {
        addResultMessage(currentLang === 'ja' ? "送信回数の値が不正だったので5回に設定しました" : "Invalid count; set to 5.");
    } else {
        count = parseInt(countVal);
    }

    const delayVal = document.getElementById("delayInput").value.trim();
    let delay = 0;
    if (delayVal !== "" && (isNaN(parseInt(delayVal)) || parseInt(delayVal) < 0)) {
        addResultMessage(currentLang === 'ja' ? "送信間隔の値が不正だったので遅延なしで実行します" : "Invalid delay; using 0ms.");
    } else {
        delay = parseInt(delayVal) || 0;
    }

    const username = document.getElementById("usernameInput").value.trim();
    if (username === "") addResultMessage(currentLang === 'ja' ? "表示名が未設定なのでデフォルトの名前を使用します" : "No display name; using default.");

    const avatar = document.getElementById("avatarInput").value.trim();
    if (avatar !== "" && !avatar.startsWith("http")) {
        addResultMessage(currentLang === 'ja' ? "アイコンURLの形式が正しくない可能性があります" : "Avatar URL might be invalid.");
    }

    const everyone = document.getElementById("everyoneCheck").checked;

    updateLiveSummary(0, count);
    isStopped = false;
    document.getElementById("sendBtn").disabled = true;
    document.getElementById("stopBtn").disabled = false;

    for (let i = 1; i <= count; i++) {
        if (isStopped) { addResultMessage(lang.msgStopped); break; }

        let payload = { content: everyone ? "@everyone " + message : message };
        if (username) payload.username = username;
        if (avatar) payload.avatar_url = avatar;

        try {
            const res = await fetch(webhookInput, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                successCount++;
            } else {
                failCount++;
                progressBar.style.backgroundColor = "#ed4243";
                const errTxt = await res.text();
                errors.push({ i, errTxt });
                fullLogs.push(`[${new Date().toLocaleTimeString('ja-JP', { hour12: false })}.${String(new Date().getMilliseconds()).padStart(3, '0')}] [#${i}] ${errTxt}`);
            }
        } catch (e) {
            failCount++;
            progressBar.style.backgroundColor = "#ed4243";
            errors.push({ i, errTxt: e.message });
            fullLogs.push(`[${new Date().toLocaleTimeString('ja-JP', { hour12: false })}.${String(new Date().getMilliseconds()).padStart(3, '0')}] [#${i}] ${e.message}`);
        }

        updateLiveSummary(i, count);
        if (progressBar) progressBar.style.width = (i / count * 100) + "%";
        if (delay > 0 && i < count) await new Promise(r => setTimeout(r, delay));
    }

    finishAction(count);
    document.getElementById("sendBtn").disabled = false;
    document.getElementById("stopBtn").disabled = true;
}

function finishAction(maxCount) {
    const summaryDiv = document.getElementById("summary");
    const btnArea = document.createElement("div");
    btnArea.style = "display:flex; gap:10px; margin-top:10px;";

    if (failCount > 0) {
        const errBtn = document.createElement("button");
        errBtn.textContent = i18n[currentLang].btnViewError;
        errBtn.onclick = () => {
            document.getElementById("errorDetails").innerHTML = errors.map(e => `<div><strong>#${e.i}</strong><pre>${e.errTxt}</pre></div>`).join("");
            document.getElementById("errorModal").style.display = "flex";
        };
        btnArea.appendChild(errBtn);
    }

    const dlBtn = document.createElement("button");
    dlBtn.textContent = currentLang === 'ja' ? "ログを保存" : "Save Log";
    dlBtn.className = "neutral-btn";
    dlBtn.onclick = () => {
        const blob = new Blob([fullLogs.join('\n')], { type: 'text/plain' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `webhook_log_${new Date().getTime()}.txt`;
        a.click();
        URL.revokeObjectURL(a.href);
    };
    btnArea.appendChild(dlBtn);
    summaryDiv.appendChild(btnArea);
}

document.getElementById("confirmResetBtn").onclick = () => {
    document.querySelectorAll("input:not(#webhookInput)").forEach(i => i.type === "checkbox" ? i.checked = false : i.value = "");
    document.getElementById("progressBar").style.width = "0%";
    document.getElementById("progressBar").classList.remove("error");
    document.getElementById("resetModal").style.display = "none";
    addResultMessage(i18n[currentLang].msgResetOk);
    saveFormData();
};

function showSummary(total) {
    const lang = i18n[currentLang];
    const text = lang.msgSummary.replace('{t}', total).replace('{s}', successCount).replace('{f}', failCount).replace('{p}', successCount / total * 100);
    const summaryDiv = document.getElementById("summary");
    summaryDiv.innerHTML = `<div class="result-message">${text}</div>`;
    
    if (failCount > 0) {
        const btn = document.createElement("button");
        btn.textContent = lang.btnViewError;
        btn.style.marginTop = "10px";
        btn.onclick = () => {
            document.getElementById("errorDetails").innerHTML = errors.map(e => `<div><strong>#${e.i}</strong><pre>${e.errTxt}</pre></div>`).join("");
            document.getElementById("errorModal").style.display = "flex";
        };
        summaryDiv.appendChild(btn);
    }
}

document.getElementById("sendBtn").onclick = action;
document.getElementById("stopBtn").onclick = () => isStopped = true;
document.getElementById("closeErrorModal").onclick = () => document.getElementById("errorModal").style.display = "none";
document.getElementById("resetBtn").onclick = () => document.getElementById("resetModal").style.display = "flex";
document.getElementById("closeResetModalBtn").onclick = () => document.getElementById("resetModal").style.display = "none";
document.getElementById("confirmResetBtn").onclick = () => {
    document.querySelectorAll("input:not(#webhookInput)").forEach(i => i.type === "checkbox" ? i.checked = false : i.value = "");
    document.getElementById("resetModal").style.display = "none";
    document.getElementById("progressBar").style.width = "0%";
    addResultMessage(i18n[currentLang].msgResetOk);
    saveFormData();
};

function saveFormData() {
    const data = {
        lang: currentLang,
        message: document.getElementById("messageInput").value,
        count: document.getElementById("countInput").value,
        delay: document.getElementById("delayInput").value,
        username: document.getElementById("usernameInput").value,
        avatar: document.getElementById("avatarInput").value,
        everyone: document.getElementById("everyoneCheck").checked
    };
    localStorage.setItem("webhook_url", document.getElementById("webhookInput").value);
    localStorage.setItem("webhook_settings", JSON.stringify(data));
}

function loadFormData() {
    document.getElementById("webhookInput").value = localStorage.getItem("webhook_url") || "";
    const saved = JSON.parse(localStorage.getItem("webhook_settings") || "{}");
    if (saved.lang) currentLang = saved.lang;
    document.getElementById("messageInput").value = saved.message || "";
    document.getElementById("countInput").value = saved.count || "";
    document.getElementById("delayInput").value = saved.delay || "";
    document.getElementById("usernameInput").value = saved.username || "";
    document.getElementById("avatarInput").value = saved.avatar || "";
    document.getElementById("everyoneCheck").checked = saved.everyone || false;
}

window.onload = () => { loadFormData(); updateLanguage(); };
["webhookInput", "messageInput", "countInput", "delayInput", "usernameInput", "avatarInput"].forEach(id => {
    document.getElementById(id).oninput = saveFormData;
});
document.getElementById("everyoneCheck").onchange = saveFormData;

window.addEventListener("click", (e) => {
    const errorModal = document.getElementById("errorModal");
    const resetModal = document.getElementById("resetModal");

    if (e.target === errorModal) {
        errorModal.style.display = "none";
    }
    if (e.target === resetModal) {
        resetModal.style.display = "none";
    }
});
