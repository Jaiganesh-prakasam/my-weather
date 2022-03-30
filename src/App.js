import { useState, Component } from 'react';
import Select from "react-select";
import { FixedSizeList as List } from "react-window";
import cities from './assets/cities-fr.json';
import './App.css';

const height = 35;

class MenuList extends Component {

  render() {
    const { options, children, maxHeight, getValue } = this.props;
    const [value] = getValue();
    const initialOffset = options.indexOf(value) * height;

    return (
      <List
        height={maxHeight}
        itemCount={children.length}
        itemSize={height}
        initialScrollOffset={initialOffset}
      >
        {({ index, style }) => <div style={style}>{children[index]}</div>}
      </List>
    );
  }
}

function App() {

  
  const [currentCity, setCurrentCity] = useState(cities[0]);

  let customStyles = {
    option: provided => ({
      ...provided,
      color: 'black'
    }),
    control: provided => ({
      ...provided,
      color: 'black'
    })
  }

  const selectedCity = (city) => {
    setCurrentCity(city);
  }

  return (
    <div className="app">
      <div className='app__header'>
        <label htmlFor="cities">selectionner votre ville:</label>
        <div className='app__select'>
          <Select
            styles={customStyles}
            components={{ MenuList }}
            getOptionLabel={(option) => option.nm}
            onChange={selectedCity}
            getOptionValue={(option) => option}
            options={cities} />
        </div>
      </div>
    </div>
  );
}

export default App;