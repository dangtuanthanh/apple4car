import './App.css';

import Header from '../src/components/header/index';
import HeaderCar from './pages/car/header_car/index';
import SlideCar from './pages/car/slide_car/index';
function App() {
  return (
    <div className="App">
     
     <Header />,
     <HeaderCar />,
     <SlideCar />,
   
    </div>
  );
}

export default App;
