import React from 'react'
import Emoji from './emoji'

const getEmojiName = (name) => {
  switch(name) {
    case 'mostSellers':
      return ':people_with_bunny_ears_partying:'
    case 'mostCalendars':
      return ':gift:'
    case 'mostSoldPerSeller':
      return ':crown:'
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
        <div>
          <Emoji name={ getEmojiName(badge) } />
          <span class="tooltiptext">{ getToolTip(badge) }</span>
        </div>
      )}
    </div>
    : null
)

export default Badges
