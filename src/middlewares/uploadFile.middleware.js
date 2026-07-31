import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folderPath = path.join('uploads', 'tmp');
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
    cb(null, folderPath);
  },
  filename: (req, file, cb) => {
    const nombrePersonalizado = req.body.nombreArchivo || file.originalname;
    const nombreFinal = nombrePersonalizado.replace(/\s+/g, "_");
    cb(null, nombreFinal);
  },
});

const fileFilter = (req, file, cb) => {
  const tiposPermitidos = /jpeg|jpg|png|webp/;
  const extension = tiposPermitidos.test(path.extname(file.originalname).toLowerCase());
  const mimetype = tiposPermitidos.test(file.mimetype);

  if (extension && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten imágenes (jpg, jpeg, png, webp)'));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB máximo
});