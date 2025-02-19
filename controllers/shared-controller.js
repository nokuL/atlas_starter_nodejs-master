const { MongoClient } = require("mongodb");
const uri =
"mongodb+srv://noku:noku@cluster0.s6jlt.mongodb.net?retryWrites=true&w=majority";

// The MongoClient is the object that references the connection to our
// datastore (Atlas, for example)
const client = new MongoClient(uri);

// The connect() method does not attempt a connection; instead it instructs
// the driver to connect using the settings provided when a connection
// is required.
await client.connect();

// Provide the name of the database and collection you want to use.
// If the database and/or collection do not exist, the driver and Atlas
// will create them automatically when you first write data.
const dbName = "places_db";
const collectionName = "more_recipes";

// Create references to the database and collection in order to run
// operations on them.
const database = client.db(dbName);
const collection = database.collection(collectionName);


const createPlace = async (req, res, next) => {
    const { title, description, coordinates, address, creator } = req.body;
    const createdPlace = {
      title,
      description,
      location: coordinates,
      address,
      creator
    };
      try {
    const insertPlaceResult = await collection.inserOne(createPlace);
    console.log(`${insertPlaceResult.insertedCount} documents successfully inserted.\n`);
    res.status(201).json({ place: createdPlace });

  } catch (err) {
    console.error(`Something went wrong trying to insert the new documents: ${err}\n`);
  }finally{
    await client.close();
  }

};


async function run() {
  // TODO:
  // Replace the placeholder connection string below with your
  // Altas cluster specifics. Be sure it includes
  // a valid username and password! Note that in a production environment,
  // you do not want to store your password in plain-text here.


  /*
   *  *** INSERT DOCUMENTS ***
   *
   * You can insert individual documents using collection.insert().
   * In this example, we're going to create four documents and then
   * insert them all in one call with collection.insertMany().
   */

   const recipes = [
    {
      name: "elotes",
      ingredients: [
        "corn",
        "mayonnaise",
        "cotija cheese",
        "sour cream",
        "lime",
      ],
      prepTimeInMinutes: 35,
    },
    {
      name: "loco moco",
      ingredients: [
        "ground beef",
        "butter",
        "onion",
        "egg",
        "bread bun",
        "mushrooms",
      ],
      prepTimeInMinutes: 54,
    },
    {
      name: "patatas bravas",
      ingredients: [
        "potato",
        "tomato",
        "olive oil",
        "onion",
        "garlic",
        "paprika",
      ],
      prepTimeInMinutes: 80,
    },
    {
      name: "fried rice",
      ingredients: [
        "rice",
        "soy sauce",
        "egg",
        "onion",
        "pea",
        "carrot",
        "sesame oil",
      ],
      prepTimeInMinutes: 40,
    },
  ];





  const findQuery = { prepTimeInMinutes: { $lt: 45 } };

  try {
    const cursor = await collection.find(findQuery).sort({ name: 1 });
    await cursor.forEach(recipe => {
      console.log(`${recipe.name} has ${recipe.ingredients.length} ingredients and takes ${recipe.prepTimeInMinutes} minutes to make.`);
    });
    // add a linebreak
    console.log();
  } catch (err) {
    console.error(`Something went wrong trying to find the documents: ${err}\n`);
  }

  // We can also find a single document. Let's find the first document
  // that has the string "potato" in the ingredients list.
  const findOneQuery = { ingredients: "potato" };

  try {
    const findOneResult = await collection.findOne(findOneQuery);
    if (findOneResult === null) {
      console.log("Couldn't find any recipes that contain 'potato' as an ingredient.\n");
    } else {
      console.log(`Found a recipe with 'potato' as an ingredient:\n${JSON.stringify(findOneResult)}\n`);
    }
  } catch (err) {
    console.error(`Something went wrong trying to find one document: ${err}\n`);
  }

 
  const updateDoc = { $set: { prepTimeInMinutes: 72 } };

  // The following updateOptions document specifies that we want the *updated*
  // document to be returned. By default, we get the document as it was *before*
  // the update.
  const updateOptions = { returnOriginal: false };

  try {
    const updateResult = await collection.findOneAndUpdate(
      findOneQuery,
      updateDoc,
      updateOptions,
    );
    console.log(`Here is the updated document:\n${JSON.stringify(updateResult.value)}\n`);
  } catch (err) {
    console.error(`Something went wrong trying to update one document: ${err}\n`);
  }




  const deleteQuery = { name: { $in: ["elotes", "fried rice"] } };
  try {
    const deleteResult = await collection.deleteMany(deleteQuery);
    console.log(`Deleted ${deleteResult.deletedCount} documents\n`);
  } catch (err) {
    console.error(`Something went wrong trying to delete documents: ${err}\n`);
  }

  // Make sure to call close() on your client to perform cleanup operations
  await client.close();
  // Return the client so that it can be imported in another class
  return client;
}