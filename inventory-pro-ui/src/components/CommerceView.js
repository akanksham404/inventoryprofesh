import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CommerceView = () => {
  const [products, setProducts] = useState([]);
  const [selectedSku, setSelectedSku] = useState(''); // 💻 TRACK SKU INSTEAD OF ID
  const [quantity, setQuantity] = useState(1);
  const [checkoutStatus, setCheckoutStatus] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch product catalog parameters from MySQL via the Gateway
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await axios.get('http://localhost:8089/inventory/products');
        const productList = Array.isArray(response.data) ? response.data : [];
        setProducts(productList);

        // Default to the first product's SKU if records exist
        if (productList.length > 0) {
          setSelectedSku(productList[0].sku);
        }
      } catch (err) {
        console.error("Failed to fetch product selection parameters:", err);
      }
    };
    fetchInventory();
  }, []);

  const handleProcessTransaction = async (e) => {
    e.preventDefault();
    if (!selectedSku) return;

    setLoading(true);
    setCheckoutStatus('⏳ Step 1: Dispatched transaction payload to Order Engine...');

    try {
      // 💻 ALIGNED PAYLOAD: Matches private String sku and private Integer quantity inside Order.java
      const orderPayload = {
        sku: selectedSku,
        quantity: parseInt(quantity)
      };

      console.log("Sending order request block:", orderPayload);
      const orderResponse = await axios.post('http://localhost:8089/order/place', orderPayload);
      console.log("Order Engine Response Data:", orderResponse.data);

      // Extract your true Order ID and Total Price returned from your backend
      const savedOrderId = orderResponse.data.id;
      const calculatedTotalPrice = orderResponse.data.totalPrice || 0.00;

      setCheckoutStatus(`📦 Step 2: Order #${savedOrderId} registered! Routing $${calculatedTotalPrice} to Payment Gateway...`);

      try {
        // 💻 ALIGNED PAYLOAD: Matches orderId and amount variables inside Payment.java
        const paymentPayload = {
          orderId: savedOrderId,
          amount: calculatedTotalPrice
        };

        console.log("Sending payment request block:", paymentPayload);
        const paymentResponse = await axios.post('http://localhost:8089/payment/process', paymentPayload);

        setCheckoutStatus(`✅ Success! Order #${savedOrderId} processed. Status: ${paymentResponse.data.paymentStatus || 'SUCCESS'} | Txn Ref: ${paymentResponse.data.transactionId || 'TXN-APPROVED'}`);

      } catch (paymentErr) {
        console.warn("Payment node unreachable or failed:", paymentErr);
        setCheckoutStatus(`⚠️ Order #${savedOrderId} was SAVED in MySQL, but payment-service rejected or missed the sync.`);
      }

    } catch (orderErr) {
      console.error("Order pipeline failed:", orderErr.response || orderErr);
      setCheckoutStatus('❌ Cluster Node Timeout: Microservice instances are sitting on STANDBY mode.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#1c1c1e', padding: '30px', borderRadius: '12px', border: '1px solid #2c2c2e' }}>
      <h3 style={{ marginTop: 0, color: '#ffffff' }}>Enterprise Order & Payment Terminal</h3>
      <p style={{ color: '#8e8e93', fontSize: '14px', marginBottom: '25px' }}>
        Dispatches contextual synchronous data payloads downstream through <code>order-service</code> and <code>payment-service</code> cluster containers.
      </p>

      <form onSubmit={handleProcessTransaction} style={{ maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ color: '#8e8e93', fontSize: '12px' }}>Select Live Database Product Target</label>
          <select
            value={selectedSku}
            onChange={e => setSelectedSku(e.target.value)}
            style={{ padding: '12px', borderRadius: '8px', background: '#2c2c2e', color: '#fff', border: '1px solid #3a3a3c' }}
          >
            {products.length === 0 ? (
              <option value="">No product records found in MySQL</option>
            ) : (
              products.map(p => <option key={p.id} value={p.sku}>{p.name} (SKU: {p.sku} | ${p.price})</option>)
            )}
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ color: '#8e8e93', fontSize: '12px' }}>Transaction Volume (Quantity)</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={e => setQuantity(e.target.value)}
            style={{ padding: '12px', borderRadius: '8px', background: '#2c2c2e', color: '#fff', border: '1px solid #3a3a3c' }}
          />
        </div>

        <button
          type="submit"
          disabled={loading || products.length === 0}
          style={{ padding: '14px', borderRadius: '8px', border: 'none', background: products.length === 0 ? '#3a3a3c' : '#0a84ff', color: '#fff', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer' }}
        >
          {loading ? 'Processing System Pipeline...' : 'Execute Order Checkout Sequence'}
        </button>
      </form>

      {checkoutStatus && (
        <div style={{ marginTop: '25px', padding: '15px', borderRadius: '8px', background: '#2c2c2e', border: '1px solid #3a3a3c', fontFamily: 'Courier New, monospace', fontSize: '13px', color: checkoutStatus.includes('❌') ? '#ff453a' : checkoutStatus.includes('✅') ? '#30d158' : '#0a84ff' }}>
          {checkoutStatus}
        </div>
      )}
    </div>
  );
};

export default CommerceView;