---
title: CLI
description: Opcje i polecenia wiersza poleceń OpenCode.
---

CLI OpenCode domyślnie uruchamia [TUI](/docs/tui), gdy wywołasz je bez argumentów.

```bash
opencode
```

CLI obsługuje też polecenia opisane na tej stronie, więc możesz używać OpenCode programowo.

```bash
opencode run "Explain how closures work in JavaScript"
```

---

### tui

Uruchamia interfejs terminalowy (TUI) OpenCode.

```bash
opencode [project]
```

#### Flagi

| Flaga                                    | Skrót | Opis                                                                    |
| ---------------------------------------- | ----- | ----------------------------------------------------------------------- |
|  | `-c`  | Kontynuuj ostatnią sesję                                                |
|   | `-s`  | Identyfikator sesji do kontynuowania                                    |
|      |       | Sklonuj sesję podczas kontynuacji (użyj z `--continue` lub `--session`) |
|    |       | Monit do użycia                                                         |
|     | `-m`  | Model do użycia w formacie dostawca/model                               |
|     |       | Agent do użycia                                                         |
|      |       | Port do nasłuchiwania                                                   |
|  |       | Nazwa hosta, do której należy się powiązać                              |

---

## Polecenia

Interfejs CLI OpenCode zawiera także dodatkowe polecenia.

---

### agent

Zarządzaj agentami OpenCode.

```bash
opencode agent [command]
```

---

### attach

Dołącz terminal do już działającego serwera backendu OpenCode uruchomionego za pomocą `serve` lub `web`.

```bash
opencode attach [url]
```

Pozwala to połączyć TUI ze zdalnym backendem OpenCode. Na przykład:

```bash
# Start the backend server for web/mobile access
opencode web --port 4096 --hostname 0.0.0.0

# In another terminal, attach the TUI to the running backend
opencode attach http://10.20.30.40:4096
```

#### Flagi

| Flaga                                    | Skrót | Opis                                                                                                  |
| ---------------------------------------- | ----- | ----------------------------------------------------------------------------------------------------- |
|       |       | Katalog roboczy, w którym uruchomić TUI                                                               |
|  | `-c`  | Kontynuuj ostatnią sesję                                                                              |
|   | `-s`  | Identyfikator sesji do kontynuowania                                                                  |
|      |       | Rozgałęź sesję podczas kontynuowania (użyj z `--continue` lub `--session`)                            |
|  | `-p`  | Hasło uwierzytelniania podstawowego (domyślnie `OPENCODE_SERVER_PASSWORD`)                            |
|  | `-u`  | Nazwa użytkownika uwierzytelniania podstawowego (domyślnie `OPENCODE_SERVER_USERNAME` lub `opencode`) |

---

#### create

Utwórz nowego agenta z niestandardową konfiguracją.

```bash
opencode agent create
```

To polecenie poprowadzi Cię przez proces tworzenia nowego agenta z niestandardowym promptem systemowym i konfiguracją narzędzi.

---

#### list

Wyświetl listę wszystkich agentów.

```bash
opencode agent list
```

---

### auth

Zarządzaj danymi uwierzytelniającymi i logowaniem dla dostawców.

```bash
opencode auth [command]
```

---

#### login

OpenCode integruje się z wieloma dostawcami. Możesz użyć `opencode auth login`, aby skonfigurować klucz API dla dowolnego obsługiwanego dostawcy. Klucze są bezpiecznie przechowywane w `~/.local/share/opencode/auth.json`.

```bash
opencode auth login
```

Podczas uruchamiania OpenCode ładuje dostawców z pliku poświadczeń, a także ze zmiennych środowiskowych lub pliku `.env` w Twoim projekcie.

---

#### list

Wyświetl listę wszystkich uwierzytelnionych dostawców przechowywanych w pliku poświadczeń.

```bash
opencode auth list
```

Lub skrócona wersja:

```bash
opencode auth ls
```

---

#### logout

Wyloguj się z dostawcy, usuwając go z pliku poświadczeń.

```bash
opencode auth logout
```

---

### github

Zarządzaj agentem GitHub w celu automatyzacji repozytorium.

```bash
opencode github [command]
```

---

#### install

Zainstaluj agenta GitHub w swoim repozytorium.

