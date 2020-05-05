//imports 
import React, {Component} from 'react';


//creating the master component
class App extends Component {
  
  //setting state object for the master component
  state = { 
    freeBookmark: true,
    data: [],
    welcome: "test",
    loading: false,
    videosVisible: false
   }

  //using the didmount method to fetch data for children elements
  componentDidMount() {
    this.setState({loading: true})
    fetch('https://hplussport.com/api/products/order/price/sort/asc/qty/1')
      .then(data => data.json())
      .then(data => this.setState({data, loading: false}))
  }

  //testing the didupdate method
  componentDidUpdate() {
    console.log("Library component updated!")
  }

  toggleVisibility = () => {
    this.setState(prevState => ({
      videosVisible: !prevState.videosVisible
    }))
  }

  //rendering the master component
  render() {
    //setting books as a variable to avoid repeating this.props for each variable

    return (
    <div>
        <h1>Welcome to the React! {this.state.welcome}</h1>
        
    </div>
    )
  }

}

export default App;