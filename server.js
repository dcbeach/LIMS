var express = require("express");
var fs = require("fs");
var app = express();

var server = app.listen(3000, function () {
  console.log("Listening on port 3000");
});

app.use(express.static("public"));

const Excel = require("exceljs");
const fileupload = require("express-fileupload");

app.use(fileupload());

async function filesInDirectory() {
  console.log("filesInDirectory()");
  const files = fs.readdirSync(__dirname + "/UploadedFiles/");

  //load data in files to array
  let dataArray = new Array();
  dataArray = await loadFilesToArray(files);
}

async function getExcelData(file) {
  const workbook = new Excel.Workbook();
  let rowReturn = await workbook.csv
    .readFile(__dirname + "/UploadedFiles/" + file)
    .then(async function () {
      console.log("File Loaded...");
      const worksheet = workbook.getWorksheet("sheet1");
      let row = worksheet.getRow(2).values;
      return row;
    });
  return rowReturn;
}

async function saveExcelData(dataArray) {
  let workbook = new Excel.Workbook();
  let worksheet = workbook.addWorksheet("data");

  for (let i = 0; i < dataArray.length; i++) {
    console.log(dataArray[i]);
    worksheet.addRow(dataArray[i]);
  }

  await workbook.xlsx.writeFile("OutputExcel.xlsx");
  console.log("File is written");
}

async function loadFilesToArray(fileNames) {
  console.log("loadFilesToArray()");
  let fileData = new Array();

  for (let i = 0; i < fileNames.length; i++) {
    const file = fileNames[i];
    console.log(`Adding ${file} to master excel`);
    let dataPromise = await getExcelData(file);
    console.log("The data is: ", dataPromise);
    fileData.push(dataPromise);
  }

  saveExcelData(fileData);
}

const createFiles = async () => {
  console.log("createFiles()");

  //Get the file names currently in directory
  const filesPromise = filesInDirectory();
};

app.post("/createFile", (req, res) => {
  console.log("Create file called");
  createFiles();
});

app.post("/saveFile", (req, res) => {
  console.log("Current: app.post");
  const fileName = req.body.filePath.split("/")[0];
  const path = __dirname + "/UploadedFiles/" + fileName + ".csv";

  req.files.dataFile.mv(path, (error) => {
    if (error) {
      console.error(error);
      res.writeHead(500, {
        "Content-Type": "application/json"
      });
      res.end(JSON.stringify({ status: "error", message: error }));
      return;
    }

    res.writeHead(200, {
      "Content-Type": "application/json"
    });
    res.end(
      JSON.stringify({ status: "success", path: "/img/houses/" + fileName })
    );
  });
});
