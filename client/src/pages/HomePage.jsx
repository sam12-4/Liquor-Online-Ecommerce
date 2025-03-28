import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import { ArrowRightIcon, StarIcon } from '@heroicons/react/24/solid';
import { TruckIcon, ShieldCheckIcon, GiftIcon } from '@heroicons/react/24/outline';
import { FaQuoteLeft, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { getFilters } from '../data/productLoader';
import { useProducts } from '../context/ProductContext';
import AnimatedSection from '../components/home/AnimatedSection';
import ProductCard from '../components/product/ProductCard';

// Import local images
import bottleImage from '../assets/images/opus-1.png';
import opus from '../assets/images/opus.png';
import louisxllBottle from '../assets/images/louisxlll-1455T.png';
import leChemin from '../assets/images/LeChemin1455.png';
import scotchBottle from '../assets/images/scotch455.png';
import dodhombBottle from '../assets/images/dodhomb455T.png';
import vintageCollectionsBanner from '../assets/images/banner1.jpg';
import winesBanner from '../assets/images/banner2.jpg';
import redWineImg from '../assets/images/redwine.jpg';
import cognacImg from '../assets/images/cognac.jpg';
import tequilaImg from '../assets/images/tequila.jpg';
import rumImg from '../assets/images/rum.jpg';
import beerImg from '../assets/images/beercat1.jpg';
import promoBanner from '../assets/images/banner11.jpg';
import banner12 from '../assets/images/banner12.jpg';
import banner13 from '../assets/images/banner13.jpg';
import banner14 from '../assets/images/banner14.jpg';
import banner15 from '../assets/images/banner15.jpg';
import testimonyDF from '../assets/images/DF.jpg';
import testimonyLK from '../assets/images/LK.jpg';
import testimonyFS from '../assets/images/FS.jpg';
import testimonyTH from '../assets/images/TH.jpg';
import imgTitle from '../assets/images/img-title.png';

// Import specific brand images 
import krakenLogo from '../assets/images/kracken250x92u.jpg';
import crownRoyalLogo from '../assets/images/crownroyal250x92u.jpg';
import bushmillsLogo from '../assets/images/bushmills250x92u.jpg';
import glenfiddichLogo from '../assets/images/glenfiddich250x92u.jpg';
import budweiserLogo from '../assets/images/bud250x92u.jpg';
import stellaLogo from '../assets/images/stella250x92u.jpg';
import jackDanielsLogo from '../assets/images/jackdaniels250x92u.jpg';
import macallanLogo from '../assets/images/macallun250x92u.jpg';
import coronaLogo from '../assets/images/corona250x92u.jpg';
import bacardiLogo from '../assets/images/Bacardi250x92u.jpg';
import hennesyLogo from '../assets/images/heineken250x92u.jpg';

// Background slide images
import slide1 from '../assets/images/Slide1.jpg';
import slide2 from '../assets/images/Slide2697f.jpg';
import slide3 from '../assets/images/slide3697f.jpg';
import slide4 from '../assets/images/slide4697.jpg';
import slide5 from '../assets/images/slide5697.jpg';

const HomePage = () => {
  // Use the ProductContext to get products
  const { products, loading, error } = useProducts();
  
  // Add state for filters
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  // Load filters when products are available
  useEffect(() => {
    const initFilters = async () => {
      try {
        const { categories: cats, brands: brnds } = await getFilters();
        setCategories(cats);
        setBrands(brnds);
      } catch (error) {
        console.error('Error loading filters:', error);
      }
    };

    if (products.length > 0) {
      initFilters();
    }
  }, [products]);

  useEffect(() => {
    document.title = 'Liquor Online - Best Online Liquor Store in Canada';
  }, []);

  // Add state to track the active slide and animation state
  const [activeIndex, setActiveIndex] = useState(0);
  const [slideChanged, setSlideChanged] = useState(false);

  // Function to determine background transition effect
  const getBackgroundTransition = (effect, isActive) => {
    switch (effect) {
      case 'fade':
        return isActive ? 'opacity-100' : 'opacity-0';
      case 'slide':
        return isActive ? 'translate-x-0' : '-translate-x-full';
      case 'zoom':
        return isActive ? 'scale-100 opacity-100' : 'scale-150 opacity-0';
      case 'flip':
        return isActive ? 'rotateY-0 opacity-100' : 'rotateY-90 opacity-0';
      case 'rotate':
        return isActive ? 'rotate-0 scale-100 opacity-100' : 'rotate-12 scale-110 opacity-0';
      default:
        return isActive ? 'opacity-100' : 'opacity-0';
    }
  };

  // Get featured products for different sections using the products from context
  const featuredProducts = products.filter(product => product.isFeatured || product.featured === 'true').slice(0, 5);
  const recentProducts = products.slice(0, 5);
  const specialProducts = products.filter(product => product.isSpecial || product.isSpecial === 'true').slice(0, 5);
  // Use isTrending field first, but fall back to isHot if needed to ensure we have trending products
  const trendingProducts = products.filter(product => product.isTrending || product.isTrending === 'true' || product.isHot || product.isHot === 'true').slice(0, 8);
  const recommendedProducts = products.filter(product => product.isRecommended || product.isRecommended === 'true').slice(0, 5);
  const champagnes = products.filter(product => 
    (product.category?.toLowerCase() === 'wine' || product['tax:product_cat']?.toLowerCase() === 'wine') && 
    (product.type?.toLowerCase() === 'champagne' || product['tax:product_type']?.toLowerCase() === 'champagne')
  ).slice(0, 5);

  const liquorCategories = [
    { 
      title: 'Champagnes', 
      image: opus,
      backgroundImage: slide1,
      transitionEffect: 'fade',
      products: champagnes
    },
    { 
      title: 'Scotch', 
      image: scotchBottle,
      backgroundImage: slide2,
      transitionEffect: 'slide'
    },
    { 
      title: 'Cognac', 
      image: louisxllBottle,
      backgroundImage: slide3,
      transitionEffect: 'zoom'
    },
    { 
      title: 'Wines', 
      image: leChemin,
      backgroundImage: slide4,
      transitionEffect: 'flip'
    },
    { 
      title: 'Spirits', 
      image: dodhombBottle,
      backgroundImage: slide5,
      transitionEffect: 'rotate'
    }
  ];

  return (
    <div className="bg-white">

      {/* Hero Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 md:mt-6 mb-4 md:mb-8 px-4 sm:px-8 md:px-16 lg:px-24 max-w-screen-2xl mx-auto">
        {/* Left Side - Champagnes Carousel */}
        <div className="relative h-[400px] md:h-[500px] overflow-hidden">
        <Swiper
            modules={[Pagination, Autoplay, EffectFade]}
            pagination={{
              clickable: true
            }}
          autoplay={{ delay: 5000 }}
          loop={true}
            effect="fade"
            className="h-full carousel-liquor"
            onSlideChange={(swiper) => {
              setActiveIndex(swiper.realIndex);
              setSlideChanged(true);
              setTimeout(() => setSlideChanged(false), 100); // Reset after animation starts
            }}
          >
            {liquorCategories.map((category, index) => (
              <SwiperSlide key={index}>
                <div
                  className="relative h-full flex flex-col justify-center pb-8 md:pb-16"
                  style={{
                    backgroundImage: `url(${category.backgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  {/* Background with transition effect */}
                  <div
                    className={`absolute inset-0 bg-black bg-opacity-50 transition-transform duration-1000 transform ${activeIndex === index ? getBackgroundTransition(category.transitionEffect, true) : getBackgroundTransition(category.transitionEffect, false)
                      }`}
                  ></div>

                  {/* Content container with better positioning */}
                  <div className="relative z-20 flex flex-col items-start justify-end h-full pl-6 sm:pl-10 md:pl-16 pb-16 md:pb-32 w-full md:w-3/5">
                    <h2
                      className="text-white text-4xl sm:text-5xl md:text-6xl font-bold tracking-wide uppercase mb-3 md:mb-6"
                      style={{
                        animation: activeIndex === index ?
                          `${index % 2 === 0 ? 'slideInLeft' : 'slideInUp'} 0.7s ease-out` : 'none',
                        opacity: activeIndex === index ? 1 : 0,
                        transform: activeIndex === index ? 'translateX(0)' : 'translateX(-50px)'
                      }}
                    >
                    {category.title}
                  </h2>
                  
                    <Link
                      to={`/shop?category=${category.title.toLowerCase()}`}
                      className="flex items-center border border-white text-white py-1 sm:py-2 px-4 sm:px-6 rounded-full hover:bg-[#c0a483] hover:border-[#c0a483] hover:text-white transition-colors"
                      style={{
                        animation: activeIndex === index ? 'fadeIn 1s ease-out 0.4s both' : 'none'
                      }}
                    >
                      Shop Collection
                      <ArrowRightIcon className="h-4 w-4 ml-2 " />
                    </Link>
                  </div>
                  
                <motion.div
                    className="absolute inset-0 flex items-center justify-end pr-0 sm:pr-6 md:pr-12 z-10"
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ 
                      x: activeIndex === index ? 0 : 100,
                      opacity: activeIndex === index ? 1 : 0,
                    }}
                    transition={{ 
                      type: "spring",
                      stiffness: 50,
                      damping: 20,
                      duration: 0.8,
                    }}
                  >
                    <img 
                      src={category.image}
                      alt={category.title}
                      className="h-[280px] sm:h-[320px] md:h-[400px] object-contain"
                    />
                  </motion.div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          
          {/* Add custom styles for this specific carousel pagination */}
          <style jsx="true">{`
            .carousel-liquor .swiper-pagination-bullet {
              width: 10px;
              height: 10px;
              background: rgba(128, 128, 128, 0.5);
              opacity: 1;
              margin: 0 4px;
            }
            .carousel-liquor .swiper-pagination-bullet-active {
              background: #ffffff;
            }
          `}</style>
              </div>
        
        {/* Right Side - Two Banners */}
        <div className="flex flex-col gap-4">
          {/* Top Banner - Vintage Collections */}
          <div className="relative h-[200px] sm:h-[240px] overflow-hidden group">
            <img 
              src={vintageCollectionsBanner} 
              alt="Vintage Collections" 
              className="w-full h-full object-cover transition-all duration-300 group-hover:grayscale"
            />
            <div className="absolute inset-0 flex flex-col justify-center p-4 sm:p-8">
              <span className="text-white uppercase tracking-wide text-xs sm:text-sm font-medium">NEW ARRIVALS</span>
              <h3 className="text-white text-3xl sm:text-4xl font-bold mt-1">Vintage<br />Collections</h3>
              <Link 
                to="/shop?collection=vintage" 
                className="mt-3 md:mt-4 bg-[#b12a2a] hover:bg-[#c0a483] text-white py-1 sm:py-2 px-4 sm:px-6 rounded-full inline-block w-fit"
              >
                Shop now
              </Link>
            </div>
          </div>
          
          {/* Bottom Banner - Fine Red & White Wines */}
          <div className="relative h-[200px] sm:h-[240px] overflow-hidden group">
            <img 
              src={winesBanner} 
              alt="Fine Red & White Wines" 
              className="w-full h-full object-cover transition-all duration-300 group-hover:grayscale"
            />
            <div className="absolute inset-0 flex flex-col justify-center p-4 sm:p-8">
              <span className="text-white uppercase tracking-wide text-xs sm:text-sm font-medium">SPECIAL SELECTION</span>
              <h3 className="text-white text-3xl sm:text-4xl font-bold mt-1">Fine Red & White<br />Wines</h3>
                  <Link
                to="/shop?category=wine" 
                className="mt-3 md:mt-4 bg-[#b12a2a] hover:bg-[#c0a483] text-white py-1 sm:py-2 px-4 sm:px-6 rounded-full inline-block w-fit"
                  >
                    Shop now
                  </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Categories */}
      <section className="py-8 md:py-12 bg-white overflow-hidden">
        <div className="px-4 mb-6 md:mb-10 container mx-auto">
          <h2 className="text-center text-2xl md:text-3xl uppercase mb-2">POPULAR CATEGORIES</h2>
          <div className="flex justify-center">
            <img src={imgTitle} alt="decorative element" className="my-2 md:my-3" />
          </div>
        </div>
        
        {/* Full-width carousel container with no padding */}
        <div className="relative w-[90%] sm:w-[85%] md:w-[80%] mx-auto">
          {/* Previous button - updated to match brands gold circular buttons */}
          <div
            className="categories-button-prev absolute -left-2 sm:-left-4 md:-left-8 top-1/2 transform -translate-y-1/2 z-10 w-8 h-8 md:w-10 md:h-10 bg-[#c0a483] hover:bg-black rounded-full flex items-center justify-center text-white cursor-pointer transition-colors duration-300"
          >
            <FaChevronLeft className="text-xs md:text-base" />
          </div>
          
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={25}
            slidesPerView={5}
            pagination={{ 
              clickable: true,
              el: '.category-pagination' 
            }}
            navigation={{
              prevEl: '.categories-button-prev',
              nextEl: '.categories-button-next'
            }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false
            }}
            breakpoints={{
              320: { slidesPerView: 1 },
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 5 },
            }}
            className="mx-0"
            loop={true}
          >
            <SwiperSlide>
              <div className="flex flex-col items-center">
                <img src={cognacImg} alt="Cognac" className="h-64 object-contain mb-4" />
                <h4 className="uppercase text-lg font-medium tracking-wide">COGNAC</h4>
              </div>
            </SwiperSlide>
            
            <SwiperSlide>
              <div className="flex flex-col items-center">
                <img src={tequilaImg} alt="Tequila" className="h-64 object-contain mb-4" />
                <h4 className="uppercase text-lg font-medium tracking-wide">TEQUILA</h4>
              </div>
            </SwiperSlide>
            
            <SwiperSlide>
              <div className="flex flex-col items-center">
                <img src={rumImg} alt="Rum" className="h-64 object-contain mb-4" />
                <h4 className="uppercase text-lg font-medium tracking-wide">RUM</h4>
              </div>
            </SwiperSlide>
            
            <SwiperSlide>
              <div className="flex flex-col items-center">
                <img src={beerImg} alt="Beer" className="h-64 object-contain mb-4" />
                <h4 className="uppercase text-lg font-medium tracking-wide">BEER</h4>
              </div>
            </SwiperSlide>
            
            <SwiperSlide>
              <div className="flex flex-col items-center">
                <img src={redWineImg} alt="Red Wine" className="h-64 object-contain mb-4" />
                <h4 className="uppercase text-lg font-medium tracking-wide">RED WINE</h4>
              </div>
            </SwiperSlide>
            
            {/* Additional slides for loop */}
            <SwiperSlide>
              <div className="flex flex-col items-center">
                <img src={cognacImg} alt="Cognac" className="h-64 object-contain mb-4" />
                <h4 className="uppercase text-lg font-medium tracking-wide">COGNAC</h4>
              </div>
            </SwiperSlide>
            
            <SwiperSlide>
              <div className="flex flex-col items-center">
                <img src={tequilaImg} alt="Tequila" className="h-64 object-contain mb-4" />
                <h4 className="uppercase text-lg font-medium tracking-wide">TEQUILA</h4>
              </div>
            </SwiperSlide>
          </Swiper>
          
          {/* Next button - updated to match brands gold circular buttons */}
          <div
            className="categories-button-next absolute -right-2 sm:-right-4 md:-right-8 top-1/2 transform -translate-y-1/2 z-10 w-8 h-8 md:w-10 md:h-10 bg-[#c0a483] hover:bg-black rounded-full flex items-center justify-center text-white cursor-pointer transition-colors duration-300"
          >
            <FaChevronRight className="text-xs md:text-base" />
          </div>
        </div>
        
        {/* Pagination dots with updated styling */}
        <div className="category-pagination flex justify-center gap-2 mt-8">
          {/* Swiper will inject the dots here with our styling */}
        </div>

        {/* Add custom CSS for pagination dots and fix button visibility */}
        <style jsx="true">{`
          .category-pagination .swiper-pagination-bullet {
            width: 10px;
            height: 10px;
            background: #e0e0e0;
            opacity: 1;
          }
          .category-pagination .swiper-pagination-bullet-active {
            background: #c0a483;
          }
          
          /* Override Swiper's default button styles */
          .categories-button-prev::after,
          .categories-button-next::after,
          .brands-button-prev::after,
          .brands-button-next::after {
            display: none;
          }
          
          /* Ensure buttons are clickable with proper z-index */
          .categories-button-prev,
          .categories-button-next {
            z-index: 20;
          }
        `}</style>
      </section>

      {/* Special Deal Banner */}
      <section className="py-0 bg-white w-full">
        <div className="w-full">
          <div className="relative overflow-hidden bg-cover bg-center h-[300px] md:h-[400px] lg:h-[500px]" style={{ backgroundImage: `url(${promoBanner})` }}>
            <div className="absolute inset-0"></div>
            <div className="relative z-10 container mx-auto h-full flex flex-col justify-center items-end px-4 sm:px-8 md:px-16">
              <AnimatedSection>
                <h3 className="text-base sm:text-lg md:text-xl font-medium text-black uppercase mb-1 md:mb-2 tracking-widest">LIQUOR ONLINE</h3>
                <div className="py-1 md:py-2 mb-2 md:mb-4 ">
                  <h2 className="text-xl sm:text-2xl md:text-4xl text-black tracking-wide">FINE  WINE,  SPIRITS  &  <br />BEER  SINCE  2021</h2>
              </div>
                <p className="text-sm md:text-base  text-[#868686] mb-4 md:mb-8 max-w-xl">
                  Liquor Online provides over 1600 Alberta Retailers with up to date SKUs, Images, Descriptions, and Customized Pricing to match specific Inventories.
                </p>
                <Link
                  to="/shop?special=true"
                  className="bg-black hover:bg-[#c0a483] text-white font-medium py-2 md:py-3 px-6 md:px-8 inline-flex items-center transition-all duration-300"
                >
                  DISCOVERY <ArrowRightIcon className="h-4 w-4 md:h-5 md:w-5 ml-2" />
                </Link>
            </AnimatedSection>
              </div>
          </div>
        </div>
      </section>

      {/* Recommendations */}
      <section className="py-8 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl text-black uppercase">
              RECOMMENDATIONS
            </h2>
            <div className="flex justify-center mt-2 md:mt-4 mb-4 md:mb-8">
              <img src={imgTitle} alt="Decorative ornament" className="w-auto" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {recommendedProducts.filter(product => product.isHot).slice(0, 4).map((product, index) => (
              <AnimatedSection key={product.id} delay={index * 0.1} className="h-full">
                <div className="bg-white text-center relative">
                  {/* Image container with border */}
                  <div className="border border-gray-100 p-4 mb-4 relative">
                    <div className="absolute top-4 right-4 bg-[#c0a483] text-white text-xs px-3 py-1 font-medium">
                      Hot
          </div>
                    <div className="h-64 flex items-center justify-center relative">
                      {/* Watermark background */}
                      <div className="absolute inset-0 z-0 flex flex-col justify-center overflow-hidden opacity-10 w-full h-full">
                        {[...Array(10)].map((_, row) => (
                          <div key={row} className="flex whitespace-nowrap w-full">
                            {[...Array(10)].map((_, col) => (
                              <span
                                key={`${row}-${col}`}
                                className="text-transparent font-bold whitespace-nowrap py-4"
                                style={{
                                  fontSize: '2rem',
                                  WebkitTextStroke: '1px #c0a483',
                                  textStroke: '1px #c0a483',
                                  letterSpacing: '0.01em'
                                }}
                              >
                                LIQUOR ONLINE&nbsp;
                              </span>
                            ))}
        </div>
                        ))}
              </div>
                      {/* Product image */}
                      <img
                        src={product.image}
                        alt={product.name}
                        className="max-h-full max-w-full object-contain relative z-10"
                      />
              </div>
              </div>
                  {/* Text outside of border */}
                  <div className="pt-2">
                    <h3 className="text-xs md:text-sm uppercase font-bold tracking-wider mb-2 text-center">{product.name}</h3>
                    <p className="text-[#c0a483] font-bold text-lg">${product.price.toLocaleString()}</p>
                  </div>
              </div>
            </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Panels Section */}
      <section className="py-8 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 w-full">
            {/* Wine In Time Club Panel */}
            <div className="relative overflow-hidden md:col-span-4 group w-full md:w-[35%] mx-auto">
              <div className="absolute inset-[15px] border border-white z-10 pointer-events-none"></div>
              <img
                src={banner13}
                alt="Wine In Time Club"
                className="w-full h-[300px] md:h-[400px] object-cover transition-all duration-500 group-hover:grayscale"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-end text-center p-6 md:p-10">
                <div>
                </div>
                <div>
                  <p className="text-white text-xs sm:text-sm font-serif uppercase mb-1 md:mb-2">No Commitment</p>
                  <h3 className="text-white text-xl sm:text-2xl font-serif uppercase mb-2 md:mb-3">WINE IN TIME CLUB</h3>
                  <Link
                    to="/club"
                    className="mt-auto text-white uppercase text-xs sm:text-sm tracking-wider relative group"
                  >
                    <span>JOIN NOW</span>
                    <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-full h-[2px] bg-white group-hover:w-[40%] transition-all duration-500"></span>
                </Link>
              </div>
              </div>
            </div>

            {/* Liquor Online Panel */}
            <div className="relative overflow-hidden md:col-span-4 group w-full md:w-[25%] mx-auto">
              <div className="absolute inset-[15px] border border-white z-10 pointer-events-none"></div>
              <img
                src={banner14}
                alt="Liquor Online"
                className="w-full h-[300px] md:h-[400px] object-cover transition-all duration-500 group-hover:grayscale"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-end text-center p-6 md:p-10">
                <div></div>
                <div>
                  <h3 className="text-white text-xl sm:text-2xl font-serif uppercase mb-2 md:mb-3">LIQUOR ONLINE</h3>
                  <Link
                    to="/contact"
                    className="mt-auto text-white uppercase text-xs sm:text-sm tracking-wider relative group"
                  >
                    <span>CONTACT US TODAY</span>
                    <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-full h-[2px] bg-white group-hover:w-[40%] transition-all duration-500"></span>
                </Link>
              </div>
          </div>
        </div>

            {/* Virtual Tasting Panel */}
            <div className="relative overflow-hidden md:col-span-4 group w-full md:w-[35%] mx-auto">
              <div className="absolute inset-[15px] border border-white z-10 pointer-events-none"></div>
              <img
                src={banner15}
                alt="Virtual Tasting & Events"
                className="w-full h-[300px] md:h-[400px] object-cover transition-all duration-500 group-hover:grayscale"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-end text-center p-6 md:p-10">
                <div>
                </div>
                <div>
                  <p className="text-white text-xs sm:text-sm font-serif uppercase mb-1 md:mb-2">Virtual</p>
                  <h3 className="text-white text-xl sm:text-2xl font-serif uppercase mb-2 md:mb-3">TASTING & EVENTS</h3>
                <Link
                    to="/events"
                    className="mt-auto text-white uppercase text-xs sm:text-sm tracking-wider relative group"
                >
                    <span>LEARN MORE</span>
                    <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-full h-[2px] bg-white group-hover:w-[40%] transition-all duration-500"></span>
                </Link>
            </div>
          </div>
        </div>
          </div>
        </div>
      </section>


      {/* Trending */}
      <section className="py-8 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl text-black uppercase">
              TRENDING Products
            </h2>
            <div className="flex justify-center mt-2 md:mt-4 mb-4 md:mb-8">
              <img src={imgTitle} alt="Decorative ornament" className="w-auto" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {trendingProducts.filter(product => product.isTrending).slice(0, 4).map((product, index) => (
              <AnimatedSection key={product.id} delay={index * 0.1} className="h-full">
                <div className="bg-white text-center relative">
                  {/* Image container with border */}
                  <div className="border border-gray-100 p-4 mb-4 relative">
                    <div className="absolute top-4 right-4 bg-[#c0a483] text-white text-xs px-3 py-1 font-medium">
                      Trending
                    </div>
                    <div className="h-64 flex items-center justify-center relative">
                      {/* Watermark background */}
                      <div className="absolute inset-0 z-0 flex flex-col justify-center overflow-hidden opacity-10 w-full h-full">
                        {[...Array(10)].map((_, row) => (
                          <div key={row} className="flex whitespace-nowrap w-full">
                            {[...Array(10)].map((_, col) => (
                              <span
                                key={`${row}-${col}`}
                                className="text-transparent font-bold whitespace-nowrap py-4"
                                style={{
                                  fontSize: '2rem',
                                  WebkitTextStroke: '1px #c0a483',
                                  textStroke: '1px #c0a483',
                                  letterSpacing: '0.01em'
                                }}
                              >
                                LIQUOR ONLINE&nbsp;
                              </span>
                            ))}
        </div>
                        ))}
              </div>
                      {/* Product image */}
                      <img
                        src={product.image}
                        alt={product.name}
                        className="max-h-full max-w-full object-contain relative z-10"
                      />
              </div>
              </div>
                  {/* Text outside of border */}
                  <div className="pt-2">
                    <h3 className="text-xs md:text-sm uppercase font-bold tracking-wider mb-2 text-center">{product.name}</h3>
                    <p className="text-[#c0a483] font-bold text-lg">${product.price.toLocaleString()}</p>
                  </div>
              </div>
            </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-8 md:py-16 relative">
        <div className="absolute inset-0 z-0 w-full h-full">
          <img src={banner12} alt="Background" className="w-full h-full object-cover" />
          <div className="absolute inset-0"></div>
        </div>

        <div className="container px-4 relative z-10">
          <div className="max-w-full sm:max-w-2xl md:max-w-4xl md:mx-0 mx-auto">
            <Swiper
              modules={[Pagination, Autoplay]}
              spaceBetween={0}
              slidesPerView={1}
              pagination={{
                clickable: true,
                el: '.testimonial-pagination'
              }}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false
              }}
              loop={true}
              className="testimonial-swiper"
            >
              <SwiperSlide>
                <div className="text-center px-4 md:px-20">
                  <div className="flex justify-center mb-4 md:mb-6">
                    <FaQuoteLeft className="text-[#c0a483] text-4xl md:text-7xl" />
                  </div>
                  <div className="flex justify-center mb-4 md:mb-6">
                    {[...Array(4)].map((_, i) => (
                      <StarIcon key={i} className="h-4 w-4 md:h-5 md:w-5 text-[#ffc107]" />
                  ))}
                </div>
                  <p className="text-black text-lg sm:text-2xl md:text-[30px] leading-[28px] sm:leading-[32px] md:leading-[35px] mb-6 md:mb-8 font-serif font-normal">
                    Liquor Online updated our full database and products to perfectly sync with LiquorConnect, BDL, and all other major distributors. They saved us months or work!
              </p>
                  <div className="flex flex-col items-center">
                    <img
                      src={testimonyDF}
                      alt="Darrell Forbes"
                      className="w-12 h-12 md:w-16 md:h-16 rounded-full mb-2 md:mb-3 border-2 border-[#c0a483]"
                    />
                    <h4 className="font-serif text-gray-800 uppercase font-bold text-sm md:text-base">Darrell Forbes</h4>
                </div>
              </div>
              </SwiperSlide>

              <SwiperSlide>
                <div className="text-center px-4 md:px-20">
                  <div className="flex justify-center mb-4 md:mb-6">
                    <FaQuoteLeft className="text-[#c0a483] text-4xl md:text-7xl" />
                  </div>
                  <div className="flex justify-center mb-4 md:mb-6">
                    {[...Array(4)].map((_, i) => (
                      <StarIcon key={i} className="h-4 w-4 md:h-5 md:w-5 text-[#ffc107]" />
                  ))}
                </div>
                  <p className="text-black text-lg sm:text-2xl md:text-[30px] leading-[28px] sm:leading-[32px] md:leading-[35px] mb-6 md:mb-8 font-serif font-normal">
                    Liquor Online has saved us thousands of dollars by keeping our store inventory and POS systems all up to date with real-time data every week .. highly recommended !!
              </p>
                  <div className="flex flex-col items-center">
                    <img
                      src={testimonyLK}
                      alt="Lyndsey Kletchco"
                      className="w-12 h-12 md:w-16 md:h-16 rounded-full mb-2 md:mb-3 border-2 border-[#c0a483]"
                    />
                    <h4 className="font-serif text-gray-800 uppercase font-bold text-sm md:text-base">Lyndsey Kletchco</h4>
                </div>
              </div>
              </SwiperSlide>

              <SwiperSlide>
                <div className="text-center px-4 md:px-20">
                  <div className="flex justify-center mb-4 md:mb-6">
                    <FaQuoteLeft className="text-[#c0a483] text-4xl md:text-7xl" />
                  </div>
                  <div className="flex justify-center mb-4 md:mb-6">
                    {[...Array(4)].map((_, i) => (
                      <StarIcon key={i} className="h-4 w-4 md:h-5 md:w-5 text-[#ffc107]" />
                    ))}
        </div>
                  <p className="text-black text-lg sm:text-2xl md:text-[30px] leading-[28px] sm:leading-[32px] md:leading-[35px] mb-6 md:mb-8 font-serif font-normal">
                    We were never able to have our order desk, warehouse, shipping and product SKU's, names and labels to all match until Liquor Online came to the rescue .. now we can update all LTO's, discontinued, new items and new products automatically in minutes.
              </p>
                  <div className="flex flex-col items-center">
                    <img
                      src={testimonyFS}
                      alt="Frank Sommers"
                      className="w-12 h-12 md:w-16 md:h-16 rounded-full mb-2 md:mb-3 border-2 border-[#c0a483]"
                    />
                    <h4 className="font-serif text-gray-800 uppercase font-bold text-sm md:text-base">Frank Sommers</h4>
                </div>
              </div>
              </SwiperSlide>

              <SwiperSlide>
                <div className="text-center px-4 md:px-20">
                  <div className="flex justify-center mb-4 md:mb-6">
                    <FaQuoteLeft className="text-[#c0a483] text-4xl md:text-7xl" />
          </div>
                  <div className="flex justify-center mb-4 md:mb-6">
                    {[...Array(4)].map((_, i) => (
                      <StarIcon key={i} className="h-4 w-4 md:h-5 md:w-5 text-[#ffc107]" />
                    ))}
        </div>
                  <p className="text-black text-lg sm:text-2xl md:text-[30px] leading-[28px] sm:leading-[32px] md:leading-[35px] mb-6 md:mb-8 font-serif font-normal">
                    The best online liquor store in Alberta! I've been using them for years and they never disappoint.
                  </p>
                  <div className="flex flex-col items-center">
                    <img
                      src={testimonyTH}
                      alt="ted houston"
                      className="w-12 h-12 md:w-16 md:h-16 rounded-full mb-2 md:mb-3 border-2 border-[#c0a483]"
                    />
                    <h4 className="font-serif text-gray-800 uppercase font-bold text-sm md:text-base">ted houston</h4>
        </div>
                </div>
              </SwiperSlide>
            </Swiper>

            <div className="testimonial-pagination flex justify-center gap-2 mt-6 md:mt-10"></div>
          </div>
        </div>
      </section>

      {/* Brands Carousel */}
      <section className="py-8 md:py-16 bg-white">
        <div className="container mx-auto px-4 w-[90%] sm:w-[85%] md:w-[80%]">
          <div className="text-center mb-6 md:mb-10">
            <h2 className="text-2xl md:text-3xl font-serif mb-2 md:mb-4 relative uppercase">
              TOP BRANDS
            </h2>
            <img src={imgTitle} alt="Decorative ornament" className="h-6 md:h-8 w-auto mx-auto" />
          </div>

          <div className="relative">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={30}
              slidesPerView={5}
              navigation={{
                prevEl: '.brands-button-prev',
                nextEl: '.brands-button-next',
              }}
              pagination={{
                clickable: true,
                el: '.brands-pagination',
              }}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              loop={true}
              className="brands-swiper"
              breakpoints={{
                320: {
                  slidesPerView: 2,
                  spaceBetween: 20,
                },
                640: {
                  slidesPerView: 3,
                  spaceBetween: 20,
                },
                768: {
                  slidesPerView: 4,
                  spaceBetween: 30,
                },
                1024: {
                  slidesPerView: 5,
                  spaceBetween: 30,
                },
              }}
            >
              <SwiperSlide>
                <div className="flex items-center justify-center h-20">
                  <img src={krakenLogo} alt="Kraken" className="max-h-16 object-contain" />
            </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="flex items-center justify-center h-20">
                  <img src={crownRoyalLogo} alt="Crown Royal" className="max-h-16 object-contain" />
        </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="flex items-center justify-center h-20">
                  <img src={bushmillsLogo} alt="Bushmills" className="max-h-16 object-contain" />
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="flex items-center justify-center h-20">
                  <img src={glenfiddichLogo} alt="Glenfiddich" className="max-h-16 object-contain" />
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="flex items-center justify-center h-20">
                  <img src={budweiserLogo} alt="Budweiser" className="max-h-16 object-contain" />
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="flex items-center justify-center h-20">
                  <img src={stellaLogo} alt="Stella Artois" className="max-h-16 object-contain" />
              </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="flex items-center justify-center h-20">
                  <img src={jackDanielsLogo} alt="Jack Daniels" className="max-h-16 object-contain" />
                  </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="flex items-center justify-center h-20">
                  <img src={macallanLogo} alt="Macallan" className="max-h-16 object-contain" />
                  </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="flex items-center justify-center h-20">
                  <img src={coronaLogo} alt="Corona" className="max-h-16 object-contain" />
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="flex items-center justify-center h-20">
                  <img src={bacardiLogo} alt="Bacardi" className="max-h-16 object-contain" />
                  </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="flex items-center justify-center h-20">
                  <img src={hennesyLogo} alt="Heineken" className="max-h-16 object-contain" />
                  </div>
              </SwiperSlide>
            </Swiper>

            {/* Custom Navigation Buttons - keeping the gold circular styling only here */}
            <div className="brands-button-prev absolute -left-3 sm:-left-6 md:-left-10 top-1/2 transform -translate-y-1/2 z-10 w-8 h-8 md:w-10 md:h-10 bg-[#c0a483] hover:bg-black rounded-full flex items-center justify-center text-white cursor-pointer transition-colors duration-300">
              <FaChevronLeft className="text-xs md:text-base" />
                </div>
            <div className="brands-button-next absolute -right-3 sm:-right-6 md:-right-10 top-1/2 transform -translate-y-1/2 z-10 w-8 h-8 md:w-10 md:h-10 bg-[#c0a483] hover:bg-black rounded-full flex items-center justify-center text-white cursor-pointer transition-colors duration-300">
              <FaChevronRight className="text-xs md:text-base" />
              </div>

            {/* Pagination Dots */}
            <div className="brands-pagination flex justify-center gap-1 mt-8"></div>
          </div>

          <style jsx="true">{`
            .brands-button-prev::after,
            .brands-button-next::after {
              display: none;
            }
            
            .brands-pagination .swiper-pagination-bullet {
              width: 8px;
              height: 8px;
              background: #e0e0e0;
              opacity: 1;
            }
            
            .brands-pagination .swiper-pagination-bullet-active {
              background: #000;
            }
          `}</style>
        </div>
      </section>

      

      {/* Add CSS keyframes for animations */}
      <style jsx="true">{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fadeInLeft {
          from { 
            opacity: 0;
            transform: translateX(-50px);
          }
          to { 
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeInRight {
          from { 
            opacity: 0;
            transform: translateX(50px);
          }
          to { 
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInLeft {
          from { 
            opacity: 0;
            transform: translateX(-100px);
          }
          to { 
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInUp {
          from { 
            opacity: 0;
            transform: translateY(50px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes zoomIn {
          from {
            opacity: 0;
            transform: scale(1.5);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes zoomOut {
          from {
            opacity: 0;
            transform: scale(0.5);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes rotateIn {
          from {
            opacity: 0;
            transform: rotate(15deg) scale(1.2);
          }
          to {
            opacity: 1;
            transform: rotate(0) scale(1);
          }
        }
        
        @keyframes flipIn {
          from {
            opacity: 0;
            transform: perspective(400px) rotateY(90deg);
          }
          to {
            opacity: 1;
            transform: perspective(400px) rotateY(0);
          }
        }
        
        /* Swiper custom animations */
        .swiper-slide-active h2,
        .swiper-slide-active .shop-btn {
          animation-fill-mode: both;
        }
      `}</style>

    </div>
  );
};

export default HomePage;
