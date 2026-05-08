<script setup lang="ts">
  definePageMeta({ layout: false });

  const { createChatAndNavigate } = useChats();

  async function handleCreateChat() {
    await createChatAndNavigate();
  }

  const features = [
    {
      icon: 'i-lucide-brain-circuit',
      title: 'Multi-Model Support',
      description:
        'Switch between OpenAI, Anthropic, and local Ollama models. Bring your own API key.',
    },
    {
      icon: 'i-lucide-zap',
      title: 'Real-Time Streaming',
      description:
        'Responses stream token-by-token for a fluid, low-latency experience.',
    },
    {
      icon: 'i-lucide-folder-open',
      title: 'Project Organization',
      description:
        'Group related conversations into projects. Keep context organized across sessions.',
    },
    {
      icon: 'i-lucide-shield-check',
      title: 'Local-First Privacy',
      description:
        'API keys stay in your browser. Requests go directly to the AI provider — no proxies.',
    },
  ];
</script>

<template>
  <div class="lp">
    <!-- Nav -->
    <nav class="lp-nav">
      <div class="lp-nav__inner">
        <div class="lp-brand">
          <div class="lp-brand__icon">
            <UIcon name="i-lucide-bot" />
          </div>
          <span class="lp-brand__name">ai.caiana.studio</span>
        </div>
        <button class="lp-nav__btn" @click="handleCreateChat">
          Open App
          <UIcon name="i-lucide-arrow-right" />
        </button>
      </div>
    </nav>

    <!-- Hero -->
    <section class="lp-hero">
      <div class="lp-hero__badge">
        <span class="lp-hero__dot" />
        OpenAI · Anthropic · Ollama
      </div>
      <h1 class="lp-hero__title">
        Your AI workspace,<br />
        <span class="lp-hero__accent">your models</span>
      </h1>
      <p class="lp-hero__sub">
        A powerful chat interface that lets you choose any AI model, bring your
        own API key, and organize conversations into projects.
      </p>
      <button class="lp-btn-primary" @click="handleCreateChat">
        <UIcon name="i-lucide-message-square-plus" />
        Start chatting
      </button>
    </section>

    <!-- Terminal preview -->
    <section class="lp-preview">
      <div class="lp-terminal">
        <div class="lp-terminal__bar">
          <div class="lp-terminal__dots">
            <span class="lp-dot lp-dot--red" />
            <span class="lp-dot lp-dot--yellow" />
            <span class="lp-dot lp-dot--green" />
          </div>
          <span class="lp-terminal__title"
            >ai.caiana.studio — conversation</span
          >
          <div class="lp-terminal__model">
            <UIcon name="i-lucide-cpu" class="lp-terminal__model-icon" />
            gpt-4o-mini
          </div>
        </div>
        <div class="lp-terminal__body">
          <div class="lp-terminal__row lp-terminal__row--user">
            <span class="lp-terminal__role">you</span>
            <span class="lp-terminal__text lp-terminal__text--user">
              Explain the difference between useEffect and useLayoutEffect in
              React
            </span>
          </div>
          <div class="lp-terminal__row lp-terminal__row--ai">
            <span class="lp-terminal__role lp-terminal__role--ai">ai</span>
            <span class="lp-terminal__text">
              Both run after render, but at different browser lifecycle
              phases.<br /><br />
              <code class="lp-code">useEffect</code> runs asynchronously
              <em>after</em> the browser paints — ideal for data fetching and
              subscriptions.<br /><br />
              <code class="lp-code">useLayoutEffect</code> fires synchronously
              <em>before</em> paint — use it when you need to read or mutate the
              DOM before the user sees it.
            </span>
          </div>
          <div class="lp-terminal__cursor" />
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="lp-features">
      <div class="lp-features__inner">
        <p class="lp-eyebrow">Capabilities</p>
        <h2 class="lp-features__title">Everything you need to work with AI</h2>
        <div class="lp-features__grid">
          <div v-for="f in features" :key="f.title" class="lp-card">
            <div class="lp-card__icon">
              <UIcon :name="f.icon" />
            </div>
            <h3 class="lp-card__title">{{ f.title }}</h3>
            <p class="lp-card__desc">{{ f.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="lp-cta">
      <div class="lp-cta__glow" />
      <h2 class="lp-cta__title">Ready to start?</h2>
      <p class="lp-cta__sub">
        Configure your provider, add your API key, and begin your first
        conversation.
      </p>
      <button class="lp-btn-primary" @click="handleCreateChat">
        <UIcon name="i-lucide-arrow-right" />
        Open ai.caiana.studio
      </button>
    </section>

    <!-- Footer -->
    <footer class="lp-footer">
      <div class="lp-brand">
        <div class="lp-brand__icon lp-brand__icon--sm">
          <UIcon name="i-lucide-bot" />
        </div>
        <span class="lp-brand__name lp-brand__name--muted"
          >ai.caiana.studio</span
        >
      </div>
      <p class="lp-footer__copy">
        Multi-model AI chat with privacy-first design.
      </p>
    </footer>
  </div>
</template>

<style scoped>
  .lp {
    min-height: 100vh;
    background: var(--ui-bg);
    color: var(--ui-text);
  }

  /* Nav */
  .lp-nav {
    position: sticky;
    top: 0;
    z-index: 50;
    background: rgba(7, 9, 15, 0.88);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--h-border);
  }
  .lp-nav__inner {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 2rem;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .lp-nav__btn {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.375rem 0.875rem;
    background: var(--h-surface-2);
    border: 1px solid var(--h-border);
    border-radius: 6px;
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--ui-text-muted);
    transition:
      border-color 0.15s,
      color 0.15s;
  }
  .lp-nav__btn:hover {
    border-color: var(--h-border-hi);
    color: var(--ui-text);
  }

  /* Brand */
  .lp-brand {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .lp-brand__icon {
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--h-cyan-dim);
    border: 1px solid var(--h-cyan-border);
    border-radius: 7px;
    color: var(--h-cyan);
    font-size: 0.9375rem;
  }
  .lp-brand__icon--sm {
    width: 22px;
    height: 22px;
    font-size: 0.75rem;
  }
  .lp-brand__name {
    font-size: 0.9rem;
    font-weight: 700;
    color: var(--ui-text);
    letter-spacing: -0.01em;
  }
  .lp-brand__name--muted {
    color: var(--ui-text-muted);
    font-size: 0.8125rem;
  }

  /* Hero */
  .lp-hero {
    max-width: 680px;
    margin: 0 auto;
    padding: 7rem 2rem 5rem;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }
  .lp-hero__badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.3rem 0.875rem;
    background: var(--h-cyan-dim);
    border: 1px solid var(--h-cyan-border);
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--h-cyan);
    font-family: var(--font-mono);
    letter-spacing: 0.02em;
  }
  .lp-hero__dot {
    width: 6px;
    height: 6px;
    background: var(--h-cyan);
    border-radius: 50%;
    animation: pulse-dot 2s ease-in-out infinite;
    flex-shrink: 0;
  }
  @keyframes pulse-dot {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.35;
    }
  }
  .lp-hero__title {
    font-size: clamp(2.5rem, 6vw, 3.75rem);
    font-weight: 800;
    line-height: 1.08;
    letter-spacing: -0.035em;
    color: var(--ui-text-highlighted);
  }
  .lp-hero__accent {
    background: linear-gradient(
      125deg,
      var(--h-cyan) 0%,
      #38bdf8 45%,
      #818cf8 100%
    );
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .lp-hero__sub {
    font-size: 1rem;
    color: var(--ui-text-muted);
    line-height: 1.75;
    max-width: 500px;
  }

  /* Primary button */
  .lp-btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.6875rem 1.375rem;
    background: var(--h-cyan);
    border-radius: 8px;
    font-size: 0.9375rem;
    font-weight: 700;
    color: #000;
    transition:
      background 0.15s,
      transform 0.1s;
  }
  .lp-btn-primary:hover {
    background: #38bdf8;
    transform: translateY(-1px);
  }
  .lp-btn-primary:active {
    transform: translateY(0);
  }

  /* Terminal preview */
  .lp-preview {
    max-width: 780px;
    margin: 0 auto;
    padding: 0 2rem 6rem;
  }
  .lp-terminal {
    background: var(--h-surface);
    border: 1px solid var(--h-border);
    border-radius: 12px;
    overflow: hidden;
    box-shadow:
      0 0 0 1px rgba(14, 165, 233, 0.05),
      0 32px 80px rgba(0, 0, 0, 0.55);
  }
  .lp-terminal__bar {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    background: var(--h-surface-2);
    border-bottom: 1px solid var(--h-border);
  }
  .lp-terminal__dots {
    display: flex;
    gap: 0.375rem;
    flex-shrink: 0;
  }
  .lp-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
  }
  .lp-dot--red {
    background: #ff5f57;
  }
  .lp-dot--yellow {
    background: #febc2e;
  }
  .lp-dot--green {
    background: #28c840;
  }
  .lp-terminal__title {
    flex: 1;
    text-align: center;
    font-size: 0.6875rem;
    color: var(--ui-text-dimmed);
    font-family: var(--font-mono);
  }
  .lp-terminal__model {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0.2rem 0.5rem;
    background: var(--h-cyan-dim);
    border: 1px solid var(--h-cyan-border);
    border-radius: 4px;
    font-size: 0.6875rem;
    font-family: var(--font-mono);
    color: var(--h-cyan);
    flex-shrink: 0;
  }
  .lp-terminal__model-icon {
    font-size: 0.6rem;
  }
  .lp-terminal__body {
    padding: 1.5rem 1.5rem 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }
  .lp-terminal__row {
    display: flex;
    gap: 0.875rem;
    align-items: flex-start;
  }
  .lp-terminal__row--user {
    flex-direction: row-reverse;
  }
  .lp-terminal__role {
    font-size: 0.6rem;
    font-weight: 700;
    font-family: var(--font-mono);
    color: var(--ui-text-dimmed);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    padding-top: 3px;
    flex-shrink: 0;
    width: 20px;
    text-align: right;
  }
  .lp-terminal__role--ai {
    color: var(--h-cyan);
    text-align: left;
  }
  .lp-terminal__text {
    font-size: 0.875rem;
    color: var(--ui-text-muted);
    line-height: 1.7;
  }
  .lp-terminal__text--user {
    background: var(--h-surface-2);
    border: 1px solid var(--h-border);
    border-radius: 8px 2px 8px 8px;
    padding: 0.5rem 0.75rem;
    color: var(--ui-text);
    max-width: 80%;
  }
  .lp-code {
    font-family: var(--font-mono);
    font-size: 0.8em;
    color: var(--h-cyan);
    background: var(--h-cyan-dim);
    padding: 0.1em 0.4em;
    border-radius: 3px;
  }
  .lp-terminal__cursor {
    width: 7px;
    height: 16px;
    background: var(--h-cyan);
    border-radius: 1px;
    animation: blink 1.1s step-end infinite;
    margin-left: 1.875rem;
  }
  @keyframes blink {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
  }

  /* Features */
  .lp-features {
    border-top: 1px solid var(--h-border);
    padding: 6rem 2rem;
  }
  .lp-features__inner {
    max-width: 1000px;
    margin: 0 auto;
  }
  .lp-eyebrow {
    font-size: 0.6875rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--h-cyan);
    margin-bottom: 0.75rem;
  }
  .lp-features__title {
    font-size: clamp(1.375rem, 3vw, 1.875rem);
    font-weight: 700;
    color: var(--ui-text-highlighted);
    letter-spacing: -0.02em;
    margin-bottom: 2.5rem;
  }
  .lp-features__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
    gap: 1px;
    background: var(--h-border);
    border: 1px solid var(--h-border);
    border-radius: 10px;
    overflow: hidden;
  }
  .lp-card {
    background: var(--h-surface);
    padding: 1.625rem;
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
    transition: background 0.15s;
  }
  .lp-card:hover {
    background: var(--h-surface-2);
  }
  .lp-card__icon {
    width: 34px;
    height: 34px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--h-cyan-dim);
    border: 1px solid var(--h-cyan-border);
    border-radius: 8px;
    color: var(--h-cyan);
    font-size: 1rem;
  }
  .lp-card__title {
    font-size: 0.9375rem;
    font-weight: 600;
    color: var(--ui-text);
    letter-spacing: -0.01em;
  }
  .lp-card__desc {
    font-size: 0.8125rem;
    color: var(--ui-text-muted);
    line-height: 1.65;
  }

  /* CTA */
  .lp-cta {
    border-top: 1px solid var(--h-border);
    padding: 6rem 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 1.25rem;
    position: relative;
    overflow: hidden;
  }
  .lp-cta__glow {
    position: absolute;
    width: 500px;
    height: 250px;
    top: -60px;
    left: 50%;
    transform: translateX(-50%);
    background: radial-gradient(
      ellipse at center,
      rgba(14, 165, 233, 0.08) 0%,
      transparent 70%
    );
    pointer-events: none;
  }
  .lp-cta__title {
    font-size: clamp(1.75rem, 4vw, 2.5rem);
    font-weight: 800;
    color: var(--ui-text-highlighted);
    letter-spacing: -0.025em;
    position: relative;
  }
  .lp-cta__sub {
    font-size: 0.9375rem;
    color: var(--ui-text-muted);
    line-height: 1.65;
    max-width: 460px;
    position: relative;
  }

  /* Footer */
  .lp-footer {
    border-top: 1px solid var(--h-border);
    padding: 1.5rem 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    max-width: 100%;
  }
  .lp-footer__copy {
    font-size: 0.75rem;
    color: var(--ui-text-dimmed);
  }

  @media (max-width: 600px) {
    .lp-footer {
      flex-direction: column;
      align-items: flex-start;
    }
  }
</style>
