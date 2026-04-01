import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage config – allows PDFs, PPTs, DOCx, images
const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
        // Extract filename without extension and clean it
        const originalName = file.originalname.split('.')[0].replace(/\s+/g, '_');
        const extension = file.originalname.split('.').pop();
        
        return {
            folder: 'academic_vault',
            resource_type: 'raw',
            type: 'upload',
            public_id: `${Date.now()}-${originalName}.${extension}`,
        };
    },
});

// 10 MB size limit
export const uploadToCloudinary = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedMimes = [
            'application/pdf',
            'application/vnd.ms-powerpoint',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'image/png',
            'image/jpeg',
            'image/jpg',
            'text/plain',
            'application/zip',
        ];

        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error(`File type not allowed: ${file.mimetype}`), false);
        }
    },
});

const profileStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'edusync/profiles',
        allowed_formats: ['jpg', 'png', 'jpeg'],
        transformation: [{ width: 300, height: 300, crop: 'limit' }]
    }
});

export const uploadProfile = multer({ storage: profileStorage });

export default cloudinary;
