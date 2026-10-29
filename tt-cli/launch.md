---
myst:
  html_meta:
    product-name: tt (Tenstorrent CLI), tt-cli, Open WebUI, AnythingLLM
    technology-concepts: OpenAI-compatible API, chat interface, coding agents, Docker
    document-type: reference
---

# Connecting Apps with `tt launch`

An API endpoint is the foundation. `tt launch` connects a ready-made application to a model that `tt serve` is serving, so you can start using the model right away without writing any configuration yourself.

## See which clients are available

```bash
tt launch list
```

```
                                               tt launch                                                
┏━━━━━━━━━━━━━┳━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ client      ┃ kind        ┃ model          ┃ status         ┃ configures                             ┃
┡━━━━━━━━━━━━━╇━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┩
│ opencode    │ terminal    │ tool calling   │ needs opencode │ ~/.config/opencode/opencode.json       │
│ pi          │ terminal    │ tool calling   │ needs pi       │ ~/.pi/agent/models.json                │
│ aider       │ terminal    │ tool calling   │ needs aider    │ environment (this run only)            │
│ qwencode    │ terminal    │ tool calling   │ needs qwen     │ command-line arguments (this run only) │
│ hermes      │ terminal    │ tool calling   │ needs hermes   │ environment (this run only)            │
│ openwebui   │ web service │ any chat model │ ready          │ container tt-open-webui                │
│ anythingllm │ web service │ any chat model │ ready          │ container tt-anythingllm               │
└─────────────┴─────────────┴────────────────┴────────────────┴────────────────────────────────────────┘
```

There are two kinds of client:

* **Web UIs** such as [Open WebUI](https://github.com/open-webui/open-webui) and [AnythingLLM](https://github.com/Mintplex-Labs/anything-llm). `tt` pulls and runs these for you in a container, after asking once. They show as `ready` as soon as Docker is available, and work with any chat model.
* **Terminal coding agents** such as OpenCode, Aider, pi, Qwen Code, and Hermes Agent. You install the agent yourself, and `tt` writes the small configuration it needs to reach your model, in the location the `configures` column names. These need a model that supports tool calling, which `tt` checks for you. A client whose `status` is `needs <command>` is one you have not installed yet.

## Launch a web UI

With a model being served, launch a chat interface in your browser:

```bash
tt launch openwebui
```

`tt` asks the server which model it is serving, then asks you to confirm before it pulls the image: `Pull ghcr.io/open-webui/open-webui:main (a few GB) and run it as tt-open-webui on port 3000. Continue? [y/N]`. It starts the container, prints a summary of what it connected, and ends with `tt-open-webui is ready at http://localhost:3000`. Open that URL in your browser. No sign-in is needed: pick the model and start chatting with it running on your Tenstorrent hardware.

```bash
tt launch stop openwebui   # stop the web UI; its chat history is kept in a volume
```

If another service already holds port 3000, for example TT-Studio or a development server of your own, `tt launch` says so. The web UI container keeps the port it was created with, so `tt launch` prints the exact commands to recreate it on another port: `docker rm tt-open-webui && tt launch openwebui --web-port 3001`. The container's chat history lives in a separate volume and survives the recreate.

## Launch a terminal coding agent

```bash
tt launch opencode
```

For a terminal client, `tt` confirms the served model supports tool calling, writes the client's configuration to point at the endpoint, and starts the client. For `aider`, `qwencode`, and `hermes` the configuration is passed through the environment or the command line and applies to that run only; for `opencode` and `pi` it is written to the client's configuration file.

The full list of clients, what each one needs installed, and the options for connecting to a server on another machine are in the [client launchers guide](https://github.com/tenstorrent/tt-cli/blob/main/docs/client-launchers.md).

## Prefer a point-and-click experience?

[TT-Studio](https://github.com/tenstorrent/tt-studio) serves models and gives you a browser interface for them in one place, without a separate `tt launch` step. It is a serving path rather than a client, so you start it with `tt serve <model> --studio`; see [Serving models](serve.md#serve-through-tt-studio).
