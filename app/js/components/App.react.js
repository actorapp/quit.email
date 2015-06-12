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
    var joinLink = 'http://app.actor.im/join/' + this.state.token;

    if (!this.state.isLoading) {
      var groupAvatar = null;

      if (group.avatarUrl) {
        groupAvatar = <img className="avatar avatar--huge" src={group.avatarUrl}/>;
      }

        return (
          <div className="row center-xs middle-xs">
            <section className="invite-new">
              <div className="invite-new__body">
                  <h3>Invite to {group.title}</h3>
                <p>
                  <strong>{inviter.name}</strong> invite you to our small <strong>team chat</strong>.
                </p>
                <a href={joinLink} className="">Join chat</a>
                <footer>
                  Greetings,<br/><strong>Actor Team</strong>
                </footer>
              </div>
            </section>

            <section className="invite">
              <div className="invite__group">
                {groupAvatar}
                <h3>{group.title}</h3>
              </div>
              <div className="invite__from">
                <p><img className="avatar" src={inviter.avatarUrl}/> {inviter.name} приглашает Вас</p>
              </div>
              <a href={joinLink} className="button button--primary button--wide">Присоединиться</a>
            </section>
          </div>
        )
    } else {
      return (
        <span>Loading...</span>
      )
    }
  }
});

module.exports = App;
