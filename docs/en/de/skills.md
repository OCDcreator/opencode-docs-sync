---
title: Agenten-Skills
description: "Definiere wiederverwendbares Verhalten ueber SKILL.md"
---

Agent Skills erlauben OpenCode, wiederverwendbare Anweisungen aus deinem Repo oder Home-Verzeichnis zu finden.
Sie werden bei Bedarf ueber das native `skill`-Tool geladen, wenn ein Agent sie wirklich braucht.

---

## Dateien platzieren

Erstelle pro Skill-Namen einen Ordner und lege dort eine `SKILL.md` ab.
OpenCode sucht in folgenden Pfaden:

- Project config: `.opencode/skills/
    
  </skill>
</available_skills>
```

Der Agent laedt einen Skill per Tool-Aufruf:

```
skill({ name: "git-release" })
```

---

## Berechtigungen konfigurieren

Steuere in `opencode.json` per Muster, auf welche Skills Agenten zugreifen duerfen:

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

| Berechtigung | Verhalten                                |
| ------------ | ---------------------------------------- |
| `allow`      | Skill wird sofort geladen                |
| `deny`       | Skill ist fuer Agenten versteckt         |
| `ask`        | Vor dem Laden wird nach Freigabe gefragt |

Muster unterstuetzen Wildcards: `internal-*` passt z. B. auf `internal-docs` oder `internal-tools`.

---

## Pro Agent überschreiben

Du kannst einzelnen Agenten andere Berechtigungen als die globalen Defaults geben.

**Fuer benutzerdefinierte Agenten** (im Frontmatter):

```yaml
---
permission:
  skill:
    "documents-*": "allow"
---
```

**Fuer eingebaute Agenten** (in `opencode.json`):

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

## Skill-Tool deaktivieren

Deaktiviere Skills komplett fuer Agenten, die sie nicht nutzen sollen:

**Fuer benutzerdefinierte Agenten**:

```yaml
---
tools:
  skill: false
---
```

**Fuer eingebaute Agenten**:

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

Wenn deaktiviert, wird der Abschnitt `<available_skills>` komplett weggelassen.

---

## Fehlerbehebung beim Laden

Wenn ein Skill nicht auftaucht:

1. Pruefe, ob `SKILL.md` exakt in Grossbuchstaben geschrieben ist
2. Pruefe, ob Frontmatter `name` und `description` enthaelt
3. Stelle sicher, dass Skill-Namen ueber alle Orte hinweg eindeutig sind
4. Pruefe Berechtigungen - Skills mit `deny` sind fuer Agenten unsichtbar
