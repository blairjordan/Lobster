
import express from 'express';
import {stitch} from '../core/lib/pincer';

const router = express.Router();

router.get('/', function (req, res) {
  res.render('tiles');
});

let demoImg = 'http://labs.pegleg.com.au/images/grid_1K.png';

router.get('/all', function (req, res) {
  res.json([
    {i: 0, x: 0, y: 0, url: demoImg, selected: false},
    {i: 1, x: 4, y: 4, url: demoImg, selected: false},
    {i: 2, x: 6, y: 8, url: demoImg, selected: false},
    {i: 3, x: 7, y: 3, url: demoImg, selected: false},
    {i: 4, x: 3, y: 5, url: demoImg, selected: false},
    {i: 5, x: 8, y: 6, url: demoImg, selected: false},
    {i: 6, x: 6, y: 8, url: demoImg, selected: false},
    {i: 5, x: 4, y: -3, url: demoImg, selected: false},
    {i: 8, x: -4, y: -2, url: demoImg, selected: false},
    {i: 9, x: -1, y: 1, url: demoImg, selected: false},
    {i: 10, x: 1, y: -1, url: demoImg, selected: false},
    {i: 11, x: 1, y: 1, url: demoImg, selected: false},
    {i: 12, x: -1, y: -1, url: demoImg, selected: false},
    {i: 13, x: -2, y: -1, url: demoImg, selected: false}
  ]);
});

router.post('/make', function (req, res) {
  const { size, tiles } = req.body;
  stitch({ size, tiles });
  
  res.json(req.body);
});

export default router;