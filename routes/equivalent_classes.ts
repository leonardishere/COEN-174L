import { Database } from '../database';
import * as PromiseRouter from 'express-promise-router';

var db = new Database();
var router = PromiseRouter();
router.route('/')
  .get((req, res) => {
    db.all(`SELECT * FROM EquivalentClasses`)
    .then(result => res.json(result));
  })
  .post((req, res) => {
    db.run(`INSERT INTO EquivalentClasses
      (SCUClassID, OtherClassID, Status, EquivID)
      VALUES (?,?,?,?)`,
      [req.body.SCUClassID, req.body.OtherClassID, req.body.Status, req.body.EquivID])
    .then(result => res.json({ row: result.stmt.lastID }));
  });
router.route('/:SCUClassID')
  .get((req, res) => {
    db.all(`SELECT * FROM EquivalentClasses WHERE SCUClassID=?`, req.params.SCUClassID)
    .then(result => res.json(result));
  })
  .put((req, res) => {
    db.run(`UPDATE EquivalentClasses
      SET OtherClassID=?, Status=?, EquivID=?
      WHERE SCUClassID=?`,
      [req.body.OtherClassID, req.body.Status, req.body.EquivID, req.params.SCUClassID])
    .then(result => res.json({ status: 'OK' }));
  })
  .delete((req, res) => {
    db.run(`DELETE FROM EquivalentClasses WHERE SCUClassID=?`, req.params.SCUClassID)
    .then(result => res.json({ status: 'OK' }));
  });

export var EquivalentClassesRouter = router;
