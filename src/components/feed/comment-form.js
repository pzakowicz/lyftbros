//imports 
import React, {Component} from 'react';
import DateTime from './date-time';
import { Link } from 'react-router-dom';
import { loadComments } from '../../redux/thunks';
import { connect } from 'react-redux';

//creating the master component
class CommentForm extends Component {

  state = {
    comment: '',
  }

  changeHandler = (event) => {
    let name = event.target.name;
    let value = event.target.value;
    this.setState({[name]: value});
  }  

  saveComment = async (event) => {
    event.preventDefault();
    const data = {
      workoutId: this.props.workout_id,
      content: this.state.comment
    };
    let response = await fetch(`/api/comments/add/`,
    {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
    console.log("requested to add comment:", data);
    // check if fist bump has been added
    if (response.status === 201) {
      console.log("Comment added");
      await this.props.startLoadingComments();
      this.props.countComments();
      this.props.toggleComment();
    }
  }

render() {
  return (
    <div>
      {this.props.comments.map((comment, i) => {
        return comment.workout_id === this.props.workout_id ? 
        <div key={i} className="comment-list">
          <span className="flex-container button-container"><span className="value link"><Link to={'/users/' + comment.user_id}>{comment.first_name + ' ' + comment.surname}</Link></span><span className="subtitle"><DateTime dateTime={comment.date_time} /></span></span>
          <span>{comment.content}</span>
        </div> : null
      })}
      <form className="flex-container button-container new-comment-container" onSubmit={this.saveComment}>
        <input type="text" name="comment" className="comment-input" onChange={this.changeHandler} required />
        <button onClick={this.saveComment} type="button" className="add-comment-button">Submit</button>
      </form>
  </div>
  )
}

}

const mapDispatchToProps = dispatch => ({
  startLoadingComments: () => dispatch(loadComments()),
})

export default connect(null, mapDispatchToProps)(CommentForm);