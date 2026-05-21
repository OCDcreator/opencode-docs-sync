---
title: "Agentferdigheter"
description: "Definer gjenbrukbar oppførsel via SKILL.md-definisjoner"
---

Agentferdigheter lar OpenCode oppdage gjenbrukbare instruksjoner fra repo- eller hjemmekatalogen din.
Ferdigheter lastes inn på forespørsel via det innebygde `skill`-verktøyet – agenter ser tilgjengelige ferdigheter og kan laste inn hele innholdet når det er nødvendig.

---

## Plasser filer

Opprett én mappe per ferdighetsnavn og legg inn en `SKILL.md` i den.
opencode søker etter disse stedene:

- Prosjektkonfigurasjon: `.opencode/skills/
    
  </skill>
</available_skills>
```

Agenten laster inn en ferdighet ved å kalle verktøyet:

```
skill({ name: "git-release" })
```

---

## Konfigurer tillatelser

Kontroller hvilke ferdigheter agenter har tilgang til ved å bruke mønsterbaserte tillatelser i `opencode.json`:

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

| Tillatelse | Atferd                                      |
| ---------- | ------------------------------------------- |
| `allow`    | Ferdigheter lastes umiddelbart              |
| `deny`     | Ferdighet skjult for agent, tilgang avvist  |
| `ask`      | Bruker blir bedt om godkjenning før lasting |

Mønstre støtter jokertegn: `internal-*` samsvarer med `internal-docs`, `internal-tools` osv.

---

## Overstyring per agent

Gi spesifikke agenter andre tillatelser enn de globale standardinnstillingene.

**For egendefinerte agenter** (i agent frontmatter):

```yaml
---
permission:
  skill:
    "documents-*": "allow"
---
```

**For innebygde agenter** (i `opencode.json`):

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

## Deaktiver ferdighetsverktøyet

Deaktiver ferdigheter fullstendig for agenter som ikke bør bruke dem:

**For egendefinerte agenter**:

```yaml
---
tools:
  skill: false
---
```

**For innebygde agenter**:

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

Når den er deaktivert, blir `<available_skills>`-delen utelatt helt.

---

## Feilsøk lasting

Hvis en ferdighet ikke vises:

1. Kontroller at `SKILL.md` er stavet med store bokstaver
2. Sjekk at frontmatter inkluderer `name` og `description`
3. Sørg for at ferdighetsnavnene er unike på alle steder
4. Sjekk tillatelser – ferdigheter med `deny` er skjult for agenter
