
const
  React = require('react'),
  Icon = require('./icon'),
  Avatar = require('./avatar'),
  dispatcher = require('../dispatcher');

module.exports = class ContextLink extends React.Component {

  constructor(options) {
    super(options);
    this.state = {
      isOpen: false,
      id: this.props.icon || this.props.user
    };
    dispatcher.on('contextlink:close', this.onContextOpening.bind(this));
  }

  onContextOpening(id) {
    if (this.state.id !== id) {
      this.setState({
        isOpen: false
      });
    }
    this.setState({
      opening: false
    });
  }

  onContextClick(e) {
    e.stopPropagation();
  }

  onClickOpen(e) {
    e.stopPropagation();
    this.setState({
      isOpen: this.state.isOpen ? false : true,
      opening: true
    });
    dispatcher.emit('contextlink:close', this.state.id);
  }

  getLink() {
    if (this.props.icon) {
      return (
        <Icon type={this.props.icon} color="dark" size="medium"></Icon>
      );
    } else {
      return (
        <Avatar src={this.props.user} size="medium"></Avatar>
      );
    }
  }

  render() {
    const
      className = (this.state.isOpen ? 'is-open ' : ' ') +
        (this.props.bottom ? 'contextLink--bottom ' : ' ') +
        'contextLink--container',
      link = this.getLink();

    return (
      <li className={this.props.className}>
        <span onClick={this.onClickOpen.bind(this)}>{link}</span>
        <div className={className} onClick={this.onContextClick.bind(this)}>
          {this.props.children}
        </div>
      </li>
    );
  }

};
