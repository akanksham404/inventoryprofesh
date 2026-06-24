import React from 'react';


const Sidebar = ({ activeTab, setActiveTab, username }) => {
  const menuItems = [
      { id: 'dashboard', label: '📊 Dashboard Workspace' },
      { id: 'inventory', label: '📦 Product Inventory' },
      { id: 'commerce', label: '🛒 Orders & Payments' },
      { id: 'notifications', label: '🔔 Alerts & Notifications' }, // 💻 APPEND THIS NEW ROUTE LINK HERE
      { id: 'services', label: '⚙️ Microservice Monitor' }
    ];

  return (
    <div style={{ width: '260px', background: '#1c1c1e', borderRight: '1px solid #2c2c2e', display: 'flex', flexDirection: 'column', height: '100vh', padding: '20px' }}>
      <div style={{ marginBottom: '30px', paddingBottom: '15px', borderBottom: '1px solid #2c2c2e' }}>
        <h3 style={{ margin: 0, color: '#ffffff', fontSize: '18px' }}>InventoryPro Enterprise</h3>
        <p style={{ margin: '5px 0 0 0', color: '#8e8e93', fontSize: '12px' }}>User: {username || 'System Admin'}</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            style={{
              textAlign: 'left',
              padding: '12px 16px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === item.id ? '#0a84ff' : 'transparent',
              color: activeTab === item.id ? '#ffffff' : '#8e8e93',
              fontSize: '14px',
              fontWeight: activeTab === item.id ? '600' : '400',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div style={{ paddingStyle: 'top', borderTop: '1px solid #2c2c2e', paddingTop: '15px' }}>
        <button
          onClick={() => { localStorage.clear(); window.location.reload(); }}
          style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ff453a', background: 'transparent', color: '#ff453a', cursor: 'pointer' }}
        >
          ↩ Logout Session
        </button>
      </div>
    </div>
  );
};

export default Sidebar;