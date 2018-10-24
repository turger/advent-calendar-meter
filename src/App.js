import React, { Component } from 'react'
import axios from 'axios'
import Badges from './Badges'
import Stamps from './Stamps'
import Ranking from './Ranking'
import './assets/stylesheets/base.css'
import './assets/stylesheets/loader.css'

const dataUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:5000/koukkaaja-kalenterit/us-central1/getData' : 'https://us-central1-koukkaaja-kalenterit.cloudfunctions.net/getData'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: '',
      loading: true
    }
  }

  componentDidMount() {
    axios.get(dataUrl)
      .then(response => response.data)
      .then((data) => this.setState({
          data: this.sortByBest(data),
          loading: false
        })
      ).catch(function (err) {
      console.error('Error:', err)
    })
  }

  sortByBest = (data) => {
    return data.sort((a, b) => b.total.soldPerSeller - a.total.soldPerSeller)
  }

  render() {
    return (
      <div>
        <h1>Koukkaajien adventti&shy;kalenteri&shy;myynti</h1>
        <div className="allgroups">
          { this.state.loading && <div className="loader"/> }
          { this.state.data && this.state.data.map((group, i) =>
            <div className="group" key={group+i}>
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
