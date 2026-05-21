---
title: Vještine agenata
description: "Definisite ponasanje koje se moze ponovo koristiti"
---

Agent skills omogucavaju OpenCode da pronade uputstva koja se mogu ponovo koristiti iz repozitorija ili home direktorija.
Skills se ucitavaju po potrebi kroz ugradeni `skill` alat - agenti vide dostupne skills i ucitavaju puni sadrzaj kad zatreba.

---

## Postavite datoteke

Kreirajte jedan folder po nazivu skill-a i stavite `SKILL.md` unutar njega.
OpenCode pretrazuje ove lokacije:

- Konfiguracija projekta: `.opencode/skills/
    
  </skill>
</available_skills>
```

Agent ucitava skill pozivom alata:

```
skill({ name: "git-release" })
```

---

## Konfiguracija dozvola

Kontrolisite kojim skills agenti mogu pristupiti pomocu dozvola baziranih na obrascima u `opencode.json`:

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

| Dozvola | Ponasanje                                   |
| ------- | ------------------------------------------- |
| `allow` | Skill se ucitava odmah                      |
| `deny`  | Skill je skriven od agenta, pristup odbijen |
| `ask`   | Korisnik mora odobriti prije ucitavanja     |

Obrasci podrzavaju wildcard znakove: `internal-*` poklapa `internal-docs`, `internal-tools` itd.

---

## Nadjačavanje po agentu

Dajte odredenim agentima drugacije dozvole od globalnih defaulta.

**Za prilagodene agente** (u frontmatter-u agenta):

```yaml
---
permission:
  skill:
    "documents-*": "allow"
---
```

**Za ugradene agente** (u `opencode.json`):

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

## Isključivanje skill alata

Potpuno iskljucite skills za agente koji ih ne bi trebali koristiti:

**Za prilagodene agente**:

```yaml
---
tools:
  skill: false
---
```

**Za ugradene agente**:

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

Kada je iskljuceno, sekcija `<available_skills>` se potpuno izostavlja.

---

## Rješavanje problema s učitavanjem

Ako se skill ne pojavi:

1. Provjerite da je naziv `SKILL.md` napisan velikim slovima
2. Provjerite da frontmatter sadrzi `name` i `description`
3. Potvrdite da su nazivi skill-ova jedinstveni na svim lokacijama
4. Provjerite dozvole - skills sa `deny` su skriveni od agenata
