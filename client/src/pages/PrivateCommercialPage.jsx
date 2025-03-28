import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPinIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

// Import banner images
import bannerImg from '../assets/images/Banner4.png';
import WeddingImg from '../assets/images/Weddings23.jpg';
import { FaEnvelope, FaMapMarkerAlt, FaPhoneVolume } from 'react-icons/fa';

const PrivateCommercialPage = () => {
  useEffect(() => {
    document.title = 'Private & Commercial - Liquor Online';
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
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
    alert('Your message has been sent. We will contact you shortly.');
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  return (
    <>
    <div className='font-["Marcellus",_serif]'>
      {/* Hero Banner */}
      <div className="relative bg-black flex items-center justify-center overflow-hidden h-60">
        <div className="absolute inset-0">
          <img
            src={bannerImg}
            alt="Private & Commercial Banner"
            className="relative h-[300px] md:h-[250px] md:w-[100%] w-full overflow-hidden bg-center bg-cover bg-no-repeat"
          />
        </div>
        <div className="relative z-10 text-center font-['Marcellus',_serif]">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 font-['Marcellus',_serif]">
            Private Functions & Special Events
          </h1>
          <div className="flex items-center justify-center text-white/80 font-['Marcellus',_serif]">
            <Link to="/" className="hover:text-white font-['Marcellus',_serif]">Home</Link>
            <span className="mx-2">›</span>
            <span className="font-medium text-white font-['Marcellus',_serif]">Private & Commercial</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        {/* Wedding Image */}
        <div className="mb-10 pt-5 flex justify-center">
          <img
            src={WeddingImg}
            alt="Wedding Celebration"
            className="max-w-6xl w-full h-auto"
          />
        </div>

        <div className="max-w-6xl mx-auto font-['Marcellus',_serif] text-[#7a7a7a]">
          {/* Service Information */}
          <h2 className="text-md font-bold mb-4 text-center">Private Functions & Special Events</h2>

          <div className="mb-8 text-sm leading-relaxed">
            <p className="mb-4 text-center text-md">
              Liquor Online provides a variety of Liquor services including Special Event Catering for Weddings, Parties, and all other Occasions I need to be Licensed in the Province of Alberta. If you are interested in getting a Free Quote for your Special Event, please Contact Us below.
            </p>
          <h2 className="text-md font-bold mb-4 text-center">Commercial Customers</h2>
            <p className="mb-4 text-center text-md">
              Liquor Online currently supplies many Bars, Restaurants, Lounges and Night Clubs in Calgary. All our Commercial Pricing (includes Shop off and/or delivery to your Location) when you need it. Our Commercial Order Staff is available at most competitive to take your orders, whether you submit online, via email, or over the phone. Our Order sells or own liquor, and if you are interested in discussing opening an Account with us, please Contact us below.
            </p>
          </div>

          {/* Two Column Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
            {/* Left Column - Hours & Contact */}
            <div>
              <h2 className="text-2xl font-medium text-[#78CAEA] mb-6">Hours of Operation</h2>
              <ul className="space-y-1 mb-8 text-gray-700">
                <li>
                  <span>Monday: 10:00 AM - 10:00 PM</span>
                </li>
                <li>
                  <span>Tuesday: 10:00 AM - 10:00 PM</span>
                </li>
                <li>
                  <span>Wednesday: 10:00 AM - 10:00 PM</span>
                </li>
                <li>
                  <span>Thursday: 10:00 AM - 10:00 PM</span>
                </li>
                <li>
                  <span>Friday: 10:00 AM - 10:00 PM</span>
                </li>
                <li>
                  <span>Saturday: 10:00 AM - 10:00 PM</span>
                </li>
                <li>
                  <span>Sunday: 10:00 AM - 8:00 PM</span>
                </li>
              </ul>

              {/* Contact Information */}

              {/* Location */}
              <div className="mb-4">
                <div className="flex items-center gap-8">
                  {/* <MapPinIcon className="h-5 w-5 text-gray-700 mr-2 flex-shrink-0 mt-0.5" /> */}
                  <div className="bg-opacity-10 p-3 border-[antiquewhite] border-[1px]">
                  <FaMapMarkerAlt className="h-6 w-6 text-black " />
                  </div>
                  <div className="flex flex-col items-start gap-2">
                  <h2 className="text-2xl font-medium text-black">Our Location to Serve You</h2>
                  <p className="text-gray-700">
                    4808 50th St., Red Deer, AB
                  </p>
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="mb-4">
                <div className="flex items-start   gap-8">
                  {/* <MapPinIcon className="h-5 w-5 text-gray-700 mr-2 flex-shrink-0 mt-0.5" /> */}
                  <div className="bg-opacity-10 p-3 border-[antiquewhite] border-[1px]">
                  <FaPhoneVolume className="h-6 w-6 text-black " />
                  </div>
                  <div className="flex flex-col items-start gap-2">
                  <h2 className="text-2xl font-medium text-black">Phone</h2>
                  <p className="text-gray-700">
                    Toll-free:<br/> 1 833 306 SELL
                  </p>
                  <p className="text-gray-700">1-833-238-7555</p>
                  </div>
                </div>
              </div>
              {/* <div className="mb-4 flex">
                <div className="flex items-start border-2 border-[antiquewhite] ">
                  <FaPhoneVolume className="h-5 w-5 text-black mr-2 " />
                <div>
                <h3 className="font-medium mb-2">Phone</h3>
                    <p className="text-gray-700">Toll-free:<br/> 1 833 306 SELL</p>
                    <p className="text-gray-700">1-833-238-7555</p>
                  </div>
                </div>
              </div> */}

              {/* Email
              <div className="mb-4">
                <h3 className="font-medium mb-2">Email</h3>
                <div className="flex items-start gap-8">
                  <EnvelopeIcon className="h-5 w-5 text-gray-700 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-gray-700">info@liquoronline.ca</p>
                    <p className="text-gray-700">orders@liquoronline.ca</p>
                  </div>
                </div>
              </div> */}
              {/* Phone */}
              <div className="mb-4">
                <div className="flex items-start  gap-8">
                  {/* <MapPinIcon className="h-5 w-5 text-gray-700 mr-2 flex-shrink-0 mt-0.5" /> */}
                  <div className="bg-opacity-10 p-3 border-[antiquewhite] border-[1px]">
                  <FaEnvelope className="h-6 w-6 text-black " />
                  </div>
                  <div className="flex flex-col items-start gap-2">
                  <h2 className="text-2xl font-medium text-black">Email</h2>
                  <p className="text-gray-700">
                  info@liquoronline.ca
                  </p>
                  <p className="text-gray-700">orders@liquoronline.ca</p>
                  </div>
                </div>
              </div>
            </div>

            

            {/* Right Column - Contact Form */}
            <div>
              <h2 className="text-2xl font-medium text-[#78CAEA] mb-6">Send us a message</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="w-full p-2 border border-gray-300"
                    required
                  />
                </div>

                <div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your email"
                    className="w-full p-2 border border-gray-300"
                    required
                  />
                </div>

                <div>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Subject"
                    className="w-full p-2 border border-gray-300"
                    required
                  />
                </div>

                <div>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Your message (optional)"
                    rows="6"
                    className="w-full p-2 border border-gray-300"
                  ></textarea>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-gray-800 text-white py-1 px-4 hover:bg-gray-700 transition-colors"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

      </div>
    </div>
        {/* Map */}
        <div className="w-full h-[400px] mb-5 mx-auto">
          <iframe
            src="https://maps.google.com/maps?q=4808%2050%20St.%20Red%20Deer%20AB%20T4N%201X5&t=m&z=14&output=embed&iwloc=near"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Store Location"
          ></iframe>
        </div>
        </>
  );
};

export default PrivateCommercialPage; 