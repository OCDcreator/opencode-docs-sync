---
title: "Compétences des agents"
description: "Définir un comportement réutilisable via les définitions SKILL.md"
---

Les compétences d'agent permettent à OpenCode de découvrir des instructions réutilisables à partir de votre dépôt ou de votre répertoire personnel.
Les compétences sont chargées à la demande via l'outil natif `skill` : les agents voient les compétences disponibles et peuvent charger le contenu complet en cas de besoin.

---

## Placer des fichiers

Créez un dossier par nom de compétence et insérez-y un `SKILL.md`.
OpenCode recherche ces emplacements :

- Configuration du projet : `.opencode/skills/
    
  </skill>
</available_skills>
```

L'agent charge une compétence en appelant l'outil :

```
skill({ name: "git-release" })
```

---

## Configurer les autorisations

Contrôlez les compétences auxquelles les agents peuvent accéder à l'aide d'autorisations basées sur des modèles dans `opencode.json` :

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

| Autorisation | Comportement                                                          |
| ------------ | --------------------------------------------------------------------- |
| `allow`      | Les compétences se chargent immédiatement                             |
| `deny`       | Compétence masquée à l'agent, accès refusé                            |
| `ask`        | L'utilisateur est invité à donner son approbation avant le chargement |

Les modèles prennent en charge les caractères génériques : `internal-*` correspond à `internal-docs`, `internal-tools`, etc.

---

## Remplacement par agent

Accordez à des agents spécifiques des autorisations différentes de celles par défaut globales.

**Pour les agents personnalisés** (dans la rubrique Agent) :

```yaml
---
permission:
  skill:
    "documents-*": "allow"
---
```

**Pour les agents intégrés** (dans `opencode.json`) :

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

## Désactiver l'outil de compétences

Désactivez complètement les compétences pour les agents qui ne devraient pas les utiliser :

**Pour les agents personnalisés** :

```yaml
---
tools:
  skill: false
---
```

**Pour les agents intégrés** :

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

Lorsqu'elle est désactivée, la section `<available_skills>` est entièrement omise.

---

## Dépanner le chargement

Si une compétence n'apparaît pas :

1. Vérifiez que `SKILL.md` est écrit en majuscules
2. Vérifiez que le frontmatter inclut `name` et `description`
3. Assurez-vous que les noms des compétences sont uniques sur tous les sites
4. Vérifiez les autorisations : les compétences avec `deny` sont masquées aux agents
