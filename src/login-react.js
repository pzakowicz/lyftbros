import React from 'react';
import ReactDOM from 'react-dom';


class App extends React.Component {
  state = {
    pageHeader: 'Naming Contests'
  };
  render() {
    return (
      <div className="App">
<h1>This is some text</h1>

      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('login-main')
);
