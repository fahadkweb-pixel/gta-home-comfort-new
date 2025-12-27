import * as React from 'react';

// STYLES
const main = {
  fontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif',
  backgroundColor: '#ffffff',
};
const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  width: '580px',
};
const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  paddingBottom: '10px',
  borderBottom: '1px solid #eee',
};
const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '24px',
};
const button = {
  backgroundColor: '#f43f5e', // Your Rose-500 color
  borderRadius: '5px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center',
  display: 'inline-block',
  width: '100%',
  padding: '12px 0',
  marginTop: '20px',
};

// 1. ADMIN NOTIFICATION EMAIL
export const AdminEmail = ({ data }) => (
  <div style={main}>
    <div style={container}>
      <h1 style={h1}>New SmartQuote Lead</h1>
      <p style={text}>
        <strong>Name:</strong> {data.name}
      </p>
      <p style={text}>
        <strong>Phone:</strong> <a href={`tel:${data.phone}`}>{data.phone}</a>
      </p>
      <p style={text}>
        <strong>Email:</strong> <a href={`mailto:${data.email}`}>{data.email}</a>
      </p>
      <p style={text}>
        <strong>Address:</strong> {data.address}
      </p>

      <hr style={{ borderColor: '#eee', margin: '20px 0' }} />

      <h2 style={{ fontSize: '18px', color: '#666' }}>System Details</h2>
      <p style={text}>
        <strong>Category:</strong> {data.category}
      </p>
      <p style={text}>
        <strong>Issue/Goal:</strong>{' '}
        {Array.isArray(data.issue) ? data.issue.join(', ') : data.issueLabel}
      </p>
      <p style={text}>
        <strong>System:</strong> {Array.isArray(data.system) ? data.system.join(', ') : data.system}
      </p>
      <p style={text}>
        <strong>Equip Age:</strong> {data.systemAgeApprox || data.existingAge}
      </p>

      <h2 style={{ fontSize: '18px', color: '#666' }}>Access & Context</h2>
      <p style={text}>
        <strong>Location:</strong> {data.accessLocation}
      </p>
      <p style={text}>
        <strong>Status:</strong> {data.ownerOrTenant}
      </p>
      <p style={text}>
        <strong>Priority:</strong> {data.priority || 'Normal'}
      </p>
    </div>
  </div>
);

// 2. CUSTOMER CONFIRMATION EMAIL
export const CustomerEmail = ({ data }) => (
  <div style={main}>
    <div style={container}>
      <h1 style={h1}>We received your request.</h1>
      <p style={text}>Hi {data.name.split(' ')[0]},</p>
      <p style={text}>
        Thanks for reaching out to GTA Home Comfort. We have received your details regarding your{' '}
        <strong>{data.category.toLowerCase()}</strong> needs.
      </p>
      <p style={text}>
        <strong>Next Step:</strong> If you haven't already booked a time on our calendar, please
        click the button below to secure your spot.
      </p>

      <a href='https://calendly.com/gtahomecomfort-info/30min' style={button}>
        Book Appointment Now
      </a>

      <p style={{ ...text, fontSize: '14px', color: '#666', marginTop: '30px' }}>
        <strong>Your Details:</strong>
        <br />
        Service Address: {data.address}
        <br />
        Phone: {data.phone}
      </p>

      <p style={{ ...text, fontSize: '12px', color: '#999', marginTop: '40px' }}>
        GTA Home Comfort | 416-678-2131 | info@gtahomecomfort.com
      </p>
    </div>
  </div>
);
