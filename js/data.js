// data.js - Gerenciamento de dados do PDV

class PDVData {
    constructor() {
        this.products = this.loadProducts();
        this.cart = [];
        this.sales = this.loadSales();
        this.cash = this.loadCash();
        this.movements = this.loadMovements();
        this.settings = this.loadSettings();
    }

    // PRODUTOS
    loadProducts() {
        const stored = localStorage.getItem('pdv_products');
        if (stored) return JSON.parse(stored);
        
        return [
            { id: 1, code: '001', name: 'Coca-Cola 2L', price: 8.50, quantity: 50, category: 'Bebidas' },
            { id: 2, code: '002', name: 'Água 1.5L', price: 2.50, quantity: 100, category: 'Bebidas' },
            { id: 3, code: '003', name: 'Pão de Queijo', price: 3.00, quantity: 80, category: 'Alimentos' },
            { id: 4, code: '004', name: 'Biscoito Água e Sal', price: 2.00, quantity: 120, category: 'Alimentos' },
            { id: 5, code: '005', name: 'Leite Integral 1L', price: 4.50, quantity: 60, category: 'Laticínios' },
            { id: 6, code: '006', name: 'Queijo Meia Cura', price: 15.00, quantity: 30, category: 'Laticínios' },
            { id: 7, code: '007', name: 'Arroz 5kg', price: 18.00, quantity: 40, category: 'Grãos' },
            { id: 8, code: '008', name: 'Feijão 1kg', price: 6.50, quantity: 50, category: 'Grãos' },
        ];
    }

    saveProducts() {
        localStorage.setItem('pdv_products', JSON.stringify(this.products));
    }

    getProductByCode(code) {
        return this.products.find(p => p.code === code);
    }

    getProductByName(name) {
        return this.products.filter(p => p.name.toLowerCase().includes(name.toLowerCase()));
    }

    addProduct(product) {
        product.id = Math.max(...this.products.map(p => p.id), 0) + 1;
        this.products.push(product);
        this.saveProducts();
        return product;
    }

    updateProduct(id, updates) {
        const product = this.products.find(p => p.id === id);
        if (product) {
            Object.assign(product, updates);
            this.saveProducts();
        }
        return product;
    }

    // CARRINHO
    addToCart(product, quantity) {
        const existingItem = this.cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cart.push({
                ...product,
                quantity,
                total: product.price * quantity
            });
        }
        this.updateCartTotals();
        return this.cart;
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.updateCartTotals();
        return this.cart;
    }

    updateCartQuantity(productId, quantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeFromCart(productId);
            } else {
                item.quantity = quantity;
                item.total = item.price * quantity;
                this.updateCartTotals();
            }
        }
        return this.cart;
    }

    updateCartTotals() {
        this.cartSubtotal = this.cart.reduce((sum, item) => sum + item.total, 0);
        this.cartDiscount = 0;
        this.cartTotal = this.cartSubtotal - this.cartDiscount;
    }

    clearCart() {
        this.cart = [];
        this.cartSubtotal = 0;
        this.cartDiscount = 0;
        this.cartTotal = 0;
    }

    getCartTotal() {
        return this.cartTotal;
    }

    // VENDAS
    loadSales() {
        const stored = localStorage.getItem('pdv_sales');
        return stored ? JSON.parse(stored) : [];
    }

    saveSales() {
        localStorage.setItem('pdv_sales', JSON.stringify(this.sales));
    }

    finalizeSale(paymentMethod) {
        if (this.cart.length === 0) return null;

        const sale = {
            id: this.sales.length + 1,
            date: new Date(),
            time: new Date().toLocaleTimeString('pt-BR'),
            items: [...this.cart],
            subtotal: this.cartSubtotal,
            discount: this.cartDiscount,
            total: this.cartTotal,
            payment: paymentMethod,
            status: 'concluído'
        };

        // Atualizar estoque
        this.cart.forEach(item => {
            this.updateProduct(item.id, { quantity: item.quantity - item.quantity });
        });

        this.sales.push(sale);
        this.saveSales();
        this.cash += sale.total;
        this.saveCash();
        this.clearCart();

        return sale;
    }

    getSalesToday() {
        const today = new Date().toDateString();
        return this.sales.filter(s => new Date(s.date).toDateString() === today);
    }

    getTotalSalesToday() {
        return this.getSalesToday().reduce((sum, s) => sum + s.total, 0);
    }

    // CAIXA
    loadCash() {
        return parseFloat(localStorage.getItem('pdv_cash') || '0');
    }

    saveCash() {
        localStorage.setItem('pdv_cash', this.cash.toString());
    }

    addCash(amount, description) {
        this.cash += amount;
        this.movements.push({
            type: 'entrada',
            amount,
            description,
            date: new Date(),
            time: new Date().toLocaleTimeString('pt-BR')
        });
        this.saveMovements();
        this.saveCash();
        return this.cash;
    }

    removeCash(amount, description) {
        this.cash -= amount;
        this.movements.push({
            type: 'saída',
            amount,
            description,
            date: new Date(),
            time: new Date().toLocaleTimeString('pt-BR')
        });
        this.saveMovements();
        this.saveCash();
        return this.cash;
    }

    // MOVIMENTAÇÕES
    loadMovements() {
        const stored = localStorage.getItem('pdv_movements');
        return stored ? JSON.parse(stored) : [];
    }

    saveMovements() {
        localStorage.setItem('pdv_movements', JSON.stringify(this.movements));
    }

    getRecentMovements(limit = 10) {
        return this.movements.slice(-limit).reverse();
    }

    // CONFIGURAÇÕES
    loadSettings() {
        const stored = localStorage.getItem('pdv_settings');
        return stored ? JSON.parse(stored) : {
            companyName: 'Meu Negócio',
            companyCNPJ: '00.000.000/0000-00',
            darkMode: false,
            beeper: true
        };
    }

    saveSettings() {
        localStorage.setItem('pdv_settings', JSON.stringify(this.settings));
    }

    updateSettings(updates) {
        Object.assign(this.settings, updates);
        this.saveSettings();
    }

    // RELATÓRIOS
    getSalesReport(startDate, endDate) {
        return this.sales.filter(s => {
            const saleDate = new Date(s.date);
            return saleDate >= startDate && saleDate <= endDate;
        });
    }

    getTotalSalesInPeriod(startDate, endDate) {
        return this.getSalesReport(startDate, endDate).reduce((sum, s) => sum + s.total, 0);
    }

    getMostSoldProducts() {
        const products = {};
        this.sales.forEach(sale => {
            sale.items.forEach(item => {
                if (!products[item.name]) {
                    products[item.name] = { product: item.name, quantity: 0, total: 0 };
                }
                products[item.name].quantity += item.quantity;
                products[item.name].total += item.total;
            });
        });
        return Object.values(products).sort((a, b) => b.quantity - a.quantity);
    }
}

// Inicializar dados globais
const pdvData = new PDVData();
