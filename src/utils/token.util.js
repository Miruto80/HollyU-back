import jwt from "jsonwebtoken";
import config from "../config/config.js"; // Asegúrate de que la ruta sea correcta

const tokenUtil = {
    generateToken: (payload, type = "access") => {
      try {
        const options = {
          expiresIn: type === "access" ? config.jwtExpiresIn : "15m"
        };
        
        return jwt.sign(payload, config.secret, options);
      } catch (error) {
        console.error('Error generando token:', error);
        throw new Error('Error al generar token');
      }
    },
  
    verifyToken: (token, type = "access") => {
      try {
        const decoded = jwt.verify(token, config.secret);
        console.log('Token verificado exitosamente:', decoded);
        return decoded;
      } catch (error) {
        if (error.name === 'TokenExpiredError') {
          console.log('Token expirado');
        } else if (error.name === 'JsonWebTokenError') {
          console.log('Error en la verificación:', error.message);
        }
        throw error; // Propaga el error para manejarlo en el middleware
      }
    }
  };
  
  export default tokenUtil;
