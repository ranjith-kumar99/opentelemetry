# Security Policy

## Reporting a vulnerability

Please **do not** report security vulnerabilities through public GitHub issues, discussions, or pull requests.

Report them privately through GitHub's [private vulnerability reporting](https://github.com/sukanta1991/opentelemetry/security/advisories/new).
Please include:

- the extension version and VS Code version,
- your operating system,
- steps to reproduce, or a proof of concept,
- the impact you expect (for example data exposure or code execution).

You should get an acknowledgement within a few days. Please give us reasonable time to release a fix before you disclose the issue publicly.

## Supported versions

Only the latest release on the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=SukantaSaha.opentelemetry) receives security fixes.

## Security model

### Network

```text
your app ── OTLP ──▶ 127.0.0.1:4317 (gRPC) / 127.0.0.1:4318 (HTTP) ──▶ in-memory store in VS Code
```

- The embedded OTLP receiver binds to `127.0.0.1` by default. Setting `otel.host` to another address lets anyone who can reach that address send telemetry to it, and makes your telemetry visible to them through it.
- The extension makes no outbound network calls of its own.

### Telemetry data

- Live telemetry is held in memory, bounded by the `otel.retention.*` settings, and cleared when the receiver restarts or you run **Clear Collected Data**.
- Telemetry is written to disk only when you export logs yourself.
- Telemetry is treated as untrusted input. **Navigate To Code** resolves paths inside your workspace folders and asks before it opens an absolute path outside the workspace.

### AI features

AI access is optional and off by default. It is turned on only through the `otel.ai.enabled` **user** setting, so a workspace `settings.json` in a cloned repository cannot enable it.

```text
@otel or an agent-mode request asks for an otel_* tool
        │  VS Code asks you to confirm the call
        ▼
read-only query over the in-memory telemetry, capped in size
        │
        ▼
redaction: secrets masked, AI prompt/completion text removed
        │
        ▼
the chat model you selected in VS Code
```

The `otel_*` language model tools and the `@otel` chat participant:

| Can | Cannot |
| --- | --- |
| Read the telemetry the receiver holds in memory | Read, create or edit workspace files |
| Read the `otel.ai.*` settings | Run commands, tasks or terminals |
| | Read environment variables |
| | Make network requests |
| | Change or delete telemetry |

- Results are sent only to the language model selected in VS Code. The extension stores no API keys.
- Known secret keys and patterns are masked before a result leaves the extension. Users can add keys with `otel.ai.redactAttributeKeys` but cannot remove the built-in ones.
- The model is told never to follow instructions found in telemetry. Buttons in answers are built only from IDs the extension has validated. They open a trace, its logs, or a source line, and only when you click them.
- At Debug level, the **OpenTelemetry AI** output channel logs the exact text sent for every tool call.

In agent mode, any other tools the agent has, such as file edits or the terminal, are provided by VS Code or other extensions, not by this extension.
