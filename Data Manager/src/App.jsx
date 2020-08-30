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
      dataTrail: []
    };
    this.updateInputBoxType = this.updateInputBoxType.bind(this);
    this.handleDataUpload = this.handleDataUpload.bind(this);
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

        //Display Sample ID on screen
        const newDataTrail = this.state.dataTrail.slice();
        newDataTrail.push(files[i].webkitRelativePath);
        console.log(newDataTrail);
        this.setState({ dataTrail: newDataTrail });
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
        />
        <InfoConsole dataTrail={this.state.dataTrail} />
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
            <NewProjectBox handleDataUpload={this.props.handleDataUpload} />
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
    // this.handleProjectAdd = this.handleProjectAdd.bind(this);
  }

  // handleProjectAdd(e) {
  //   e.preventDefault();
  //   const form = document.forms.projectAdd;
  //   const auditNode = {
  //     type: "projectAdd",
  //     zsl: form.zsl.value,
  //     client: form.client.value,
  //     description: form.description.value
  //   };
  //   form.zsl.value = "";
  //   form.client.value = "";
  //   form.description.value = "";
  //   this.props.updateInfoConsole(auditNode);
  // }

  componentDidMount() {
    const node = ReactDOM.findDOMNode(this);

    node.querySelector("#uploadButton").addEventListener("change", (event) => {
      this.props.handleDataUpload(event);
    });
  }

  render() {
    return (
      <div className="inputBox">
        <form
          className="datasetForm"
          name="datasetForm"
          onSubmit={this.handleProjectAdd}
        >
          <h2>Data Set</h2>
          <table>
            <tbody>
              <tr>
                <td>
                  <input id="dataSetNameInput" type="text" name="dataset" />
                </td>
                <td>
                  <input
                    id="createNewDatasetButton"
                    type="submit"
                    value="Create New"
                  />
                </td>
              </tr>
              <tr>
                <td colSpan="2">
                  <input
                    id="viewDataSetsButton"
                    type="submit"
                    value="View Data Sets"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </form>
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
  const dataTrail = props.dataTrail.map((dataNode) => (
    <DataNode key={dataNode.id} dataNode={dataNode} />
  ));

  return (
    <div className="infoconsole">
      <table className="auditnode">
        <tbody>{dataTrail}</tbody>
      </table>
    </div>
  );
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
        <button>Edit Data</button>
      </td>
    </tr>
  );
}

const topBanner = <TopBanner />;
ReactDOM.render(topBanner, document.getElementById("topbanner"));

const element = <FullUI />;
ReactDOM.render(element, document.getElementById("content"));
