---
title: Windows (WSL)
description: Esegui OpenCode su Windows con WSL per la migliore esperienza.
---

Anche se OpenCode puo essere eseguito direttamente su Windows, consigliamo di usare [Windows Subsystem for Linux (WSL)](https://learn.microsoft.com/en-us/windows/wsl/install) per la migliore esperienza. WSL fornisce un ambiente Linux che funziona in modo ottimale con le funzionalita di OpenCode.

:::tip[Perche WSL?]
WSL offre prestazioni migliori del file system, supporto completo del terminale e compatibilita con gli strumenti di sviluppo su cui OpenCode fa affidamento.
:::

---

## Configurazione

---

## App desktop + server WSL

Se preferisci usare l'app desktop di OpenCode ma vuoi eseguire il server in WSL:

1. **Avvia il server in WSL** con `--hostname 0.0.0.0` per consentire connessioni esterne:

   ```bash
   opencode serve --hostname 0.0.0.0 --port 4096
   ```

2. **Collega l'app desktop** a `http://localhost:4096`

> **Note**
>
> Se `localhost` non funziona nella tua configurazione, usa l'indirizzo IP di WSL (da WSL: `hostname -I`) e collega `http://<wsl-ip>:4096`.

> **Caution**
>
> Quando usi `--hostname 0.0.0.0`, imposta `OPENCODE_SERVER_PASSWORD` per proteggere il server.
> 
> ```bash
> OPENCODE_SERVER_PASSWORD=your-password opencode serve --hostname 0.0.0.0
> ```

---

## Client web + WSL

Per la migliore esperienza web su Windows:

1. **Esegui `opencode web` nel terminale WSL** invece che in PowerShell:

   ```bash
   opencode web --hostname 0.0.0.0
   ```

2. **Accedi dal browser Windows** su `http://localhost:<port>` (OpenCode stampa l'URL)

Eseguire `opencode web` da WSL garantisce accesso corretto al file system e integrazione del terminale, restando comunque accessibile dal browser Windows.

---

## Accesso ai file Windows

WSL puo accedere a tutti i file Windows tramite la directory `/mnt/`:

- Unita `C:` → `/mnt/c/`
- Unita `D:` → `/mnt/d/`
- E cosi via...

Esempio:

```bash
cd /mnt/c/Users/YourName/Documents/project
opencode
```

> **Tip**
>
> Per un'esperienza piu fluida, valuta di clonare o copiare il repository nel file system di WSL (per esempio in `~/code/`) ed eseguire OpenCode li.

---

## Suggerimenti

- Tieni OpenCode in esecuzione su WSL per i progetti salvati su unita Windows: l'accesso ai file e immediato
- Usa l'[estensione WSL di VS Code](https://code.visualstudio.com/docs/remote/wsl) insieme a OpenCode per un flusso di lavoro integrato
- Configurazione e sessioni di OpenCode sono salvate nell'ambiente WSL in `~/.local/share/opencode/`
