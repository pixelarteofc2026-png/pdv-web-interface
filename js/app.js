// app.js - Inicialização da aplicação

window.addEventListener('DOMContentLoaded', () => {
    console.log('🏪 PDV Completo Iniciado');
    console.log('📦 Produtos carregados:', pdvData.products.length);
    console.log('💾 Vendas anteriores:', pdvData.sales.length);
    
    // Carregar dados iniciais
    document.getElementById('cashAmount').value = pdvData.cash.toFixed(2);
    pdvUI.updateCart();
    pdvUI.updateDashboard();
    pdvUI.updateMovements();
});

// Hotkeys
document.addEventListener('keydown', (e) => {
    // F1 - Nova Venda
    if (e.key === 'F1') {
        e.preventDefault();
        document.querySelector('[data-section="vendas"]').click();
    }
    // F2 - Caixa
    if (e.key === 'F2') {
        e.preventDefault();
        document.querySelector('[data-section="caixa"]').click();
    }
    // F3 - Estoque
    if (e.key === 'F3') {
        e.preventDefault();
        document.querySelector('[data-section="estoque"]').click();
    }
    // F4 - Relatórios
    if (e.key === 'F4') {
        e.preventDefault();
        document.querySelector('[data-section="relatorios"]').click();
    }
    // Ctrl+S - Salvar/Finalizar Venda
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        document.getElementById('finalizeSaleBtn').click();
    }
});

console.log('⌨️ Atalhos disponíveis:');
console.log('F1 - Nova Venda');
console.log('F2 - Caixa');
console.log('F3 - Estoque');
console.log('F4 - Relatórios');
console.log('Ctrl+S - Finalizar Venda');
