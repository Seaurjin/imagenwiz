import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useSiteSettings } from '../contexts/SiteSettingsContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdminSettings = () => {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState({
    navbar: null,
    footer: null,
    favicon: null
  });
  const [logoFiles, setLogoFiles] = useState({
    navbar: null,
    footer: null,
    favicon: null
  });

  // Redirect if not an admin
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!user || !user.is_admin) {
      navigate('/');
      toast.error(t('errors.adminOnly', 'Only admin users can access this page'));
      return;
    }

    // Load current logos
    fetchLogos();
  }, [isAuthenticated, user, navigate, t]);

  // Fetch existing logos
  const fetchLogos = async () => {
    try {
      const response = await axios.get('/api/settings/logo');
      const logos = response.data;
      
      setLogoPreview({
        navbar: logos.navbar || '/images/imagenwiz-logo-navbar-gradient.svg',
        footer: logos.footer || '/images/imagenwiz-logo-footer.svg',
        favicon: logos.favicon || '/favicon.svg'
      });
    } catch (error) {
      console.error('Error fetching logos:', error);
      toast.error(t('errors.fetchingLogos', 'Error loading logos'));
    }
  };

  // Handle file selection
  const handleFileChange = (e, logoType) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    const fileType = file.type;
    if (!['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'].includes(fileType)) {
      toast.error(t('errors.invalidFileType', 'Please upload a PNG, JPEG, or SVG image'));
      return;
    }

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error(t('errors.fileTooLarge', 'File size exceeds 2MB limit'));
      return;
    }

    // Update logo files
    setLogoFiles(prev => ({
      ...prev,
      [logoType]: file
    }));

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(prev => ({
        ...prev,
        [logoType]: reader.result
      }));
    };
    reader.readAsDataURL(file);
  };

  // Upload logo
  const handleLogoUpload = async (logoType) => {
    if (!logoFiles[logoType]) {
      toast.error(t('errors.noFile', 'Please select a file first'));
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('logo', logoFiles[logoType]);
    formData.append('type', logoType);

    try {
      const response = await axios.post('/api/settings/logo/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success(t('success.logoUploaded', 'Logo uploaded successfully'));
      
      // Update preview with the new URL from the server
      setLogoPreview(prev => ({
        ...prev,
        [logoType]: response.data.logo_url
      }));
      
      // Clear the file input
      setLogoFiles(prev => ({
        ...prev,
        [logoType]: null
      }));
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast.error(t('errors.uploadFailed', 'Failed to upload logo'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t('admin.siteSettings', 'Site Settings')}</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">{t('admin.logoManagement', 'Logo Management')}</h2>
        <p className="mb-6 text-gray-600">
          {t('admin.logoInstructions', 'Upload new logos for the website. Recommended formats are SVG or PNG with transparent background.')}
        </p>
        
        {/* Navbar Logo */}
        <div className="mb-8 border-b pb-8">
          <h3 className="text-xl font-medium mb-3">{t('admin.navbarLogo', 'Navbar Logo')}</h3>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="bg-gray-100 p-4 rounded-lg flex items-center justify-center w-48 h-24">
              {logoPreview.navbar && (
                <img 
                  src={logoPreview.navbar} 
                  alt="Navbar Logo" 
                  className="max-h-full max-w-full object-contain"
                />
              )}
            </div>
            <div className="flex-1">
              <input
                type="file"
                id="navbar-logo"
                className="mb-3 block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-teal-50 file:text-teal-700
                  hover:file:bg-teal-100"
                accept=".png,.jpg,.jpeg,.svg"
                onChange={(e) => handleFileChange(e, 'navbar')}
              />
              <button
                className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => handleLogoUpload('navbar')}
                disabled={isLoading || !logoFiles.navbar}
              >
                {isLoading ? t('common.uploading', 'Uploading...') : t('common.upload', 'Upload')}
              </button>
            </div>
          </div>
        </div>
        
        {/* Footer Logo */}
        <div className="mb-8 border-b pb-8">
          <h3 className="text-xl font-medium mb-3">{t('admin.footerLogo', 'Footer Logo')}</h3>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="bg-gray-100 p-4 rounded-lg flex items-center justify-center w-48 h-24">
              {logoPreview.footer && (
                <img 
                  src={logoPreview.footer} 
                  alt="Footer Logo" 
                  className="max-h-full max-w-full object-contain"
                />
              )}
            </div>
            <div className="flex-1">
              <input
                type="file"
                id="footer-logo"
                className="mb-3 block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-teal-50 file:text-teal-700
                  hover:file:bg-teal-100"
                accept=".png,.jpg,.jpeg,.svg"
                onChange={(e) => handleFileChange(e, 'footer')}
              />
              <button
                className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => handleLogoUpload('footer')}
                disabled={isLoading || !logoFiles.footer}
              >
                {isLoading ? t('common.uploading', 'Uploading...') : t('common.upload', 'Upload')}
              </button>
            </div>
          </div>
        </div>
        
        {/* Favicon */}
        <div className="mb-8">
          <h3 className="text-xl font-medium mb-3">{t('admin.favicon', 'Favicon')}</h3>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="bg-gray-100 p-4 rounded-lg flex items-center justify-center w-24 h-24">
              {logoPreview.favicon && (
                <img 
                  src={logoPreview.favicon} 
                  alt="Favicon" 
                  className="max-h-full max-w-full object-contain"
                />
              )}
            </div>
            <div className="flex-1">
              <input
                type="file"
                id="favicon"
                className="mb-3 block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-teal-50 file:text-teal-700
                  hover:file:bg-teal-100"
                accept=".png,.jpg,.jpeg,.svg,.ico"
                onChange={(e) => handleFileChange(e, 'favicon')}
              />
              <button
                className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => handleLogoUpload('favicon')}
                disabled={isLoading || !logoFiles.favicon}
              >
                {isLoading ? t('common.uploading', 'Uploading...') : t('common.upload', 'Upload')}
              </button>
              <p className="mt-2 text-sm text-gray-500">
                {t('admin.faviconNote', 'Note: For best results, use a square SVG or PNG image with 32x32px or 64x64px dimensions.')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;