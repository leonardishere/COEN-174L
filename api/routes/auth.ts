import { Database } from '../database';
import * as PromiseRouter from 'express-promise-router';
import * as passport from 'passport';
import * as jwt from 'jsonwebtoken';
import * as expressJwt from 'express-jwt';
var GoogleStrategy = require('passport-google-oauth20').Strategy;

var jwtSecret = 'SECRET';
var redirectUrl = 'http://students.engr.scu.edu/~rdecker/coen174/#/login'; //REPLACE ME

var db = new Database();
passport.use(new GoogleStrategy({
    clientID: '771057891701-b3ouu6epu8hnrgpmdafrvaf7r2bctrbr.apps.googleusercontent.com', //REPLACE ME
    clientSecret: 'Q1bkDNj2HvWamByHX2SAUGD-', //REPLACE ME
    callbackURL: "http://rowandecker.com:3000/auth/callback" //REPLACE ME
	},
	(accessToken, refreshToken, profile, cb) => {
		let email = profile.emails[0].value;
		console.log('EMail=', email);
		db.get(`SELECT * FROM User WHERE Email=?`, email)
		.then(user => {
			let err = "";
			if (!user) { 
				err = "Invalid account.";
			}
			cb(err, user);
		});
	}
));
passport.serializeUser((user, done) => done(null, user.UserID) );
passport.deserializeUser(function(id, done) {
	db.get(`SELECT * FROM User WHERE UserID=?`, id)
	.then(user => {
		let err = "";
		if (!user) { 
			err = "Invalid account.";
		}
		done(err, user);
	});
});

var router = PromiseRouter();
router.get('/',
	passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/test', expressJwt({secret: jwtSecret}),
	(req, res) => res.json(req.user)
);

router.get('/callback', 
	passport.authenticate('google', { failureRedirect: '/auth' }),
	(req, res) => {
		let token = jwt.sign(req.user, jwtSecret);
		res.redirect(redirectUrl + '?token=' + token);
	}
);

router.post('/add', (req, res) => 
    db.run(`INSERT INTO User
      (Name, Position, Email)
      VALUES (?,?,?)`,
      [req.body.Name, req.body.Position, req.body.Email])
    .then(result => res.json({ row: result.stmt.lastID }))
);

export var AuthRouter = router;
