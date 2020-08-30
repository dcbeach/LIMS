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

class TopBanner extends React.Component {
  render() {
    return (
      <React.Fragment>
        <h1 id="topBannerText">Data Manager</h1>
      </React.Fragment>
    );
  }
}

class FullUI extends React.Component {
  constructor() {
    super();
    this.state = {
      auditTrail: [],
      inputBoxType: "newProjectView",
      dataTrail: [],
      dataSets: [],
      fullDataSet: [],
      infoConsoleDisplayType: "datasetlist",
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
      infoConsoleDisplayType: "filelist"
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
    this.setState({ infoConsoleDisplayType: "datasetlist" });
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

class LeftColumn extends React.Component {
  render() {
    switch (this.props.inputBoxType) {
      case "newProjectView":
        return (
          <div className="leftcolumn">
            <InfoBox updateInputBoxType={this.props.updateInputBoxType} />
            <NewProjectBox
              handleDataUpload={this.props.handleDataUpload}
              addDataSet={this.props.addDataSet}
              viewDataSets={this.props.viewDataSets}
            />
          </div>
        );
      case "defaultView":
        return (
          <div className="leftcolumn">
            <InfoBox updateInputBoxType={this.props.updateInputBoxType} />
            <DefaultProjectBox />
          </div>
        );
    }
  }
}

function InfoBox(props) {
  return (
    <div className="buttonBox">
      <span className="infoboxspans">ZSL: {props.zsl}</span>
      <span className="infoboxspans">Client: {props.client}</span>
      <span className="infoboxspans">Data Type: {props.dataType}</span>
    </div>
  );
}

class NewProjectBox extends React.Component {
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

  componentDidMount() {
    const node = ReactDOM.findDOMNode(this);

    node.querySelector("#uploadButton").addEventListener("change", (event) => {
      this.props.handleDataUpload(event);
    });
  }

  render() {
    return (
      <div className="inputBox">
        {/* <form
          className="datasetForm"
          name="datasetForm"
          onSubmit={this.handleProjectAdd}
        > */}
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
        {/* </form> */}
        <br />
        <hr />

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
    );
  }
}

class DefaultProjectBox extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div>
        Default <br />
        box
      </div>
    );
  }
}

class LoadData extends React.Component {
  constructor() {
    super();
    this.handleUploadClick = this.handleUploadClick.bind(this);
  }

  handleUploadClick() {}

  render() {
    return (
      <div className="loadData">
        <label>Data Upload Handler</label> <br />
        <button onClick={this.handleUploadClick}>Load a File</button>
      </div>
    );
  }
}

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

const element = <FullUI />;
ReactDOM.render(element, document.getElementById("content"));
