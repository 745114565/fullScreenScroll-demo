(function ($) {

	var _prefix = (function(temp){
		var aPrefix = ['webkit','Moz','o','ms'],
			props = '';
		for (var i in aPrefix) {
			props = aPrefix[i] + 'Transition';
			if(temp.style[props] !== undefined){
				return '-' + aPrefix[i].toLowerCase() + '-';
			} 
		}

	})()
	var privateFun = function () {
		// 私有方法
	}
	// 插件构造方法
	var PageSwitch = (function () {
		function PageSwitch(element,options) {
			this.settings = $.extend(true,$.fn.PageSwitch.default,options||{});
			this.element = element;
			this.init();
		}
		PageSwitch.prototype = {
			/*说明：初始化插件*/
			/*实现初始化dom结构，布局，分页及绑定事件*/
			init : function () {
				var me = this;
				me.selectors = me.settings.selectors;
				me.sections = me.selectors.sections;
				me.section = me.selectors.section;

				me.duration = me.settings.duration == 'vertical' ? true:false;
				me.pagesCount = me.pagesCount();
				me.index = (me.settings.index >= 0 && me.settings.index <= pagesCount)?me.settings.index : 0; 

				if(me.duration){
					me._initLayout();
				}
				if(me.settings.pagination){
					me._initPaging();
				}


				me._initEvent();
			},
			/*说明：获取滑动页面数量*/
			pagesCount : function () {
				return this.section.length;
				// body...
			},
			/*说明：获取滑动的宽度（横屏滑动）或高度（竖屏滑动）*/
			switchLength : function () {
				return this.direction ? this.element.height : this.element.width
			},
			prev : function(){
				var me = this;
				if(me.index > 0){
					me.index--;
				}
				else if (me.settings.loop) {
					me.index = me.pagesCount - 1;
				}
				me._scrollPage();
			},
			next : function(){
				var me = this;
				if(me.index < me.pagesCount){
					me.index ++;
				}else if (me.settings.loop) {
					me.index = 0;
				}
				me._scrollPage();
			},
			/*说明：主要正对横屏情况进行页面布局*/
			_initLayout : function () {
				var me = this;
				var width = (me.pagesCount * 100) + '%';
				cellWidth = (100/me.pagesCount).toFixed(2)+'%';
				me.sections.width(width);
				me.section.width(cellWidth).css('float','left');
			},
			/*说明：实现分页的dome结构及css样式*/
			_initPaging : function () {
				var me = this,
					pageClass = me.selectors.page.substring(1),
					activeClass = me.selectors.active.substring(1);
				var pageHtml = '<ul class=' + pageClass + '>';
				for (var i = 0; i < me.pagesCount; i++) {
					
					pageHtml += '<li></li>';
				}
				me.element.append(pageHtml);
				var pages = me.element.find(me.selectors.page);
				me.pageItem = pages.find('li');
				me.pageItem.eq(me.index).addClass(me.activeClass);

				if(me.direction){
					pages.addClass('vertical');
				}else{
					pages.addClass('herizontal');
				}
			},
			/*说明：初始化插件事件*/
			_initEvent : function () {
				// 分页事件
				var me = this;
				me.element.on('click',me.selectors.pages + 'li',function () {
					me.index = $(this).index();
					me._scrollPage();
				})

				// 绑定鼠标滚轮事件
				me.element.on('mouseswheel DOMMouseScroll',function(e){
					var della = e.originalEvent.wheelDalta || -e.originalEvent.detail;
					if(della > 0 && (me.index && !me.settings.loop|| me.settings.loop)){
						me.prev();
					}else if(della < 0 && (me.index < (me.pagesCount -1) && !me.settings.loop || me.settings.loop )){
						me.next();
					}

				})

				// 键盘方向键事件
				if (me.settings.keybord) {
					$(window).on('keydown',function(e){
						var keyCode = e.keyCode;
						if(keyCode == 37 || keyCode == 38){
							me.prev();
						}else if(keyCode == 39 || keyCode ==40){
							me.next();
						}
					});
				}

				// 浏览器窗口大小改变后。windown.resize()事件
				%(window).resize(function(){
					var currentlength= me.switchLength(),
						offset = me.settings.direction?me.section.eq(me.index).offset.top:me.section.eq(me.index).offset().left;
					if(Math.abs(offset) > currentlength/2 && me.index <(me.pagesCount -1)){
						me.index++;
					}
					if(me.index){
						me._scrollPage();
					}

				});

				// transitionend 事件
				me.sections.on('transitionend webkitTransitionEnd oTransitionEnd otransitionend',function(){
					if(me.settings.callback && type(me.settings.callback) == 'function'){
						me.settings.callback();
					}
				})

			}
		}

		return PageSwitch;
	})();


	// jQuery插件挂载
	$.fn.PageSwitch = function (options) {
		return this.each(function () {
			var me = $(this),
				instance = me.data('PageSwitch');
			if(!instance){
				instance = new PageSwitch(me,options);
				me.data('PageSwitch',instance);
			}
			if($.type(options)==='string') return instance[options]();
			// $('div').PageSwitch('init');
		});

	}

	// 插件默认参数
	$.fn.PageSwitch.default = {
		selectors : {
			sections : 'sections',
			section : 'section',
			page : '.pages',
			active : '.active'
		},
		index : 0,
		easing : 'ease',
		duration : 500,
		loop : false,
		pagination : true,
		keybord : true,
		direction : 'vertical',//竖屏 herizontal
		callback : ''
	}

	//在标签上初始化插件 如：<div  data-PageSwitch></div>
	$(function () {
		$('[data-PageSwitch]').PageSwitch();
	})
})(jQuery);