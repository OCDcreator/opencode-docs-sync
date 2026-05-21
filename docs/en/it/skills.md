---
title: "Competenze dell'agente"
description: "Definisci comportamenti riutilizzabili tramite definizioni in SKILL.md"
---

Le skill degli agenti permettono a OpenCode di individuare istruzioni riutilizzabili dal tuo repo o dalla home directory.
Le skill vengono caricate on-demand tramite lo strumento nativo `skill`: gli agenti vedono le skill disponibili e possono caricarne il contenuto completo quando serve.

---

## Posizione dei file

Crea una cartella per ogni nome di skill e metti un `SKILL.md` al suo interno.
OpenCode cerca in queste posizioni:

- Config di progetto: `.opencode/skills/
    
  </skill>
</available_skills>
```

L'agente carica una skill chiamando lo strumento:

```
skill({ name: "git-release" })
```

---

## Permessi

Controlla a quali skill gli agenti possono accedere usando permessi basati su pattern in `opencode.json`:

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

| Permesso | Comportamento                                |
| -------- | -------------------------------------------- |
| `allow`  | La skill viene caricata immediatamente       |
| `deny`   | Skill nascosta all'agente, accesso negato    |
| `ask`    | L'utente viene invitato ad approvare il load |

I pattern supportano wildcard: `internal-*` corrisponde a `internal-docs`, `internal-tools`, ecc.

---

## Sovrascrittura per agente

Dai ad agenti specifici permessi diversi dai default globali.

**Per agenti personalizzati** (nel frontmatter dell'agente):

```yaml
---
permission:
  skill:
    "documents-*": "allow"
---
```

**Per agenti integrati** (in `opencode.json`):

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

## Disabilitare skill

Disabilita completamente le skill per agenti che non dovrebbero usarle:

**Per agenti personalizzati**:

```yaml
---
tools:
  skill: false
---
```

**Per agenti integrati**:

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

Quando e' disabilitato, la sezione `<available_skills>` viene omessa completamente.

---

## Risoluzione problemi

Se una skill non compare:

1. Verifica che `SKILL.md` sia scritto in maiuscolo
2. Controlla che il frontmatter includa `name` e `description`
3. Assicurati che i nomi delle skill siano unici in tutte le posizioni
4. Controlla i permessi: le skill con `deny` vengono nascoste agli agenti
