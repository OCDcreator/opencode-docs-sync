---
title: Windows (WSL)
description: 透過 WSL 在 Windows 上執行 OpenCode 以獲得最佳體驗。
---

雖然 OpenCode 可以直接在 Windows 上執行，但我們推薦使用 [Windows Subsystem for Linux (WSL)](https://learn.microsoft.com/en-us/windows/wsl/install) 以獲得最佳體驗。WSL 提供了一個 Linux 環境，能夠與 OpenCode 的各項功能無縫配合。

:::tip[為什麼選擇 WSL？]
WSL 提供更出色的檔案系統效能、完整的終端機支援，以及與 OpenCode 所依賴的開發工具的良好相容性。
:::

---

## 安裝設定

---

## 桌面應用程式 + WSL 伺服器

如果你希望使用 OpenCode 桌面應用程式，同時在 WSL 中執行伺服器：

1. **在 WSL 中啟動伺服器**，新增 `--hostname 0.0.0.0` 以允許外部連線：

   ```bash
   opencode serve --hostname 0.0.0.0 --port 4096
   ```

2. **在桌面應用程式中連線到** `http://localhost:4096`

> **Note**
>
> 如果 `localhost` 在你的環境中無法使用，請改用 WSL 的 IP 位址進行連線（在 WSL 中執行：`hostname -I`），使用 `http://<wsl-ip>:4096`。

> **Caution**
>
> 使用 `--hostname 0.0.0.0` 時，請設定 `OPENCODE_SERVER_PASSWORD` 以保護伺服器安全。

```bash
OPENCODE_SERVER_PASSWORD=your-password opencode serve --hostname 0.0.0.0
```

---

## Web 客戶端 + WSL

要在 Windows 上獲得最佳的 Web 體驗：

1. **在 WSL 終端機中執行 `opencode web`**，而非在 PowerShell 中執行：

   ```bash
   opencode web --hostname 0.0.0.0
   ```

2. **在 Windows 瀏覽器中存取** `http://localhost:<port>`（OpenCode 會輸出該 URL）

從 WSL 中執行 `opencode web` 可確保正確的檔案系統存取和終端機整合，同時仍可透過 Windows 瀏覽器進行存取。

---

## 存取 Windows 檔案

WSL 可以透過 `/mnt/` 目錄存取你的所有 Windows 檔案：

- `C:` 磁碟 → `/mnt/c/`
- `D:` 磁碟 → `/mnt/d/`
- 其他磁碟以此類推...

範例：

```bash
cd /mnt/c/Users/YourName/Documents/project
opencode
```

> **Tip**
>
> 為了獲得更流暢的體驗，建議將儲存庫克隆或複製到 WSL 檔案系統中（例如 `~/code/` 目錄下），然後在該位置執行 OpenCode。

---

## 使用技巧

- 對於儲存在 Windows 磁碟上的專案，在 WSL 中執行 OpenCode 即可無縫存取檔案
- 搭配 VS Code 的 [WSL 擴充套件](https://code.visualstudio.com/docs/remote/wsl) 使用 OpenCode，打造一體化的開發工作流程
- OpenCode 的設定和工作階段資料儲存在 WSL 環境中的 `~/.local/share/opencode/`
