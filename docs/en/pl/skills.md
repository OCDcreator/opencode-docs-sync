---
title: "Umiejętności Agenta"
description: "Definiuj powtarzalne zachowania za pomocą definicji SKILL.md"
---

Umiejętności agenta pozwalają opencode odkryć instrukcje wielokrotnego użytku z repozytorium lub katalogu domowego.
Umiejętności są ładowane na żądanie za pośrednictwem natywnego narzędzia `skill` — agenci widzą dostępne umiejętności i w razie potrzeby mogą załadować pełną zawartość.

---

## Lokalizacja plików

Utwórz jeden folder na nazwę umiejętności i umieść w nim `SKILL.md`.
opencode przeszukuje te lokalizacje:

- Project config: `.opencode/skills/
    
  </skill>
</available_skills>
```

Agent ładuje umiejętność wywołując narzędzie:

```
skill({ name: "git-release" })
```

---

## Konfiguracja uprawnień

Kontroluj, do których umiejętności agenci mogą uzyskać dostęp, używając uprawnień opartych na wzorcach w `opencode.json`:

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

| Permission | Behavior                                               |
| ---------- | ------------------------------------------------------ |
| `allow`    | Umiejętność ładuje się natychmiast                     |
| `deny`     | Umiejętność ukryta przed agentem, dostęp odrzucony     |
| `ask`      | Użytkownik proszony o zatwierdzenie przed załadowaniem |

Wzorce obsługują symbole wieloznaczne: `internal-*` odpowiada `internal-docs`, `internal-tools` itd.

---

## Nadpisywanie dla agenta

Nadaj konkretnym agentom inne uprawnienia niż globalne ustawienia domyślne.

**Dla agentów niestandardowych** (w temacie agentów):

```yaml
---
permission:
  skill:
    "documents-*": "allow"
---
```

**Dla agentów wbudowanych** (w `opencode.json`):

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

## Wyłączanie narzędzia umiejętności

Całkowicie wyłącz umiejętności agentów, którzy nie powinni ich używać:

**Dla agentów niestandardowych** (w temacie agentów):

```yaml
---
tools:
  skill: false
---
```

**W przypadku agentów wbudowanych**:

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

Jeśli opcja jest wyłączona, sekcja `<available_skills>` jest całkowicie pomijana.

---

## Rozwiązywanie problemów z ładowaniem

Jeśli umiejętność nie pojawi się:

1. Sprawdź, czy `SKILL.md` jest napisane wielkimi literami
2. Sprawdź, czy frontmatter zawiera `name` i `description`
3. Upewnij się, że nazwy umiejętności są unikalne we wszystkich lokalizacjach
4. Sprawdź uprawnienia — umiejętności z `deny` są ukryte przed agentami
