import React, { Component } from "react";
import Pagination from "@material-ui/lab/Pagination";
import ClassesService from "../services/classes.service";
import classThumbnail1 from "../assets/class-thumbnail-1.jpg"
import classThumbnail2 from "../assets/class-thumbnail-2.jpg"
import classThumbnail3 from "../assets/class-thumbnail-3.jpg"

const thumbnailMap = {
  "class-thumbnail-1.jpg": classThumbnail1,
  "class-thumbnail-2.jpg": classThumbnail2,
  "class-thumbnail-3.jpg": classThumbnail3,
}

export default class Classes extends Component {
  constructor(props) {
    super(props);
    this.onChangeSearchQuery = this.onChangeSearchQuery.bind(this);
    this.handleSearchKeyPress = this.handleSearchKeyPress.bind(this);
    this.getClasses = this.getClasses.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.onClassClick = this.onClassClick.bind(this);
    this.generateSearchComponent = this.generateSearchComponent.bind(this);
    this.generateClassComponent = this.generateClassComponent.bind(this);
    this.state = {
      subHeaderText: 'Loading...',
      classes: [],
      searchQuery: "",
      page: 1,
      count: 0
    };
  }

  componentDidMount() {
    this.getClasses();
  }

  onChangeSearchQuery(e) {
    const searchQuery = e.target.value;

    this.setState({
      searchQuery: searchQuery,
    });
  }

  handleSearchKeyPress(e) {
    if (e.which === 13 || e.keyCode === 13) {
      this.getClasses()
    }
  }

  getRequestParams(searchQuery, page) {
    let params = {};

    if (searchQuery) {
      params["searchQuery"] = searchQuery;
    }

    if (page) {
      params["page"] = page - 1;
    }

    return params;
  }

  getClasses() {
    const { searchQuery, page } = this.state;
    const params = this.getRequestParams(searchQuery, page);

    ClassesService.getClasses(params).then(
      response => {
        const { classes, totalPages } = response.data;
        this.setState({
          subHeaderText: 'List',
          classes,
          count: totalPages
        });
      },
      error => {
        console.log('error', error);
        this.setState({
          headerText: 'T_T Error getting Classes. Kindly blame developer.'
        });
      }
    );
  }

  handlePageChange(event, value) {
    this.setState(
      {
        page: value,
      },
      () => {
        this.getClasses();
      }
    );
  }

  onClassClick(id) {
    this.props.history.push(`/classes/${id}`)
  }

  generateSearchComponent() {
    const { searchQuery } = this.state;
    return (
      <div className="col-md-8">
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search Classes"
            value={searchQuery}
            onChange={this.onChangeSearchQuery}
            onKeyUp={this.handleSearchKeyPress}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={this.getClasses}
            >
              Search
            </button>
          </div>
        </div>
      </div>
    )
  }

  generateClassComponent(item) {
    return (
      <div key={`class-${item.id}`} style={{padding: "10px"}}>
        <div 
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${thumbnailMap[item.thumbnail]})`,
            backgroundSize: "cover",
            minWidth: "300px",
            minHeight: "169px",
            color:'#ffffff',
            position: "relative"
          }}
          onClick={() => this.onClassClick(item.id)}
          >
          <div style={{padding: "10px", height: "100%"}}>
            <div>{item.title}</div>
            <div style={{position: "absolute", bottom: "5px", fontSize: "small"}}>
              <div>{`Instructor: ${item.instructor}`}</div>
              <div>{`Level: ${item.level}`}</div>
              <div>{`Song: ${item.song}`}</div>
            </div>
          </div>       
        </div>
      </div>
    )
  }

  render() {
    const {
      subHeaderText,
      classes,
      page,
      count,
    } = this.state;
    return (
      <div className="container">
        <header className="jumbotron">
          <h3>Classes</h3>
        </header>
        
        <div className="row">
          {this.generateSearchComponent()}
        </div>
        
        <div className="row">
          <h4>{subHeaderText}</h4>
        </div>

        <div className="row row-cols-3 mb-3" style={{minWidth: "960px", minHeight: "567px"}}>
          {classes && classes.map(this.generateClassComponent)}
        </div>     

        <div className="row align-items-center justify-content-center mb-3">
          <div className="col d-flex justify-content-center">
            <Pagination
              count={count}
              page={page}
              siblingCount={1}
              boundaryCount={1}
              variant="outlined"
              shape="rounded"
              onChange={this.handlePageChange}
            />
          </div> 
        </div>
      </div>
    );
  }
}