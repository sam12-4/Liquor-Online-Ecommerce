import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  PhoneIcon, 
  EnvelopeIcon, 
  MapPinIcon, 
  ClockIcon 
} from '@heroicons/react/24/outline';
import AnimatedSection from '../components/common/AnimatedSection';
import { FaMapMarked, FaMapMarker, FaMapMarkerAlt, FaPhoneVolume } from 'react-icons/fa';
import { PhoneXMarkIcon } from '@heroicons/react/24/solid';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitStatus, setSubmitStatus] = useState(null);
  
  useEffect(() => {
    document.title = 'Contact Us | Liquor Store';
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitStatus('submitting');
    
    // Simulate API call
    setTimeout(() => {
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    }, 1500);
  };

  return (
    <div className="container mx-auto  py-12">
      
        {/* Map */}
        <AnimatedSection delay={0.4} className="">
          <div className="bg-white  shadow-sm ">
            <div className="aspect-w-16 aspect-h-9 overflow-hidden">
              <iframe
                src="https://maps.google.com/maps?q=4808%2050%20St.%20Red%20Deer%20AB%20T4N%201X5&t=m&z=12&output=embed&iwloc=near"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Store Location"
              ></iframe>
            </div>
          </div>
        </AnimatedSection>
      {/* <AnimatedSection>
        <div className="max-w-4xl mx-auto mt-20">
          <h1 className="text-4xl font-bold text-dark mb-6">Contact Us</h1>
          <p className="text-lg text-gray-600 mb-10">
            Have a question or feedback? We'd love to hear from you. Fill out the form below or contact us directly using the information provided.
          </p>
        </div>
      </AnimatedSection> */}
      
      <div className="max-w-6xl mx-auto py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Contact Information */}
          <AnimatedSection delay={0.2} className="lg:w-2/4">
            <div className="bg-white rounded-lg shadow-sm p-6 py-8">
              <h2 className="text-3xl font-normal text-[#6ec1e4] mb-6">Customer Service</h2>
              <p className="text-[#7a7a7a] text-sm font-['Roboto',sans-serif] my-10"> Liquor Online is available to help with all Questions. Please be sure to try or Chatbot in the bottom right hand corner of every page as it is trained to answer any query 🙂</p>
              
              <div className="space-y-10">
                {/* <div className="flex items-start">
                  <div className="bg-primary bg-opacity-10 p-3 rounded-full mr-4">
                    <PhoneIcon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-dark">Phone</h3>
                    <p className="text-gray-600">+1 (555) 123-4567</p>
                    <p className="text-sm text-gray-500 mt-1">Mon-Fri, 9am-6pm EST</p>
                  </div>
                </div> */}
                
                {/* <div className="flex items-start">
                  <div className="bg-primary bg-opacity-10 p-3 rounded-full mr-4">
                    <EnvelopeIcon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-dark">Email</h3>
                    <p className="text-gray-600">info@liquorstore.com</p>
                    <p className="text-sm text-gray-500 mt-1">We'll respond within 24 hours</p>
                  </div>
                </div> */}
                
                <div className="flex items-start ">
                  <div className=" bg-opacity-10 p-3 border-[antiquewhite] border-[1px] mr-4">
                    <FaMapMarkerAlt className="h-6 w-6 text-black " />
                  </div>
                  <div>
                    <h3 className="font-medium text-dark">Address</h3>
                    <p className="text-[#7a7a7a] text-sm font-['Roboto',sans-serif]">4808 Ross St., Red Deer Ab Canada</p>
                    {/* <p className="text-gray-600">New York, NY 10001</p> */}
                  </div>
                </div>
                
                <div className="flex items-start ">
                  <div className=" bg-opacity-10 p-3 border-[antiquewhite] border-[1px] mr-4">
                    <FaPhoneVolume className="h-6 w-6 text-black " />
                  </div>
                  <div>
                    <h3 className="font-medium text-dark">Phone</h3>
                    <p className="text-[#7a7a7a] text-sm font-['Roboto',sans-serif]">
                    Toll Free: 1 833 306 7355</p>
                  </div>
                </div>
                
                <div className="flex items-start ">
                  <div className=" bg-opacity-10 p-3 border-[antiquewhite] border-[1px] mr-4">
                    <FaMapMarkerAlt className="h-6 w-6 text-black " />
                  </div>
                  <div>
                    <h3 className="font-medium text-dark">Email</h3>
                    <p className="text-[#7a7a7a] text-sm font-['Roboto',sans-serif]">info@liquoronline.ca</p>
                    {/* <p className="text-gray-600">New York, NY 10001</p> */}
                  </div>
                </div>
                
                {/* <div className="flex items-start">
                  <div className="bg-primary bg-opacity-10 p-3 rounded-full mr-4">
                    <ClockIcon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-dark">Business Hours</h3>
                    <div className="text-gray-600">
                      <p>Monday - Friday: 9am - 9pm</p>
                      <p>Saturday: 10am - 8pm</p>
                      <p>Sunday: 11am - 6pm</p>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          </AnimatedSection>
          
          {/* Contact Form */}
          <AnimatedSection delay={0.3} className="lg:w-2/4">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {/* <h2 className="text-xl font-bold text-dark mb-6">Send us a Message</h2> */}
              
              {submitStatus === 'success' ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-50 border border-green-200 rounded-lg p-6 text-center"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-green-800 mb-2">Message Sent Successfully!</h3>
                  <p className="text-green-700 mb-4">
                    Thank you for contacting us. We'll get back to you as soon as possible.
                  </p>
                  <button
                    onClick={() => setSubmitStatus(null)}
                    className="btn bg-black text-white"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="flex flex-col gap-6 mb-6">
                    <div>
                      <label htmlFor="name" className="block text-[#868686] font-['Roboto',sans-serif] text-sm mb-1">
                      Your name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#6ec1e4]"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-[#868686] font-['Roboto',sans-serif] text-sm mb-1">
                      Your email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#6ec1e4]"
                      />
                    </div>
                    {/* <div>
                      <label htmlFor="phone" className="block text-gray-700 text-sm font-medium mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div> */}
                    <div>
                      <label htmlFor="subject" className="block text-[#868686] font-['Roboto',sans-serif] text-sm mb-1">
                      Subject
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#6ec1e4]"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="message" className="block text-[#868686] font-['Roboto',sans-serif] text-sm mb-1">
                      Your message (optional)
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#6ec1e4]"
                      ></textarea>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={submitStatus === 'submitting'}
                    className="btn w-full md:w-auto p-4 bg-black text-white"
                  >
                    {submitStatus === 'submitting' ? (
                      <div className="flex items-center justify-center ">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </div>
                    ) : (
                      'SUBMIT'
                    )}
                  </button>
                </form>
              )}
            </div>
          </AnimatedSection>
        </div>
        
      </div>
    </div>
  );
};

export default ContactPage; 