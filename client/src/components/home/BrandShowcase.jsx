import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { motion } from 'framer-motion';

// Import Swiper styles
import 'swiper/css';

const brands = [
  {
    id: 1,
    name: 'Stella Artois',
    image: 'https://ext.same-assets.com/1701767421/3676044092.jpeg'
  },
  {
    id: 2,
    name: 'Budweiser',
    image: 'https://ext.same-assets.com/1701767421/999813308.png'
  },
  {
    id: 3,
    name: 'Corona',
    image: 'https://ext.same-assets.com/0/2310368.svg'
  },
  {
    id: 4,
    name: 'Heineken',
    image: 'https://ext.same-assets.com/1701767421/2445671703.jpeg'
  },
  {
    id: 5,
    name: 'Jack Daniels',
    image: 'https://ext.same-assets.com/1701767421/4266947056.jpeg'
  },
  {
    id: 6,
    name: 'Johnnie Walker',
    image: 'https://ext.same-assets.com/1701767421/1332226794.jpeg'
  }
];

const BrandShowcase = () => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h2 className="section-title">Popular Brands</h2>
        </motion.div>

        <Swiper
          modules={[Autoplay]}
          spaceBetween={30}
          slidesPerView={2}
          loop={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          breakpoints={{
            640: {
              slidesPerView: 3,
            },
            768: {
              slidesPerView: 4,
            },
            1024: {
              slidesPerView: 6,
            },
          }}
        >
          {brands.map((brand) => (
            <SwiperSlide key={brand.id}>
              <div className="bg-white rounded-lg p-4 h-24 flex items-center justify-center">
                <img
                  src={brand.image}
                  alt={brand.name}
                  className="max-h-full max-w-full object-contain opacity-80 hover:opacity-100 transition-opacity"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default BrandShowcase;
