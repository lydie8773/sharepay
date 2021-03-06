const getActivities = require("./handlers/getActivities");
const getActivity = require("./handlers/getActivity");
const getAllActivitiesByUser = require ("./handlers/getAllActivitiesByUser");
const getAllActivitiesByUserHistory = require ("./handlers/getAllActivitiesByUserHistory");
const getActivityHeader = require ("./handlers/getActivityHeader");
const getActivityHeaderNew = require ("./handlers/getActivityHeaderNew");
const saveActivityHeader = require ("./handlers/saveActivityHeader");
const accountsPayback = require("./services/accountsPayback");

const getExpenseFromActivity = require ("./handlers/getExpenseFromActivity")
const saveExpense = require ("./handlers/saveExpense")
const loginTemp = require ("./handlers/loginTemp");


const express = require("express");
const app = express();
const nunjucks = require("nunjucks");

const port = process.env.PORT || 3000;

nunjucks.configure("views", {
  autoescape: true,
  express: app
});

/**************Authentication****************/
const session = require("express-session");
const bodyParser = require("body-parser");
// const bcrypt = require("bcrypt-nodejs");
const passport = require("passport");
const authRouter = require("./services/authRouter");
const authFacebook = require("./services/authFacebook");
// const authentication = require("./services/authentication");

// authentication.authentication(passport);

require("./services/authentication")(passport);


app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());

app.use(session({
  secret: "try try try",
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

/********************************************/

app.set("views", __dirname + "/views");
app.set("view engine", "njk");
app.use(express.static("public"));

app.use("/", authRouter);

app.use("/auth", authFacebook);

app.get("/activities", require("connect-ensure-login").ensureLoggedIn(), getAllActivitiesByUser);

app.get("/activitiesUser/:id", require("connect-ensure-login").ensureLoggedIn(), getAllActivitiesByUser);
app.get("/activitiesUser/:id/history", require("connect-ensure-login").ensureLoggedIn(), getAllActivitiesByUserHistory);

app.get("/activities/:id/", require("connect-ensure-login").ensureLoggedIn(), getActivity);
app.get("/expenses/:activityId/:expenseId", require("connect-ensure-login").ensureLoggedIn(), getExpenseFromActivity);
app.get("/expenses/:activityId",require("connect-ensure-login").ensureLoggedIn(), getExpenseFromActivity);

app.get("/activityHeader/:id/", require("connect-ensure-login").ensureLoggedIn(), getActivityHeader);
app.get("/activityHeaderNew", require("connect-ensure-login").ensureLoggedIn(), getActivityHeaderNew);
app.post("/activityHeader", require("connect-ensure-login").ensureLoggedIn(), saveActivityHeader);
app.post("/expense", require("connect-ensure-login").ensureLoggedIn(), saveExpense);

app.get("/accounts/:id", require("connect-ensure-login").ensureLoggedIn(), accountsPayback.getActivityForAccount);

app.get("/loginTemp/:email", loginTemp);

// app.get("*", function(request, result) {
//   result.send("page not found !!");
// })

app.listen(port, function () {
  console.log("Server listening on port:" + port);
});
