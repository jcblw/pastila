'use strict';

const
  React = require('react');

module.exports = (props) => {
  const
    pathto = props.pathto || 'client/assets/icons.svg',
    icon = `<use xlink:href="${pathto}#icon-${props.type}"></use>`,
    className = `icon-${props.type} icon--${props.size} icon--${props.color} ${props.className}`;

  return (
    <svg className={className} dangerouslySetInnerHTML={{__html: icon}} onClick={props.onClick}></svg>
  );
};