```bash
opencode github install
```

Spowoduje to utworzenie pliku workflow GitHub Actions i poprowadzi Cię przez proces konfiguracji. [Dowiedz się więcej](/docs/github).

---

#### run

Uruchom agenta na GitHubie. Zwykle używane w GitHub Actions.

```bash
opencode github run
```

##### Flagi

| Flaga                                 | Opis                                     |
| ------------------------------------- | ---------------------------------------- |
|  | Zdarzenie GitHub, które wyzwoliło agenta |
|  | Osobisty token dostępu GitHub            |

---

### mcp

Zarządzaj serwerami Model Context Protocol (MCP).

```bash
opencode mcp [command]
```

---

#### add

Dodaj serwer MCP do swojej konfiguracji.

```bash
opencode mcp add
```

To polecenie poprowadzi Cię przez proces dodawania lokalnego lub zdalnego serwera MCP.

---

#### list

Wyświetl listę wszystkich skonfigurowanych serwerów MCP i ich status.

```bash
opencode mcp list
```

Lub skrócona wersja:

```bash
opencode mcp ls
```

---

#### auth

Uwierzytelnij się w serwerze MCP z włączoną funkcją OAuth.

```bash
opencode mcp auth [name]
```

Jeśli nie podasz nazwy serwera, zostaniesz poproszony o wybranie jednego z serwerów wymagających uwierzytelnienia.

Możesz także wyświetlić listę serwerów obsługujących OAuth i ich status uwierzytelnienia.

```bash
opencode mcp auth list
```

Lub skrócona wersja:

```bash
opencode mcp auth ls
```

---

#### logout

Usuń tokeny OAuth dla serwera MCP.

```bash
opencode mcp logout [name]
```

---

#### debug

Debuguj problemy z połączeniem OAuth dla serwera MCP.

```bash
opencode mcp debug <name>
```

---

### models

Wyświetl listę modeli ze wszystkich skonfigurowanych dostawców.

```bash
opencode models [provider]
```

Pokazuje modele dostępne do użycia w `provider/model`.

Jest to identyfikator modelu, którego używasz w [konfiguracji](/docs/config).

Opcjonalnie możesz podać identyfikator dostawcy, aby filtrować modele według tego dostawcy.

```bash
opencode models anthropic
```

#### Flagi

| Flaga                                   | Opis                                                                            |
| --------------------------------------- | ------------------------------------------------------------------------------- |
|  | Odśwież pamięć podręczną modeli                                                 |
|  | Bardziej szczegółowe dane wyjściowe modelu (zawiera metadane, takie jak koszty) |

Użyj flagi `--refresh`, aby zaktualizować listę modeli w pamięci podręcznej. Jest to przydatne, gdy dostawca dodał nowe modele, które chcesz zobaczyć w OpenCode.

```bash
opencode models --refresh
```

---

### run

Uruchom OpenCode w trybie nieinteraktywnym, przekazując bezpośrednio prompt.

```bash
opencode run [message..]
```

Jest to przydatne do tworzenia skryptów, automatyzacji lub gdy chcesz wysłać szybkie zapytanie bez uruchamiania TUI. Na przykład:

```bash "opencode run"
opencode run Explain the use of context in Go
```

Można również użyć tego z działającym `opencode serve`, aby uniknąć zimnego startu serwera MCP przy każdym uruchomieniu:

```bash
# Start a headless server in one terminal
opencode serve

# In another terminal, run commands that attach to it
opencode run --attach http://localhost:4096 "Explain async/await in JavaScript"
```

#### Flagi

