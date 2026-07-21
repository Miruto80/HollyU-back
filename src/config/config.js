import {loadEnvFile} from 'node:process'

loadEnvFile('.env')

export default {
    dbPort: process.env.DB_PORT,
    dbName: process.env.DB_NAME,
    dbUser: process.env.DB_USER,
    dbHost: process.env.DB_HOST,
    dbPass: process.env.DB_PASS,
    smtpuser: process.env.SMTP_USER,
    smtppass: process.env.SMTP_PASSWORD,
    smtpname: process.env.SMTP_FROM,
    smtpserver: process.env.SMTP_SERVER,
    smtpports: process.env.SMTP_PORT,
    port: process.env.PORT,
    secret: process.env.JWTPASSWORD,
    jwtExpiresIn:process.env.JWTEXPIRES

}