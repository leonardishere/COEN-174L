import { Database } from '../database';
import * as PromiseRouter from 'express-promise-router';

var fs = require('fs');

var db = new Database();
var router = PromiseRouter();
router.route('/')
  .get((req, res) => {
	db.all(`select * from user order by Name asc`)
	.then(result => res.json(result));
  });
  
router.route('/:UserID')
  .get((req, res) => {
    db.all(`select * from user where UserID=?order by Name asc`, req.params.UserID)
    .then(result => res.json(result));
  })
  .put((req, res) => {
    db.run(`update user set Name=?, Email=?, Position=? where UserID=?`, [req.body.Name, req.body.Email, req.body.Position, req.params.UserID])
    .then(result => {console.log(req.body);res.json({ status: 'OK' });});
  })
  .delete((req, res) => {
    db.run(`delete from user where UserID=?`, req.params.UserID)
    .then(result => {
      db.run(`update equivcourse set lockedby=null where lockedby=?`, req.params.UserID)
      .then(result2 => {
        res.json({status: 'OK'})
      });
    });
  });

export var UsersRouter = router;
