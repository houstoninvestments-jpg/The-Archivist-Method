---
name: setup
description: >-
  Configure MeiGen plugin provider and API keys. Use this when the user runs
  /meigen:setup, asks to "configure meigen", "set up image generation",
  "add API key", or needs help configuring the plugin.
disable-model-invocation: true
---

# MeiGen Plugin Setup

You are guiding the user through configuring the MeiGen plugin for image generation. Follow this flow step by step.

## Step 1: Welcome

First, check if a config file already exists:

```bash
cat ~/.config/meigen/config.json 2>/dev/null
```

Also check for existing ComfyUI workflows:

```bash
ls ~/.config/meigen/workflows/*.json 2>/dev/null
```

If config exists, show the current configuration (mask API keys: show first 10 chars + "...") and any saved workflows. Ask if they want to reconfigure.

If no config exists, present this introduction:

> **MeiGen Plugin Configuration**
>
> This is optional. Without configuration, you can still use free features:
> - Search gallery for inspiration and prompts
> - Enhance simple ideas into professional prompts
> - Browse available AI models
>
> Configuring a provider unlocks **image generation**.

Then proceed to Step 2.

## Step 2: Choose Provider

Present these options to the user:

### Option A: MeiGen Platform (Recommended)
- Supports **Nanobanana 2**, **Seedream 5.0**, **GPT image 1.5** and more
- Reference image support for style transfer
- No additional accounts needed — just get a token from meigen.ai

### Option B: ComfyUI (Local)
- Use your **local ComfyUI** installation for image generation
- Full control over models, samplers, and workflow settings
- No cloud API needed — runs entirely on your machine
- Import your own workflow from ComfyUI

### Option C: Custom OpenAI-Compatible API
- Use your own **OpenAI**, **Together AI**, **Fireworks AI**, or any OpenAI-compatible service
- Bring your own API key and billing
- Supports any model that uses the OpenAI `/v1/images/generations` endpoint

### Option D: Import from curl Example
- Already have a working curl command from your API provider's docs? Paste it directly!
- We'll automatically extract the API key, base URL, and model name

### Option E: Skip image generation for now
- Free features still available (inspiration search, prompt enhancement, model listing)
- You can run `/meigen:setup` anytime later to enable image generation

If user chooses **Skip**, say goodbye and exit. Otherwise continue to the appropriate Step 3.

## Step 3A: MeiGen Platform Setup

Ask the user:

> Do you already have a MeiGen API token, or do you need to create one?

### If they need to create one:

Provide these instructions:

1. Go to **https://www.meigen.ai**
2. Sign in or create an account
3. Navigate to **Settings** (click your avatar) → **API Keys**
4. Click **Create API Key**, give it a name
5. Copy the token (starts with `meigen_sk_`)

Then ask them to paste the token.

### If they already have one:

Ask them to paste their `meigen_sk_...` token.

### Validate the token:
- Must start with `meigen_sk_`
- Must be at least 30 characters long

If valid, proceed to **Step 4** with this config:

```json
{
  "meigenApiToken": "<the token>"
}
```

## Step 3B: ComfyUI (Local) Setup

### 3B-1: Check Connection

Ask the user for their ComfyUI server URL:

> What is your ComfyUI server URL? (default: `http://localhost:8188`)

Test the connection:

```bash
curl -s <URL>/system_stats | head -c 200
```

- **Success**: Show confirmation and continue to 3B-2
- **Failure**: Tell the user:
  > Cannot connect to ComfyUI at `<URL>`. Please make sure:
  > 1. ComfyUI is running (start it with `python main.py` or your launcher)
  > 2. The URL and port are correct
  > 3. No firewall is blocking the connection

### 3B-2: Import Workflow

Explain the workflow export process to the user:

> To use ComfyUI with this plugin, you need to export a workflow in **API format**:
>
> 1. Open ComfyUI in your browser (usually `http://localhost:8188`)
> 2. Load or create your preferred workflow
> 3. Click **⚙️ Settings** → enable **"Enable Dev mode options"**
> 4. Click the **"Save (API Format)"** button that appears
> 5. Save the downloaded `.json` file somewhere convenient

Then ask them to provide the file path:

> Please provide the path to your exported workflow JSON file:
> Example: `~/Downloads/workflow_api.json`

Use the `comfyui_workflow` tool with action `import` to import the workflow:

- Ask for a short name for the workflow (e.g., "txt2img", "anime", "realistic")
- Call: `comfyui_workflow import` with `filePath` and `name`
- Show the detected nodes and parameters to the user for confirmation

If the import succeeds, ask if they want to import additional workflows. If yes, repeat this step.

### 3B-3: Save Configuration

Build the config JSON:

```json
{
  "comfyuiUrl": "<the URL, omit if http://localhost:8188>",
  "comfyuiDefaultWorkflow": "<the first imported workflow name>"
}
```

Proceed to **Step 4** to save. The workflow files are already saved by the import step.

## Step 3C: Custom OpenAI-Compatible API Setup

Collect the following information. Present common presets first for convenience:

### Quick Presets

| Service | Base URL | Default Model |
|---------|----------|---------------|
| **OpenAI** | `https://api.openai.com` (default) | `gpt-image-1.5` |
| **Together AI** | `https://api.together.xyz/v1` | (check their docs) |
| **Fireworks AI** | `https://api.fireworks.ai/inference/v1` | (check their docs) |

Ask the user to either pick a preset or provide custom values.

### Required Fields

1. **API Key** (required): Their API key for the service
2. **Base URL** (optional): API endpoint URL — default: `https://api.openai.com`
3. **Model Name** (optional): Which model to use — default: `gpt-image-1.5`

### Optional: Test the connection

```bash
curl -s <BASE_URL>/v1/models \
  -H "Authorization: Bearer <API_KEY>" | head -c 500
```

Proceed to **Step 4** with config from the collected fields. Only include fields that differ from defaults.

## Step 3D: Import from curl Example

Ask the user to paste their curl command. Parse and extract:

1. **Base URL**: The URL hostname + base path (strip `/v1/images/generations`, `/v1/models`, etc.)
2. **API Key**: From `Authorization: Bearer <key>` header, or `-u :<key>` flag
3. **Model**: From the JSON request body `"model": "<value>"` if present

Show parsed results for confirmation, then proceed to **Step 4**.

## Step 4: Save Configuration

Build the config JSON based on the chosen provider:

**For MeiGen:**
```json
{ "meigenApiToken": "<the token>" }
```

**For ComfyUI:**
```json
{ "comfyuiUrl": "<url, omit if default>", "comfyuiDefaultWorkflow": "<workflow name>" }
```

**For OpenAI-compatible:**
```json
{ "openaiApiKey": "<the key>", "openaiBaseUrl": "<base url, omit if default>", "openaiModel": "<model, omit if default>" }
```

Create the config directory and write the file:

```bash
mkdir -p ~/.config/meigen
```

Write JSON config to `~/.config/meigen/config.json`. If the user already has a config file, **merge** rather than overwrite.

```bash
chmod 600 ~/.config/meigen/config.json
```

## Step 5: Completion

Tell the user:

> Configuration saved! To activate the new settings, please **start a new Claude Code session**.
>
> After restarting, you can:
> - Use `generate_image` to create AI images
> - Run `list_models` to see available models and workflows
> - Try: "Generate a beautiful sunset over mountains"
>
> You can run `/meigen:setup` again anytime to change your configuration.

For ComfyUI users, additionally mention workflow management commands.
