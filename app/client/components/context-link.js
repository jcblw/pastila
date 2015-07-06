
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
    if (options.eventTrigger) {
      dispatcher.on(options.eventTrigger, this.open.bind(this));
    }
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

  open() {
    this.setState({
      isOpen: this.state.isOpen ? false : true,
      opening: true
    });
    dispatcher.emit('contextlink:close', this.state.id);
  }

  componentDidUpdate() {
    if (this.state.isOpen === true) {
      dispatcher.emit('focus', this.props.focusId);
    }
  }

  onClickOpen(e) {
    e.stopPropagation();
    this.open();
  }

  getLink() {
    if (this.props.icon) {
      return (
        <Icon className="menu-icon" type={this.props.icon} color="dark" size="medium"></Icon>
      );
    } else {
      return (
        <Avatar className="menu-avatar" src={this.props.user} size="medium"></Avatar>
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
      <li className={`${this.props.className} ${this.state.isOpen ? 'is-active ' : ' '}`}>
        <span onClick={this.onClickOpen.bind(this)}>{link}</span>
        <div className={className} onClick={this.onContextClick.bind(this)}>
          {this.props.children}
        </div>
      </li>
    );
  }

};
