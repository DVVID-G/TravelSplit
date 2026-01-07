/**
 * Type definitions for Expense-related entities
 */

export interface ExpenseCategory {
  id: number;
  name: string;
  icon: string;
  is_active: boolean;
}

export interface ExpenseSplit {
  id: string;
  expense_id: string;
  user_id: string;
  amount_owed: number;
  created_at: string;
}

export interface Expense {
  id: string;
  trip_id: string;
  payer_id: string;
  category_id: number;
  title: string;
  amount: number;
  receipt_url?: string;
  expense_date: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  // Relations
  category?: ExpenseCategory;
  payer?: {
    id: string;
    nombre: string;
    email: string;
  };
}

export interface CreateExpenseRequest {
  trip_id: string;
  payer_id: string;
  category_id: number;
  title: string;
  amount: number;
  receipt_url?: string;
  expense_date?: string;
  beneficiary_ids: string[];
}

export interface CreateExpenseResponse {
  id: string;
  trip_id: string;
  payer_id: string;
  category_id: number;
  title: string;
  amount: number;
  receipt_url?: string;
  expense_date: string;
  created_at: string;
  updated_at: string;
}

