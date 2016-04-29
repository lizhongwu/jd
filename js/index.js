/*//初始化全部图片的延迟加载 (模拟出效果)
 ~(function(window, undefined){
 document.documentElement.scrollTop = document.body.scrollTop = 0;
 var oImgs = document.images;
 for (var i=0;i<oImgs.length;i++) {
 var oImg = oImgs[i];
 oImg.flag = true;
 oImg.realSrc = oImg.src;
 oImg.scr = "./images/loading.gif";
 oImg.t = DOM.offset(oImg).top;
 }
 on(window, "scroll", function () {
 var h = (document.documentElement.scrollTop || document.body.scrollTop)+(document.documentElement.clientHeight || document.body.clientHeight);
 for (var j=0;j<oImgs.length;j++) {
 if (h > oImgs[j].t + oImgs[j].offsetHeight) {
 if (oImgs[j].flag) {//控制加载一次
 oImgs[j].src = "./images/loading.gif";
 var imgTemp = new Image;
 imgTemp.src = oImgs[j]["realSrc"]+"?"+Math.random();
 ~(function(index){
 imgTemp.onload = function() {
 oImgs[index].src = this.src;
 oImgs[index].flag = false;
 };
 })(j);
 }
 }
 }
 })
 })(window);*/

function GetQueryString(name)
{
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}

if (GetQueryString("checkSuccess")) {
    var isLogin = document.getElementById("isLogin");
    isLogin.innerHTML = "李仲午,欢迎你";
}


