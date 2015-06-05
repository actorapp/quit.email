'use strict';

var React = require('react');
var $ = require('zeptojs');

var App = React.createClass({
  getInitialState: function() {
    return {
      isLoading: true
    }
  },

  componentDidMount: function() {
    var match = document.location.pathname.match(/\/join\/(.+)/);
    if (match) {
      var token = match[1];

      var component = this;

      $.getJSON('https://api.actor.im/v1/groups/invites/' + token, function (resp) {
        component.setState({
          isLoading: false,

          group: {
            title: resp.group.title
          },

          inviter: {
            name: resp.inviter.name,
            avatarUrl: resp.inviter.avatars.large
          }
        });
      });
    }
  },

  render: function() {
    var group = this.state.group;
    var inviter = this.state.inviter;

    if (!this.state.isLoading) {
        return (
          <div>
            <p>Вас приглашает {inviter.name} <img src={inviter.avatarUrl}/></p>
            <p>{group.name} <img src={group.avatarUrl}/></p>
            <p><a href="http://appeap.actor.im/join/{token}">Зайти</a></p>
          </div>
        )
    } else {
      return (<span>Loading...</span>)
    }
  }
});

module.exports = App;
