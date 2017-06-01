import React from "react";
import request from "superagent";
import { withRouter } from "react-router";

import QuestionForm from "./QuestionForm";
import "../assets/styles/NewQuestion.css";

class NewQuestion extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: "",
      body: ""
    };
  }

  handleUpdateTitle = val => {
    this.setState({ title: val });
  };

  handleUpdateBody = val => {
    this.setState({ body: val });
  };

  handleSubmitQuestion = () => {
    const { history } = this.props;
    const { title, body } = this.state;
    request
      .post("/api/questions")
      .send({ title, body })
      .then(res => {
        // On create, redirect to the question
        const uid = res.body;
        const questionLink = `/questions/${uid}`;
        history.push(questionLink);
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    const { title, body } = this.state;
    return (
      <div className="container">
        <div className="row">
          <div className="col-12 col-sm-8">
            <QuestionForm
              title={title}
              body={body}
              onUpdateTitle={this.handleUpdateTitle}
              onUpdateBody={this.handleUpdateBody}
              onSubmitQuestion={this.handleSubmitQuestion}
            />
          </div>

          <div className="col-12 col-sm-4">
            <section className="side-section emphasize">
              <h2>Did You Know?</h2>

              <p>
                You can use markdown to format your content.
              </p>

              <a
                href="https://daringfireball.net/projects/markdown/syntax"
                target="_blank"
              >
                Get markdown help
              </a>
            </section>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(NewQuestion);
