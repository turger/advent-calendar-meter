import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Badges from './badges'
import Stamps from './stamps'
import Ranking from './ranking'
import 'src/assets/stylesheets/base.scss'
import 'src/assets/stylesheets/loader.scss'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: '',
      loading: true
    }
  }

  componentDidMount() {
    fetch('data')
      .then((response) => response.json())
      .then((data) => this.setState({
        data: this.sortByBest(data),
        loading: false
      })
    )
  }

  sortByBest = (data) => {
    return data.sort((a, b) => b.total.soldPerSeller - a.total.soldPerSeller)
  }

  render() {
    return (
      <div>
        <h1>Koukkaajien kalenteri&shy;myynti&shy;kisa</h1>
          <div className="allgroups">
          { this.state.loading && <div className="loader"/> }
          { this.state.data && this.state.data.map((group, i) =>
            <div className="group">
              <div className="group__info">
                <h2 className="group__name"> { group.total.sheetName } </h2>
                <div className="group__achievements">
                  <Stamps stamps={ group.total.stamps }/>
                  <Badges badges={ group.total.badges }/>
                </div>
              </div>
              <div className="group__total">
                <div className="group__totalperseller">{ Math.round(group.total.soldPerSeller) }</div>
                <Ranking ranking={ i+1 }/>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }
}

export default App
