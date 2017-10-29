import React from 'react'
import Emoji from './emoji'

const getEmojiName = (name) => {
  switch(name) {
    case 'grinch':
      return ':alien:'
    case 'snowman':
      return ':snowman:'
    case 'husky':
      return ':dog2:'
    case 'tonttu':
      return ':man_elf:'
    case 'threewisemen':
      return ':man_mage:'
    case 'christmasstar':
      return ':star2:'
  }
}

const getToolTip = (name) => {
  switch(name) {
    case 'grinch':
      return 'Myyjälevel: Grinch'
    case 'snowman':
      return 'Myyjälevel: Lumiukko'
    case 'husky':
      return 'Myyjälevel: Husky'
    case 'tonttu':
      return 'Myyjälevel: Tonttu'
    case 'threewisemen':
      return 'Myyjälevel: Itämaan tietäjä'
    case 'christmasstar':
      return 'Myyjälevel: Joulun tähti'
  }
}

const Stamps = ({stamps}) => (
  stamps ?
    <div className="group__stamps">
      { stamps.map(stamp =>
        <div>
          <Emoji name={ getEmojiName(stamp) }/>
          <span class="tooltiptext">{ getToolTip(stamp) }</span>
        </div>
      )}
    </div>
    : null
)

export default Stamps
