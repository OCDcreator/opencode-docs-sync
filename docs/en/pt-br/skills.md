---
title: "Habilidades do Agente"
description: "Defina comportamentos reutilizáveis via definições de SKILL.md"
---

As habilidades do agente permitem que o opencode descubra instruções reutilizáveis do seu repositório ou diretório pessoal.
As habilidades são carregadas sob demanda através da ferramenta nativa `skill`—os agentes veem as habilidades disponíveis e podem carregar o conteúdo completo quando necessário.

---

## Colocar arquivos

Crie uma pasta por nome de habilidade e coloque um `SKILL.md` dentro dela.
O opencode pesquisa nesses locais:

- Configuração do projeto: `.opencode/skills/
    
  </skill>
</available_skills>
```

O agente carrega uma habilidade chamando a ferramenta:

```
skill({ name: "git-release" })
```

---

## Configurar permissões

Controle quais habilidades os agentes podem acessar usando permissões baseadas em padrões em `opencode.json`:

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

| Permissão | Comportamento                                       |
| --------- | --------------------------------------------------- |
| `allow`   | Habilidade carrega imediatamente                    |
| `deny`    | Habilidade oculta do agente, acesso rejeitado       |
| `ask`     | Usuário solicitado para aprovação antes de carregar |

Padrões suportam curingas: `internal-*` corresponde a `internal-docs`, `internal-tools`, etc.

---

## Substituir por agente

Dê a agentes específicos permissões diferentes das configurações globais padrão.

**Para agentes personalizados** (no frontmatter do agente):

```yaml
---
permission:
  skill:
    "documents-*": "allow"
---
```

**Para agentes embutidos** (em `opencode.json`):

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

## Desativar a ferramenta de habilidades

Desative completamente as habilidades para agentes que não devem usá-las:

**Para agentes personalizados**:

```yaml
---
tools:
  skill: false
---
```

**Para agentes embutidos**:

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

Quando desativado, a seção `<available_skills>` é omitida completamente.

---

## Solucionar problemas de carregamento

Se uma habilidade não aparecer:

1. Verifique se `SKILL.md` está escrito em letras maiúsculas
2. Verifique se o frontmatter inclui `name` e `description`
3. Certifique-se de que os nomes das habilidades sejam únicos em todos os locais
4. Verifique as permissões—habilidades com `deny` estão ocultas dos agentes
