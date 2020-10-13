import React, { Component } from "react";
import axios from "axios";
import Joke from "./Joke";
import "../css/JokeList.css";

class JokeList extends Component {
  static defaultProps = {
    numJokes: 20,
  };

  constructor(props) {
    super(props);
    this.state = {
      // If list is empty, set jokes to an empty array
      jokes: JSON.parse(window.localStorage.getItem("jokes") || "[]"),
      loading: false,
    };
    this.seenJokes = new Set(this.state.jokes.map((joke) => joke.text));
  }

  async componentDidMount() {
    if (this.state.jokes.length === 0) {
      this.loadJokes();
    }
  }

  // get jokes from the api
  async loadJokes() {
    try {
      let jokes = [];
      while (jokes.length < this.props.numJokes) {
        let res = await axios.get("https://icanhazdadjoke.com/", {
          headers: { Accept: "application/json" },
        });
        if (!this.seenJokes.has(res.data.joke)) {
          jokes.push({
            id: res.data.id,
            text: res.data.joke,
            funny: 0,
            notFunny: 0,
            total: 0,
            percentage: 0,
          });
        } else {
          console.log("Found a duplicate");
          console.log(res.data.joke);
        }
      }

      this.setState(
        (state) => ({
          jokes: [...state.jokes, ...jokes],
          loading: false,
        }),
        () =>
          window.localStorage.setItem("jokes", JSON.stringify(this.state.jokes))
      );
    } catch (error) {
      alert(error);
      this.setState({ loading: false });
    }
  }

  //handle upvote, downvote, and ratings of each jokes
  handleRatings(id, upvote, downvote) {
    let updatedJokes = this.state.jokes.map((joke) => {
      if (joke.id === id) {
        joke.funny = joke.funny + upvote;
        joke.notFunny = joke.notFunny + downvote;
        joke.percentage = (joke.funny / (joke.funny + joke.notFunny)) * 100;
        return joke;
      }
      return joke;
    });

    this.setState((state) => ({ jokes: updatedJokes }));
    window.localStorage.setItem("jokes", JSON.stringify(this.state.jokes));
  }

  render() {
    let sortedJokes = this.state.jokes.sort(
      (a, b) => b.percentage - a.percentage
    );

    return (
      <div className="jokeList">
        <div className="jokeList-jokes">
          {sortedJokes.map((joke) => (
            <Joke
              key={joke.id}
              text={joke.text}
              upvote={() => this.handleRatings(joke.id, 1, 0)}
              downvote={() => this.handleRatings(joke.id, 0, 1)}
              percentage={Math.round(joke.percentage)}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default JokeList;
