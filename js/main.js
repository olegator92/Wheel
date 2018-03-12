var LOCAL = (typeof LOCAL != 'undefined' ? LOCAL : false); // Среда выполнения скрипта: локально,  рабочий сервер
var SITE_ID = (typeof SITE_ID != 'undefined' ? SITE_ID : false); // ID сайта
var isIe = isIe7 = isMoz = isChrome = isNav = 0; // Браузер пользователя
var openAuthId = 0;
var MSIE = navigator.appVersion.indexOf("MSIE");
var SAFARI = navigator.userAgent.indexOf("Safari");
var MOZILLA = navigator.userAgent.indexOf("mozilla");
var manId = 0;
var isTouch = false; // Тачскрин или нет
var queuePopup = ''; // Очередь попапов, список URL

if (navigator.appName == 'Microsoft Internet Explorer') isIe = 1;
var ag = window.navigator.userAgent;
if (ag.indexOf('Chrome') > 0) isChrome = 1;

function mainOnLoad()
{
    Foundation.global.namespace = '';
    $(document).foundation();

    loadOwlCarouselIfNeed();

    // Show user menu
    if ($('#user-block').length) {
        $('#user-block').on('mouseenter', function () {
            $(this).removeClass('collapse');
        });
        $('#user-block').on('mouseleave', function () {
            $(this).addClass('collapse');
        });
        $('#user-block').on('click', function () {
            $(this).removeClass('collapse');
        });
    }

    setTimeout(function(){ showScroll(); }, 3000);

    showPopups();


    if (typeof ga != 'function') {
        // Загрушка Google Analytics
        window.ga = function (one, two, three) {
            console.log('GA not tracket event: ' + one + ', ' + two + ', ' + three);
        }
    }
//   // Smart play button
//   var menuOffset = 100,
//     detachPoint = $('.block-benefits').offset().top,
//     showElement = $('#play-button');

// // Show play button after user
//   $(window).scroll(function () {
//     if (!showElement.hasClass('expanded')) {
//       var currentScroll = $(this).scrollTop();

//       if (currentScroll > menuOffset) {
//         if (currentScroll > detachPoint) {
//           if (!showElement.hasClass('detached')) {
//             showElement.addClass('detached');
//           }
//         } else {
//           showElement.removeClass('detached');
//         }
//       }
//     }
//   });

    if (document.getElementById('advert') != null && document.getElementById('advertHide') != null)
    {   // Загрузка рекламы
        document.getElementById('advertHide').innerHTML = document.getElementById('advert').innerHTML;
        document.getElementById('advert').innerHTML = '';
    }

    if (document.getElementById('liveinternet') != null)
    {   // Счетчик liveinternet
        document.getElementById('liveinternet').innerHTML = '<img src="https://counter.yadro.ru/hit?t20.5;r'+
        escape(document.referrer)+((typeof(screen)=='undefined')?'':
        ';s'+screen.width+'*'+screen.height+'*'+(screen.colorDepth?
            screen.colorDepth:screen.pixelDepth))+';u'+escape(document.URL)+
        ';'+Math.random()+'" alt="" border="0" width="88" height="31" />';
    }

    if (document.getElementById('hit_ua') != null)
    {   // Счетчик hit.ua
        Cd=document;Cr="&"+Math.random();Cp="&s=1";Cd.cookie="b=b";if(Cd.cookie)Cp+="&c=1";Cp+="&t="+(new Date()).getTimezoneOffset();if(self!=top)Cp+="&f=1";

        document.getElementById('hit_ua').innerHTML = '<img src="//c.hit.ua/hit?i=123256&g=0&x=2'
        +Cp+Cr+'&r='+escape(Cd.referrer)+'&u='+escape(window.location.href)+'" border="0" width="1" height="1" />';
        //$.get('//db.c6.b3.a2.top.mail.ru/counter?id=2321289'); // Mail.RU counter
    }
    //if (typeof(timeNow) != 'undefined') {
    //$('#time_now').html(takeTime(timeNow, false));
    //setInterval("timeNow+=10; $('#time_now').html(takeTime(timeNow, false));", 10000); // Запускаем часы
    //}
    // FastClick for eliminating the 300ms delay between a physical tap and the firing of a `click` event on mobile browsers
    $(function() {
        if (typeof(FastClick) != 'undefined') {
            FastClick.attach(document.body);
        }
    });
}

if (!LOCAL)
{
    // Yandex.Metrika
    (function(w, d, c) {
        (w[c] = w[c] || []).push(function() {
            try {
                w.yaCounter = new Ya.Metrika({id: yaAccaunt, enableAll: true});
                yaMetrika.sendGoals();
            }
            catch(e) {}
        });

        var e = d.createElement('script');
        e.type = 'text/javascript';
        e.async = true;
        e.src = (d.location.protocol == 'https:' ? 'https:' : 'http:') + '//mc.yandex.ru/metrika/watch.js';
        var s = d.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(e, s);
    })(window, document, 'yandex_metrika_callbacks');
}

/**
 * Yandex.Metrika goals
 */
var yaMetrika = {
    goals: [],
    reachGoal: function(goalName) {
        this.goals.push(goalName);
        if (typeof yaCounter != 'undefined') {
            this.sendGoals();
        }
    },
    sendGoals: function() {
        for (var key in this.goals) {
            yaCounter.reachGoal(this.goals[key]);
        }
        this.goals = [];
    }
};

