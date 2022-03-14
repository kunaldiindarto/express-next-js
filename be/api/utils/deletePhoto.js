const fs = require("fs");

const deletePhoto = (path) => {
  const pathPhoto = path.split("\\");
  const resultSplit = `./${pathPhoto[0]}/${pathPhoto[pathPhoto.length - 1]}`;
  const deletePhoto = fs.unlinkSync(resultSplit);
  if (deletePhoto === undefined) console.log("berhasil hapus file foto file");
};

module.exports = { deletePhoto };
