(function ($) {

	var _prefix = (function(temp){
		console.dir(temp);
		var aPrefix = ['webkit','Moz','o','ms'],
			props = '';
		for (var i in aPrefix) {
			props = aPrefix[i] + 'Transition';
			if(temp.style[props] !== undefined){
				return '-' + aPrefix[i].toLowerCase() + '-';
			} 
		}

	})(document.createElement(PageSwitch));

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
				console.log('初始化插件-------------------------开始----------------------');
				var me = this;
				me.selectors = me.settings.selectors;
				me.sections = me.element.find(me.selectors.sections);
				me.section = me.sections.find(me.selectors.section);

				me.direction = me.settings.direction == 'vertical' ? true:false;
				me.pagesCount = me.pagesCount();
				me.index = (me.settings.index >= 0 && me.settings.index <= me.pagesCount)?me.settings.index : 0; 

				me.canScroll = true;

				if(!me.direction || me.index){
					me._initLayout();
				}
				if(me.settings.pagination){
					me._initPaging();
				}


				me._initEvent();
				console.log('初始化插件-------------------------结束----------------------');

			},
			/*说明：获取滑动页面数量*/
			pagesCount : function () {
				return this.section.length;
				// body...
			},
			/*说明：获取滑动的宽度（横屏滑动）或高度（竖屏滑动）*/
			switchLength : function () {
				return this.direction == true ? this.element.height : this.element.width
			},

			/*向上（前）滑动一页*/
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

			/*向下（后）滑动一页*/
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
				console.log('开始布局----------------------');
				var me = this;
				if(!me.direction){
					var width = (me.pagesCount * 100) + '%',
						cellWidth = (100/me.pagesCount).toFixed(2)+'%';

					me.sections.width(width);
					me.section.width(cellWidth).css('float','left');
				}
				if(me.index){
					me._scrollPage(true);
				}
				
			},
			/*说明：实现分页的dome结构及css样式*/
			_initPaging : function () {
				console.log('初始化分页----------------------');
				var me = this,
					pageClass = me.selectors.page.substring(1);
					me.activeClass = me.selectors.active.substring(1);
				var pageHtml = '<ul class=' + pageClass + '>';
				for (var i = 0; i < me.pagesCount; i++) {
						pageHtml += '<li></li>';
					}
				pageHtml += '</ul>';
				console.log(pageHtml);
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
				// 分页绑定点击事件
				var me = this;
				me.element.on('click',me.selectors.page + ' li',function () {
					me.index = $(this).index();
					me._scrollPage();
				})

				// 绑定鼠标滚轮事件
				me.element.on('mousewheel DOMMouseScroll',function(e){
					e.preventDefault();
					var delta = e.originalEvent.wheelDelta || -e.originalEvent.detail;
					if(me.canScroll){
						if(delta > 0 && (me.index && !me.settings.loop|| me.settings.loop)){
							me.prev();
						}else if(delta < 0 && (me.index < (me.pagesCount -1) && !me.settings.loop || me.settings.loop )){
							me.next();
						}	
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
				/*为了不频繁的调用resize的回调放大，做延迟*/
				var resizeId;
				$(window).resize(function(){
					clearTimeout(resizeId);
					resizeId = setTimeout(function () {
						var currentlength= me.switchLength(),
						offset = me.settings.direction?me.section.eq(me.index).offset().top:me.section.eq(me.index).offset().left;
						if(Math.abs(offset) > currentlength/2 && me.index < (me.pagesCount -1)){
							me.index++;
						}
						if(me.index){
							me._scrollPage();
						}
					},500);
				});

				// transitionend 事件
				if(_prefix){
					me.sections.on('transitionend webkitTransitionEnd oTransitionEnd otransitionend',function(){
						me.canScroll = true;
						if(me.settings.callback && type(me.settings.callback) == 'function'){
							me.settings.callback();
						}
					});
				}
			},

			/*说明：滑动动画*/
			_scrollPage : function(init){
				console.log('页面滑动了-----------------------------------');
				var me = this;
				var	dest = me.section.eq(me.index).position();
				if(!dest) return;
				
				me.canScroll = false;
				if(_prefix){
					me.sections.css(_prefix + 'transition','all' + me.settings.duration + 'ms' + me.settings.easing);
					var translate = me.direction ? 'translateY(-' + dest.top + 'px)' : 'translateX(-' + dest.left + 'px)';
					me.sections.css(_prefix + 'transform',translate);
				}else{
					var animateCss = me.direction ? {top : -dest.top} : {left : -dest.left};
					me.sections.animate(animateCss,me.settings.duration,function(){
						me.canScroll = true;
						if(me.settings.callback && $.type(me.settings.callback) == 'function'){
							me.settings.callback();
						}
					});
				}

				if(me.settings.pagination && !init){
					me.pageItem.eq(me.index).addClass(me.activeClass).siblings('li').removeClass(me.activeClass);
				}
			}
		};

		return PageSwitch;
	})();


	// jQuery插件挂载
	$.fn.PageSwitch = function (options) {
		console.log('挂在成功！--------------------------------')
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
			sections : '.sections',
			section : '.section',
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