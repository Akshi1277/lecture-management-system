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
        // Cloudinary 'raw' resource_type always requires signed/authenticated URLs
        // even with access_mode:'public'. To serve PDFs and docs publicly without
        // a 401 error, we must use resource_type:'image' — Cloudinary supports
        // delivering non-image files (PDF, DOCX, etc.) this way on its public CDN.
        let resourceType = 'image'; // Use 'image' for all types to enable public delivery

        return {
            folder: `edusync/lectures/${req.params.id}/resources`,
            resource_type: 'auto',
            type: 'upload',
            // Keep original filename in Cloudinary
            public_id: `${Date.now()}-${file.originalname.replace(/\s+/g, '_').split('.')[0]}`,
            // Allow broad set of formats
            allowed_formats: ['pdf', 'ppt', 'pptx', 'doc', 'docx', 'png', 'jpg', 'jpeg', 'txt', 'xlsx', 'zip'],
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
