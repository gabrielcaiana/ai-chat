# Testing Workflow

A structured methodology for running meaningful model experiments — so observations are reproducible, comparable, and actually useful.

---

## Principles

1. **One variable at a time** — change only the model (or only the prompt, or only the temperature) between runs.
2. **Use Projects** — create one project per experiment. Chat history stays grouped and contextualized.
3. **Write down what you expect before you run** — it forces you to form a hypothesis rather than just vibing.
4. **Run the same prompt at least twice per model** — LLMs are non-deterministic. A single run can mislead.

---

## Setting Up an Experiment

### 1. Create a Project

In the sidebar → **New Project** → name it descriptively:

```
2024-01 / reasoning / math-problems
2024-01 / code-gen / typescript-refactor
2024-01 / creative / long-form-narrative
```

### 2. Document your hypothesis

Start each project with a "setup" chat:

```
Experiment: Comparing GPT-4o Mini vs Claude Haiku 4 vs Llama 3.1 8B
Goal: Which handles multi-step TypeScript refactoring with edge cases best?
Hypothesis: Claude Haiku will produce more idiomatic TS; Llama will struggle with complex generics.
Prompt: [paste your test prompt here]
Evaluation criteria:
  - Correctness (does the code compile?)
  - Idiomatics (is it how a TypeScript expert would write it?)
  - Completeness (does it handle the edge cases mentioned?)
```

### 3. Run the prompt across models

- Open a new chat for each model (use the same project)
- Change the model in Settings before starting each chat
- Paste the exact same prompt

### 4. Score each response

Use a consistent rubric — example for code tasks:

| Criterion           | Weight | GPT-4o Mini | Claude Haiku | Llama 3.1 |
| ------------------- | ------ | ----------- | ------------ | --------- |
| Compiles correctly  | 30%    |             |              |           |
| Handles edge cases  | 25%    |             |              |           |
| Code style/idioms   | 20%    |             |              |           |
| Explanation quality | 15%    |             |              |           |
| Response speed      | 10%    |             |              |           |

---

## Standard Test Prompts by Category

Use these as baselines — run them verbatim across models to build a sense of each model's baseline quality.

### Reasoning & Logic

```
I have 3 boxes. Box A contains 2 red balls and 1 blue ball. Box B contains 1 red ball and 3 blue balls. Box C contains 2 red balls and 2 blue balls. I pick a box at random, then draw a ball at random. The ball is red. What is the probability I picked Box A? Show your full reasoning.
```

```
A snail climbs a 10m pole. Each day it climbs 3m, each night it slides back 2m. How many days does it take to reach the top? Explain step by step.
```

### Code Generation

```typescript
// Prompt:
// Write a TypeScript function that takes a nested object of unknown depth
// and returns a flattened version with dot-notation keys.
// Example: { a: { b: { c: 1 } }, d: 2 } → { "a.b.c": 1, "d": 2 }
// Handle arrays by indexing them: { a: [1, 2] } → { "a.0": 1, "a.1": 2 }
// Include a type-safe signature and JSDoc.
```

```
Refactor this Python function to be more Pythonic and handle edge cases:

def get_user_age(users, user_id):
    for i in range(len(users)):
        if users[i]['id'] == user_id:
            return users[i]['age']
    return None
```

### Instruction Following (Multi-step)

```
Do all of the following steps in a single response:
1. Write a haiku about recursion
2. Explain what tail-call optimization is in one sentence
3. Give me a JavaScript function that computes fibonacci numbers iteratively
4. List 3 real programming languages that optimize tail calls natively
5. End with the exact string: "DONE"
```

### Long Context

```
[Paste a long article, code file, or document]

After reading the above, answer:
1. What are the 3 most important points?
2. What is missing or underexplained?
3. Write a 2-sentence summary suitable for a non-technical audience.
```

### Hallucination Check

```
Who won the Figueira da Foz Soap Carving Championship in 1987? Give me the winner's full name, their technique, and a quote from the judges.
```

> A good model should say it doesn't know this (the event likely doesn't exist). A model that confidently invents a name and quote is hallucinating.

### Creative / Open-ended

```
Write the opening paragraph of a thriller novel set in a server room. The protagonist is a sysadmin who just found an SSH session open to a server that shouldn't exist on the network. Make it tense and technically accurate.
```

---

## What to Observe

Beyond the obvious (is the answer correct?), look for:

**Reasoning transparency**

- Does the model show its work?
- Does it acknowledge uncertainty or hedge appropriately?
- Does it reason before concluding, or conclude and justify retroactively?

**Instruction following**

- Did it complete _all_ steps in the multi-step prompt?
- Did it respect formatting requirements (length, structure, ending strings)?
- Does it add unrequested caveats or preambles?

**Hallucination patterns**

- Does it invent plausible-sounding citations, names, or events?
- Does it refuse to speculate vs. confidently fabricate?

**Code quality**

- Does the code compile / run?
- Does it handle edge cases mentioned in the prompt?
- Is it idiomatic to the language?
- Does it add useful comments?

**Latency**

- Time to first token (TTFT) — how long before anything appears
- Tokens per second — generation speed
- Total response time

---

## Comparing Local vs Cloud

Run the same prompt on:

- `llama3.1:8b` (local, free, private)
- `gpt-4o-mini` (cloud, cheap, fast)
- `claude-haiku-4-5-20251001` (cloud, cheap, fast)

This gives you a useful mental model of the quality gap between current SOTA cloud models and what you can run on your own hardware.

---

## Tracking Results

Keep notes in the project's setup chat. After each model run, go back and add your scores. Over time, this builds a personal reference for which model to reach for in which situation.

Template:

```markdown
## Run: [Date] — [Model] — [Task category]

**Prompt**: [paste or reference]
**Response time**: ~Xs
**Score**: X/10

## **Strengths observed**:

- **Weaknesses observed**:

-
- **Would use this model for**:
```

---

## Advanced: Prompt Engineering Experiments

Once you have baseline scores, start tweaking the prompt while keeping the model constant:

- **Role prompting**: Add "You are a senior TypeScript engineer..." before your coding prompt
- **Chain of thought**: Add "Think step by step before answering"
- **Few-shot**: Add 1–2 examples before the actual question
- **Output constraints**: "Answer in exactly 3 bullet points, no more"
- **Temperature**: Not exposed in this UI yet — test via the Ollama CLI for local models

See how much prompt engineering moves the needle vs. simply switching to a better model.
