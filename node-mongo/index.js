const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");

const url = "mongodb://localhost:27017/";
const dbname = "conFusion";
const dboperations = require("./operations");

MongoClient.connect(url, (err, client) => {
  assert.equal(err, null);

  console.log("Connected correctly to server");

  const db = client.db(dbname);
  dboperations.insertDocument(db,{name: "Vadonut", description: "Test"},"dishes",result=>
  {
    console.log("Insert Document:\n",result.ops);

    dboperations.findDocuments(db,"dishes",(docs)=>
    {
      console.log("Found Documents:\n", docs);

      dboperations.updateDocument(db,{ name: "Vadonut" },
      { description: "Updated Test" }, "dishes",(result)=>
      {
        console.log("Updated Document:\n", result.result);
        
        dboperations.findDocuments(db,"dishes",(docs)=>
        {
          console.log("Found Updated Documents:\n", docs);

          db.dropCollection("dishes",(result)=>
          {
            console.log("Dropped Collection: ", result);

            client.close();
          });
        })
      });
    });

  })
  
});
