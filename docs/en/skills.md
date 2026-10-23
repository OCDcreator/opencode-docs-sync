---
title: "Agent Skills"
description: "Define reusable behavior via SKILL.md definitions"
---

Agent skills let OpenCode discover reusable instructions from your repo or home directory.
Skills are loaded on-demand via the native `skill` tool—agents see available skills and can load the full content when needed.

---

## Place files

Create one folder per skill name and put a `SKILL.md` inside it.
OpenCode searches these locations:

- Project config: `.opencode/skills/
    
  </skill>
</available_skills>
```

The agent loads a skill by calling the tool:

```
skill({ name: "git-release" })
```

---

## Configure permissions

Control which skills agents can access using pattern-based permissions in `opencode.json`:

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

| Permission | Behavior                                  |
| ---------- | ----------------------------------------- |
| `allow`    | Skill loads immediately                   |
| `deny`     | Skill hidden from agent, access rejected  |
| `ask`      | User prompted for approval before loading |

Patterns support wildcards: `internal-*` matches `internal-docs`, `internal-tools`, etc.

---

## Override per agent

Give specific agents different permissions than the global defaults.

**For custom agents** (in agent frontmatter):

```yaml
---
permission:
  skill:
    "documents-*": "allow"
---
```

**For built-in agents** (in `opencode.json`):

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

## Disable the skill tool

Completely disable skills for agents that shouldn't use them:

**For custom agents**:

```yaml
---
tools:
  skill: false
---
```

**For built-in agents**:

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

When disabled, the `<available_skills>` section is omitted entirely.

---

## Troubleshoot loading

If a skill does not show up:

1. Verify `SKILL.md` is spelled in all caps
2. Check that frontmatter includes `name` and `description`
3. Ensure skill names are unique across all locations
4. Check permissions—skills with `deny` are hidden from agents
