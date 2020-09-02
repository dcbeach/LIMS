function combineExcel() {
  fetch("/createFile", {
    method: "POST"
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data.path);
    })
    .catch((error) => {
      console.error(error);
    });
}

//Display Object: Banner Only
class TopBanner extends React.Component {
  render() {
    return (
      <React.Fragment>
        <h1 id="topBannerText">Data Manager</h1>
      </React.Fragment>
    );
  }
}

//Display Object: The entire Data Manager UI
class DataManagerUI extends React.Component {
  constructor() {
    super();
    this.state = {
      auditTrail: [],
      inputBoxType: "newProjectView",
      dataTrail: [],
      dataSets: [],
      fullDataSet: [],
      infoConsoleDisplayType: "datasetlist",
      uploadBoxVisible: false,
      chosenDataSet: ""
    };
    this.updateInputBoxType = this.updateInputBoxType.bind(this);
    this.handleDataUpload = this.handleDataUpload.bind(this);
    this.addDataSet = this.addDataSet.bind(this);
    this.updateSelectedDataSet = this.updateSelectedDataSet.bind(this);
    this.viewDataSets = this.viewDataSets.bind(this);
  }

  handleDataUpload(event) {
    console.log("Handling File Upload");
    const files = event.target.files;
    var formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      var temp = files[i].webkitRelativePath.split("/")[1];
      if (temp == "lineplot_median.csv") {
        console.log(`Found it at ${i}`);
        console.log(files[i]);
        formData.append("dataFile", files[i]);
        formData.append("filePath", files[i].webkitRelativePath);

        //split the file path to get sample name
        let sampleName = files[i].webkitRelativePath
          .split("/")[0]
          .split(" ")[1];

        //Display Sample ID on screen
        const tempDataSet = this.state.fullDataSet.slice();
        tempDataSet.push({
          dataset: this.state.chosenDataSet,
          sampleName: sampleName
        });
        this.setState({
          dataTrail: tempDataSet
            .filter((x) => x.dataset === this.state.chosenDataSet)
            .map((a) => a.sampleName),
          fullDataSet: tempDataSet
        });
      }
    }

    // fetch("/saveFile", {
    //   method: "POST",
    //   body: formData
    // })
    //   .then((response) => response.json())
    //   .then((data) => {
    //     console.log(data.path);
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //   });
  }

  updateSelectedDataSet(name) {
    console.log("Chosen Data Set: ", name);
    const tempDataSet = this.state.fullDataSet.slice();

    this.setState({
      dataTrail: tempDataSet
        .filter((x) => x.dataset === name)
        .map((a) => a.sampleName),
      chosenDataSet: name,
      infoConsoleDisplayType: "filelist",
      uploadBoxVisible: true
    });
  }

  addDataSet(name) {
    //Add dataset to state
    const newDataSets = this.state.dataSets.slice();
    newDataSets.push(name);
    console.log(newDataSets);
    this.setState({ dataSets: newDataSets });
  }

  //Tells the Info Console to Display List of Data Sets
  viewDataSets() {
    this.setState({ infoConsoleDisplayType: "datasetlist" , uploadBoxVisible: false});
  }

  updateInputBoxType(type) {
    console.log("Im doing this");
    this.setState({ inputBoxType: type });
  }

  render() {
    return (
      <React.Fragment>
        <LeftColumn
          updateInputBoxType={this.updateInputBoxType}
          handleDataUpload={this.handleDataUpload}
          inputBoxType={this.state.inputBoxType}
          addDataSet={this.addDataSet}
          viewDataSets={this.viewDataSets}
          uploadBoxVisible={this.state.uploadBoxVisible}
        />
        <InfoConsole
          dataTrail={this.state.dataTrail}
          dataSets={this.state.dataSets}
          chosenDataSet={this.state.chosenDataSet}
          updateSelectedDataSet={this.updateSelectedDataSet}
          infoConsoleDisplayType={this.state.infoConsoleDisplayType}
        />
      </React.Fragment>
    );
  }
}

//Display Object: Holds the InfoBox and DataControlBox
class LeftColumn extends React.Component {
  render() {
    switch (this.props.uploadBoxVisible) {
      case true:
        return (
          <div className="leftcolumn">
            <InfoBox updateInputBoxType={this.props.updateInputBoxType} />
            <div className="inputBox">
            <DataControlBox
              addDataSet={this.props.addDataSet}
              viewDataSets={this.props.viewDataSets}
            />
            <UploadControlBox handleDataUpload={this.props.handleDataUpload} />
            </div>
          </div>
        );
      case false:
        return (
          <div className="leftcolumn">
            <InfoBox updateInputBoxType={this.props.updateInputBoxType} />
            <div className="inputBox">
            <DataControlBox
              addDataSet={this.props.addDataSet}
              viewDataSets={this.props.viewDataSets}
            />
          </div>
          </div>
        );
    }
  }
}

//Display Object: Show basic project info in top left corner
function InfoBox(props) {
  return (
    <div className="buttonBox">
      <span className="infoboxspans">ZSL: {props.zsl}</span>
      <span className="infoboxspans">Client: {props.client}</span>
      <span className="infoboxspans">Data Type: {props.dataType}</span>
    </div>
  );
}

