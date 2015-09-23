'use strict';

const StyleSheet = require('react-styles');

module.exports = StyleSheet.create({

  base: {
    position: 'absolute',
    top: '0',
    left: '70px',
    background: '#fff',
    display: 'none',
    padding: '20px',
    boxShadow: '0px 1px 3px rgba(0,0,0,.3)',
    maxheight: '50vh',
    width: '50vw',
    overflow: 'scroll'
  },

  bottom: {
    top: 'auto',
    bottom: '0'
  },

  open: {
    display: 'block'
  },

  list: {
    listStyleType: 'none',
    padding: '0',
    margin: '0'
  },

  listItem: {
    marginLeft: '20px',
    marginRight: '20px',
    padding: '0'
  },

  listItemHeader: {
    fontSize: '1.1em',
    fontWeight: '700',
    padding: '5px 20px'
  },

  listItemFirst: {
    marginTop: '20px'
  },

  listItemLast: {
    marginBottom: '20px'
  },

  listItemLastLinkLast: {
    paddingBottom: '0'
  },

  listItemLastLink: {
    color: '#7a7a7a',
    textDecoration: 'none',
    display: 'block',
    padding: '10px 50px 10px 20px',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }

});
