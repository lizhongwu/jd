//控制扫码登陆
;
(function () {
    var qrcodeBtn = document.getElementById("qrcodeBtn");
    var qrcodeLogin = DOM.getElesByClass("qrcode-login")[0];
    var loginBox = DOM.getElesByClass("login-box")[0];
    var flag = true;

    qrcodeBtn.onclick = function () {
        if (flag) {
            loginBox.style.display = "none";
            qrcodeLogin.style.display = "block";
            qrcodeBtn.style.backgroundPosition = "0 -60px";
            flag = false;
        } else {
            loginBox.style.display = "block";
            qrcodeLogin.style.display = "none";
            qrcodeBtn.style.backgroundPosition = "";
            flag = true;
        }

    };

    var refreshQrcode = document.getElementById("refreshQrcode");
    var imgQrcode = document.getElementById("imgQrcode");
    var showCount = 1;
    refreshQrcode.onclick = function () {
        showCount++;
        if (showCount === 4) {
            showCount = 1;
        }
        imgQrcode.setAttribute("src", "images/login/show" + showCount + ".png");
    };
})();

//登陆
;
(function () {
    var msgWarn = DOM.getElesByClass("msg-warn")[0];
    var msgError = DOM.getElesByClass("msg-error")[0];

    var loginSubmit = document.getElementById("loginsubmit");
    var loginname = document.getElementById("loginname");
    var nloginpwd = document.getElementById("nloginpwd");
    loginSubmit.onclick = function () {
        var valName = loginname.value;
        var valPass = nloginpwd.value;

        if (valName.length && valPass.length) {
            showError("请输入账户名和密码");
        }

        if (valName.length <= 0) {
            showError("请输入账户名");
        }

        if (valPass.length <= 0) {
            showError("请输入密码");
        }

        if (valName !== "test" || valPass !== "123456") {
            showError("账户名与密码不匹配，请重新输入");
        } else {
            window.location.href = "index.html?checkSuccess=true";
        }

        function showError(str) {
            DOM.addClass(msgWarn, "hide");
            DOM.removeClass(msgError, "hide");
            msgError.style.display = "block";
            msgError.innerHTML = "<b></b>" + str;
            return false;
        }

    }
})();

//大小写
;
(function () {
    var pass = document.getElementById("nloginpwd");
    pass.onkeypress = detectCapsLock;
    function detectCapsLock(e) {
        var e = e || window.event;
        var oTip = DOM.getElesByClass("capslock")[0];
        var keyCode = e.keyCode || e.which; // 按键的keyCode
        var isShift = e.shiftKey || (keyCode == 16 ) || false; // shift键是否按住
        if (
            ((keyCode >= 65 && keyCode <= 90 ) && !isShift) // Caps Lock 打开，且没有按住shift键
            || ((keyCode >= 97 && keyCode <= 122 ) && isShift)// Caps Lock 打开，且按住shift键
        ) {
            oTip.style.display = 'block';
        }
        else {
            oTip.style.display = 'none';
        }
    }
})();