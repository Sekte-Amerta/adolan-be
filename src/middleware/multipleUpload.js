const path = require("path");
const multer = require("multer");
const crypto = require("crypto");

// management file
const maxSize = 2 * 1024 * 1024;
const multerUpload = multer({
	storage: multer.diskStorage({
		destination: (req, file, cb) => {
			if (file.fieldname === "photo") {
				cb(null, "./public");
			}
			else if (file.fieldname === "file") {
				cb(null, "./public");
			}
		},
		filename: (req, file, cb) => {
			const name = crypto.randomBytes(30).toString("hex");
			const ext = path.extname(file.originalname);
			const filename = `${name}${ext}`;
			cb(null, filename);
		},
	}),
	fileFilter: (req, file, cb) => {
		if (file.fieldname === "photo") {
			// filter mimetype
			if (
				file.mimetype === "image/png"
				|| file.mimetype === "image/jpg"
				|| file.mimetype === "image/jpeg"
			) {
				cb(null, true);
			} else {
				cb({ message: "Photo extension only can .jpg, .jpeg, and .png" }, false);
			}
		}
		else if (file.fieldname === "file") {
			// filter mimetype
			if (
				file.mimetype === "text/csv"
				|| file.mimetype === "application/msword"
				|| file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
				|| file.mimetype === "application/pdf"
				|| file.mimetype === "application/vnd.ms-excel"
				|| file.mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                
			) {
				cb(null, true);
			} else {
				cb({ message: "File extension only can .csv, .doc, .docx, xls, xlsx, and .pdf" }, false);
			}
		}
		
	},
	limits: { fileSize: maxSize },
});

// middleware
module.exports = (req, res, next) => {
	const multerFields = multerUpload.fields([
		{
			name: "photo",
			maxCount: 100,
		},
		{
			name: "file",
			maxCount: 100,
		},
	]);
	multerFields(req, res, (err) => {
		if (err) {
			let errorMessage = err.message;
			if (err.code === "LIMIT_FILE_SIZE") {
				errorMessage = `File ${err.field} too large, max 2mb`;
			}
			if (err.code === "LIMIT_UNEXPECTED_FILE") {
				errorMessage = "Maximum files that can be uploaded is 100";
			}
            return res.json({
                code: 400,
				status: "error",
				message: "Upload File Error",
				error: errorMessage,
            })
		} else {
			next();
		}
	});
};
