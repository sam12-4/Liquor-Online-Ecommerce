import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AnimatedSection from '../components/common/AnimatedSection';
import { TruckIcon, ClockIcon, GlobeAltIcon, CurrencyDollarIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

const ShippingInfoCard = ({ title, description, icon: Icon }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center mb-4">
        <div className="p-2 rounded-full bg-[#c0a483] bg-opacity-10 mr-4">
          <Icon className="h-6 w-6 text-[#c0a483]" />
        </div>
        <h3 className="text-lg font-semibold text-dark">{title}</h3>
      </div>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const ShippingRegionCard = ({ region, standardDays, expressDays, standardCost, expressCost, restrictions }) => {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="bg-gray-50 px-6 py-4">
        <h3 className="text-lg font-medium text-dark">{region}</h3>
      </div>
      <div className="px-6 py-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">Standard Shipping</p>
            <p className="font-medium">{standardDays} business days</p>
            <p className="text-[#c0a483] font-medium">{standardCost}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Express Shipping</p>
            <p className="font-medium">{expressDays} business days</p>
            <p className="text-[#c0a483] font-medium">{expressCost}</p>
          </div>
        </div>
        {restrictions && (
          <div className="text-sm text-gray-600 border-t border-gray-100 pt-3">
            <p className="font-medium mb-1">Restrictions:</p>
            <p>{restrictions}</p>
          </div>
        )}
      </div>
    </div>
  );
};

const ShippingDeliveryPage = () => {
  useEffect(() => {
    document.title = 'Shipping & Delivery | Liquor Online';
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <AnimatedSection>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-dark mb-6">Shipping & Delivery</h1>
          <p className="text-lg text-gray-600 mb-10">
            We strive to provide fast, reliable shipping for all your orders. Learn about our shipping methods, delivery times, and costs below.
          </p>
        </div>
      </AnimatedSection>

      <div className="max-w-4xl mx-auto">
        {/* Shipping Overview */}
        <AnimatedSection delay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <ShippingInfoCard 
              title="Fast Delivery" 
              icon={TruckIcon}
              description="We offer standard and express shipping options to ensure your order arrives when you need it." 
            />
            <ShippingInfoCard 
              title="Shipping Times" 
              icon={ClockIcon}
              description="Most orders are processed within 24 hours and delivered within 2-5 business days depending on your location." 
            />
            <ShippingInfoCard 
              title="Delivery Areas" 
              icon={GlobeAltIcon}
              description="We currently deliver to all provinces and territories in Canada, with some restrictions based on local regulations." 
            />
            <ShippingInfoCard 
              title="Free Shipping" 
              icon={CurrencyDollarIcon}
              description="Orders over $50 qualify for free standard shipping to most areas in Canada." 
            />
          </div>
        </AnimatedSection>

        {/* Shipping Methods */}
        <AnimatedSection delay={0.2}>
          <div className="bg-white rounded-lg shadow-sm p-8 mb-10">
            <h2 className="text-2xl font-bold text-dark mb-6">Shipping Methods</h2>
            <p className="text-gray-600 mb-8">
              We offer different shipping methods to accommodate your needs. Choose the option that works best for you during checkout.
            </p>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Shipping Method
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estimated Delivery Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cost
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order Minimum
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Standard Shipping
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      3-5 business days
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      $9.99 (Free on orders $50+)
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      None
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Express Shipping
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      1-2 business days
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      $19.99
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      None
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Same-Day Delivery
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      Same day (order by 12 PM)
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      $29.99
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      $75
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-sm text-gray-500 mt-4">
              * Delivery times are estimates and may vary based on your location and other factors.
            </p>
          </div>
        </AnimatedSection>

        {/* Shipping By Region */}
        <AnimatedSection delay={0.3}>
          <div className="bg-white rounded-lg shadow-sm p-8 mb-10">
            <h2 className="text-2xl font-bold text-dark mb-6">Shipping By Region</h2>
            <p className="text-gray-600 mb-8">
              Shipping times and costs may vary depending on your location. Below is a breakdown of our shipping options by region:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <ShippingRegionCard
                region="Western Canada (BC, AB, SK)"
                standardDays="2-4"
                expressDays="1-2"
                standardCost="Free on orders $50+"
                expressCost="$19.99"
                restrictions="Some remote areas may require additional time"
              />
              <ShippingRegionCard
                region="Central Canada (MB, ON, QC)"
                standardDays="2-5"
                expressDays="1-3"
                standardCost="Free on orders $50+"
                expressCost="$19.99"
                restrictions="None"
              />
              <ShippingRegionCard
                region="Eastern Canada (NB, NS, PE, NL)"
                standardDays="3-7"
                expressDays="2-3"
                standardCost="Free on orders $75+"
                expressCost="$24.99"
                restrictions="None"
              />
              <ShippingRegionCard
                region="Northern Territories (YT, NT, NU)"
                standardDays="5-10"
                expressDays="3-5"
                standardCost="$19.99 (Free on orders $100+)"
                expressCost="$34.99"
                restrictions="Some areas may have limited delivery options"
              />
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 rounded mt-8">
              <div className="flex">
                <ShieldCheckIcon className="h-6 w-6 mr-3 flex-shrink-0" />
                <div>
                  <p className="font-medium">Alcohol Shipping Regulations</p>
                  <p className="mt-1">
                    Due to regulations, all alcohol shipments require an adult signature (19+ or 18+ depending on province) upon delivery. Please ensure someone of legal drinking age is available to receive your package.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Delivery Information */}
        <AnimatedSection delay={0.4}>
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-dark mb-6">Delivery Information</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-dark mb-2">Order Processing</h3>
                <p className="text-gray-600">
                  Orders are typically processed within 24 hours of being placed. Once your order is processed, you will receive a shipping confirmation email with tracking information.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-dark mb-2">Signature Required</h3>
                <p className="text-gray-600">
                  All deliveries require an adult signature (19+ or 18+ depending on province) upon delivery. Valid government-issued photo ID may be required to verify age.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-dark mb-2">Missed Deliveries</h3>
                <p className="text-gray-600">
                  If you're not available to receive your package, the carrier will leave a delivery notice with instructions for rescheduling delivery or picking up your package from a local facility.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-dark mb-2">Tracking Your Order</h3>
                <p className="text-gray-600">
                  Once your order ships, you'll receive a confirmation email with tracking information. You can also track your order at any time from your account dashboard.
                </p>
                <div className="mt-3">
                  <Link to="/track-order" className="text-[#c0a483] hover:text-[#a38b6c] font-medium">
                    Track Your Order →
                  </Link>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-dark mb-2">Delivery Issues</h3>
                <p className="text-gray-600">
                  If you experience any issues with your delivery, please contact our customer service team as soon as possible. We'll work with you to resolve any problems.
                </p>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-600 mb-4">Have questions about shipping or delivery?</p>
              <div className="flex justify-center space-x-4">
                <Link to="/contact-faq" className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-[#c0a483] hover:bg-[#a38b6c]">
                  View FAQ
                </Link>
                <Link to="/contact" className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default ShippingDeliveryPage; 