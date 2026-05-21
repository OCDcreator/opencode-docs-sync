---
title: "Agentfærdigheder"
description: "Definer gjenbrugbar atferd via SKILL.md-definisjoner"
---

Agentferdigheter lar OpenCode oppdage gjenbrugbare instruksjoner fra repo- eller hjemmekatalogen din.
Ferdigheter lastes inn på forespørsel via det opprinnelige `skill`-verktøyet – agenter ser tilgængelige ferdigheter og kan laste inn hele innholdet når det er nødvendig.

---

## Placer filer

Opret én mappe per ferdighetsnavn og tilføj inn en `SKILL.md` i den.
OpenCode søker etter disse stedene:

- Prosjektkonfigurasjon: `.opencode/skills/
    
  </skill>
</available_skills>
```

Agenten laster inn en ferdighet ved at kalle verktøyet:

```
skill({ name: "git-release" })
```

---

## Konfigurer tilladelser

Kontroller hvilke ferdigheter agenter har tilgang til ved at bruge mønsterbaserte tillatelser i `opencode.json`:

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

| Tillatelse | Atferd                                     |
| ---------- | ------------------------------------------ |
| `allow`    | Ferdigheter lastes umiddelbart             |
| `deny`     | Ferdighet skjult for agent, tilgang avvist |
| `ask`      | Bruger bedt om godkjenning før lasting     |

Mønstre støtter jokertegn: `internal-*` samsvarer med `internal-docs`, `internal-tools` osv.

---

## Tilsidesættelse pr. agent

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

## Deaktiver færdighedsværktøjet

Deaktiver ferdigheter fullstendig for agenter som ikke bør bruge dem:

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

## Fejlfind indlæsning

Hvis en ferdighet ikke vises:

1. Kontroller at `SKILL.md` er stavet med store bokstaver
2. Tjek at frontmatter inkluderer `name` og `description`
3. Sørg for at ferdighetsnavnene er unike på alle steder
4. Tjek tillatelser – ferdigheter med `deny` er skjult for agenter
