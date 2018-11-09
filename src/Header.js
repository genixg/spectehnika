import React from 'react';
//import PropTypes from 'prop-types'
import { connect } from 'react-redux'

//import { setVisibilityFilter, VisibilityFilters} from '../actions'

const Header = ({active, handleClick}) => (
    <header>
        <div className="insideheader row">
            <div className="logo col-lg">СпецТрансОнлайн.рф</div>
            <div className="topnavigation col-lg">
                <a href="/technics/">Техника</a>
                <a href="/contacts/">Контакты</a>
            </div>
            <div className="topcontacts col-lg">
                ☎ 8 800 123 45 67
            </div>
        </div>
    </header>
)


const mapStateToProps = (state, ownProps) => ({
    //active: state.visibilityFilter
})
const  mapDispatchToProps = (dispatch, ownProps) => ({
    //handleClick: (checkbox) => dispatch(setVisibilityFilter(checkbox))
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(Header)
