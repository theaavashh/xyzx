'use client';

import { useState } from 'react';
import type { Product } from '@/data/products';

interface Review {
  id: number;
  author: string;
  rating: number;
  date: string;
  title: string;
  content: string;
  helpful: number;
  verified: boolean;
  fit: string;
  size: string;
  comfort: number;
  images?: string[];
}

const mockReviews: Review[] = [
  {
    id: 1,
    author: 'Sarah Johnson',
    rating: 5,
    date: '2024-01-15',
    title: 'Perfect fit and amazing quality!',
    content:
      'I absolutely love this hoodie! The material is so soft and comfortable, and the oversized fit is exactly what I was looking for. The cropped length is perfect for high-waisted jeans.',
    helpful: 24,
    verified: true,
    fit: 'True to size',
    size: 'M',
    comfort: 5,
    images: [
      'https://static.nike.com/a/images/t_web_pw_592_v2/f_auto/d708e04e-cfc3-4523-8f49-0d33ee2d6d38/W+NSW+PHNX+FLC+OS+CRP+HNLY+HDY.png',
    ],
  },
  {
    id: 2,
    author: 'Emily Chen',
    rating: 4,
    date: '2024-01-10',
    title: 'Great hoodie, runs slightly large',
    content:
      'Really nice quality and the color is exactly as shown. It does run a bit large, so I would recommend sizing down if you want a more fitted look.',
    helpful: 18,
    verified: true,
    fit: 'Runs large',
    size: 'S',
    comfort: 4,
  },
  {
    id: 3,
    author: 'Jessica Martinez',
    rating: 5,
    date: '2024-01-05',
    title: "Best purchase I've made!",
    content:
      "This is my new favorite hoodie! It's so cozy and stylish. I've already gotten so many compliments on it. Definitely worth the price.",
    helpful: 31,
    verified: true,
    fit: 'True to size',
    size: 'L',
    comfort: 5,
  },
];

interface ProductReviewsProps {
  product: Product;
}

