/**
 * Simple CORS middleware for the UI5 dev server.
 * Needed so the central FLP sandbox (served on another origin, e.g. :8090)
 * can load this plugin's component resources (manifest.json etc.) cross-origin.
 */
module.exports = function () {
	return function (req, res, next) {
		res.setHeader("Access-Control-Allow-Origin", "*");
		res.setHeader("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
		res.setHeader("Access-Control-Allow-Headers", "*");
		if (req.method === "OPTIONS") {
			res.statusCode = 204;
			return res.end();
		}
		next();
	};
};
