// Admin page to view and manage quote/contact inquiries
'use client';
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

export default function UsurperAdminPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

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
  }, [isAuthenticated]);

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this inquiry?')) return;
    const res = await fetch(`/api/usurper?id=${id}`, { method: 'DELETE' });
    if (res.ok) setInquiries(inquiries.filter(i => i.id !== id));
  };

  const deleteBodyTemplate = (rowData: Inquiry) => (
    <Button icon="pi pi-trash" className="p-button-danger p-button-text" onClick={() => handleDelete(rowData.id)} tooltip="Delete" />
  );

  if (!isAuthenticated) {
    return (
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
    );
  }

  return (
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
        <Column body={deleteBodyTemplate} header="Delete" style={{ width: '80px' }} />
      </DataTable>
    </div>
  );
}
