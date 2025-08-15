# CI/CD Pipeline

Este projeto usa GitHub Actions para automação contínua de integração e entrega.

## 🚀 Pipeline de CI

### Trigger

O pipeline é executado automaticamente em:

- **Push** para branch `master`
- **Pull Request** para branch `master`

### Jobs

#### 1. Setup Environment

```yaml
- Setup pnpm 8
- Node.js 22.x
- Cache de dependências
```

#### 2. Dependências

```yaml
- Instalação com pnpm --frozen-lockfile
- Cache para otimização
```

#### 3. Qualidade de Código

```yaml
- Lint: pnpm lint
- Type-check: pnpm type-check
```

#### 4. Testes Unitários

```yaml
- Execução: pnpm test:run
- Cobertura: pnpm test:coverage
```

#### 5. Testes E2E

```yaml
- Instalação navegadores: pnpm test:e2e:install
- Servidor dev: pnpm dev
- Aguarda servidor: wait-on http://localhost:3000
- Execução: pnpm test:e2e
```

#### 6. Build

```yaml
- Build de produção: pnpm build
```

#### 7. Relatórios

```yaml
- Upload de cobertura para Codecov
- Status de qualidade
- Resultados de testes E2E
```

## 📊 Métricas de Qualidade

### Cobertura de Testes

- **Meta**: 80% de cobertura
- **Threshold**: 5% de variação permitida
- **Status Unitários**: ✅ 16/16 testes passando
- **Status E2E**: ✅ Playwright configurado e funcional

### Validações

- ✅ **ESLint**: Código sem erros de lint
- ✅ **TypeScript**: Validação de tipos
- ✅ **Prettier**: Formatação consistente
- ✅ **Testes Unitários**: Todos os testes passando
- ✅ **Testes E2E**: Playwright configurado e funcional
- ✅ **Build**: Aplicação compilada

## 🔧 Configurações

### GitHub Actions

- **Arquivo**: `.github/workflows/ci.yml`
- **Runtime**: Ubuntu Latest
- **Node.js**: 22.x
- **Package Manager**: pnpm 8
- **Testes E2E**: Playwright + Múltiplos navegadores

### Codecov

- **Arquivo**: `.codecov.yml`
- **Precisão**: 2 casas decimais
- **Range**: 80-100%
- **Status**: Project + Patch

### Cache

- **Dependências**: pnpm store
- **Cobertura**: coverage/
- **Testes E2E**: test-results/
- **Chave**: Baseada em pnpm-lock.yaml

## 🚨 Falhas e Soluções

### Lint Falhou

```bash
# Executar localmente
pnpm lint

# Corrigir automaticamente
pnpm lint:fix
```

### Type-check Falhou

```bash
# Verificar tipos
pnpm type-check

# Corrigir erros de tipo
```

### Testes Falharam

```bash
# Executar testes
pnpm test:run

# Ver detalhes
pnpm test:ui
```

### Build Falhou

```bash
# Build local
pnpm build

# Verificar erros de compilação
```

## 📈 Melhorias Futuras

### Performance

- [ ] Cache de build
- [ ] Testes paralelos
- [ ] Dependências em camadas

### Qualidade

- [ ] SonarQube integration
- [ ] Security scanning
- [ ] Dependency audit

### Deploy

- [ ] Auto-deploy para staging
- [ ] Rollback automático
- [ ] Health checks

## 🔍 Monitoramento

### Status Badges

```markdown
![CI](https://github.com/user/repo/workflows/ci/badge.svg)
![Coverage](https://codecov.io/gh/user/repo/branch/master/graph/badge.svg)
```

### Notificações

- **Slack**: Status de pipeline
- **Email**: Falhas críticas
- **GitHub**: Status checks

## 📚 Recursos

- [GitHub Actions](https://docs.github.com/en/actions)
- [Codecov](https://docs.codecov.io/)
- [pnpm](https://pnpm.io/)
- [Vitest](https://vitest.dev/)
- [Playwright](https://playwright.dev/)
- [E2E Testing Documentation](docs/E2E_TESTING.md)
