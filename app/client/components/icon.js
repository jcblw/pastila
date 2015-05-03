const
  React = require('react');

module.exports = class Icon extends React.Component {
  render () {
    const
      pathto = this.props.pathto || 'client/assets/icons.svg',
      icon = `<use xlink:href="${pathto}#icon-${this.props.type}"></use>`,
      className = `icon-${this.props.type} icon--${this.props.size} icon--${this.props.color} ${this.props.className}`;

    return (
      <svg className={className} dangerouslySetInnerHTML={{__html: icon}} onClick={this.props.onClick}></svg>
    );
  }
};