function pr(value)
{
    document.title = value;
}

/**
 * Нажатие CTRL+Enter, CMD+Enter - отправка формы
 * @param e
 * @param form
 * @return true
 */
function ctrlEnter(e, form)
{
    if ((e.keyCode == 13 || e.keyCode == 10) && (e.ctrlKey == true || e.metaKey)) form.submit();
    return true
}

function logMsg(file, str, isOffline)
{
    if (isOffline == null) isOffline = false;

    if (str == null) {str = file; file = 'log';}
    var params;
    if (typeof(str) != 'string')
    {
        if (typeof(str['url']) != 'undefined' && str['url'] == 'http://www.jsutils.net/analytics.js') return false; // Плагин от Firefox сыпит
        params = str.join('&');
    } else params = 'message=' + str;

    if (isOffline) params += '&offline=1';

    $.ajax({
        type: 'POST',
        url: 'https://' + document.location.hostname + '/log/save_msg?file=js_' + file + '&p=1',
        processData: false,
        data: params,
        dataType: 'text',
        cache: false,
        timeout: 10000,
        error: function() {

            var gameLogsQueue = memGet('gameLogsQueue');
            if (gameLogsQueue == null) gameLogsQueue = [];
            gameLogsQueue.push([file, str]);
            memSet('gameLogsQueue', gameLogsQueue);
        }
    });
    return true;
}

/**
 * Загрузка страницы через AJAX в элемент
 * @param obj
 * @return false
 */
function loadPage(obj, id, isPrivate)
{
    // TODO if (!id) id = 'main_content';
    // TODO добавить в ссылке .ajax
    var url;
    if (typeof(obj) != 'object') url = obj;
        else url = $(obj).attr('href');
    $.ajax({
        url: url,             // указываем URL и
        dataType : "html",                     // тип загружаемых данных
        success: function (data, textStatus) { // вешаем свой обработчик на функцию success
            if (data == 'reload') {document.location.reload(); return true;}
            if (isPrivate == true) { $('#load').hide(); $('#private_messages').html(data);}
                else $('#' + id).html(data);
        }
    });
    return false;
}

/**
 * Предварительная проверка формы
 * @param formId (id="form")
 * @param rules = { }
 * @param messages = { }
 */
function validateForm(formId, rules, messages)
{
    if (typeof(rules) == 'undefined') rules = { };
    if (typeof(messages) == 'undefined') messages = { };

    $(document).ready(function()
    {   // Валидация формы
        if (typeof(jQuery.validator) == 'undefined') return false;

        $('#' + formId).validate({
            rules: rules,
            errorPlacement: function(error, element) {
                var em = element.attr('name');
                $('#e_' + em).html(error.html()).removeClass('checked').addClass('error').show();
            },
            success: function(label) {
                var em = label.attr('for');
                $('#e_' + em).html('&nbsp;').removeClass('error').addClass('checked');
            },
            messages: messages
            //,
            //submitHandler: function(form) {
            //   jQuery(form).ajaxSubmit({
            //       target: "#result"
            //   });
            //}
        });
    });
}

