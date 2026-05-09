import { useEffect, useState } from 'react';
import { subscriptionService, type SubscriptionInfo } from '../services/subscriptionService';
import '../styles/AdminSubscriptions.css';

const AdminSubscriptionsPage = () => {
  const [subscriptions, setSubscriptions] = useState<SubscriptionInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'cancelled'>('all');

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const loadSubscriptions = async () => {
    try {
      setLoading(true);
      const data = await subscriptionService.getSubscriptions();
      setSubscriptions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare la încărcare');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async (id: number) => {
    if (!window.confirm('Ești sigur că vrei să anulezi acest abonament?')) return;

    try {
      await subscriptionService.cancelSubscription(id);
      setSubscriptions((prev) =>
        prev.map((sub) => (sub.id === id ? { ...sub, status: 'cancelled' } : sub))
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Eroare la anulare');
    }
  };

  const filteredSubscriptions = subscriptions.filter((sub) => {
    if (filter === 'all') return true;
    return sub.status === filter;
  });

  const planNames: Record<string, string> = {
    q1: 'Abonament 3 luni',
    q2: 'Abonament 1 an',
    q3: 'Abonament 3 ani',
  };

  if (loading) return <div className="admin-subscriptions">Se încarcă...</div>;

  return (
    <div className="admin-subscriptions">
      <div className="admin-subscriptions-header">
        <h2>Abonamente cumpărate</h2>
        <p>Total: {subscriptions.length} abonamente</p>
      </div>

      {error && <div className="admin-error">{error}</div>}

      <div className="admin-filter">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Toate ({subscriptions.length})
        </button>
        <button
          className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
          onClick={() => setFilter('active')}
        >
          Active ({subscriptions.filter((s) => s.status === 'active').length})
        </button>
        <button
          className={`filter-btn ${filter === 'cancelled' ? 'active' : ''}`}
          onClick={() => setFilter('cancelled')}
        >
          Anulate ({subscriptions.filter((s) => s.status === 'cancelled').length})
        </button>
      </div>

      <div className="admin-subscriptions-table">
        {filteredSubscriptions.length === 0 ? (
          <div className="empty-state">
            <p>Nu sunt abonamente pentru filtrare selectată</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Utilizator</th>
                <th>Email</th>
                <th>Companie</th>
                <th>Plan</th>
                <th>Suma</th>
                <th>Card</th>
                <th>Status</th>
                <th>Data cumpărării</th>
                <th>Expiră pe</th>
                <th>Acțiuni</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubscriptions.map((sub) => (
                <tr key={sub.id}>
                  <td>
                    <strong>{sub.firstName} {sub.lastName}</strong>
                  </td>
                  <td>{sub.email}</td>
                  <td>{sub.companyName}</td>
                  <td>{planNames[sub.planId] || sub.planId}</td>
                  <td className="amount">{sub.amount} MDL</td>
                  <td className="card-number">{sub.cardNumberMasked}</td>
                  <td>
                    <span className={`status-badge status-${sub.status}`}>
                      {sub.status === 'active' ? 'Activ' : 'Anulat'}
                    </span>
                  </td>
                  <td>{new Date(sub.purchaseDate).toLocaleDateString('ro-RO')}</td>
                  <td>{new Date(sub.expirationDate).toLocaleDateString('ro-RO')}</td>
                  <td>
                    {sub.status === 'active' && (
                      <button
                        className="action-btn cancel-btn"
                        onClick={() => handleCancelSubscription(sub.id)}
                        title="Anulează abonament"
                      >
                        ✕ Anulează
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminSubscriptionsPage;


