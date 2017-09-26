import * as express from 'express';

var app = express();

app.use('/', (req, res, next) => {
    res.send('hello world');
});

var port = parseInt(process.env.PORT || "3000");
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});