/*! jQuery Validation Plugin - v1.11.1 - 3/22/2013\n* https://github.com/jzaefferer/jquery-validation
* Copyright (c) 2013 Jörn Zaefferer; Licensed MIT */(function(t){t.extend(t.fn,{validate:function(e){if(!this.length)return e&&e.debug&&window.console&&console.warn("Nothing selected, can't validate, returning nothing."),void 0;var i=t.data(this[0],"validator");return i?i:(this.attr("novalidate","novalidate"),i=new t.validator(e,this[0]),t.data(this[0],"validator",i),i.settings.onsubmit&&(this.validateDelegate(":submit","click",function(e){i.settings.submitHandler&&(i.submitButton=e.target),t(e.target).hasClass("cancel")&&(i.cancelSubmit=!0),void 0!==t(e.target).attr("formnovalidate")&&(i.cancelSubmit=!0)}),this.submit(function(e){function s(){var s;return i.settings.submitHandler?(i.submitButton&&(s=t("<input type='hidden'/>").attr("name",i.submitButton.name).val(t(i.submitButton).val()).appendTo(i.currentForm)),i.settings.submitHandler.call(i,i.currentForm,e),i.submitButton&&s.remove(),!1):!0}return i.settings.debug&&e.preventDefault(),i.cancelSubmit?(i.cancelSubmit=!1,s()):i.form()?i.pendingRequest?(i.formSubmitted=!0,!1):s():(i.focusInvalid(),!1)})),i)},valid:function(){if(t(this[0]).is("form"))return this.validate().form();var e=!0,i=t(this[0].form).validate();return this.each(function(){e=e&&i.element(this)}),e},removeAttrs:function(e){var i={},s=this;return t.each(e.split(/\s/),function(t,e){i[e]=s.attr(e),s.removeAttr(e)}),i},rules:function(e,i){var s=this[0];if(e){var r=t.data(s.form,"validator").settings,n=r.rules,a=t.validator.staticRules(s);switch(e){case"add":t.extend(a,t.validator.normalizeRule(i)),delete a.messages,n[s.name]=a,i.messages&&(r.messages[s.name]=t.extend(r.messages[s.name],i.messages));break;case"remove":if(!i)return delete n[s.name],a;var u={};return t.each(i.split(/\s/),function(t,e){u[e]=a[e],delete a[e]}),u}}var o=t.validator.normalizeRules(t.extend({},t.validator.classRules(s),t.validator.attributeRules(s),t.validator.dataRules(s),t.validator.staticRules(s)),s);if(o.required){var l=o.required;delete o.required,o=t.extend({required:l},o)}return o}}),t.extend(t.expr[":"],{blank:function(e){return!t.trim(""+t(e).val())},filled:function(e){return!!t.trim(""+t(e).val())},unchecked:function(e){return!t(e).prop("checked")}}),t.validator=function(e,i){this.settings=t.extend(!0,{},t.validator.defaults,e),this.currentForm=i,this.init()},t.validator.format=function(e,i){return 1===arguments.length?function(){var i=t.makeArray(arguments);return i.unshift(e),t.validator.format.apply(this,i)}:(arguments.length>2&&i.constructor!==Array&&(i=t.makeArray(arguments).slice(1)),i.constructor!==Array&&(i=[i]),t.each(i,function(t,i){e=e.replace(RegExp("\\{"+t+"\\}","g"),function(){return i})}),e)},t.extend(t.validator,{defaults:{messages:{},groups:{},rules:{},errorClass:"error",validClass:"valid",errorElement:"label",focusInvalid:!0,errorContainer:t([]),errorLabelContainer:t([]),onsubmit:!0,ignore:":hidden",ignoreTitle:!1,onfocusin:function(t){this.lastActive=t,this.settings.focusCleanup&&!this.blockFocusCleanup&&(this.settings.unhighlight&&this.settings.unhighlight.call(this,t,this.settings.errorClass,this.settings.validClass),this.addWrapper(this.errorsFor(t)).hide())},onfocusout:function(t){this.checkable(t)||!(t.name in this.submitted)&&this.optional(t)||this.element(t)},onkeyup:function(t,e){(9!==e.which||""!==this.elementValue(t))&&(t.name in this.submitted||t===this.lastElement)&&this.element(t)},onclick:function(t){t.name in this.submitted?this.element(t):t.parentNode.name in this.submitted&&this.element(t.parentNode)},highlight:function(e,i,s){"radio"===e.type?this.findByName(e.name).addClass(i).removeClass(s):t(e).addClass(i).removeClass(s)},unhighlight:function(e,i,s){"radio"===e.type?this.findByName(e.name).removeClass(i).addClass(s):t(e).removeClass(i).addClass(s)}},setDefaults:function(e){t.extend(t.validator.defaults,e)},messages:{required:"This field is required.",remote:"Please fix this field.",email:"Please enter a valid email address.",url:"Please enter a valid URL.",date:"Please enter a valid date.",dateISO:"Please enter a valid date (ISO).",number:"Please enter a valid number.",digits:"Please enter only digits.",creditcard:"Please enter a valid credit card number.",equalTo:"Please enter the same value again.",maxlength:t.validator.format("Please enter no more than {0} characters."),minlength:t.validator.format("Please enter at least {0} characters."),rangelength:t.validator.format("Please enter a value between {0} and {1} characters long."),range:t.validator.format("Please enter a value between {0} and {1}."),max:t.validator.format("Please enter a value less than or equal to {0}."),min:t.validator.format("Please enter a value greater than or equal to {0}.")},autoCreateRanges:!1,prototype:{init:function(){function e(e){var i=t.data(this[0].form,"validator"),s="on"+e.type.replace(/^validate/,"");i.settings[s]&&i.settings[s].call(i,this[0],e)}this.labelContainer=t(this.settings.errorLabelContainer),this.errorContext=this.labelContainer.length&&this.labelContainer||t(this.currentForm),this.containers=t(this.settings.errorContainer).add(this.settings.errorLabelContainer),this.submitted={},this.valueCache={},this.pendingRequest=0,this.pending={},this.invalid={},this.reset();var i=this.groups={};t.each(this.settings.groups,function(e,s){"string"==typeof s&&(s=s.split(/\s/)),t.each(s,function(t,s){i[s]=e})});var s=this.settings.rules;t.each(s,function(e,i){s[e]=t.validator.normalizeRule(i)}),t(this.currentForm).validateDelegate(":text, [type='password'], [type='file'], select, textarea, [type='number'], [type='search'] ,[type='tel'], [type='url'], [type='email'], [type='datetime'], [type='date'], [type='month'], [type='week'], [type='time'], [type='datetime-local'], [type='range'], [type='color'] ","focusin focusout keyup",e).validateDelegate("[type='radio'], [type='checkbox'], select, option","click",e),this.settings.invalidHandler&&t(this.currentForm).bind("invalid-form.validate",this.settings.invalidHandler)},form:function(){return this.checkForm(),t.extend(this.submitted,this.errorMap),this.invalid=t.extend({},this.errorMap),this.valid()||t(this.currentForm).triggerHandler("invalid-form",[this]),this.showErrors(),this.valid()},checkForm:function(){this.prepareForm();for(var t=0,e=this.currentElements=this.elements();e[t];t++)this.check(e[t]);return this.valid()},element:function(e){e=this.validationTargetFor(this.clean(e)),this.lastElement=e,this.prepareElement(e),this.currentElements=t(e);var i=this.check(e)!==!1;return i?delete this.invalid[e.name]:this.invalid[e.name]=!0,this.numberOfInvalids()||(this.toHide=this.toHide.add(this.containers)),this.showErrors(),i},showErrors:function(e){if(e){t.extend(this.errorMap,e),this.errorList=[];for(var i in e)this.errorList.push({message:e[i],element:this.findByName(i)[0]});this.successList=t.grep(this.successList,function(t){return!(t.name in e)})}this.settings.showErrors?this.settings.showErrors.call(this,this.errorMap,this.errorList):this.defaultShowErrors()},resetForm:function(){t.fn.resetForm&&t(this.currentForm).resetForm(),this.submitted={},this.lastElement=null,this.prepareForm(),this.hideErrors(),this.elements().removeClass(this.settings.errorClass).removeData("previousValue")},numberOfInvalids:function(){return this.objectLength(this.invalid)},objectLength:function(t){var e=0;for(var i in t)e++;return e},hideErrors:function(){this.addWrapper(this.toHide).hide()},valid:function(){return 0===this.size()},size:function(){return this.errorList.length},focusInvalid:function(){if(this.settings.focusInvalid)try{t(this.findLastActive()||this.errorList.length&&this.errorList[0].element||[]).filter(":visible").focus().trigger("focusin")}catch(e){}},findLastActive:function(){var e=this.lastActive;return e&&1===t.grep(this.errorList,function(t){return t.element.name===e.name}).length&&e},elements:function(){var e=this,i={};return t(this.currentForm).find("input, select, textarea").not(":submit, :reset, :image, [disabled]").not(this.settings.ignore).filter(function(){return!this.name&&e.settings.debug&&window.console&&console.error("%o has no name assigned",this),this.name in i||!e.objectLength(t(this).rules())?!1:(i[this.name]=!0,!0)})},clean:function(e){return t(e)[0]},errors:function(){var e=this.settings.errorClass.replace(" ",".");return t(this.settings.errorElement+"."+e,this.errorContext)},reset:function(){this.successList=[],this.errorList=[],this.errorMap={},this.toShow=t([]),this.toHide=t([]),this.currentElements=t([])},prepareForm:function(){this.reset(),this.toHide=this.errors().add(this.containers)},prepareElement:function(t){this.reset(),this.toHide=this.errorsFor(t)},elementValue:function(e){var i=t(e).attr("type"),s=t(e).val();return"radio"===i||"checkbox"===i?t("input[name='"+t(e).attr("name")+"']:checked").val():"string"==typeof s?s.replace(/\r/g,""):s},check:function(e){e=this.validationTargetFor(this.clean(e));var i,s=t(e).rules(),r=!1,n=this.elementValue(e);for(var a in s){var u={method:a,parameters:s[a]};try{if(i=t.validator.methods[a].call(this,n,e,u.parameters),"dependency-mismatch"===i){r=!0;continue}if(r=!1,"pending"===i)return this.toHide=this.toHide.not(this.errorsFor(e)),void 0;if(!i)return this.formatAndAdd(e,u),!1}catch(o){throw this.settings.debug&&window.console&&console.log("Exception occurred when checking element "+e.id+", check the '"+u.method+"' method.",o),o}}return r?void 0:(this.objectLength(s)&&this.successList.push(e),!0)},customDataMessage:function(e,i){return t(e).data("msg-"+i.toLowerCase())||e.attributes&&t(e).attr("data-msg-"+i.toLowerCase())},customMessage:function(t,e){var i=this.settings.messages[t];return i&&(i.constructor===String?i:i[e])},findDefined:function(){for(var t=0;arguments.length>t;t++)if(void 0!==arguments[t])return arguments[t];return void 0},defaultMessage:function(e,i){return this.findDefined(this.customMessage(e.name,i),this.customDataMessage(e,i),!this.settings.ignoreTitle&&e.title||void 0,t.validator.messages[i],"<strong>Warning: No message defined for "+e.name+"</strong>")},formatAndAdd:function(e,i){var s=this.defaultMessage(e,i.method),r=/\$?\{(\d+)\}/g;"function"==typeof s?s=s.call(this,i.parameters,e):r.test(s)&&(s=t.validator.format(s.replace(r,"{$1}"),i.parameters)),this.errorList.push({message:s,element:e}),this.errorMap[e.name]=s,this.submitted[e.name]=s},addWrapper:function(t){return this.settings.wrapper&&(t=t.add(t.parent(this.settings.wrapper))),t},defaultShowErrors:function(){var t,e;for(t=0;this.errorList[t];t++){var i=this.errorList[t];this.settings.highlight&&this.settings.highlight.call(this,i.element,this.settings.errorClass,this.settings.validClass),this.showLabel(i.element,i.message)}if(this.errorList.length&&(this.toShow=this.toShow.add(this.containers)),this.settings.success)for(t=0;this.successList[t];t++)this.showLabel(this.successList[t]);if(this.settings.unhighlight)for(t=0,e=this.validElements();e[t];t++)this.settings.unhighlight.call(this,e[t],this.settings.errorClass,this.settings.validClass);this.toHide=this.toHide.not(this.toShow),this.hideErrors(),this.addWrapper(this.toShow).show()},validElements:function(){return this.currentElements.not(this.invalidElements())},invalidElements:function(){return t(this.errorList).map(function(){return this.element})},showLabel:function(e,i){var s=this.errorsFor(e);s.length?(s.removeClass(this.settings.validClass).addClass(this.settings.errorClass),s.html(i)):(s=t("<"+this.settings.errorElement+">").attr("for",this.idOrName(e)).addClass(this.settings.errorClass).html(i||""),this.settings.wrapper&&(s=s.hide().show().wrap("<"+this.settings.wrapper+"/>").parent()),this.labelContainer.append(s).length||(this.settings.errorPlacement?this.settings.errorPlacement(s,t(e)):s.insertAfter(e))),!i&&this.settings.success&&(s.text(""),"string"==typeof this.settings.success?s.addClass(this.settings.success):this.settings.success(s,e)),this.toShow=this.toShow.add(s)},errorsFor:function(e){var i=this.idOrName(e);return this.errors().filter(function(){return t(this).attr("for")===i})},idOrName:function(t){return this.groups[t.name]||(this.checkable(t)?t.name:t.id||t.name)},validationTargetFor:function(t){return this.checkable(t)&&(t=this.findByName(t.name).not(this.settings.ignore)[0]),t},checkable:function(t){return/radio|checkbox/i.test(t.type)},findByName:function(e){return t(this.currentForm).find("[name='"+e+"']")},getLength:function(e,i){switch(i.nodeName.toLowerCase()){case"select":return t("option:selected",i).length;case"input":if(this.checkable(i))return this.findByName(i.name).filter(":checked").length}return e.length},depend:function(t,e){return this.dependTypes[typeof t]?this.dependTypes[typeof t](t,e):!0},dependTypes:{"boolean":function(t){return t},string:function(e,i){return!!t(e,i.form).length},"function":function(t,e){return t(e)}},optional:function(e){var i=this.elementValue(e);return!t.validator.methods.required.call(this,i,e)&&"dependency-mismatch"},startRequest:function(t){this.pending[t.name]||(this.pendingRequest++,this.pending[t.name]=!0)},stopRequest:function(e,i){this.pendingRequest--,0>this.pendingRequest&&(this.pendingRequest=0),delete this.pending[e.name],i&&0===this.pendingRequest&&this.formSubmitted&&this.form()?(t(this.currentForm).submit(),this.formSubmitted=!1):!i&&0===this.pendingRequest&&this.formSubmitted&&(t(this.currentForm).triggerHandler("invalid-form",[this]),this.formSubmitted=!1)},previousValue:function(e){return t.data(e,"previousValue")||t.data(e,"previousValue",{old:null,valid:!0,message:this.defaultMessage(e,"remote")})}},classRuleSettings:{required:{required:!0},email:{email:!0},url:{url:!0},date:{date:!0},dateISO:{dateISO:!0},number:{number:!0},digits:{digits:!0},creditcard:{creditcard:!0}},addClassRules:function(e,i){e.constructor===String?this.classRuleSettings[e]=i:t.extend(this.classRuleSettings,e)},classRules:function(e){var i={},s=t(e).attr("class");return s&&t.each(s.split(" "),function(){this in t.validator.classRuleSettings&&t.extend(i,t.validator.classRuleSettings[this])}),i},attributeRules:function(e){var i={},s=t(e),r=s[0].getAttribute("type");for(var n in t.validator.methods){var a;"required"===n?(a=s.get(0).getAttribute(n),""===a&&(a=!0),a=!!a):a=s.attr(n),/min|max/.test(n)&&(null===r||/number|range|text/.test(r))&&(a=Number(a)),a?i[n]=a:r===n&&"range"!==r&&(i[n]=!0)}return i.maxlength&&/-1|2147483647|524288/.test(i.maxlength)&&delete i.maxlength,i},dataRules:function(e){var i,s,r={},n=t(e);for(i in t.validator.methods)s=n.data("rule-"+i.toLowerCase()),void 0!==s&&(r[i]=s);return r},staticRules:function(e){var i={},s=t.data(e.form,"validator");return s.settings.rules&&(i=t.validator.normalizeRule(s.settings.rules[e.name])||{}),i},normalizeRules:function(e,i){return t.each(e,function(s,r){if(r===!1)return delete e[s],void 0;if(r.param||r.depends){var n=!0;switch(typeof r.depends){case"string":n=!!t(r.depends,i.form).length;break;case"function":n=r.depends.call(i,i)}n?e[s]=void 0!==r.param?r.param:!0:delete e[s]}}),t.each(e,function(s,r){e[s]=t.isFunction(r)?r(i):r}),t.each(["minlength","maxlength"],function(){e[this]&&(e[this]=Number(e[this]))}),t.each(["rangelength","range"],function(){var i;e[this]&&(t.isArray(e[this])?e[this]=[Number(e[this][0]),Number(e[this][1])]:"string"==typeof e[this]&&(i=e[this].split(/[\s,]+/),e[this]=[Number(i[0]),Number(i[1])]))}),t.validator.autoCreateRanges&&(e.min&&e.max&&(e.range=[e.min,e.max],delete e.min,delete e.max),e.minlength&&e.maxlength&&(e.rangelength=[e.minlength,e.maxlength],delete e.minlength,delete e.maxlength)),e},normalizeRule:function(e){if("string"==typeof e){var i={};t.each(e.split(/\s/),function(){i[this]=!0}),e=i}return e},addMethod:function(e,i,s){t.validator.methods[e]=i,t.validator.messages[e]=void 0!==s?s:t.validator.messages[e],3>i.length&&t.validator.addClassRules(e,t.validator.normalizeRule(e))},methods:{required:function(e,i,s){if(!this.depend(s,i))return"dependency-mismatch";if("select"===i.nodeName.toLowerCase()){var r=t(i).val();return r&&r.length>0}return this.checkable(i)?this.getLength(e,i)>0:t.trim(e).length>0},email:function(t,e){return this.optional(e)||/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(t)},url:function(t,e){return this.optional(e)||/^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(t)},date:function(t,e){return this.optional(e)||!/Invalid|NaN/.test(""+new Date(t))},dateISO:function(t,e){return this.optional(e)||/^\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}$/.test(t)},number:function(t,e){return this.optional(e)||/^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(t)},digits:function(t,e){return this.optional(e)||/^\d+$/.test(t)},creditcard:function(t,e){if(this.optional(e))return"dependency-mismatch";if(/[^0-9 \-]+/.test(t))return!1;var i=0,s=0,r=!1;t=t.replace(/\D/g,"");for(var n=t.length-1;n>=0;n--){var a=t.charAt(n);s=parseInt(a,10),r&&(s*=2)>9&&(s-=9),i+=s,r=!r}return 0===i%10},minlength:function(e,i,s){var r=t.isArray(e)?e.length:this.getLength(t.trim(e),i);return this.optional(i)||r>=s},maxlength:function(e,i,s){var r=t.isArray(e)?e.length:this.getLength(t.trim(e),i);return this.optional(i)||s>=r},rangelength:function(e,i,s){var r=t.isArray(e)?e.length:this.getLength(t.trim(e),i);return this.optional(i)||r>=s[0]&&s[1]>=r},min:function(t,e,i){return this.optional(e)||t>=i},max:function(t,e,i){return this.optional(e)||i>=t},range:function(t,e,i){return this.optional(e)||t>=i[0]&&i[1]>=t},equalTo:function(e,i,s){var r=t(s);return this.settings.onfocusout&&r.unbind(".validate-equalTo").bind("blur.validate-equalTo",function(){t(i).valid()}),e===r.val()},remote:function(e,i,s){if(this.optional(i))return"dependency-mismatch";var r=this.previousValue(i);if(this.settings.messages[i.name]||(this.settings.messages[i.name]={}),r.originalMessage=this.settings.messages[i.name].remote,this.settings.messages[i.name].remote=r.message,s="string"==typeof s&&{url:s}||s,r.old===e)return r.valid;r.old=e;var n=this;this.startRequest(i);var a={};return a[i.name]=e,t.ajax(t.extend(!0,{url:s,mode:"abort",port:"validate"+i.name,dataType:"json",data:a,success:function(s){n.settings.messages[i.name].remote=r.originalMessage;var a=s===!0||"true"===s;if(a){var u=n.formSubmitted;n.prepareElement(i),n.formSubmitted=u,n.successList.push(i),delete n.invalid[i.name],n.showErrors()}else{var o={},l=s||n.defaultMessage(i,"remote");o[i.name]=r.message=t.isFunction(l)?l(e):l,n.invalid[i.name]=!0,n.showErrors(o)}r.valid=a,n.stopRequest(i,a)}},s)),"pending"}}}),t.format=t.validator.format})(jQuery),function(t){var e={};if(t.ajaxPrefilter)t.ajaxPrefilter(function(t,i,s){var r=t.port;"abort"===t.mode&&(e[r]&&e[r].abort(),e[r]=s)});else{var i=t.ajax;t.ajax=function(s){var r=("mode"in s?s:t.ajaxSettings).mode,n=("port"in s?s:t.ajaxSettings).port;return"abort"===r?(e[n]&&e[n].abort(),e[n]=i.apply(this,arguments),e[n]):i.apply(this,arguments)}}}(jQuery),function(t){t.extend(t.fn,{validateDelegate:function(e,i,s){return this.bind(i,function(i){var r=t(i.target);return r.is(e)?s.apply(r,arguments):void 0})}})}(jQuery);



