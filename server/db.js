import {MongoClient} from "mongodb";

const uri = "mongodb+srv://jhonathanp:R94n1NE5ALfVjNy6@telemedicina.jxpoiam.mongodb.net/?retryWrites=true&w=majority";
=======
const uri = "mongodb+srv://jhonathanp:R9n1NE5ALfVjNy6@telemedicina.jxpoiam.mongodb.net/?retryWrites=true&w=majority";
>>>>>>> 807f7f7e638a65735d930e1ff9e91873cd904166

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri)
export const MONGO_CLIENT = client.db('telemedicina')

