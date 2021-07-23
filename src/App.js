import React, {Component} from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation'
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank'
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';

const app = new Clarifai.App ( {
  apiKey:process.env.REACT_APP_CLARIFY_API_KEY
});

const particlesOptions = {
  particles: {
    number:{
      value: 80,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}
class App extends Component{
  constructor(){
    super();
    this.state = {
      input: '',
      imageUrl:'',
      box:{}
    }
  }
  calculateFaceLocation = (data) => {
    const clarifaiface = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    console.log(width, height, clarifaiface);
    return {
      lefCol:clarifaiface.left_col * width,
      topRow:clarifaiface.top_row * height,
      rightCol: width - (clarifaiface.right_col * width),
      bottomRow: height - (clarifaiface.bottom_row * height)
    }
  }

  displayFaceBox = (box)=>{
    this.setState({box: box});
  }

  onInputChange = (event) => {
    //console.log(event.target.value);
    this.setState({input:event.target.value});
  }
  onButtonSubmit = () => {
    this.setState({imageUrl:this.state.input});
    app.models
    .predict(
      Clarifai.FACE_DETECT_MODEL,
      this.state.input)
      .then(response=> this.displayFaceBox(this.calculateFaceLocation(response)))
      .catch(err=>console.log(err))
  }
  render(){
  return (
    <div className="App">
      <Particles 
        className='particles'
        params={particlesOptions} />
      <Navigation/>
      <Logo/>
      <Rank/>
      <ImageLinkForm 
        onInputChange={this.onInputChange} 
        onButtonSubmit={this.onButtonSubmit}/>
      <FaceRecognition 
        imageUrl={this.state.imageUrl}/>
    </div>
  );
}
}

export default App;
