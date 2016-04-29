;
(function (global) {
    // 防止低版本ie里，undefined被重写
    var undefined = void(0);
    var namespace = {};

    var defaultOptions = {
        // ajax请求的路径是什么
        url: '',
        // 往服务器发送的数据
        data: '',
        // 使用什么http方法
        type: '',
        // ajax请求方式，同步还是异步。默认为异步
        async: true,
        // 成功时执行的函数
        success: function (data) {
        },
        // 失败时执行的函数
        error: function (errInfo) {
        },
        // 自定义请求首部列表
        header: {},
        // 重写的mimeType
        overrideMimeType: '',
        // 是否走缓存
        cache: false,
        // 超时毫秒数。默认为0 表示不执行超时逻辑
        timeout: 0,
        // 是否格式化参数为uri string
        processData: true,
        // 请求的mime类型 默认为表单提交
        contentType: 'application/x-www-form-urlencoded',
        // 返回的数据格式 text|json
        dataType: 'text'
    };
    var ajax = function (options) {
        // 判断参数是否为对象，如果不是则抛出类型错误
        if (!tool.isObject(options)) {
            throw new TypeError('参数类型错误');
        }
        // 合并用户输入的参数列表和默认的参数列表 返回一个全新的参数列表对象
        var userOptions = tool.extend(defaultOptions, options);

        // ajax第一步：获取ajax对象
        var xhr = tool.getXHR();

        // 1、如果是get系 需要把data拼接到url后面
        if (/^(get|delete|head)$/img.test(userOptions.type)) {
            var data = tool.encodeToURIString(userOptions.data);
            userOptions.url = tool.hasSearch(userOptions.url, data);
            // 因为get系不需要传send参数，所以设置为null
            userOptions.data = null;
        }
        // 2、是否走缓存，如果不走缓存则在url后面加一个随机数来防止缓存
        if (userOptions.cache === false) {
            // 因为search是有固定格式的 key=value 如果只写一个value是不合法的，所以必须构造一个key，而且这个key不能和已有的key重复
            var random = '_=' + (Math.random() * 0xffffff).toFixed(0);
            userOptions.url = tool.hasSearch(userOptions.url, random);
        }
        xhr.open(userOptions.type, userOptions.url, userOptions.async);
        // 2.1 设置自定义请求首部信息
        if (tool.isObject(userOptions.header)) {
            tool.eachObject(userOptions.header, function (key, value) {
                xhr.setRequestHeader(key, value);
            })
        }
        // 2.2 设置content-type http里表现mimeType的字段就是content-type
        //设置请求的mimeType
        if (userOptions.contentType && tool.isString(userOptions.contentType)) {
            xhr.setRequestHeader('content-type', userOptions.contentType);
        }
        // 2.3 设置重写的mime类型
        //设置响应的mimeType
        if (userOptions.overrideMimeType && tool.isString(userOptions.overrideMimeType)) {
            xhr.overrideMimeType(userOptions.overrideMimeType);
        }
        // 2.4 判断是否执行超时逻辑
        if (tool.isNumber(userOptions.timeout) && userOptions.timeout > 0) {
            xhr.timeout = userOptions.timeout;
            // 标准浏览器
            if ('ontimeout' in xhr) {
                xhr.ontimeout = function () {
                    userOptions.error('timeout');
                }
            } else {
                // 低版本ie
                setTimeout(function () {
                    // http的事务是否还没有完成
                    if (xhr.readyState !== 4) {
                        // 强制终止http事务
                        xhr.abort();
                    }
                }, xhr.timeout);
            }
        }

        // 2.5 是否需要处理给服务器发送的数据 判断processData是否为true
        //当给服务器发送的数据为二进制或formData的时候,不需要处理这个数据,要把processData设置为false
        if (/^(post|put)$/igm.test(userOptions.type) && userOptions.processData === true) {
            userOptions.data = tool.encodeToURIString(userOptions.data);
        }
        // ajax第三步:接收响应
        xhr.onreadystatechange = function () {
            // http的事务是否完成
            if (xhr.readyState === 4) {
                //获取响应主体
                var responseText = xhr.responseText;
                // 判断状态码是否成功
                if (/^2\d{2}$/.test(xhr.status)) {
                    // 判断是否需要把响应主体格式化为json对象
                    if (userOptions.dataType === 'json') {
                        // 因为不合法的json字符串无法转换为json对象，会出异常
                        try {
                            responseText = tool.JSONParse(responseText);
                        } catch (ex) {
                            userOptions.error(ex);
                            return;
                        }
                    }
                    userOptions.success(responseText);
                    // R如果响应码是错误的类型
                } else if (/^(4|5)\d{2}$/.test(xhr.status)) {
                    // 直接执行error
                    userOptions.error(xhr.status);
                }
            }
        };
        // ajax第四步：发送
        xhr.send(userOptions.data);
    };
    /**
     * 利用闭包，实现获取数据类型
     * @param {string} type 数据类型
     * @returns {Function}
     */
    var getType = function (type) {
        return function (obj) {
            //为什么要用Object.prototype.toString来判断类型?
            return Object.prototype.toString.call(obj) === '[object ' + type + ']';
        }
    };

    var tool = {
        /**
         * 利用惰性函数,实现获取ajax对象的方法
         */
        getXHR: (function () {
            var list = [function () {
                return new XMLHttpRequest;
            }, function () {
                return new ActiveXObject('Microsoft.XMLHTTP');
            }, function () {
                return new ActiveXObject("Msxml2.XMLHTTP");
            }, function () {
                return new ActiveXObject("Msxml3.XMLHTTP");
            }];
            var len = list.length;
            var xhr = null;
            while (len--) {
                try {
                    list[len]();
                    xhr = list[len];
                    break;
                } catch (ex) {
                    continue;
                }
            }
            if (xhr !== null) {
                return xhr;
            }
            throw new Error('当前浏览器不支持此方法');

        })(),
        // 合并多个对象
        extend: function () {
            // 因为参数长度不固定，所以把参数列表转成数组
            //var params = [].slice.call(arguments, 0);
            var voidObj = {};
            this.each(arguments, function (item) {
                // item为每一个参数
                tool.eachObject(item, function (key, value) {
                    voidObj[key] = value;
                });
            });
            return voidObj;
        },
        /**
         * 循环帮助函数,利用惰性函数
         */
        each: (function () {
            if ([].forEach) {
                return function (list, callback, context) {
                    [].forEach.call(list, callback, context);
                }
            }
            return function (list, callback, context) {
                for (var i = 0, j = list.length; i < j; i++) {
                    callback.call(context, list[i], i, list);
                }
            }
        })(),
        /**
         * 循环对象
         * @param {Object} obj 要循环的对象
         * @param {Function} callback 回调函数
         * @param {Object|undefined} context 回调函数里头的上下文对象
         */
        eachObject: function (obj, callback, context) {
            for (var n in obj) {
                if (!obj.hasOwnProperty(n)) continue;
                callback.call(context, n, obj[n]);
            }
        },
        /**
         * 给tool动态添加判断数据类型的方法
         */
        init: function () {
            this.each(['Object', 'Function', 'Array', 'String', 'Number'], function (item) {
                tool['is' + item] = getType(item);
            })
        },
        /**
         * 把一个对象格式化为uri string
         * @param {*} data 需要格式化的数据
         * @returns {string} 格式化之后的uri
         */
        encodeToURIString: function (data) {
            if (this.isString(data))  return data;
            if (!this.isObject(data)) return '';
            var arr = [];
            this.eachObject(data, function (key, value) {
                arr.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
            });
            return arr.join('&');
        },
        /**
         * 往url后面拼接参数的方法
         * @param {string} url url
         * @param {string} padString 要拼接的参数
         * @returns {*} 拼接之后的url
         */
        hasSearch: function (url, padString) {
            if (!padString) return url;
            // 如果有问号，说明url里已经有参数了，因为参数和参数之间用&来分隔
            /*if (/\?/.test(url)) {
             return url + '&' + padString;
             } else {
             return url + '?' + padString;
             }*/
            return url + (/\?/.test(url) ? '&' : '?') + padString;
        },
        /**
         * 把json字符串格式化为json对象
         * @param {string} jsonString json字符串
         * @returns {*}
         */
        JSONParse: function (jsonString) {
            if (window.JSON) {
                return JSON.parse(jsonString)
            }
            return eval('(' + jsonString + ')');
        }
    };
    tool.init();

    tool.each(['get','post'], function(item) {
        /**
         * 动态添加
         * @param url 请求的url
         * @param data 往服务器发送的数据
         * @param callback 成功的回调函数
         * @param dataType 数据格式
         */
        namespace[item] = function(url, data, callback, dataType) {
            ajax({
                url : url,
                type : item,
                data : data,
                success : callback,
                dataType :dataType
            })
        }
    });

    //ajax方法放入命名空间中
    namespace.ajax = ajax;
    //先把全局里已经存在的x先放到一边
    var globalX = global.x;
    /**
     * 解决全局变量名冲突
     * @param {string|undefined} symbol 更改的全局变量名
     * @returns {Object}
     */
    namespace.noConflict = function (symbol) {
        if (symbol && tool.isString(symbol)) {
            window[symbol] = namespace;
        }
        window.x = globalX;
        return namespace;
    };
    //暴露到全局环境中
    global.x = namespace;

})(this);

