import React from 'react'
import Grinch from '../../assets/images/alien.png'
import Snowman from '../../assets/images/snowman.png'
import Husky from '../../assets/images/dog.png'
import Tonttu from '../../assets/images/elf.png'
import WiseMan from '../../assets/images/man_mage.png'
import Star from '../../assets/images/glowing_star.png'

const getImage = (name) => {
  switch(name) {
    case 'grinch':
      return Grinch
    case 'snowman':
      return Snowman
    case 'husky':
      return Husky
    case 'tonttu':
      return Tonttu
    case 'threewisemen':
      return WiseMan
    case 'christmasstar':
      return Star
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
          <img src={ getImage(stamp) }/>
          <div className="tooltip">
            <span class="tooltiptext">{ getToolTip(stamp) }</span>
          </div>
        </div>
      )}
    </div>
    : null
)

export default Stamps
