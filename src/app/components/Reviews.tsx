"use client";
import { useEffect, useState } from 'react';

interface Review {
  id: number;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [form, setForm] = useState({ name: '', rating: 5, comment: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/reviews')
      .then((res) => res.json())
      .then(setReviews);
  }, [success]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === 'rating' ? Number(value) : value }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, rating: Number(e.target.value) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || 'Failed to submit review.');
      } else {
        setForm({ name: '', rating: 5, comment: '' });
        setSuccess(true);
      }
    } catch {
      setError('Failed to submit review.');
    }
    setLoading(false);
  };

  return (
    <section className="max-w-2xl mx-auto my-12 p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">Customer Reviews</h2>
      <form onSubmit={handleSubmit} className="mb-8 flex flex-col gap-4">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Your Name"
          required
          className="border rounded px-3 py-2 text-gray-900"
        />
        <label htmlFor="rating" className="sr-only">Rating</label>
        <select
          id="rating"
          name="rating"
          value={form.rating}
          onChange={handleSelectChange}
          className="border rounded px-3 py-2 text-gray-900"
        >
          {[5,4,3,2,1].map((n) => (
            <option key={n} value={n}>
              {"⭐".repeat(n)}{"☆".repeat(5 - n)}
            </option>
          ))}
        </select>
        <textarea
          name="comment"
          value={form.comment}
          onChange={handleChange}
          placeholder="Your review..."
          required
          minLength={5}
          className="border rounded px-3 py-2 text-gray-900"
        />
        <button
          type="submit"
          className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
        {error && <p className="text-red-600">{error}</p>}
        {success && <p className="text-green-600">Thank you for your review!</p>}
      </form>
      <div className="space-y-6">
        {reviews.length === 0 && <p className="text-gray-700 font-medium">No reviews yet. Be the first to leave one!</p>}
        {reviews.map((r) => (
          <div key={r.id} className="border-b pb-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold">{r.name}</span>
              <span className="text-yellow-500">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
              <span className="text-xs text-gray-700 ml-auto">{new Date(r.createdAt).toLocaleDateString()}</span>
            </div>
            <p className="text-gray-700">{r.comment}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
