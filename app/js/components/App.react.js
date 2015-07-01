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

      if (document.referrer.match(/^https?:\/\/([^\/]+\.)?actor\.im(\/|$)/i)) {
        this.setState({
          isLoading: true,
          token: token
        });
        this.onClick();
      }

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

  onClick: function() {
    var token = this.state.token;
    var joinLink = 'https://app.actor.im/#/join/' + token;
    var timeout = 100;
    var clicked = +new Date;

    var isiOS = navigator.userAgent.match('iPad') || navigator.userAgent.match('iPhone') || navigator.userAgent.match('iPod');
    var isAndroid = navigator.userAgent.match('Android');

    if (isiOS || isAndroid) {
      document.getElementById('loader').src = 'actor://invite?token=' + token;
      joinLink = isAndroid ? 'https://actor.im/android' : 'https://actor.im/ios';
    }

    setTimeout(function () {
      if (+new Date - clicked < timeout * 2) {
        window.location.replace(joinLink);
      }
    }, timeout);

  },

  render: function() {
    var group = this.state.group;
    var inviter = this.state.inviter;

    if (!this.state.isLoading) {
      return (
        <section className="invite">
          <iframe style={{display: 'none'}} height="0" width="0" id="loader"></iframe>
          <div className="invite__body">
            <h3>Invite to {group.title}</h3>

            <p>
              <strong>{inviter.name}</strong> invite you to our small <strong>team chat</strong>.
            </p>

            <a onClick={this.onClick}>Join chat</a>

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
