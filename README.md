# fullScreenScroll-demo
the demo is a jquery plugin which implements full screen scroll
# Abstract 
  * 去掉滚动条后，页面就不能滚动了
   ``` css
   overflow: hidden; /*取掉滚动条 */
   ```
  * 闭包的作用
   ```  javasccript
  (function($){
   //do something
  })(jQuery)
  
  //1.避免全局依赖
  //2.避免第三方破坏
  //3.兼容jQuery操作符‘$’和jQuery
  ```
  
  * 开发方式
  1.类级别组件开发<br/>
  即给jQuery命名空间下添加新的全局函数，也称为静态方法。<br/>
  ``` javascript
   jQuery.myPlugin = function(){
    //do something
   }
  ```
  例如：$.Ajax()、$.extend()
  
  2.对象级别组件开发<br/>
    即挂载在jQuery原型吓得方法，这样通过选择器获取的jQuery对象实例也能共享该方法，也称为动态方法。<br/>
    ```  javascript
      $.fn.myPlungin = function(){
        //do something
      };
      //这里的$.fn === $.prototype
    ```
