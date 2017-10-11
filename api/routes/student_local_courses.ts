import { Database } from '../database';
import * as PromiseRouter from 'express-promise-router';

var db = new Database();
var router = PromiseRouter();
router.route('/')
  .get((req, res) => {
    db.all(`SELECT * FROM LocalCourse`)
    .then(result => res.json(result));
  })
  /*
  .post((req, res) => {
    db.run(`INSERT INTO EquivCourse
      (SCUClassID, OtherClassID, Status)
      VALUES (?,?,?)`,
      [req.body.SCUClassID, req.body.OtherClassID, req.body.Status])
    .then(result => res.json({ row: result.stmt.lastID }));
  });
  */
router.route('/:SCUClassID')
  .get((req, res) => {
    db.all(`SELECT * FROM EquivCourse WHERE SCUClassID=?`, req.params.SCUClassID)
    .then(result => res.json(result));
  })
  .put((req, res) => {
    db.run(`UPDATE EquivCourse
      SET OtherClassID=?, Status=?, EquivID=?
      WHERE SCUClassID=?`,
      [req.body.OtherClassID, req.body.Status, req.body.EquivID, req.params.SCUClassID])
    .then(result => res.json({ status: 'OK' }));
  })
  .delete((req, res) => {
    db.run(`DELETE FROM EquivCourse WHERE SCUClassID=?`, req.params.SCUClassID)
    .then(result => res.json({ status: 'OK' }));
  });

export var EquivCourseRouter = router;
