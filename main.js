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


// tutorial2.js

var CommentList = React.createClass({
  render: function() {

    var commentNodes = this.props.data.map(function(comment) {
      return (
        <Comment author={comment.author} key={comment.timestamp.getTime()} timestamp={comment.timestamp}>
          {comment.text}
        </Comment>
      );
    });

    return (
      <div className="commentList">
        {commentNodes}
      </div>
    );
  }
});

var CommentForm = React.createClass({

  getInitialState: function() {
    return {author: '', text: ''};
  },
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

    this.props.onCommentSubmit({
      author: author,
      text: text,
      timestamp: new Date()
    });

    this.setState({author: '', text: ''});
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


var CommentBox = React.createClass({
  
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

  handleCommentSubmit: function(comment) {

    var state = {data: this.state.data.concat(comment)};
    
    localStorage.setItem('state', JSON.stringify(state));
    this.setState(state);
  },

  render: function() {
    return (
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentForm onCommentSubmit={this.handleCommentSubmit}/>
        <CommentList data={this.state.data}/>
      </div>
    );
  }
});


ReactDOM.render(
  <CommentBox />,
  document.getElementById('content')
);