import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AnimatedSection from '../components/common/AnimatedSection';
import { CreditCardIcon, CurrencyDollarIcon, DocumentTextIcon, ShieldCheckIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const FeatureCard = ({ title, description, icon: Icon }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
      <div className="flex items-center mb-4">
        <div className="bg-[#c0a483] bg-opacity-10 p-3 rounded-full mr-4">
          <Icon className="h-6 w-6 text-[#c0a483]" />
        </div>
        <h3 className="text-lg font-semibold text-dark">{title}</h3>
      </div>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const FinanceOption = ({ title, description, months, minAmount, fee, buttonText, isRecommended }) => {
  return (
    <div className={`border ${isRecommended ? 'border-[#c0a483]' : 'border-gray-200'} rounded-lg overflow-hidden transition-all duration-300 hover:shadow-md`}>
      {isRecommended && (
        <div className="bg-[#c0a483] text-white text-center py-2 text-sm font-semibold">
          RECOMMENDED
        </div>
      )}
      <div className={`px-6 py-5 ${!isRecommended ? 'border-t border-gray-200' : ''}`}>
        <h3 className="text-xl font-bold text-dark mb-2">{title}</h3>
        <p className="text-gray-600 mb-4 h-12">{description}</p>
        
        <div className="space-y-3 mb-6">
          <div className="flex justify-between">
            <span className="text-gray-600">Term Length:</span>
            <span className="font-medium">{months} months</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Minimum Purchase:</span>
            <span className="font-medium">${minAmount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Setup Fee:</span>
            <span className="font-medium">{fee ? `$${fee}` : 'None'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Interest Rate:</span>
            <span className="font-medium text-green-600">0%</span>
          </div>
        </div>
        
        <Link
          to="/contact"
          className={`block w-full py-3 text-center font-medium rounded-md ${
            isRecommended
              ? "bg-[#c0a483] text-white hover:bg-[#a38b6c]"
              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          {buttonText}
        </Link>
      </div>
    </div>
  );
};

const Step = ({ number, title, description }) => {
  return (
    <div className="flex">
      <div className="flex-shrink-0 mt-1">
        <div className="bg-[#c0a483] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
          {number}
        </div>
        {number < 5 && <div className="h-full w-0.5 bg-gray-200 mx-auto mt-2"></div>}
      </div>
      <div className="ml-6 mb-12">
        <h3 className="text-lg font-semibold text-dark mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
};

const EligibilityItem = ({ text }) => {
  return (
    <div className="flex items-start mb-4">
      <CheckCircleIcon className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5 mr-3" />
      <p className="text-gray-600">{text}</p>
    </div>
  );
};

const FinancePage = () => {
  useEffect(() => {
    document.title = 'Interest Free Finance | Liquor Online';
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <AnimatedSection>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-dark mb-6">Interest Free Finance</h1>
          <p className="text-lg text-gray-600 mb-10">
            Get the premium spirits you love today and spread the cost with our interest-free payment options. No hidden fees, no interest - just flexible payment plans.
          </p>
        </div>
      </AnimatedSection>

      <div className="max-w-4xl mx-auto">
        {/* Benefits Section */}
        <AnimatedSection delay={0.1}>
          <div className="bg-white rounded-lg shadow-sm p-8 mb-10">
            <h2 className="text-2xl font-bold text-dark mb-8 text-center">Why Choose Interest-Free Financing?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FeatureCard 
                title="0% Interest" 
                icon={CurrencyDollarIcon}
                description="Spread your payments over time without paying any interest. The price you see is the price you pay." 
              />
              <FeatureCard 
                title="Quick Approval" 
                icon={CheckCircleIcon}
                description="Get an instant decision when you apply online. No lengthy wait times or complicated paperwork." 
              />
              <FeatureCard 
                title="Flexible Terms" 
                icon={DocumentTextIcon}
                description="Choose from 3, 6, or 12-month payment plans based on what works best for your budget." 
              />
              <FeatureCard 
                title="Secure Process" 
                icon={ShieldCheckIcon}
                description="Our financing application is secure and your information is protected with bank-level encryption." 
              />
            </div>
          </div>
        </AnimatedSection>

        {/* Finance Options */}
        <AnimatedSection delay={0.2}>
          <div className="bg-white rounded-lg shadow-sm p-8 mb-10">
            <h2 className="text-2xl font-bold text-dark mb-2 text-center">Available Financing Options</h2>
            <p className="text-gray-600 text-center mb-8">Choose the plan that works best for your needs</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FinanceOption 
                title="3-Month Plan" 
                description="Perfect for smaller purchases when you need a short-term payment option."
                months={3}
                minAmount={300}
                fee={0}
                buttonText="Apply Now"
              />
              <FinanceOption 
                title="6-Month Plan" 
                description="Our most popular option for mid-range purchases of premium spirits."
                months={6}
                minAmount={500}
                fee={0}
                buttonText="Apply Now"
                isRecommended={true}
              />
              <FinanceOption 
                title="12-Month Plan" 
                description="Ideal for high-end spirits and larger orders you want to pay off over time."
                months={12}
                minAmount={1000}
                fee={0}
                buttonText="Apply Now"
              />
            </div>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 rounded mt-8">
              <p>
                <span className="font-medium">Example:</span> A $600 purchase on the 6-month plan would mean 6 equal payments of $100 with no additional fees or interest.
              </p>
            </div>
          </div>
        </AnimatedSection>

        {/* How It Works */}
        <AnimatedSection delay={0.3}>
          <div className="bg-white rounded-lg shadow-sm p-8 mb-10">
            <h2 className="text-2xl font-bold text-dark mb-8 text-center">How It Works</h2>
            
            <div className="max-w-3xl mx-auto">
              <Step 
                number={1} 
                title="Shop and Add to Cart"
                description="Browse our selection and add your favorite products to your cart as usual."
              />
              
              <Step 
                number={2} 
                title="Select 'Pay Later' at Checkout"
                description="When you proceed to checkout, select the 'Pay Later' option and choose your preferred payment plan."
              />
              
              <Step 
                number={3} 
                title="Complete Quick Application"
                description="Fill out a simple application with basic information. You'll get an instant decision in most cases."
              />
              
              <Step 
                number={4} 
                title="Confirm Your Order"
                description="After approval, confirm your order and we'll process it right away. Your first payment will be taken at this time."
              />
              
              <Step 
                number={5} 
                title="Enjoy Your Purchase"
                description="Your order will be shipped right away while you enjoy the convenience of paying over time with no added interest."
              />
            </div>
          </div>
        </AnimatedSection>

        {/* Eligibility & Requirements */}
        <AnimatedSection delay={0.4}>
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-dark mb-6">Eligibility & Requirements</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-dark mb-4">Who Can Apply?</h3>
                <div className="space-y-3">
                  <EligibilityItem text="Canadian resident aged 19 or over (18+ in Alberta, Manitoba and Quebec)" />
                  <EligibilityItem text="Valid government-issued photo ID" />
                  <EligibilityItem text="Active credit or debit card for automatic payments" />
                  <EligibilityItem text="Regular source of income" />
                  <EligibilityItem text="Good credit history (credit check may be required)" />
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-dark mb-4">What You'll Need</h3>
                <div className="space-y-3">
                  <EligibilityItem text="Personal Information: Name, date of birth, address, email, phone number" />
                  <EligibilityItem text="Employment Information: Employment status, income details" />
                  <EligibilityItem text="Banking Information: For setting up automatic payments" />
                  <EligibilityItem text="Meet minimum purchase amount for your selected plan" />
                </div>
                
                {/* <div className="mt-8">
                  <h3 className="text-xl font-semibold text-dark mb-4">Important Notes</h3>
                  <p className="text-gray-600 mb-3">
                    All financing is subject to approval. While most applications receive an instant decision, some may require additional verification.
                  </p>
                  <p className="text-gray-600">
                    Missed payments may result in late fees and could affect your credit score. Please ensure automatic payments are set up correctly.
                  </p>
                </div> */}
              </div>
            </div>
            
            <div className="mt-10 text-center">
              <p className="text-gray-600 mb-4">Ready to explore premium spirits with easy payment options?</p>
              <div className="flex justify-center space-x-4">
                <Link to="/shop" className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-[#c0a483] hover:bg-[#a38b6c]">
                  Shop Now
                </Link>
                <Link to="/contact-faq" className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50">
                  View FAQ
                </Link>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default FinancePage; 