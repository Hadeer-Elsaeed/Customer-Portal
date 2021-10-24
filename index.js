const express = require("express");
const app = express();
const path = require('path')
const authRouter = require("./routes/auth_router");
const customerRouter = require('./routes/customer_router')
const bodyParser = require('body-parser');
const express_session =require("express-session");

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.use(express_session({
    secret:"customer_app"
}));

app.use(express.urlencoded({ extended: true }));
app.set('view engine','ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static((path.join (__dirname,"public"))));


app.use(authRouter);
app.use(customerRouter)

app.listen(3000, () => {
    console.log('Server is running at port 3000');
});