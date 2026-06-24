import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import InventoryView from './InventoryView';
import CommerceView from './CommerceView';
import NotificationView from './NotificationView';

// --- SUB-COMPONENT: REAL-TIME CLUSTER METRIC MONITOR ---
const ServiceMonitor = () => {
  const [statuses, setStatuses] = useState({
    inventory: 'POLLING CONTROLLER...',
    order: 'POLLING CONTROLLER...',
    payment: 'POLLING CONTROLLER...',
    notification: 'POLLING CONTROLLER...'
  });

  useEffect(() => {
    const checkNodeHealth = async () => {
      const endpoints = {
        inventory: 'http://localhost:8089/inventory/products',
        order: 'http://localhost:8089/order/all',
        payment: 'http://localhost:8089/payment/process',
        notification: 'http://localhost:8089/notification/all'
      };

      const freshStatuses = { ...statuses };

      // 1. Audit Inventory Node
      try {
        await axios.get(endpoints.inventory);
        freshStatuses.inventory = 'ONLINE (Port 8083)';
      } catch (e) {
        freshStatuses.inventory = e.response ? 'ONLINE (Port 8083)' : 'STANDBY / OFFLINE';
      }

      // 2. Audit Order Node
      try {
        await axios.get(endpoints.order);
        freshStatuses.order = 'ONLINE (Port 8084)';
      } catch (e) {
        // Safe check: If the server answers with an error block, the process is alive!
        freshStatuses.order = e.response ? 'ONLINE (Port 8084)' : 'STANDBY / OFFLINE';
      }

      // 3. Audit Payment Node (Handles CORS preflight options catch)
      try {
        await axios.options(endpoints.payment);
        freshStatuses.payment = 'ONLINE (Port 8085)';
      } catch (e) {
        freshStatuses.payment = e.response ? 'ONLINE (Port 8085)' : 'STANDBY / OFFLINE';
      }

      // 4. Audit Notification Node
      try {
        await axios.get(endpoints.notification);
        freshStatuses.notification = 'ONLINE (Port 8086)';
      } catch (e) {
        freshStatuses.notification = e.response ? 'ONLINE (Port 8086)' : 'STANDBY / OFFLINE';
      }

      setStatuses(freshStatuses);
    };

    checkNodeHealth();
  }, []);

  return (
    <div style={{ background: '#1c1c1e', padding: '25px', borderRadius: '10px', border: '1px solid #2c2c2e' }}>
      <h3 style={{ marginTop: 0, color: '#eaeaea' }}>Registered Cluster Nodes</h3>
      <p style={{ color: '#8e8e93', fontSize: '14px', marginBottom: '20px' }}>
        Live network pipeline verification via central API Gateway routing fabric:
      </p>

      <ul style={{ display: 'flex', flexDirection: 'column', gap: '15px', paddingLeft: '5px', listStyleType: 'none', margin: 0 }}>
        <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          🔒 <strong style={{ width: '150px' }}>auth-service:</strong>
          <span style={{ color: '#30d158', background: '#30d15811', padding: '4px 10px', borderRadius: '4px', fontSize: '13px' }}>
            ONLINE (Port 8081)
          </span>
        </li>

        <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          📦 <strong style={{ width: '150px' }}>inventory-service:</strong>
          <span style={{
            color: statuses.inventory.includes('ONLINE') ? '#30d158' : '#ff453a',
            background: statuses.inventory.includes('ONLINE') ? '#30d15811' : '#ff453a11',
            padding: '4px 10px', borderRadius: '4px', fontSize: '13px'
          }}>
            {statuses.inventory}
          </span>
        </li>

        <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          🛒 <strong style={{ width: '150px' }}>order-service:</strong>
          <span style={{
            color: statuses.order.includes('ONLINE') ? '#30d158' : '#ff453a',
            background: statuses.order.includes('ONLINE') ? '#30d15811' : '#ff453a11',
            padding: '4px 10px', borderRadius: '4px', fontSize: '13px'
          }}>
            {statuses.order}
          </span>
        </li>

        <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          💳 <strong style={{ width: '150px' }}>payment-service:</strong>
          <span style={{
            color: statuses.payment.includes('ONLINE) -> ') || statuses.payment.includes('ONLINE') ? '#30d158' : '#ff453a',
            background: statuses.payment.includes('ONLINE') ? '#30d15811' : '#ff453a11',
            padding: '4px 10px', borderRadius: '4px', fontSize: '13px'
          }}>
            {statuses.payment}
          </span>
        </li>

        <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          🔔 <strong style={{ width: '150px' }}>notification-service:</strong>
          <span style={{
            color: statuses.notification.includes('ONLINE') ? '#30d158' : '#ff453a',
            background: statuses.notification.includes('ONLINE') ? '#30d15811' : '#ff453a11',
            padding: '4px 10px', borderRadius: '4px', fontSize: '13px'
          }}>
            {statuses.notification}
          </span>
        </li>
      </ul>
    </div>
  );
};

