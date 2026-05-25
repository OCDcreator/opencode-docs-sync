---
title: CLI
description: Opciones y comandos de la CLI de OpenCode.
---

La CLI de OpenCode de forma predeterminada inicia el [TUI](/docs/tui) cuando se ejecuta sin ningún argumento.

```bash
opencode
```

Pero también acepta comandos como se documenta en esta página. Esto le permite interactuar con OpenCode mediante programación.

```bash
opencode run "Explain how closures work in JavaScript"
```

---

### tui

Inicie la interfaz de usuario del terminal OpenCode.

```bash
opencode [project]
```

#### Opciones

| Opción                                   | Corta | Descripción                                                           |
| ---------------------------------------- | ----- | --------------------------------------------------------------------- |
|  | `-c`  | Continuar la última sesión                                            |
|   | `-s`  | ID de sesión para continuar                                           |
|      |       | Bifurcar la sesión al continuar (usar con `--continue` o `--session`) |
|    |       | Aviso de uso                                                          |
|     | `-m`  | Modelo a utilizar en forma de proveedor/modelo                        |
|     |       | Agente a utilizar                                                     |
|      |       | Puerto para escuchar                                                  |
|  |       | Nombre de host para escuchar                                          |

---

## Comandos

La CLI de OpenCode también tiene los siguientes comandos.

---

### agent

Administrar agentes para OpenCode.

```bash
opencode agent [command]
```

---

### attach

Conecte una terminal a un servidor backend OpenCode que ya se esté ejecutando y iniciado mediante los comandos `serve` o `web`.

```bash
opencode attach [url]
```

Esto permite usar TUI con un backend remoto OpenCode. Por ejemplo:

```bash
# Start the backend server for web/mobile access
opencode web --port 4096 --hostname 0.0.0.0

# In another terminal, attach the TUI to the running backend
opencode attach http://10.20.30.40:4096
```

#### Opciones

| Opción                                   | Corta | Descripción                                                                               |
| ---------------------------------------- | ----- | ----------------------------------------------------------------------------------------- |
|       |       | Directorio de trabajo para iniciar TUI en                                                 |
|  | `-c`  | Continuar la última sesión                                                                |
|   | `-s`  | ID de sesión para continuar                                                               |
|      |       | Bifurcar la sesión al continuar (usar con `--continue` o `--session`)                     |
|  | `-p`  | Contraseña de autenticación básica (predeterminada: `OPENCODE_SERVER_PASSWORD`)           |
|  | `-u`  | Usuario de autenticación básica (predeterminado: `OPENCODE_SERVER_USERNAME` u `opencode`) |

---

#### create

Cree un nuevo agente con configuración personalizada.

```bash
opencode agent create
```

Este comando lo guiará en la creación de un nuevo agente con un mensaje del sistema personalizado y una configuración de herramientas.

---

#### list

Enumere todos los agentes disponibles.

```bash
opencode agent list
```

---

### auth

Comando para administrar credenciales e iniciar sesión para proveedores.

```bash
opencode auth [command]
```

---

#### login

