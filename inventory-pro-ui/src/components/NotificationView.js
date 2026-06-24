import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NotificationView = () => {
  const [logs, setLogs] = useState([]);
  const [systemAlert, setSystemAlert] = useState('⏳ Establishing proxy link to Notification Instance...');

  useEffect(() => {
    const fetchNotificationLogs = async () => {
      try {
        // 💻 Target the central API Gateway route mapping
        const response = await axios.get('http://localhost:8089/notification/all');

        // Safely validate that the incoming data block payload is a structural array
        const realData = Array.isArray(response.data) ? response.data : [];
        setLogs(realData);

        if (realData.length > 0) {
          setSystemAlert('🟢 Live Sync: Streaming asynchronous message audit events from backend MySQL nodes.');
        } else {
          setSystemAlert('🔔 Connection Stable: Notification cluster is awake, but database log tables are currently empty.');
        }
      } catch (err) {
        console.warn("Notification logs unreachable, displaying local container mock channel.", err);
        setSystemAlert('⚠️ Notification Cluster Node Offline: Displaying sandbox telemetry logs.');

        // Fallback mock telemetry data if service instance is on standby or throwing 404/500
        setLogs([
          { id: 1, type: 'EMAIL', recipient: 'admin@profesh.com', message: 'Inventory alert: SKU low stock threshold triggered.', timestamp: 'Just Now' },
          { id: 2, type: 'SMS', recipient: '+91 98765 43210', message: 'Security Handshake: Auth-Token bypassed for development testing.', timestamp: '5 mins ago' }
        ]);
      }
    };

    fetchNotificationLogs();
  }, []);

  return (
    <div style={{ background: '#1c1c1e', padding: '30px', borderRadius: '12px', border: '1px solid #2c2c2e' }}>
      <h3 style={{ marginTop: 0, color: '#ffffff' }}>Notification Service Dispatch Engine</h3>
      <p style={{ color: '#8e8e93', fontSize: '14px', marginBottom: '25px' }}>
        Manages real-time message broadcasting, logging transactions, and system-wide alert dispatch loops.
      </p>

      <div style={{
        background: systemAlert.includes('🟢') || systemAlert.includes('🔔') ? '#30d15811' : systemAlert.includes('⏳') ? '#0a84ff11' : '#ff9f0a11',
        padding: '15px',
        borderRadius: '8px',
        border: `1px solid ${systemAlert.includes('🟢') || systemAlert.includes('🔔') ? '#30d15844' : systemAlert.includes('⏳') ? '#0a84ff44' : '#ff9f0a44'}`,
        marginBottom: '25px',
        color: systemAlert.includes('🟢') || systemAlert.includes('🔔') ? '#30d158' : systemAlert.includes('⏳') ? '#0a84ff' : '#ff9f0a',
        fontWeight: '500',
        fontSize: '14px'
      }}>
        {systemAlert}
      </div>

      <h4 style={{ color: '#eaeaea', marginBottom: '15px' }}>Dispatched Notification Audit Logs</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {logs.length === 0 ? (
          <p style={{ color: '#8e8e93', fontSize: '14px', fontStyle: 'italic' }}>No dispatch rows recorded.</p>
        ) : (
          logs.map(log => (
            <div key={log.id} style={{ background: '#121212', padding: '15px', borderRadius: '8px', border: '1px solid #2c2c2e', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{
                  fontSize: '11px',
                  background: log.type === 'EMAIL' ? '#0a84ff22' : '#30d15822',
                  color: log.type === 'EMAIL' ? '#0a84ff' : '#30d158',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  marginRight: '10px',
                  fontWeight: 'bold'
                }}>
                  {log.type}
                </span>
                <strong style={{ color: '#fff', fontSize: '14px' }}>{log.recipient}</strong>
                <p style={{ margin: '5px 0 0 0', color: '#8e8e93', fontSize: '13px' }}>{log.message}</p>
              </div>
              <span style={{ color: '#555', fontSize: '12px' }}>{log.timestamp || 'N/A'}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationView;