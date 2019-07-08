const express = require('express');
const application = express();
const vhost = require('vhost');
const fs = require('fs');
const handler = require('serve-handler');
const history = require('connect-history-api-fallback');
const parser = require('body-parser');
const methodOverride = require('method-override');
const options = {
    pfx: fs.readFileSync('./iwantproject.com.br.pfx'),
    passphrase: 'mxzL3duFRJzr'
};
const server = require('https').createServer(options, application);
global.io = require('socket.io').listen(server);

const api = express();
api.use(parser.urlencoded({ extended: true }));
api.use(parser.json());
api.use(methodOverride());
api.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

require('./api/routes/authRoutes')(api);
require('./api/routes/usersRoutes')(api);
require('./api/routes/patientsRoutes')(api);
require('./api/routes/appointmentsRoutes')(api);
require('./api/routes/agreementsRoutes')(api);
require('./api/routes/utilsRoutes')(api);
require('./api/sockets/waitingListSockets')(io);

api.use((error, req, res, next) => {
    const status = error.message.statusCode || error.statusCode || 500;
    const message = error.message.message || error.message;
    const data = error.data;
    res.status(status).json({
        message: message,
        data: data
    });
});

const app = express();
app.use(history());
app.use('/', async (req, res) => {
    await handler(req, res, {
        "headers": [
            {
                "source": "**/*.@(jpg|jpeg|gif|png)",
                "headers": [{
                    "key": "Cache-Control",
                    "value": "max-age=0"
                }]
            }
        ],
        "cleanUrls": false,
        "public": "../wcn-front-project/dist"
    });
});

application.set('port', 443);
application.use(vhost('api.iwantproject.com.br', api));
application.use(vhost('webclin.iwantproject.com.br', app));

server.listen(application.get('port'), function () {
    console.log('Express app listening at http://%s:%s', server.address().address, server.address().port);
});