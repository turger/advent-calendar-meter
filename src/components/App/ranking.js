import React from 'react'
import classNames from 'classnames'
import Trophy from '../../assets/images/trophy.png'
import Star from '../../assets/images/star.png'

const Rank = ({ranking}) => (
  <div className={classNames('group__ranking',
    { 'group__ranking--trophy': ranking < 4 },
    { 'group__ranking--star': ranking >= 4 },
    { 'group__ranking--star--bignum': ranking >= 10 }
  )}>
    <img src={ ranking < 4 ? Trophy : Star }/>
    <div className="group__rankingnumber"> { ranking } </div>
  </div>
)

export default Rank
