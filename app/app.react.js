'use strict';

var React = require('react');
var App = require('./js/components/App.react');
var CustomProtoHelper = require('./js/utils/CustomProtoHelper');

if (document.referrer.match('actor.im')) {
  var joinLink = CustomProtoHelper.joinLink;
  if (CustomProtoHelper.isMobile) {
    document.getElementById('loader').src = CustomProtoHelper.customProtocolLink;
    joinLink = CustomProtoHelper.isAndroid ? 'https://actor.im/android' : 'https://actor.im/ios';
  }
  window.setTimeout(function (){
    window.location.replace(joinLink);
    //window.location.assign(joinLink);
  }, 1);
} else {
  React.render(<App/>, document.getElementById('app'));
}
