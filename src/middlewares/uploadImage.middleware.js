import multer from 'multer';
import path from 'path';
import fs from 'fs';

const MENSAJE_TIPO_IMAGEN_INVALIDO = 'Solo se permiten imágenes (jpg, jpeg, png, webp)';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folderPath = path.join('uploads', 'tmp');
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
    cb(null, folderPath);
  },
  filename: (req, file, cb) => {
    const base = file.originalname
      .replace(/\s+/g, "_")
      .replace(path.extname(file.originalname), ""); 
    const ext = path.extname(file.originalname);
    const uniqueSuffix = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;
    cb(null, `${base}_${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const tiposPermitidos = /jpeg|jpg|png|webp/;
  const extension = tiposPermitidos.test(path.extname(file.originalname).toLowerCase());
  const mimetype = tiposPermitidos.test(file.mimetype);

  if (extension && mimetype) {
    cb(null, true);
  } else {
    cb(new Error(MENSAJE_TIPO_IMAGEN_INVALIDO));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

export const uploadErrorHandler = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ message: 'La imagen no puede superar los 5 MB' });
    }

    return res.status(400).json({ message: 'No se pudo cargar el archivo. Verifica el archivo e inténtalo de nuevo.' });
  }

  if (error.message === MENSAJE_TIPO_IMAGEN_INVALIDO) {
    return res.status(400).json({ message: MENSAJE_TIPO_IMAGEN_INVALIDO });
  }

  return next(error);
};