| Flaga                                    | Skrót | Opis                                                                                                  |
| ---------------------------------------- | ----- | ----------------------------------------------------------------------------------------------------- |
|   |       | Polecenie do uruchomienia, reszta to argumenty                                                        |
|  | `-c`  | Kontynuuj ostatnią sesję                                                                              |
|   | `-s`  | Identyfikator sesji do kontynuowania                                                                  |
|      |       | Sklonuj sesję podczas kontynuacji (użyj z `--continue` lub `--session`)                               |
|     |       | Udostępnij sesję po zakończeniu                                                                       |
|     | `-m`  | Model do użycia w formacie dostawca/model                                                             |
|     |       | Agent do użycia                                                                                       |
|      | `-f`  | Pliki do załączenia do wiadomości                                                                     |
|    |       | Format wyjściowy: `default` (sformatowany) lub `json` (surowy JSON)                                   |
|     |       | Tytuł sesji (jeśli nie podano, zostanie wygenerowany z promptu)                                       |
|    |       | Dołącz do działającego serwera OpenCode (np. http://localhost:4096)                                   |
|  | `-p`  | Hasło uwierzytelniania podstawowego (domyślnie `OPENCODE_SERVER_PASSWORD`)                            |
|  | `-u`  | Nazwa użytkownika uwierzytelniania podstawowego (domyślnie `OPENCODE_SERVER_USERNAME` lub `opencode`) |
|       |       | Katalog do uruchomienia lub ścieżka na zdalnym serwerze podczas dołączania                            |
|   |       | Wariant modelu (poziom wnioskowania specyficzny dla dostawcy)                                         |
|  |       | Pokaż bloki myślenia                                                                                  |
|      |       | Port dla serwera lokalnego (domyślnie losowy)                                                         |

---

### serve

Uruchom serwer OpenCode (bez interfejsu) w celu uzyskania dostępu do API. Pełny opis API HTTP znajduje się w [dokumentacji serwera](/docs/server).

```bash
opencode serve
```

Uruchamia to serwer HTTP, który zapewnia dostęp do API OpenCode bez interfejsu TUI. Ustaw `OPENCODE_SERVER_PASSWORD`, aby włączyć podstawowe uwierzytelnianie HTTP (domyślna nazwa użytkownika to `opencode`).

#### Flagi

| Flaga                                    | Opis                                       |
| ---------------------------------------- | ------------------------------------------ |
|      | Port do nasłuchiwania                      |
|  | Nazwa hosta, do której należy się powiązać |
|      | Włącz wykrywanie mDNS                      |
|      | Dodatkowe dozwolone źródła CORS            |

---

### session

Zarządzaj sesjami OpenCode.

```bash
opencode session [command]
```

---

#### list

Lista wszystkich sesji OpenCode.

```bash
opencode session list
```

##### Flagi

| Flaga                                     | Skrót | Opis                                       |
| ----------------------------------------- | ----- | ------------------------------------------ |
|  | `-n`  | Ogranicz do ostatnich N sesji              |
|     |       | Format wyjściowy: tabela lub json (tabela) |

---

### stats

Pokaż statystyki wykorzystania tokenów i sesji OpenCode.

```bash
opencode stats
```

#### Flagi

| Flaga                                   | Opis                                                                                  |
| --------------------------------------- | ------------------------------------------------------------------------------------- |
|     | Pokaż statystyki z ostatnich N dni (domyślnie: cały czas)                             |
|    | Pokaż użycie poszczególnych narzędzi (domyślnie: wszystkie)                           |
|   | Pokaż podział na modele (domyślnie ukryty). Podaj liczbę, aby pokazać N najczęstszych |
|  | Filtruj według projektu (domyślnie: wszystkie projekty, pusty ciąg: bieżący projekt)  |

---

### export

Eksportuj dane sesji jako JSON.

```bash
opencode export [sessionID]
```

Jeśli nie podasz identyfikatora sesji, zostaniesz poproszony o wybranie jednej z ostatnich sesji.

---

### import

Importuj dane sesji z pliku JSON lub adresu URL udostępniania OpenCode.

```bash
opencode import <file>
```

Możesz importować z pliku lokalnego lub adresu URL.

```bash
opencode import session.json
opencode import https://opncd.ai/s/abc123
```

---

### web

Uruchom serwer OpenCode z interfejsem internetowym.

```bash
opencode web
```

Uruchamia to serwer HTTP i udostępnia OpenCode przez interfejs przeglądarkowy. Ustaw `OPENCODE_SERVER_PASSWORD`, aby włączyć podstawowe uwierzytelnianie HTTP (domyślna nazwa użytkownika to `opencode`).

#### Flagi

| Flaga                                    | Opis                                       |
| ---------------------------------------- | ------------------------------------------ |
|      | Port do nasłuchiwania                      |
|  | Nazwa hosta, do której należy się powiązać |
|      | Włącz wykrywanie mDNS                      |
|      | Dodatkowe dozwolone źródła CORS            |

---

### acp

Uruchom serwer ACP (Agent Client Protocol).

```bash
opencode acp
```

Uruchamia serwer ACP, który komunikuje się przez stdin/stdout przy użyciu JSON-RPC.

#### Flagi

| Flaga                                    | Opis                                       |
| ---------------------------------------- | ------------------------------------------ |
|       | Katalog roboczy                            |
|      | Port do nasłuchiwania                      |
|  | Nazwa hosta, do której należy się powiązać |

---

### uninstall

Odinstaluj OpenCode i usuń wszystkie powiązane pliki.

```bash
opencode uninstall
```

#### Flagi

| Flaga                                       | Skrót | Opis                          |
| ------------------------------------------- | ----- | ----------------------------- |
|  | `-c`  | Zachowaj pliki konfiguracyjne |
|    | `-d`  | Zachowaj dane sesji i migawki |
|      |       | Pokaż co zostanie usunięte    |
|        | `-f`  | Pomiń monity o potwierdzenie  |

---

### upgrade

Aktualizuj OpenCode do najnowszej lub określonej wersji.

```bash
opencode upgrade [target]
```

Aby zaktualizować do najnowszej wersji:

```bash
opencode upgrade
```

Aby zaktualizować do konkretnej wersji:

```bash
opencode upgrade v0.1.48
```

#### Flagi

| Flaga                                  | Skrót | Opis                                                |
| -------------------------------------- | ----- | --------------------------------------------------- |
|  | `-m`  | Wymuś metodę instalacji: curl, npm, pnpm, bun, brew |

---

## Flagi globalne

Interfejs CLI OpenCode przyjmuje następujące flagi globalne dla każdego polecenia.

| Flaga                                      | Skrót | Opis                                        |
| ------------------------------------------ | ----- | ------------------------------------------- |
|        | `-h`  | Wyświetl pomoc                              |
|     | `-v`  | Wydrukuj numer wersji                       |
|  |       | Drukuj logi na stderr                       |
|   |       | Poziom logowania (DEBUG, INFO, WARN, ERROR) |

---

## Zmienne środowiskowe

OpenCode można skonfigurować za pomocą zmiennych środowiskowych.

| Zmienna                               | Typ     | Opis                                                       |
| ------------------------------------- | ------- | ---------------------------------------------------------- |
| `OPENCODE_AUTO_SHARE`                 | boolean | Automatycznie udostępniaj sesje                            |
| `OPENCODE_GIT_BASH_PATH`              | string  | Ścieżka do pliku wykonywalnego Git Bash w systemie Windows |
| `OPENCODE_CONFIG`                     | string  | Ścieżka do pliku konfiguracyjnego                          |
| `OPENCODE_TUI_CONFIG`                 | string  | Ścieżka do pliku konfiguracyjnego TUI                      |
| `OPENCODE_CONFIG_DIR`                 | string  | Ścieżka do katalogu konfiguracyjnego                       |
| `OPENCODE_CONFIG_CONTENT`             | string  | Treść konfiguracji JSON (inline)                           |
| `OPENCODE_DISABLE_AUTOUPDATE`         | boolean | Wyłącz automatyczne sprawdzanie aktualizacji               |
| `OPENCODE_DISABLE_PRUNE`              | boolean | Wyłącz czyszczenie starych wyników (pruning)               |
| `OPENCODE_DISABLE_TERMINAL_TITLE`     | boolean | Wyłącz automatyczne ustawianie tytułu terminala            |
| `OPENCODE_PERMISSION`                 | string  | Konfiguracja uprawnień w JSON (inline)                     |
| `OPENCODE_DISABLE_DEFAULT_PLUGINS`    | boolean | Wyłącz domyślne wtyczki                                    |
| `OPENCODE_DISABLE_LSP_DOWNLOAD`       | boolean | Wyłącz automatyczne pobieranie serwerów LSP                |
| `OPENCODE_ENABLE_EXPERIMENTAL_MODELS` | boolean | Włącz modele eksperymentalne                               |
| `OPENCODE_DISABLE_AUTOCOMPACT`        | boolean | Wyłącz automatyczne kompaktowanie kontekstu                |
| `OPENCODE_DISABLE_CLAUDE_CODE`        | boolean | Wyłącz integrację z `.claude` (prompt + skills)            |
| `OPENCODE_DISABLE_CLAUDE_CODE_PROMPT` | boolean | Wyłącz czytanie `~/.claude/CLAUDE.md`                      |
| `OPENCODE_DISABLE_CLAUDE_CODE_SKILLS` | boolean | Wyłącz ładowanie `.claude/skills`                          |
| `OPENCODE_DISABLE_MODELS_FETCH`       | boolean | Wyłącz pobieranie modeli ze źródeł zewnętrznych            |
| `OPENCODE_FAKE_VCS`                   | string  | Fałszywy dostawca VCS do celów testowych                   |
| `OPENCODE_CLIENT`                     | string  | Identyfikator klienta (domyślnie `cli`)                    |
| `OPENCODE_ENABLE_EXA`                 | boolean | Włącz narzędzie wyszukiwania internetowego Exa             |
| `OPENCODE_SERVER_PASSWORD`            | string  | Włącz uwierzytelnianie podstawowe dla `serve`/`web`        |
| `OPENCODE_SERVER_USERNAME`            | string  | Nazwa użytkownika do autoryzacji (domyślnie `opencode`)    |
| `OPENCODE_MODELS_URL`                 | string  | Niestandardowy adres URL do pobierania konfiguracji modeli |

---

### Eksperymentalne

Te zmienne włączają funkcje eksperymentalne, które mogą ulec zmianie lub zostać usunięte.

| Zmienna                                         | Typ     | Opis                                                |
| ----------------------------------------------- | ------- | --------------------------------------------------- |
| `OPENCODE_EXPERIMENTAL`                         | boolean | Włącz funkcje eksperymentalne objęte flagą zbiorczą |
| `OPENCODE_EXPERIMENTAL_ICON_DISCOVERY`          | boolean | Włącz wykrywanie ikon                               |
| `OPENCODE_EXPERIMENTAL_DISABLE_COPY_ON_SELECT`  | boolean | Wyłącz kopiowanie przy zaznaczaniu w TUI            |
| `OPENCODE_EXPERIMENTAL_BASH_DEFAULT_TIMEOUT_MS` | number  | Domyślny limit czasu dla narzędzia bash w ms        |
| `OPENCODE_EXPERIMENTAL_OUTPUT_TOKEN_MAX`        | number  | Maksymalne tokeny wyjściowe dla LLM                 |
| `OPENCODE_EXPERIMENTAL_FILEWATCHER`             | boolean | Włącz obserwatora plików dla całego katalogu        |
| `OPENCODE_EXPERIMENTAL_OXFMT`                   | boolean | Włącz formater oxfmt                                |
| `OPENCODE_EXPERIMENTAL_LSP_TOOL`                | boolean | Włącz eksperymentalne narzędzie LSP                 |
| `OPENCODE_EXPERIMENTAL_DISABLE_FILEWATCHER`     | boolean | Wyłącz obserwatora plików                           |
| `OPENCODE_EXPERIMENTAL_EXA`                     | boolean | Włącz funkcje eksperymentalne Exa                   |
| `OPENCODE_EXPERIMENTAL_LSP_TY`                  | boolean | Włącz TY LSP dla plików python                      |
| `OPENCODE_EXPERIMENTAL_PLAN_MODE`               | boolean | Włącz tryb planowania                               |
| `OPENCODE_EXPERIMENTAL_BACKGROUND_SUBAGENTS`    | boolean | Włącz zadania subagentów w tle                      |
| `OPENCODE_EXPERIMENTAL_EVENT_SYSTEM`            | boolean | Włącz eksperymentalny system zdarzeń                |
| `OPENCODE_EXPERIMENTAL_NATIVE_LLM`              | boolean | Włącz natywną ścieżkę żądań LLM                     |
| `OPENCODE_EXPERIMENTAL_PARALLEL`                | boolean | Włącz równoległe wykonywanie wyszukiwania web       |
| `OPENCODE_EXPERIMENTAL_SCOUT`                   | boolean | Włącz subagenta Scout                               |
| `OPENCODE_EXPERIMENTAL_WORKSPACES`              | boolean | Włącz obsługę obszarów roboczych                    |
