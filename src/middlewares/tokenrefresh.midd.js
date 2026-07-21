import tokenUtil from "../utils/token.util.js";


const refreshTokenMiddleware = (req, res, next) => {
    // Guarda la función json original
    const originalJson = res.json;
  
    // Sobreescribe res.json para incluir el nuevo token de refresco en la respuesta
    res.json = function(data) {
      let responseData = data;
      if (typeof data === "object" && data !== null && res.locals.newRefreshToken) {
        responseData = {
          ...data,
          refreshToken: res.locals.newRefreshToken,
        };
      }
      return originalJson.call(this, responseData);
    };
  
    try {
      // Obtiene el token de refresco del header "x-refresh-token"
      const refreshToken = req.headers["x-refresh-token"];
      console.log("Token recibido:", refreshToken);
  
      if (!refreshToken) {
        console.log("No se recibió token de refresco");
        return next();
      }
  
      try {
        // Verifica el token de refresco
        const decoded = tokenUtil.verifyToken(refreshToken, "refresh");
        console.log("Token decodificado:", decoded);
  
        if (decoded) {
          // Crea un payload limpio para evitar que se re-utilicen propiedades de expiración
          const payload = {
            id: decoded.id,
            username: decoded.username,
            role: decoded.role,
            clientId: decoded.clientId,
          };

            req.user = payload; 
            
          // Genera un nuevo token de refresco
          const newRefreshToken = tokenUtil.generateToken(payload, "refresh");
          console.log("Nuevo token generado");
  
          // Asigna el nuevo token en los headers y en res.locals
          res.setHeader("x-refresh-token", newRefreshToken);
          res.locals.newRefreshToken = newRefreshToken;
  
          // Actualiza req.user para usarlo en rutas posteriores si es necesario
          req.user = payload;
        }
      } catch (tokenError) {
        console.log("Error verificando token:", tokenError.message);
        // Si falla la verificación, se continua sin refrescar el token
      }
  
      next();
    } catch (error) {
      console.error("Error en refreshTokenMiddleware:", error);
      res.status(500).json({
        success: false,
        message: "Error en el middleware de refresco",
        error: error.message,
      });
    }
  };
  
  export default refreshTokenMiddleware;