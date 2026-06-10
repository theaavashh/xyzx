export interface CategoryFormData {
  name: string;
  image: string;
  internalLink: string;
  status: 'active' | 'inactive';
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  disclaimer?: string;
  additionalDetails?: string;
  faqs?: Array<{ question: string; answer: string }>;
}

export const validateCategoryForm = (data: CategoryFormData): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!data.name || data.name.trim().length === 0) {
    errors.name = 'Category name is required';
  } else if (data.name.length < 2) {
    errors.name = 'Category name must be at least 2 characters';
  } else if (data.name.length > 100) {
    errors.name = 'Category name must be less than 100 characters';
  }

  if (data.image) {
    const isValidImage =
      data.image.startsWith('data:image/') ||
      data.image.startsWith('blob:') ||
      data.image.startsWith('http') ||
      data.image.startsWith('https://res.cloudinary.com') ||
      data.image.startsWith('/uploads/');
    if (!isValidImage) {
      errors.image = 'Please provide a valid image URL';
    }
  }

  if (!data.internalLink || data.internalLink.trim() === '') {
    errors.internalLink = 'Internal link is required';
  } else if (
    !data.internalLink.startsWith('/') &&
    !data.internalLink.startsWith('http')
  ) {
    errors.internalLink = 'Internal link must start with /, http, or https';
  }

  if (data.metaTitle && data.metaTitle.length > 60) {
    errors.metaTitle = 'Meta title must be less than 60 characters';
  }

  if (data.metaDescription && data.metaDescription.length > 160) {
    errors.metaDescription = 'Meta description must be less than 160 characters';
  }

  if (data.disclaimer && data.disclaimer.length > 2000) {
    errors.disclaimer = 'Disclaimer must be less than 2000 characters';
  }

  if (data.additionalDetails && data.additionalDetails.length > 5000) {
    errors.additionalDetails = 'Additional details must be less than 5000 characters';
  }

  if (data.faqs) {
    data.faqs.forEach((faq, index) => {
      if (!faq.question || faq.question.trim().length === 0) {
        errors[`faqs.${index}.question`] = 'Question is required';
      } else if (faq.question.length > 500) {
        errors[`faqs.${index}.question`] = 'Question must be less than 500 characters';
      }
      if (!faq.answer || faq.answer.trim().length === 0) {
        errors[`faqs.${index}.answer`] = 'Answer is required';
      } else if (faq.answer.length > 2000) {
        errors[`faqs.${index}.answer`] = 'Answer must be less than 2000 characters';
      }
    });
  }

  return errors;
};