OpenCode funciona con la lista de proveedores en [Models.dev](https://models.dev), por lo que puede usar `opencode auth login` para configurar las claves API para cualquier proveedor que desee utilizar. Esto se almacena en `~/.local/share/opencode/auth.json`.

```bash
opencode auth login
```

Cuando se inicia OpenCode, carga los proveedores desde el archivo de credenciales. Y si hay claves definidas en sus entornos o un archivo `.env` en su proyecto.

---

#### list

Enumera todos los proveedores autenticados tal como están almacenados en el archivo de credenciales.

```bash
opencode auth list
```

O la versión corta.

```bash
opencode auth ls
```

---

#### logout

Cierra tu sesión de un proveedor eliminándolo del archivo de credenciales.

```bash
opencode auth logout
```

---

### github

Administre el agente GitHub para la automatización del repositorio.

```bash
opencode github [command]
```

---

#### install

Instale el agente GitHub en su repositorio.

```bash
opencode github install
```

Esto configura el flujo de trabajo de acciones GitHub necesario y lo guía a través del proceso de configuración. [Más información](/docs/github).

---

#### run

Ejecute el agente GitHub. Esto se usa normalmente en acciones GitHub.

```bash
opencode github run
```

##### Opciones

| Opción                                | Descripción                                    |
| ------------------------------------- | ---------------------------------------------- |
|  | GitHub evento simulado para ejecutar el agente |
|  | GitHub token de acceso personal                |

---

### mcp

Administrar servidores de protocolo de contexto modelo.

```bash
opencode mcp [command]
```

---

#### add

Agregue un servidor MCP a su configuración.

```bash
opencode mcp add
```

Este comando lo guiará para agregar un servidor MCP local o remoto.

---

#### list

Enumere todos los servidores MCP configurados y su estado de conexión.

```bash
opencode mcp list
```

O utilice la versión corta.

```bash
opencode mcp ls
```

---

#### auth

Autentíquese con un servidor MCP habilitado para OAuth.

```bash
opencode mcp auth [name]
```

Si no proporciona un nombre de servidor, se le pedirá que seleccione entre los servidores compatibles con OAuth disponibles.

También puede enumerar los servidores compatibles con OAuth y su estado de autenticación.

```bash
opencode mcp auth list
```

O utilice la versión corta.

```bash
opencode mcp auth ls
```

---

#### logout

Elimine las credenciales OAuth para un servidor MCP.

```bash
opencode mcp logout [name]
```

---

#### debug

Depurar problemas de conexión OAuth para un servidor MCP.

```bash
opencode mcp debug <name>
```

---

### models

Enumere todos los modelos disponibles de los proveedores configurados.

```bash
opencode models [provider]
```

Este comando muestra todos los modelos disponibles en sus proveedores configurados en el formato `provider/model`.

Esto es útil para determinar el nombre exacto del modelo que se usará en [su configuración](/docs/config/).

Opcionalmente, puede pasar un ID de proveedor para filtrar modelos por ese proveedor.

```bash
opencode models anthropic
```

#### Opciones

| Opción                                  | Descripción                                                                 |
| --------------------------------------- | --------------------------------------------------------------------------- |
|  | Actualizar la caché de modelos desde models.dev                             |
|  | Utilice una salida del modelo más detallada (incluye metadatos como costos) |

Utilice el indicador `--refresh` para actualizar la lista de modelos almacenados en caché. Esto es útil cuando se han agregado nuevos modelos a un proveedor y desea verlos en OpenCode.

```bash
opencode models --refresh
```

---

### run

Ejecute opencode en modo no interactivo pasando un mensaje directamente.

```bash
opencode run [message..]
```

Esto es útil para secuencias de comandos, automatización o cuando desea una respuesta rápida sin iniciar el TUI completo. Por ejemplo.

```bash "opencode run"
opencode run Explain the use of context in Go
```

También puede conectarse a una instancia `opencode serve` en ejecución para evitar tiempos de arranque en frío del servidor MCP en cada ejecución:

```bash
# Start a headless server in one terminal
opencode serve

# In another terminal, run commands that attach to it
opencode run --attach http://localhost:4096 "Explain async/await in JavaScript"
```

#### Opciones

| Opción                                   | Corta | Descripción                                                                               |
| ---------------------------------------- | ----- | ----------------------------------------------------------------------------------------- |
|   |       | El comando a ejecutar, use mensaje para args                                              |
|  | `-c`  | Continuar la última sesión                                                                |
|   | `-s`  | ID de sesión para continuar                                                               |
|      |       | Bifurcar la sesión al continuar (usar con `--continue` o `--session`)                     |
|     |       | Comparte la sesión                                                                        |
|     | `-m`  | Modelo a utilizar en forma de proveedor/modelo                                            |
|     |       | Agente a utilizar                                                                         |
|      | `-f`  | Archivo(s) para adjuntar al mensaje                                                       |
|    |       | Formato: predeterminado (formateado) o json (eventos JSON sin formato)                    |
|     |       | Título de la sesión (utiliza un mensaje truncado si no se proporciona ningún valor)       |
|    |       | Adjuntar a un servidor opencode en ejecución (por ejemplo, http://localhost:4096)         |
|  | `-p`  | Contraseña de autenticación básica (predeterminada: `OPENCODE_SERVER_PASSWORD`)           |
|  | `-u`  | Usuario de autenticación básica (predeterminado: `OPENCODE_SERVER_USERNAME` u `opencode`) |
|       |       | Directorio de ejecución, o ruta en el servidor remoto al adjuntar                         |
|   |       | Variante del modelo (esfuerzo de razonamiento específico del proveedor)                   |
|  |       | Mostrar bloques de pensamiento                                                            |
|      |       | Puerto para el servidor local (el puerto predeterminado es aleatorio)                     |

---

### serve

Inicie un servidor OpenCode sin cabeza para acceso API. Consulte los [documentos del servidor](/docs/server) para conocer la interfaz HTTP completa.

```bash
opencode serve
```

Esto inicia un servidor HTTP que proporciona acceso API a la funcionalidad opencode sin la interfaz TUI. Configure `OPENCODE_SERVER_PASSWORD` para habilitar la autenticación básica HTTP (el nombre de usuario predeterminado es `opencode`).

#### Opciones

| Opción                                   | Descripción                                          |
| ---------------------------------------- | ---------------------------------------------------- |
|      | Puerto para escuchar                                 |
|  | Nombre de host para escuchar                         |
|      | Habilitar el descubrimiento de mDNS                  |
|      | Orígenes de navegador adicionales para permitir CORS |

---

### session

Administrar OpenCode sesiones.

```bash
opencode session [command]
```

---

#### list

Enumere todas las sesiones OpenCode.

```bash
opencode session list
```

##### Opciones

| Opción                                    | Corta | Descripción                             |
| ----------------------------------------- | ----- | --------------------------------------- |
|  | `-n`  | Limitar a N sesiones más recientes      |
|     |       | Formato de salida: tabla o json (tabla) |

---

### stats

Muestre el uso de tokens y las estadísticas de costos para sus sesiones OpenCode.

```bash
opencode stats
```

#### Opciones

| Opción                                  | Descripción                                                                                                              |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
|     | Mostrar estadísticas de los últimos N días (todo el tiempo)                                                              |
|    | Número de herramientas para mostrar (todas)                                                                              |
|   | Mostrar el desglose del uso del modelo (oculto de forma predeterminada). Pase un número para mostrar la parte superior N |
|  | Filtrar por proyecto (todos los proyectos, cadena vacía: proyecto actual)                                                |

---

### export

Exportar datos de la sesión como JSON.

```bash
opencode export [sessionID]
```

Si no proporciona una ID de sesión, se le pedirá que seleccione entre las sesiones disponibles.

---

### import

Importe datos de sesión desde un archivo JSON o una URL compartida OpenCode.

```bash
opencode import <file>
```

Puede importar desde un archivo local o una URL compartida OpenCode.

```bash
opencode import session.json
opencode import https://opncd.ai/s/abc123
```

---

### web

Inicie un servidor OpenCode sin cabeza con una interfaz web.

```bash
opencode web
```

Esto inicia un servidor HTTP y abre un navegador web para acceder a OpenCode a través de una interfaz web. Configure `OPENCODE_SERVER_PASSWORD` para habilitar la autenticación básica HTTP (el nombre de usuario predeterminado es `opencode`).

#### Opciones

| Opción                                   | Descripción                                          |
| ---------------------------------------- | ---------------------------------------------------- |
|      | Puerto para escuchar                                 |
|  | Nombre de host para escuchar                         |
|      | Habilitar el descubrimiento de mDNS                  |
|      | Orígenes de navegador adicionales para permitir CORS |

---

### acp

Inicie un servidor ACP (Agent Client Protocol).

```bash
opencode acp
```

Este comando inicia un servidor ACP que se comunica a través de stdin/stdout usando nd-JSON.

#### Opciones

| Opción                                   | Descripción                  |
| ---------------------------------------- | ---------------------------- |
|       | Directorio de trabajo        |
|      | Puerto para escuchar         |
|  | Nombre de host para escuchar |

---

### uninstall

Desinstale OpenCode y elimine todos los archivos relacionados.

```bash
opencode uninstall
```

#### Opciones

| Opción                                      | Corta | Descripción                               |
| ------------------------------------------- | ----- | ----------------------------------------- |
|  | `-c`  | Mantener archivos de configuración        |
|    | `-d`  | Conservar datos de sesión e instantáneas  |
|      |       | Mostrar lo que se eliminaría sin eliminar |
|        | `-f`  | Saltar mensajes de confirmación           |

---

### upgrade

Actualiza opencode a la última versión o a una versión específica.

```bash
opencode upgrade [target]
```

Para actualizar a la última versión.

```bash
opencode upgrade
```

Para actualizar a una versión específica.

```bash
opencode upgrade v0.1.48
```

#### Opciones

| Opción                                 | Corta | Descripción                                                         |
| -------------------------------------- | ----- | ------------------------------------------------------------------- |
|  | `-m`  | El método de instalación que se utilizó; curl, npm, pnpm, bun, brew |

---

## Opciones globales

La CLI de OpenCode toma las siguientes banderas globales.

| Opción                                     | Corta | Descripción                                  |
| ------------------------------------------ | ----- | -------------------------------------------- |
|        | `-h`  | Mostrar ayuda                                |
|     | `-v`  | Número de versión de impresión               |
|  |       | Imprimir registros en stderr                 |
|   |       | Nivel de registro (DEBUG, INFO, WARN, ERROR) |

---

## Variables de entorno

OpenCode se puede configurar mediante variables de entorno.

| Variable                              | Type     | Description                                                                     |
| ------------------------------------- | -------- | ------------------------------------------------------------------------------- |
| `OPENCODE_AUTO_SHARE`                 | booleano | Compartir sesiones automáticamente                                              |
| `OPENCODE_GIT_BASH_PATH`              | cadena   | Ruta al ejecutable de Git Bash en Windows                                       |
| `OPENCODE_CONFIG`                     | cadena   | Ruta al archivo de configuración                                                |
| `OPENCODE_CONFIG_DIR`                 | cadena   | Ruta al directorio de configuración                                             |
| `OPENCODE_CONFIG_CONTENT`             | cadena   | Contenido de configuración json en línea                                        |
| `OPENCODE_DISABLE_AUTOUPDATE`         | booleano | Deshabilitar las comprobaciones automáticas de actualizaciones                  |
| `OPENCODE_DISABLE_PRUNE`              | booleano | Deshabilitar la poda de datos antiguos                                          |
| `OPENCODE_DISABLE_TERMINAL_TITLE`     | booleano | Deshabilitar las actualizaciones automáticas de títulos de terminal             |
| `OPENCODE_PERMISSION`                 | cadena   | Configuración de permisos json incorporados                                     |
| `OPENCODE_DISABLE_DEFAULT_PLUGINS`    | booleano | Deshabilitar complementos predeterminados                                       |
| `OPENCODE_DISABLE_LSP_DOWNLOAD`       | booleano | Deshabilitar las descargas automáticas del servidor LSP                         |
| `OPENCODE_ENABLE_EXPERIMENTAL_MODELS` | booleano | Habilitar modelos experimentales                                                |
| `OPENCODE_DISABLE_AUTOCOMPACT`        | booleano | Deshabilitar la compactación automática de contexto                             |
| `OPENCODE_DISABLE_CLAUDE_CODE`        | booleano | Deshabilitar la lectura desde `.claude` (mensaje + habilidades)                 |
| `OPENCODE_DISABLE_CLAUDE_CODE_PROMPT` | booleano | Desactivar lectura `~/.claude/CLAUDE.md`                                        |
| `OPENCODE_DISABLE_CLAUDE_CODE_SKILLS` | booleano | Deshabilitar la carga `.claude/skills`                                          |
| `OPENCODE_DISABLE_MODELS_FETCH`       | booleano | Deshabilitar la recuperación de modelos desde fuentes remotas                   |
| `OPENCODE_FAKE_VCS`                   | cadena   | Proveedor de VCS falso para fines de prueba                                     |
| `OPENCODE_CLIENT`                     | cadena   | Identificador de cliente (por defecto `cli`)                                    |
| `OPENCODE_ENABLE_EXA`                 | booleano | Habilitar las herramientas de búsqueda web de Exa                               |
| `OPENCODE_SERVER_PASSWORD`            | cadena   | Habilite la autenticación básica para `serve`/`web`                             |
| `OPENCODE_SERVER_USERNAME`            | cadena   | Anular el nombre de usuario de autenticación básica (predeterminado `opencode`) |
| `OPENCODE_MODELS_URL`                 | cadena   | URL personalizada para buscar la configuración de modelos                       |

---

### Experimental

Estas variables de entorno habilitan funciones experimentales que pueden cambiar o eliminarse.

| Variable                                        | Type     | Description                                                |
| ----------------------------------------------- | -------- | ---------------------------------------------------------- |
| `OPENCODE_EXPERIMENTAL`                         | booleano | Habilitar funciones experimentales de la bandera global    |
| `OPENCODE_EXPERIMENTAL_ICON_DISCOVERY`          | booleano | Habilitar descubrimiento de íconos                         |
| `OPENCODE_EXPERIMENTAL_DISABLE_COPY_ON_SELECT`  | booleano | Deshabilitar copia al seleccionar en TUI                   |
| `OPENCODE_EXPERIMENTAL_BASH_DEFAULT_TIMEOUT_MS` | número   | Tiempo de espera predeterminado para comandos bash en ms   |
| `OPENCODE_EXPERIMENTAL_OUTPUT_TOKEN_MAX`        | número   | Tokens de salida máximos para respuestas LLM               |
| `OPENCODE_EXPERIMENTAL_FILEWATCHER`             | booleano | Habilite el observador de archivos para todo el directorio |
| `OPENCODE_EXPERIMENTAL_OXFMT`                   | booleano | Habilitar el formateador oxfmt                             |
| `OPENCODE_EXPERIMENTAL_LSP_TOOL`                | booleano | Habilitar herramienta experimental LSP                     |
| `OPENCODE_EXPERIMENTAL_DISABLE_FILEWATCHER`     | booleano | Deshabilitar el observador de archivos                     |
| `OPENCODE_EXPERIMENTAL_EXA`                     | booleano | Habilitar funciones experimentales de Exa                  |
| `OPENCODE_EXPERIMENTAL_LSP_TY`                  | booleano | Habilitar Habilitar TY LSP para archivos python            |
| `OPENCODE_EXPERIMENTAL_PLAN_MODE`               | booleano | Habilitar modo de plan                                     |
| `OPENCODE_EXPERIMENTAL_BACKGROUND_SUBAGENTS`    | booleano | Habilitar tareas de subagentes en segundo plano            |
| `OPENCODE_EXPERIMENTAL_EVENT_SYSTEM`            | booleano | Habilitar sistema de eventos experimental                  |
| `OPENCODE_EXPERIMENTAL_NATIVE_LLM`              | booleano | Habilitar ruta nativa de solicitud LLM                     |
| `OPENCODE_EXPERIMENTAL_PARALLEL`                | booleano | Habilitar ejecución paralela de búsqueda web               |
| `OPENCODE_EXPERIMENTAL_SCOUT`                   | booleano | Habilitar subagente Scout                                  |
| `OPENCODE_EXPERIMENTAL_WORKSPACES`              | booleano | Habilitar soporte de espacios de trabajo                   |