//Display Object: Shows data set options and upload options
class DataControlBox extends React.Component {
  constructor() {
    super();
    this.handleProjectAdd = this.handleProjectAdd.bind(this);
    this.createNewDataSet = this.createNewDataSet.bind(this);
    this.handleViewDataSets = this.handleViewDataSets.bind(this);
  }

  createNewDataSet() {
    console.log("Creating New DataSet");
    let dataSetName = document.getElementById("dataSetNameInput").value;
    console.log(`Dataset Name: ${dataSetName}`);
    this.props.addDataSet(dataSetName);
    document.getElementById("dataSetNameInput").value = "";
  }

  handleViewDataSets() {
    console.log("Viewing Data Sets");
    this.props.viewDataSets();
  }

  handleProjectAdd(e) {
    e.preventDefault();
    const form = document.forms.projectAdd;
    console.log("E.value = ", e.value);
  }

  

  render() {
    return (
      <div>
        <h2>Data Set</h2>
        <table>
          <tbody>
            <tr>
              <td>
                <input id="dataSetNameInput" type="text" name="dataset" />
              </td>
              <td>
                <button
                  id="createNewDatasetButton"
                  type="button"
                  onClick={this.createNewDataSet}
                >
                  Create New
                </button>
              </td>
            </tr>
            <tr>
              <td colSpan="2">
                <button
                  id="viewDataSetsButton"
                  type="button"
                  onClick={this.handleViewDataSets}
                >
                  View Data Sets
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <br />
        <hr />
      </div>
    );
  }
}

class UploadControlBox extends React.Component {
  componentDidMount() {
    const node = ReactDOM.findDOMNode(this);

    node.querySelector("#uploadButton").addEventListener("change", (event) => {
      this.props.handleDataUpload(event);
    });
  }

  render(){
    return(
      <div id='uploadDiv'>
      <h2>Upload Files</h2>

      <input
        type="checkbox"
        id="singleDataCheckBox"
        name="singleDataCheckBox"
      />
      <label htmlFor="singleDataCheckBox">Flex HD Single File</label>
      <br />

      <input
        type="checkbox"
        id="multipleDataCheckBox"
        name="multipleDataCheckBox"
      />
      <label htmlFor="multipleDataCheckBox">Flex HD Multiple File Data</label>
      <br />

      <div id="buttonWrapper">
        <input
          type="file"
          id="uploadButton"
          name="foo"
          webkitdirectory="true"
          multiple
        />
      </div>
      </div>
    )
    }
}

//Display Object: Shows specified information depending on selected settings
function InfoConsole(props) {
  switch (props.infoConsoleDisplayType) {
    case "default":
      return (
        <div className="leftcolumn">
          <InfoBox updateInputBoxType={props.updateInputBoxType} />
          <NewProjectBox handleDataUpload={props.handleDataUpload} />
        </div>
      );
    case "datasetlist":
      const dataSets = props.dataSets.map((dataSet) => (
        <DataSetNode
          key={dataSet.id}
          dataSet={dataSet}
          updateSelectedDataSet={props.updateSelectedDataSet}
        />
      ));
      return (
        <div className="infoconsole">
          <h2>Data Set List</h2>
          <table className="auditnode">
            <tbody>{dataSets}</tbody>
          </table>
        </div>
      );
    case "filelist":
      const dataTrail = props.dataTrail.map((dataNode) => (
        <DataNode key={dataNode.id} dataNode={dataNode} />
      ));
      return (
        <div className="infoconsole">
          <h2>Data Set: {props.chosenDataSet}</h2>
          <table className="auditnode">
            <tbody>{dataTrail}</tbody>
          </table>
        </div>
      );
  }
}

//Display Object: Shows list of data sets within this ZSL on the Info Console
class DataSetNode extends React.Component {
  constructor() {
    super();
    this.handleUpdateSelectedDataSet = this.handleUpdateSelectedDataSet.bind(
      this
    );
  }

  handleUpdateSelectedDataSet() {
    this.props.updateSelectedDataSet(this.props.dataSet);
  }

  render() {
    const dataSetNode = this.props.dataSet;
    return (
      <tr>
        <td className="infocolumn">
          Set: {dataSetNode} <br />
        </td>
        <td className="buttoncolumn">
          <button onClick={this.handleUpdateSelectedDataSet}>Select</button>
        </td>
      </tr>
    );
  }
}

//Display Object: Rows within Data Set - displayed in Info Console
function DataNode(props) {
  const dataNode = props.dataNode;
  return (
    <tr>
      <td className="infocolumn">
        <b>New File Uploaded</b> <br />
        FileName: {dataNode} <br />
      </td>
      <td className="buttoncolumn">
        <button>View Data</button>
      </td>
    </tr>
  );
}

const topBanner = <TopBanner />;
ReactDOM.render(topBanner, document.getElementById("topbanner"));

const element = <DataManagerUI />;
ReactDOM.render(element, document.getElementById("content"));
