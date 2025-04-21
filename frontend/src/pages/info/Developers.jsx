import React from 'react';
import { useTranslation } from 'react-i18next';
import FooterPageTemplate from '../../components/FooterPageTemplate';

const Developers = () => {
  const { t } = useTranslation('common');
  
  return (
    <FooterPageTemplate
      title="For Developers"
      description="Powerful AI image processing APIs to enhance your applications"
      showGetStarted={true}
    >
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Integrate Advanced Image Processing</h2>
        
        <p className="mb-4">
          iMagenWiz provides developers with powerful, easy-to-integrate APIs that bring state-of-the-art AI image processing capabilities to your applications. 
          Our developer-friendly tools enable you to enhance your software with features like background removal, object detection, 
          image enhancement, and more—without having to build complex AI systems from scratch.
        </p>
        
        <p className="mb-6">
          Whether you're building a mobile app, web platform, or enterprise solution, iMagenWiz APIs give you access to robust 
          image processing capabilities with just a few lines of code.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <div className="bg-gradient-to-br from-teal-50 to-blue-50 p-6 rounded-lg border border-teal-100">
            <h3 className="text-xl font-semibold text-teal-800 mb-3">RESTful API Access</h3>
            <p className="text-gray-700">
              Well-documented, standards-compliant REST APIs that are easy to integrate with any programming language or framework.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-teal-50 to-blue-50 p-6 rounded-lg border border-teal-100">
            <h3 className="text-xl font-semibold text-teal-800 mb-3">SDK Support</h3>
            <p className="text-gray-700">
              Official SDKs for popular languages including JavaScript, Python, Ruby, PHP, Java, and .NET to accelerate your integration process.
            </p>
          </div>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Core API Capabilities</h2>
        
        <div className="space-y-8">
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3">Background Removal API</h3>
              <p className="text-gray-600 mb-4">
                Remove backgrounds from images with precision, preserving fine details like hair and transparent elements. Perfect for e-commerce platforms, design tools, and photo editing applications.
              </p>
              <div className="bg-gray-50 p-4 rounded-md overflow-x-auto text-sm font-mono">
                <pre>
{`// Simple example with JavaScript
const response = await fetch('https://api.imagenwiz.com/v1/remove-background', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    image_url: 'https://example.com/image.jpg',
    output_format: 'png',
    crop: false,
    scale: 1.0
  })
});

const result = await response.json();
console.log(result.output_url);`}
                </pre>
              </div>
            </div>
          </div>
          
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3">Object Detection & Removal API</h3>
              <p className="text-gray-600 mb-4">
                Detect and remove specific objects from images with AI-powered content-aware fill. Essential for photo editing apps, content moderation tools, and real estate platforms.
              </p>
              <div className="bg-gray-50 p-4 rounded-md overflow-x-auto text-sm font-mono">
                <pre>
{`// Python example
import requests

response = requests.post(
    'https://api.imagenwiz.com/v1/remove-object',
    headers={
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json'
    },
    json={
        'image_url': 'https://example.com/image.jpg',
        'mask': {
            'points': [[100, 100], [200, 100], [200, 200], [100, 200]]
        },
        'hd_quality': True
    }
)

result = response.json()
print(result['output_url'])`}
                </pre>
              </div>
            </div>
          </div>
          
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3">Image Enhancement API</h3>
              <p className="text-gray-600 mb-4">
                Automatically improve image quality with smart adjustments to lighting, color, sharpness, and noise reduction. Great for photo apps, social platforms, and content management systems.
              </p>
              <div className="bg-gray-50 p-4 rounded-md overflow-x-auto text-sm font-mono">
                <pre>
{`// PHP example
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'https://api.imagenwiz.com/v1/enhance');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer YOUR_API_KEY',
    'Content-Type: application/json'
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'image_url' => 'https://example.com/image.jpg',
    'enhance_type' => 'auto',
    'intensity' => 0.8
]));

$response = curl_exec($ch);
$result = json_decode($response, true);
echo $result['output_url'];`}
                </pre>
              </div>
            </div>
          </div>
          
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3">Image Resizing & Format Conversion API</h3>
              <p className="text-gray-600 mb-4">
                Intelligently resize, crop, and convert images between formats while preserving quality. Essential for responsive web applications, media management tools, and content delivery networks.
              </p>
              <div className="bg-gray-50 p-4 rounded-md overflow-x-auto text-sm font-mono">
                <pre>
{`// Node.js example
const axios = require('axios');

async function resizeImage() {
  const response = await axios.post('https://api.imagenwiz.com/v1/resize', {
    image_url: 'https://example.com/image.jpg',
    width: 800,
    height: 600,
    maintain_aspect_ratio: true,
    output_format: 'webp',
    quality: 90
  }, {
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY'
    }
  });
  
  return response.data.output_url;
}`}
                </pre>
              </div>
            </div>
          </div>
          
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3">Visual Content Moderation API</h3>
              <p className="text-gray-600 mb-4">
                Automatically detect and flag inappropriate content in images. Perfect for user-generated content platforms, community forums, and educational applications.
              </p>
              <div className="bg-gray-50 p-4 rounded-md overflow-x-auto text-sm font-mono">
                <pre>
{`// Java example
HttpClient client = HttpClient.newHttpClient();
HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("https://api.imagenwiz.com/v1/moderate"))
    .header("Authorization", "Bearer YOUR_API_KEY")
    .header("Content-Type", "application/json")
    .POST(HttpRequest.BodyPublishers.ofString(
        "{"
        + "  \\"image_url\\": \\"https://example.com/image.jpg\\","
        + "  \\"categories\\": [\\"adult\\", \\"violence\\", \\"drugs\\"],"
        + "  \\"threshold\\": 0.7"
        + "}"
    ))
    .build();

HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
System.out.println(response.body());`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Integration Benefits</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-teal-100 text-teal-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Quick Implementation</h3>
            <p className="text-gray-600 text-sm">
              Reduce development time from months to days by leveraging our pre-built AI image processing capabilities.
            </p>
          </div>
          
          <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-teal-100 text-teal-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Scalable Processing</h3>
            <p className="text-gray-600 text-sm">
              Handle millions of image processing requests with our robust, cloud-based infrastructure that scales automatically with your needs.
            </p>
          </div>
          
          <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-teal-100 text-teal-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Enterprise Security</h3>
            <p className="text-gray-600 text-sm">
              Ensure data protection with advanced security measures including encrypted data transfer, secure authentication, and GDPR compliance.
            </p>
          </div>
          
          <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-teal-100 text-teal-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Continuous Improvement</h3>
            <p className="text-gray-600 text-sm">
              Benefit from ongoing AI model updates and new features without any additional development effort on your part.
            </p>
          </div>
          
          <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-teal-100 text-teal-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Low Latency</h3>
            <p className="text-gray-600 text-sm">
              Deliver fast user experiences with our optimized API infrastructure providing response times measured in milliseconds.
            </p>
          </div>
          
          <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-teal-100 text-teal-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Flexible Pricing</h3>
            <p className="text-gray-600 text-sm">
              Choose from usage-based or subscription pricing models to fit your business needs and development stage.
            </p>
          </div>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">What Developers Say</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
            <div className="p-6">
              <div className="italic text-gray-600 mb-4">
                "Integrating iMagenWiz's APIs saved us months of development time. Their background removal API is leagues ahead of other solutions we tested, especially with complex edges and transparency."
              </div>
              <div className="font-semibold">Alex Mercer</div>
              <div className="text-sm text-gray-500">CTO, PixelPerfect</div>
            </div>
          </div>
          
          <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
            <div className="p-6">
              <div className="italic text-gray-600 mb-4">
                "We needed to process thousands of product images daily. iMagenWiz's API not only handled the volume flawlessly but also improved our image quality significantly. The documentation is excellent and implementation was straightforward."
              </div>
              <div className="font-semibold">Rachel Torres</div>
              <div className="text-sm text-gray-500">Lead Developer, ShopStream</div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Developer Resources</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <a href="/api-docs" className="block bg-white shadow-sm hover:shadow-md transition-shadow duration-200 rounded-lg overflow-hidden border border-gray-200">
            <div className="p-6">
              <h3 className="font-semibold text-lg mb-2 text-teal-700">API Documentation</h3>
              <p className="text-gray-600 mb-4">
                Comprehensive guides, reference materials, and examples for all API endpoints.
              </p>
              <span className="text-teal-600 font-medium">View Documentation →</span>
            </div>
          </a>
          
          <a href="/api-status" className="block bg-white shadow-sm hover:shadow-md transition-shadow duration-200 rounded-lg overflow-hidden border border-gray-200">
            <div className="p-6">
              <h3 className="font-semibold text-lg mb-2 text-teal-700">Status Dashboard</h3>
              <p className="text-gray-600 mb-4">
                Real-time metrics on API performance and system status across all regions.
              </p>
              <span className="text-teal-600 font-medium">Check Status →</span>
            </div>
          </a>
          
          <a href="/api-samples" className="block bg-white shadow-sm hover:shadow-md transition-shadow duration-200 rounded-lg overflow-hidden border border-gray-200">
            <div className="p-6">
              <h3 className="font-semibold text-lg mb-2 text-teal-700">Sample Code & SDKs</h3>
              <p className="text-gray-600 mb-4">
                Ready-to-use code samples, SDKs, and integration examples for various languages.
              </p>
              <span className="text-teal-600 font-medium">Browse Examples →</span>
            </div>
          </a>
          
          <a href="/api-community" className="block bg-white shadow-sm hover:shadow-md transition-shadow duration-200 rounded-lg overflow-hidden border border-gray-200">
            <div className="p-6">
              <h3 className="font-semibold text-lg mb-2 text-teal-700">Developer Community</h3>
              <p className="text-gray-600 mb-4">
                Connect with other developers, share solutions, and get help from our team.
              </p>
              <span className="text-teal-600 font-medium">Join Community →</span>
            </div>
          </a>
        </div>
      </section>
      
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">API Pricing</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-lg mb-2">Starter</h3>
            <div className="text-3xl font-bold mb-4">$49<span className="text-sm font-normal text-gray-500">/month</span></div>
            <p className="text-gray-600 mb-4">
              Perfect for indie developers and small projects.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>2,000 API calls per month</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Standard processing speed</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Core API features</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Community support</span>
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
            <h3 className="font-semibold text-lg mb-2">Professional</h3>
            <div className="text-3xl font-bold mb-4">$199<span className="text-sm font-normal text-gray-500">/month</span></div>
            <p className="text-gray-600 mb-4">
              Ideal for growing businesses and production applications.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>20,000 API calls per month</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Priority processing</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>All API features</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Dedicated support</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Advanced analytics</span>
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
              Tailored solutions for high-volume and custom needs.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Unlimited API calls</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Highest priority processing</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Custom feature development</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>24/7 premium support</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>SLA guarantees</span>
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
        
        <p className="text-center text-gray-600 mt-6">
          All plans include our standard API features. Need more API calls? We offer flexible pay-as-you-go options.
        </p>
      </section>
    </FooterPageTemplate>
  );
};

export default Developers;