//初始化ajax 获取全部数据
~(function () {
    x.noConflict("myAjax");
    myAjax.ajax({
        url: "./data/data.json",
        type: "get",
        cache: false,
        async: true,
        dataType: "json",
        success: function (data) {
            var hotwordsData = data["hotwords"];
            var newsData = data["news"];
            var serviceData = data["service"];
            var itemData = data["item"];
            var itemslayerData = data["itemslayer"];
            var guessData = data["guess"];

            //初始化热门关键字
            if (hotwordsData.length) {
                //<a href="javascript:void(0)" /*class="style-red"*/>家装节</a>
                var hotWords = document.getElementById("hotWords");
                for (var i = 0; i < hotwordsData.length; i++) {
                    var cA = document.createElement("a");
                    cA.innerHTML = hotwordsData[i]["name"];
                    cA.href = hotwordsData[i]["href"];
                    if (hotwordsData[i]["class"]) {
                        cA.className = hotwordsData[i]["class"];
                    }
                    hotWords.appendChild(cA);
                }
            }
            //初始化京东快报
            if (newsData) {
                //<li><a href="javascript:void(0)"><span>[特惠]</span>免费抽原汁机 小熊电器！</a></li>
                var news = document.getElementById("news");
                for (var i = 0; i < newsData.length; i++) {
                    var cLi = document.createElement("li");
                    news.appendChild(cLi);
                    var cA = document.createElement("a");
                    cA.href = newsData[i]["href"];
                    cLi.appendChild(cA);
                    var cSpan = document.createElement("span");
                    cSpan.innerHTML = "[" + newsData[i]["title"] + "]";
                    cA.appendChild(cSpan);
                    cA.innerHTML += newsData[i]["content"];
                }
            }
            //初始化服务
            if (serviceData) {
                //<li><a href="javascript:void(0)"><i class="ci-left"></i><span>话费</span></a></li>
                var service = DOM.getElesByClass("service")[0];
                var oUl = DOM.children(service, "ul")[0];
                var serviceTab = document.getElementById("serviceTab");//选项卡显示内容
                for (var i = 0; i < serviceData.length; i++) {
                    var cLi = document.createElement("li");
                    var cA = document.createElement("a");
                    var cI = document.createElement("i");
                    cI.className = "ci-left";
                    cI.style.backgroundPosition = "0 " + (-25 * i) + "px";
                    var cSpan = document.createElement("span");
                    cSpan.innerHTML = serviceData[i]["name"];
                    cLi.appendChild(cA);
                    cA.appendChild(cI);
                    cA.appendChild(cSpan);
                    oUl.appendChild(cLi);

                    if (i < 4 && !cLi.index) {//选择第一排的服务项后 初始化选项卡
                        cLi.index = i;
                        on(cLi, "mouseenter", function (e) {
                            DOM.addClass(this, "current");
                            DOM.addClass(oUl, "service-current");
                            serviceTab.style.display = "block";//显示选项卡
                            animate(serviceTab, {top: 28}, 200);

                            var oIs = oUl.getElementsByTagName("i");
                            for (var k = 0; k < oIs.length; k++) {//隐藏全部服务图标
                                oIs[k].style.display = "none";
                            }
                            //显示被选中的选项卡内容
                            DOM.removeClass(DOM.children(serviceTab)[this.index], "hide");
                        });

                    } else if (i === 4) {
                        //绑定选项卡事件
                        var current = DOM.children(oUl);
                        for (var j = 0; j < 4; j++) {
                            current[j].index = j;
                            on(current[j], "mouseenter", function (e) {
                                var _this = this;
                                DOM.addClass(_this, "current");
                                var siblings = DOM.siblings(_this);
                                for (var l = 0; l < siblings.length; l++) {
                                    DOM.removeClass(siblings[l], "current");
                                }
                                //if (_this.t) {
                                //    window.clearTimeout(_this.t);
                                //    _this.t = null;
                                //}
                                //_this.t = window.setTimeout(function () {
                                var oPanel = DOM.children(serviceTab, "div")[_this.index];
                                DOM.removeClass(oPanel, "hide");
                                var otherPanels = DOM.siblings(oPanel);
                                for (var l = 0; l < otherPanels.length; l++) {
                                    DOM.addClass(otherPanels[l], "hide");
                                }
                                //}, 500);
                            });
                        }
                    }
                }
            }
            //初始化商品大类别
            if (itemData) {
                //<div class="item"><h3><a href="javascript:void(0)">家用电器</a></h3><i>></i></div>
                var classify = document.getElementById("classify");
                for (var i = 0; i < itemData.length; i++) {
                    var cDiv = document.createElement("div");
                    cDiv.className = "item";
                    classify.appendChild(cDiv);
                    var cH3 = document.createElement("h3");
                    cDiv.appendChild(cH3);

                    var cAinnerHtml = itemData[i]["name"];
                    var aCainnerHtml = cAinnerHtml.split("、");
                    for (var j = 0; j < aCainnerHtml.length; j++) {
                        var cA = document.createElement("a");
                        cA.href = "javascript:void(0)";
                        if (j + 1 === aCainnerHtml.length) {
                            cA.innerHTML = aCainnerHtml[j];
                        } else {
                            cA.innerHTML = aCainnerHtml[j] + "、";
                        }
                        cH3.appendChild(cA);
                    }


                    var cI = document.createElement("i");
                    cI.innerHTML = ">";
                    cDiv.appendChild(cI);
                    //<div class="items-layer">1</div>
                    var cDiv2 = document.createElement("div");
                    cDiv2.className = "items-layer";
                    cDiv2.innerHTML = "<img  src='./images/panel/c" + (i + 1) + ".png'/>";
                    classify.appendChild(cDiv2);
                }

                var items = DOM.getElesByClass("item", document.getElementById("classify"));
                var itemsLayer = DOM.getElesByClass("items-layer");
                for (var i = 0; i < items.length; i++) {
                    on(items[i], "mouseover", function (e) {
                        DOM.next(this).style.display = "block";
                        DOM.addClass(this, "hover");
                    });
                    on(items[i], "mouseout", function (e) {
                        DOM.next(this).style.display = "none";
                        DOM.removeClass(this, "hover");
                    })
                }
                for (var i = 0; i < itemsLayer.length; i++) {
                    on(itemsLayer[i], "mouseover", function (e) {
                        this.style.display = "block";
                        DOM.addClass(DOM.previous(this), "hover");

                    });
                    on(itemsLayer[i], "mouseout", function (e) {
                        this.style.display = "none";
                        DOM.removeClass(DOM.previous(this), "hover");
                    })
                }
            }
            //初始化猜你喜欢
            if (guessData) {
                /*<li>
                 <div class="p-img"><a href="javascript:void(0)">
                 <img src="./images/guess1.jpg"
                 alt="" title="华为（HUAWEI）原装三键线控带麦半入耳式耳机AM116(尊爵版)" width="130" height="130"/>
                 </a></div>
                 <div class="p-info">
                 <div class="p-name"><a href="javascript:void(0)"
                 title="华为（HUAWEI）原装三键线控带麦半入耳式耳机AM116(尊爵版)">华为（HUAWEI）原装三键线控带麦半入耳式耳机AM116(尊爵版)</a>
                 </div>
                 <div class="p-price" data-lazyload-fn="done"><i>¥</i>69.00</div>
                 </div>

                 </li>*/
                var guess = document.getElementById("guess");

                function randomGuess() {
                    var guessInneHtml = "";
                    var guessAry = [];
                    var randomAry = [];
                    for (var i = 0; i < guessData.length; i++) {
                        guessAry.push(i);
                    }
                    for (var i = 0; i < 6; i++) {
                        var random = Math.floor(Math.random() * guessAry.length);
                        var item = guessAry[random];
                        guessAry[random] = guessAry[guessAry.length - 1];
                        guessAry.length--;
                        randomAry.push(item);
                    }
                    for (var i = 0; i < 6; i++) {
                        guessInneHtml += '<li><div class="p-img"><a href="javascript:void(0)"><img src="' + (guessData[randomAry[i]]["path"]) + '" title="' + (guessData[randomAry[i]]["title"]) + '" width="130" height="130"/></a></div><div class="p-info"> <div class="p-name"><a href="javascript:void(0)" title="' + (guessData[randomAry[i]]["title"]) + '">' + (guessData[randomAry[i]]["title"]) + '</a></div><div class="p-price"><i>¥</i>' + (guessData[randomAry[i]]["price"]) + '</div></div></li>';
                    }
                    guess.innerHTML = guessInneHtml;
                }

                randomGuess();
                var changeGuess = document.getElementById("changeGuess");
                on(changeGuess, "click", randomGuess);
            }
        }, error: function (err) {
            console.error(err);
        }
    });
})();


