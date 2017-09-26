#!/bin/bash
npm install
cat schema.sql | sqlite3 database.sqlite
