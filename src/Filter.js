import React from 'react';
import { connect } from 'react-redux';
import {actionfilterChanged} from './actions';


// the UI component for filtering the subway entrances by subway line
const Filter = (props) => {
  const { features, filterChanged, filteredFeatures } = props;
  const capacities = getCapacities(filteredFeatures ? filteredFeatures : features);
  const types = getTypes(features);   

  function getCapacities(features) {
    let capacities = [];
    features.forEach(function(feature, index){
      let capacity = feature.properties.CAPACITY;
      if (capacities.indexOf(capacity) === -1)
      capacities.push(capacity);
    });
    capacities.sort();
    capacities.unshift('Все');
    return capacities;
  }

  function  getTypes (features) {
    let types = [];
    features.forEach(function(feature, index){
      let type = feature.properties.TYPE;
      if (types.indexOf(type) === -1)
      types.push(type);
    });
    types.sort();
    types.unshift('Все');
    return types;
  }

  return (
    <div className="filterSubwayLines">
      <hr/>
      <h3>Выбор техники</h3>
      Тип: <select defaultValue="*"
        type="select"
        name="filterTypes"
        onChange={(e) => filterChanged(e)}>
          { /* We render the select's option elements by maping each of the values of subwayLines array to option elements */ }
          {
            types.map((t, i) => {
              return (
                  <option value={t} key={i}>{t}</option>
                );
            }, this)
          }
      </select>
      Грузоподъемность: <select defaultValue="*"
        type="select"
        name="filterCapacities"
        onChange={(e) => filterChanged(e)}>
          { /* We render the select's option elements by maping each of the values of subwayLines array to option elements */ }
          {
            capacities.map((capacity, i) => {
              return (
                  <option value={capacity} key={i}>{capacity}</option>
                );
            }, this)
          }
      </select>
    </div>
  );
};



const filterStateToProps = state => ({
  features: state.geojson.features,
  filteredFeatures: state.geojson.features  
  //filteredFeatures: state.geojson.filteredFeatures  
});

const filterDispatchToProps = (dispatch, ownProps) => ({
  filterChanged: filter => dispatch(actionfilterChanged(filter)),
});

export default connect(
  filterStateToProps,
  filterDispatchToProps
)(Filter);