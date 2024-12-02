const path = require("path");
const rootDir = sails.config.appPath;

async function multifileUploadController(inputs, exits) {
  let urlPaths = Array();
  let filePath = path.join(
    rootDir,
    "/assets" + inputs.file.fileRelativePath + "/images"
  );
  let urlPath = inputs.file.fileRelativePath + "/images/";

  inputs.file.fileBLOB.upload(
    {
      maxBytes: 262144000,
      dirname: filePath,
      saveAs: (file, next) => {
        const saveAs =
          `${path
            .parse(file.filename)
            .name.toLowerCase()
            .replace(/\s/g, "_")}_${new Date().getTime()}` +
          `${path.extname(file.filename)}`;
        urlPaths.push(urlPath + saveAs);
        return next(undefined, saveAs);
      },
    },
    (err, files) => {
      // console.log("upload finished");
      if (err) throw err;
      console.log(urlPaths);
      return exits.success({
        message: files.length + " file(s) uploaded successfully!",
        files: files,
        urlPaths: urlPaths,
      });
    }
  );
}

module.exports = {
  friendlyName: "Handle multi file upload",

  description: "A function to handle multi file uploads",

  inputs: {
    file: {
      type: "ref",
      description: "The files which needs to uploaded with save as options",
    },
  },

  exits: {},

  fn: multifileUploadController,
};
