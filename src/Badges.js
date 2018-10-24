import React from 'react'
import PeoplePartying from './assets/images/people_partying.png'
import Gift from './assets/images/gift.png'
import Crown from './assets/images/crown.png'
import shortid from 'shortid'

const getImage = (name) => {
  switch(name) {
    case 'mostSellers':
      return PeoplePartying
    case 'mostCalendars':
      return Gift
    case 'mostSoldPerSeller':
      return Crown
  }
}

const getToolTip = (name) => {
  switch(name) {
    case 'mostSellers':
      return 'Eniten myyjiä'
    case 'mostCalendars':
      return 'Yhteensä eniten kalentereita'
    case 'mostSoldPerSeller':
      return 'Eniten kalentereita per myyjä'
  }
}

const Badges = ({badges}) => (
  badges ?
    <div className="group__badges">
      { badges.map(badge =>
        <div key={badge+shortid.generate()}>
          <img src={ getImage(badge) }/>
          <div className="tooltip">
            <span className="tooltiptext">{ getToolTip(badge) }</span>
          </div>
        </div>
      )}
    </div>
    : null
)

export default Badges
