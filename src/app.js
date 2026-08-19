import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import compression from 'compression';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import path from "path";
import { fileURLToPath } from 'url';

import sequelize from './database/db.js';
import refreshTokenMiddleware from './middlewares/tokenrefresh.midd.js';
import { associateAllModels } from './models/index.js';
import { seedInitialData } from './seed.js';

// Configurar __dirname para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import colores  from './routers/colores.router.js';
import productos from './routers/productos.router.js';
import categorias from './routers/categorias.router.js';
import generos from './routers/generos.router.js';
import tallas from './routers/tallas.router.js';
import tipos_tela from './routers/tipos_tela.router.js';
import modelos from './routers/modelos.router.js';
import pedidos from './routers/pedidos.router.js';
import clientes from './routers/clientes.router.js';
import auth from './routers/auth.router.js';
import pagos from './routers/pagos.router.js';
import producciones from './routers/producciones.router.js';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'HollyU API',
      version: '1.0.0',
      description: 'Documentación de la API de HollyU',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT}`
      },
    ],
  },
  apis: ['./src/routers/*.js', './src/controllers/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export const app = express();

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(compression());
app.use(refreshTokenMiddleware);

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

export const connectDatabase = async () => {
  try {
    await sequelize.authenticate();
    associateAllModels();
    await sequelize.sync({ force: false });
    console.log('Coneccion establecida correctamente.');
    await seedInitialData();
    console.log('Datos de la semilla creados.');
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error.message);
    throw error;
  }
};

app.get('/', (req, res) => {
  res.send('HollyU API running');
});

app.use('/api', colores);
app.use('/api', productos);
app.use('/api', categorias);
app.use('/api', generos);
app.use('/api', tallas);
app.use('/api', tipos_tela);
app.use('/api', modelos);
app.use('/api', pedidos);
app.use('/api', clientes);
app.use('/api', auth);
app.use('/api', pagos);
app.use('/api', producciones);
