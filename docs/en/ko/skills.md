---
title: "에이전트 스킬"
description: "SKILL.md 정의를 통해 재사용 가능한 동작을 정의합니다."
---

Agent Skill let opencode discover reusable instruction from your repo 또는 홈 디렉토리.
Skills are loaded on-demand via native `skill` tool-agents see available skills and can loaded full content when needed.

---

## 파일 위치

기술 이름 당 하나의 폴더를 만들고 내부 `SKILL.md`를 넣어.
opencode 이 위치를 검색:

- 프로젝트 구성: `.opencode/skills/
    
  </skill>
</available_skills>
```

에이전트는 도구를 호출하여 기술을로드 :

```
skill({ name: "git-release" })
```

---

## 권한 구성

기술 에이전트가 `opencode.json`의 패턴 기반 권한을 사용하여 액세스 할 수있는 제어 :

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

| 권한    | 동작                              |
| ------- | --------------------------------- |
| `allow` | 기술이 즉시 로드됨                |
| `deny`  | 에이전트에서 기술 숨김, 접근 거부 |
| `ask`   | 로드 전에 사용자에게 승인 요청    |

패턴 지원 와일드 카드: `internal-*` 경기 `internal-docs`, `internal-tools`, 등.

---

## 에이전트별 재정의

글로벌 디폴트보다 특정 에이전트 다른 권한을 부여합니다.

**사용자 지정 에이전트 ** ( 에이전트 frontmatter):

```yaml
---
permission:
  skill:
    "documents-*": "allow"
---
```

** 내장 에이전트 ** (`opencode.json`에서):

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

## 스킬 도구 비활성화

그들을 사용하지 않는 에이전트을위한 완전히 비활성화 된 기술 :

**사용자 지정 에이전트**:

```yaml
---
tools:
  skill: false
---
```

** 내장 에이전트 **:

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

비활성화 할 때, `<available_skills>` 섹션은 완전히 부유합니다.

---

## 로딩 문제 해결

기술이 나타나지 않는 경우:

1. `SKILL.md`는 모든 모자에서 spelled
2. `name`와 `description`를 포함하는 검사
3. 기술 이름은 모든 위치에서 독특합니다.
4. `deny`를 가진 허가를 검사하십시오 에이전트에서 숨겨집니다
