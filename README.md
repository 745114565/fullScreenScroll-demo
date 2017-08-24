fullScreenScroll-demo

the demo is a jquery plugin which implements full screen scroll

Abstract

- 去掉滚动条后，页面就不能滚动了

       overflow: hidden; /*取掉滚动条 */

- 闭包的作用

      (function($){
       //do something
      })(jQuery)
      
      //1.避免全局依赖
      //2.避免第三方破坏
      //3.兼容jQuery操作符‘$’和jQuery

- 开发方式
  1.类级别组件开发
  	即给jQuery命名空间下添加新的全局函数，也称为静态方法。

    jQuery.myPlugin = function(){
      //do something
     }
    // 

      例如：$.Ajax()、$.extend()

	 2.对象级别组件开发

   		即挂载在jQuery原型吓得方法，这样通过选择器获取的jQuery对象实例也能共享该方法，也称为动态方法。

    $.fn.myPlungin = function(){
       //do something
    };
       //这里的$.fn === $.prototype

    例如：addClass()、attr()等，需要创建实例来调用。

- 链式调用
      $('div').next().addClass()....
      $.fn.myPlugin = function(){
        return this.each(function(){
          //do something
        });
      }
       /**
        *代码说明
        *-- return this 返回当前对象，类维护插件的链式调用
        *-- each 循环实现每个元素的访问
        **/
      

- 单例模式
      $.fn.myPlugin = function(){
        var me = $(this),
          instance = me.data('myPlugin');
        if(!instance){
          me.data('myPlugin',(instance = new myPlugin()));
        }
      };
      
      /**
       *代码说明
       * - 如果实例存在则不需要创建实例
       * - 利用data来存放插件对象的实例
       */
  


