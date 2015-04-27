const
  React = require('react');

module.exports = class Icon extends React.Component {
  render () {
    const
      icon = `<use xlink:href="client/assets/icons.svg#icon-${this.props.type}"></use>`,
      className = `icon-${this.props.type} icon--${this.props.size} icon--${this.props.color}`;

    return (
      <svg className={className} dangerouslySetInnerHTML={{__html: icon}}></svg>
    );
  }
};
