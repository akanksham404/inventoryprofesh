import React, { useState, useEffect } from 'react';
import axios from 'axios';

const InventoryView = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', stock: '' });
  const [message, setMessage] = useState('');

  // 1. Fetch products list from database via Gateway
  const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8089/inventory/products');
        setProducts(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error("Error reading inventory table data:", err);
      }
    };

    // 2. Correct POST path to match your @PostMapping("/add") inside /inventory
    // Inside src/components/InventoryView.js

      const handleAddProduct = async (e) => {
        e.preventDefault();
        if (!form.name || !form.price || !form.stock) return;

        try {
          // Generate a dynamic unique SKU string so the database constraint is satisfied
          const generatedSku = `PROD-${form.name.slice(0, 3).toUpperCase()}-${Math.floor(Math.random() * 900 + 100)}`;

          // Match your Java Entity field keys exactly
          const payload = {
            name: form.name,
            sku: generatedSku,                // 💻 Required field: matches private String sku;
            category: "General Inventory",     // 💻 Optional field: matches private String category;
            price: parseFloat(form.price),     // 💻 Required field: matches private Double price;
            quantity: parseInt(form.stock),    // 💻 Required field: matches private Integer quantity;
            lowStockThreshold: 5              // 💻 Required field: matches private Integer lowStockThreshold;
          };

          console.log("Sending clean data block payload to inventory-service:", payload);

          await axios.post('http://localhost:8089/inventory/add', payload);

          setMessage('✅ Product successfully added to live MySQL tables!');
          setForm({ name: '', price: '', stock: '' });
          fetchProducts(); // Refresh the list view grid automatically
        } catch (err) {
          console.error("Payload insertion failed. Server log status:", err.response);
          setMessage('❌ Failed to inject record into backend microservice.');
        }
      };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', width: '100%' }}>
      {/* Dynamic Entry Form Section */}
      <div style={{ background: '#1c1c1e', padding: '25px', borderRadius: '10px', border: '1px solid #2c2c2e' }}>
        <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#eaeaea' }}>Add New Product Entry</h3>
        {message && <p style={{ color: message.includes('✅') ? '#30d158' : '#ff453a', fontSize: '14px' }}>{message}</p>}

        <form onSubmit={handleAddProduct} style={{ display: 'flex', gap: '15px', alignItems: 'flex-end' }}>
          <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ color: '#8e8e93', fontSize: '12px' }}>Product Title</label>
            <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #3a3a3c', background: '#2c2c2e', color: '#fff' }} placeholder="e.g., Enterprise Server Rack" />
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ color: '#8e8e93', fontSize: '12px' }}>Unit Price ($)</label>
            <input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #3a3a3c', background: '#2c2c2e', color: '#fff' }} placeholder="0.00" />
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ color: '#8e8e93', fontSize: '12px' }}>Initial Stock Qty</label>
            <input type="number" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #3a3a3c', background: '#2c2c2e', color: '#fff' }} placeholder="0" />
          </div>
          <button type="submit" style={{ padding: '11px 24px', borderRadius: '6px', border: 'none', background: '#30d158', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>Save Row</button>
        </form>
      </div>

      {/* Real-Time Database Rows Grid Table */}
      <div style={{ background: '#1c1c1e', padding: '25px', borderRadius: '10px', border: '1px solid #2c2c2e' }}>
        <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#eaeaea' }}>Live Database Data Catalog</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #2c2c2e', color: '#8e8e93' }}>
              <th style={{ padding: '12px' }}>ID</th>
              <th style={{ padding: '12px' }}>Product Name</th>
              <th style={{ padding: '12px' }}>Unit Value</th>
              <th style={{ padding: '12px' }}>Stock Balance</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr><td colSpan="4" style={{ padding: '20px', textAlignment: 'center', color: '#555' }}>No active records found inside database schema tables.</td></tr>
            ) : (
              products.map((p, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #2c2c2e', color: '#fff' }}>
                  <td style={{ padding: '12px', color: '#8e8e93' }}>{p.id || index + 1}</td>
                  <td style={{ padding: '12px', fontWeight: '500' }}>{p.name}</td>
                  <td style={{ padding: '12px', color: '#30d158' }}>${p.price?.toFixed(2)}</td>
                  <td style={{ padding: '12px' }}>{p.quantity} units</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryView;