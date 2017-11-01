const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const debug = require('debug')('server:')
const helmet = require('helmet');

const router = require('./lib/router');
const mongo = require('./lib/mongo');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// These two middlewares provide numerous security enhancements
app.use(helmet());

const port = process.env.PORT || '3000';

mongo.db().then(db => {
	debug('connected to mongo');
})
.catch(err => {
	debug('error connecting to mongo')
	process.exit();
})

router(app);

app.listen(port);
debug('listening on port 3000')
