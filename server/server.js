const morgan = require('morgan');
const express = require('express');
const compression = require('compression')
const logger = require('../log/log4js')
const { engine } = require('express-handlebars');
const cors = require('cors');
const path = require('path');
const expressSession = require('express-session')
const passport = require('passport');
const mongoStore = require('connect-mongo')
const cluster = require('cluster')
const numCPUs = require('os').cpus().length
const { config, mongodbSecretPin, userSessionTime, mongodbUri } = require('../config/enviroment')


const advancedOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}


const baseProcces = () => {

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Process ${worker.process.pid} failure!`)
        cluster.fork()
    })

    const { Server: HTTPServer } = require('http');

    const infoRouter = require('../routes/api/infoRouter')
    const notesRouter = require("../routes/api/notesRouter");
    const authWebRouter = require('../routes/web/authRouter')


    const connectToDb = require("../config/connectToDB");

    const app = express();

    const httpServer = new HTTPServer(app);

    //Settings
    app.engine('hbs', engine());
    app.set('view engine', 'hbs');
    app.set('port', process.env.PORT || 8080)
    app.set('json spaces', 2)


    //Middlewares
    app.set(express.static(path.join(__dirname, 'public')));
    app.use(compression())
    app.use(morgan('dev'))
    app.use(express.urlencoded({ extended: true }))
    app.use(express.json())

    // Habilita CORS para todas las rutas y orígenes (en desarrollo puedes ajustarlo según tus necesidades)
    app.use(cors());


    app.use(expressSession({
        store: mongoStore.create({
            mongoUrl: mongodbUri,
            mongoOptions: advancedOptions
        }),
        secret: mongodbSecretPin,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: Number(userSessionTime)
        }
    }))


    app.use(passport.initialize());
    app.use(passport.session());

    // Configura el encabezado CORS para permitir solicitudes desde 'http://localhost:3000'
    app.use((req, res, next) => {
        const allowedOrigins = [
            'http://localhost:3000',
            'https://apianotador.ivanbodeveloper.com',
            'https://anotador.ivanbodeveloper.com',
            'http://anotador.ivanbodeveloper.com',
            'http://apianotador.ivanbodeveloper.com',
        ];

        const origin = req.headers.origin;
        if (allowedOrigins.includes(origin)) {
            res.setHeader('Access-Control-Allow-Origin', origin);
        }

        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        next();
    });

   
    const PORT = 8080
    const server = httpServer.listen(PORT, () => {
        connectToDb("mongo")
        //logger.info(`Servidor http escuchando en el puerto ${server.address().port}`)
    })
    server.on('error', error => logger.error(`Error en servidor ${error}`))

    //Routes
    app.use("/", infoRouter)
    app.use("/", notesRouter)
    //__ WebServ Routes __//
    app.use("/", authWebRouter)

}


if (config.mode != 'CLUSTER') {

    //-- Servidor FORK
    logger.info('Server en modo FORK')
    logger.info('-------------------')
    baseProcces()
} else {

    //-- Servidor CLUSTER   
    if (cluster.isPrimary) {
        logger.info('Server en modo CLUSTER')
        logger.info('----------------------')
        for (let i = 0; i < numCPUs; i++) { // creo tantos procesos como cpus tengo
            cluster.fork()
        }
    } else {
        baseProcces()
    }
}


