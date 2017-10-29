import React, { Component, PropTypes } from 'react'
import emojione from 'emojione'

class Emoji extends Component {
  componentWillReceiveProps(nextProps) {
    if (this._dom) {
      this._dom.innerHTML = emojione.shortnameToImage(nextProps.name)
    }
  }

  componentWillUnmount() {
    this._dom.innerHTML = ''
    this._dom = null
  }

  componentDidMount() {
    emojione.imageTitleTag = false
    this._dom.innerHTML = emojione.shortnameToImage(this.props.name)
  }

  render() {
    return <div className="Emoji" ref={dom => this._dom = dom} />
  }
}

export default Emoji
