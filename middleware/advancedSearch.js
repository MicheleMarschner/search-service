const geocoder = require('../utils/geocoder');

const advancedSearch = (model) => async (req, res, next) => {
    let query;
    let textQuery;

    const reqQuery = {...req.query};
    const removeFields = ['select', 'sort', 'page', 'limit', 'zipcode', 'distance', 'text'];

    removeFields.forEach(param => delete reqQuery[param]);

    //transform search query to a dynamic mongoose query
    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    //query = model.find(JSON.parse(queryStr));
    query = JSON.parse(queryStr);

    // Search inRadius
    if(req.query.zipcode & req.query.distance) {
        const {zipcode, distance} = req.query;

        const loc = await geocoder.geocode(zipcode);
        const lat = loc[0].latitude;
        const lng = loc[0].longitude;

        //calc radius using radians, divide distance by radius of Earth
        const radius = distance / 3963

        query = {...query, location: {$geoWithin: { $centerSphere: [ [lng, lat], radius] }}};
    }

    query = model.find(query);

    // Select Fields
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }

    //Sort
    if(req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt');
    }


    //Full Text Search 
    if(req.query.text) {

       textQuery = model.find(
            { $text: { $search: `${req.query.text}`} },
            { score: { $meta: "textScore" } }
         ).sort( { score: { $meta: "textScore" } } )

        console.log(textQuery);
        /*
        model.aggregate([
            {
                $search: {
                  
                    "text": {
                         "query": `${req.query.text}`,
                         'path': ['short_description', 'title', 'body']
                    },
                },
            }
        ]);

         "phrase": {
       "query": "<search-string>",
       "path": ['short_description', 'title', 'body'],
       "score": <options>,
       "slop": <distance-number>
     }

*/
        
    }

    /*
    //Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await model.countDocuments(JSON.parse(queryStr));

    query = query.skip(startIndex).limit(limit);

    if (populate) {
      query = query.populate(populate);
    }
    */
    // Executing query
    req.advancedResults = textQuery;

  /*
    // Pagination result
    const pagination = {};
  
    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }
  
    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }
  
    res.advancedResults = {
      pagination,
    };*/
  
    next();

};



module.exports = advancedSearch;