//顶部的下拉
~(function () {
    var dropDown = DOM.getElesByClass("dorpdown");
    var areaSel = document.getElementById("areaSel");//已选择的地区
    var area = document.getElementById("area");//全部地区ul
    var areas = null;
    var areaFlag = true;
    for (var i = 0; i < dropDown.length; i++) {
        on(dropDown[i], "mouseover", function (e) {
            var target = e.target;
            DOM.addClass(this, "hover");
            ////箭头的动画效果 (如果是IE 或者是购物车则无动画效果)
            //if (window.addEventListener && /cart/.test(target.className)) {
            //    var s = DOM.children(DOM.children(DOM.children(this)[0])[0])[0];
            //    animate(s,{top:-1},300, 5);
            //}

            //使用ajax获取地区数据,仅获取一次
            if (/area/.test(target.className) && target.tagName === "LI") {
                if (!areaFlag) return;
                areaFlag = false;

                myAjax.ajax({
                    url: "./data/area.json",
                    type: "get",
                    cache: false,
                    async: true,
                    dataType: "text",
                    success: function (data) {
                        var aData = utils.jsonParse(data);
                        for (var i = 0; i < aData.length; i++) {
                            var cLi = document.createElement("li");
                            cLi.innerHTML = aData[i]["name"];
                            if (areaSel.innerHTML === aData[i]["name"]) {
                                cLi.className = "area-sel";
                            }
                            area.appendChild(cLi);
                        }
                        //选择(点击)地区事件
                        areas = DOM.children(area);
                        if (areas) {
                            for (var j = 0; j < areas.length; j++) {
                                on(areas[j], "click", function (e) {
                                    var siblings = DOM.siblings(this);
                                    for (var k = 0; k < siblings.length; k++) {
                                        siblings[k].className = "";
                                    }
                                    this.className = "area-sel";
                                    areaSel.innerHTML = this.innerHTML;
                                })
                            }
                        }
                    }, error: function (err) {
                        console.error(err);
                    }
                });
            }
        });
        on(dropDown[i], "mouseout", function (e) {
            DOM.removeClass(this, "hover");
            //箭头的动画效果
            //if (window.addEventListener) {
            //    var s = DOM.children(DOM.children(DOM.children(this)[0])[0])[0];
            //    animate(s,{top:-7},300, 5);
            //}
        })
    }

})();

