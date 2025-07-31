# Deploy LLMs

This page demonstrates how to deploy LLMs using the [tt-inference-server](https://github.com/tenstorrent/tt-inference-server) project. We use [vLLM](https://docs.vllm.ai/en/latest/) to serve LLMs for production applications. It is also a convenient entry-point into Tenstorrent's software ecosystem.

## Setup system dependencies
**⚠️ NOTE: you must read the following instructions:**
- **this page assumes you have already used tt-installer to install the system dependencies as shown in the [starting guide](https://docs.tenstorrent.com/getting-started/README.html)**
- **if you are using *any* Wormhole-based product, you will need to use firmware version <= v18.5.0, execute the following commands to install v18.5.0:**
```bash
(set -e; error_handler() { echo -e "\033[0;31m!!! ERROR: Failed to flash firmware version v18.5.0\033[0m"; }; trap error_handler ERR; TMP_DIR=$(mktemp -d); cleanup() { echo "---"; echo "Cleaning up..."; if type deactivate &>/dev/null; then deactivate; fi; echo "Removing temporary directory: $TMP_DIR"; rm -rf "$TMP_DIR"; cd; echo "Cleanup complete."; }; trap cleanup EXIT; cd "$TMP_DIR"; echo "Working in temporary directory: $TMP_DIR"; echo "---"; echo "Downloading firmware bundle..."; wget -q --show-progress https://github.com/tenstorrent/tt-firmware/releases/download/v18.5.0/fw_pack-18.5.0.fwbundle; echo "Download complete."; echo "---"; echo "Creating Python virtual environment..."; python3 -m venv tt-flash-venv; source tt-flash-venv/bin/activate; echo "Virtual environment activated."; echo "---"; echo "Installing tt-flash from git..."; pip install --quiet git+https://github.com/tenstorrent/tt-flash.git; echo "tt-flash installed."; echo "---"; echo "Running flash command. This may take a moment..."; tt-flash --fw-tar fw_pack-18.5.0.fwbundle --force; echo "---"; echo "Script finished successfully.";)
```

- **if you are using the following Wormhole-based products, you will need to use `tt-topology` to configure a system-level mesh topology between your Wormhole devices:**
  - **TT-QuietBox (Wormhole)**
  - **TT-LoudBox**
- **execute the following command to install `tt-topology` and configure the system-level mesh topology:**
```bash
TMP_DIR=$(mktemp -d); (trap 'echo "---"; echo "Cleaning up..."; if type deactivate &>/dev/null; then deactivate; fi; echo "Removing temporary directory: $TMP_DIR"; rm -rf "$TMP_DIR"; cd; echo "Cleanup complete."' EXIT; trap 'echo -e "\033[0;31m!!! ERROR: Failed to configure mesh topology\033[0m"' ERR; set -e; cd "$TMP_DIR"; echo "Working in temporary directory: $TMP_DIR"; echo "---"; echo "Creating Python virtual environment..."; python3 -m venv tt-topology-venv; source tt-topology-venv/bin/activate; echo "Virtual environment activated."; echo "---"; echo "Installing tt-topology from git..."; pip install --quiet git+https://github.com/tenstorrent/tt-topology.git; echo "tt-topology installed."; echo "---"; echo "Running tt-topology command. This may take a moment..."; tt-topology -l mesh; echo "---"; echo "Script finished successfully.";)
```

## Deploy a vLLM server using tt-inference-server

If this is your first experience with Tenstorrent, these are the recommended models to try with each product:
* TT-QuietBox (Wormhole), TT-QuietBox (Blackhole), TT-LoudBox
  * `meta-llama/Llama-3.3-70B-Instruct`
* n150s, n150d, n300s, n300d, p100a, p150a, p150b
  * `meta-llama/Llama-3.1-8B-Instruct`

For a full list of the currently available and tested models, please visit the [tt-inference-server GitHub page](https://github.com/tenstorrent/tt-inference-server).

### Request model permissions and create Hugging Face Access Token
Downloading the recommended models requires access via Hugging Face. You will need to create a Hugging Face account to continue. Please visit the model's Hugging Face model page to request access:
* TT-QuietBox (Wormhole), TT-QuietBox (Blackhole), TT-LoudBox
  * [meta-llama/Llama-3.3-70B-Instruct](https://huggingface.co/meta-llama/Llama-3.3-70B-Instruct)
* n150s, n150d, n300s, n300d, p100a, p150a, p150b
  * [meta-llama/Llama-3.1-8B-Instruct](https://huggingface.co/meta-llama/Llama-3.1-8B-Instruct)

**NOTE: It can take up to a few days to be granted access. This process is not controlled by Tenstorrent**

Once you have been granted access, you will need to create a Hugging Face access token. To generate one, follow these instructions: [https://huggingface.co/docs/hub/en/security-tokens](https://huggingface.co/docs/hub/en/security-tokens). This token is required to download the model's weights from Hugging Face.

Now, using the system you will be deploying the vLLM server on, export the `HF_TOKEN` environment variable and set the value to your Hugging Face Access Token:
```bash
export HF_TOKEN=<your-hugging-face-access-token>
```

Execute this script to confirm you can access the recommend models:
```bash
check_hf_access() { [ -z "$1" ] && { printf "✖ Error: Please provide a Hugging Face repository ID.\n"; return 1; }; ! command -v curl &>/dev/null && { printf "✖ Error: curl is not installed.\n"; return 1; }; local REPO_ID=$1; local TOKEN=${HF_TOKEN:-$(cat "$HOME/.cache/huggingface/token" 2>/dev/null)}; [ -z "$TOKEN" ] && printf "ℹ️ Info: No Hugging Face token found.\n   You can only access public repositories.\n"; local AUTH_HEADER=""; [ -n "$TOKEN" ] && AUTH_HEADER="Authorization: Bearer $TOKEN"; printf "Checking access for: %s...\n" "$REPO_ID"; local URL="https://huggingface.co/$REPO_ID/resolve/main/config.json"; local HTTP_CODE=$(curl -s -L -o /dev/null -w "%{http_code}" -H "$AUTH_HEADER" "$URL"); case $HTTP_CODE in 200) printf "✔ Access granted.\n";; 401) printf "✖ Access denied (401 Unauthorized).\n  This is a private or gated repository.\n  Ensure your token is valid and has the correct permissions.\n";; 403) printf "✖ Access forbidden (403 Forbidden).\n  The repository is gated.\n  You need to visit the repository page on Hugging Face and request access.\n";; 404) printf "✖ Repository or 'config.json' not found (404 Not Found).\n  Please check if the repository ID '$REPO_ID' is correct.\n";; *) printf "✖ Failed to check access.\n  Received HTTP status code: %s\n" "$HTTP_CODE";; esac; }; HF_HUB_DISABLE_XET=1; check_hf_access "meta-llama/Llama-3.3-70B-Instruct"; check_hf_access "meta-llama/Llama-3.1-8B-Instruct"
```

### Specify target hardware and deployment model
Execute this script to specify which hardware product you are using. The script will set the correct environment variables for your hardware product and automatically choose the recommended model to deploy as per the previous section:
```bash
select_device_and_model(){ echo -e "\nSelect a Tenstorrent system from the list below:"; PS3=$'\n#? '; options=("TT-QuietBox (Wormhole)" "TT-QuietBox (Blackhole)" "TT-LoudBox" "n150s" "n150d" "n300s" "n300d" "p100a" "p150a" "p150b" "Quit"); select opt in "${options[@]}"; do IS_BLACKHOLE=""; case "$opt" in "TT-QuietBox (Wormhole)") DEVICE="t3k"; MODEL="Llama-3.3-70B-Instruct";; "TT-QuietBox (Blackhole)") DEVICE="p150x4"; MODEL="Llama-3.3-70B-Instruct"; IS_BLACKHOLE="--dev-mode";; "TT-LoudBox") DEVICE="t3k"; MODEL="Llama-3.3-70B-Instruct";; "n150s"|"n150d") DEVICE="n150"; MODEL="Llama-3.1-8B-Instruct";; "n300s"|"n300d") DEVICE="n300"; MODEL="Llama-3.1-8B-Instruct";; "p100a") DEVICE="p100"; MODEL="Llama-3.1-8B-Instruct"; IS_BLACKHOLE="--dev-mode";; "p150a"|"p150b") DEVICE="p150"; MODEL="Llama-3.1-8B-Instruct"; IS_BLACKHOLE="--dev-mode";; "Quit") echo "❌ Exiting without setting any environment variables."; return;; *) echo "❌ Invalid option. Try again."; continue;; esac; export DEVICE MODEL IS_BLACKHOLE; echo -e "\n✅ DEVICE set to '$DEVICE'"; echo "✅ MODEL set to '$MODEL'"; [ -n "$IS_BLACKHOLE" ] && echo "✅ IS_BLACKHOLE set to '$IS_BLACKHOLE'"; break; done; }; select_device_and_model
```

### Cloning tt-inference-server

```bash
git clone https://github.com/tenstorrent/tt-inference-server.git
cd tt-inference-server
```

⚠️ If you are using a TT-QuietBox (Blackhole), p100a, p150a, or p150b, you must checkout the `bh-getting-started` branch. Blackhole software optimization is still under active development and requires a development version of tt-inference-server.
```bash
git checkout bh-getting-started
```

### Starting vLLM server with `run.py` script

> ⚠️ Disk Space Warning
> 
> You will need at least **360GB** of free disk space in your root partition (typically where your home directory is mounted).

Set the `JWT_SECRET` environment variable. This is a regular string and is used to seed the generation of your vLLM server's API key.

```bash
export JWT_SECRET="testing"
```

When executing the following command, you will be prompted to answer three questions:
  * Where do you want the persistent volume root to be created. **Accept the default: (\<path-to-tt-inference-server\>/persistent_volume)**
  * How do you want to provide the model's weights. **Accept the default: (Download from Hugging Face)**.
  * Select the Hugging Face cache location on the host. **Accept the default: (\<path-to-your-home-dir\>/.cache/huggingface)**.

⚠️ If you are using a TT-QuietBox (Blackhole), p100a, p150a, or p150b, you will only by prompted with the second and third questions.

```bash
python3 run.py --model $MODEL --device $DEVICE --workflow server --docker-server $IS_BLACKHOLE
```

The first time you execute this command it will download the model's weights from Hugging Face. Weight download can take up to 30 minutes depending on the speed of your internet connection. After the above command runs to completion, a Docker container will start and begin initializing the vLLM server. ***This initialization process will take up to 40 minutes the first time you start the vLLM server for the Llama-3.3-70B-Instruct model***.

## Make an example request to the vLLM server

The vLLM server should now be running on port 8000 of your machine. To check if the server is ready to be called, execute this command:
```bash
check_server_health(){ code=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/health); exit_code=$?; if [[ $exit_code -ne 0 ]]; then echo "❌ Error: Unable to connect to server at localhost:8000"; elif [[ $code -eq 200 ]]; then echo "✅ Server is ready (HTTP 200)"; else echo "⚠️ Server responded with status: $code"; fi; }; check_server_health
```
If the following message is printed, then the vLLM server is still not ready:
```
❌ Error: Unable to connect to server at localhost:8000
```
If the following message is printed, the vLLM server is ready to handle requests:
```bash
✅ Server is ready (HTTP 200)
```

Now that the vLLM server is ready, you must configure an API key to authenticate your requests to the server using the previously set `JWT_SECRET`.

`VLLM_API_KEY` will be the environment variable which holds the API key.

```bash
python3 -m venv request-venv
source request-venv/bin/activate
pip3 install --upgrade pip
pip install pyjwt==2.7.0
export VLLM_API_KEY=$(python3 -c 'import os; import json; import jwt; json_payload = json.loads("{\"team_id\": \"tenstorrent\", \"token_id\": \"debug-test\"}"); encoded_jwt = jwt.encode(json_payload, os.environ["JWT_SECRET"], algorithm="HS256"); print(encoded_jwt)')
```

**The first request to the server is used to perform warmup. It will be significantly slow**

vLLM exposes an [OpenAI-compatible HTTP API](https://platform.openai.com/docs/api-reference/introduction). Here is an example `curl` command to make the first request to the server:

```bash
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

Now that the server is warmed up, make the request again to see the server run at full speed

```bash
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
