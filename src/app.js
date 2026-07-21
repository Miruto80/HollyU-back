import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import compression from 'compression';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

import sequelize from './database/db.js';
import refreshTokenMiddleware from './middlewares/tokenrefresh.midd.js';
import { associateAllModels } from './models/index.js';
import { seedInitialData } from './seed.js';

import marca from './routers/marca.router.js';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hallalo API',
      version: '1.0.0',
      description: 'Documentación de la API de Hallalo',
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

export const connectDatabase = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: false });
    associateAllModels();
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

// app.use('/api', marca);