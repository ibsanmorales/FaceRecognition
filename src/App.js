import React, {Component} from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation'
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank'
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import Singin from './components/Singin/Signin';
import Register from './components/Register/Register';

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
      box:{},
      route:'signin',
      isSignIn:false
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
    console.log(box);
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

  onRouteChange = (route) => {
    if(route === 'signout'){
      this.setState({isSignIn:false})
    }else if(route === 'home'){ 
      this.setState({isSignIn:true})
    }
    this.setState({route: route})
   
  }
  render(){
   const {isSignIn, imageUrl, route, box} = this.state;
  return (
    <div className="App">
      <Particles 
        className='particles'
        params={particlesOptions} />
      <Navigation isSignedIn={isSignIn} onRouteChange={this.onRouteChange}/>
     { route === 'home'
      ?<div>
      <Logo/>
      <Rank/>
      <ImageLinkForm 
        onInputChange={this.onInputChange} 
        onButtonSubmit={this.onButtonSubmit}/>
      <FaceRecognition 
        box={box}
        imageUrl={imageUrl}/>
        </div>
      :(this.state.route === 'signin' 
      ? <Singin onRouteChange={this.onRouteChange}/>
      : <Register onRouteChange={this.onRouteChange}/>
      )
        }
    </div>
  );
}
}

export default App;
