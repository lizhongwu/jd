function on(ele,type,fn){if(/^self/.test(type)){if(!ele["aSelf"+type])ele["aSelf"+type]=[];var a=ele["aSelf"+type];for(var i=0;i<a.length;i++){if(a[i]==fn)return}a.push(fn);return}if(ele.addEventListener){ele.addEventListener(type,fn,false);return}if(!ele["aEvent"+type]){ele["aEvent"+type]=[];ele.attachEvent("on"+type,function(){run.call(ele)})}var a=ele["aEvent"+type];for(var i=0;i<a.length;i++){if(a[i]==fn)return}a.push(fn)}function run(){var e=window.event;var type=e.type;if(!e.target){e.pageX=(document.documentElement.scrollLeft||document.body.scrollLeft)+e.clientX;e.pageY=(document.documentElement.scrollTop||document.body.scrollTop)+e.clientY;e.stopPropagation=function(){e.cancelBubble=true}e.preventDefault=function(){e.returnValue=false}e.target=e.srcElement}var a=this["aEvent"+type];if(a&&a.length){for(var i=0;i<a.length;i++){if(typeof a[i]=="function"){a[i].call(this,e)}else{a.splice(i,1);i--}}}}function off(ele,type,fn){if(ele.removeEventListener){ele.removeEventListener(type,fn,false);return}var a=ele["aEvent"+type];if(a&&a.length){for(var i=0;i<a.length;i++){if(a[i]==fn){a[i]=null;return}}}}function processThis(fn,obj){return function(e){fn.call(obj,e)}}function selfRun(selfType,e){var a=this["aSelf"+selfType];if(a){for(var i=0;i<a.length;i++){a[i].call(this,e)}}}