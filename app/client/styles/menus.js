'use strict';

const StyleSheet = require('react-styles');

module.exports = StyleSheet.create({

  base: {
    flex: '0 0 75px',
    background: '#fcfcfc',
    display: 'flex',
    flexDirection: 'column',
    zIndex: '2'
  },

  list: {
    flex: '1',
    listStyleType: 'none',
    padding: '0',
    color: '#7a7a7a',
    whitespace: 'nowrap',
    margin: '0',
    position: 'relative'
  },

  listItem: {
    position: 'relative'
  },

  icon: {
    cursor: 'pointer'
  },

  listBottom: {
    position: 'absolute',
    bottom: '0'
  }

});