// http://jquerytools.org/download/
/*
 * Translated default messages for the jQuery validation plugin.
 * Locale: RU
 */
jQuery.extend(jQuery.validator.messages, {
    required: "Это поле необходимо заполнить.",
    remote: "Исправьте это поле чтобы продолжить.",
    email: "Введите правильный email адрес.",
    url: "Введите верный URL.",
    date: "Введите правильную дату.",
    number: "Введите число.",
    digits: "Введите только цифры.",
    equalTo: "Повторите ввод значения еще раз.",
    accept: "Пожалуйста, выберите файл с правильным расширением.",
    maxlength: jQuery.format("Нельзя вводить более {0} символов."),
    minlength: jQuery.format("Должно быть не менее {0} символов."),
    rangelength: jQuery.format("Введите от {0} до {1} символов."),
    range: jQuery.format("Введите число от {0} до {1}."),
    max: jQuery.format("Введите число меньше или равное {0}."),
    min: jQuery.format("Введите число больше или равное {0}.")
});


// Собственно, сам наш обработчик
function myErrHandler(message, url, line, column, errorObj)
{
    var params = 'message=' + message + '&url=' + url + '&line=' + line + '&user_agent=' + navigator.userAgent + '&p=1' + '&ya=' + typeof yaAccaunt + '&ga=' + typeof _gaqAccaunt;
    params += '&stack=' + errorObj.stack;
    params += '&site_id=' + SITE_ID;

    if (typeof currentUrl != 'undefined') params += '&curr_url=' + currentUrl;

    $.ajax({
        type: 'POST',
        url: 'https://' + document.location.hostname + '/log/save_msg',
        processData: false,
        data: params,
        dataType: "text",
        success: function (data, textStatus, XMLHttpRequest) { // В случае успешного запроса
        }
    });
    // Чтобы подавить стандартный диалог ошибки JavaScript,
    // функция должна возвратить true
    return true;
}
// назначаем обработчик для события onerror
//window.onerror = myErrHandler;

