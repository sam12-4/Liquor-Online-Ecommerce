import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AnimatedSection from '../components/home/AnimatedSection';

// Import banner images
import bannerImg from '../assets/images/Banner4.png';

import bottleimages from '../assets/images/Special-Orders-2023.jpg';

const SpecialOrdersPage = () => {
  useEffect(() => {
    document.title = 'Special Orders - Liquor Online';
  }, []);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    province: '',
    birthdate: '',
    productName: '',
    manufacturer: '',
    bottleCount: '',
    bottleSize: '',
    alcoholPercent: '',
    upcCode: '',
    additionalComments: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Here you would typically send the form data to a server
    alert('Your special order request has been submitted. We will contact you shortly.');
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      city: '',
      province: '',
      birthdate: '',
      productName: '',
      manufacturer: '',
      bottleCount: '',
      bottleSize: '',
      alcoholPercent: '',
      upcCode: '',
      additionalComments: ''
    });
  };

  return (
    <div>
      {/* Hero Banner */}
      <div className="relative bg-black flex items-center justify-center overflow-hidden h-60">
        <div className="absolute inset-0">
          <img
            src={bannerImg}
            alt="Special Orders Banner"
            className="relative h-[300px] md:h-[250px] md:w-[100%] w-full overflow-hidden bg-center bg-cover bg-no-repeat"
          />
        </div>
        <div className="relative z-10 text-center font-['Marcellus',_serif]">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 font-['Marcellus',_serif]">
            Special Orders
          </h1>
          <div className="flex items-center justify-center text-white/80 font-['Marcellus',_serif]">
            <Link to="/" className="hover:text-white font-['Marcellus',_serif]">Home</Link>
            <span className="mx-2">›</span>
            <span className="font-medium text-white font-['Marcellus',_serif]">Special Orders</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        {/* Row of Special Bottles */}
        <div className="mb-10 pt-5 flex justify-center">
          <img 
            src={bottleimages} 
            alt="Premium Liquor Bottles" 
            className="max-w-full h-auto" 
          />
        </div>

        <div className="max-w-6xl mx-auto font-['Marcellus',_serif]">
          <h2 className="text-2xl font-medium text-black mb-2">SPECIAL ORDERS</h2>
          
          <p className="text-sm text-gray-700 mb-8 leading-relaxed">
          Liquor Online has an extensive selection of Products from around the World. This includes Special Allocations, Limited Editions, Rare & Exceptional, Vintage, Celebrity Spirits, plus many more. Our Special Order Service is offered to the general public and Licensees who have requests for products which any not be currently available in Alberta Liquor stores. Special Terms & Conditions will apply to these Orders, and all details will be fully disclosed prior to Ordering.
          </p>

          <div className="space-y-6 mb-10">
            {/* Question 1 */}
            <div>
              <h3 className="text-2xl font-medium text-black mb-2">How can I place a Special Order?</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
              All Special Orders can be placed by filling in the Form provided below.  Information such as the Product Name, bottle size, Supplier Name along with any other pertinent information will be very helpful.
              </p>
            </div>

            {/* Question 2 */}
            <div>
              <h3 className="text-2xl font-medium text-black mb-2">Is a Deposit required?</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
              Yes, if we can source your Product(s) a 35% deposit is required at the time the Special Order is made.
              </p>
            </div>

            {/* Question 3 */}
            <div>
              <h3 className="text-2xl font-medium text-black mb-2">Is there a Minimum Order Quantity?</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
              Yes, the Minimum Order Quantity is usually one case, but sometimes Suppliers or Manufacturers may impose a higher minimum order quantity. In some cases especially for Rare and Limited Editions, 1 Bottle (or more) may be available. You will be notified if there is a supplier minimum order quantity and you will have the option to continue with the Order or cancel the request.
              </p>
            </div>

            {/* Question 4 */}
            <div>
              <h3 className="text-2xl font-medium text-black mb-2">How long will my Products take to Arrive?</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
              For products available in Canada it will take approximately 2-8 weeks to receive the Order, but International Orders may take longer. Some Orders May fill in 1-3 days depending on availability.
              </p>
            </div>

            {/* Question 5 */}
            <div>
              <h3 className="text-2xl font-medium text-black mb-2">Cost</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
              Liquor Online will provide each Customer a Quote for the cost of the Special Order after availability has been confirmed by the Supplier or Manufacturer. Total cost will include shipping & delivery, duty, exchange rates, bottle deposit, Insurance and all applicable taxes. Depending on the final cost, customers may be required to make a minimum 35% deposit of the final price of the Special Order before the order can be placed. Liquor Online reserves the right to change the deposit requirements at any time. Once the Special Order is received, Liquor Online will notify the Customer and make arrangements for Pick Up or Delivery.
              </p>
            </div>
          </div>

          
        </div>
        {/* Special Order Form */}
        <div id="special-order-form" className="mb-10 max-w-6xl mx-auto">
        <div className='max-w-3xl'>
          <h2 className="text-[#78CAEA] text-2xl font-medium mb-8">Special Order Request Form</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Personal Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8  my-3">
              <div>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                  className="w-full p-2 border border-gray-300"
                  required
                />
              </div>
              <div>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                  className="w-full p-2 border border-gray-300"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8  my-3">
              <div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your eMail"
                  className="w-full p-2 border border-gray-300"
                  required
                />
              </div>
              <div>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Your Phone"
                  className="w-full p-2 border border-gray-300"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8  my-3">
              <div>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city || ''}
                  onChange={handleChange}
                  placeholder="Your City"
                  className="w-full p-2 border border-gray-300"
                />
              </div>
              <div>
                <input
                  type="text"
                  id="province"
                  name="province"
                  value={formData.province || ''}
                  onChange={handleChange}
                  placeholder="Province/State"
                  className="w-full p-2 border border-gray-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8  my-3">
              <div>
                <input
                  type="text"
                  id="birthdate"
                  name="birthdate"
                  value={formData.birthdate || ''}
                  onChange={handleChange}
                  placeholder="Your Birthdate"
                  className="w-full p-2 border border-gray-300"
                />
              </div>
              <div className="hidden md:block">
                {/* Empty column for layout */}
              </div>
            </div>

            {/* Product Info */}
            <h3 className="text-[#78CAEA] text-2xl font-normal mt-12 py-4">Product Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8  my-3">
              <div>
                <input
                  type="text"
                  id="productName"
                  name="productName"
                  value={formData.productName || ''}
                  onChange={handleChange}
                  placeholder="Product Name"
                  className="w-full p-2 border border-gray-300"
                  required
                />
              </div>
              <div>
                <input
                  type="text"
                  id="manufacturer"
                  name="manufacturer"
                  value={formData.manufacturer || ''}
                  onChange={handleChange}
                  placeholder="Product Manufacturer"
                  className="w-full p-2 border border-gray-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8  my-3">
              <div>
                <input
                  type="text"
                  id="bottleCount"
                  name="bottleCount"
                  value={formData.bottleCount || ''}
                  onChange={handleChange}
                  placeholder="Number of Bottles to be Ordered"
                  className="w-full p-2 border border-gray-300"
                  required
                />
              </div>
              <div>
                <input
                  type="text"
                  id="bottleSize"
                  name="bottleSize"
                  value={formData.bottleSize || ''}
                  onChange={handleChange}
                  placeholder="Bottle Size (ml)"
                  className="w-full p-2 border border-gray-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8  my-3">
              <div>
                <input
                  type="text"
                  id="alcoholPercent"
                  name="alcoholPercent"
                  value={formData.alcoholPercent || ''}
                  onChange={handleChange}
                  placeholder="Alcohol %"
                  className="w-full p-2 border border-gray-300"
                />
              </div>
              <div>
                <input
                  type="text"
                  id="upcCode"
                  name="upcCode"
                  value={formData.upcCode || ''}
                  onChange={handleChange}
                  placeholder="UPC Code if Available"
                  className="w-full p-2 border border-gray-300"
                />
              </div>
            </div>

            <div>
              <textarea
                id="additionalComments"
                name="additionalComments"
                value={formData.additionalComments || ''}
                onChange={handleChange}
                placeholder="Additional Comments"
                rows="5"
                className="w-full p-2 border border-gray-300"
              ></textarea>
            </div>

            <div>
              <button
                type="submit"
                className="bg-gray-800 text-white py-1 px-6 hover:bg-gray-700 transition-colors"
              >
                Submit
              </button>
            </div>
          </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecialOrdersPage; 