import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import { motion, AnimatePresence } from 'framer-motion';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

const heroSlides = [
  {
    id: 1,
    image: 'https://ext.same-assets.com/1701767421/2441443055.jpeg',
    title: 'Fine Wine, Spirits & Beer Since 2021',
    subtitle: 'Discover our exceptional collection of premium alcoholic beverages',
    link: '/shop',
    buttonText: 'Shop Now'
  },
  {
    id: 2,
    image: 'https://ext.same-assets.com/1701767421/4199861433.jpeg',
    title: 'Vintage Collections',
    subtitle: 'Rare and exceptional wines from around the world',
    link: '/shop?tag=vintage-collection',
    buttonText: 'Explore Collection'
  },
  {
    id: 3,
    image: 'https://ext.same-assets.com/1701767421/2369561328.jpeg',
    title: 'Limited Edition Whiskeys',
    subtitle: 'Discover our selection of rare and premium whiskeys',
    link: '/shop?category=spirits&type=whiskey&limited=true',
    buttonText: 'Shop Collection'
  },
  {
    id: 4,
    image: 'https://ext.same-assets.com/1701767421/945471438.jpeg',
    title: 'Special Allocations',
    subtitle: 'Exclusive spirits allocated to us in limited quantities',
    link: '/shop?tag=special-allocations',
    buttonText: 'Discover More'
  }
];

const Hero = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  return (
    <section className="relative h-[80vh] overflow-hidden bg-black">
      <Swiper
        spaceBetween={0}
        centeredSlides={true}
        effect="fade"
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        onSlideChange={(swiper) => setActiveSlide(swiper.activeIndex)}
        className="w-full h-full"
      >
        {heroSlides.map((slide) => (
          <SwiperSlide key={slide.id} className="relative">
            <div
              className="h-full w-full bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
              <AnimatePresence>
                {activeSlide === heroSlides.indexOf(slide) && (
                  <div className="absolute inset-0 flex items-center justify-center px-4 md:px-12">
                    <div className="max-w-2xl text-center text-white">
                      <motion.h1
                        className="text-3xl md:text-5xl font-bold mb-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                      >
                        {slide.title}
                      </motion.h1>
                      <motion.p
                        className="text-lg md:text-xl mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                      >
                        {slide.subtitle}
                      </motion.p>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                      >
                        <Link
                          to={slide.link}
                          className="btn btn-primary px-8 py-3 text-lg"
                        >
                          {slide.buttonText}
                        </Link>
                      </motion.div>
                    </div>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Hero;
