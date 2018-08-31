#!/bin/sh

psql -d lobster -a -f create_schema.sql
psql -d lobster -a -f seed_db.sql

