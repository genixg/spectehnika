const initialState = {
        CAPACITY: "*",
        TYPE: "*",
    }

var reducer = function(state = initialState, action) {
    switch (action.type) {        
        case "FILTER_CHANGED":
            let filterValue = action.filter.target.value;
            let filterName = action.filter.target.name;
            if (filterValue === "Все") {
                filterValue = "*";
            }
            if(filterName === "filterCapacities")
                return { ...state, CAPACITY: filterValue };
            else  if(filterName === "filterTypes")
                return { ...state, TYPE: filterValue };
            else
                return state;
        default:
            return state;
    }
}

export default reducer;