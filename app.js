const express = require("express");
const app = express();
const configRoutes = require("./routes");
const static = express.static(__dirname + "/public");
const exphbs = require("express-handlebars");
const session = require("express-session");


const handlebarsInstance = exphbs.create({
    defaultLayout: 'main',
    // Specify helpers which are only registered on this instance.
    helpers: {
        asJSON: (obj, spacing) => {
            if (typeof spacing === 'number')
                return new Handlebars.SafeString(JSON.stringify(obj, null, spacing));

            return new Handlebars.SafeString(JSON.stringify(obj));
        }
    },
    partialsDir: ['views/partials/']
});

app.use;
app.use('/public', static);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.engine('handlebars', handlebarsInstance.engine);
app.set('view engine', 'handlebars');


app.use(session({
    name: 'AuthCookie',
    secret: 'Dont Touch Me',
    resave: false,
    saveUninitialized: true
}))

// app.use('/private', (req, res, next) => {
//     if (!req.session.user) {
//         return res.status(403).render("users/error", { title: "You are not logged In", error: "So please log in" });
//     } else {
//         next();
//     }
// });

let m = function(req, res, next) {
    let time = new Date().toUTCString();
    let RM = req.method;
    let RR = req.originalUrl;
    if (!req.session.user) {
        console.log("[" + time + "]: " + RM + " " + RR + " Non-Authenticated User");
    } else {

        console.log("[" + time + "]: " + RM + " " + RR + " Authenticated User");
    }
    next();
}

app.use(m)
configRoutes(app);

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3000');
});