function print_r(arr, level)
{
    var print_red_text = "";
    if(!level) level = 0;
    var level_padding = "";
    for(var j=0; j<level+1; j++) level_padding += "    ";
    if (typeof(arr) == 'object') {
        for(var item in arr) {
            var value = arr[item];
            if(typeof(value) == 'object') {
                //print_red_text += level_padding + "'" + item + "' :\n";
                //print_red_text += print_r(value,level+1);
            }
            else
                print_red_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
        }
    } else print_red_text = "===>"+arr+"<===("+typeof(arr)+")";
    return print_red_text;
}

function tableToggle(key)
{
    if (!isClub) {
        sticker({note:'Опция скрытия списка заявок доступна только для <a href="/user/club" target="_blank">членов клуба</a>.'});
        return false;
    }
    memGet(key) == 'show' ? memSet(key, 'hide') : memSet(key, 'show');
    $('#class_' + key).toggleClass('up');
    $('#class_' + key).html($('#class_' + key).hasClass('up') ? '&#9650;' : '&#9660;'); // up/down traingle
    $('#toggle_' + key).toggle();
    $('#count_' + key).toggle();
    return false;
}

/**
 * Всплывающие сообщения
 */
function sticker(o)
{
    var o = $.extend({   // настройки по умолчанию
            time:5000, // количество мс, которое отображается сообщение
            speed:'slow', // скорость исчезания
            note:null, // текст сообщения
            className:null, // класс, добавляемый к сообщению
            sticked:false, // не выводить кнопку закрытия сообщения
            position:{bottom:'10px',left:'10px'} // позиция по умолчанию - справа сверху
        }, o);
        var stickers = $('#jquery-stickers'); // начинаем работу с главным элементом
        if (!stickers.length) { // если его ещё не существует
            $('#body').prepend('<div id="jquery-stickers"></div>'); // добавляем его
            var stickers = $('#jquery-stickers');
        }
        stickers.css('position','fixed').css({right:'auto',left:'auto',top:'auto',bottom:'auto'}).css(o.position); // позиционируем
        var stick = $('<div class="stick alert-box warning radius" data-alert></div>'); // создаём стикер
        stickers.append(stick); // добавляем его к родительскому элементу
        if (o.className) stick.addClass(o.className); // если необходимо, добавляем класс
        stick.html(o.note); // вставляем сообщение

        var exit = $('<a href="#" class="close">&times;</a>');  // создаём кнопку выхода
        stick.prepend(exit); // вставляем её перед сообщением
        exit.click(function(){  // при клике
            stick.fadeOut(o.speed,function(){ // скрываем стикер
                $(this).remove(); // по окончании анимации удаляем его
            })
        });

        if (!o.sticked) {
            setTimeout(function(){ // устанавливаем таймер на необходимое время
                stick.fadeOut(o.speed,function(){ // затем скрываем стикер
                    $(this).remove(); // по окончании анимации удаляем его
                });
            }, o.time);
        }
}
function takeTime(time, showSec)
{   // Извлечение строки времени отправки сообщения в соответствии с часовым поясом
    if (showSec == undefined) showSec = true;
    time_z = Math.abs(time) + timeZone*60*60;
    hours = Math.floor(time_z/60/60); hours_s = hours;
    minut = Math.floor((time_z - hours*60*60)/60); minut_s = minut;
    sec = Math.round(time_z - hours*60*60 - minut*60); sec_s = sec;
    if (hours < 0) hours_s = 24 + hours;
    if (hours > 23) hours_s = hours - 24;
    if (hours_s < 10) hours_s = '0' + hours_s;
    if (minut < 10) minut_s = '0' + minut;
    if (sec < 10) sec_s = '0' + sec;
    var str = hours_s + ':' + minut_s;
    if (showSec) str += ':' + sec_s;
    return str;
}

