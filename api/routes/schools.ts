import { Database } from '../database';
import * as PromiseRouter from 'express-promise-router';

var fs = require('fs');

var db = new Database();
var router = PromiseRouter();
router.route('/')
  .get((req, res) => {
    db.all(`select SchoolID, Name from school order by Name asc`)
    .then(result => res.json(result));
  })
  .post((req, res) => {
    db.run(`insert into school (Name) values (?)`, [req.body.Name])
    .then(result => res.json(result));
  });
  
router.route('/:SchoolID')
  .get((req, res) => {
    db.all(`select SchoolID, Name from school where SchoolID=? order by Name asc`, req.params.SchoolID)
    .then(result => res.json(result));
  })
  .put((req, res) => {
    db.run(`update school set Name=? where SchoolID=?`, [req.body.Name, req.params.SchoolID])
    .then(result => res.json({status: 'OK'}));
  })
  .delete((req, res) => {
    //also deletes all foreign courses linked to school, and equiv courses linked to those foreign courses
    db.run(`delete from equivcourse where foreigncourseid in (select courseid from foreigncourse where schoolid=?)`, req.params.SchoolID)
    .then(result1 => {
      console.log(result1);
      db.run(`delete from foreigncourse where SchoolID=?`, req.params.SchoolID)
      .then(result2 => {
        console.log(result2);
        db.run(`delete from school where SchoolID=?`, req.params.SchoolID)
        .then(result3 => {
          console.log(result3);
          res.json({status: 'OK'});
        });
      });
    });
  });
  

export var SchoolsRouter = router;
