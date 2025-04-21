import React from 'react';
import { useTranslation } from 'react-i18next';
import FooterPageTemplate from '../../components/FooterPageTemplate';

const Ecommerce = () => {
  const { t } = useTranslation('common');
  
  return (
    <FooterPageTemplate
      title="For Ecommerce"
      description="Powerful AI tools to enhance product imagery and drive conversions"
      showGetStarted={true}
    >
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Transform Your Product Imagery</h2>
        
        <p className="mb-4">
          In the competitive world of ecommerce, product imagery can make or break your conversion rates. iMagenWiz provides 
          specialized solutions for online retailers to create professional, consistent, and compelling product photos that 
          drive sales—without expensive photography equipment or specialized design skills.
        </p>
        
        <p className="mb-6">
          Whether you're managing a small boutique store or a large marketplace, our AI-powered tools help you create, 
          enhance, and manage product imagery at scale, resulting in higher engagement, reduced returns, and increased conversions.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <div className="bg-gradient-to-br from-teal-50 to-blue-50 p-6 rounded-lg border border-teal-100">
            <h3 className="text-xl font-semibold text-teal-800 mb-3">Increase Conversions</h3>
            <p className="text-gray-700">
              High-quality, consistent product imagery has been proven to increase conversion rates by up to 30% in ecommerce settings.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-teal-50 to-blue-50 p-6 rounded-lg border border-teal-100">
            <h3 className="text-xl font-semibold text-teal-800 mb-3">Reduce Returns</h3>
            <p className="text-gray-700">
              Clear, accurate product visuals help customers make informed purchasing decisions, significantly reducing return rates.
            </p>
          </div>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Ecommerce-Specific Solutions</h2>
        
        <div className="space-y-8">
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3">Professional Background Removal</h3>
              <p className="text-gray-600 mb-4">
                Create clean, consistent product images with our one-click background removal tool. Perfect for creating product listings with a professional, cohesive look across your entire catalog.
              </p>
              <ul className="list-disc ml-5 text-gray-600 space-y-1">
                <li>Remove backgrounds from product photos with precision</li>
                <li>Preserve fine details and transparent elements</li>
                <li>Batch process hundreds of images simultaneously</li>
                <li>Apply consistent white or custom colored backgrounds</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3">Product Image Enhancement</h3>
              <p className="text-gray-600 mb-4">
                Transform ordinary product photos into professional-quality images with our AI-powered enhancement tools. Automatically adjust lighting, colors, and sharpness for optimal presentation.
              </p>
              <ul className="list-disc ml-5 text-gray-600 space-y-1">
                <li>Correct color balance and exposure issues</li>
                <li>Enhance product details and textures</li>
                <li>Remove dust, scratches, and minor imperfections</li>
                <li>Create consistent lighting across product lines</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3">Multi-Channel Format Optimization</h3>
              <p className="text-gray-600 mb-4">
                Automatically resize and optimize product images for different platforms and devices. Ensure your products look perfect whether customers are shopping on your website, Amazon, eBay, or social media.
              </p>
              <ul className="list-disc ml-5 text-gray-600 space-y-1">
                <li>Create platform-specific image variants in seconds</li>
                <li>Optimize for desktop, mobile, and marketplace requirements</li>
                <li>Generate square, landscape, and portrait versions automatically</li>
                <li>Maintain consistent quality across all channels</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3">Lifestyle Context Generation</h3>
              <p className="text-gray-600 mb-4">
                Place your products in realistic lifestyle contexts to help customers visualize them in use. Our AI can create natural-looking environmental settings without expensive photo shoots.
              </p>
              <ul className="list-disc ml-5 text-gray-600 space-y-1">
                <li>Generate realistic room settings for furniture and home goods</li>
                <li>Create lifestyle contexts for fashion and accessories</li>
                <li>Develop seasonal displays for holiday merchandise</li>
                <li>Design consistent environmental themes across product lines</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3">Product Variation Management</h3>
              <p className="text-gray-600 mb-4">
                Efficiently create and manage images for multiple product variations. Generate consistent visuals for different colors, sizes, and styles without photographing each variant.
              </p>
              <ul className="list-disc ml-5 text-gray-600 space-y-1">
                <li>Create color variants from a single product photo</li>
                <li>Generate consistent images across product families</li>
                <li>Maintain uniform perspective and lighting across variants</li>
                <li>Batch update seasonal product collections</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3">Ghost Mannequin Effect</h3>
              <p className="text-gray-600 mb-4">
                Create professional invisible mannequin (ghost mannequin) effects for clothing items. Show the shape and fit of garments without visible mannequins or models.
              </p>
              <ul className="list-disc ml-5 text-gray-600 space-y-1">
                <li>Remove mannequins while preserving garment shape</li>
                <li>Create 3D-looking apparel from flat photos</li>
                <li>Maintain consistent presentation across clothing lines</li>
                <li>Process multiple items in batch for entire collections</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Implementation Options</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-teal-100 text-teal-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Web Application</h3>
            <p className="text-gray-600 text-sm">
              Access our full suite of ecommerce image tools through our intuitive web interface. No installation required.
            </p>
          </div>
          
          <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-teal-100 text-teal-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">API Integration</h3>
            <p className="text-gray-600 text-sm">
              Integrate our image processing capabilities directly into your ecommerce platform, PIM system, or custom workflow.
            </p>
          </div>
          
          <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-teal-100 text-teal-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Platform Plugins</h3>
            <p className="text-gray-600 text-sm">
              Use our official plugins for Shopify, WooCommerce, Magento, and other major ecommerce platforms for seamless integration.
            </p>
          </div>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Compatible With Your Platform</h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border border-gray-200">
            <svg className="w-12 h-12 text-[#95bf47] mb-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.569 0C12.569 0 12.567 0 12.563 0C12.563 0 12.457 0 12.392 0C12.097 0 11.583 0.040 11.043 0.124C9.385 0.349 8.086 0.866 7.025 1.434C6.39 1.776 5.849 2.145 5.381 2.520C5.295 2.586 5.211 2.654 5.129 2.722C5.013 2.819 4.899 2.919 4.788 3.019C4.698 3.097 4.609 3.178 4.521 3.260C2.708 4.943 1.553 7.303 1.553 10.123C1.553 10.211 1.553 10.299 1.557 10.385C1.557 10.401 1.557 10.417 1.557 10.433C1.529 11.302 1.702 14.871 4.051 16.791C4.806 17.41 5.804 17.915 7.080 18.227C7.531 18.339 7.959 18.419 8.355 18.485C8.407 18.497 8.461 18.505 8.513 18.517C9.930 18.717 11.081 18.757 11.955 18.715C12.095 18.709 12.227 18.701 12.351 18.689C12.577 18.671 12.779 18.643 12.967 18.615C14.475 18.367 15.487 17.931 16.221 17.471C16.893 17.053 17.385 16.600 17.788 16.172C17.836 16.120 17.886 16.068 17.932 16.014C19.559 14.186 19.759 11.500 19.759 10.022C19.759 9.996 19.759 9.970 19.759 9.944C19.759 9.944 19.759 9.944 19.759 9.944C19.759 9.919 19.759 9.893 19.759 9.865C19.759 9.865 19.759 9.865 19.759 9.865V9.853V9.831C19.759 7.277 18.797 5.022 17.265 3.398C17.201 3.332 17.135 3.267 17.069 3.203C16.969 3.107 16.867 3.013 16.763 2.922C16.479 2.669 16.185 2.436 15.887 2.230C14.775 1.468 13.562 0.980 12.579 0.707C12.574 0.705 12.569 0.704 12.563 0.703C12.563 0.701 12.563 0.701 12.563 0.701C12.563 0.701 12.563 0.700 12.563 0.698C12.563 0.692 12.563 0.686 12.567 0.682C12.567 0.670 12.567 0.658 12.567 0.646C12.567 0.598 12.567 0.549 12.567 0.500V0.298V0.008C12.567 0.004 12.569 0 12.569 0Z M15.841 3.797C15.311 4.009 14.713 4.261 14.106 4.529C14.006 4.255 13.899 3.987 13.787 3.726C13.461 2.982 13.101 2.287 12.703 1.644C14.035 1.969 15.082 2.755 15.841 3.797Z M11.971 5.059C11.541 5.229 11.111 5.403 10.687 5.575C10.643 5.457 10.599 5.340 10.553 5.225C10.059 4.084 9.623 3.078 9.182 2.117C9.930 1.917 10.693 1.807 11.451 1.784C11.639 1.780 11.827 1.778 12.013 1.780C12.427 2.506 12.807 3.295 13.142 4.115C12.759 4.252 12.369 4.394 11.971 5.059Z M5.789 6.539C5.937 6.083 6.271 5.631 6.837 5.179C7.953 4.295 9.693 3.493 12.019 2.771C12.393 3.623 12.750 4.512 13.087 5.431C11.358 6.048 9.552 6.747 7.858 7.394C7.133 7.666 6.429 7.928 5.760 8.174C5.667 7.619 5.647 7.063 5.789 6.539Z M8.657 15.645C8.211 15.325 7.819 14.959 7.497 14.559C6.791 13.669 6.409 12.588 6.429 11.452V11.425C6.429 11.409 6.431 11.393 6.431 11.377C6.433 11.282 6.439 11.186 6.451 11.092C6.457 11.042 6.463 10.992 6.473 10.942C6.533 10.632 6.649 10.336 6.837 10.084C7.173 9.622 7.722 9.344 8.405 9.344C8.745 9.344 9.099 9.400 9.468 9.513C9.470 9.513 9.472 9.514 9.474 9.515C9.474 9.515 9.474 9.515 9.475 9.515C9.890 9.645 10.285 9.834 10.655 10.070C10.663 10.074 10.669 10.080 10.675 10.086C10.913 10.232 11.139 10.399 11.351 10.585C12.421 11.516 13.101 12.913 13.235 14.485C12.715 14.805 12.155 15.057 11.566 15.234C11.026 15.398 10.471 15.490 9.918 15.514C9.903 15.516 9.889 15.516 9.874 15.516C9.449 15.516 9.026 15.459 8.657 15.645Z M14.703 14.189C14.615 13.139 14.189 12.141 13.481 11.312C14.343 10.974 15.093 10.508 15.623 9.929C16.297 9.195 16.585 8.320 16.503 7.362C17.265 8.107 17.805 9.073 17.978 10.157C17.986 10.211 17.992 10.266 17.998 10.320C17.938 12.146 16.621 13.582 14.703 14.189Z M15.323 6.675C15.367 6.715 15.411 6.757 15.453 6.797C15.865 7.223 16.069 7.735 16.033 8.288C15.997 8.841 15.735 9.321 15.273 9.705C14.949 9.978 14.519 10.201 14.000 10.376C13.868 10.422 13.731 10.464 13.591 10.502C13.395 10.106 13.150 9.732 12.860 9.384C12.856 9.380 12.854 9.376 12.850 9.371C13.432 9.068 13.952 8.702 14.349 8.298C14.746 7.894 15.053 7.405 15.115 6.869C15.137 6.677 15.107 6.486 15.323 6.675Z M13.273 8.041C13.183 8.066 13.093 8.089 13.001 8.112C12.811 8.157 12.617 8.198 12.419 8.232C12.291 8.255 12.161 8.275 12.029 8.293C11.929 8.307 11.829 8.318 11.727 8.329C11.591 8.343 11.453 8.353 11.314 8.361C10.734 8.393 10.129 8.378 9.536 8.302C9.442 8.290 9.350 8.276 9.256 8.261C9.228 8.257 9.200 8.251 9.172 8.247C9.118 8.237 9.064 8.227 9.010 8.216C9.062 8.180 9.114 8.146 9.166 8.110C9.484 7.900 9.844 7.702 10.233 7.519C10.257 7.509 10.281 7.498 10.305 7.486C10.781 7.257 11.301 7.041 11.843 6.840C12.027 7.225 12.165 7.625 12.263 8.036C12.261 8.036 12.259 8.037 12.257 8.038C12.257 8.038 12.259 8.038 12.261 8.038C12.273 8.036 12.287 8.034 12.299 8.032C12.531 8.006 12.755 7.970 12.973 7.928C13.075 7.969 13.177 8.006 13.273 8.041Z M8.639 2.634C9.005 3.394 9.367 4.196 9.751 5.108C9.110 5.308 8.483 5.505 7.880 5.694C7.273 5.885 6.695 6.066 6.159 6.229C6.131 6.237 6.103 6.243 6.075 6.251C6.539 5.227 7.475 3.718 8.639 2.634Z" />
            </svg>
            <span className="text-sm font-medium">Shopify</span>
          </div>
          
          <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border border-gray-200">
            <svg className="w-12 h-12 text-[#7b51ad] mb-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0 3.799 2.4l1.2 10.457L12 24l6.975-11.143L20.201 2.4 12 0zm-.254 2.824c2.855 0 4.872 1.467 5.804 3.714H6.948c.914-2.247 2.913-3.714 4.798-3.714zm-5.348 5.761h10.709l-1.35 11.629-4.013 2.674-4.039-2.674-1.307-11.629z"/>
            </svg>
            <span className="text-sm font-medium">WooCommerce</span>
          </div>
          
          <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border border-gray-200">
            <svg className="w-12 h-12 text-[#ff6d00] mb-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9.429 24c-1.717-1.65-2.618-3.89-3.457-6.02-.837-2.132-1.615-4.295-2.13-6.477-.515-2.182-1.042-4.385-1.312-6.565C2.247 3.27 2.433 1.559 2.619.335H0C.371 2.22.789 4.074 1.2 5.957c.412 1.884.832 3.737 1.32 5.62.487 1.883 1.05 3.775 1.71 5.625.661 1.851 1.431 3.682 2.457 5.402H9.43V24zm7.333 0c-.662-2.296-.974-4.709-1.286-7.127-.31-2.422-.618-4.842-1.099-7.208-.48-2.366-1.12-4.672-1.759-6.965C12.024 1.262 11.229.323 9.906 0h2.612c2.224 0 2.627 1.562 3.017 3.479.391 1.917.765 3.877 1.099 5.847.334 1.971.668 3.931 1.06 5.847.391 1.917.827 3.786 1.372 5.609 1.05-3.69 1.75-7.384 2.449-11.085.338-1.794.674-3.59 1.05-5.398.166-.8.354-1.599.715-2.359C23.628.74 24.436 0 25.694 0H27c-1.236 1.632-1.978 3.823-2.556 5.978-.602 2.249-1.055 4.539-1.577 6.849-.523 2.31-1.112 4.63-1.784 6.961-.673 2.33-1.477 4.645-2.32 6.897h-2.001V24zM4.286 0h5.143c-.914.668-1.585 1.971-2.08 3.306-.545 1.466-.935 3.027-1.286 4.599-.535 2.393-1.035 4.788-1.595 7.16-.656 2.77-1.41 5.589-2.467 8.29H0C.832 19.794 1.566 16.121 2.298 12.45 2.741 10.203 3.183 7.954 3.67 5.725c.17-.782.36-1.56.558-2.335.06-.236.118-.471.183-.704L4.286 0zm9.429 0H9.143c1.333 1.167 1.897 3.267 2.42 5.213.526 1.962.973 3.936 1.42 5.908.446 1.971.891 3.94 1.42 5.908.527 1.969 1.13 3.949 2.029 5.914L18 24c-.666-2.45-1.11-4.89-1.549-7.329-.438-2.44-.923-4.864-1.416-7.305-.526-2.604-1.058-5.216-1.834-7.808l-1.58.042-.906-1.6zM27 0h-2.333C21.422.408 20.672 3.147 20.032 5.448c-.686 2.464-1.293 4.976-1.818 7.511-.65 3.152-1.194 6.306-1.738 9.419-.112.639-.224 1.278-.344 1.922a.519.519 0 0 1-.027.111c-.035.109-.103.32-.105.413V24H18c.776-2.632 1.428-5.252 2.08-7.872.651-2.619 1.31-5.223 2.032-7.798.773-2.75 1.646-5.486 2.649-8.147.217-.574.454-1.143.711-1.7L27 0z"/>
            </svg>
            <span className="text-sm font-medium">Magento</span>
          </div>
          
          <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border border-gray-200">
            <svg className="w-12 h-12 text-[#03c9a9] mb-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.77 9.01H4.21c-.43 0-.78.35-.78.78v4.42c0 .43.35.78.78.78h15.56c.43 0 .78-.35.78-.78V9.79c0-.43-.35-.78-.78-.78M16.37 0H7.63C6.85 0 6.22.63 6.22 1.4v21.2c0 .77.63 1.4 1.41 1.4h8.74c.78 0 1.41-.63 1.41-1.4V1.4c0-.77-.63-1.4-1.41-1.4m-.7 21.16c0 .2-.16.36-.36.36H8.71c-.2 0-.36-.16-.36-.36V2.84c0-.2.16-.36.36-.36h6.6c.2 0 .36.16.36.36z"/>
            </svg>
            <span className="text-sm font-medium">BigCommerce</span>
          </div>
          
          <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border border-gray-200">
            <svg className="w-12 h-12 text-[#ee7214] mb-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.446 0c-1.23.006-2.349.419-3.186 1.078-1.606-1.218-4.446-1.414-6.576-.275-2.06 1.1-3.179 3.194-3.435 5.586C.687 6.811.073 7.97.017 9.233c-.07 1.556.336 2.859 1.217 3.9-.548 1.626-.618 3.346-.194 5.127.643 2.696 2.289 4.295 5.299 5.158 2.612.749 6.08-.128 7.392-3.173.537.127 1.069.188 1.592.181.526.006 1.058-.053 1.593-.181 1.312 3.046 4.78 3.922 7.389 3.173 3.012-.863 4.659-2.461 5.302-5.158.425-1.78.355-3.5-.194-5.127.883-1.04 1.287-2.344 1.219-3.9-.056-1.263-.671-2.422-2.232-2.844-.257-2.392-1.375-4.486-3.435-5.586-2.13-1.139-4.97-.943-6.576.275C17.798.419 16.676.006 15.446 0Zm.005 1.161c1.063-.02 2.03.375 2.484 1.434.156.295.384.429.686.542.31.074.602.148.873.246 1.417.542 2.809 1.834 2.996 4.605.055.374.229.602.482.771.31.197.596.295.838.542.578.603.703 1.532.65 2.305-.093 1.262-.728 2.234-1.98 2.578-.434.122-.578.308-.686.664-.14.664.015 1.558.347 2.5a7.433 7.433 0 0 1 .336 1.902c.048 1.138-.319 2.337-1.44 3.269-1.074.885-2.626 1.226-4.334.832-1.98-.464-3.435-1.857-3.34-4.174-.021-.688.062-1.367.259-2.01.042-.122.077-.245.105-.367-.147-1.434-.294-2.869.336-4.26.086-.246 0-.542-.259-.64-2.07-.82-3.428-2.663-3.255-5.154.061-.97.404-1.882 1.027-2.63.232-.275.525-.443.863-.542.328-.103.602-.22.686-.542.263-1.013 1.18-1.422 2.23-1.434 1.012-.016 2.085.411 2.761 1.161.235.275.47.318.755.158.58-.311 1.236-.471 1.907-.479h.018c.67.008 1.326.168 1.907.479.285.16.525.117.757-.158a3.847 3.847 0 0 1 2.036-1.148c.238-.012.478-.015.714-.012Zm-7.232 11.88c-1.2 0-2.17.971-2.17 2.17 0 1.2.97 2.173 2.17 2.173 1.198 0 2.17-.973 2.17-2.172 0-1.2-.972-2.17-2.17-2.17Zm7.558 0c-1.2 0-2.17.971-2.17 2.17 0 1.2.97 2.173 2.17 2.173 1.198 0 2.172-.973 2.172-2.172 0-1.2-.974-2.17-2.172-2.17Z"/>
            </svg>
            <span className="text-sm font-medium">PrestaShop</span>
          </div>
          
          <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border border-gray-200">
            <svg className="w-12 h-12 text-[#21759b] mb-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.158 12.786L9.46 20.625a8.984 8.984 0 005.526-.415.852.852 0 00.1-.092 8.814 8.814 0 00.1-.158l-3.028-7.174zM3.009 12c0 3.559 2.068 6.634 5.067 8.092l-4.292-11.758A8.958 8.958 0 003.01 12zM18.067 11.482c0-1.112-.4-1.881-.741-2.48a5.091 5.091 0 01-.785-1.85c.575-.058 1.088-.092 1.088-.092.817-.058 -.575-1.175-1.3-1.117 0 0-2.555.2-4.2.2-1.55 0-4.167-.2-4.167-.2-.817-.058-2.209 1.058-1.391 1.117 0 0 .483.058 1 .1.516.4.829.66 1.341 1.017.412.292.675.575.675 1.858 0 .617-.118 1.35-.284 2.25l-1.341 4.3-4.267-12.7s.575-.058 1.1-.117c.517-.058-.617-1.225-1.433-1.167a1.442 1.442 0 00-.192 0S5.585 3.309 9.852 3.309c1.675 0 4.241-.059 4.241-.059.817-.058-.583-1.175-1.4-1.117 0 0-.609.059-1.284.1-.641.07-.775.109-1.066.142a3.36 3.36 0 00.133-.517c.542-2.333 2.734-4.059 5.284-4.059C18.867-2.142 21 .542 21 3.867c0 1.825-.708 3.415-1.825 4.534.075 0 .15-.009.225-.009 1.208 0 3.084 1.467 3.084 3.825 0 1.417-.884 3.09-2.042 3.85.067.058.125.117.184.175a8.818 8.818 0 00.841-.434A8.996 8.996 0 0021 12a9 9 0 10-9 9 9.039 9.039 0 009-9 9.141 9.141 0 00-.116-1.416 6.984 6.984 0 01-1.659.383 7.111 7.111 0 01-1.158.484Zm-3.484.15c-.341 0-.633.283-.633.633 0 .317.267.567.567.633h.067a.623.623 0 00.633-.633.628.628 0 00-.634-.633Z"/>
            </svg>
            <span className="text-sm font-medium">WordPress</span>
          </div>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">How Ecommerce Businesses Benefit</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
            <div className="p-6">
              <div className="italic text-gray-600 mb-4">
                "Before iMagenWiz, our product photography process took weeks and cost thousands. Now, we can create professional-quality product images in minutes at a fraction of the cost. Our conversion rates have increased by 24% since implementing consistent product imagery across our store."
              </div>
              <div className="font-semibold">Emily Nguyen</div>
              <div className="text-sm text-gray-500">Ecommerce Manager, StyleHub</div>
            </div>
          </div>
          
          <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
            <div className="p-6">
              <div className="italic text-gray-600 mb-4">
                "As a marketplace with thousands of sellers, maintaining consistent product imagery was nearly impossible. iMagenWiz's batch processing and automated enhancement tools have transformed our visual presence and helped reduce return rates by 18%."
              </div>
              <div className="font-semibold">Marcus Johnson</div>
              <div className="text-sm text-gray-500">Director of Operations, GlobeMarket</div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Ecommerce Plans</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-lg mb-2">Starter</h3>
            <div className="text-3xl font-bold mb-4">$49<span className="text-sm font-normal text-gray-500">/month</span></div>
            <p className="text-gray-600 mb-4">
              Perfect for small stores with up to 500 products.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>500 image processes per month</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Background removal</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Basic image enhancement</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Standard support</span>
              </li>
            </ul>
            <a 
              href="/pricing" 
              className="inline-block w-full py-2 px-4 border border-gray-300 rounded-md text-center font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Get Started
            </a>
          </div>
          
          <div className="bg-gradient-to-br from-teal-50 to-blue-50 shadow-md rounded-lg border border-teal-200 p-6 transform md:scale-105 z-10">
            <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-teal-100 text-teal-800 mb-2">Most Popular</div>
            <h3 className="font-semibold text-lg mb-2">Business</h3>
            <div className="text-3xl font-bold mb-4">$149<span className="text-sm font-normal text-gray-500">/month</span></div>
            <p className="text-gray-600 mb-4">
              Ideal for growing stores with up to 2,000 products.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>2,000 image processes per month</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>All image enhancement features</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Batch processing</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Platform integration</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Priority support</span>
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
              For large marketplaces and ecommerce platforms.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Unlimited image processing</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>All advanced features</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Custom API integration</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Dedicated account manager</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>24/7 premium support</span>
              </li>
            </ul>
            <a 
              href="/contact" 
              className="inline-block w-full py-2 px-4 border border-gray-300 rounded-md text-center font-medium text-gray-700 bg-white hover:bg-gray-50"
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