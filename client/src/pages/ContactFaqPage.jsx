import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import AnimatedSection from '../components/common/AnimatedSection';

const FAQItem = ({ question, answer, isOpen, toggleOpen }) => {
  return (
    <div className="border-b border-gray-200 py-4">
      <button
        className="flex justify-between items-center w-full text-left"
        onClick={toggleOpen}
      >
        <h3 className="text-lg font-medium text-gray-900">{question}</h3>
        {isOpen ? (
          <ChevronUpIcon className="h-5 w-5 text-[#c0a483]" />
        ) : (
          <ChevronDownIcon className="h-5 w-5 text-[#c0a483]" />
        )}
      </button>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-3 text-gray-600"
        >
          <p>{answer}</p>
        </motion.div>
      )}
    </div>
  );
};

const ContactFaqPage = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const [activeTab, setActiveTab] = useState('orders');

  useEffect(() => {
    document.title = 'Contact & FAQ | Liquor Online';
  }, []);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqData = {
    orders: [
      {
        question: "How do I place an order?",
        answer: "You can place an order by browsing our website, selecting the products you'd like to purchase, adding them to your cart, and proceeding to checkout. Follow the instructions to complete your purchase."
      },
      {
        question: "What payment methods do you accept?",
        answer: "We accept Visa, MasterCard, American Express, and PayPal. All transactions are secure and encrypted."
      },
      {
        question: "Can I modify or cancel my order?",
        answer: "You can modify or cancel your order within 1 hour of placing it. Please contact our customer service team immediately if you need to make changes."
      },
      {
        question: "Is there a minimum order value?",
        answer: "There is no minimum order value, but orders under $50 will incur a small delivery fee. Orders over $50 qualify for free shipping to most areas."
      },
      {
        question: "Can I order products that are not listed on your website?",
        answer: "Yes, we can source special products for you. Please use our contact form to inquire about special orders."
      }
    ],
    shipping: [
      {
        question: "How long will it take to receive my order?",
        answer: "Most orders are delivered within 2-5 business days, depending on your location. You will receive a tracking number once your order has been shipped."
      },
      {
        question: "Do you ship internationally?",
        answer: "We currently only ship within Canada due to international shipping regulations for alcohol."
      },
      {
        question: "How can I track my order?",
        answer: "Once your order has been shipped, you will receive an email with tracking information. You can also track your order from your account dashboard."
      },
      {
        question: "What happens if I'm not home for delivery?",
        answer: "Our delivery partner will leave a notice and attempt delivery again the next business day. After three attempts, your package will be held at the nearest pickup location."
      },
      {
        question: "Do you offer expedited shipping?",
        answer: "Yes, we offer expedited shipping options at checkout for an additional fee."
      }
    ],
    returns: [
      {
        question: "What is your return policy?",
        answer: "We accept returns of unopened, undamaged products within 30 days of purchase. Please contact our customer service team to initiate a return."
      },
      {
        question: "Can I return a product if I don't like it?",
        answer: "We can only accept returns for unopened products. For quality issues with opened products, please contact our customer service team."
      },
      {
        question: "How do I return a product?",
        answer: "To return a product, please contact our customer service team through our contact form or by phone. We will provide you with return instructions and a return authorization number."
      },
      {
        question: "How long does it take to process a refund?",
        answer: "Once we receive your return, refunds are typically processed within 3-5 business days. It may take an additional 2-7 business days for the refund to appear in your account, depending on your payment method."
      },
      {
        question: "What if I received a damaged product?",
        answer: "If you receive a damaged product, please contact us within 24 hours of receipt. Include photos of the damage, and we will arrange a replacement or refund."
      }
    ],
    account: [
      {
        question: "How do I create an account?",
        answer: "Click on the 'Account' icon at the top right of our website and select 'Register'. Follow the instructions to create your account."
      },
      {
        question: "I forgot my password. How do I reset it?",
        answer: "Click on 'Login', then select 'Forgot Password'. Enter your email address, and we'll send you instructions to reset your password."
      },
      {
        question: "How can I update my account information?",
        answer: "Log in to your account and go to 'Account Settings' to update your personal information, shipping addresses, and payment methods."
      },
      {
        question: "Can I save my favorite products?",
        answer: "Yes, you can add products to your wishlist by clicking the heart icon on any product page. You must be logged in to use this feature."
      },
      {
        question: "How can I view my order history?",
        answer: "Log in to your account and go to 'Order History' to view all your past orders and their details."
      }
    ],
  };

  const contactInfo = {
    email: "support@liquoronline.ca",
    phone: "1-833-306-SELL",
    hours: "Monday - Friday: 9am - 6pm EST",
    address: "4808 50 St., Red Deer, AB, Canada T4N 1X5"
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <AnimatedSection>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-dark mb-6">Contact & FAQ</h1>
          <p className="text-lg text-gray-600 mb-10">
            Find answers to common questions or get in touch with our customer service team.
          </p>
        </div>
      </AnimatedSection>

      <div className="max-w-4xl mx-auto">
        {/* Contact Information Section */}
        <AnimatedSection delay={0.1}>
          <div className="bg-white rounded-lg shadow-sm p-8 mb-10">
            <h2 className="text-2xl font-bold text-dark mb-6">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Customer Support</h3>
                <p className="text-gray-600 mb-1">Email: {contactInfo.email}</p>
                <p className="text-gray-600 mb-1">Phone: {contactInfo.phone}</p>
                <p className="text-gray-600">Hours: {contactInfo.hours}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Office Address</h3>
                <p className="text-gray-600">{contactInfo.address}</p>
              </div>
            </div>
            <div className="mt-8">
              <Link to="/contact" className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-[#c0a483] hover:bg-[#a38b6c]">
                Contact Us
              </Link>
            </div>
          </div>
        </AnimatedSection>

        {/* FAQ Section */}
        <AnimatedSection delay={0.2}>
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-dark mb-6">Frequently Asked Questions</h2>
            
            {/* FAQ Tabs */}
            <div className="flex flex-wrap border-b border-gray-200 mb-6">
              {Object.keys(faqData).map((category) => (
                <button
                  key={category}
                  className={`px-4 py-2 font-medium text-sm mr-4 ${
                    activeTab === category
                      ? "text-[#c0a483] border-b-2 border-[#c0a483]"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => {
                    setActiveTab(category);
                    setOpenFaq(null);
                  }}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>

            {/* FAQ Content */}
            <div>
              {faqData[activeTab].map((faq, index) => (
                <FAQItem
                  key={index}
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openFaq === index}
                  toggleOpen={() => toggleFaq(index)}
                />
              ))}
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-600 mb-4">Can't find what you're looking for?</p>
              <Link to="/contact" className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-[#c0a483] hover:bg-[#a38b6c]">
                Ask a Question
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default ContactFaqPage; 