//轮播图 (待优化)
~(function () {
    var slider = document.getElementById("slider");
    var sliderPage = DOM.getElesByClass("slider-page",slider)[0];
    on(slider , "mouseenter", function () {
        sliderPage.style.display = "block";
    });
    on(slider, "mouseleave", function () {
        sliderPage.style.display = "none";
    });
    var oLis = DOM.getElesByClass("inner", slider);
    for (var i = 0; i < oLis.length; i++) {
        var oLi = oLis[i];
        oLi.style.position = "absolute";
        if (i) {
            oLi.style.zIndex = 0;
            oLi.style.opacity = 0;
        } else {
            oLi.style.zIndex = 1;
            oLi.style.opacity = 1;
        }
    }

    var showIndex = 0;
    function auto () {
        showIndex++;
        if (showIndex===oLis.length) {
            showIndex=0;
        }
        for (var i = 0; i < oLis.length; i++) {
            var oLi = oLis[i];
            if (i !== showIndex) {
                oLi.style.zIndex = 0;
                oLi.style.opacity = 0;
            }
        }
        animate(oLis[showIndex], {"z-index": "1", opacity: 1}, 100);
        changeCur(showIndex);
    }
    slider.timer = window.setInterval(auto, 4000);

    var prev = DOM.getElesByClass("slider-prev",sliderPage)[0];
    var next = DOM.getElesByClass("slider-next",sliderPage)[0];

    prev.onclick = function () {
        window.clearInterval(slider.timer);
        slider.timer = null;
        showIndex--;

        if(showIndex===-1) {
            showIndex = oLis.length-1;
        }

        for (var i = 0; i < oLis.length; i++) {
            var oLi = oLis[i];
            if (i !== showIndex) {
                oLi.style.zIndex = 0;
                oLi.style.opacity = 0;
            }
        }
        animate(oLis[showIndex], {"z-index": "1", opacity: 1}, 100);
        changeCur(showIndex);
        slider.timer = window.setInterval(auto, 4000);
    };

    next.onclick = function () {
        window.clearInterval(slider.timer);
        slider.timer = null;
        showIndex++;

        if (showIndex===oLis.length) {
            showIndex=0;
        }

        for (var i = 0; i < oLis.length; i++) {
            var oLi = oLis[i];
            if (i !== showIndex) {
                oLi.style.zIndex = 0;
                oLi.style.opacity = 0;
            }
        }
        animate(oLis[showIndex], {"z-index": "1", opacity: 1}, 100);
        changeCur(showIndex);
        slider.timer = window.setInterval(auto, 4000);
    };

    var sliderCur = document.getElementById("slider-cur");
    var oSpans = DOM.children(sliderCur, "span");
    function changeCur (n) {
        for (var i=0;i<oSpans.length;i++) {
            DOM.removeClass(oSpans[i], "cur");
        }
        DOM.addClass(oSpans[n], "cur");
    }

    for (var i=0;i<oSpans.length;i++) {
        oSpans[i].index = i;
        on (oSpans[i], "mouseenter", function () {
            window.clearInterval(slider.timer);
            slider.timer = null;

            showIndex = this.index;

            for (var i = 0; i < oLis.length; i++) {
                var oLi = oLis[i];
                if (i !== showIndex) {
                    oLi.style.zIndex = 0;
                    oLi.style.opacity = 0;
                }
            }
            animate(oLis[showIndex], {"z-index": "1", opacity: 1}, 100);
            changeCur(showIndex);
            slider.timer = window.setInterval(auto, 4000);
        })
    }

})();


