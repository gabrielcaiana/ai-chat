# Ollama — Local Model Setup

Running models locally with Ollama means zero API cost, complete privacy, and the ability to test open-source models on your own hardware.

---

## Installation

### macOS / Linux

```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

### Windows

Download the installer from [ollama.ai/download](https://ollama.ai/download).

### Verify

```bash
ollama --version
```

---

## Starting the Server

```bash
ollama serve
```

Ollama runs on `http://localhost:11434` by default. The AI Lab connects to this automatically when you select the **Ollama** provider in Settings.

> The server must be running before you open the app. Tip: add `ollama serve` to your shell startup if you use local models often.

---

## Pulling Models

```bash
# Small / fast
ollama pull llama3.2           # 2GB — great starting point
ollama pull llama3.2:1b        # 1GB — very fast, lower quality

# General purpose
ollama pull llama3.1:8b        # 5GB — solid all-rounder
ollama pull mistral            # 4GB — efficient, good instruction following
ollama pull gemma2             # 5GB — Google's open model

# Code focused
ollama pull deepseek-coder     # 4GB — strong at code tasks
ollama pull codellama          # 4GB — Meta's code model
ollama pull qwen2.5-coder      # 4GB — competitive at code

# Reasoning
ollama pull deepseek-r1        # 4GB — reasoning-focused
ollama pull phi4               # 9GB — Microsoft's compact but capable model

# Large / high quality (requires more RAM)
ollama pull llama3.1:70b       # 40GB — near-GPT-4 quality, needs GPU
ollama pull mixtral            # 26GB — MoE architecture
```

---

## Managing Models

```bash
# List installed models
ollama list

# Show model details (parameters, size, etc.)
ollama show llama3.2

# Remove a model
ollama rm llama3.2

# Copy / alias a model
ollama cp llama3.2 my-custom-llama

# Run a model in the terminal (quick test without the UI)
ollama run llama3.2
```

---

## Hardware Requirements

| Model Size | Min RAM | Recommended | Notes                      |
| ---------- | ------- | ----------- | -------------------------- |
| 1–3B       | 4 GB    | 8 GB        | Runs on any modern laptop  |
| 7–8B       | 8 GB    | 16 GB       | Good for most dev machines |
| 13B        | 16 GB   | 32 GB       | Needs dedicated RAM        |
| 70B        | 48 GB   | 80 GB GPU   | Requires GPU (CUDA/Metal)  |

**GPU acceleration** (highly recommended for 7B+):

- macOS: Metal is used automatically
- Linux/Windows: Install CUDA drivers, Ollama auto-detects

Check GPU usage:

```bash
# macOS
sudo powermetrics --samplers gpu_power -i 1000 -n 1

# Linux
watch -n 1 nvidia-smi
```

---

## Using a Model in the App

1. Pull the model: `ollama pull <model-name>`
2. Make sure `ollama serve` is running
3. Open the app → click **Settings** (⚙)
4. Select **Ollama (Local)** as provider
5. Choose a model from the list — or type any model name you pulled
6. No API token needed for Ollama
7. Click **Save Changes**

---

## Testing a Model via CLI Before Using in the App

```bash
# Quick single prompt
ollama run llama3.2 "Explain gradient descent in 3 sentences"

# Interactive session
ollama run llama3.2

# Pipe a file as context
cat my_code.ts | ollama run deepseek-coder "Review this TypeScript for bugs"
```

---

## Ollama API Directly

Ollama exposes an OpenAI-compatible API you can query directly:

```bash
curl http://localhost:11434/api/generate \
  -d '{
    "model": "llama3.2",
    "prompt": "Why is the sky blue?",
    "stream": false
  }'
```

Chat format:

```bash
curl http://localhost:11434/api/chat \
  -d '{
    "model": "llama3.2",
    "messages": [
      { "role": "user", "content": "Hello, what can you do?" }
    ]
  }'
```

---

## Creating Custom Models (Modelfiles)

You can customize system prompts, temperature, and context size without touching the app code:

```bash
# Create a Modelfile
cat > Modelfile << 'EOF'
FROM llama3.2

SYSTEM """
You are a strict code reviewer. Be concise and critical.
Always point out at least 3 issues if they exist.
"""

PARAMETER temperature 0.2
PARAMETER num_ctx 8192
EOF

# Build the model
ollama create code-reviewer -f Modelfile

# Run it
ollama run code-reviewer
```

Then add `code-reviewer` to `AI_PROVIDERS` in `useSettings.ts` to use it in the app.

---

## Troubleshooting

**Model not responding / server not found**

```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# Restart
pkill ollama
ollama serve
```

**Slow generation on CPU**

- Use smaller models (1B–3B) for speed
- Enable GPU: check CUDA drivers on Linux or ensure macOS has Metal enabled
- Reduce context: shorter conversation history = faster inference

**Out of memory (OOM)**

- Try a smaller quantization: `ollama pull llama3.1:8b-instruct-q4_0` (Q4 is smaller/faster)
- Close other applications to free RAM
- For 70B models, GPU with sufficient VRAM is mandatory

**Context exceeded**

Ollama defaults to 2048 tokens context for some models. Override via Modelfile:

```
PARAMETER num_ctx 8192
```
