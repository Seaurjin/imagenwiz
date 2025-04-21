import React from 'react';
import { useTranslation } from 'react-i18next';
import FooterPageTemplate from '../../components/FooterPageTemplate';

const Ecommerce = () => {
  const { t } = useTranslation('common');
  
  return (
    <FooterPageTemplate
      title="For E-commerce"
      description="Powerful AI tools to enhance product visuals and boost conversions"
      showGetStarted={true}
    >
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Transform Your Product Photography</h2>
        
        <p className="mb-4">
          In the competitive world of e-commerce, exceptional product photography is essential for standing out and driving 
          conversions. iMagenWiz provides powerful AI-driven tools specifically designed for online retailers to create 
          professional, consistent, and compelling product visuals at scale—without specialized equipment or photography skills.
        </p>
        
        <p className="mb-6">
          From small boutiques to large marketplaces, our intelligent solutions help you create, enhance, and manage product 
          imagery that captures attention and builds customer confidence, resulting in higher engagement and increased sales.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <div className="bg-gradient-to-br from-teal-50 to-blue-50 p-6 rounded-lg border border-teal-100">
            <h3 className="text-xl font-semibold text-teal-800 mb-3">Increase Conversion Rates</h3>
            <p className="text-gray-700">
              E-commerce sites with professional, consistent product imagery see conversion rates increase by up to 40% compared to those with basic product photos.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-teal-50 to-blue-50 p-6 rounded-lg border border-teal-100">
            <h3 className="text-xl font-semibold text-teal-800 mb-3">Reduce Return Rates</h3>
            <p className="text-gray-700">
              Clear, accurate product visuals that match customer expectations can reduce return rates by up to 25%, improving profitability and customer satisfaction.
            </p>
          </div>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">E-commerce-Specific Solutions</h2>
        
        <div className="space-y-8">
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3">Product Background Removal & Replacement</h3>
              <p className="text-gray-600 mb-4">
                Create clean, consistent product listings by automatically removing and replacing backgrounds. Make every product 
                stand out with professional white backgrounds or contextual settings that showcase your items at their best.
              </p>
              <ul className="list-disc ml-5 text-gray-600 space-y-1">
                <li>One-click background removal with edge precision</li>
                <li>Batch process entire product catalogs</li>
                <li>Add lifestyle backgrounds to show products in context</li>
                <li>Create transparent backgrounds for versatile usage</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3">Product Image Enhancement</h3>
              <p className="text-gray-600 mb-4">
                Automatically enhance product photos with professional-grade adjustments to lighting, color, clarity, and detail. 
                Make every product feature visible and appealing, even from challenging smartphone photos.
              </p>
              <ul className="list-disc ml-5 text-gray-600 space-y-1">
                <li>Improve lighting and exposure</li>
                <li>Enhance colors to show true product appearance</li>
                <li>Sharpen details to highlight features</li>
                <li>Remove shadows and glare</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3">Product Variation Generator</h3>
              <p className="text-gray-600 mb-4">
                Quickly create consistent images for product color variants and options without multiple photoshoots. 
                Generate accurate visual representations of every product variation in your catalog.
              </p>
              <ul className="list-disc ml-5 text-gray-600 space-y-1">
                <li>Generate accurate color variants from a single photo</li>
                <li>Create consistent images for different product options</li>
                <li>Maintain lighting and texture across variants</li>
                <li>Ensure color accuracy for customer expectations</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3">Multi-Platform Optimization</h3>
              <p className="text-gray-600 mb-4">
                Automatically create optimized image sets for your website, marketplaces, and social commerce platforms. 
                Ensure your products look great everywhere they're listed with perfectly sized and formatted images.
              </p>
              <ul className="list-disc ml-5 text-gray-600 space-y-1">
                <li>Generate marketplace-specific image formats (Amazon, eBay, Etsy, etc.)</li>
                <li>Create optimized mobile and desktop versions</li>
                <li>Prepare social media product showcases</li>
                <li>Maintain consistent appearance across all platforms</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3">Lifestyle Context Creation</h3>
              <p className="text-gray-600 mb-4">
                Place your products in appealing lifestyle contexts that help customers visualize ownership. Create aspirational 
                imagery that connects emotionally and drives purchasing decisions.
              </p>
              <ul className="list-disc ml-5 text-gray-600 space-y-1">
                <li>Generate virtual room scenes for home products</li>
                <li>Create seasonal and themed lifestyle backdrops</li>
                <li>Show apparel on realistic virtual models</li>
                <li>Add environmental context to product photography</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3">Visual Search Optimization</h3>
              <p className="text-gray-600 mb-4">
                Optimize product images for visual search engines and ensure your products are discoverable across platforms 
                that use image recognition technology for product discovery.
              </p>
              <ul className="list-disc ml-5 text-gray-600 space-y-1">
                <li>Enhance product visibility in Google Lens results</li>
                <li>Optimize for Pinterest visual search</li>
                <li>Improve discoverability in social shopping platforms</li>
                <li>Prepare images for marketplace visual search features</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Integration Options</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-teal-100 text-teal-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Web Platform</h3>
            <p className="text-gray-600 text-sm">
              Process images through our intuitive web interface. Simply upload, enhance, and download—no technical skills required.
            </p>
          </div>
          
          <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-teal-100 text-teal-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">E-commerce Plugins</h3>
            <p className="text-gray-600 text-sm">
              Seamless integration with popular platforms like Shopify, WooCommerce, Magento, and BigCommerce.
            </p>
          </div>
          
          <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-teal-100 text-teal-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">API Access</h3>
            <p className="text-gray-600 text-sm">
              Direct integration with your existing product management systems and workflows via our RESTful API.
            </p>
          </div>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Compatible With Your E-commerce Platform</h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border border-gray-200">
            <svg className="w-12 h-12 text-[#95BF47] mb-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.816 19.6c-.364.037-.725.066-1.08.066-2.868 0-5.491-1.214-7.336-3.263 1.853.097 3.774-.114 5.481-.626 1.878-.487 3.558-1.418 4.935-2.647zm3.977-15.561c2.045 2.452 2.961 5.525 2.604 8.758-.8.072-.158.144-.24.214-.331.288-.746.406-1.152.414-1.55.043-2.75-.977-2.034-2.249.173-.364.361-.72.52-1.09.213-.515.012-1.108-.42-1.296-.77.42-1.316 1.15-2.177 1.08-.927-.07-1.13-1.33-.462-1.841.69-.522 1.562-.75 2.346-1.082.787-.328 1.604-.659 2.36-1.107 1.048-.619-.23-.99-.69-1.374-.517-.473-1.41-.89-1.319-1.545.083-.607.72-.735 1.255-.634.524.103 1.644.39 1.823.67.188.29-.09.652-.414 1.082zm-1.504 10.263c.077-.088.077-.227-.007-.328-.094-.107-.154-.11-.23-.05-.105.081-.139.192-.031.285.108.094.176.17.268.093zm.795-.73c.109-.117.12-.28-.006-.389-.117-.103-.238-.086-.336.035-.105.11-.114.243 0 .357.116.12.237.107.342-.003zm-11.338 5.388c-1.334-1.702-2.39-3.7-2.695-5.99l.037.011c.002.004.004.007.007.01-.005-.012-.016-.007-.039.004 1.11.363 2.191.557 3.305.59 1.261.038 2.502-.088 3.73-.357-1.616 3.14-3.161 4.447-4.345 5.732zm8.146-6.761c-.075.056-.162.108-.24.156-2.066 1.265-4.597 1.938-6.954 1.968-1.373.02-2.81-.174-4.03-.742.056-.024.111-.048.166-.073l.026-.012c2.547-.998 4.872-2.618 6.14-5.14.924-1.835 1.474-4.138.816-6.166.998.745 1.884 1.71 2.62 2.827.802 1.207 1.452 2.605 1.84 4.105.35 1.358.543 2.767.556 4.146.008.881-.086 1.698-.223 2.454-.039.222-.094.43-.149.635a.365.365 0 01-.022.089c-.007.03-.016.06-.027.092-.1.284-.205.559-.325.824.23-.648-.037-1.066-.275-1.246a2.016 2.016 0 00-.351-.224 1.978 1.978 0 01.432.307z"/>
            </svg>
            <span className="text-sm font-medium">Shopify</span>
          </div>
          
          <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border border-gray-200">
            <svg className="w-12 h-12 text-[#7B54A1] mb-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.42 0 0 5.42 0 12s5.42 12 12 12 12-5.42 12-12S18.58 0 12 0zm6.865 6.1a.69.69 0 00-.57-.56c-.85-.15-1.7-.29-2.55-.41-.25-.04-.4-.25-.36-.5.1-.66.26-1.3.52-1.93.03-.05 0-.12-.06-.13-.71-.18-1.43-.31-2.17-.4h-.02c-.08 0-.14.06-.16.14a15.87 15.87 0 00-.46 1.78c-.06.26-.13.53-.2.79-.07.25-.34.36-.57.26-.5-.2-1.02-.35-1.54-.48-.31-.08-.62-.14-.93-.2-.22-.03-.37-.22-.3-.43.47-1.32 1.22-2.5 2.2-3.5.04-.04.04-.1-.01-.13C9.92.53 8.46.13 7.03.07c-.09 0-.17.06-.2.15-.32 1.03-.48 2.1-.48 3.2 0 1.28.24 2.51.67 3.65.07.17-.05.35-.23.37-.5.05-1.01.13-1.5.25-.48.12-.95.26-1.42.44-.15.06-.31-.03-.35-.18-.3-1.22-.13-2.57.5-3.65.05-.1.01-.22-.1-.25C2.9 3.4 1.7 3.25.5 3.25c-.1 0-.2.08-.2.18v.2a12.4 12.4 0 00.69 3.92c.05.16-.07.3-.23.28-.66-.07-1.33-.1-2-.1-.05 0-.09.03-.11.07-.03.04-.02.1.01.14 1.72 2.67 4.26 4.7 7.22 5.67.16.05.22.25.1.38a4.9 4.9 0 01-2.52 1.28c-.08.01-.13.1-.12.18 0 .05.03.1.08.13 1.74.94 3.7 1.48 5.8 1.48 1.53 0 2.99-.27 4.35-.78 2.48-.91 4.57-2.5 6.11-4.58 1.34-1.82 2.23-3.99 2.53-6.34a.21.21 0 00-.2-.24h-.03c-.65.06-1.3.06-1.95 0-.08 0-.14-.08-.13-.16.04-.42.05-.84.05-1.27 0-.55-.05-1.1-.15-1.63 0-.07-.07-.12-.13-.12-.04 0-.08.02-.1.05z"/>
            </svg>
            <span className="text-sm font-medium">WooCommerce</span>
          </div>
          
          <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border border-gray-200">
            <svg className="w-12 h-12 text-[#FF6D00] mb-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16.77 7.53c-.31 0-.59.13-.79.35l-.33-.52c.23-.17.38-.45.38-.76 0-.1-.01-.2-.04-.29l.57-.24c.04.09.15.16.25.16.16 0 .29-.13.29-.29s-.13-.29-.29-.29c-.16 0-.29.13-.29.29 0 .03 0 .05.01.08l-.57.24a1.11 1.11 0 00-1.05-.74c-.51 0-.93.34-1.06.81l-.52-.21c.01-.04.02-.09.02-.14 0-.34-.28-.62-.62-.62s-.62.28-.62.62c0 .34.28.62.62.62.19 0 .36-.09.47-.22l.52.21c-.12.12-.19.29-.19.47 0 .35.26.63.59.68v.46c-.34.05-.59.33-.59.68s.26.63.59.68v.49c-.34.05-.59.33-.59.68 0 .27.16.5.38.61l-.33.52c-.19-.22-.48-.35-.79-.35-.59 0-1.07.48-1.07 1.07s.48 1.07 1.07 1.07c.59 0 1.07-.48 1.07-1.07 0-.32-.14-.61-.37-.81l.33-.52c.12.06.26.1.41.1.09 0 .18-.02.26-.05v.66c0 .31.25.57.57.57h1.46c.31 0 .57-.25.57-.57v-.66c.08.03.17.05.26.05.15 0 .28-.04.41-.1l.33.52c-.22.2-.37.49-.37.81 0 .59.48 1.07 1.07 1.07s1.07-.48 1.07-1.07-.48-1.07-1.07-1.07c-.31 0-.59.13-.79.35l-.33-.52c.23-.11.38-.34.38-.61 0-.35-.26-.63-.59-.68v-.49c.34-.05.59-.33.59-.68s-.26-.63-.59-.68v-.46c.34-.05.59-.33.59-.68 0-.18-.07-.35-.19-.47l.52-.21c.11.14.28.22.47.22.34 0 .62-.28.62-.62 0-.34-.28-.62-.62-.62s-.62.28-.62.62c0 .05.01.09.02.14l-.52.21c-.13-.46-.56-.81-1.06-.81-.5 0-.93.34-1.05.74l-.57-.24.01-.08c0-.16-.13-.29-.29-.29-.16 0-.29.13-.29.29s.13.29.29.29c.11 0 .21-.07.25-.16l.57.24c-.03.09-.04.19-.04.29 0 .31.15.59.38.76l-.33.52c-.19-.22-.48-.35-.79-.35-.59 0-1.07.48-1.07 1.07s.48 1.07 1.07 1.07 1.07-.48 1.07-1.07c0-.32-.14-.61-.37-.81l.33-.52c.12.06.26.1.41.1s.28-.04.41-.1l.33.52c-.22.2-.37.49-.37.81 0 .59.48 1.07 1.07 1.07s1.07-.48 1.07-1.07c0-.59-.48-1.07-1.07-1.07M12 0c-4.42 0-8 2.52-8 5.63v2.9C4 11.02 6.37 13 9.63 13.32v2.51l-1.55 2.25c-.37.54-.25 1.28.29 1.65.54.37 1.28.25 1.65-.29l2.46-3.39c.12-.35.04-.72-.29-1.01V12c2.47 0 4.67-.84 6.05-2.18V17c0 2.76-3.58 5-8 5S2 19.76 2 17v-4.86C.77 11 0 9.85 0 8.53v-2.9C0 2.52 3.58 0 8 0c3.09 0 5.85 1.24 7.21 3.14.39.54.41 1.27.07 1.83l-.99 1.6c-.23.37-.68.54-1.1.42-.43-.12-.7-.55-.62-.98.12-.64-.01-1.28-.39-1.85-.47-.7-1.25-1.15-2.18-1.15-1.53 0-2.75 1.22-2.75 2.75S8.47 8.5 10 8.5c.21 0 .42-.02.62-.07.49-.12 1 .13 1.21.6.21.47.03 1.02-.44 1.26-.45.2-.92.31-1.39.31-2.35 0-4.25-1.9-4.25-4.25S7.65 2.1 10 2.1c1.46 0 2.79.71 3.5 1.9.6.98.77 2.07.52 3.12-.32.05-.63.16-.91.31-.1.03-.24.06-.24.2s.14.17.24.2c.07.04.15.06.24.06.2 0 .4-.05.57-.14.16-.8.3-.19.43-.31.37.59 1.27 1 2.31 1 1.39 0 2.5-.69 2.5-1.54 0-.58-.46-1.1-1.16-1.37.01-.02.01-.05.01-.07v-.08C17.37 2.49 14.89 0 12 0"/>
            </svg>
            <span className="text-sm font-medium">Magento</span>
          </div>
          
          <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border border-gray-200">
            <svg className="w-12 h-12 text-[#FF6C2C] mb-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10.45 16.88c-.39.48-.88.84-1.46 1.09-.59.24-1.25.36-1.99.36-1.25 0-2.24-.3-2.97-.9-.73-.6-1.1-1.39-1.1-2.37h2.44c0 .4.16.71.49.93.33.22.72.33 1.17.33.48 0 .88-.09 1.2-.26.32-.17.49-.44.49-.82 0-.34-.15-.58-.45-.71-.3-.14-.78-.29-1.44-.46-.6-.15-1.13-.31-1.59-.48-.46-.17-.86-.45-1.19-.84-.33-.39-.5-.91-.5-1.57 0-.87.37-1.56 1.1-2.07.74-.52 1.64-.78 2.71-.78 1.24 0 2.19.28 2.85.84.66.56.99 1.31.99 2.22H9.26c0-.35-.13-.62-.4-.82-.27-.19-.65-.29-1.14-.29-.43 0-.78.08-1.03.24-.26.16-.38.39-.38.69 0 .33.14.56.43.7.29.14.76.29 1.41.43.69.17 1.26.34 1.7.5.44.17.82.45 1.14.83.32.38.48.91.48 1.57 0 .86-.37 1.57-1.02 2.11z"/>
              <path d="M15.77 18.84c-.57.14-1.19.22-1.85.22-.9 0-1.68-.15-2.33-.45-.65-.3-1.15-.72-1.5-1.27-.35-.55-.53-1.2-.53-1.95V12.5h-1.7v-1.96h1.7V8.05h2.44v2.49h2.71V12.5h-2.71v2.87c0 .45.14.8.42 1.04.28.25.66.37 1.14.37.3 0 .65-.04 1.04-.12l.17 2.18z"/>
              <path d="M24 7.23c-.58-.82-1.32-1.47-2.25-1.95-.92-.48-1.93-.71-3.03-.71-1.1 0-2.12.24-3.04.71-.93.48-1.67 1.13-2.24 1.95-.57.83-.85 1.73-.85 2.72v4.87c0 .99.28 1.9.85 2.72.57.82 1.31 1.47 2.24 1.95.92.48 1.94.72 3.04.72 1.1 0 2.11-.24 3.03-.72.93-.48 1.67-1.13 2.25-1.95.57-.83.85-1.73.85-2.72V9.95c0-.99-.28-1.89-.85-2.72zm-1.58 7.22c0 .39-.07.76-.22 1.1-.15.34-.35.64-.61.91-.26.27-.56.49-.9.66-.34.17-.71.25-1.09.25-.38 0-.74-.08-1.09-.25-.35-.17-.65-.39-.91-.66-.26-.27-.46-.57-.6-.91a2.7 2.7 0 01-.22-1.1V10.3c0-.39.07-.76.22-1.1.14-.34.34-.65.6-.91.26-.26.56-.49.91-.65.35-.16.71-.25 1.09-.25.38 0 .75.09 1.09.25.34.16.64.39.9.65.26.26.46.57.61.91.15.34.22.71.22 1.1v4.15z"/>
              <path d="M16.32 0H7.68C3.44 0 0 3.44 0 7.68v8.64C0 20.56 3.44 24 7.68 24h8.64c4.24 0 7.68-3.44 7.68-7.68V7.68C24 3.44 20.56 0 16.32 0zm4.93 14.1a5.7 5.7 0 01-1.56 3.99 6.78 6.78 0 01-4.08 2.27c-.36.05-.72.07-1.09.07-.37 0-.74-.02-1.1-.07a6.82 6.82 0 01-4.07-2.27 5.7 5.7 0 01-1.57-3.99V9.93a5.7 5.7 0 011.57-3.98 6.78 6.78 0 014.07-2.27c.36-.05.73-.08 1.1-.08.37 0 .73.03 1.09.08a6.78 6.78 0 014.08 2.27 5.7 5.7 0 011.56 3.98v4.17z"/>
            </svg>
            <span className="text-sm font-medium">BigCommerce</span>
          </div>
          
          <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border border-gray-200">
            <svg className="w-12 h-12 text-[#FF4C00] mb-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.22 14.04c-.47 0-.9-.16-1.23-.44-.45.89-1.37 1.47-2.4 1.47-1.05 0-1.97-.59-2.42-1.47-.33.28-.75.44-1.22.44-.89 0-1.65-.59-1.9-1.4v5.23c0 .62.5 1.13 1.13 1.13h8.8c.62 0 1.13-.5 1.13-1.13v-5.23c-.24.81-1 1.4-1.9 1.4zm1.91-8.95v.55c0 1.05-.86 1.91-1.91 1.91-.47 0-.9-.17-1.23-.45-.45.89-1.37 1.48-2.4 1.48-1.04 0-1.97-.59-2.42-1.48-.33.28-.75.45-1.22.45-1.06 0-1.91-.86-1.91-1.91v-.55h11.09zM12 5.98c.52 0 .94.42.94.94s-.42.94-.94.94-.94-.42-.94-.94.42-.94.94-.94zM11.98 0C5.36 0 0 5.36 0 11.98c0 2.03.51 3.94 1.4 5.62l1.55-6.32v-.32c0-1.07.55-2.01 1.38-2.55-.04-.18-.07-.37-.07-.56V5.12c0-.62.5-1.12 1.12-1.12h13.25c.62 0 1.12.5 1.12 1.12v2.73c0 .19-.02.38-.07.56.83.54 1.38 1.48 1.38 2.55v.32l1.55 6.32a11.93 11.93 0 001.4-5.62C24 5.36 18.64 0 11.98 0z"/>
            </svg>
            <span className="text-sm font-medium">Etsy</span>
          </div>
          
          <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border border-gray-200">
            <svg className="w-12 h-12 text-[#F5AF00] mb-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.552 6.153a.607.607 0 0 0 .526-.915c-.576-.952-1.683-1.532-2.908-1.532h-4.968c-.864 0-1.474.398-1.875.974-.4-.576-1.011-.974-1.875-.974H6.484c-.864 0-1.474.398-1.875.974-.4-.576-1.01-.974-1.875-.974H1.83c-1.225 0-2.332.58-2.908 1.532a.608.608 0 0 0 .526.915h1.327c-.25.289-.38.64-.38 1.016v10.016c0 .847.686 1.534 1.533 1.534H15c.847 0 1.533-.687 1.533-1.534V10.23c0-.847.687-1.534 1.534-1.534h.533a.595.595 0 0 0 .595-.595v-.331c0-.376-.132-.727-.38-1.016h.76c-.248.289-.38.64-.38 1.016v.331a.595.595 0 0 0 .596.595h.533c.847 0 1.534.687 1.534 1.534v6.955c0 .847-.687 1.534-1.534 1.534h-.896a.602.602 0 0 0 0 1.206h.896c1.512 0 2.74-1.227 2.74-2.74V10.23c0-.378-.132-.727-.38-1.016h1.327c.864 0 1.474-.398 1.875-.974.4.576 1.01.974 1.875.974h1.53a.598.598 0 0 0 .594-.61.597.597 0 0 0-.593-.585H24c-1.225 0-2.332.58-2.908 1.532a.608.608 0 0 0 .526.915h.934zm-6.485 11.032c0 .182-.148.328-.328.328H1.928a.327.327 0 0 1-.328-.328V7.168c0-.181.147-.328.328-.328h13.812c.18 0 .327.147.327.328v9.968c0 .008 0 .017-.001.026 0 .007 0 .015.001.022z"/>
            </svg>
            <span className="text-sm font-medium">eBay</span>
          </div>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">How E-commerce Businesses Benefit</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
            <div className="p-6">
              <div className="italic text-gray-600 mb-4">
                "Since implementing iMagenWiz for our product imagery, we've seen a 28% increase in conversion rates and significantly reduced our photography costs. The ability to quickly create product variants and lifestyle contexts has been a game-changer for our online store."
              </div>
              <div className="font-semibold">Emily Chen</div>
              <div className="text-sm text-gray-500">E-commerce Manager, Urban Collection</div>
            </div>
          </div>
          
          <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
            <div className="p-6">
              <div className="italic text-gray-600 mb-4">
                "As a marketplace with thousands of products, maintaining consistent imagery was impossible before iMagenWiz. Now we can automatically enhance seller uploads and ensure a professional look across our entire catalog. Our bounce rates are down and average time on product pages has increased by 45%."
              </div>
              <div className="font-semibold">Marcus Johnson</div>
              <div className="text-sm text-gray-500">Product Director, GlobalMarket</div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">E-commerce Plans</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-lg mb-2">Business</h3>
            <div className="text-3xl font-bold mb-4">$49<span className="text-sm font-normal text-gray-500">/month</span></div>
            <p className="text-gray-600 mb-4">
              Perfect for small to medium e-commerce stores.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Up to 1,000 product images per month</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Background removal & replacement</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Basic e-commerce platform integration</span>
              </li>
            </ul>
            <a 
              href="/pricing" 
              className="inline-block w-full py-2 px-4 border border-transparent rounded-md text-center font-medium text-white bg-teal-600 hover:bg-teal-700"
            >
              Get Started
            </a>
          </div>
          
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-lg mb-2">Enterprise</h3>
            <div className="text-3xl font-bold mb-4">Custom</div>
            <p className="text-gray-600 mb-4">
              For large e-commerce stores and marketplaces.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Unlimited product processing</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Advanced API integration</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Dedicated support & onboarding</span>
              </li>
            </ul>
            <a 
              href="/contact" 
              className="inline-block w-full py-2 px-4 border border-teal-600 rounded-md text-center font-medium text-teal-600 bg-white hover:bg-teal-50"
            >
              Contact Sales
            </a>
          </div>
        </div>
      </section>
    </FooterPageTemplate>
  );
};

export default Ecommerce;