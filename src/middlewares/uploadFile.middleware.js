import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Almacenamiento temporal
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

export const upload = multer({ storage });
