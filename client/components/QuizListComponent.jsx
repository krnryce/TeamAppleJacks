import React from 'react';
import QuizListEntry from './QuizListEntry.jsx';
import Zoom from 'react-reveal/Zoom';
import _ from 'underscore';
import $ from "jquery";

class QuizListComponent extends React.Component {

  constructor(props) {
    super(props);
    this.rightCount = 1;
    this.state = { show: true, data: []};
    this.changeQuestion = this.changeQuestion.bind(this);
    this.checkAnswer = this.checkAnswer.bind(this);
    this.count = 0;
    this.rightCount = 0
  }

  componentWillMount () {
    fetch('/game')
    .then((response) => response.json())
    .then((data)=> this.setState({data: data}));
  }

  checkAnswer(option) {
    if(option === this.state.data[this.count].Answer){
      this.rightCount++;
    } else {
      console.log("False");
    }
  }

  changeQuestion() {
    setTimeout(() => {
      this.setState({show: true});
    }, 0);
    this.setState({ show: false });
    this.count++;
  }

  render() {
    let view;
    let gameOptions = [];
    let shuffledOptions =[];
  
    if(this.state.data.length > 0) {
      gameOptions.push(this.state.data[this.count].Option1, this.state.data[this.count].Option2, this.state.data[this.count].Answer);
      shuffledOptions = _.shuffle(gameOptions);

      view = this.count <= 4 ? 
      <Zoom when={this.state.show}>
        <div className="quiz-list-container"> 
          <div className="quiz-list-display">{`Question number ${this.count + 1}`}</div>
          <div className="quiz-question-display">{this.state.data[this.count].Question}</div> 
          <div className="option-disp">
            {shuffledOptions.map((option, index) => {
              return <span key={index} className="quiz-options-display option-display option-focus star" onClick={() => this.checkAnswer(option)}>
                {option}
              </span>
            })}
          </div>
            <button className="quiz-button-display click-press" onClick={() => this.changeQuestion()}>SUBMIT</button>
        </div>
    </Zoom> : 

    <div className="quiz-results"> 
      <span className="answer">YOU ANSWERED {this.rightCount} OF 5 QUESTIONS RIGHT</span>
    </div>
    } else {
      <div>LOADING.......</div>
    }

    return (
      <div>
        {view}
      </div>
    );
  }
}

export default QuizListComponent;