//回到顶部
~(function () {
    var toolbarTop = document.getElementById("toolbarTop");
    on(toolbarTop, "click", function (e) {
        var duration = 1000, interval = 10, target = document.documentElement.scrollTop || document.body.scrollTop, step = (target / duration) * interval;
        toolbarTop.t = window.setInterval(function () {
            var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            var speed = scrollTop / interval;
            if (scrollTop === 0) {
                window.clearInterval(toolbarTop.t);
                toolbarTop.t = null;
                return;
            }
            scrollTop -= step + speed;
            document.documentElement.scrollTop = document.body.scrollTop = scrollTop;
        }, interval);

    });
})();

//小轮播图
~(function () {
    var slider = DOM.getElesByClass("slider2")[0];
    var oUl = DOM.getElesByClass("inner", slider)[0];
    var oLis = DOM.children(oUl, "li");
    var step = 0;
    function autoLeft() {
        step++;
        if (step === oLis.length) {
            oUl.style.left = 0;
            step = 1;
        }
        animate(oUl, {left: step * -1000}, 800);
        window.setTimeout(autoLeft, 3000);
    }
    autoLeft();
})();

//关闭顶部广告横幅
~(function () {
    var tbc = document.getElementById("topbanner-close");
    on(tbc, "click", function () {
        document.getElementById("top-banner").style.display = "none";
    });
})();

//控制左侧楼层
~(function (window, undefined) {
    //获取楼层
    var elevator = DOM.children(document.getElementById("elevator"), "ul")[0];
    var currentAry = [];
    for (var i = 0; i < 12; i++) {
        currentAry.push(DOM.offset(document.getElementById("f" + (i + 1))).top);
    }

    on(window, "scroll", function () {
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        //到达F1显示
        if (scrollTop > DOM.offset(document.getElementById("f1")).top - 200) {
            elevator.style.display = "block";
        } else {
            elevator.style.display = "none";
        }

        if (scrollTop > DOM.offset(document.getElementById("f12")).top + 260) {
            elevator.style.display = "none";
        }
        //楼层间的切换
        for (var i = currentAry.length - 1; i >= 0; i--) {
            if (scrollTop > currentAry[i] - 200) {
                changeCurrent(i);
                return;
            }
        }
    });

    var oLis = DOM.children(elevator, "li");
    function changeCurrent(n) {
        for (var i = 0; i < oLis.length; i++) {
            DOM.removeClass(oLis[i], "current");
        }
        DOM.addClass(oLis[n], "current");
    }
})(window);

//1F选项卡
~(function () {
    var tab = document.getElementById("f1Tab");
    var oLis = DOM.children(tab, "li");
    var oDivs = DOM.getElesByClass("main",document.getElementById("f1Main"));
    for (var i=0;i<oLis.length;i++) {
        oLis[i].index = i;
        on(oLis[i], "mouseover", function () {
            DOM.addClass(this, "tab-selected");
            for (var j=0;j<oLis.length;j++) {
                DOM.removeClass(oLis[j], "tab-selected");
                DOM.removeClass(oDivs[j], "main-selected");
            }
            DOM.addClass(this, "tab-selected");
            DOM.addClass(oDivs[this.index], "main-selected");
        });
    }
})();