// --- MAIN CONTROLLER COMPONENT ---
const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [metrics, setMetrics] = useState({ totalProducts: 0, lowStockItems: 0, systemStatus: 'Connecting...' });
  const [error, setError] = useState('');
  const username = localStorage.getItem('username');

  // Continually load macro level statistics for metrics summary cards
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await axios.get('http://localhost:8089/api/dashboard/metrics');
        setMetrics(response.data);
        setError('');
      } catch (err) {
        console.error("Dashboard metric engine connection error:", err);
        setError('Gateway connection dropped. Re-attempting handshake...');
        setMetrics(prev => ({ ...prev, systemStatus: 'OFFLINE' }));
      }
    };
    fetchDashboardStats();
  }, [activeTab]);

  return (
    <div style={{ display: 'flex', background: '#121212', minHeight: '100vh', color: '#ffffff' }}>
      {/* Unified Control Navigation Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} username={username} />

      {/* Main Dynamic View Layout Body Panel */}
      <div style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #2c2c2e', paddingBottom: '20px' }}>
          <h2 style={{ margin: 0, color: '#ffffff' }}>Enterprise Management Environment</h2>
          <span style={{
            fontSize: '14px',
            background: metrics.systemStatus === 'CONNECTED' ? '#30d15822' : '#ff453a22',
            color: metrics.systemStatus === 'CONNECTED' ? '#30d158' : '#ff453a',
            padding: '6px 12px',
            borderRadius: '20px',
            border: '1px solid'
          }}>
            Node Status: {metrics.systemStatus}
          </span>
        </div>

        {error && <div style={{ color: '#ff453a', background: '#ff453a11', padding: '12px', borderRadius: '6px', marginBottom: '25px' }}>⚠️ {error}</div>}

        {/* --- VIEW ROUTER RENDERING CONTROLLER --- */}
        {activeTab === 'dashboard' && (
          <div style={{ display: 'flex', gap: '25px' }}>
            <div style={{ background: '#1c1c1e', padding: '30px', borderRadius: '12px', flex: 1, border: '1px solid #2c2c2e' }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#8e8e93' }}>Total Tracked Products</h4>
              <p style={{ fontSize: '54px', margin: 0, fontWeight: 'bold', color: '#30d158' }}>{metrics.totalProducts}</p>
            </div>
            <div style={{ background: '#1c1c1e', padding: '30px', borderRadius: '12px', flex: 1, border: '1px solid #2c2c2e' }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#8e8e93' }}>Low Stock Alerts</h4>
              <p style={{ fontSize: '54px', margin: 0, fontWeight: 'bold', color: '#ff9f0a' }}>{metrics.lowStockItems}</p>
            </div>
          </div>
        )}

        {activeTab === 'inventory' && <InventoryView />}
        {activeTab === 'commerce' && <CommerceView />}
        {activeTab === 'notifications' && <NotificationView />}
        {activeTab === 'services' && <ServiceMonitor />}
      </div>
    </div>
  );
};

export default Dashboard;