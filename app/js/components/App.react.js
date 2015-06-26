'use strict';

var React = require('react');
var $ = require('zeptojs');

var App = React.createClass({
  getInitialState: function() {
    return({isLoading: true});
  },

  componentWillMount: function() {
    var match = document.location.pathname.match(/\/join\/(.+)/);
    if (match) {
      var token = match[1];

      var component = this;

      $.getJSON('https://api.actor.im/v1/groups/invites/' + token, function (resp) {
        var inviterAvatars = resp.inviter.avatars || {};
        var groupAvatars = resp.group.avatars || {};

        component.setState({
          isLoading: false,

          group: {
            title: resp.group.title,
            avatarUrl: groupAvatars.large
          },

          token: token,

          inviter: {
            name: resp.inviter.name,
            avatarUrl: inviterAvatars.large
          }
        });
      });
    }
  },

  render: function() {
    var group = this.state.group;
    var inviter = this.state.inviter;
    var joinLink = 'https://app.actor.im/#/join/' + this.state.token;

    if (!this.state.isLoading) {
      return (
        <section className="invite">
          <div className="invite__body">
              <h3>Invite to {group.title}</h3>
            <p>
              <strong>{inviter.name}</strong> invite you to our small <strong>team chat</strong>.
            </p>
            <a href={joinLink}>Join chat</a>
            <footer>
              Greetings,<br/><strong>Actor Team</strong>
            </footer>
          </div>
        </section>
      )
    } else {
      return (
        <span>Loading...</span>
      )
    }
  }
});

module.exports = App;
