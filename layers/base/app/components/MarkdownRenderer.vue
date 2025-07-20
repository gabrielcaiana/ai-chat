<script setup lang="ts">
defineProps<{
  content: string;
}>();
</script>

<template>
  <div class="markdown-container">
    <MDC :value="content" class="mdc-prose" />
  </div>
</template>

<style>
/* ===== Container Styles ===== */
.markdown-container {
  width: 100%;
  overflow-x: auto;
}

.markdown-container :deep(pre) {
  position: relative;
}

.markdown-container :deep(pre code) {
  font-size: 0.9em;
  line-height: 1.5;
}

/* ===== Markdown Styles ===== */
.mdc-prose {
  color: var(--ui-text);
  max-width: 100% !important;
}

.mdc-prose pre {
  background-color: var(--ui-bg-muted);
  border: 1px solid var(--ui-border);
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem 0;
  overflow-x: auto;
}

.mdc-prose code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace;
  font-size: 0.875em;
  color: var(--ui-text);
  background-color: var(--ui-bg-muted);
  padding: 0.2em 0.4em;
  border-radius: 4px;
}

.mdc-prose pre code {
  background-color: transparent;
  padding: 0;
  border-radius: 0;
  color: inherit;
}

.mdc-prose h1 {
  font-size: 2em;
  margin-top: 0;
  margin-bottom: 0.8em;
  font-weight: 600;
}

.mdc-prose h2 {
  font-size: 1.5em;
  margin-top: 1.6em;
  margin-bottom: 0.8em;
  font-weight: 600;
}

.mdc-prose h3 {
  font-size: 1.25em;
  margin-top: 1.6em;
  margin-bottom: 0.6em;
  font-weight: 600;
}

.mdc-prose p {
  margin-top: 1.25em;
  margin-bottom: 1.25em;
  line-height: 1.7;
}

.mdc-prose ul {
  margin-top: 1.25em;
  margin-bottom: 1.25em;
  padding-left: 1.625em;
  list-style-type: disc;
}

.mdc-prose ol {
  margin-top: 1.25em;
  margin-bottom: 1.25em;
  padding-left: 1.625em;
  list-style-type: decimal;
}

.mdc-prose li {
  margin-top: 0.5em;
  margin-bottom: 0.5em;
  line-height: 1.7;
}

.mdc-prose blockquote {
  margin: 1.6em 0;
  padding-left: 1em;
  border-left: 4px solid var(--ui-border);
  color: var(--ui-text-muted);
  font-style: italic;
}

.mdc-prose a {
  color: var(--ui-primary);
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 2px;
}

.mdc-prose a:hover {
  text-decoration-thickness: 2px;
}

.mdc-prose table {
  width: 100%;
  margin-top: 2em;
  margin-bottom: 2em;
  border-collapse: collapse;
  border: 1px solid var(--ui-border);
}

.mdc-prose th {
  padding: 0.75em 1em;
  background-color: var(--ui-bg-muted);
  font-weight: 600;
  text-align: left;
  border-bottom: 1px solid var(--ui-border);
}

.mdc-prose td {
  padding: 0.75em 1em;
  border-bottom: 1px solid var(--ui-border);
}

.mdc-prose img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 2em 0;
}

.mdc-prose hr {
  margin: 3em 0;
  border: none;
  border-top: 1px solid var(--ui-border);
}
</style>
