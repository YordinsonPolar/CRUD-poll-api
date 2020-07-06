const paginatedResults = (model) => {
	return async (req,res,next) => {
		const page = +req.query.page;
		const limit = +req.query.limit;
		const filter = JSON.parse(req.query.filter) || {};


		const startIndex = (page - 1) * limit;
		const endIndex = page * limit;

		const results = {};

		if (endIndex < await model.countDocuments()) {
			results.next = { page: page + 1, limit };
		}
		if (startIndex > 0) {
			results.previous = { page: page - 1, limit };
		}

		try {
			results.results = await model.find(filter).limit(limit).skip(startIndex);
			res.paginatedResults = results;
			return next();
		}catch(err){
			return res.status(500).json({ message: err.message });
		}
	}
	
}

exports.paginatedResults = paginatedResults;