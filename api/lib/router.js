const mongo = require('./mongo');
const debug = require('debug')('lib:router');

const router = (app) => {

  app.route('/')
    .get((req, res) => {
    	const package = require(`${process.cwd()}/package.json`)
    	const name = package.name;
    	const version = package.version;

    	// instead we should have this return a list of routes
    	res.json({name, version});
    })

  /*
  * Interact with users stored in Mongo (possible switch to contract)
  */
  app.route('/api/users/:id/')
    .get((req, res) => {
      const filter = { _id: req.params.id };
      const options = {};
      const collection = 'user';

      mongo.find(filter, options, collection).then(data => {
        res.json(data);
      })
      .catch(err => {
        res.send(err);
      })
    })
    .post((req, res) => {
      const id = req.params.id;
      const body = { _id: id };
      // const body = req.body;
      const collection = 'user';

      mongo.insertOne(body, collection).then(data => {
        res.json(data);
      })
      .catch(err => {
        res.send(err);
      })
    })
    .put((req, res) => {
      const filter = { _id: req.params.id };
      const collection = 'user';
      const name = req.query.name;
      const address = req.query.address;


      const data = {
        invoices: {
          name: name,
          address: address
        }
      };

      mongo.update(filter, collection, data).then(data => {
        res.json(data);
      })
      .catch(err => {
        res.send(err);
      })
    })

  /*
  * Interact with invoice contract
  */

  app.route('/api/invoice/:address')
    .get((req, res) => {

    })
  	.post((req, res) => {

  	})
};

module.exports = router;
