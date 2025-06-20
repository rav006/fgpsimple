"use client";
// Admin page to view and manage quote/contact inquiries
import { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { TextField, Paper, Typography } from '@mui/material';
import ButtonMui from '@mui/material/Button';

interface Inquiry {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  message: string;
  isQuoteRequest: boolean;
  createdAt: string;
}

interface Review {
  id: number;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export default function UsurperAdminPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [editingInquiry, setEditingInquiry] = useState<Inquiry | null>(null);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [editForm, setEditForm] = useState<Partial<Inquiry & Review>>({});
  const [editType, setEditType] = useState<'inquiry' | 'review' | null>(null);
  const [editError, setEditError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch('/api/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (res.ok) {
        setIsAuthenticated(true);
      } else {
        const data = await res.json();
        setLoginError(data.error || 'Login failed');
      }
    } catch {
      setLoginError('Network error');
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    fetch('/api/usurper')
      .then(res => res.json())
      .then(data => {
        setInquiries(data.inquiries || []);
        setLoading(false);
      });
    fetch('/api/usurper/reviews')
      .then(res => res.json())
      .then(data => {
        setReviews(data.reviews || []);
        setLoadingReviews(false);
      });
  }, [isAuthenticated]);

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this inquiry?')) return;
    const res = await fetch(`/api/usurper?id=${id}`, { method: 'DELETE' });
    if (res.ok) setInquiries(inquiries.filter(i => i.id !== id));
  };

  const handleDeleteReview = async (id: number) => {
    if (!confirm('Delete this review?')) return;
    const res = await fetch(`/api/usurper/reviews?id=${id}`, { method: 'DELETE' });
    if (res.ok) setReviews(reviews.filter(r => r.id !== id));
  };

  const handleEditInquiry = (inquiry: Inquiry) => {
    setEditingInquiry(inquiry);
    setEditForm({ ...inquiry });
    setEditType('inquiry');
    setEditError('');
  };
  const handleEditReview = (review: Review) => {
    setEditingReview(review);
    setEditForm({ ...review });
    setEditType('review');
    setEditError('');
  };
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };
  const handleEditSave = async () => {
    setEditError('');
    if (editType === 'inquiry' && editingInquiry) {
      // Update inquiry
      const res = await fetch(`/api/usurper?id=${editingInquiry.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      if (res.ok) {
        setInquiries(inquiries.map(i => i.id === editingInquiry.id ? { ...i, ...editForm } : i));
        setEditingInquiry(null);
        setEditType(null);
      } else {
        setEditError('Failed to update inquiry');
      }
    } else if (editType === 'review' && editingReview) {
      // Update review
      const res = await fetch(`/api/usurper/reviews?id=${editingReview.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      if (res.ok) {
        setReviews(reviews.map(r => r.id === editingReview.id ? { ...r, ...editForm } : r));
        setEditingReview(null);
        setEditType(null);
      } else {
        setEditError('Failed to update review');
      }
    }
  };
  const handleEditCancel = () => {
    setEditingInquiry(null);
    setEditingReview(null);
    setEditType(null);
    setEditError('');
  };

  const editInquiryBodyTemplate = (rowData: Inquiry) => (
    <Button icon="pi pi-pencil" className="p-button-text" onClick={() => handleEditInquiry(rowData)} tooltip="Edit" />
  );
  const deleteInquiryBodyTemplate = (rowData: Inquiry) => (
    <Button icon="pi pi-trash" className="p-button-danger p-button-text" onClick={() => handleDelete(rowData.id)} tooltip="Delete" />
  );
  const editReviewBodyTemplate = (rowData: Review) => (
    <Button icon="pi pi-pencil" className="p-button-text" onClick={() => handleEditReview(rowData)} tooltip="Edit" />
  );
  const deleteReviewBodyTemplate = (rowData: Review) => (
    <Button icon="pi pi-trash" className="p-button-danger p-button-text" onClick={() => handleDeleteReview(rowData.id)} tooltip="Delete" />
  );

  if (!isAuthenticated) {
    return (
      <>
        <Paper elevation={3} sx={{ maxWidth: 340, mx: 'auto', mt: 8, p: 4 }}>
          <Typography variant="h6" gutterBottom>Admin Login</Typography>
          <form onSubmit={handleLogin}>
            <TextField
              label="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              fullWidth
              margin="normal"
              autoComplete="username"
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              fullWidth
              margin="normal"
              autoComplete="current-password"
            />
            {loginError && <Typography color="error" variant="body2">{loginError}</Typography>}
            <ButtonMui type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>Login</ButtonMui>
          </form>
        </Paper>
      </>
    );
  }

  return (
    <>
      <div className="p-4">
        <h1>Quote & Contact Inquiries</h1>
        <DataTable value={inquiries} loading={loading} paginator rows={10} responsiveLayout="scroll" dataKey="id" emptyMessage="No inquiries found.">
          <Column field="id" header="ID" sortable style={{ width: '60px' }} />
          <Column field="name" header="Name" sortable />
          <Column field="email" header="Email" sortable />
          <Column field="phone" header="Phone" />
          <Column field="message" header="Message" style={{ maxWidth: '300px', wordBreak: 'break-word' }} />
          <Column field="isQuoteRequest" header="Quote?" body={rowData => rowData.isQuoteRequest ? 'Yes' : 'No'} style={{ width: '80px' }} />
          <Column field="createdAt" header="Created" body={rowData => new Date(rowData.createdAt).toLocaleString()} sortable />
          <Column body={editInquiryBodyTemplate} header="Edit" style={{ width: '80px' }} />
          <Column body={deleteInquiryBodyTemplate} header="Delete" style={{ width: '80px' }} />
        </DataTable>
        <h2 className="p-mt-5">Ratings & Reviews</h2>
        <DataTable value={reviews} loading={loadingReviews} paginator rows={10} responsiveLayout="scroll" dataKey="id" emptyMessage="No reviews found.">
          <Column field="id" header="ID" style={{ width: '60px' }} />
          <Column field="name" header="Name" />
          <Column field="rating" header="Rating" body={rowData => '★'.repeat(rowData.rating)} style={{ width: '120px' }} />
          <Column field="comment" header="Comment" />
          <Column field="createdAt" header="Created" body={rowData => new Date(rowData.createdAt).toLocaleString()} />
          <Column body={editReviewBodyTemplate} header="Edit" style={{ width: '80px' }} />
          <Column body={deleteReviewBodyTemplate} header="Delete" style={{ width: '80px' }} />
        </DataTable>
        {(editingInquiry || editingReview) && (
          <Paper elevation={4} sx={{ maxWidth: 400, mx: 'auto', mt: 4, p: 3 }}>
            <Typography variant="h6" gutterBottom>Edit {editType === 'inquiry' ? 'Inquiry' : 'Review'}</Typography>
            {editType === 'inquiry' && (
              <>
                <TextField label="Name" name="name" value={editForm.name || ''} onChange={handleEditChange} fullWidth margin="normal" />
                <TextField label="Email" name="email" value={editForm.email || ''} onChange={handleEditChange} fullWidth margin="normal" />
                <TextField label="Phone" name="phone" value={editForm.phone || ''} onChange={handleEditChange} fullWidth margin="normal" />
                <TextField label="Message" name="message" value={editForm.message || ''} onChange={handleEditChange} fullWidth margin="normal" multiline rows={3} />
              </>
            )}
            {editType === 'review' && (
              <>
                <TextField label="Name" name="name" value={editForm.name || ''} onChange={handleEditChange} fullWidth margin="normal" />
                <TextField label="Rating" name="rating" type="number" value={editForm.rating || ''} onChange={handleEditChange} fullWidth margin="normal" inputProps={{ min: 1, max: 5 }} />
                <TextField label="Comment" name="comment" value={editForm.comment || ''} onChange={handleEditChange} fullWidth margin="normal" multiline rows={3} />
              </>
            )}
            {editError && <Typography color="error" variant="body2">{editError}</Typography>}
            <ButtonMui onClick={handleEditSave} variant="contained" color="primary" sx={{ mt: 2, mr: 1 }}>Save</ButtonMui>
            <ButtonMui onClick={handleEditCancel} variant="outlined" color="secondary" sx={{ mt: 2 }}>Cancel</ButtonMui>
          </Paper>
        )}
      </div>
    </>
  );
}