function showScroll()
{
    $('#body').append('<div id="scrollup" class="button round tiny hide-on-small"><span class="icon-arrow-up2 font-medium"></span></div>');

    $.fn.scrollToTop=function(){

        if($(window).scrollTop() > "300")
        {
            $(this).fadeIn("slow");
        }
        var scrollDiv=$(this);
        $(window).scroll(function(){
            if($(window).scrollTop() <= "300")
            {
                $(scrollDiv).fadeOut("slow")
            } else {
                $(scrollDiv).fadeIn("slow")
            }
        });
        $(this).click(function(){
            $("html, body").animate({scrollTop:0},"slow");
        });
    };

    $("#scrollup").scrollToTop();
}

function gid(id)
{   // Сокращенная запись
    return document.getElementById(id);
}
function showPopups(count)
{
    if (typeof count == 'undefined') count = 0;
    if (queuePopup == '') return;
    var queue = queuePopup.split(',');
    if (count >= queue.length) return;
    var obj = $('#top');

    obj.attr('href', '/show_popup?url=' + urlencode(queue[count]));
    obj.removeClass('modal');

    this.showPage(obj);
    $(document).off('closed.fndtn.reveal').on('closed.fndtn.reveal', '[data-reveal]', {count: count + 1}, function (e) {
        showPopups(e.data.count);
    });
}

