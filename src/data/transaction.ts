export interface Transaction {
    name: string;
    type: 'entrada' | 'saida';
    amount: number;
    date: string;
}