import { useEffect } from 'react';
import { motion } from 'framer-motion';
import AnimatedSection from '../components/common/AnimatedSection';

const AboutPage = () => {
  useEffect(() => {
    document.title = 'About Us | Liquor Store';
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <AnimatedSection>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-dark mb-6">About Us</h1>
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="prose lg:prose-lg max-w-none">
              <p className="text-lg text-gray-600 mb-8">
                Welcome to our premium liquor store, where we pride ourselves on offering an exceptional selection of spirits, wines, and craft beers to satisfy every palate and occasion.
              </p>
              
              <h2 className="text-2xl font-bold mb-4">Our Story</h2>
              <p className="mb-6">
                Founded in 2010, our journey began with a simple passion for quality spirits and a desire to create a curated shopping experience for enthusiasts and casual consumers alike. What started as a small boutique has grown into a destination for those seeking both classic favorites and rare finds.
              </p>
              
              <div className="mb-8">
                <img 
                  src="https://images.unsplash.com/photo-1569529465841-dfecdab7503b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                  alt="Our store" 
                  className="rounded-lg w-full h-auto mb-4"
                />
                <p className="text-sm text-gray-500 text-center">Our flagship store located in downtown</p>
              </div>
              
              <h2 className="text-2xl font-bold mb-4">Our Philosophy</h2>
              <p className="mb-6">
                We believe that every bottle tells a story - of tradition, craftsmanship, and innovation. Our team is dedicated to helping you discover these stories through carefully selected products that represent the best from around the world.
              </p>
              
              <h2 className="text-2xl font-bold mb-4">Quality & Selection</h2>
              <p className="mb-6">
                Each product in our inventory is selected with care, focusing on quality, authenticity, and value. From small-batch bourbons to limited-edition wines, we strive to offer products that meet our exacting standards and will delight our customers.
              </p>
              
              <h2 className="text-2xl font-bold mb-4">Responsibility</h2>
              <p className="mb-6">
                We are committed to promoting responsible drinking. We strictly adhere to age verification processes and encourage our customers to enjoy our products in moderation and with responsibility.
              </p>
              
              <h2 className="text-2xl font-bold mb-4">Community</h2>
              <p className="mb-6">
                We're proud to be part of our local community and regularly participate in events, tastings, and educational sessions that bring people together to appreciate the rich culture surrounding fine spirits and wines.
              </p>
              
              <h2 className="text-2xl font-bold mb-4">Visit Us</h2>
              <p>
                We invite you to visit our store, meet our knowledgeable staff, and explore our extensive collection. Whether you're seeking advice on a perfect pairing or looking to expand your collection with something special, we're here to help.
              </p>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
};

export default AboutPage; 