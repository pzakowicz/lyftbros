//imports 
import React, {Component} from 'react';
import DateTime from './date-time';
import { Link } from 'react-router-dom';

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

  saveComment = async () => {
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
      startLoadingComments();
    }
  }

render() {
  return (
    <div>
      {this.props.comments.map((comment, i) => {
        return comment.workout_id === this.props.workout_id ? 
        <div key={i} className="comment-list">
          <span className="flex-container button-container"><span className="value link"><Link to={'/users/' + comment.user_id}>{comment.first_name + ' ' + comment.surname}</Link></span><span><DateTime dateTime={comment.date_time} /></span></span>
          <span>{comment.content}</span>
        </div> : null
      })}
      <form className="flex-container button-container new-comment-container">
        <input type="text" name="comment" className="comment-input" onChange={this.changeHandler} required />
        <button onClick={this.saveComment} type="submit" className="add-comment-button">Submit</button>
      </form>
  </div>
  )
}

}

export default CommentForm;