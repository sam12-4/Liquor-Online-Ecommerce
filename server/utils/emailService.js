const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Log environment variables (password partially hidden for security)
console.log('Email config:', {
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASSWORD ? 'Password exists' : 'Password missing'
});

// Gmail credentials
const EMAIL_USER = process.env.EMAIL_USER || 'sameerh64h@gmail.com';
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD || 'jqeqcjbowjgkuabr';

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD
  }
});

// Verify connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP connection error:', error);
  } else {
    console.log('Server is ready to send emails');
  }
});

/**
 * Send order confirmation email
 * @param {Object} orderData - The order data
 * @returns {Promise} - Promise that resolves when email is sent
 */
const sendOrderConfirmation = async (orderData) => {
  try {
    // Format items for the email
    const itemsList = orderData.items.map(item => 
      `<tr>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">$${(item.salePrice || item.price).toFixed(2)}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">$${((item.salePrice || item.price) * item.quantity).toFixed(2)}</td>
      </tr>`
    ).join('');

    // Email template
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee;">
        <h2 style="color: #333; text-align: center;">Order Confirmation</h2>
        <p>Hello ${orderData.customerInfo.firstName},</p>
        <p>Thank you for your order! We're processing it right now.</p>
        
        <div style="margin: 20px 0; padding: 15px; background-color: #f8f8f8; border-radius: 5px;">
          <h3 style="margin-top: 0; color: #333;">Order Details</h3>
          <p><strong>Order ID:</strong> ${orderData.orderId}</p>
          <p><strong>Date:</strong> ${new Date(orderData.createdAt).toLocaleString()}</p>
          <p><strong>Status:</strong> ${orderData.status}</p>
        </div>
        
        <h3 style="color: #333;">Items Ordered</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f2f2f2;">
              <th style="padding: 10px; text-align: left;">Product</th>
              <th style="padding: 10px; text-align: center;">Qty</th>
              <th style="padding: 10px; text-align: right;">Price</th>
              <th style="padding: 10px; text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsList}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" style="padding: 8px; text-align: right;"><strong>Subtotal:</strong></td>
              <td style="padding: 8px; text-align: right;">$${orderData.subtotal.toFixed(2)}</td>
            </tr>
            <tr>
              <td colspan="3" style="padding: 8px; text-align: right;"><strong>Shipping:</strong></td>
              <td style="padding: 8px; text-align: right;">$${orderData.shippingCost.toFixed(2)}</td>
            </tr>
            <tr>
              <td colspan="3" style="padding: 8px; text-align: right;"><strong>Tax:</strong></td>
              <td style="padding: 8px; text-align: right;">$${orderData.tax.toFixed(2)}</td>
            </tr>
            <tr>
              <td colspan="3" style="padding: 8px; text-align: right;"><strong>Total:</strong></td>
              <td style="padding: 8px; font-weight: bold; text-align: right;">$${orderData.total.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
        
        <div style="margin: 20px 0; padding: 15px; background-color: #f8f8f8; border-radius: 5px;">
          <h3 style="margin-top: 0; color: #333;">Shipping Information</h3>
          <p>${orderData.customerInfo.firstName} ${orderData.customerInfo.lastName}</p>
          <p>${orderData.customerInfo.address.street}</p>
          <p>${orderData.customerInfo.address.city}, ${orderData.customerInfo.address.state} ${orderData.customerInfo.address.zipCode}</p>
          <p>${orderData.customerInfo.address.country}</p>
          <p>Shipping Method: ${orderData.shippingMethod}</p>
        </div>
        
        <p>You can track your order status using your Order ID: <strong>${orderData.orderId}</strong></p>
        <p>If you have any questions about your order, please contact our customer service team.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #777; font-size: 12px;">
          <p>Thank you for shopping with us!</p>
        </div>
      </div>
    `;

    // Mail options
    const mailOptions = {
      from: EMAIL_USER,
      to: orderData.customerInfo.email,
      subject: `Order Confirmation - ${orderData.orderId}`,
      html: htmlContent
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Order confirmation email sent:', info.messageId);
    return info;
    
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    throw error;
  }
};

module.exports = {
  sendOrderConfirmation
}; 