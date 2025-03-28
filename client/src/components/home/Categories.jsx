import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const categories = [
  {
    id: 1,
    name: 'Wines',
    image: 'https://ext.same-assets.com/1701767421/2884727806.png',
    link: '/shop?category=wine'
  },
  {
    id: 2,
    name: 'Scotch',
    image: 'https://ext.same-assets.com/1701767421/458812689.png',
    link: '/shop?category=spirits&type=scotch'
  },
  {
    id: 3,
    name: 'Champagnes',
    image: 'https://ext.same-assets.com/0/2034363354.svg',
    link: '/shop?category=wine&type=champagne'
  },
  {
    id: 4,
    name: 'Cognac',
    image: 'https://ext.same-assets.com/0/2637691418.svg',
    link: '/shop?category=spirits&type=cognac'
  },
  {
    id: 5,
    name: 'Spirits',
    image: 'https://ext.same-assets.com/1701767421/2633843034.png',
    link: '/shop?category=spirits'
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const Categories = () => {
  return (
    <section className="py-16 bg-light">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="section-title">Popular Categories</h2>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
        >
          {categories.map((category) => (
            <motion.div key={category.id} variants={item} className="category-item">
              <Link
                to={category.link}
                className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm transition-transform duration-300 hover:shadow-md hover:-translate-y-1"
              >
                <div className="h-32 flex items-center justify-center mb-4">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="h-full object-contain"
                  />
                </div>
                <h3 className="text-lg font-semibold text-center text-dark">{category.name}</h3>
                <span className="text-primary mt-2 text-sm font-medium">Shop Collection</span>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Banner Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          {/* Vintage Collections Banner */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative h-80 overflow-hidden rounded-lg"
          >
            <img
              src="https://ext.same-assets.com/1701767421/1355704146.jpeg"
              alt="Vintage Collections"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex flex-col justify-center px-8">
              <h3 className="text-white text-2xl font-bold mb-2">
                Vintage <br />
                Collections
              </h3>
              <p className="text-white/80 mb-6 max-w-xs">
                Discover our selection of rare and exceptional vintage wines and spirits
              </p>
              <Link
                to="/shop?tag=vintage-collection"
                className="btn btn-outline text-sm px-6 inline-block w-max"
              >
                Shop now
              </Link>
            </div>
          </motion.div>

          {/* Fine Wines Banner */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative h-80 overflow-hidden rounded-lg"
          >
            <img
              src="https://ext.same-assets.com/1701767421/1204111697.jpeg"
              alt="Fine Wines"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex flex-col justify-center px-8">
              <h3 className="text-white text-2xl font-bold mb-2">
                Fine Red & White<br />
                Wines
              </h3>
              <p className="text-white/80 mb-6 max-w-xs">
                Explore our curated collection of premium red and white wines from around the world
              </p>
              <Link
                to="/shop?category=wine&orderby=price-desc"
                className="btn btn-outline text-sm px-6 inline-block w-max"
              >
                Shop now
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Categories;
