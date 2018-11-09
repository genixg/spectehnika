import geojson from 'json!./../bk_subway_entrances.geojson';

geojson.filteredFeatures = [];
geojson.filter = {
    CAPACITY: "*",
    TYPE: "*",
}

const applyFilter = (features, key, value) => {
    return features.filter(f => f.properties[key] === value);
}
  
const getVisibleFeatures = (features, filter) => {
    if(!filter)
      filter = [];
    var filteredFeatures = features;
    for(var key in filter) {
      if(filter[key] !== "*")
        filteredFeatures = applyFilter(filteredFeatures, key, filter[key]);
  }
  return filteredFeatures;
}

//var List = require("immutable").List;

var reducer = function(state = geojson, action) {
    switch (action.type) {        
        case "FILTER_CHANGED":
            let filterValue = action.filter.target.value;
            let filterName = action.filter.target.name;
            if (filterValue === "Все") {
                filterValue = "*";
            }
            let newFilter = Object.assign({}, state.filter);
            if(filterName === "filterCapacities")  
                newFilter.CAPACITY = filterValue; 
            else  if(filterName === "filterTypes")
                newFilter.TYPE = filterValue; 
            return { 
                ...state, 
                filteredFeatures: getVisibleFeatures(state.features, newFilter), 
                filter: newFilter
            };
        default:
            return state;
    }
}

export default reducer;