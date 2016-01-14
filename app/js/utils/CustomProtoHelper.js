'use strict';

var isiOS = navigator.userAgent.match('iPad') || navigator.userAgent.match('iPhone') || navigator.userAgent.match('iPod');
var isAndroid = navigator.userAgent.match('Android');
var isMobile = isiOS || isAndroid;

var match = document.location.pathname.match(/\/join\/(.+)/);
if (match) var token = match[1];

var joinLink = 'https://app.actor.im/#/join/' + token;
var joinLinkEnterprise = 'https://corp.actor.im/#/join/' + token;
var customProtocolLink = 'actor://invite?token=' + token;

module.exports = {
  isiOS: isiOS,
  isAndroid: isAndroid,
  isMobile: isMobile,
  token: token,
  joinLink: joinLink,
  joinLinkEnterprise: joinLinkEnterprise,
  customProtocolLink: customProtocolLink
};
