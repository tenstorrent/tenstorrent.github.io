---
myst:
  html_meta:
    product-name: tt-inference-server, TT-QuietBox™, TT-LoudBox, Wormhole™ Networked AI Processor, Blackhole™ Networked AI Processor, n150s, n150d, n300s, n300d, p100a, p150a, p150b
    technology-concepts: LLM, vLLM, Hugging Face, Llama 3, deployment
    document-type: how-to
---

# Deploying LLMs

This page demonstrates how to deploy LLMs using the [tt-inference-server](https://github.com/tenstorrent/tt-inference-server) project. We currently use [vLLM](https://docs.vllm.ai/en/latest/) to serve LLMs for production applications. It is also a convenient entry-point into Tenstorrent's software ecosystem. You will learn how to prepare your Tenstorrent system, configure access to gated models on Hugging Face, and deploy a vLLM-powered API endpoint using the tt-inference-server project.

---

## **Before You Begin**

Before beginning this procedure, ensure that you have completed the base software installation. This process has specific system and hardware requirements.

:::{admonition} Important
:class: warning
* This guide assumes that you have already followed the [Installing the Tenstorrent Software Stack guide](./README.md).
* Deploying the recommended models requires a minimum of 360 GB of free disk space in your root partition.
:::

### **(Wormhole™ only)**

:::{admonition} If you are using a Wormhole™ Networked AI Processor-based product, you must complete the following steps
:class: danger


Wormhole™ Networked AI Processor hardware requires firmware version `v18.5.0` or older for compatibility with `tt-inference-server`. Run the following script to install the correct firmware version.

```bash
(set -e; error_handler() { echo -e "\033[0;31m!!! ERROR: Failed to flash firmware version v18.5.0\033[0m"; }; trap error_handler ERR; TMP_DIR=$(mktemp -d); cleanup() { echo "---"; echo "Cleaning up..."; if type deactivate &>/dev/null; then deactivate; fi; echo "Removing temporary directory: $TMP_DIR"; rm -rf "$TMP_DIR"; cd; echo "Cleanup complete."; }; trap cleanup EXIT; cd "$TMP_DIR"; echo "Working in temporary directory: $TMP_DIR"; echo "---"; echo "Downloading firmware bundle..."; wget -q --show-progress https://github.com/tenstorrent/tt-firmware/releases/download/v18.5.0/fw_pack-18.5.0.fwbundle; echo "Download complete."; echo "---"; echo "Creating Python virtual environment..."; python3 -m venv tt-flash-venv; source tt-flash-venv/bin/activate; echo "Virtual environment activated."; echo "---"; echo "Installing tt-flash from git..."; pip install --quiet git+https://github.com/tenstorrent/tt-flash.git; echo "tt-flash installed."; echo "---"; echo "Running flash command. This may take a moment..."; tt-flash --fw-tar fw_pack-18.5.0.fwbundle --force; echo "---"; echo "Script finished successfully.";)
```

**Note** For multi-device systems such as the TT-QuietBox™ (Wormhole™ Networked AI Processor) or the TT-LoudBox, you must configure a system-level mesh topology. Run the following script to install `tt-topology` and configure the mesh.

```bash
TMP_DIR=$(mktemp -d); (trap 'echo "---"; echo "Cleaning up..."; if type deactivate &>/dev/null; then deactivate; fi; echo "Removing temporary directory: $TMP_DIR"; rm -rf "$TMP_DIR"; cd; echo "Cleanup complete."' EXIT; trap 'echo -e "\033[0;31m!!! ERROR: Failed to configure mesh topology\033[0m"' ERR; set -e; cd "$TMP_DIR"; echo "Working in temporary directory: $TMP_DIR"; echo "---"; echo "Creating Python virtual environment..."; python3 -m venv tt-topology-venv; source tt-topology-venv/bin/activate; echo "Virtual environment activated."; echo "---"; echo "Installing tt-topology from git..."; pip install --quiet git+https://github.com/tenstorrent/tt-topology.git; echo "tt-topology installed."; echo "---"; echo "Running tt-topology command. This may take a moment..."; tt-topology -l mesh; echo "---"; echo "Script finished successfully.";)
```
:::

---

## Step 1: Getting Model Access on Hugging Face
The recommended large language models are gated and require a Hugging Face account.

### **1\. Request Access to the Model**

Visit the model's page on Hugging Face and follow the instructions to request access.

* For TT-QuietBox™ and TT-LoudBox™ systems, we recommend [meta-llama/Llama-3.3-70B-Instruct](https://huggingface.co/meta-llama/Llama-3.3-70B-Instruct)
* For add-in-card products (n-series, p-series), we recommend [meta-llama/Llama-3.1-8B-Instruct](https://huggingface.co/meta-llama/Llama-3.1-8B-Instruct)

For a full list of the currently available and tested models, please visit the [tt-inference-server GitHub page](https://github.com/tenstorrent/tt-inference-server).

:::{admonition} Important
:class: warning
Access is granted by the model owner and is not controlled by Tenstorrent. This process may take several days.
:::

### **2\. Create a Hugging Face Access Token**

Once you have access, [generate an access token](https://huggingface.co/docs/hub/en/security-tokens) with a minimum of **read** permissions. This token is required to download the model's weights from Hugging Face.

### **3\. Export the Token**

On the system where you will deploy the server, export your token as an environment variable.

```bash
export HF_TOKEN="<your-hugging-face-access-token>"
```

---

## Step 2: Configuring the vLLM Server

### **1\. Select Your Hardware**

Run the following script to specify your hardware. This script sets the required environment variables and selects the recommended model for your system.

```bash
select_device_and_model(){ echo -e "\nSelect a Tenstorrent system from the list below:"; PS3=$'\n#? '; options=("TT-QuietBox (Wormhole)" "TT-QuietBox (Blackhole)" "TT-LoudBox" "n150s" "n150d" "n300s" "n300d" "p100a" "p150a" "p150b" "Quit"); select opt in "${options[@]}"; do IS_BLACKHOLE=""; case "$opt" in "TT-QuietBox (Wormhole)") DEVICE="t3k"; MODEL="Llama-3.3-70B-Instruct";; "TT-QuietBox (Blackhole)") DEVICE="p150x4"; MODEL="Llama-3.3-70B-Instruct"; IS_BLACKHOLE="--dev-mode";; "TT-LoudBox") DEVICE="t3k"; MODEL="Llama-3.3-70B-Instruct";; "n150s"|"n150d") DEVICE="n150"; MODEL="Llama-3.1-8B-Instruct";; "n300s"|"n300d") DEVICE="n300"; MODEL="Llama-3.1-8B-Instruct";; "p100a") DEVICE="p100"; MODEL="Llama-3.1-8B-Instruct"; IS_BLACKHOLE="--dev-mode";; "p150a"|"p150b") DEVICE="p150"; MODEL="Llama-3.1-8B-Instruct"; IS_BLACKHOLE="--dev-mode";; "Quit") echo "❌ Exiting without setting any environment variables."; return;; *) echo "❌ Invalid option. Try again."; continue;; esac; export DEVICE MODEL IS_BLACKHOLE; echo -e "\n✅ DEVICE set to '$DEVICE'"; echo "✅ MODEL set to '$MODEL'"; [ -n "$IS_BLACKHOLE" ] && echo "✅ IS_BLACKHOLE set to '$IS_BLACKHOLE'"; break; done; }; select_device_and_model
```

### **2\. Check Model Access**
Execute this script to confirm you can access the recommended model's weights:
```bash
check_hf_access() { [ -z "$MODEL" ] && { printf "✖ Error: Please provide a Hugging Face repository ID.\n"; return 1; }; ! command -v curl &>/dev/null && { printf "✖ Error: curl is not installed.\n"; return 1; }; local REPO_ID="meta-llama/$MODEL"; local TOKEN=${HF_TOKEN:-$(cat "$HOME/.cache/huggingface/token" 2>/dev/null)}; [ -z "$TOKEN" ] && printf "ℹ️ Info: No Hugging Face token found.\n   You can only access public repositories.\n"; local AUTH_HEADER=""; [ -n "$TOKEN" ] && AUTH_HEADER="Authorization: Bearer $TOKEN"; printf "Checking access for: %s...\n" "$REPO_ID"; local URL="https://huggingface.co/$REPO_ID/resolve/main/config.json"; local HTTP_CODE=$(curl -s -L -o /dev/null -w "%{http_code}" -H "$AUTH_HEADER" "$URL"); case $HTTP_CODE in 200) printf "✔ Access granted.\n";; 401) printf "✖ Access denied (401 Unauthorized).\n  This is a private or gated repository.\n  Ensure your token is valid and has the correct permissions.\n";; 403) printf "✖ Access forbidden (403 Forbidden).\n  The repository is gated.\n  You need to visit the repository page on Hugging Face and request access.\n";; 404) printf "✖ Repository or 'config.json' not found (404 Not Found).\n  Please check if the repository ID '$REPO_ID' is correct.\n";; *) printf "✖ Failed to check access.\n  Received HTTP status code: %s\n" "$HTTP_CODE";; esac; }; HF_HUB_DISABLE_XET=1; check_hf_access;
```

If the command does not succeed and print `✔ Access granted.`, please make sure you have exported your Hugging Face token as per [the above instructions](#3-export-the-token).

### **3\. Clone the Server Repository**

```bash
git clone https://github.com/tenstorrent/tt-inference-server.git
cd tt-inference-server
```

:::{warning}
If you are using a Blackhole™ AI Processor product, you must check out a specific development branch. Blackhole™ AI Processor software optimization is under active development.
:::

```bash
# Run this command ONLY if you are using a Blackhole™ device.
git checkout bh-getting-started
```

---

## Step 3: Launching the vLLM Server

### **1\. Set the JWT Secret**

This string is used to seed the generation of your server's API key.

```bash
export JWT_SECRET="testing"
```

### **2\. Run the Deployment Script**

Execute the following command. The script prompts you for configuration details; in most cases, you may accept the default values.

```bash
python3 run.py --model $MODEL --device $DEVICE --workflow server --docker-server $IS_BLACKHOLE
```

:::{Important}
The first time you run this command, it will download the model's weights. This download can take more than 30 minutes.
:::

### **3\. Wait for the server to initialize**
After the download completes, the server will start initializing in a docker container.

:::{Important}
The first time you start the server, the initialization process for a 70B model should take about 40 minutes. For an 8B model it should take about 10 minutes.
:::

---

## Step 4: Testing the Server Endpoint

### **1\. Check Server Health**

Use the following command to check if the server is ready.

```bash
check_server_health(){ code=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/health); exit_code=$?; if [[ $exit_code -ne 0 ]]; then echo "❌ Error: Unable to connect to server at localhost:8000"; elif [[ $code -eq 200 ]]; then echo "✅ Server is ready (HTTP 200)"; else echo "⚠️ Server responded with status: $code"; fi; }; check_server_health
```

Wait until the output indicates `✅ Server is ready (HTTP 200)`.

### **2\. Generate an API Key**

Your `JWT_SECRET` is used to create an API key for authenticating requests.

```bash
python3 -m venv request-venv
source request-venv/bin/activate
pip3 install --upgrade pip
pip install pyjwt==2.7.0
export VLLM_API_KEY=$(python3 -c 'import os; import json; import jwt; json_payload = json.loads("{\"team_id\": \"tenstorrent\", \"token_id\": \"debug-test\"}"); encoded_jwt = jwt.encode(json_payload, os.environ["JWT_SECRET"], algorithm="HS256"); print(encoded_jwt)')
```

### **3\. Send an Example Request**

The vLLM server exposes an OpenAI-compatible API. The first request will be slow as it performs a final warmup.

```bash
# Warmup request
curl -sS "http://localhost:8000/v1/completions" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $VLLM_API_KEY" \
  -d "{
    \"model\": \"meta-llama/$MODEL\",
    \"prompt\": \"San Francisco is a\",
    \"max_tokens\": 50,
    \"temperature\": 0
  }" | jq
```

Run the command again to observe the server respond at full speed.

---

## **Need Additional Support?**
If you encounter any issues, or have a question that isn't covered in the documentation, please [raise a support request.](https://tenstorrent.atlassian.net/servicedesk/customer/portal/1) Our team will review your request and provide assistance.
