!function(){for(var e=0,t=["ms","moz","webkit","o"],n=0;t.length>n&&!window.requestAnimationFrame;++n)window.requestAnimationFrame=window[t[n]+"RequestAnimationFrame"],window.cancelAnimationFrame=window[t[n]+"CancelAnimationFrame"]||window[t[n]+"CancelRequestAnimationFrame"];window.requestAnimationFrame||(window.requestAnimationFrame=function(t){var n=(new Date).getTime(),r=Math.max(0,16-(n-e)),i=window.setTimeout(function(){t(n+r)},r);return e=n+r,i}),window.cancelAnimationFrame||(window.cancelAnimationFrame=function(e){clearTimeout(e)})}(),function(e){"use strict";function t(e,t){o.async(function(){e.trigger("promise:resolved",{detail:t}),e.isResolved=!0,e.resolvedValue=t})}function n(e,t){o.async(function(){e.trigger("promise:failed",{detail:t}),e.isRejected=!0,e.rejectedValue=t})}function r(e){var t,n=[],r=new p,i=e.length;0===i&&r.resolve([]);var o=function(e){return function(t){a(e,t)}},a=function(e,t){n[e]=t,0===--i&&r.resolve(n)},u=function(e){r.reject(e)};for(t=0;i>t;t++)e[t].then(o(t),u);return r}function i(e,t){o[e]=t}var o={},a="undefined"!=typeof window?window:{},u=a.MutationObserver||a.WebKitMutationObserver;if("undefined"!=typeof process&&"[object process]"==={}.toString.call(process))o.async=function(e,t){process.nextTick(function(){e.call(t)})};else if(u){var s=[],c=new u(function(){var e=s.slice();s=[],e.forEach(function(e){var t=e[0],n=e[1];t.call(n)})}),l=document.createElement("div");c.observe(l,{attributes:!0}),window.addEventListener("unload",function(){c.disconnect(),c=null}),o.async=function(e,t){s.push([e,t]),l.setAttribute("drainQueue","drainQueue")}}else o.async=function(e,t){setTimeout(function(){e.call(t)},1)};var d=function(e,t){this.type=e;for(var n in t)t.hasOwnProperty(n)&&(this[n]=t[n])},f=function(e,t){for(var n=0,r=e.length;r>n;n++)if(e[n][0]===t)return n;return-1},v=function(e){var t=e._promiseCallbacks;return t||(t=e._promiseCallbacks={}),t},h={mixin:function(e){return e.on=this.on,e.off=this.off,e.trigger=this.trigger,e},on:function(e,t,n){var r,i,o=v(this);for(e=e.split(/\s+/),n=n||this;i=e.shift();)r=o[i],r||(r=o[i]=[]),-1===f(r,t)&&r.push([t,n])},off:function(e,t){var n,r,i,o=v(this);for(e=e.split(/\s+/);r=e.shift();)t?(n=o[r],i=f(n,t),-1!==i&&n.splice(i,1)):o[r]=[]},trigger:function(e,t){var n,r,i,o,a,u=v(this);if(n=u[e])for(var s=0,c=n.length;c>s;s++)r=n[s],i=r[0],o=r[1],"object"!=typeof t&&(t={detail:t}),a=new d(e,t),i.call(o,a)}},p=function(){this.on("promise:resolved",function(e){this.trigger("success",{detail:e.detail})},this),this.on("promise:failed",function(e){this.trigger("error",{detail:e.detail})},this)},m=function(){},g=function(e,t,n,r){var i,o,a,u,s="function"==typeof n;if(s)try{i=n(r.detail),a=!0}catch(c){u=!0,o=c}else i=r.detail,a=!0;i&&"function"==typeof i.then?i.then(function(e){t.resolve(e)},function(e){t.reject(e)}):s&&a?t.resolve(i):u?t.reject(o):t[e](i)};p.prototype={then:function(e,t){var n=new p;return this.isResolved&&o.async(function(){g("resolve",n,e,{detail:this.resolvedValue})},this),this.isRejected&&o.async(function(){g("reject",n,t,{detail:this.rejectedValue})},this),this.on("promise:resolved",function(t){g("resolve",n,e,t)}),this.on("promise:failed",function(e){g("reject",n,t,e)}),n},resolve:function(e){t(this,e),this.resolve=m,this.reject=m},reject:function(e){n(this,e),this.resolve=m,this.reject=m}},h.mixin(p.prototype),e.Promise=p,e.Event=d,e.EventTarget=h,e.all=r,e.configure=i}(window.RSVP={}),function(){"use strict";function e(){this.originalEvent.preventDefault()}var t,n,r,i,o,a,u,s,c,l,d,f;if(void 0===window.onpointerdown){f="screenX screenY clientX clientY ctrlKey shiftKey altKey metaKey relatedTarget detail button buttons pointerId pointerType width height pressure tiltX tiltY isPrimary".split(" ");try{i=new UIEvent("test"),a=function(e,t){return new UIEvent(e,{view:window,bubbles:t})}}catch(v){document.createEvent&&(a=function(e,t){var n=document.createEvent("UIEvents");return n.initUIEvent(e,t,!0,window),n})}if(!a)throw Error("Cannot create events. You may be using an unsupported browser.");if(u=function(t,n,r,i){var o,u;for(o=a(t,!i),u=f.length;u--;)Object.defineProperty(o,f[u],{value:r[f[u]],writable:!1});return Object.defineProperty(o,"originalEvent",{value:n,writable:!1}),Object.defineProperty(o,"preventDefault",{value:e,writable:!1}),o},navigator.pointerEnabled=!0,void 0!==window.onmspointerdown)return["MSPointerDown","MSPointerUp","MSPointerCancel","MSPointerMove","MSPointerOver","MSPointerOut"].forEach(function(e){var t;t=e.toLowerCase().substring(2),"pointerover"===t||"pointerout"===t?window.addEventListener(e,function(e){var n=u(t,e,e,!1);e.target.dispatchEvent(n),e.target.contains(e.relatedTarget)||(n=u("pointerover"===t?"pointerenter":"pointerleave",e,e,!0),e.target.dispatchEvent(n))},!0):window.addEventListener(e,function(e){var n=u(t,e,e,!1);e.target.dispatchEvent(n)},!0)}),navigator.maxTouchPoints=navigator.msMaxTouchPoints,void 0;d={0:1,1:4,2:2},s=function(t,n,r){var i,o,a,s;return void 0!==n.buttons?(o=n.buttons,i=n.buttons?n.button:-1):0===event.button&&0===event.which?(i=-1,o=0):(i=n.button,o=d[i]),a=n.pressure||n.mozPressure||(o?.5:0),s={screenX:n.screenX,screenY:n.screenY,clientX:n.clientX,clientY:n.clientY,ctrlKey:n.ctrlKey,shiftKey:n.shiftKey,altKey:n.altKey,metaKey:n.metaKey,relatedTarget:n.relatedTarget,detail:n.detail,button:i,buttons:o,pointerId:1,pointerType:"mouse",width:0,height:0,pressure:a,tiltX:0,tiltY:0,isPrimary:!0,preventDefault:e},u(t,n,s,r)},c=void 0!==window.ontouchstart?function(e){for(var t,n=r.length,i=10;n--;)if(t=r[n],i>Math.abs(e.clientX-t.clientX)&&i>Math.abs(e.clientY-t.clientY))return!0}:function(){return!1},o=function(e){"over"===e||"out"===e?window.addEventListener("mouse"+e,function(t){var n;c(t)||(n=s("pointer"+e,t),t.target.dispatchEvent(n),t.target.contains(t.relatedTarget)||(n=s("over"===e?"pointerenter":"pointerleave",t,!0),t.target.dispatchEvent(n)))}):window.addEventListener("mouse"+e,function(t){var n;c(t)||(n=s("pointer"+e,t),t.target.dispatchEvent(n))})},["down","up","over","out","move"].forEach(function(e){o(e)}),void 0!==window.ontouchstart&&(t={},n=0,r=[],l=function(n,r,i,o,a){var s;return s={screenX:r.screenX,screenY:r.screenY,clientX:i.clientX,clientY:i.clientY,ctrlKey:r.ctrlKey,shiftKey:r.shiftKey,altKey:r.altKey,metaKey:r.metaKey,relatedTarget:a||r.relatedTarget,detail:r.detail,button:0,buttons:1,pointerId:i.identifier+2,pointerType:"touch",width:20,height:20,pressure:.5,tiltX:0,tiltY:0,isPrimary:t[i.identifier].isPrimary,preventDefault:e},u(n,r,s,o)},window.addEventListener("touchstart",function(e){var o,a;for(o=e.changedTouches,a=function(i){var o,a,u,s;s={target:i.target,isPrimary:n?!1:!0},t[i.identifier]=s,n+=1,o=l("pointerdown",e,i),a=l("pointerover",e,i),u=l("pointerenter",e,i,!0),i.target.dispatchEvent(a),i.target.dispatchEvent(u),i.target.dispatchEvent(o),r.push(i),setTimeout(function(){var e=r.indexOf(i);-1!==e&&r.splice(e,1)},1500)},i=0;o.length>i;i+=1)a(o[i])}),window.addEventListener("touchmove",function(e){var n,r;for(n=e.changedTouches,r=function(n){var r,i,o,a,u,s,c,d;return s=t[n.identifier],d=document.elementFromPoint(n.clientX,n.clientY),s.target===d?(r=l("pointermove",e,n),d.dispatchEvent(r),void 0):(c=s.target,s.target=d,c.contains(d)||(u=l("pointerleave",e,n,!0,d),c.dispatchEvent(u)),o=l("pointerout",e,n,!1),c.dispatchEvent(o),r=l("pointermove",e,n,!1),d.dispatchEvent(r),i=l("pointerover",e,n,!1),d.dispatchEvent(i),d.contains(c)||(a=l("pointerenter",e,n,!0,c),d.dispatchEvent(a)),void 0)},i=0;n.length>i;i+=1)r(n[i])}),window.addEventListener("touchend",function(e){var r,o;for(r=e.changedTouches,o=function(r){var i,o,a,u;u=document.elementFromPoint(r.clientX,r.clientY),i=l("pointerup",e,r,!1),o=l("pointerout",e,r,!1),a=l("pointerleave",e,r,!0),delete t[r.identifier],n-=1,u.dispatchEvent(i),u.dispatchEvent(o),u.dispatchEvent(a)},i=0;r.length>i;i+=1)o(r[i])}),window.addEventListener("touchcancel",function(e){var r,o;for(r=e.changedTouches,o=function(r){var i,o,a;i=l("pointercancel",e,r),o=l("pointerout",e,r),a=l("pointerleave",e,r),r.target.dispatchEvent(i),r.target.dispatchEvent(o),r.target.dispatchEvent(a),delete t[r.identifier],n-=1},i=0;r.length>i;i+=1)o(r[i])}))}}();var Interactions=function(){"use strict";function e(e,t,n){var r=f(),i=n?"addEventListener":"removeEventListener";r[i](e.toLowerCase(),t),r[i]("MS"+e,t)}function t(t,n){e(t,n,!0)}function n(t,n){e(t,n,!1)}function r(e){var t=f();return t.classList.contains(e)?!1:(i(),t.classList.add(e),g.push(e),!0)}function i(){for(var e,t=f();e=g.pop();)t.classList.remove(e)}function o(e){v.track(e),h.track(e)}function a(e){var t=h.isTriggered(e);return v.isTriggered(e)&&(r("drawerTopRevealed"),d.trigger("drawertop")),t>0&&(1===t?(r("drawerLeftRevealed"),d.trigger("drawerleft")):(r("drawerRightRevealed"),d.trigger("drawerright"))),n(l.MOVE,o),n(l.UP,a),e.preventDefault(),!1}function u(e){return f(),i(),v.start(e),h.start(e),t(l.MOVE,o),t(l.UP,a),e.preventDefault(),!1}function s(e){return p.track(e),m.track(e),e.preventDefault(),!1}function c(){t(l.DOWN,u),window.addEventListener("mousewheel",function(e){return e.preventDefault(),!1}),window.addEventListener("mousewheel",s),window.addEventListener("DOMMouseScroll",s)}var l={DOWN:"PointerDown",UP:"PointerUp",MOVE:"PointerMove"},d={clear:function(){i()}},f=function(){var e=null;return function(){return null===e&&(e=document.body),e}}(),v=function(){var e,t=!1;return{start:function(n){return t=16>n.clientY,e=n,t},track:function(n){return t&&(t=e.clientY<n.clientY),t},isTriggered:function(n){var r,i;return t&&(r=n.clientY-e.clientY,i=Math.abs(n.clientX-e.clientX),t=r>35&&(0===i||r/i>2)),t}}}(),h=function(){var e,t=!1,n=32;return{start:function(r){var i=f().clientWidth-n;return t=n>r.clientX||r.clientX>i,e=r,t},track:function(){return t},isTriggered:function(n){var r,i;return t&&(r=Math.abs(n.clientY-e.clientY),i=n.clientX-e.clientX,t=Math.abs(i)>35&&(0===r||Math.abs(i)/r>2)),t?i>0?1:2:-1}}}(),p=function(){function e(){l-->0?requestAnimationFrame(e):u=!1}function t(e){return s=o(),c=n(e),f=c,l=2,u=!0,f}function n(e){var t=!0;return t=e.axis===void 0?Math.abs(e.wheelDeltaY)>Math.abs(e.wheelDeltaX):e.axis>1}function i(e){e&&r("drawerTopRevealed")?d.trigger("drawertop"):!e&&r("drawerBottomRevealed")&&d.trigger("drawerbottom")}function o(){return void 0!==window.pageYOffset?window.pageYOffset:(document.documentElement||document.body.parentNode||document.body).scrollTop}function a(e){var t,n,r=o();4>l&&(l+=2)>0&&f&&(t=e.detail?-1*e.detail:e.wheelDeltaY/10,n=t>0,f=f&&Math.abs(t)>0&&r==s,l>2&&f&&i(n))}var u,s,c,l,f=!0;return{track:function(n){var r=n.params||n;return u?a(r):(t(r),e()),f},isTriggered:function(){return f}}}(),m=function(){function e(){c-->0?requestAnimationFrame(e):u=!1}function t(e){return s=o(),l=!i(e),c=2,u=!0,l}function n(e){e>0&&r("drawerLeftRevealed")?(d.trigger("drawerleft"),l=!1):0>e&&r("drawerRightRevealed")&&(d.trigger("drawerright"),l=!1)}function i(e){var t=!0;return t=e.axis===void 0?Math.abs(e.wheelDeltaY)>Math.abs(e.wheelDeltaX):e.axis>1}function o(){return void 0!==window.pageXOffset?window.pageXOffset:(document.documentElement||document.body.parentNode||document.body).scrollLeft}function a(e){var t;o(),l&&i(e)&&(l=!1),6>c&&(c+=2)>0&&l&&(t=e.detail?-1*e.detail:e.wheelDeltaX/10,l=l&&Math.abs(t)>0,c>4&&l&&n(t))}var u,s,c,l=!0;return{track:function(n){var r=n.params||n;return i(r),u?a(r):(t(r),e()),l},isTriggered:function(){return l}}}(),g=[];return RSVP.EventTarget.mixin(d),window.addEventListener("load",c),d}(),HTTPRequest=function(){"use strict";function e(e,t){var n=e.httpRequest;4==n.readyState&&t.resolve({status:n.status,request:e})}function t(t,n){t.httpRequest!==!1&&(t.httpRequest.onreadystatechange=function(){e(t,n)})}function n(e){this.debug=e?!0:!1,this.handlers={},this.httpRequest=!1,this.httpRequest||"undefined"==typeof XMLHttpRequest||(this.httpRequest=new XMLHttpRequest)}n.prototype={cancel:function(){this.httpRequest.abort()},openRequest:function(e,n,r){var i=new RSVP.Promise;return t(this,i),this.debug?this.httpRequest.open(e,prompt("Request url",n),r):this.httpRequest.open(e,n,r),i},sendRequest:function(e,t,n,r,i){var o,a,u=this.openRequest(e,t,n);if(i)for(o=0;i.length>o;o++)a=i[o],this.httpRequest.setRequestHeader(a.name,a.value);return this.httpRequest.send(r),u},getRequest:function(e,t,n){if(this.httpRequest!==!1){this.target=t;var r=null===n?"GET":"POST";return this.sendRequest(r,e,!1,n)}},doPostForm:function(e){var t,n,r,o,a,u,s="";if(this.httpRequest!==!1){for(this.target=e,t=e.method,n=e.action,r=0;e.elements.length>r;r++)o=e.elements[r],a=o.id||o.name,a&&(u=i.getValue(o),u&&(s.length>0&&(s+=","),s+=a,s+="=",s+=escape(u)));return alert("NYI, currently no data is accually posted!"),this.doPost(e.action,e,s)}},doPost:function(e,t,n){return this.doRequest(e,"POST",t,n,Array({name:"Content-Type",value:"application/x-www-form-urlencoded"}))},doGet:function(e,t){return this.doRequest(e,"GET",t,null)},doHead:function(e,t){return this.doRequest(e,"HEAD",t,null)},doRequest:function(e,t,n,r,i){return this.httpRequest!==!1?(this.target=n,this.sendRequest(t,e,!0,r,i)):void 0},getXML:function(e,t,n){return this.httpRequest!==!1?(this.getRequest(e,t,n),this.httpRequest.responseXML):void 0},getText:function(e,t,n){return this.httpRequest!==!1?(this.getRequest(e,t,n),this.httpRequest.responseText):void 0},addHandler:function(){throw"No longer implemented, with support for Promise, please use .then( ... )"}};var r={input:function(e){return r[e.type]?r[e.type](e):e.value},select:function(e){return e[e.selectedIndex].value},textarea:function(e){return e.value},checkbox:function(e){return e.checked?e.value:null},radio:function(e){return e.checked?e.value:null}},i={getValue:function(e){var t=e.nodeName.toLowerCase();return r[t]?r[t](e):null}};return n}(),Events=function(){"use strict";return{safRE:/safari/i,aRE:/^a$/i,eventQueue:[],attach:function(e,t,n){var r=null;e.addEventListener?r=e.addEventListener(t,n,!1):e.attachEvent?r=e.attachEvent("on"+t,n):e["on"+t]=n;var i={type:t,handler:n,element:e,result:r};if(0===this.eventQueue.length){this.eventQueue.push(!1);var o=this;this.eventQueue[0]=this.attach(document.body||document.documentElement,"unload",function(){o.clean()})}return this.eventQueue.push(i),i},detach:function(e){var t=e.element;t.removeEventListener?t.removeEventListener(e.type,e.handler,!1):t.detachEvent?t.detachEvent("on"+e.type,e.handler):t["on"+e.type]=null},cancel:function(e){try{e.preventDefault(),e.stopPropagation()}catch(t){e.returnValue=!1}if(Events.safRE.test(navigator.userAgent)){var n=e.target;if("#text"==n.nodeName&&(n=n.parentNode),Events.aRE.test(n.nodeName)){var r=n.onclick;n.onclick=function(){return n.onclick=r,!1}}}return!1},clean:function(){var e,t=this.eventQueue.length;for(e=0;t>e;this.detach(this.eventQueue[e++]));}}}(),FastButtonListener=function(e,t,n){"use strict";function r(e){var t=e||event,n=t.target||t.srcElement,r=u(n);if(d===!1&&r!==!1){d=r;var o=function(e){i(e)};p=g.attach(v,"touchend",o),m=g.attach(v,"mouseup",o)}}function i(e){var t=e||event,n=t.target||t.srcElement,r=!1;return d!==!1&&(d&&d.n===n&&(o(t),r=!0),d=!1,a()),r?g.cancel(t):!0}function o(){h[d.rel](d)}function a(){m&&(g.detach(m),m=!1),p&&(g.detach(p),p=!1)}function u(e){if(l.test(e.nodeName)){var t=s(e);if(t&&t.rel&&h[t.rel])return t}return!1}function s(e){var n=e.getAttribute("rel"),r=e.getAttribute("href"),i=null,o=r.indexOf("#"),a=0>o?!1:r.substr(o+1);a!==!1&&(i=t.getElementById(a));var u={n:e,rel:n,id:a,target:i};return u}function c(){var e=function(e){f=(new Date).getTime(),r(e)},t=function(e){var t=(new Date).getTime();t-f>500&&r(e)};g.attach(v,"mousedown",t),g.attach(v,"touchstart",e)}var l=/^a$/i,d=!1,f=0,v=t.documentElement||t.body,h={},p=!1,m=!1,g=n,w={addHandler:function(e,t){h[e]=t},debug:function(e){console.debug(this),this.eventsOrigin=g,g=e,c()},endDebug:function(){a(),f=0,g=this.eventsOrigin}};return c(),w}(window,document,Events);!function(){"use strict";function e(){return null===r&&(r=document.body||document.getElementsByTagName("body")[0]),r}for(var t="WGD_Resolutions_Helper",n=null,r=null,i=["ms","moz","webkit","o"],o=0;i.length>o&&!window.requestAnimationFrame;++o)window.requestAnimationFrame=window[i[o]+"RequestAnimationFrame"],window.cancelAnimationFrame=window[i[o]+"CancelAnimationFrame"]||window[i[o]+"CancelRequestAnimationFrame"];var a={RESOLUTION_LANDSCAPE:4,RESOLUTION_PORTAIT:2,RESOLUTION_UNDEFINED:1,RESOLUTION_QVGA:16,RESOLUTION_QVGA_LANDSCAPE:20,RESOLUTION_QVGA_PORTRAIT:18,RESOLUTION_NHD:32,RESOLUTION_NHD_LANDSCAPE:36,RESOLUTION_NHD_PORTRAIT:34,RESOLUTION_HOME_SCREEN:8,resolution:1,resizeHandler:Events.attach(window,"resize",function(){a.screenSetup()}),loadHandler:Events.attach(window,"load",function(){if(n=document.getElementById(t),!n){n=document.createElement("div"),n.id=this.HELPER_ID,n.style.width="100%",n.style.height="100%",n.style.position="absolute",n.style.top="0",n.style.left="0",n.style.visibility="hidden";var r=e();r.appendChild(n)}window.setTimeout(function(){a.screenSetup()},0)}),screenSetup:function(){var t=a.getShortSize(),n=e(),r=Math.round(t.min/24);n.classList&&requestAnimationFrame&&n.classList.add("is-scaling"),a.setOrientation(t.landscape?"landscape":"portrait"),n.style.fontSize=r+"px",n.classList&&requestAnimationFrame&&requestAnimationFrame(function(){n.classList.remove("is-scaling")})},getShortSize:function(){var t,r=screen.width,i=screen.height,o=e();return("ontouchstart"in window||240!=r&&320!=r&&360!=r&&640!=r)&&(r=n.clientWidth||o.innerWidth,i=n.clientHeight||o.innerHeight),t=Math.min(r,i),{min:t,landscape:t!=r}},setOrientation:function(t){var n=e();n.className=n.className.replace(/ ?orientation_[^ ]+/,"")+" orientation_"+t}}}(),window.a5s=window.a5s===void 0?{}:window.a5s;var ClassTemplate=function(){"use strict";function e(e){var t,n,r,i,o=document.getElementsByTagName("script"),a=o.length,u=a,s=RegExp("^(.*/)"+e+".js\\b.*$","i");for(u;u--;)if(t=o[u],n=t.src,r=n.match(s))return i=r[1]+e+".html";return null}var t={},n=/\${([^}]+)}/gi,r='<article id="${id}">Loading...</article>',i={},o={loadTemplate:function(t){var n,r,o,a=this.getTemplate(t),u=i[t];return null===a&&u===void 0&&(u=new RSVP.Promise,n=e(t),r=this,o=new HTTPRequest(!1),r.trigger("template.queued",{type:t,url:n}),o.doGet(n).then(function(e){var n=e.request,o=n.httpRequest.responseText;r.addTemplate(t,o),r.trigger("template.finished",{type:t,template:o}),u.trigger("template.finished",{type:t,template:o}),u.resolve({type:t,template:o}),delete i[t]}),i[t]=u),u},renderTemplate:function(e,t,n,o){var a=ClassTemplate.getTemplate(e),u=i[e],s=o||new RSVP.Promise;if(null===a?(u||(u=this.loadTemplate(e)),u.on("template.finished",function(){ClassTemplate.renderTemplate(e,t,n,s),u.resolve()}),a=r):s.resolve({node:n}),!n)throw"No target-node specified!!!";return n.innerHTML=ClassTemplate.fillTemplate(a,t),s},addTemplate:function(e,n){t[e]=n},getTemplate:function(e){return t[e]?t[e]:null},fillTemplate:function(e,t){for(var r="",i=null,o=0;i=n.exec(e);){var a=t[i[1]];a=a!==void 0?a:i[1],r+=RegExp.leftContext.substr(o)+a,o=n.lastIndex}return 0>=r.length?e:r+=RegExp.rightContext}};if(window.unittesting){var a=null;o.reset=function(){null===a&&(a=t),t={};for(var e in a)t[e]=a[e]}}return RSVP.EventTarget.mixin(o),o}(a5s);(function(){var e=!1,t=/xyz/.test(function(){})?/\b_super\b/:/.*/;this.Class=function(){},Class.extend=function(n){function r(){!e&&this.init&&this.init.apply(this,arguments)}var i=this.prototype;e=!0;var o=new this;e=!1;for(var a in n)o[a]="function"==typeof n[a]&&"function"==typeof i[a]&&t.test(n[a])?function(e,t){return function(){var n=this._super;this._super=i[e];var r=t.apply(this,arguments);return this._super=n,r}}(a,n[a]):n[a];return r.prototype=o,r.prototype.constructor=r,r.extend=arguments.callee,r}})();var DragDrop=function(e){function t(e,t,n){var r=f(),i=n?"addEventListener":"removeEventListener";r[i](e.toLowerCase(),t),r[i]("MS"+e,t)}function n(e,n){t(e,n,!0)}function r(e,n){t(e,n,!1)}function i(t){for(var r,t=t||event,i=t.target||t.srcElement,a=i,f=null;a&&!(f=a.getAttribute("data-dragsource"));)console.log("hunting for dragSource!!"),a=a.parentNode;r=s[f],a&&f&&r&&(l=f,c=a,d=new RSVP.Promise,d.then(function(e){r(a,e)}),n("PointerUp",o),u=Events.attach(e,"touchmove",function(e){e.preventDefault()}))}function o(e){r("PointerUp",o),u=Events.detach(u);var e=e||event,t=e.target||e.srcElement,n=t,i=null;for(e.changedTouches&&document.elementFromPoint&&(n=document.elementFromPoint(e.changedTouches[0].pageX,e.changedTouches[0].pageY));n&&!(i=n.getAttribute("data-dragtarget"));)n=n.parentNode;n&&i&&i===l?d.resolve(n):d.reject()}function a(){n("PointerDown",i),Events.attach(e,"touchstart",function(e){e.preventDefault()}),Events.attach(e,"touchmove",function(e){e.preventDefault()})}var u,s={},c=null,l=null,d=null,f=function(){var e=null;return function(){return null===e&&(e=document.body),e}}();return Events.attach(window,"load",function(){a()}),DragDrop={addHandler:function(e,t){s[e]=t}}}(document.documentElement);