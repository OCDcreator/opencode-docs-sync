---
title: "Habilidades del agente"
description: "Defina el comportamiento reutilizable mediante definiciones de SKILL.md"
---

Las habilidades del agente permiten a OpenCode descubrir instrucciones reutilizables de su repositorio o directorio de inicio.
Las habilidades se cargan bajo demanda a través de la herramienta nativa `skill`: los agentes ven las habilidades disponibles y pueden cargar el contenido completo cuando sea necesario.

---

## Colocar archivos

Cree una carpeta por nombre de habilidad y coloque un `SKILL.md` dentro de ella.
OpenCode busca estas ubicaciones:

- Configuración del proyecto: `.opencode/skills/
    
  </skill>
</available_skills>
```

El agente carga una habilidad llamando a la herramienta:

```
skill({ name: "git-release" })
```

---

## Configurar permisos

Controle a qué agentes de habilidades pueden acceder utilizando permisos basados ​​en patrones en `opencode.json`:

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

| Permiso | Comportamiento                                    |
| ------- | ------------------------------------------------- |
| `allow` | La habilidad se carga inmediatamente              |
| `deny`  | Habilidad oculta al agente, acceso rechazado      |
| `ask`   | Se solicita al usuario aprobación antes de cargar |

Los patrones admiten comodines: `internal-*` coincide con `internal-docs`, `internal-tools`, etc.

---

## Anulación por agente

Otorgue a agentes específicos permisos diferentes a los predeterminados globales.

**Para agentes personalizados** (en el frente del agente):

```yaml
---
permission:
  skill:
    "documents-*": "allow"
---
```

**Para agentes integrados** (en `opencode.json`):

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

## Deshabilitar la herramienta de habilidades

Deshabilite completamente las habilidades para los agentes que no deberían usarlas:

**Para agentes personalizados**:

```yaml
---
tools:
  skill: false
---
```

**Para agentes integrados**:

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

Cuando está deshabilitada, la sección `<available_skills>` se omite por completo.

---

## Solucionar problemas de carga

Si una habilidad no aparece:

1. Verifique que `SKILL.md` esté escrito en mayúsculas.
2. Verifique que el frontmatter incluya `name` y `description`
3. Asegúrese de que los nombres de las habilidades sean únicos en todas las ubicaciones
4. Verifique los permisos: las habilidades con `deny` están ocultas para los agentes
