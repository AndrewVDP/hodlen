const MongoClient = require('mongodb').MongoClient;
const debug = require('debug')('lib:mongo');

const host = process.env.MONGO_HOST || '0.0.0.0';
const port = process.env.MONGO_PORT || 27017;
const database = process.env.DATABASE || 'icolist';

let db;
exports.db = () => {
  if (typeof db === 'undefined') {
    db = MongoClient.connect(`mongodb://${host}:${port}/${database}`)
      .then(dbCursor => {
        db = dbCursor;
        return Promise.resolve(db);
      })
      .catch(err => {throw err});
  }
  return db;
};

const find = (filter, options, collection) => {
	return db.collection(collection)
		.find(filter, options)
		.toArray()
		.then(data => Promise.resolve(data[0]))
		.catch(err => {
			debug('find err', err);
			Promise.reject(err);
		})
	}

const insertOne = (doc, collection) => {
	const options = {};
	return db.collection(collection)
		.insertOne(doc, options)
		.then(data => Promise.resolve({"id": data.insertedId}))
		.catch(err => {
			debug('insertOne', err);
			return Promise.reject(err);
		})
	}

const update = (filter, collection, data) => {
	return db.collection(collection)
		.update(filter, { $push: data })
		.then(res => Promise.resolve(res))
		.catch(err => {
			debug('update', err);
			Promise.reject(err);
		})
}

const deleteOne = (id, collection) => {
	const filter = {'id': id};
	const options = {};
	return db.collection(collection)
		.deleteOne(filter, options)
		.then(data => Promise.resolve(data))
		.catch(err => {
			debug('deleteOne', err);
			return Promise.reject(err);
		})
	}

exports.insertOne = insertOne;
exports.deleteOne = deleteOne;
exports.update = update;
exports.find =find;
