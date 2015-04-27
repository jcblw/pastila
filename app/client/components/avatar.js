const
  React = require('react');

module.exports = class Icon extends React.Component {
  render () {
    var styles = {
        backgroundImage: `url(https://pbs.twimg.com/profile_images/544039728463351808/NkoRdBBL.png)`
      },
      className = `avatar avatar--${this.props.size} avatar--rounded`;

    return (
      <div className={className} style={styles}></div>
    );
  }
};
