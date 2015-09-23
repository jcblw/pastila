'use strict';

const StyleSheet = require('react-styles');

module.exports = new StyleSheet.create({

  /* spacing */

  paddingDefault: {
    padding: '20px'
  },

  paddingLeftDefault: {
    paddingLeft: '20px'
  },

  paddingRightDefault: {
    paddingRight: '20px'
  },

  marginDefault: {
    margin: '20px 20px 0'
  },

  marginLeftDefault: {
    marginLeft: '20px'
  },

  marginRightDefault: {
    marginRight: '20px'
  },

  marginRightSmaller: {
    marginRight: '10px'
  },

  verticalSpacingSmall: {
    marginBottom: '5px'
  },

  verticalSpacingDefault: {
    marginBottom: '20px'
  },

  /* alignment */

  textAlignCenter: {
    textAlign: 'center'
  },

  textAlignLeft: {
    textAlign: 'left'
  },

  textAlignRight: {
    textAlign: 'right'
  },

  positionRight: {
    right: 0
  },

  positionAbsolute: {
    position: 'absolute'
  },

  /* fontSize */

  fontSizeSmaller: {
    fontSize: '.7em'
  },

  fontSizeLarger: {
    fontSize: '1.2em'
  },

  /* layout */

  layoutRentered: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100%',
    height: '100%',
  }

});
