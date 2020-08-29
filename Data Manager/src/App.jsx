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
    this.state = { auditTrail: [], inputBoxType: "newProjectView" };
    this.updateInfoConsole = this.updateInfoConsole.bind(this);
    this.updateInputBoxType = this.updateInputBoxType.bind(this);
  }

  // Updates the Info Console with current actions, results, and successes
  updateInfoConsole(auditNode) {
    const newAuditTrail = this.state.auditTrail.slice();
    newAuditTrail.push(auditNode);
    this.setState({ auditTrail: newAuditTrail });
  }

  updateInputBoxType(type) {
    console.log("Im doing this");
    this.setState({ inputBoxType: type });
  }

  render() {
    return (
      <React.Fragment>
        <LeftColumn
          updateInfoConsole={this.updateInfoConsole}
          updateInputBoxType={this.updateInputBoxType}
          inputBoxType={this.state.inputBoxType}
        />
        <InfoConsole auditTrail={this.state.auditTrail} />
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
            <NewProjectBox updateInfoConsole={this.props.updateInfoConsole} />
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
  }

  handleProjectAdd(e) {
    e.preventDefault();
    const form = document.forms.projectAdd;
    const auditNode = {
      type: "projectAdd",
      zsl: form.zsl.value,
      client: form.client.value,
      description: form.description.value
    };
    form.zsl.value = "";
    form.client.value = "";
    form.description.value = "";
    this.props.updateInfoConsole(auditNode);
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
        {/* <form
          className="uploadForm"
          name="uploadForm"
          onSubmit={this.handleProjectAdd}
        > */}
        <h2>Upload Files</h2>

        <input
          type="checkbox"
          id="singleDataCheckBox"
          name="singleDataCheckBox"
        />
        <label htmlFor="singleDataCheckBox">FLEX HD Single</label>
        <br />

        <input
          type="checkbox"
          id="multipleDataCheckBox"
          name="multipleDataCheckBox"
        />
        <label htmlFor="multipleDataCheckBox">Unique File Name</label>
        <span>Flex HD Multiple File Data</span>

        <select id="datasetOption" name="datasetOption">
          <option value="volvo">Flex HD</option>
        </select>

        <input type="submit" value="Save" />
        {/* </form> */}
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
  const auditTrail = props.auditTrail.map((auditNode) => (
    <AuditNode key={auditNode.id} auditNode={auditNode} />
  ));

  return (
    <div className="infoconsole">
      <table className="auditnode">
        <tbody>{auditTrail}</tbody>
      </table>
    </div>
  );
}

function AuditNode(props) {
  const auditNode = props.auditNode;
  return (
    <tr>
      <td className="infocolumn">
        <b>New Project Created:</b> <br />
        ZSL: {auditNode.zsl} <br />
        Client: {auditNode.client} <br />
        Description: {auditNode.description}
      </td>
      <td className="buttoncolumn">
        <button>Add Data</button>
      </td>
    </tr>
  );
}

const topBanner = <TopBanner />;
ReactDOM.render(topBanner, document.getElementById("topbanner"));

const element = <FullUI />;
ReactDOM.render(element, document.getElementById("content"));
