# Testes E2E com Playwright

Este projeto usa [Playwright](https://playwright.dev/) para testes end-to-end (E2E) que simulam o comportamento real dos usuários.

## 🚀 Configuração

### Instalação

```bash
# Instalar Playwright
pnpm add -D @playwright/test

# Instalar navegadores
pnpm test:e2e:install
```

### Configuração

- **Arquivo**: `playwright.config.ts`
- **Diretório**: `tests/e2e/`
- **Navegadores**: Chrome, Firefox, Safari, Mobile Chrome, Mobile Safari

## 📁 Estrutura dos Testes

```
tests/e2e/
├── global-setup.ts      # Setup global dos testes
├── utils/
│   └── test-helpers.ts  # Utilitários para testes
├── home.spec.ts         # Testes da página inicial
├── chat.spec.ts         # Testes de funcionalidades de chat
└── navigation.spec.ts   # Testes de navegação
```

## 🧪 Executando Testes

### Comandos Básicos

```bash
# Executar todos os testes E2E
pnpm test:e2e

# Interface gráfica
pnpm test:e2e:ui

# Modo headed (ver navegador)
pnpm test:e2e:headed

# Modo debug
pnpm test:e2e:debug

# Gerar código de teste
pnpm test:e2e:codegen
```

### Executar Testes Específicos

```bash
# Teste específico
pnpm test:e2e home.spec.ts

# Teste com filtro
pnpm test:e2e --grep "should display"

# Teste em navegador específico
pnpm test:e2e --project=chromium
```

## 🔧 Utilitários de Teste

### TestHelpers

```typescript
import { createTestHelpers } from './utils/test-helpers';

test('example', async ({ page }) => {
  const helpers = createTestHelpers(page);

  // Aguardar página carregar
  await helpers.waitForPageLoad();

  // Verificar elemento visível
  await helpers.expectElementVisible('h1');

  // Verificar texto
  await helpers.expectElementContainsText('h1', 'AI Chat');

  // Preencher input
  await helpers.fillInput('textarea', 'Hello World');

  // Clicar e aguardar navegação
  await helpers.clickAndWaitForNavigation('a[href="/chat"]');
});
```

### Métodos Disponíveis

- `waitForPageLoad()` - Aguarda página carregar
- `expectElementVisible(selector)` - Verifica se elemento está visível
- `expectElementContainsText(selector, text)` - Verifica texto do elemento
- `clickAndWaitForNavigation(selector)` - Clica e aguarda navegação
- `fillInput(selector, value)` - Preenche campo de input
- `submitForm(selector)` - Submete formulário
- `expectUrlContains(path)` - Verifica URL atual
- `waitForLoadingState(selector)` - Aguarda estado de loading
- `takeScreenshot(name)` - Tira screenshot

## 📱 Testes Responsivos

### Viewports Configurados

```typescript
// Desktop
await page.setViewportSize({ width: 1920, height: 1080 });

// Mobile
await page.setViewportSize({ width: 375, height: 667 });

// Tablet
await page.setViewportSize({ width: 768, height: 1024 });
```

### Exemplo de Teste Responsivo

```typescript
test('should be responsive', async ({ page }) => {
  // Testar desktop
  await page.setViewportSize({ width: 1920, height: 1080 });
  await helpers.expectElementVisible('h1');

  // Testar mobile
  await page.setViewportSize({ width: 375, height: 667 });
  await helpers.expectElementVisible('h1');
});
```

## 🌐 Testes de Navegação

### Verificar Links

```typescript
test('should have working links', async ({ page }) => {
  const links = page.locator('nav a');

  for (let i = 0; i < (await links.count()); i++) {
    const link = links.nth(i);
    const href = await link.getAttribute('href');

    if (href && !href.startsWith('#')) {
      await link.click();
      await page.waitForLoadState('networkidle');

      // Verificar se não há erro 404
      const is404 = page.url().includes('404');
      expect(is404).toBeFalsy();
    }
  }
});
```

## 🔍 Testes de Acessibilidade

### Verificar Atributos

```typescript
test('should be accessible', async ({ page }) => {
  const inputs = page.locator('input, textarea');

  for (let i = 0; i < (await inputs.count()); i++) {
    const input = inputs.nth(i);
    const hasLabel = (await input.locator('label').count()) > 0;
    const hasAriaLabel = await input.getAttribute('aria-label');

    expect(hasLabel || hasAriaLabel).toBeTruthy();
  }
});
```

## 📊 Relatórios e Resultados

### Relatórios HTML

```bash
# Abrir relatório após execução
pnpm test:e2e --reporter=html
```

### Screenshots e Vídeos

- **Screenshots**: Capturados automaticamente em falhas
- **Vídeos**: Gravados em falhas para debug
- **Traces**: Gerados para análise detalhada

### Localização dos Artefatos

```
test-results/
├── screenshots/     # Screenshots de falhas
├── videos/         # Vídeos de falhas
├── traces/         # Traces para debug
└── results.json    # Resultados em JSON
```

## 🚨 Debugging

### Modo Debug

```bash
# Executar em modo debug
pnpm test:e2e:debug

# Pausar em breakpoints
# Inspecionar elementos
# Executar passo a passo
```

### Logs e Console

```typescript
test('debug example', async ({ page }) => {
  // Capturar logs do console
  page.on('console', msg => {
    console.log('Console:', msg.text());
  });

  // Capturar erros
  page.on('pageerror', error => {
    console.error('Page error:', error);
  });
});
```

## 🔄 Integração com CI/CD

### Pipeline de CI

Os testes E2E são executados automaticamente no CI:

1. **Setup**: Instalação de dependências
2. **Servidor**: Inicia servidor de desenvolvimento
3. **Aguarda**: Servidor estar pronto
4. **Testes**: Executa todos os testes E2E
5. **Build**: Compila aplicação de produção

### Ambiente de CI

- **Navegadores**: Instalados automaticamente
- **Servidor**: Rodando em background
- **Timeout**: Configurado para CI
- **Retries**: 2 tentativas em caso de falha

## 📈 Melhorias Futuras

### Performance

- [ ] Testes paralelos otimizados
- [ ] Cache de navegadores
- [ ] Testes incrementais

### Cobertura

- [ ] Mais cenários de teste
- [ ] Testes de edge cases
- [ ] Testes de performance

### Integração

- [ ] Testes de API
- [ ] Testes de banco de dados
- [ ] Testes de integração externa

## 📚 Recursos

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Playwright Test API](https://playwright.dev/docs/api/class-test)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Debugging](https://playwright.dev/docs/debug)
- [CI/CD Integration](https://playwright.dev/docs/ci)
