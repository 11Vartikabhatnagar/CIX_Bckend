const path = require("path");
const rootDir = sails.config.appPath;

async function fileUploadController(inputs, exits) {
  const saveAs =
    inputs.file.fileName +
    `${path.extname(inputs.file.fileBLOB._files[0].stream.filename)}`;
  let filePath;
  let urlPath;
  if (inputs.file.uploadType && inputs.file.uploadType == "doc") {
    filePath = "/assets" + inputs.file.fileRelativePath + "/docs";
    urlPath = inputs.file.fileRelativePath + "/docs" + `/${saveAs}`;
  } else {
    filePath = "/assets" + inputs.file.fileRelativePath + "/images";
    urlPath = inputs.file.fileRelativePath + "/images" + `/${saveAs}`;
  }
  inputs.file.fileBLOB.upload(
    {
      dirname: path.join(rootDir, filePath),
      saveAs: saveAs,
    },
    (err, files) => {
      if (err) throw err;
      return exits.success({
        message: files.length + " file(s) uploaded successfully!",
        files: files,
        urlPath: urlPath,
      });
    }
  );
}

module.exports = {
  friendlyName: "Handle single file upload",
  description: "A function to handle single file uploads",
  inputs: {
    file: {
      type: "ref",
      description: "The file which needs to uploaded with save as options",
    },
  },
  exits: {},
  fn: fileUploadController,
};