export default function ProductReviews({ product }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoveredComfort, setHoveredComfort] = useState(0);
  const [selectedComfort, setSelectedComfort] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    fit: '',
    size: '',
    name: '',
    email: '',
  });
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  const renderStars = (rating: number, size = 'w-4 h-4') => {
    return [...Array(5)].map((_, i) => (
      <svg
        key={`star-${i}`}
        className={`${size} ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-zinc-600'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (selectedRating === 0) {
      newErrors.rating = 'Please select a rating';
    }
    if (!formData.title.trim()) {
      newErrors.title = 'Please enter a title';
    }
    if (!formData.content.trim()) {
      newErrors.content = 'Please write your review';
    }
    if (formData.content.trim().length < 20) {
      newErrors.content = 'Review must be at least 20 characters';
    }
    if (!formData.fit) {
      newErrors.fit = 'Please select how the item fits';
    }
    if (!formData.size) {
      newErrors.size = 'Please select your size';
    }
    if (!formData.name.trim()) {
      newErrors.name = 'Please enter your name';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const newReview: Review = {
      id: reviews.length + 1,
      author: formData.name,
      rating: selectedRating,
      date: new Date().toISOString().split('T')[0],
      title: formData.title,
      content: formData.content,
      helpful: 0,
      verified: true,
      fit: formData.fit,
      size: formData.size,
      comfort: selectedComfort,
      images: uploadedImages.length > 0 ? uploadedImages : undefined,
    };

    setReviews([newReview, ...reviews]);
    setShowWriteReview(false);
    setSelectedRating(0);
    setSelectedComfort(0);
    setFormData({ title: '', content: '', fit: '', size: '', name: '', email: '' });
    setUploadedImages([]);
    setErrors({});
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages: string[] = [];
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            newImages.push(event.target.result as string);
            if (newImages.length === files.length) {
              setUploadedImages([...uploadedImages, ...newImages]);
            }
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index));
  };

  const fitOptions = ['Runs small', 'True to size', 'Runs large'];

  return (
    <div className="py-12 border-t border-gray-200">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Reviews Summary */}
        <div className="lg:w-1/3">
          <h2 className="swansea text-2xl font-medium text-zinc-600 mb-6 tracking-wide">
            Customer Reviews
          </h2>

          <div className="text-center mb-6">
            <div className="text-4xl font-bold text-zinc-600 mb-2">
              {averageRating.toFixed(1)}
            </div>
            <div className="flex justify-center mb-2">
              {renderStars(averageRating, 'w-5 h-5')}
            </div>
            <p className="text-sm text-zinc-600">
              Based on {reviews.length} reviews
            </p>
          </div>

          {/* Rating Breakdown */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = reviews.filter((r) => r.rating === rating).length;
              const percentage =
                reviews.length > 0 ? (count / reviews.length) * 100 : 0;

              return (
                <div
                  key={`rating-${rating}`}
                  className="flex items-center space-x-2"
                >
                  <span className="text-sm text-zinc-600 w-8">{rating}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-zinc-600 w-8">{count}</span>
                </div>
              );
            })}
          </div>

          {/* Fit Summary */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-zinc-600 mb-3">
              How does it fit?
            </h3>
            <div className="space-y-2">
              {fitOptions.map((fit) => {
                const count = reviews.filter((r) => r.fit === fit).length;
                const percentage =
                  reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                return (
                  <div key={fit} className="flex items-center space-x-2">
                    <span className="text-xs text-zinc-600 flex-1">{fit}</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-gray-600 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-zinc-600 w-6">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Write Review Button */}
          <button
            type="button"
            onClick={() => setShowWriteReview(!showWriteReview)}
            className="w-full mt-6 bg-black text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Write a Review
          </button>
        </div>

        {/* Reviews List */}
        <div className="lg:w-2/3">
          {/* Write Review Form */}
          {showWriteReview && (
            <div className="mb-8 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium text-zinc-600 mb-4">
                Write Your Review
              </h3>
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Overall Rating */}
                <div>
                  <label className="block text-sm font-medium text-zinc-600 mb-2">
                    Overall Rating <span className="text-red-500">*</span>
                  </label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={`rating-star-${star}`}
                        type="button"
                        onMouseEnter={() => setHoveredStar(star)}
                        onMouseLeave={() => setHoveredStar(0)}
                        onClick={() => setSelectedRating(star)}
                        className="w-8 h-8 transition-colors"
                      >
                        <svg
                          className={`w-full h-full ${star <= (hoveredStar || selectedRating) ? 'text-yellow-400' : 'text-zinc-600'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-zinc-600">
                      {selectedRating > 0
                        ? ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][selectedRating - 1]
                        : ''}
                    </span>
                  </div>
                  {errors.rating && (
                    <p className="mt-1 text-sm text-red-600">{errors.rating}</p>
                  )}
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-zinc-600 mb-1">
                    Review Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Summarize your experience"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                  )}
                </div>

                {/* Review Content */}
                <div>
                  <label className="block text-sm font-medium text-zinc-600 mb-1">
                    Your Review <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black ${errors.content ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Share your thoughts about this product. What did you like or dislike?"
                  />
                  <p className="mt-1 text-xs text-zinc-600">
                    {formData.content.length}/500 characters minimum 20
                  </p>
                  {errors.content && (
                    <p className="mt-1 text-sm text-red-600">{errors.content}</p>
                  )}
                </div>

                {/* Fit Selection */}
                <div>
                  <label className="block text-sm font-medium text-zinc-600 mb-2">
                    How does the fit feel? <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {fitOptions.map((fit) => (
                      <button
                        key={fit}
                        type="button"
                        onClick={() => setFormData({ ...formData, fit })}
                        className={`py-2 px-3 border rounded-md text-sm font-medium transition-colors ${
                          formData.fit === fit
                            ? 'border-black bg-black text-white'
                            : 'border-gray-300 text-zinc-600 hover:border-gray-400 hover:bg-gray-50'
                        }`}
                      >
                        {fit}
                      </button>
                    ))}
                  </div>
                  {errors.fit && (
                    <p className="mt-1 text-sm text-red-600">{errors.fit}</p>
                  )}
                </div>

                {/* Size Selection */}
                <div>
                  <label className="block text-sm font-medium text-zinc-600 mb-2">
                    What size did you purchase? <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setFormData({ ...formData, size })}
                        className={`py-2 px-3 border rounded-md text-sm font-medium transition-colors ${
                          formData.size === size
                            ? 'border-black bg-black text-white'
                            : 'border-gray-300 text-zinc-600 hover:border-gray-400 hover:bg-gray-50'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                  {errors.size && (
                    <p className="mt-1 text-sm text-red-600">{errors.size}</p>
                  )}
                </div>

                {/* Comfort Rating */}
                <div>
                  <label className="block text-sm font-medium text-zinc-600 mb-2">
                    Comfort Level
                  </label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={`comfort-star-${star}`}
                        type="button"
                        onMouseEnter={() => setHoveredComfort(star)}
                        onMouseLeave={() => setHoveredComfort(0)}
                        onClick={() => setSelectedComfort(star)}
                        className="w-7 h-7 transition-colors"
                      >
                        <svg
                          className={`w-full h-full ${star <= (hoveredComfort || selectedComfort) ? 'text-yellow-400' : 'text-zinc-600'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-zinc-600">
                      {selectedComfort > 0
                        ? ['Uncomfortable', 'Slightly uncomfortable', 'Okay', 'Comfortable', 'Very comfortable'][selectedComfort - 1]
                        : ''}
                    </span>
                  </div>
                </div>

                {/* Photo Upload */}
                <div>
                  <label className="block text-sm font-medium text-zinc-600 mb-2">
                    Add Photos (optional)
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {uploadedImages.map((img, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={img}
                          alt={`Upload ${index + 1}`}
                          className="w-20 h-20 object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    {uploadedImages.length < 4 && (
                      <label className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <svg
                          className="w-6 h-6 text-zinc-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                      </label>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-zinc-600">
                    Upload up to 4 photos of your purchase
                  </p>
                </div>

                {/* Name and Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-600 mb-1">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Your name"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-600 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="your@email.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex space-x-3 pt-2">
                  <button
                    type="submit"
                    className="bg-black text-white py-2 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                  >
                    Submit Review
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowWriteReview(false);
                      setErrors({});
                    }}
                    className="border border-gray-300 text-zinc-600 py-2 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Sort/Filter Options */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-zinc-600">
              Showing {reviews.length} reviews
            </p>
            <select className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-black">
              <option>Most Recent</option>
              <option>Most Helpful</option>
              <option>Highest Rating</option>
              <option>Lowest Rating</option>
            </select>
          </div>

          {/* Individual Reviews */}
          <div className="space-y-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="border-b border-gray-200 pb-6 last:border-b-0"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-zinc-600">
                        {review.author}
                      </span>
                      {review.verified && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded flex items-center">
                          <svg
                            className="w-3 h-3 mr-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Verified Purchase
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex">{renderStars(review.rating)}</div>
                      <span className="text-sm text-zinc-600">
                        {new Date(review.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                <h4 className="font-medium text-zinc-600 mb-2">
                  {review.title}
                </h4>
                <p className="text-zinc-600 mb-3">{review.content}</p>

                {/* Review Details */}
                <div className="flex flex-wrap gap-4 mb-3 text-sm">
                  <span className="text-zinc-600">
                    <span className="font-medium">Size purchased:</span>{' '}
                    {review.size}
                  </span>
                  <span className="text-zinc-600">
                    <span className="font-medium">Fit:</span> {review.fit}
                  </span>
                  <span className="text-zinc-600 flex items-center">
                    <span className="font-medium">Comfort:</span>{' '}
                    {renderStars(review.comfort, 'w-3 h-3 ml-1')}
                  </span>
                </div>

                {/* Review Images */}
                {review.images && review.images.length > 0 && (
                  <div className="flex gap-2 mb-3">
                    {review.images.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`Review photo ${index + 1}`}
                        className="w-16 h-16 object-cover rounded-md cursor-pointer hover:opacity-75 transition-opacity"
                      />
                    ))}
                  </div>
                )}

                <div className="flex items-center space-x-4 text-sm">
                  <button
                    type="button"
                    className="flex items-center space-x-1 text-zinc-600 hover:text-zinc-600"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                      />
                    </svg>
                    <span>Helpful ({review.helpful})</span>
                  </button>
                  <button
                    type="button"
                    className="text-zinc-600 hover:text-zinc-600"
                  >
                    Report
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
