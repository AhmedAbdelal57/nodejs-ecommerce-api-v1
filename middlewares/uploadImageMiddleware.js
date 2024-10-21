const multer = require("multer");
const ApiError = require("../utils/apiError");
//to storage image
const multerOptions = () => {
  //1-configration for destination of image files DiskStorage
  /* const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/categories");
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split("/")[1];
    const uniqueFilename = `category-${uuidv4()}-${Date.now()}.${ext}`;
    cb(null, uniqueFilename);
  },
});
 */
  const multerStorage = multer.memoryStorage();
  //allowed only image
  const multerFilter = function (req, file, cb) {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new ApiError("Only Image Allowed", 400), false);
    }
  };
  const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
  return upload;
};

exports.uploadSingleImage = (fieldName) => {
  return multerOptions().single(fieldName);
};

exports.uploadMixImages = (arrayOfFields) => {
  return multerOptions().fields(arrayOfFields);
};
