import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import FooterPageTemplate from '../../components/FooterPageTemplate';
import { Coffee, Tag, Sun, Star, Clock, Sparkles, DollarSign, Image } from 'lucide-react';

const SuccessStories = () => {
  const { t } = useTranslation('common');
  
  return (
    <FooterPageTemplate
      title="Success Stories"
      description="See how real customers are transforming their businesses with iMagenWiz"
      showGetStarted={true}
    >
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">How Businesses Transform with AI-Powered Imagery</h2>
        
        <p className="mb-4 text-lg text-gray-700">
          Discover how organizations of all sizes use iMagenWiz to overcome visual content challenges, 
          streamline production, and achieve remarkable business results. Our customers are saving time, 
          reducing costs, and creating stunning visuals that drive engagement and growth.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
          <div className="bg-gradient-to-br from-teal-50 to-blue-50 p-6 rounded-lg border border-teal-100">
            <h3 className="text-xl font-semibold text-teal-800 mb-3">70% Time Savings</h3>
            <p className="text-gray-700">
              On average, our customers report saving over 70% of the time previously spent on image editing and optimization tasks.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-teal-50 to-blue-50 p-6 rounded-lg border border-teal-100">
            <h3 className="text-xl font-semibold text-teal-800 mb-3">3x Content Output</h3>
            <p className="text-gray-700">
              Businesses using iMagenWiz typically produce three times more visual content with the same team and resources.
            </p>
          </div>
        </div>
      </section>
      
      {/* Featured Success Story 1 - Deep Blue Diving Cafe */}
      <section className="mb-16 bg-white shadow-xl rounded-xl overflow-hidden border border-gray-100">
        <div className="md:flex">
          <div className="md:w-2/5 bg-gradient-to-br from-blue-600 to-teal-500 p-8 text-white">
            <div className="flex items-center mb-4">
              <Coffee className="h-8 w-8 mr-3" />
              <h2 className="text-2xl font-bold">Deep Blue Diving Café</h2>
            </div>
            <div className="space-y-4 mb-6">
              <div className="flex items-center">
                <Tag className="h-5 w-5 mr-2 opacity-70" />
                <span>Food & Beverage, Shanghai</span>
              </div>
              <div className="flex items-center">
                <Sun className="h-5 w-5 mr-2 opacity-70" />
                <span>Independent Café</span>
              </div>
              <div className="flex items-center">
                <Sparkles className="h-5 w-5 mr-2 opacity-70" />
                <span>Product Design & Marketing</span>
              </div>
            </div>
            <div className="p-4 bg-white/10 rounded-lg backdrop-blur-sm mt-8">
              <div className="flex items-center mb-2">
                <Star className="h-5 w-5 text-yellow-300 mr-1" />
                <Star className="h-5 w-5 text-yellow-300 mr-1" />
                <Star className="h-5 w-5 text-yellow-300 mr-1" />
                <Star className="h-5 w-5 text-yellow-300 mr-1" />
                <Star className="h-5 w-5 text-yellow-300 mr-1" />
              </div>
              <p className="italic text-sm">
                "iMagenWiz has become our secret weapon for creating unique menu items and promotional materials that truly capture our ocean-inspired atmosphere."
              </p>
              <div className="mt-3 text-sm font-medium">
                — Lin Wei, Owner & Head Barista
              </div>
            </div>
          </div>
          
          <div className="md:w-3/5 p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Creating Inspired Products in a Competitive Market</h3>
            
            <div className="prose prose-teal max-w-none text-gray-600">
              <p>
                Deep Blue Diving Café, a unique themed coffee shop in Shanghai, faced the challenge of continuously creating new menu items and promotional materials that would stand out in the city's crowded café market while maintaining their diving theme.
              </p>
              
              <h4 className="text-lg font-semibold text-gray-800 mt-6 mb-3">The Challenge</h4>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <span className="text-teal-500 mr-2">•</span>
                  <span>Needed fresh ocean and diving-inspired designs for seasonal menu items</span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-500 mr-2">•</span>
                  <span>Limited design budget but required professional-quality visuals</span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-500 mr-2">•</span>
                  <span>Tight turnaround times for promotional campaigns</span>
                </li>
              </ul>
              
              <h4 className="text-lg font-semibold text-gray-800 mt-6 mb-3">iMagenWiz Solution</h4>
              <p>
                By utilizing iMagenWiz's AI-powered design capabilities, Deep Blue Diving Café now creates stunning underwater-themed food and beverage presentations, promotional materials, and social media content that perfectly captures their unique brand identity.
              </p>
              
              <div className="grid grid-cols-2 gap-4 my-6">
                <div className="bg-teal-50 p-4 rounded-lg">
                  <div className="flex items-center text-teal-600 mb-2">
                    <Clock className="h-5 w-5 mr-2" />
                    <span className="font-medium">Design Time</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Reduced from 8 hours to just 45 minutes per new menu item
                  </p>
                </div>
                
                <div className="bg-teal-50 p-4 rounded-lg">
                  <div className="flex items-center text-teal-600 mb-2">
                    <Image className="h-5 w-5 mr-2" />
                    <span className="font-medium">Content Created</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    3x more social media content with the same staff resources
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 text-gray-900">
              <h4 className="text-lg font-semibold mb-3">Results</h4>
              <p className="mb-4">
                Since implementing iMagenWiz, Deep Blue Diving Café has seen a 35% increase in social media engagement and a 22% increase in sales for their new specialty menu items. They've been able to refresh their menu seasonally without hiring additional design help, saving approximately ¥50,000 per year in design costs.
              </p>
              <blockquote className="italic border-l-4 border-teal-500 pl-4 my-4 text-gray-600">
                "The speed at which we can now visualize new product ideas has completely transformed our creative process. What used to take weeks now happens in a single afternoon session."
              </blockquote>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Success Story 2 - NeoAnime Studios */}
      <section className="mb-16 bg-white shadow-xl rounded-xl overflow-hidden border border-gray-100">
        <div className="md:flex flex-row-reverse">
          <div className="md:w-2/5 bg-gradient-to-br from-purple-600 to-pink-500 p-8 text-white">
            <div className="flex items-center mb-4">
              <Sparkles className="h-8 w-8 mr-3" />
              <h2 className="text-2xl font-bold">NeoAnime Studios</h2>
            </div>
            <div className="space-y-4 mb-6">
              <div className="flex items-center">
                <Tag className="h-5 w-5 mr-2 opacity-70" />
                <span>Animation & Merchandise, Tokyo</span>
              </div>
              <div className="flex items-center">
                <Sun className="h-5 w-5 mr-2 opacity-70" />
                <span>Mid-size Animation Studio</span>
              </div>
              <div className="flex items-center">
                <Sparkles className="h-5 w-5 mr-2 opacity-70" />
                <span>IP Merchandising & Product Design</span>
              </div>
            </div>
            <div className="p-4 bg-white/10 rounded-lg backdrop-blur-sm mt-8">
              <div className="flex items-center mb-2">
                <Star className="h-5 w-5 text-yellow-300 mr-1" />
                <Star className="h-5 w-5 text-yellow-300 mr-1" />
                <Star className="h-5 w-5 text-yellow-300 mr-1" />
                <Star className="h-5 w-5 text-yellow-300 mr-1" />
                <Star className="h-5 w-5 text-yellow-300 mr-1" />
              </div>
              <p className="italic text-sm">
                "iMagenWiz has revolutionized how we create merchandise designs for our anime characters. What used to take weeks now happens in days, with better quality."
              </p>
              <div className="mt-3 text-sm font-medium">
                — Tanaka Hiroshi, Merchandising Director
              </div>
            </div>
          </div>
          
          <div className="md:w-3/5 p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Accelerating IP Merchandise Development</h3>
            
            <div className="prose prose-teal max-w-none text-gray-600">
              <p>
                NeoAnime Studios, a popular "二次元" (2D animation) studio in Japan, struggled to efficiently convert their original characters and IP into merchandise designs for their rapidly growing fan base. The traditional design process was too slow to capitalize on trending characters.
              </p>
              
              <h4 className="text-lg font-semibold text-gray-800 mt-6 mb-3">The Challenge</h4>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  <span>Needed to create merchandise designs for over 50 characters across multiple product categories</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  <span>Traditional design process took 3-4 weeks per product line</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  <span>Missing market opportunities due to lengthy design cycles</span>
                </li>
              </ul>
              
              <h4 className="text-lg font-semibold text-gray-800 mt-6 mb-3">iMagenWiz Solution</h4>
              <p>
                Using iMagenWiz's AI imaging platform, NeoAnime Studios implemented a streamlined design workflow that dramatically accelerated their merchandise development. By feeding their character art into the system, they rapidly generated product mockups across t-shirts, phone cases, stationery, and collectibles.
              </p>
              
              <div className="grid grid-cols-2 gap-4 my-6">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center text-purple-600 mb-2">
                    <Clock className="h-5 w-5 mr-2" />
                    <span className="font-medium">Development Time</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Reduced from 3-4 weeks to just 3-5 days per product line
                  </p>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center text-purple-600 mb-2">
                    <DollarSign className="h-5 w-5 mr-2" />
                    <span className="font-medium">Design Cost</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    68% reduction in design costs compared to traditional methods
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 text-gray-900">
              <h4 className="text-lg font-semibold mb-3">Results</h4>
              <p className="mb-4">
                Since implementing iMagenWiz in their design workflow, NeoAnime Studios has increased their merchandise revenue by 47%, launched product lines for trending characters in days rather than weeks, and expanded their product catalog by over 200 new items in six months.
              </p>
              <blockquote className="italic border-l-4 border-purple-500 pl-4 my-4 text-gray-600">
                "The speed and quality of designs we can produce with iMagenWiz has completely transformed our merchandising strategy. We can now respond to fan demand almost immediately, creating products for characters as soon as they become popular."
              </blockquote>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="bg-gradient-to-r from-teal-600 to-blue-700 rounded-xl p-8 text-white text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Write Your Success Story?</h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto">
          Join thousands of businesses transforming their visual content with iMagenWiz's AI-powered platform.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/pricing" className="bg-white text-teal-700 hover:bg-gray-100 font-medium py-3 px-6 rounded-lg transition-colors">
            View Pricing Plans
          </Link>
          <Link to="/contact" className="bg-teal-700 text-white hover:bg-teal-800 font-medium py-3 px-6 rounded-lg border border-teal-500 transition-colors">
            Contact Sales
          </Link>
        </div>
      </section>
    </FooterPageTemplate>
  );
};

export default SuccessStories;