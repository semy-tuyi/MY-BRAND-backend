require('dotenv').config();

const mongoose = require('mongoose');
const express = require('express');

const morgan = require('morgan');
const cors = require('cors');
const swaggerUI = require('swagger-ui-express');

const userRouter = require('./routers/users');
const articleRouter = require('./routers/articles');
const queryRouter = require('./routers/queries');
const swaggerDocs = require('./api-doc.json');

const app = express();

// database url according to envirnment
const envornment = process.env.NODE_ENV;

const dev_db_url = process.env.DEVELOPMENT_DB;
const test_db_url = process.env.TEST_DB;

const connectionUrl = (envornment === 'dev') ? dev_db_url : test_db_url;

mongoose.connect(connectionUrl,{useNewUrlParser: true})
    .then(() => console.log('Now connected to MongoDB!'))
    .catch(err => console.error('Something went wrong', err));

    console.log(connectionUrl);
app.use(express.json());
const port = process.env.PORT;
app.listen(port, () => console.log(`Listening on PORT ${port}...`));
app.get('/', (req, res) => {
    res.json("Welcome to My brand server ").status(200)
})

app.use(morgan("start"));
app.use(cors());

app.use('/article', articleRouter);
app.use('/users', userRouter);
app.use('/query', queryRouter);

app.use('/api-docs',swaggerUI.serve,swaggerUI.setup(swaggerDocs, {explorer: true}));
 
module.exports = app; // for testing