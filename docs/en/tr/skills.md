---
title: "Ajan becerileri"
description: "SKILL.md ile tekrar kullanilabilir davranis tanimlayin"
---

Ajan becerileri, opencode'un deponuzdan veya ev dizininizden tekrar kullanilabilir talimatlari kesfetmesini saglar.
Beceriler, yerel `skill` araci uzerinden ihtiyac aninda yuklenir; ajanlar mevcut becerileri gorur ve gerektiginde tam icerigi yukler.

---

## Dosyalari yerlestirin

Her beceri adi icin bir klasor olusturun ve icine bir `SKILL.md` koyun.
opencode su konumlari tarar:

- Proje konfigurasyonu: `.opencode/skills/
    
  </skill>
</available_skills>
```

Ajan, araci cagirarak beceri yukler:

```
skill({ name: "git-release" })
```

---

## Izinleri yapilandirin

`opencode.json` icinde pattern tabanli izinlerle ajanlarin hangi becerilere erisecegini kontrol edin:

```json
{
  "permission": {
    "skill": {
      "*": "allow",
      "pr-review": "allow",
      "internal-*": "deny",
      "experimental-*": "ask"
    }
  }
}
```

| Permission | Behavior                                   |
| ---------- | ------------------------------------------ |
| `allow`    | Beceri hemen yuklenir                      |
| `deny`     | Beceri ajandan gizlenir, erisim reddedilir |
| `ask`      | Yukleme oncesi kullanicidan onay istenir   |

Pattern'lar wildcard destekler: `internal-*`, `internal-docs`, `internal-tools` vb. adlarla eslesir.

---

## Ajan bazinda gecersiz kilin

Belirli ajanlara genel varsayimlardan farkli izinler verebilirsiniz.

**Ozel ajanlar icin** (agent frontmatter icinde):

```yaml
---
permission:
  skill:
    "documents-*": "allow"
---
```

**Yerlesik ajanlar icin** (`opencode.json` icinde):

```json
{
  "agent": {
    "plan": {
      "permission": {
        "skill": {
          "internal-*": "allow"
        }
      }
    }
  }
}
```

---

## Skill aracini kapatin

Beceri kullanmamasi gereken ajanlar icin skill aracini tamamen kapatabilirsiniz:

**Ozel ajanlar icin**:

```yaml
---
tools:
  skill: false
---
```

**Yerlesik ajanlar icin**:

```json
{
  "agent": {
    "plan": {
      "tools": {
        "skill": false
      }
    }
  }
}
```

Devre disi oldugunda `<available_skills>` bolumu tamamen kaldirilir.

---

## Yukleme sorunlarini giderin

Bir beceri listede gorunmuyorsa:

1. `SKILL.md` adinin tamamen buyuk harfle yazildigini dogrulayin
2. Frontmatter icinde `name` ve `description` oldugunu kontrol edin
3. Tum konumlarda beceri adlarinin benzersiz oldugundan emin olun
4. Izinleri kontrol edin - `deny` olan beceriler ajanlardan gizlenir
