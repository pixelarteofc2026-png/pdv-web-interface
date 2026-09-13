// sales.js - Funções adicionais de vendas

class SalesManager {
    static generateReceipt(sale) {
        let receipt = '\n=== RECIBO DE VENDA ===\n';
        receipt += `Venda #${sale.id}\n`;
        receipt += `${sale.time} ${new Date(sale.date).toLocaleDateString('pt-BR')}\n\n`;
        receipt += '--- ITENS ---\n';
        
        sale.items.forEach(item => {
            receipt += `${item.name}\n`;
            receipt += `  ${item.quantity} x R$ ${item.price.toFixed(2)} = R$ ${item.total.toFixed(2)}\n`;
        });
        
        receipt += '\n--- RESUMO ---\n';
        receipt += `Subtotal: R$ ${sale.subtotal.toFixed(2)}\n`;
        if (sale.discount > 0) {
            receipt += `Desconto: R$ ${sale.discount.toFixed(2)}\n`;
        }
        receipt += `TOTAL: R$ ${sale.total.toFixed(2)}\n`;
        receipt += `Pagamento: ${sale.payment.toUpperCase()}\n`;
        receipt += '\n========================\n';
        
        return receipt;
    }

    static printReceipt(sale) {
        const receipt = this.generateReceipt(sale);
        console.log(receipt);
        
        // Simular impressão
        const printWindow = window.open('', '', 'height=400,width=600');
        printWindow.document.write('<pre>' + receipt.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</pre>');
        printWindow.document.close();
    }

    static exportSalesCSV() {
        let csv = 'ID,Data,Hora,Itens,Subtotal,Desconto,Total,Pagamento\n';
        
        pdvData.sales.forEach(sale => {
            const itemsStr = sale.items.map(i => i.name).join('; ');
            const date = new Date(sale.date).toLocaleDateString('pt-BR');
            csv += `${sale.id},${date},${sale.time},"${itemsStr}",${sale.subtotal},${sale.discount},${sale.total},${sale.payment}\n`;
        });
        
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `vendas_${new Date().getTime()}.csv`;
        a.click();
    }
}

// app.js - Inicialização da aplicação
