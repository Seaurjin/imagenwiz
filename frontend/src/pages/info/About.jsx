import React from 'react';
import { useTranslation } from 'react-i18next';
import FooterPageTemplate from '../../components/FooterPageTemplate';

const About = () => {
  const { t } = useTranslation('common');
  
  return (
    <FooterPageTemplate
      title="About Us"
      description="Meet the team behind iMagenWiz and learn about our AI-driven mission"
      showGetStarted={true}
    >
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Vision</h2>
        
        <p className="mb-4">
          At iMagenWiz, we are a lean but tech-savvy team who aspire to use an AI-native approach to bring 
          positive user experiences with better utility and lower cost. We believe that AI should work for humans, 
          freeing us from inefficient manual tasks so we can focus on creativity, innovation, and spending 
          quality time with friends and family.
        </p>
        
        <p className="mb-8">
          Our passion goes beyond applying AI for image processing. We're committed to using AI for a better world, 
          one where repetitive, time-consuming tasks are handled by intelligent systems, allowing human potential 
          to be directed toward what truly matters.
        </p>
        
        <div className="border-l-4 border-teal-500 pl-6 py-2 my-8">
          <p className="text-lg italic text-gray-700">
            "AI-driven efficiency is our core. Let AI work and let humans innovate and have fun with friends and families."
          </p>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Our AI-Native Approach</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-10">
          <div className="bg-gradient-to-br from-teal-50 to-blue-50 p-6 rounded-lg border border-teal-100">
            <div className="text-teal-600 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-teal-800 mb-3">Custom AI Models</h3>
            <p className="text-gray-700">
              We train our own AI models for various use cases, tailoring them to deliver exceptional results for specific image processing tasks.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-teal-50 to-blue-50 p-6 rounded-lg border border-teal-100">
            <div className="text-teal-600 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-teal-800 mb-3">Efficiency Focus</h3>
            <p className="text-gray-700">
              We are relentlessly increasing our efficiency so that we can provide better products, better experiences with lower cost, and fast delivery pace.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-teal-50 to-blue-50 p-6 rounded-lg border border-teal-100">
            <div className="text-teal-600 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-teal-800 mb-3">AI-Powered Workflow</h3>
            <p className="text-gray-700">
              We don't just apply AI to our products; we use it throughout our workflows as a team and company, streamlining our processes from development to delivery.
            </p>
          </div>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">How We Work</h2>
        
        <p className="mb-4">
          At iMagenWiz, we embrace a lean and agile approach to product development. By focusing on efficiency and 
          leveraging AI throughout our workflow, we're able to maintain a small but highly effective team that delivers 
          exceptional results.
        </p>
        
        <div className="space-y-6 mt-8">
          <div className="flex gap-4 items-start">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-900">Data-Driven Development</h3>
              <p className="text-gray-600">
                We make decisions based on real user data and feedback, continuously iterating to improve our products.
              </p>
            </div>
          </div>
          
          <div className="flex gap-4 items-start">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-900">Rapid Innovation</h3>
              <p className="text-gray-600">
                Our AI-powered workflows allow us to experiment, prototype, and deliver new features faster than traditional approaches.
              </p>
            </div>
          </div>
          
          <div className="flex gap-4 items-start">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-900">Customer-Centric</h3>
              <p className="text-gray-600">
                We're committed to creating tools that solve real problems for our users, making complex image processing tasks simple and accessible.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Commitment</h2>
        
        <p className="mb-4">
          We believe that AI should enable creativity, not replace it. By handling the technical and repetitive aspects of image processing, 
          our tools free you to focus on the creative vision and artistic direction that only humans can provide.
        </p>
        
        <p className="mb-8">
          As we continue to develop and refine our AI models, we remain committed to our core mission: creating powerful, 
          user-friendly tools that save you time, reduce costs, and deliver professional results.
        </p>
        
        <div className="bg-gradient-to-r from-teal-50 to-blue-50 p-6 rounded-lg border border-teal-100 mt-8">
          <h3 className="text-xl font-semibold text-teal-800 mb-3">Join Us on Our Journey</h3>
          <p className="text-gray-700 mb-4">
            We're just getting started on our mission to transform image processing with AI. Whether you're 
            a professional photographer, marketer, e-commerce seller, or simply someone who wants to create 
            better images, we invite you to try iMagenWiz and experience the future of intelligent image editing.
          </p>
          <a 
            href="/pricing" 
            className="inline-block py-2 px-4 border border-transparent rounded-md text-center font-medium text-white bg-teal-600 hover:bg-teal-700"
          >
            Get Started Today
          </a>
        </div>
      </section>
    </FooterPageTemplate>
  );
};

export default About;