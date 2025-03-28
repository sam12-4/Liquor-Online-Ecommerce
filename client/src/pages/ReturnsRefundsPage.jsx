import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AnimatedSection from '../components/common/AnimatedSection';
import { ArrowRightIcon, ShieldCheckIcon, TruckIcon, CurrencyDollarIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const ReturnStep = ({ number, title, description, icon: Icon }) => {
  return (
    <div className="flex items-start mb-8">
      <div className="flex-shrink-0 bg-[#c0a483] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4">
        {number}
      </div>
      <div className="flex-1">
        <div className="flex items-center mb-1">
          {Icon && <Icon className="h-5 w-5 text-[#c0a483] mr-2" />}
          <h3 className="text-lg font-semibold text-dark">{title}</h3>
        </div>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
};

const PolicySection = ({ title, children }) => {
  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold text-dark mb-4">{title}</h3>
      <div className="text-gray-600 space-y-4">
        {children}
      </div>
    </div>
  );
};

const ReturnsRefundsPage = () => {
  useEffect(() => {
    document.title = 'Returns & Refunds | Liquor Online';
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <AnimatedSection>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-dark mb-6">Returns & Refunds</h1>
          <p className="text-lg text-gray-600 mb-10">
            We want you to be completely satisfied with your purchase. Learn about our return process and refund policy below.
          </p>
        </div>
      </AnimatedSection>

      <div className="max-w-4xl mx-auto">
        <AnimatedSection delay={0.1}>
          <div className="bg-white rounded-lg shadow-sm p-8 mb-10">
            <h2 className="text-2xl font-bold text-dark mb-6">Return Process</h2>
            <p className="text-gray-600 mb-8">
              If you're not completely satisfied with your purchase, we're here to help. Follow these simple steps to return your items:
            </p>

            <ReturnStep 
              number={1} 
              title="Contact Us" 
              icon={TruckIcon}
              description="Within 30 days of receiving your order, contact our customer service team through email at returns@liquoronline.ca or call us at 1-833-306-SELL." 
            />
            
            <ReturnStep 
              number={2} 
              title="Request Approval" 
              icon={ShieldCheckIcon}
              description="Provide your order number, the items you wish to return, and the reason for your return. Our team will review your request and provide you with a Return Authorization Number." 
            />
            
            <ReturnStep 
              number={3} 
              title="Package Your Return" 
              icon={TruckIcon}
              description="Securely package the unopened items in their original packaging. Include your Return Authorization Number clearly visible on the outside of the package." 
            />
            
            <ReturnStep 
              number={4} 
              title="Ship Your Return" 
              icon={TruckIcon}
              description="Ship your return to the address provided by our customer service team. We recommend using a tracked shipping method." 
            />
            
            <ReturnStep 
              number={5} 
              title="Receive Your Refund" 
              icon={CurrencyDollarIcon}
              description="Once we receive and inspect your return, we'll process your refund. The refund will be issued to your original payment method within 5-10 business days." 
            />

            <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 rounded mt-8">
              <p className="font-medium">Need to initiate a return?</p>
              <p className="mt-1">Contact our customer service team to start the process.</p>
              <Link to="/contact" className="mt-3 inline-flex items-center text-blue-700 hover:text-blue-900 font-medium">
                Contact Us <ArrowRightIcon className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-dark mb-6">Return & Refund Policy</h2>

            <PolicySection title="Eligibility for Returns">
              <p>
                We accept returns of products that meet the following conditions:
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>Items must be in their original, unopened condition</li>
                <li>Returns must be initiated within 30 days of delivery</li>
                <li>Products must be in their original packaging with all seals intact</li>
                <li>Items must not be damaged, or damaged due to customer mishandling</li>
              </ul>
            </PolicySection>

            <PolicySection title="Non-Returnable Items">
              <p>
                The following items cannot be returned:
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>Opened bottles or containers</li>
                <li>Items with broken seals or damaged packaging</li>
                <li>Special order items or custom products</li>
                <li>Clearance or final sale items (marked as such)</li>
                <li>Gift cards or promotional certificates</li>
              </ul>
            </PolicySection>

            <PolicySection title="Refund Process">
              <p>
                Once your return is received and inspected, we will send you an email to notify you that we have received your returned item. We will also notify you of the approval or rejection of your refund.
              </p>
              <p className="mt-2">
                If approved, your refund will be processed, and a credit will automatically be applied to your original method of payment within 5-10 business days, depending on your financial institution's policies.
              </p>
            </PolicySection>

            <PolicySection title="Damaged or Incorrect Items">
              <p>
                If you receive damaged or incorrect items, please contact our customer service team within 24 hours of receiving your order. Include photos of the damaged items or packaging.
              </p>
              <p className="mt-2">
                For damaged or incorrect items, we may offer:
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>Replacement of the item(s)</li>
                <li>Full refund or store credit</li>
                <li>Partial refund if only part of the order was affected</li>
              </ul>
            </PolicySection>

            <PolicySection title="Return Shipping Costs">
              <p>
                Return shipping costs are the responsibility of the customer except in cases where:
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>The incorrect item was delivered</li>
                <li>The item arrived damaged</li>
                <li>The item does not match the description on our website</li>
              </ul>
              <p className="mt-2">
                In these cases, we will provide a prepaid return shipping label or reimburse your return shipping costs.
              </p>
            </PolicySection>

            <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded flex">
              <ExclamationTriangleIcon className="h-6 w-6 mr-3 flex-shrink-0" />
              <div>
                <p className="font-medium">Important Note About Alcohol Returns</p>
                <p className="mt-1">
                  Due to regulatory requirements, returns of alcohol products may be subject to additional restrictions based on local laws. In some jurisdictions, returns of alcoholic beverages may be limited or prohibited. Please contact our customer service team for specific guidance related to your location.
                </p>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-600 mb-4">Still have questions about returns or refunds?</p>
              <Link to="/contact-faq" className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-[#c0a483] hover:bg-[#a38b6c]">
                View FAQ
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default ReturnsRefundsPage; 