import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createExpense, uploadReceiptImage } from '@/services/expense.service';
import type { CreateExpenseFormData } from '@/schemas/expense.schema';
import type { CreateExpenseRequest } from '@/types/expense.types';

interface UseExpenseFormOptions {
  tripId: string;
  onSuccess?: () => void;
  onSuccessMessage?: (message: string) => void;
}

/**
 * Hook for expense form management
 * Handles image upload, expense creation, errors and loading states
 */
export function useExpenseForm({ tripId, onSuccess, onSuccessMessage }: UseExpenseFormOptions) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const submitExpense = async (data: CreateExpenseFormData & { receiptFile?: File | null }) => {
    setIsLoading(true);
    setError(null);

    try {
      let receiptUrl: string | undefined;

      // Upload image first if provided
      if (data.receiptFile) {
        try {
          const uploadResult = await uploadReceiptImage(data.receiptFile);
          receiptUrl = uploadResult.url;
        } catch (uploadError: any) {
          // If upload fails, continue without image
          console.warn('Failed to upload image:', uploadError);
          // Don't block expense creation if image upload fails
        }
      }

      // Create expense request
      const expenseData: CreateExpenseRequest = {
        trip_id: tripId,
        payer_id: data.payer_id,
        category_id: data.category_id,
        title: data.title,
        amount: data.amount,
        beneficiary_ids: data.beneficiary_ids,
        receipt_url: receiptUrl,
        expense_date: data.expense_date || new Date().toISOString().split('T')[0],
      };

      await createExpense(expenseData);

      // Success - show feedback
      const successMessage = 'Gasto creado exitosamente';
      if (onSuccessMessage) {
        onSuccessMessage(successMessage);
      }
      
      // Delay to ensure user sees the success state and can read the toast
      // Toast duration is 3500ms, so we wait a bit longer to allow reading
      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        } else {
          // Default: navigate back to trip detail
          navigate(`/trips/${tripId}`);
        }
      }, 1000);
    } catch (err: any) {
      const errorMessage = err?.message || 'Error al crear el gasto';
      setError(errorMessage);
      throw err; // Re-throw to let form handle it
    } finally {
      setIsLoading(false);
    }
  };

  return {
    submitExpense,
    isLoading,
    error,
  };
}

