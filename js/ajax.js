;(function(global){var undefined=void(0);var namespace={};var defaultOptions={url:'',data:'',type:'',async:true,success:function(data){},error:function(errInfo){},header:{},overrideMimeType:'',cache:false,timeout:0,processData:true,contentType:'application/x-www-form-urlencoded',dataType:'text'};var ajax=function(options){if(!tool.isObject(options)){throw new TypeError('参数类型错误');}var userOptions=tool.extend(defaultOptions,options);var xhr=tool.getXHR();if(/^(get|delete|head)$/img.test(userOptions.type)){var data=tool.encodeToURIString(userOptions.data);userOptions.url=tool.hasSearch(userOptions.url,data);userOptions.data=null}if(userOptions.cache===false){var random='_='+(Math.random()*0xffffff).toFixed(0);userOptions.url=tool.hasSearch(userOptions.url,random)}xhr.open(userOptions.type,userOptions.url,userOptions.async);if(tool.isObject(userOptions.header)){tool.eachObject(userOptions.header,function(key,value){xhr.setRequestHeader(key,value)})}if(userOptions.contentType&&tool.isString(userOptions.contentType)){xhr.setRequestHeader('content-type',userOptions.contentType)}if(userOptions.overrideMimeType&&tool.isString(userOptions.overrideMimeType)){xhr.overrideMimeType(userOptions.overrideMimeType)}if(tool.isNumber(userOptions.timeout)&&userOptions.timeout>0){xhr.timeout=userOptions.timeout;if('ontimeout'in xhr){xhr.ontimeout=function(){userOptions.error('timeout')}}else{setTimeout(function(){if(xhr.readyState!==4){xhr.abort()}},xhr.timeout)}}if(/^(post|put)$/igm.test(userOptions.type)&&userOptions.processData===true){userOptions.data=tool.encodeToURIString(userOptions.data)}xhr.onreadystatechange=function(){if(xhr.readyState===4){var responseText=xhr.responseText;if(/^2\d{2}$/.test(xhr.status)){if(userOptions.dataType==='json'){try{responseText=tool.JSONParse(responseText)}catch(ex){userOptions.error(ex);return}}userOptions.success(responseText)}else if(/^(4|5)\d{2}$/.test(xhr.status)){userOptions.error(xhr.status)}}};xhr.send(userOptions.data)};var getType=function(type){return function(obj){return Object.prototype.toString.call(obj)==='[object '+type+']'}};var tool={getXHR:(function(){var list=[function(){return new XMLHttpRequest},function(){return new ActiveXObject('Microsoft.XMLHTTP')},function(){return new ActiveXObject("Msxml2.XMLHTTP")},function(){return new ActiveXObject("Msxml3.XMLHTTP")}];var len=list.length;var xhr=null;while(len--){try{list[len]();xhr=list[len];break}catch(ex){continue}}if(xhr!==null){return xhr}throw new Error('当前浏览器不支持此方法');})(),extend:function(){var voidObj={};this.each(arguments,function(item){tool.eachObject(item,function(key,value){voidObj[key]=value})});return voidObj},each:(function(){if([].forEach){return function(list,callback,context){[].forEach.call(list,callback,context)}}return function(list,callback,context){for(var i=0,j=list.length;i<j;i++){callback.call(context,list[i],i,list)}}})(),eachObject:function(obj,callback,context){for(var n in obj){if(!obj.hasOwnProperty(n))continue;callback.call(context,n,obj[n])}},init:function(){this.each(['Object','Function','Array','String','Number'],function(item){tool['is'+item]=getType(item)})},encodeToURIString:function(data){if(this.isString(data))return data;if(!this.isObject(data))return'';var arr=[];this.eachObject(data,function(key,value){arr.push(encodeURIComponent(key)+'='+encodeURIComponent(value))});return arr.join('&')},hasSearch:function(url,padString){if(!padString)return url;return url+(/\?/.test(url)?'&':'?')+padString},JSONParse:function(jsonString){if(window.JSON){return JSON.parse(jsonString)}return eval('('+jsonString+')')}};tool.init();tool.each(['get','post'],function(item){namespace[item]=function(url,data,callback,dataType){ajax({url:url,type:item,data:data,success:callback,dataType:dataType})}});namespace.ajax=ajax;var globalX=global.x;namespace.noConflict=function(symbol){if(symbol&&tool.isString(symbol)){window[symbol]=namespace}window.x=globalX;return namespace};global.x=namespace})(this);