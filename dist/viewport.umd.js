!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):e.createViewport=t()}(this,function(){"use strict";function e(e,t,n){null!=e&&(e.addEventListener?e.addEventListener(t,n,!1):e.attachEvent("on"+t,function(){return n.call(e,window.event)}))}function t(e,t,n){null!=e&&(e.removeEventListener?e.removeEventListener(t,n):e.detachEvent("on"+t,n))}function n(e,t,n){return null!=t?function(){return t.map(function(t){return n[t](e,e.document)})}:function(){return null}}var r=function(e){if(Array.isArray(e)){for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t];return n}return Array.from(e)};function i(e,t,n){this.items=null!=e?[].concat(r(e)):[],this.loaded=t||null,this.unloaded=n||null}i.prototype={get length(){return this.items.length},add:function(e){-1===this.items.indexOf(e)&&(this.items.push(e),this.loaded&&1===this.items.length&&this.loaded(this))},remove:function(e){var t=this.items.indexOf(e);t>-1&&(this.items.splice(t,1),this.unloaded&&!this.items.length&&this.unloaded(this))},empty:function(){this.items=[],this.unloaded&&this.unloaded(this)},forEach:function(e){for(var t=-1,n=this.items.length;++t<n;)if(!1===e(this.items[t],t,this.items))return}};var o={load:{type:["load"]},unload:{type:["beforeunload"]},resize:{type:["resize","scroll","orientationchange"],args:["width","height"]},scroll:{type:["scroll"],args:["scrollX","scrollY"]}},s={width:function(e,t){return e.innerWidth||t.documentElement.clientWidth||t.body.clientWidth},height:function(e,t){return e.innerHeight||t.documentElement.clientHeight||t.body.clientHeight},scrollX:function(e,t){return e.scrollX||e.pageXOffset},scrollY:function(e,t){return e.scrollY||e.pageYOffset}};return function(){var r,u=arguments.length>0&&void 0!==arguments[0]?arguments[0]:window,c={},l=(r={addEventListener:e,removeEventListener:t,view:u},function(e,t){var o=[],s=n(r.view,e.args,t),u={};return u.type=e.type,u.subscribers=new i(null,function(){return t=(e=u).type,n=e.publisher,i=r.view,o=r.addEventListener,void t.forEach(function(e){o(i,e,n)});var e,t,n,i,o},function(){return t=(e=u).type,n=e.publisher,i=r.view,o=r.removeEventListener,void t.forEach(function(e){o(i,e,n)});var e,t,n,i,o}),u.publisher=function(e){u.subscribers.length;var t=s();if(!0!==e&&null!==t){var n=t.some(function(e,t){return o[t]!==e});if(o=t,!n)return!1}u.subscribers.forEach(function(e){e.apply(null,t)})},u});Object.keys(o).forEach(function(e){c[e]=l(o[e],s)});var f=function(e){if(!c[e])throw new Error("The '"+e+"' is not a valid event name.");return c[e]},a={on:function(e,t){var n=f(e);return"function"==typeof t&&n.subscribers.add(t),a},off:function(e,t){if(void 0===e)Object.keys(c).forEach(function(e){c[e].subscribers.removeAll()});else{var n=f(e);"function"==typeof t?n.subscribers.remove(t):void 0===t&&n.subscribers.removeAll()}return a},trigger:function(e){return f(e).publisher(!0),a}};return Object.keys(s).forEach(function(e){a[e]=s[e]}),a}});
