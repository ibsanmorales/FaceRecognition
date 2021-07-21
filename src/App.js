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
  apiKey:'5171fa7926af47fb82ac36bf8d7086be'
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
    }
  }
  onInputChange = (event) => {
    console.log(event.target.value);
  }
  onButtonSubmit = () => {
    app.models.predict('f76196b43bbd45c99b4f3cd8e8b40a8a',"https://www.maccosmetics.com.mx/media/export/cms/products/640x600/mac_sku_MW3A01_640x600_1.jpg").then(
    function(response){
      console.log(response);
    },
    function(err){

    }
    );
  }
  render(){
  return (
    <div className="App">
    <Particles className='particles'
              params={particlesOptions} />
    <Navigation/>
    <Logo/>
    <Rank/>
    <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
    {/*<FaceRecognition/>*/}
    </div>
  );
}
}

export default App;
