import React, { Component } from "react";
import "../css/Joke.css";

class Joke extends Component {
  setBadge() {
    if (this.props.percentage >= 85) {
      // call this emoji from the link reference in index.html
      return "em em-rolling_on_the_floor_laughing";
    }
  }

  render() {
    return (
      <div className="joke">
        <div className="joke-text">
          {this.props.text}
          <br />
        </div>
        <div className="joke-emoji">
          <i className={this.setBadge()} />
        </div>
        <div className="joke-ratings">
          <span>
            Ratings: <strong>{this.props.percentage}%</strong>
          </span>
        </div>
        <div className="joke-buttons">
          <button className="button-primary" onClick={this.props.upvote}>
            Funny
          </button>{" "}
          <button className="button" onClick={this.props.downvote}>
            Not so funny
          </button>{" "}
        </div>
      </div>
    );
  }
}

export default Joke;
