import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Badges from './badges'
import Stamps from './stamps'
import 'src/assets/stylesheets/base.scss'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: ''
    }
  }

  componentDidMount() {
    fetch('data')
      .then((response) => response.json())
      .then((data) => this.setState({
        data: this.sortByBest(data),
      })
    )
  }

  sortByBest = (data) => {
    return data.sort((a, b) => {
      const badges = b.total.badges.length - a.total.badges.length
      const soldPerSeller = b.total.soldPerSeller - a.total.soldPerSeller
      const given = b.total.given - a.total.given
      const totalSellers = b.total.totalSellers - a.total.totalSellers
      if (soldPerSeller !== 0) { return soldPerSeller }
      else if (badges !== 0) { return badges }
      else if (given !== 0) { return given }
      return totalSellers
    })
  }

  render() {
    if (!this.state.data) return null
    return (
      <div>
        <h1>Koukkaajien kalenterimyyntikisa</h1>
          <div className="allgroups">
          { this.state.data.map(group =>
            <div className="group">
              <div className="group__info">
                <h2 className="group__name"> { group.total.sheetName } </h2>
                <div className="group__achievements">
                  <Stamps stamps={ group.total.stamps }/>
                  <Badges badges={ group.total.badges }/>
                </div>
              </div>
              <div className="group__total">
                <p>{ Math.round(group.total.soldPerSeller) }</p>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }
}

export default App
