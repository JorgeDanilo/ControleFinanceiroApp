export interface Transaction {
    id: string;
    name: string;
    type: 'entrada' | 'saida';
    amount: number;
    date: string;
}