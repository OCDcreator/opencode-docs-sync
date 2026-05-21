---
title: "代理技能"
description: "透過 SKILL.md 定義可重複使用的行為"
---

代理技能讓 OpenCode 能夠從你的儲存庫或主目錄中發現可重複使用的指令。
技能透過原生的 `skill` 工具按需載入——代理可以查看可用技能，並在需要時載入完整內容。

---

## 放置檔案

為每個技能名稱建立一個資料夾，並在其中放入 `SKILL.md`。
OpenCode 會搜尋以下位置：

- 專案設定：`.opencode/skills/
    
  </skill>
</available_skills>
```

代理透過呼叫工具來載入技能：

```
skill({ name: "git-release" })
```

---

## 設定權限

在 `opencode.json` 中使用基於模式的權限來控制代理可以存取哪些技能：

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

| 權限    | 行為                     |
| ------- | ------------------------ |
| `allow` | 技能立即載入             |
| `deny`  | 對代理隱藏技能，拒絕存取 |
| `ask`   | 載入前提示使用者確認     |

模式支援萬用字元：`internal-*` 可匹配 `internal-docs`、`internal-tools` 等。

---

## 按代理覆蓋權限

為特定代理授予與全域預設值不同的權限。

**自訂代理**（在代理 frontmatter 中）：

```yaml
---
permission:
  skill:
    "documents-*": "allow"
---
```

**內建代理**（在 `opencode.json` 中）：

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

## 停用技能工具

為不需要使用技能的代理完全停用技能功能：

**自訂代理**：

```yaml
---
tools:
  skill: false
---
```

**內建代理**：

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

停用後，`<available_skills>` 部分將被完全省略。

---

## 排查載入問題

如果某個技能沒有顯示：

1. 確認 `SKILL.md` 檔案名稱全部為大寫字母
2. 檢查 frontmatter 是否包含 `name` 和 `description`
3. 確保技能名稱在所有位置中唯一
4. 檢查權限設定——設為 `deny` 的技能會對代理隱藏
