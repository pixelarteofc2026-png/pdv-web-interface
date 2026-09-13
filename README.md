# 🏪 PDV Completo - Interface Web Funcional

**Sistema de Ponto de Venda Profissional com Interface Responsiva**

## 🚀 Características

✅ **Interface Completa do PDV**
- Tela de vendas com carrinho
- Controle de caixa
- Gestão de estoque
- Relatórios de vendas
- Configurações

✅ **Funcionalidades Implementadas**
- Busca e adição de produtos
- Carrinho de compras interativo
- Múltiplas formas de pagamento
- Gestão de movimentações de caixa
- Cadastro de novos produtos
- Cálculo automático de totais e descontos
- Armazenamento local (LocalStorage)
- Responsivo (Desktop, Tablet, Mobile)

✅ **Atalhos de Teclado**
- `F1` - Nova Venda
- `F2` - Caixa
- `F3` - Estoque
- `F4` - Relatórios
- `Ctrl+S` - Finalizar Venda
- `Enter` - Escanear Produto

## 📁 Estrutura

```
pdv-web-interface/
├── index.html              # Página principal
├── css/
│   ├── style.css          # Estilos principais
│   └── responsive.css     # Responsividade
├── js/
│   ├── data.js            # Gerenciamento de dados
│   ├── ui.js              # Interface do usuário
│   ├── sales.js           # Funções de vendas
│   └── app.js             # Inicialização
└── README.md
```

## 🎮 Como Usar

### 1. Abrir no Navegador
```bash
# Simplesmente abra o index.html no navegador
open index.html
# ou clique duas vezes no arquivo
```

### 2. Começar a Usar

**Fazer uma Venda:**
1. Clique em "🛒 Vendas" ou pressione `F1`
2. Digite o código do produto ou procure pelo nome
3. Adicione a quantidade
4. Selecione a forma de pagamento
5. Clique em "✓ Finalizar Venda" ou pressione `Ctrl+S`

**Gerenciar Caixa:**
1. Clique em "💰 Caixa" ou pressione `F2`
2. Adicione valores com descrição
3. Visualize o histórico de movimentações

**Controlar Estoque:**
1. Clique em "📦 Estoque" ou pressione `F3`
2. Veja todos os produtos
3. Procure por código ou nome
4. Adicione novos produtos

**Ver Relatórios:**
1. Clique em "📊 Relatórios" ou pressione `F4`
2. Veja vendas do dia, semana e mês
3. Produtos mais vendidos

## 📊 Dados Pré-carregados

O sistema vem com alguns produtos de exemplo:
- Coca-Cola 2L - R$ 8,50
- Água 1.5L - R$ 2,50
- Pão de Queijo - R$ 3,00
- Biscoito Água e Sal - R$ 2,00
- Leite Integral 1L - R$ 4,50
- Queijo Meia Cura - R$ 15,00
- Arroz 5kg - R$ 18,00
- Feijão 1kg - R$ 6,50

## 💾 Armazenamento de Dados

Todos os dados são salvos no **LocalStorage** do navegador:
- Produtos cadastrados
- Vendas realizadas
- Saldo de caixa
- Movimentações
- Configurações

**Para limpar dados:** Abra o Console (F12) e execute:
```javascript
localStorage.clear()
```

## 🎨 Temas

- **Modo Claro** (padrão)
- **Modo Escuro** (ativar em Configurações)

## 📱 Responsividade

✅ Desktop (1024px+)
✅ Tablet (768px - 1024px)
✅ Mobile (480px - 768px)
✅ Pequenos celulares (-480px)

## 🔧 Tecnologias

- HTML5
- CSS3 (Flexbox, Grid)
- JavaScript Vanilla
- LocalStorage API

## 🚀 Próximas Melhorias

- [ ] Integração com API Backend
- [ ] Emissão de NFC-e
- [ ] Integração com hardware (impressora, balança)
- [ ] Sincronização em nuvem
- [ ] Aplicação mobile nativa
- [ ] Gráficos avançados
- [ ] Sistema de usuários
- [ ] Autenticação

## 📞 Suporte

Para dúvidas ou sugestões:
- Abra uma **Issue** no GitHub
- Envie um **Pull Request**
- Entre em contato

## 📄 Licença

MIT License - Veja LICENSE para detalhes

---

**Desenvolvido com ❤️ para o mercado brasileiro**

*Última atualização: 13 de Setembro de 2026*
