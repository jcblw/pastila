'use strict';

const React = require('react');
const Icon = require('./icon');
const Avatar = require('./avatar');
const dispatcher = require('../dispatcher');
const menuStyles = require('../styles/menu');
const contextLinkStyles = require('../styles/context-link');

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
        <Icon style={menuStyles.icon} type={this.props.icon} color="dark" size="medium"></Icon>
      );
    } else {
      return (
        <Avatar style={menuStyles.avatar} src={this.props.user} size="medium"></Avatar>
      );
    }
  }

  render() {
    const styles = [contextLinkStyles.base];
    const link = this.getLink();
    if (this.state.isOpen) {
      styles.push(contextLinkStyles.open);
    }

    if (this.props.bottom) {
      styles.push(contextLinkStyles.bottom);
    }


    return (
      <li style={styles}>
        <span onClick={this.onClickOpen.bind(this)}>{link}</span>
        <div className={className} onClick={this.onContextClick.bind(this)}>
          {this.props.children}
        </div>
      </li>
    );
  }

};
