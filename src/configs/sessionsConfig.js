import MongoStore from 'connect-mongo';

import dotenv from 'dotenv';
dotenv.config();
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true}

const sessions = {
    secret: `${process.env.SECRET}`,
    resave: true,
    cookie: {
        maxAge: 60*60*1000
    },
    saveUninitialized: false,    
    // rolling: true,
    store: MongoStore.create({
        mongoUrl:`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.mtgsl.mongodb.net/ecommerce?retryWrites=true&w=majority`,
        mongoOptions: advancedOptions
    }),
}

export default sessions