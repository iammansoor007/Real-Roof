import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

/**
 * Universal upload function that handles both local and Cloudinary storage
 */
export async function uploadFile(file: File, buffer: Buffer): Promise<{ url: string; publicId?: string }> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;

  // Use Cloudinary if configured
  if (cloudName && (uploadPreset || (apiKey && apiSecret))) {
    try {
      const formData = new FormData();
      formData.append('file', new Blob([buffer], { type: file.type }));
      
      if (uploadPreset) {
        formData.append('upload_preset', uploadPreset);
      }
      
      const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;
      
      const res = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error.message);

      return {
        url: data.secure_url,
        publicId: data.public_id
      };
    } catch (error: any) {
      console.error('Cloudinary upload failed:', error);
      throw error;
    }
  }

  // Fallback to local storage (Local Development ONLY)
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Local file uploads are not supported in production. Please configure Cloudinary or Vercel Blob.');
  }

  const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  
  await mkdir(uploadDir, { recursive: true });
  const filePath = path.join(uploadDir, filename);
  await writeFile(filePath, buffer);

  return {
    url: `/uploads/${filename}`,
    publicId: filename
  };
}
