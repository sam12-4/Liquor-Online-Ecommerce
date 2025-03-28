import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { motion } from 'framer-motion';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

const testimonials = [
  {
    id: 1,
    text: "Liquor Online updated our old database and products to perfectly sync with our retail and fully updated our website. They work as smoothly as distributors. They catch all mistalkes.",
    image: "https://ext.same-assets.com/1701767421/2712695797.jpeg",
    name: "Davis Fletcher",
    position: "Wine Enthusiast"
  },
  {
    id: 2,
    text: "Getting started with Liquor Online has been a wonderful experience. The team guided us through every step, and now we're seeing real results with online sales. I'm impressed by their dedication.",
    image: "https://ext.same-assets.com/1701767421/2445671703.jpeg",
    name: "Lisa Kearney",
    position: "Store Owner"
  },
  {
    id: 3,
    text: "We were never able to keep our select products that be reserved from overselling like before. But since joining Liquor Online, we've had real-time inventory management and it's been a game-changer for our business.",
    image: "https://ext.same-assets.com/1701767421/4266947056.jpeg",
    name: "Frank Simmons",
    position: "Beverage Director"
  },
  {
    id: 4,
    text: "The team at Liquor Online has worked with thousands of small businesses and POS systems all up by hand with real-time integration. Our customers love using the online service. Highly recommended!",
    image: "https://ext.same-assets.com/1701767421/1332226794.jpeg",
    name: "Teresa Henson",
    position: "Business Owner"
  }
];

const Testimonials = () => {
  return (
    <section className="py-16 bg-light">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Image Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-xl overflow-hidden"
          >
            <img
              src="https://ext.same-assets.com/1701767421/860825473.jpeg"
              alt="Wine Tasting"
              className="w-full h-auto lg:h-[500px] object-cover"
            />
            <div className="absolute inset-0 bg-primary/20"></div>
          </motion.div>

          {/* Testimonials Column */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-left mb-10">
              <h2 className="text-3xl font-bold mb-3 text-dark">The Reviews</h2>
              <hr className="w-16 border-primary border-2 mb-6" />
              <p className="text-gray-600">
                See what our customers and partners have to say about their experience with Liquor Online.
              </p>
            </div>

            <Swiper
              modules={[Autoplay, Pagination]}
              spaceBetween={30}
              slidesPerView={1}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
              pagination={{
                clickable: true,
              }}
              className="testimonial-swiper"
            >
              {testimonials.map((testimonial) => (
                <SwiperSlide key={testimonial.id}>
                  <div className="bg-white p-8 rounded-lg shadow-sm mb-8">
                    <div className="mb-6">
                      <svg
                        className="text-primary w-10 h-10 mb-2 opacity-20"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M11.192 15.757c0-.88-.23-1.618-.69-2.217-.326-.412-.768-.683-1.327-.812-.55-.128-1.07-.137-1.54-.028-.16-.95.1-1.626.41-2.032.76-1.018 1.79-1.436 3.067-1.436v-2.172c-.95 0-1.846.137-2.696.41-.85.274-1.573.642-2.17 1.105-.796.739-1.446 1.645-1.917 2.717-.47 1.073-.706 2.32-.69 3.74.015 1.214.29 2.274.831 3.178.54.904 1.465 1.356 2.768 1.356 1.134 0 2.016-.378 2.647-1.13.63-.756.945-1.754.945-2.997v-.033zm12 0c0-.88-.23-1.618-.69-2.217-.326-.42-.77-.695-1.327-.83-.57-.144-1.089-.156-1.56-.036-.17-.836.09-1.554.4-2.154.31-.6.7-1.148 1.187-1.64 1.565-1.58 3.664-2.366 6.26-2.366v-2.172c-2.35 0-4.585.572-6.695 1.72-2.11 1.144-3.843 3.026-5.195 5.63-.47 1.073-.707 2.32-.69 3.74.014 1.214.29 2.274.83 3.178.54.904 1.465 1.356 2.77 1.356 1.133 0 2.015-.378 2.646-1.13.63-.756.944-1.754.944-2.997v-.033z" />
                      </svg>
                      <p className="text-gray-600 italic mb-4">{testimonial.text}</p>
                    </div>
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold text-dark">{testimonial.name}</h4>
                        <p className="text-sm text-gray-500">{testimonial.position}</p>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
