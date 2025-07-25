# Configurações do VS Code para o Projeto

Este diretório contém as configurações específicas do VS Code para o projeto SaaS Barbershop.

## Arquivos de Configuração

### `settings.json`

- Desabilita a validação padrão do CSS para evitar conflitos com o Tailwind
- Configura o suporte ao Tailwind CSS
- Define associações de arquivos para melhor suporte
- Configura autocompletar e linting do Tailwind

### `css_custom_data.json`

- Define as diretivas customizadas do Tailwind CSS
- Resolve os erros de "Unknown at rule" para `@tailwind`, `@apply`, `@layer`, etc.
- Fornece documentação inline para as diretivas

### `extensions.json`

- Lista as extensões recomendadas para o projeto
- Inclui a extensão oficial do Tailwind CSS

## Extensões Recomendadas

1. **Tailwind CSS IntelliSense** (`bradlc.vscode-tailwindcss`)
   - Autocompletar para classes do Tailwind
   - Linting e validação
   - Preview de cores

2. **Prettier** (`esbenp.prettier-vscode`)
   - Formatação automática de código
   - Suporte ao plugin do Tailwind

3. **TypeScript** (`ms-vscode.vscode-typescript-next`)
   - Suporte completo ao TypeScript

4. **Auto Rename Tag** (`formulahendry.auto-rename-tag`)
   - Renomeia automaticamente tags HTML/JSX

5. **Path Intellisense** (`christian-kohler.path-intellisense`)
   - Autocompletar para caminhos de arquivos

## Como Resolver Problemas de Linting

Se você ainda estiver vendo erros de "Unknown at rule" para diretivas do Tailwind:

1. **Reinicie o VS Code** após aplicar essas configurações
2. **Instale a extensão do Tailwind CSS** se ainda não estiver instalada
3. **Verifique se o arquivo `tailwind.config.ts` está correto**
4. **Certifique-se de que o PostCSS está configurado corretamente**

## Comandos Úteis

- `Ctrl+Shift+P` → "Tailwind CSS: Show Output" - Para ver o output do Tailwind
- `Ctrl+Shift+P` → "Developer: Reload Window" - Para recarregar o VS Code
