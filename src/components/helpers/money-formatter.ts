export const formatCurrency = (value: number) => {
    if (value && !isNaN(value)) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value || 0);
    }
    return null;
};