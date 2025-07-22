export interface Dues {
  duesNotes: {
    due_date: string | number | Date;
    description: string;
    paid_amount: number;
    total_amount: number;
    pending_amount: number;
  };
}
