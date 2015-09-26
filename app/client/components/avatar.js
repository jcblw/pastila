'use strict'

const React = require('react')

module.exports = (props) => {
  const styles = {
    backgroundImage: `url(https://pbs.twimg.com/profile_images/544039728463351808/NkoRdBBL.png)`
  }
  const className = `avatar avatar--${props.size} avatar--rounded`

  return (
    <div className={className} style={styles}></div>
  )
}
