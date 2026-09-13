// ui.js - Interface do usuário

class PDVInterface {
    constructor() {
        this.currentPaymentMethod = 'dinheiro';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateClock();
        setInterval(() => this.updateClock(), 1000);
        this.updateDashboard();
    }

    setupEventListeners() {
        // Navegação
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => this.switchSection(e));
        });

        // Sidebar toggle
        const toggleBtn = document.getElementById('toggleSidebar');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                document.querySelector('.sidebar').classList.toggle('open');
            });
        }

        // Logout
        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.showModal('Sair', 'Tem certeza que deseja sair?');
        });

        // Vendas
        document.getElementById('productCode').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addProductFromCode();
        });

        document.getElementById('productSearch').addEventListener('input', (e) => {
            this.searchProducts(e.target.value);
        });

        document.getElementById('addProductBtn').addEventListener('click', () => {
            this.addProductFromCode();
        });

        document.getElementById('finalizeSaleBtn').addEventListener('click', () => {
            this.finalizeSale();
        });

        document.getElementById('clearCartBtn').addEventListener('click', () => {
            if (confirm('Limpar o carrinho?')) {
                pdvData.clearCart();
                this.updateCart();
            }
        });

        // Pagamento
        document.querySelectorAll('.payment-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectPayment(e));
        });

        // Caixa
        document.getElementById('addCashBtn').addEventListener('click', () => {
            this.addCashMovement();
        });

        document.getElementById('discount').addEventListener('input', (e) => {
            pdvData.cartDiscount = parseFloat(e.target.value) || 0;
            pdvData.cartTotal = pdvData.cartSubtotal - pdvData.cartDiscount;
            this.updateCartTotals();
        });

        // Estoque
        document.getElementById('addNewProductBtn').addEventListener('click', () => {
            this.addNewProduct();
        });

        document.getElementById('estoque-search').addEventListener('input', (e) => {
            this.filterEstoque(e.target.value);
        });

        // Configurações
        document.getElementById('saveConfigBtn').addEventListener('click', () => {
            this.saveSettings();
        });

        document.getElementById('darkModeToggle').addEventListener('change', (e) => {
            this.toggleDarkMode(e.target.checked);
        });

        // Modal
        document.querySelector('.modal-close').addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('modalBtn').addEventListener('click', () => {
            this.closeModal();
        });
    }

    switchSection(e) {
        e.preventDefault();
        const section = e.target.dataset.section;
        
        // Remover ativo
        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
        document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
        
        // Adicionar ativo
        e.target.classList.add('active');
        document.getElementById(`${section}-section`).classList.add('active');
        
        // Atualizar título
        const titles = {
            home: '🏠 Bem-vindo ao PDV Completo',
            vendas: '🛒 Novo Venda',
            caixa: '💰 Controle de Caixa',
            estoque: '📦 Gestão de Estoque',
            relatorios: '📊 Relatórios',
            config: '⚙️ Configurações'
        };
        document.getElementById('pageTitle').textContent = titles[section] || 'PDV Completo';

        // Atualizar conteúdo dinâmico
        if (section === 'estoque') this.updateEstoque();
        if (section === 'relatorios') this.updateReports();
        if (section === 'config') this.loadSettings();
    }

    updateClock() {
        const now = new Date();
        document.getElementById('currentTime').textContent = now.toLocaleTimeString('pt-BR');
    }

    updateDashboard() {
        document.getElementById('todaysSales').textContent = pdvData.getTotalSalesToday().toFixed(2);
        document.getElementById('cashBalance').textContent = pdvData.cash.toFixed(2);
        document.getElementById('stockCount').textContent = pdvData.products.reduce((sum, p) => sum + p.quantity, 0);
    }

    // VENDAS
    addProductFromCode() {
        const code = document.getElementById('productCode').value.trim();
        if (!code) return;

        const product = pdvData.getProductByCode(code);
        if (!product) {
            this.showModal('Erro', 'Produto não encontrado!');
            return;
        }

        pdvData.addToCart(product, 1);
        this.updateCart();
        document.getElementById('productCode').value = '';
        document.getElementById('productCode').focus();
    }

    searchProducts(query) {
        if (!query) {
            document.getElementById('searchResults').classList.remove('active');
            return;
        }

        const results = pdvData.getProductByName(query);
        const resultsDiv = document.getElementById('searchResults');
        
        if (results.length === 0) {
            resultsDiv.innerHTML = '<div class="search-result-item">Nenhum produto encontrado</div>';
        } else {
            resultsDiv.innerHTML = results.map(p => 
                `<div class="search-result-item" onclick="pdvData.addToCart(${JSON.stringify(p).replace(/"/g, '&quot;')}, 1); pdvUI.updateCart(); document.getElementById('searchResults').classList.remove('active');">
                    ${p.name} - R$ ${p.price.toFixed(2)}
                </div>`
            ).join('');
        }
        resultsDiv.classList.add('active');
    }

    updateCart() {
        const cartItems = document.getElementById('cartItems');
        
        if (pdvData.cart.length === 0) {
            cartItems.innerHTML = '<tr class="empty-cart"><td colspan="5">Nenhum produto adicionado</td></tr>';
        } else {
            cartItems.innerHTML = pdvData.cart.map(item => `
                <tr>
                    <td>${item.name}</td>
                    <td><input type="number" value="${item.quantity}" min="1" onchange="pdvData.updateCartQuantity(${item.id}, this.value); pdvUI.updateCart();" style="width: 60px; padding: 5px;"></td>
                    <td>R$ ${item.price.toFixed(2)}</td>
                    <td>R$ ${item.total.toFixed(2)}</td>
                    <td><button class="btn btn-danger" onclick="pdvData.removeFromCart(${item.id}); pdvUI.updateCart();" style="padding: 5px 10px;">Remover</button></td>
                </tr>
            `).join('');
        }
        
        this.updateCartTotals();
    }

    updateCartTotals() {
        document.getElementById('subtotal').textContent = pdvData.cartSubtotal.toFixed(2);
        document.getElementById('discountTotal').textContent = pdvData.cartDiscount.toFixed(2);
        document.getElementById('total').textContent = pdvData.cartTotal.toFixed(2);
    }

    selectPayment(e) {
        document.querySelectorAll('.payment-btn').forEach(btn => btn.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.currentPaymentMethod = e.currentTarget.dataset.payment;
    }

    finalizeSale() {
        if (pdvData.cart.length === 0) {
            this.showModal('Atenção', 'Adicione produtos ao carrinho!');
            return;
        }

        const sale = pdvData.finalizeSale(this.currentPaymentMethod);
        if (sale) {
            this.showModal('Sucesso', `Venda ${sale.id} finalizada! Total: R$ ${sale.total.toFixed(2)}`);
            this.updateCart();
            this.updateDashboard();
        }
    }

    // CAIXA
    addCashMovement() {
        const amount = parseFloat(document.getElementById('cashInput').value);
        const description = document.getElementById('cashDescription').value;

        if (!amount || amount <= 0) {
            this.showModal('Erro', 'Digite um valor válido!');
            return;
        }

        pdvData.addCash(amount, description);
        document.getElementById('cashAmount').value = pdvData.cash.toFixed(2);
        document.getElementById('cashInput').value = '';
        document.getElementById('cashDescription').value = '';
        this.updateMovements();
        this.updateDashboard();
    }

    updateMovements() {
        const movementList = document.getElementById('movementList');
        const movements = pdvData.getRecentMovements();
        
        if (movements.length === 0) {
            movementList.innerHTML = '<p class="empty-message">Nenhuma movimentação</p>';
        } else {
            movementList.innerHTML = movements.map(m => `
                <div class="movement-item ${m.type === 'saída' ? 'negative' : ''}">
                    <div class="movement-text">
                        <span>${m.description}</span>
                        <span class="movement-amount ${m.type === 'saída' ? 'negative' : ''}">${m.type === 'saída' ? '-' : '+'}R$ ${m.amount.toFixed(2)}</span>
                    </div>
                    <small>${m.time}</small>
                </div>
            `).join('');
        }
    }

    // ESTOQUE
    updateEstoque() {
        const estoqueList = document.getElementById('estoque-list');
        
        if (pdvData.products.length === 0) {
            estoqueList.innerHTML = '<tr class="empty-row"><td colspan="5">Nenhum produto cadastrado</td></tr>';
        } else {
            estoqueList.innerHTML = pdvData.products.map(p => `
                <tr>
                    <td>${p.code}</td>
                    <td>${p.name}</td>
                    <td>${p.quantity}</td>
                    <td>R$ ${p.price.toFixed(2)}</td>
                    <td><button class="btn btn-secondary" onclick="pdvUI.editProduct(${p.id})" style="padding: 5px 10px;">Editar</button></td>
                </tr>
            `).join('');
        }
    }

    filterEstoque(query) {
        const estoqueList = document.getElementById('estoque-list');
        const filtered = pdvData.products.filter(p => 
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.code.includes(query)
        );
        
        if (filtered.length === 0) {
            estoqueList.innerHTML = '<tr class="empty-row"><td colspan="5">Nenhum produto encontrado</td></tr>';
        } else {
            estoqueList.innerHTML = filtered.map(p => `
                <tr>
                    <td>${p.code}</td>
                    <td>${p.name}</td>
                    <td>${p.quantity}</td>
                    <td>R$ ${p.price.toFixed(2)}</td>
                    <td><button class="btn btn-secondary" onclick="pdvUI.editProduct(${p.id})" style="padding: 5px 10px;">Editar</button></td>
                </tr>
            `).join('');
        }
    }

    addNewProduct() {
        const code = document.getElementById('newProductCode').value;
        const name = document.getElementById('newProductName').value;
        const price = parseFloat(document.getElementById('newProductPrice').value);
        const quantity = parseInt(document.getElementById('newProductQty').value);
        const category = document.getElementById('newProductCategory').value;

        if (!code || !name || !price || !quantity) {
            this.showModal('Erro', 'Preencha todos os campos!');
            return;
        }

        pdvData.addProduct({ code, name, price, quantity, category });
        document.getElementById('newProductCode').value = '';
        document.getElementById('newProductName').value = '';
        document.getElementById('newProductPrice').value = '';
        document.getElementById('newProductQty').value = '';
        document.getElementById('newProductCategory').value = '';
        this.updateEstoque();
        this.updateDashboard();
        this.showModal('Sucesso', 'Produto adicionado!');
    }

    // RELATÓRIOS
    updateReports() {
        const today = new Date();
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

        document.getElementById('report-today').textContent = pdvData.getTotalSalesInPeriod(today, new Date()).toFixed(2);
        document.getElementById('report-week').textContent = pdvData.getTotalSalesInPeriod(weekAgo, today).toFixed(2);
        document.getElementById('report-month').textContent = pdvData.getTotalSalesInPeriod(monthAgo, today).toFixed(2);

        const topProducts = pdvData.getMostSoldProducts();
        if (topProducts.length > 0) {
            document.getElementById('top-product').textContent = topProducts[0].product;
        }
    }

    // CONFIGURAÇÕES
    loadSettings() {
        const settings = pdvData.settings;
        document.getElementById('company-name').value = settings.companyName;
        document.getElementById('company-cnpj').value = settings.companyCNPJ;
        document.getElementById('darkModeToggle').checked = settings.darkMode;
        document.getElementById('beeperToggle').checked = settings.beeper;
    }

    saveSettings() {
        pdvData.updateSettings({
            companyName: document.getElementById('company-name').value,
            companyCNPJ: document.getElementById('company-cnpj').value,
            darkMode: document.getElementById('darkModeToggle').checked,
            beeper: document.getElementById('beeperToggle').checked
        });
        this.showModal('Sucesso', 'Configurações salvas!');
    }

    toggleDarkMode(enabled) {
        if (enabled) {
            document.body.style.backgroundColor = 'var(--bg-dark)';
            document.body.style.color = 'var(--text-light)';
        } else {
            document.body.style.backgroundColor = 'var(--bg-light)';
            document.body.style.color = 'var(--text-dark)';
        }
    }

    // MODAL
    showModal(title, message) {
        document.getElementById('modalTitle').textContent = title;
        document.getElementById('modalMessage').textContent = message;
        document.getElementById('modal').classList.add('active');
    }

    closeModal() {
        document.getElementById('modal').classList.remove('active');
    }
}

const pdvUI = new PDVInterface();
