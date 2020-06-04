const express = require('express');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');

const graphQLSchema = require('./graphql/schema/index');
const graphQLResolvers = require('./graphql/resolvers/index');

const app = express();

//app.use(express.json());

app.use('/graphql', graphqlHttp({
    schema: graphQLSchema,
    rootValue: graphQLResolvers,
    graphiql: true   
}));

mongoose
    .connect(
        'mongodb+srv://' + process.env.MONGO_USER + 
        ':' + process.env.MONGO_PASSWORD + 
        '@graphqlapicluster-dni6u.mongodb.net/' + 
        process.env.MONGO_DB + '?retryWrites=true&w=majority',
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        }
    )
    .then(() => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });