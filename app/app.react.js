'use strict';

var React = require('react');
var App = require('./js/components/App.react');
var CustomProtoHelper = require('./js/utils/CustomProtoHelper');

if (document.referrer.match('actor.im')) {
  var joinLink = CustomProtoHelper.joinLink;

  if (CustomProtoHelper.isMobile) {
    joinLink = CustomProtoHelper.isAndroid ? 'https://actor.im/android' : 'https://actor.im/ios';
  }
  window.setTimeout(function (){
    window.location.replace(joinLink);
  }, 25);

  if (CustomProtoHelper.isMobile) {
    console.log('Setting location to', CustomProtoHelper.customProtocolLink);
    window.location = CustomProtoHelper.customProtocolLink;
  }
} else {
  React.render(<App/>, document.getElementById('app'));
}
