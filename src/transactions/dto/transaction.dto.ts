export class TransactionDto {
  id: string;
  accountId: string;
  type: string;
  amount: number;
  status: string;
  errorMessage?: string;
  createdAt: Date;
}
