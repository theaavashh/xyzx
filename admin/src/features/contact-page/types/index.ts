export interface ContactPageSettings {
  id: string;
  pageTitle: string | null;
  pageSubtitle: string | null;
  email: string | null;
  phone: string | null;
  subjectOptions: string;
  successTitle: string | null;
  successMessage: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ContactPageFormData = Omit<ContactPageSettings, 'id' | 'createdAt' | 'updatedAt'>;
