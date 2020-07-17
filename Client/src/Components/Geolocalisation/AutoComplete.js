import React, { Component } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  position: relative;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

class AutoComplete extends Component {
  constructor(props) {
    super(props);
    this.clearSearchBox = this.clearSearchBox.bind(this);
  }

  componentDidMount({ map, mapApi, customCenter } = this.props) {
    const options = {
      // restrict your search to a specific type of result
      // types: ['geocode', 'address', 'establishment', '(regions)', '(cities)'],
      // restrict your search to a specific country, or an array of countries
      // componentRestrictions: { country: ['gb', 'us'] },
    };
    this.autoComplete = new mapApi.places.Autocomplete(
      this.searchInput,
      options,
    );
    this.autoComplete.addListener('place_changed', this.onPlaceChanged);
    this.autoComplete.bindTo('bounds', map);
    map.setCenter({ lat: customCenter[0], lng: customCenter[1] });
    map.setZoom(15);
  }

  componentWillUnmount({ mapApi } = this.props) {
    mapApi.event.clearInstanceListeners(this.searchInput);
  }

  onPlaceChanged = ({ map, addplace } = this.props) => {
    const place = this.autoComplete.getPlace();

    if (!place.geometry) return;
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(15);
    }

    addplace(place);
    this.searchInput.blur();
  };

  clearSearchBox() {
    this.searchInput.value = '';
  }

  render() {
    const style = {
      position: 'relative',
      paddingLeft: '16px',
      marginTop: '2px',
      marginLeft: '0',
      width: '100%',
      height: '35px',
      fontFamily: 'montserrat',
      fontSize: '1.5vw',
      fontWeight: '400',
      outline: 'none',
      padding: '15px',
      border: '1px solid #ccc',
      borderRadius: '3px',
      marginBottom: '10px',
      boxSizing: 'border-box',
      color: '#2C3E50',
  }
    return (
      <Wrapper style={this.props.displayInput}>
        {this.props.complete === "false" ?
          <input
            ref={(ref) => {
              this.searchInput = ref;
            }}
            type="text"
            onFocus={this.clearSearchBox}
            placeholder="Enter a location"
            style={style}
            disabled
          />
          : <input
            ref={(ref) => {
              this.searchInput = ref;
            }}
            type="text"
            onFocus={this.clearSearchBox}
            placeholder="Enter a location"
            style={style}
          />
        }
      </Wrapper>
    );
  }
}

export default AutoComplete;
