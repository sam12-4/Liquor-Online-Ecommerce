/**
 * Uploads an image to Cloudinary using an unsigned upload with a preset
 * @param {File} file - The image file to upload
 * @returns {Promise<string>} - The URL of the uploaded image
 */
export const uploadToCloudinary = async (file) => {
  // Your Cloudinary cloud name
  const cloudName = 'dc3hqcovg';
  
  // IMPORTANT: You need to create this upload preset in your Cloudinary dashboard
  // Go to Settings > Upload > Upload presets > Add upload preset
  // Set "Signing Mode" to "Unsigned" and save
  const uploadPreset = 'liquor_online_preset';
  
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  
  try {
    console.log('Uploading to Cloudinary...');
    
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    });
    
    // Log detailed error information if the request fails
    if (!response.ok) {
      let errorText = `HTTP error! status: ${response.status}`;
      try {
        const errorJson = await response.json();
        console.error('Cloudinary API error details:', errorJson);
        errorText += ` - ${errorJson.error?.message || JSON.stringify(errorJson)}`;
      } catch (e) {
        console.error('Could not parse error response as JSON');
      }
      throw new Error(errorText);
    }
    
    const data = await response.json();
    console.log('Upload successful:', data.secure_url);
    return data.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error(`Failed to upload image to Cloudinary: ${error.message}`);
  }
};

/**
 * Tests if Cloudinary API is accessible (for debugging)
 * @returns {Promise<boolean>} - Whether the API is accessible
 */
export const testCloudinaryConnection = async () => {
  const cloudName = 'dc3hqcovg';
  
  try {
    // Just try a simple GET request to test connectivity
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/ping`, {
      method: 'GET',
    });
    
    console.log('Cloudinary connectivity test response:', response.status);
    return response.ok;
  } catch (error) {
    console.error('Cloudinary connectivity test failed:', error);
    return false;
  }
}; 