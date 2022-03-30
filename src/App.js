import { useEffect, useState, Component } from 'react';
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
  const [currentCityWeather, setCurrentCityWeather] = useState();
  const [forcastCityWeather, setForcastCityWeather] = useState();

  const dayName = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const customStyles = {
    option: provided => ({
      ...provided,
      color: 'black'
    }),
    control: provided => ({
      ...provided,
      color: 'black'
    })
  }

  useEffect(() => {
    const request = new Request(`https://api.openweathermap.org/data/2.5/weather?lat=${currentCity.lat}&lon=${currentCity.lon}&appid=ef1093f4880131e9dfc0391a2c18f91a&units=metric`);
    fetch(request)
      .then(response => response.json())
      .then(data => {
        setCurrentCityWeather(data);
      });
  }, [currentCity]);

  useEffect(() => {
    const request = new Request(`https://api.openweathermap.org/data/2.5/onecall?lat=${currentCity.lat}&lon=${currentCity.lon}&units=metric&exclude=current,minutely,hourly,alerts&appid=ef1093f4880131e9dfc0391a2c18f91a`);
    fetch(request)
      .then(response => response.json())
      .then(data => {
        setForcastCityWeather(data.daily.slice(1, 4));
      });
  }, [currentCity]);

  const selectedCity = (city) => {
    setCurrentCity(city);
  }

  const formatDay = (index) => {
    return index || index === 0 ? dayName[new Date().getDay() + index].toLocaleUpperCase() : '-';
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
      <div className='app__weather'>
        <div className='app__weather__header'>
          <span className='app__weather__header__card'>
            {currentCity?.nm?.toLocaleUpperCase()}
          </span>
        </div>
        <div className='app__weather__card'>
          <div>
            <span className={`wi ${'wi-icon-' + currentCityWeather?.weather[0]?.id}`}></span>
          </div>
          <div>
            {currentCityWeather?.main?.temp}&deg;
          </div>
        </div>
      </div>
      <div className='app__weather__header'>
        {forcastCityWeather?.map((forcastData, index) =>
          <span key={forcastData?.dt} className='app__weather__header__card'>
            {formatDay(index)}
          </span>
        )}
      </div>
      <div className='app__forcast'>
        {forcastCityWeather?.map((forcastData) =>
          <div key={forcastData?.dt} className='app__forcast__card'>
            <div>
              <span className={`wi ${'wi-icon-' + forcastData?.weather[0]?.id}`}></span>
            </div>
            <div>
              {forcastData?.temp?.max}&deg;
            </div>
            <div>
              {forcastData?.temp?.min}&deg;
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;