---
title: Windows (WSL)
description: En iyi deneyim icin opencode'u WSL'de calistirin.
---

opencode Windows'ta dogrudan calisabilir, ancak en iyi deneyim icin [Windows Subsystem for Linux (WSL)](https://learn.microsoft.com/en-us/windows/wsl/install) kullanmanizi oneriyoruz. WSL, opencode ozellikleriyle sorunsuz calisan bir Linux ortami saglar.

:::tip[Neden WSL?]
WSL, daha iyi dosya sistemi performansi, tam terminal destegi ve opencode'un dayandigi gelistirme araclariyla uyumluluk sunar.
:::

---

## Kurulum

---

## Masaüstü uygulaması + WSL sunucusu

opencode Desktop kullanmak isteyip sunucuyu WSL'de calistirmak istiyorsaniz:

1. **Sunucuyu WSL'de baslatin** ve dis baglantilara izin vermek icin `--hostname 0.0.0.0` kullanin:

   ```bash
   opencode serve --hostname 0.0.0.0 --port 4096
   ```

2. **Desktop uygulamasini** `http://localhost:4096` adresine baglayin

> **Note**
>
> Kurulumunuzda `localhost` calismiyorsa bunun yerine WSL IP adresini kullanin (WSL icinde: `hostname -I`) ve `http://<wsl-ip>:4096` adresine baglanin.

> **Caution**
>
> `--hostname 0.0.0.0` kullaniyorsaniz sunucuyu guvene almak icin `OPENCODE_SERVER_PASSWORD` ayarlayin.
> 
> ```bash
> OPENCODE_SERVER_PASSWORD=your-password opencode serve --hostname 0.0.0.0
> ```

---

## Web istemcisi + WSL

Windows'ta en iyi web deneyimi icin:

1. **`opencode web` komutunu PowerShell yerine WSL terminalinde calistirin**:

   ```bash
   opencode web --hostname 0.0.0.0
   ```

2. **Windows tarayicinizdan** `http://localhost:<port>` adresini acin (opencode URL'yi yazdirir)

`opencode web` komutunu WSL'den calistirmak, dosya sistemi erisimi ve terminal entegrasyonunu daha tutarli hale getirirken tarayicidan erisimi korur.

---

## Windows dosyalarına erişin

WSL, tum Windows dosyalariniza `/mnt/` dizini uzerinden erisebilir:

- `C:` surucusu -> `/mnt/c/`
- `D:` surucusu -> `/mnt/d/`
- Ve digerleri...

Ornek:

```bash
cd /mnt/c/Users/YourName/Documents/project
opencode
```

> **Tip**
>
> En sorunsuz deneyim icin deponuzu WSL dosya sistemine (ornegin `~/code/` altina) klonlayip opencode'u orada calistirmayi dusunun.

---

## İpuçları

- Windows suruculerinde duran projelerde opencode'u WSL icinde calistirin - dosya erisimi daha sorunsuz olur
- Butunlesik bir gelistirme akisi icin opencode ile birlikte VS Code [WSL eklentisini](https://code.visualstudio.com/docs/remote/wsl) kullanin
- opencode konfigurasyonunuz ve oturumlariniz WSL ortaminda `~/.local/share/opencode/` konumunda saklanir
