---
title: Windows (WSL)
description: شغّل OpenCode على Windows باستخدام WSL لأفضل تجربة.
---

رغم أن OpenCode يمكن تشغيله مباشرة على Windows، نوصي باستخدام [Windows Subsystem for Linux (WSL)](https://learn.microsoft.com/en-us/windows/wsl/install) للحصول على أفضل تجربة. يوفر WSL بيئة Linux تعمل بسلاسة مع ميزات OpenCode.

:::tip[لماذا WSL؟]
يوفر WSL أداء أفضل لنظام الملفات، ودعمًا كاملًا لـ terminal، وتوافقًا مع أدوات التطوير التي يعتمد عليها OpenCode.
:::

---

## الإعداد

---

## تطبيق سطح المكتب + خادم WSL

إذا كنت تفضّل تطبيق OpenCode لسطح المكتب لكن تريد تشغيل الخادم داخل WSL:

1. **ابدأ الخادم داخل WSL** مع `--hostname 0.0.0.0` للسماح بالاتصالات الخارجية:

   ```bash
   opencode serve --hostname 0.0.0.0 --port 4096
   ```

2. **اربط تطبيق سطح المكتب** على `http://localhost:4096`

> **Note**
>
> إذا لم يعمل `localhost` في إعدادك، اتصل باستخدام عنوان IP الخاص بـ WSL بدلًا منه (من داخل WSL: `hostname -I`) واستخدم `http://<wsl-ip>:4096`.

> **Caution**
>
> عند استخدام `--hostname 0.0.0.0`، اضبط `OPENCODE_SERVER_PASSWORD` لحماية الخادم.
> 
> ```bash
> OPENCODE_SERVER_PASSWORD=your-password opencode serve --hostname 0.0.0.0
> ```

---

## عميل الويب + WSL

لأفضل تجربة ويب على Windows:

1. **شغّل `opencode web` من terminal داخل WSL** بدلًا من PowerShell:

   ```bash
   opencode web --hostname 0.0.0.0
   ```

2. **افتحه من متصفح Windows** عبر `http://localhost:<port>` (يعرض OpenCode الرابط)

تشغيل `opencode web` من WSL يضمن وصولًا صحيحًا لنظام الملفات وتكاملًا أفضل مع terminal، مع بقائه متاحًا من متصفح Windows.

---

## الوصول إلى ملفات Windows

يمكن لـ WSL الوصول إلى جميع ملفات Windows عبر مجلد `/mnt/`:

- قرص `C:` → `/mnt/c/`
- قرص `D:` → `/mnt/d/`
- وهكذا...

مثال:

```bash
cd /mnt/c/Users/YourName/Documents/project
opencode
```

> **Tip**
>
> لأفضل سلاسة، يمكنك استنساخ/نسخ المستودع إلى نظام ملفات WSL (مثل `~/code/`) وتشغيل OpenCode من هناك.

---

## نصائح

- شغّل OpenCode داخل WSL للمشاريع المخزنة على أقراص Windows حتى يكون الوصول للملفات سلسًا
- استخدم [إضافة WSL في VS Code](https://code.visualstudio.com/docs/remote/wsl) مع OpenCode لسير عمل تطوير متكامل
- إعدادات OpenCode وجلساته تُخزَّن داخل بيئة WSL في `~/.local/share/opencode/`
