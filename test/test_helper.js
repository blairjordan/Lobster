const mongoose = require('mongoose');

import {connectToMongo, connectToPostgres} from '../db/connect';

connectToMongo();
connectToPostgres();
