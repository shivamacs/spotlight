const path = require('path');
const express = require('express');
const app = express();
const { userRouter } = require('./router/userRouter');
const { postRouter } = require('./router/postRouter');

// to send static resources to client
app.use(express.static('view'));
// it is a good practice to use path.join(__dirname, "<relative-path-name>"), 
// although we can write <relative-path-name> only instead of using path.join 
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.use('/api/v1/user', userRouter);
app.use('/api/v1/post', postRouter);

// localhost:4000
app.listen(4000, function() {
    console.log('Server is listening at port 4000...')
})