/**
 * Displays queue of modal popups one after another
 */
window.modalQueue =  {
    queue: [],
    current: 0,
    /**
     * Add elements into queue
     * @param id
     */
    addQueue: function (id) {
        this.queue.push(id);
    },
    show: function() {
        $('#' + this.queue[this.current]).modal('show');
    },
    showNext: function() {
        this.current++;
        $('#' + this.queue[this.current]).modal('show');
    },
    /**
     * runs all popups in queue
     */
    runQueue: function () {
        for(var i=0; i < this.queue.length; i++) {
            if (i == 0) {
                this.show();
            }
            else {
                $('#' + this.queue[i-1]).on('hidden.bs.modal', function (e) {
                    window.modalQueue.showNext();
                });
            }
        }
    }
};


function connectLink()
{
    var m = 'connect@' + document.location.host;

    //var m = 'connect@azartclub.net';
    var connect = $('#connect');
    connect.html(m);
    connect.attr('href', 'mail' + 'to:' + m);
    connect.removeAttr('onclick');

    return false;
}

foundationRevealOpened = false;

/**
 * Отображение всплывающей страницы
 * @param obj
 * @return false
 */
function showPage(obj)
{
    var url = $(obj).attr('href');

    /**
     * @see http://foundation.zurb.com/docs/components/reveal.html
     */
    var modalSize = $(obj).data('size') || 'medium';

    var sysModal = $('#sysModal');
    if (sysModal.length > 0) {
        sysModal.remove();
    }
    $('#body').append('<div id="sysModal" class="reveal-modal ' +  modalSize  + '" data-reveal></div>'); // style="padding1:0"

    sysModal = $('#sysModal');

    var padding = ($(obj).hasClass('no-padding') ? '0' : '1.25rem');
    sysModal.css('padding', padding);

    // Fire our modal window
    sysModal.foundation('reveal', 'open', {
        url: url
    });

    // Add close button to modal window
    if (!foundationRevealOpened) {
        foundationRevealOpened = true;

        $(document).on('opened.fndtn.reveal', '[data-reveal]', function (e) {
            var modal = $(this);
            modal.css('top', Math.round(screen.availHeight / 2 - parseInt(modal.css('height')) / 2));
            modal.css('position', 'fixed');

            if (! $('.close-reveal-modal', this).length) {
                modal.append('<a class="close-reveal-modal">&#215;</a>');

                $(modal).foundation('tooltip'); // Переинициализация tooltip
            }

            //$('.modal-close', modal).on('click', function () {
            //    $('.modal').foundation('reveal', 'close');
            //});
        });
    }

    return false;
}

