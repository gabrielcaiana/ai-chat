# Models Overview

Reference guide for all supported models — their capabilities, trade-offs, and the best scenarios to test each one.

---

## OpenAI

### GPT-4o

- **Context**: 128k tokens
- **Strengths**: Best all-around model. Strong at reasoning, coding, structured output, long-context understanding, and instruction following. Supports vision (image input).
- **Weaknesses**: Slower and more expensive than mini variants.
- **Best for**: Complex multi-step reasoning, code review, architecture discussions, long document analysis.
- **API name**: `gpt-4o`

### GPT-4o Mini

- **Context**: 128k tokens
- **Strengths**: Extremely fast. Surprisingly capable for most everyday tasks at a fraction of the cost.
- **Weaknesses**: Loses quality on very complex or multi-hop reasoning tasks.
- **Best for**: Day-to-day use, rapid prototyping, high-volume testing, comparing output quality vs cost.
- **API name**: `gpt-4o-mini`

### o1

- **Context**: 200k tokens
- **Strengths**: Chain-of-thought reasoning built into the model. Exceptional at math, logic puzzles, complex code, and problems requiring deep step-by-step thinking.
- **Weaknesses**: Very slow (reasoning happens server-side before response starts). No streaming. Much more expensive.
- **Best for**: Hard algorithmic problems, mathematical proofs, debugging complex systems.
- **API name**: `o1`

### o1-mini

- **Context**: 128k tokens
- **Strengths**: Same reasoning architecture as o1 but faster and cheaper.
- **Weaknesses**: Weaker than full o1 on the hardest tasks; still slow compared to GPT-4o.
- **Best for**: Medium-complexity reasoning tasks where you want better logic than GPT-4o but can't justify o1 cost.
- **API name**: `o1-mini`

---

## Anthropic

### Claude Opus 4

- **Context**: 200k tokens
- **Strengths**: Anthropic's most capable model. Excels at nuanced reasoning, creative writing, very long-context tasks, and following complex multi-part instructions. Often praised for more "natural" prose.
- **Weaknesses**: Slower, more expensive.
- **Best for**: Long document synthesis, nuanced creative tasks, deep research conversations, comparing against GPT-4o on hard tasks.
- **API name**: `claude-opus-4-7`

### Claude Sonnet 4

- **Context**: 200k tokens
- **Strengths**: Best balance in the Claude family — strong reasoning with good speed. Often the daily driver for Anthropic users.
- **Weaknesses**: Slightly less capable than Opus on the hardest tasks.
- **Best for**: Most tasks. Code generation, Q&A, writing, analysis. Good reference point for cross-provider benchmarks.
- **API name**: `claude-sonnet-4-6`

### Claude Haiku 4

- **Context**: 200k tokens
- **Strengths**: Fastest Claude model. Remarkably good given its speed class.
- **Weaknesses**: Quality drop on complex reasoning vs Sonnet/Opus.
- **Best for**: High-throughput testing, quick iteration, comparing against GPT-4o Mini in the "fast and cheap" category.
- **API name**: `claude-haiku-4-5-20251001`

---

## Ollama (Local)

Local models run entirely on your machine — no data leaves your device, no API cost.

### Llama 3.2

- **Sizes available**: 1B, 3B
- **Strengths**: Excellent small model. Surprisingly capable for its size. Good instruction following.
- **Best for**: Testing local inference speed, privacy-sensitive experiments, low-resource setups.
- **Pull**: `ollama pull llama3.2`

### Llama 3.1 8B

- **Strengths**: Strong general-purpose local model. Solid at coding and reasoning for its class.
- **Best for**: Comparing local vs cloud quality, daily use without API costs.
- **Pull**: `ollama pull llama3.1:8b`

### Mistral 7B

- **Strengths**: Very efficient, good at instruction following, solid at structured tasks.
- **Best for**: Comparing European open-source models, structured output generation.
- **Pull**: `ollama pull mistral`

### DeepSeek Coder

- **Strengths**: Specialized code model. Strong at code completion, refactoring, debugging.
- **Best for**: Code-specific benchmarks, comparing against cloud models on coding tasks.
- **Pull**: `ollama pull deepseek-coder`

### CodeLlama

- **Strengths**: Meta's code-focused model, good at multiple languages.
- **Best for**: Code generation benchmarks, infilling tasks.
- **Pull**: `ollama pull codellama`

> Any other Ollama-compatible model can be used by typing its name directly in the settings model field once you add it to `AI_PROVIDERS` in `useSettings.ts`.

---

## Quick Comparison Matrix

| Model           | Speed  | Quality | Cost | Context | Local? |
| --------------- | ------ | ------- | ---- | ------- | ------ |
| GPT-4o          | Medium | ★★★★★   | $$$  | 128k    | No     |
| GPT-4o Mini     | Fast   | ★★★★☆   | $    | 128k    | No     |
| o1              | Slow   | ★★★★★   | $$$$ | 200k    | No     |
| o1-mini         | Slow   | ★★★★☆   | $$   | 128k    | No     |
| Claude Opus 4   | Medium | ★★★★★   | $$$$ | 200k    | No     |
| Claude Sonnet 4 | Medium | ★★★★☆   | $$   | 200k    | No     |
| Claude Haiku 4  | Fast   | ★★★☆☆   | $    | 200k    | No     |
| Llama 3.2       | Fast   | ★★★☆☆   | Free | ~8k     | Yes    |
| Llama 3.1 8B    | Medium | ★★★★☆   | Free | 128k    | Yes    |
| Mistral 7B      | Medium | ★★★☆☆   | Free | 32k     | Yes    |
| DeepSeek Coder  | Medium | ★★★★☆   | Free | 16k     | Yes    |

---

## Testing Tips

**Apples-to-apples comparison**: Use the exact same prompt on multiple models. Copy from the Settings → open a new chat → change model → paste.

**Watch for**: Hallucination on factual questions, instruction following on multi-step prompts, code correctness, verbosity vs conciseness.

**Latency**: Local models can be slow on CPU — expect 5-20 tokens/sec on most machines. Use GPU if available (`ollama` auto-detects CUDA/Metal).

See [`TESTING_WORKFLOW.md`](TESTING_WORKFLOW.md) for a structured methodology.
