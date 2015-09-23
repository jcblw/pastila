'use strict';

const React = require('react');
const StyleSheet = require('react-styles');
const qs = require('querystring');
const styles = StyleSheet.create({
  fixed: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%'
  }
});

module.exports = () => {
  const query = {
    client_id: '4e73f807eaa53c1b7661',
    scope: 'gist',
    redirect_uri: 'http://localhost:5678/'
  };
  const url = 'https://github.com/login/oauth/authorize?' + qs.stringify(query);
  return (
    <div style={styles.fixed} dangerouslySetInnerHTML={{__html: '<webview id="auth-component" src="' + url + '"></webview>'}}></div>
  );
};
