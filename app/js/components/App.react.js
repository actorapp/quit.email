'use strict';

var React = require('react');
var $ = require('zeptojs');
var CustomProtoHelper = require('../utils/CustomProtoHelper');

var App = React.createClass({
  getInitialState: function() {
    return ({
      isLoading: true
    });
  },

  componentWillMount: function() {
    var token = CustomProtoHelper.token;
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

        inviter: {
          name: resp.inviter.name,
          avatarUrl: inviterAvatars.large
        }
      });
    });

  },

  onClick: function() {
    var joinLink = CustomProtoHelper.joinLink;
    var timeout = 100;
    var clicked = +new Date;

    if (CustomProtoHelper.isMobile) {
      document.getElementById('loader').src = CustomProtoHelper.customProtocolLink;
      joinLink = CustomProtoHelper.isAndroid ? 'https://actor.im/android' : 'https://actor.im/ios';
    }
    window.setTimeout(function () {
      if (+new Date - clicked < timeout * 2) {
        window.location.replace(joinLink);
        //window.location.assign(joinLink);
      }
    }, timeout);
  },

  render: function() {
    var group = this.state.group;
    var inviter = this.state.inviter;

    if (!this.state.isLoading) {
      return (
        <section className="invite">
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
      return null;
    }
  }
});

module.exports = App;
