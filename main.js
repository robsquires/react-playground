
const { Route, IndexRoute, Router, Link, History } = ReactRouter;

var Comment = React.createClass({
  render: function() {
    return (
      <div className="comment">
        <h2 className="commentAuthor">
          {this.props.author} @ {this.props.timestamp.getHours()}:{this.props.timestamp.getMinutes()}:{this.props.timestamp.getSeconds()}
        </h2>
        {this.props.children} 
      </div>
    );
  }
});


var CommentList = React.createClass({

  getInitialState: function() {

    var savedState = JSON.parse(localStorage.getItem('state'));

    if (savedState !== null) {
      return { 
        data: savedState.data.map(function(comment) {
          comment.timestamp = new Date(comment.timestamp);
          return comment;
        })
      }
    }

    return { data: [] };
  },
  render: function() {

    var commentNodes = this.state.data.map(function(comment) {
      return (
        <Comment author={comment.author} key={comment.timestamp.getTime()} timestamp={comment.timestamp}>
          {comment.text}
        </Comment>
      );
    });

    return (
      <div>
        <Link to="/new" >New Comment</Link>
        <div className="commentList">{commentNodes}</div>
      </div>
    );
  }
});

var CommentForm = React.createClass({

  getInitialState: function() {
    return {author: '', text: ''};
  },

  mixins: [ History ],

  handleAuthorChange: function(e) {
    this.setState({author: e.target.value});
  },
  handleTextChange: function(e) {
    this.setState({text: e.target.value});
  },


  handleSubmit: function(e) {
    e.preventDefault();
    var author = this.state.author.trim();
    var text = this.state.text.trim();
    if (!text || !author) {
      return;
    }

    // the next route could be a `prop`
    this.history.pushState(null, "/");
  },

  render: function() {
    return (
      <form className="commentForm" onSubmit={this.handleSubmit}>
        <input
          type="text"
          placeholder="Your name"
          value={this.state.author}
          onChange={this.handleAuthorChange}
        />
        <input
          type="text"
          placeholder="Say something..."
          value={this.state.text}
          onChange={this.handleTextChange}
        />
        <input type="submit" value="Post" />
      </form>
    );
  }
});

const App = React.createClass({

  render() {
    return (
      <div>
        <h1>Commentr</h1>
        {this.props.children}
      </div>
    )
  }
})

ReactDOM.render(
  <Router>
    <Route path="/" component={App}>
      <IndexRoute component={CommentList} />
      <Route path="new" component={CommentForm} />
    </Route>
  </Router>,
  document.getElementById('content')
);