function loadOwlCarouselIfNeed()
{
    var owlCarousel = $("#owl-carousel--main");
    var owlCarouselComments = $('#owl-carousel--comments');

    if (! owlCarousel.length && ! owlCarouselComments.length) {
        return false;
    }

    // Run Main Slider
    $.getScript('/js/lib/owl.carousel.min.js', function(data, textStatus, jqxhr) {

        if (owlCarousel.length) {
            owlCarousel.owlCarousel({
                items: 1,
                responsive: true,
                autoheight: true,
                dots: true
            });
        }

        // Run comment slider
        if (owlCarouselComments.length) {
            owlCarouselComments.owlCarousel({
                items: 1,
                center: true,
                loop: true,
                autoplay: true,
                autoplayHoverPause: true
            });
        }
    });
    return true;
}

function urldecode(str)
{
  return decodeURIComponent((str + '')
    .replace(/%(?![\da-f]{2})/gi, function() {
      // PHP tolerates poorly formed escape sequences
      return '%25';
    })
    .replace(/\+/g, '%20'));
}

function urlencode(str)
{
  str = (str + '').toString();
  return encodeURIComponent(str)
    .replace(/!/g, '%21')
    .replace(/'/g, '%27')
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29')
    .replace(/\*/g, '%2A')
    .replace(/%20/g, '+');
}

if (typeof localEvent == 'undefined') {
    function localEvent(category, action, label, value, isUnique) {
        if (isUnique) {
            var hash = category + action + label + value;

            if (typeof window.localEvents == 'undefined') {
                window.localEvents = [];
            }
            if (typeof window.localEvents[hash] != 'undefined') {
                return false;
            }
            window.localEvents[hash] = 1;
        }

        $.get('/callback/track_local_event?p=1&category=' + category + '&action=' + action + '&label=' + label + '&value=' + value + '&isUnique=' + isUnique);
        return true;
    }
}

function showUserCabinet()
{
    // Копирование меню, которое находится в блоке невидимого для телефонов
    $('#body').append($('#drop-cabinet-menu'));
}

// Modernizr emulation
(function() {
    if (gid('css-tests') == null) $('#html').append('<div id="css-tests"></div>');

    var isTouch = false;
    if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
        isTouch = true;
    }

    var csstransitions = false;
    gid('css-tests').style.transition = 'width 1s';
    if (gid('css-tests').style.transition != '') csstransitions = true;

    window.Modernizr = {
        touch: isTouch,
        csstransitions: csstransitions
    };

    $('#html').addClass((document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image", "1.1") ? 'svg' : 'no-svg'));
})();

function log(text)
{
    if (typeof console == 'undefined') {
        return false;
    }
    console.log(text);
}

$(window).load(mainOnLoad);