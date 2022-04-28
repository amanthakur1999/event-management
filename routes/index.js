var express = require('express');
var router = express.Router();
var Event = require('../models/event');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/filter', (req, res, next) => {
  var query = req.query;

  if (query.fcategory !== '' && query.flocation !== '') {
    var filtpara = {
      $and: [
        { event_category: { $in: [query.fcategory] } },
        { location: query.flocation },
      ],
    };
  } else if (query.fcategory === '' && query.flocation !== '') {
    var filtpara = { location: { $in: [query.flocation] } };
  } else if (query.fcategory != '' && query.flocation == '') {
    var filtpara = { event_category: { $in: [query.fcategory] } };
  } else {
    var filtpara = {};
  }
  if (query.fdate == 'Latest') {
    var sortEvent = { start_date: -1 };
  } else {
    var sortEvent = { start_date: 1 };
  }

  Event.find(filtpara)
    .sort(sortEvent)
    .exec((err, events) => {
      console.log(events);
      if (err) return next(err);
      Event.distinct('location', (err, locations) => {
        console.log(locations);
        Event.distinct('event_category', (err, categories) => {
          console.log(categories, 'aman');

          res.render('event', { events, locations, categories });
        });
      });
    });
});

module.exports = router;
