const assert = require("assert");

exports.insertDocument = (db, document, collection, callback) => {
  const col = db.collection(collection);

  return  col.insert(document);
};

exports.findDocuments = (db,collection,callback)=>
{
      const coll = db.collection(collection);
     return  coll.find({}).toArray();
};


exports.removeDocument = (db,document,collection,callback)=>
{
       const coll = db.collection(collection);
       return col.deleteOne(document);
};
exports.updateDocument  = (db,document,update,collection,callback)=>
{
    const coll = db.collection(collection);

    return coll.updateOne(document, { $set: update }, null);
}
