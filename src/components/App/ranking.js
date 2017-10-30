import React from 'react'
import classNames from 'classnames'
import Trophy from '../../assets/images/trophy.png'
import Star from '../../assets/images/star.png'

const Rank = ({ranking}) => (
  <div className="group__ranking">
    <img src={ ranking < 4 ? Trophy : Star }/>
    <div className={classNames('group__rankingnumber',
      { 'group__rankingnumber--star': ranking >= 4 },
      { 'group__rankingnumber--big': ranking >= 10 }
    )}>
      { ranking }
    </div>
  </div>
)

export default Rank
