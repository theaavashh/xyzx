'use client';

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { FAQItem } from '../types';

const faqSchema = z.object({
  question: z.string().min(1, 'Question is required'),
  answer: z.string().min(1, 'Answer is required'),
  category: z.string().min(1, 'Category is required'),
  order: z
    .number({ message: 'Order must be a number' })
    .min(0, 'Order must be 0 or greater'),
  isActive: z.boolean(),
});

type FAQFormValues = z.infer<typeof faqSchema>;

interface FAQFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  faq?: FAQItem | null;
  onSubmit: (payload: Partial<FAQItem>) => Promise<void>;
  isSubmitting: boolean;
}

export function FAQFormModal({ isOpen, onClose, faq, onSubmit, isSubmitting }: FAQFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FAQFormValues>({
    resolver: zodResolver(faqSchema),
    defaultValues: {
      question: '',
      answer: '',
      category: '',
      order: 0,
      isActive: true,
    },
  });

  useEffect(() => {
    if (!isOpen) return;
    if (faq) {
      reset({
        question: faq.question,
        answer: faq.answer,
        category: faq.category,
        order: faq.order,
        isActive: faq.isActive,
      });
    } else {
      reset({
        question: '',
        answer: '',
        category: '',
        order: 0,
        isActive: true,
      });
    }
  }, [faq, isOpen, reset]);

  const onValid = async (data: FAQFormValues) => {
    await onSubmit(data);
  };

  const inputBase =
    'w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none text-black placeholder:text-gray-400';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-black">
                {faq ? 'Edit FAQ' : 'Create FAQ'}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="text-gray-400 hover:text-black focus:outline-none focus:ring-2 focus:ring-[#D4AF37] rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onValid)} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
                <textarea
                  {...register('question')}
                  placeholder="Enter the FAQ question"
                  rows={2}
                  className={`${inputBase} resize-none ${errors.question ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.question && (
                  <p className="mt-1 text-xs text-red-500">{errors.question.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Answer</label>
                <textarea
                  {...register('answer')}
                  placeholder="Enter the FAQ answer"
                  rows={4}
                  className={`${inputBase} resize-none ${errors.answer ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.answer && (
                  <p className="mt-1 text-xs text-red-500">{errors.answer.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input
                  type="text"
                  {...register('category')}
                  placeholder="e.g. Shipping, Orders, Returns"
                  className={`${inputBase} ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.category && (
                  <p className="mt-1 text-xs text-red-500">{errors.category.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                <input
                  type="number"
                  {...register('order', { valueAsNumber: true })}
                  min={0}
                  className={`${inputBase} ${errors.order ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.order && (
                  <p className="mt-1 text-xs text-red-500">{errors.order.message}</p>
                )}
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    watch('isActive') ? 'bg-[#D4AF37]' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                      watch('isActive') ? 'translate-x-5' : ''
                    }`}
                  />
                </div>
                <input type="checkbox" {...register('isActive')} className="sr-only" />
                <span className="text-sm text-gray-700">Active</span>
              </label>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 text-black bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2.5 bg-[#D4AF37] text-white rounded-md hover:bg-[#b8962e] disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-sm flex items-center gap-2"
                >
                  {isSubmitting ? 'Saving...' : faq ? 'Update FAQ' : 'Create FAQ'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
