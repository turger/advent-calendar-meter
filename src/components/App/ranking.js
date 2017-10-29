import React from 'react'
import Emoji from './emoji'
import classNames from 'classnames'
import Trophy from '../../assets/trophy.png'

const Rank = ({ranking}) => (
  <div className="group__ranking">
    <img src={ Trophy }/>
    <div className={classNames('group__rankingnumber', { 'group__rankingnumber--big': ranking >= 10 })}>
      { ranking }
    </div>
  </div>
)

export default Rank
