import { Link } from 'react-router-dom';
import paymentIcons from '../../assets/images/payment-new.webp';

const Footer = () => {
  return (
    <>
    {/* Newsletter Section */}
    <section className="py-6 md:py-10 bg-[#C0A483] relative">
    <div className="container mx-auto px-4 flex flex-col items-center text-[#7a7a7a] justify-center">
      <div className="max-w-4xl mx-auto text-center flex flex-col md:flex-row gap-6 md:gap-28 items-center justify-center">
        <div className="text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-white uppercase mb-1 md:mb-2 select-none">
            Sign up for our newsletter
          </h2>
          <p className="text-[#817c75] mb-4 md:mb-6 text-xs md:text-sm font-[400] font-serif">
            Keep updated with the latest and greatest from Liquor Online Ltd.
          </p>
          </div>
        <div className="flex flex-col sm:flex-row sm:items-stretch gap-0 max-w-xl mx-auto w-full md:w-auto">
          <input
            type="email"
            placeholder="Your email address..."
            className="flex-grow px-4 md:px-5 py-2 mb-4 md:mb-0 md:py-3 focus:outline-none text-gray-700 w-full sm:w-auto"
            required
          />
          <button
            type="submit"
            className="bg-black text-white font-medium px-6 md:px-8 py-2 md:py-3 uppercase transition-colors"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  </section>
    <footer className="bg-gray-50 pt-12 pb-6">

      <div className="container mx-auto px-4 ">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10 w-[90%] mx-auto">
          {/* Contact Us */}
          <div>
            <h3 className="text-[#6ec1e4] text-xl uppercase font-bold mb-4">Contact Us</h3>
            <div className="space-y-4 text-gray-600">
              <div>
                <span className=" text-black font-bold ">Head Office:</span>
                <span> &nbsp;4808 50 St.,<br />Red Deer, AB<br />Canada T4N 1X5</span>
              </div>
              <div>
                <span className=" text-black font-bold ">Tel:</span>
                <a href='tel:18333067355' className='hover:text-[#c0a483] transition-colors'> &nbsp;1 833 306 SELL</a>
              </div>
              <div>
                <span className=" text-black font-bold ">Email:</span>
                <a href="mailto:admin@liquoronline.ca" className="hover:text-[#c0a483] transition-colors">
                &nbsp;admin@liquoronline.ca
                </a>
              </div>

              {/* Social Media Links */}
              <div className="flex space-x-4 mt-6">
                <a
                  href="https://twitter.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:bg-[#c0a483] border-gray-100 border-4  h-10 w-10 rounded-full flex items-center justify-center hover:text-white transition-all duration-300"
                >
                  <span className="font-bold">𝕏</span>
                </a>
                <a
                  href="https://www.instagram.com/liquoronlineliquor/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:bg-[#c0a483] border-gray-100 border-4  h-10 w-10 rounded-full flex items-center justify-center hover:text-white transition-all duration-300"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a
                  href="https://www.facebook.com/LiquorOn1ine"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:bg-[#c0a483] border-gray-100 border-4  h-10 w-10 rounded-full flex items-center justify-center hover:text-white transition-all duration-300"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Customer Services */}
          <div>
            <h3 className="text-[#6ec1e4]  font-bold text-xl uppercase  mb-4">Customer Services</h3>
            <ul className="space-y-2 text-gray-600">
              <li>
                <Link to="/contact-faq" className="hover:text-[#c0a483]">
                  Contact & FAQ
                </Link>
              </li>
              <li>
                <Link to="/track-order" className="hover:text-[#c0a483]">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link to="/returns-refunds" className="hover:text-[#c0a483]">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link to="/shipping-delivery" className="hover:text-[#c0a483]">
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link to="/finance" className="hover:text-[#c0a483]">
                  Interest Free Finance
                </Link>
              </li>
            </ul>
          </div>

          {/* About Us */}
          <div>
            <h3 className="text-[#6ec1e4] text-xl uppercase font-bold mb-4">About Us</h3>
            <ul className="space-y-2 text-gray-600">
              <li>
                <Link to="https://liquoronline.ca/" target='_blank'  className="hover:text-[#c0a483]">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#c0a483]">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/special-orders" className="hover:text-[#c0a483]">
                  Special Orders
                </Link>
              </li>
              <li>
                <Link to="/shop?tag=special-allocations" className="hover:text-[#c0a483]">
                  Special Allocations
                </Link>
              </li>
              <li>
                <Link to="/private-commercial" className="hover:text-[#c0a483]">
                  Private Functions
                </Link>
              </li>
              <li>
                <Link to="/private-commercial" className="hover:text-[#c0a483]">
                  Commercial
                </Link>
              </li>
              <li>
                <Link to="/free-draw" className="hover:text-[#c0a483]">
                  Free Draw
                </Link>
              </li>
              <li>
                <Link to="/limited-time-offers" className="hover:text-[#c0a483]">
                  Limited Time Offers
                </Link>
              </li>
            </ul>
          </div>

          {/* Discover More */}
          <div>
            <h3 className="text-[#6ec1e4] text-xl uppercase font-bold mb-4">Discover More</h3>
            <ul className="space-y-2 text-gray-600">
              <li>
                <a
                  href="https://www.facebook.com/LiquorOn1ine"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#c0a483]"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/liquoronlineliquor/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#c0a483]"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://www.tiktok.com/@liquoronline"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#c0a483]"
                >
                  TikTok
                </a>
              </li>
              <li>
                <Link to="/jobs" className="hover:text-[#c0a483]">
                  Jobs
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#c0a483]">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>


        {/* Bottom Footer */}
        <div className="border-t border-gray-200 pt-6 mt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600 w-[90%] mx-auto">
          <p>Copyright © {new Date().getFullYear()} Liquor Online.</p>
          <div className="mt-4 md:mt-0">
            <img
              src={paymentIcons}
              alt="Payment Methods"
              className="h-8"
            />
          </div>
        </div>
      </div>
    </footer>
    </>
  );
};

export default Footer;
