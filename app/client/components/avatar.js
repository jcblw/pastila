'use strict';

const React = require('react');
const styles = require('../styles/avatars');

module.exports = (props) => {
  const bg = {backgroundImage: `url(${props.url})`};
  const avatarSize = styles[props.size];

  return (
    <div style={[styles.base, styles.rounded, avatarSize, bg]}></div>
  );
};
