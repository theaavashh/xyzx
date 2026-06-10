import { redirect } from 'next/navigation';

// This page redirects to show all products
export default function ProductsPage() {
  redirect('/products/all');
}
