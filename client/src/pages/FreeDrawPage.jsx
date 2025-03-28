import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import GolfVaCay20252psd from '../assets/images/GolfVaCay20252psd.png';
import { FaFacebook } from 'react-icons/fa';

const FreeDrawPage = () => {
  useEffect(() => {
    document.title = 'VIP Golf Weekend Free Draw - Liquor Online';
  }, []);

  const [checked, setChecked] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8 max-w-xl">
      <div className="bg-white border border-gray-200 shadow-sm">
        {/* Header with entries and days left */}
        <div className="flex justify-between border-b p-4 text-center">
          <div className="text-center flex-1 border-r">
            <div className="font-bold">0</div>
            <div className="text-gray-500 text-sm">Your Entries</div>
          </div>
          <div className="text-center flex-1">
            <div className="font-bold">57</div>
            <div className="text-gray-500 text-sm">Days Left</div>
          </div>
        </div>

        {/* Contest graphic */}
        <div className="p-4">
          <div className="flex justify-center">
            {/* <div className="relative">
              <div className="bg-blue-800 rounded-lg p-6 text-white text-center relative">
                <div className="absolute left-2 -top-4 transform -rotate-15">
                  <div className="bg-yellow-500 text-red-600 font-bold py-1 px-3">
                    WIN
                  </div>
                </div>
                <div className="absolute -left-4 top-10">
                  <div className="bg-green-400 w-8 h-8 transform rotate-45"></div>
                </div>
                <div className="absolute -right-4 top-10">
                  <div className="bg-green-400 w-8 h-8 transform rotate-45"></div>
                </div>
                <div className="text-3xl font-black leading-tight mb-2">
                  VIP GOLF<br />VACATION
                </div>
                <div className="text-sm font-medium">VALUED AT</div>
                <div className="text-yellow-400 text-4xl font-black">$1250!</div>
              </div>
            </div> */}
          </div>
          <img src={GolfVaCay20252psd} alt="VIP Golf Vacation" className='w-full' />
        </div>

        {/* Contest title and info */}
        <div className="text-center p-4">
          <h1 className="text-lg font-bold mb-2">VIP GOLF WEEKEND</h1>

          <p className="text-sm mb-1">
            Register below to be automatically Entered into our Free Prize Draw
          </p>
          <p className="text-sm mb-1">for a VIP Golf Trip for 4 People.</p>
          <p className="text-sm mb-1">Prize value is approx $1250.00 !</p>
          <p className="text-sm mb-1">Get more Entries by Visits, Likes & Shares.</p>
          <p className="text-sm mb-1">Prize location: Red Deer AB</p>
          <p className="text-sm mb-1">The Draw Date is July 1st 2025.</p>
          <p className="text-sm mb-1">Good Luck !!</p>
          <p className="text-sm italic mb-4">** eMail Validation Required **</p>

          <div className="mb-2 text-sm">
            Log in to Enter this Giveaway:
          </div>

          <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded transition mb-3">
            Use Your Email
          </button>

          <div className="flex items-center justify-center text-xs mb-2">
            <input 
              type="checkbox" 
              id="terms" 
              className="mr-2"
              checked={checked}
              onChange={() => setChecked(!checked)}
            />
            <label htmlFor="terms">By signing up, you agree to the <span className="text-blue-600">Terms & Conditions</span> for this Contest.</label>
          </div>
        </div>

        {/* Ways to enter */}
        <div className="px-4 pb-6">
          <h2 className="text-center font-bold mb-4">6 Ways to Enter</h2>

          <div className="space-y-2">
            {/* Method 1 */}
            <div className="flex items-center justify-between border border-gray-300 p-3 rounded">
              <div className="flex items-center">
                <div className="bg-yellow-500 w-6 h-6 rounded flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>Automatic Signup Entry</span>
              </div>
              <div className="text-gray-500 text-sm">+1</div>
            </div>

            {/* Method 2 */}
            <div className="flex items-center justify-between border border-gray-300 p-3 rounded">
              <div className="flex items-center">
                <div className="bg-blue-600 w-6 h-6 rounded flex items-center justify-center mr-3">
                  {/* <span className="text-white font-bold text-lg" style={{ marginTop: '-2px' }}>f</span> */}
                  <FaFacebook className='text-white' />
                </div>
                <span>Visit Us on Facebook</span>
              </div>
              <div className="text-gray-500 text-sm">+2</div>
            </div>

            {/* Method 3 */}
            <div className="flex items-center justify-between border border-gray-300 p-3 rounded">
              <div className="flex items-center">
                <div className="bg-blue-600 w-6 h-6 rounded flex items-center justify-center mr-3">
                  {/* <span className="text-white font-bold text-lg" style={{ marginTop: '-2px' }}>f</span> */}
                  <FaFacebook className='text-white' />
                </div>
                <span>View Facebook Post / Video</span>
              </div>
              <div className="text-gray-500 text-sm">+1</div>
            </div>

            {/* Method 4 */}
            <div className="flex items-center justify-between border border-gray-300 p-3 rounded">
              <div className="flex items-center">
                <div className="bg-blue-600 w-6 h-6 rounded flex items-center justify-center mr-3">
                  {/* <span className="text-white font-bold text-lg" style={{ marginTop: '-2px' }}>f</span> */}
                  <FaFacebook className='text-white' />
                </div>
                <span>Like our Facebook Page</span>
              </div>
              <div className="text-gray-500 text-sm">+3</div>
            </div>

            {/* Method 5 */}
            <div className="flex items-center justify-between border border-gray-300 p-3 rounded">
              <div className="flex items-center">
                <div className="bg-blue-600 w-6 h-6 rounded flex items-center justify-center mr-3">
                  {/* <span className="text-white font-bold text-lg" style={{ marginTop: '-2px' }}>f</span> */}
                  <FaFacebook className='text-white' />
                </div>
                <span>Share our Facebook Page</span>
              </div>
              <div className="text-gray-500 text-sm">+4</div>
            </div>

            {/* Method 6 */}
            <div className="flex items-center justify-between border border-gray-300 p-3 rounded">
              <div className="flex items-center">
                <div className="bg-red-600 w-6 h-6 rounded flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>Refer a Friend - Viral</span>
              </div>
              <div className="flex flex-col items-end">
                <div className="text-gray-500 text-sm">+2</div>
                <div className="text-gray-400 text-xs">per referral</div>
              </div>
            </div>
          </div>
        </div>

        {/* reCAPTCHA */}
        <div className="px-4 pb-6 flex justify-center">
          <div className="border border-gray-300 rounded w-full h-16 flex items-center justify-center text-sm text-gray-600 relative">
            <span>protected by reCAPTCHA</span>
            <div className="absolute right-2 bottom-2">
              <img src="https://www.gstatic.com/recaptcha/api2/logo_48.png" alt="reCAPTCHA" className="h-6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreeDrawPage; 