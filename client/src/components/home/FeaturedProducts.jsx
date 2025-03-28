import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { getProducts } from '../../data/productLoader';
import ProductCard from '../product/ProductCard';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const FeaturedProducts = () => {
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const loadedProducts = await getProducts();
        // Filter featured products
        const featured = loadedProducts
          .filter(product => product.isFeatured || product.featured === 'true')
          .slice(0, 8);
        setFeaturedProducts(featured);
        setLoading(false);
      } catch (error) {
        console.error('Error loading featured products:', error);
        setLoading(false);
      }
    };
    
    loadProducts();
  }, []);

  useEffect(() => {
    // Get the products from productLoader (which may be from Excel)
    const products = getProducts();
    const filtered = products.filter(product => product.isRecommended);
    setRecommendedProducts(filtered);
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="section-title">Recommendations</h2>
        </div>

        <div className="relative">
          {/* Desktop View - Grid */}
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendedProducts.slice(0, 8).map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>

          {/* Mobile View - Carousel */}
          <div className="md:hidden">
            <Swiper
              spaceBetween={16}
              slidesPerView={1.2}
              centeredSlides={false}
              pagination={{
                clickable: true,
              }}
              modules={[Pagination]}
              className="pb-10"
            >
              {recommendedProducts.slice(0, 8).map((product) => (
                <SwiperSlide key={product.id}>
                  <ProductCard product={product} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>

        {/* View All Button */}
        <div className="text-center mt-10">
          <Link
            to="/shop?recommended=true"
            className="btn btn-primary inline-block"
          >
            View All Recommendations
          </Link>
        </div>

        {/* Special Products Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 relative h-80 overflow-hidden rounded-lg"
        >
          <img
            src="https://ext.same-assets.com/1701767421/3754063653.jpeg"
            alt="Special Products"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent flex flex-col justify-center items-start px-8 md:px-12">
            <h3 className="text-white text-2xl md:text-4xl font-bold mb-4">
              New Releases<br />
              & Special Allocations
            </h3>
            <p className="text-white/90 mb-6 max-w-md">
              Discover our latest arrivals and limited edition spirits, wines, and more
            </p>
            <Link
              to="/shop?tag=special-allocations"
              className="btn btn-primary text-sm md:text-base px-6 py-3"
            >
              Explore Collection
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
