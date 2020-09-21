##  模块化开发与规范标准
### 模块化开发
#### 1、模块化概述

&emsp;&emsp; **模块化** 可以说是当下最重要的前端开发范式之一，随着前端应用的日益复杂，项目代码已经逐渐膨胀到了不得不花大量时间去管理的程度，而模块化就是一种最主流的代码组织方式，他通过把复杂代码按照功能的不同，划分为不同的模块代码单独维护的方式，提高开发效率降低维护成本。

&emsp;&emsp; **模块化** 这个词只是一种思想或是一个理论，并不包含具体的实现。

#### 2、模块化演变过程

&emsp;&emsp; 早期的前端技术标准根本没有预料到，前端行业会有今天这样的规模，所以很多设计上的遗留问题就导致了，我们现在去实现前端模块化的时候会遇到很多问题，虽说现在这些问题都被一些标准或者工具去解决了，但是解决演进过程值得我们思考。

模块化演变过程：

**Stage 1 - 文件划分方式（web 当中最原始的模块系统）**

&emsp;&emsp;具体的作法就是将每一个功能以及相关数据单独存放到不同的文件当中，约定每一个文件就是一个独立的模块，使用这个模块就是将它引入到页面当中，一个 script 标签对应一个模块，代码当中调用全局成员，成员有可能是一个变量或者是一个函数。

```
// module-a.js 文件
var name = 'module-a'

function method1 () {
    console.log(name + '#method1')
}

function method2 () {
    console.log(name + '#method2')
}


// module-b.js 文件
var name = 'module-b'

function method1 () {
    console.log(name + '#method1')
}

function method2 () {
    console.log(name + '#method2')
}
```
```
// 模块使用

<script src="module-a.js"></script>
<script src="module-b.js"></script>
<script>
    // 命名冲突
    method1()
    // 模块成员可以被修改
    name = ‘foo’
<script/>
```
缺点：

1. 所有的模块都在一个全局范围内工作，没有一个独立的私有空间，导致模块当中所有的成员都可以在外部被任意的访问、修改 -- 污染全局作用域
2. 随着模块的增多，容易产生命名上的冲突 --  命名冲突问题
3. 无法管理模块与模块之间的依赖关系

这种模块化方式完全依靠约定，项目一旦上了体量之后就彻底不行了

**Stage 2 - 命名空间方式**

&emsp;&emsp;约定每个模块只暴露一个全局对象，所有模块的成员都挂载到这个对象下面，具体的做法就是将每一个模块包裹成全局对象的形式去实现，类似于我们在模块内为模块的成员添加命名空间

```
// module-a.js 文件
var moduleA = {
    name: 'module-a'，
    
    method1: function () {
        console.log(this.name + '#method1')
    },
    
    method2: function () {
        console.log(this.name + '#method2')
    }
}

// module-b.js 文件
var moduleB = {
    name: 'module-b'，
    
    method1: function () {
        console.log(this.name + '#method1')
    },
    
    method2: function () {
        console.log(this.name + '#method2')
    }
}
```

&emsp;&emsp;通过命名空间的方式可以减小命名冲突的可能，但是这种方式任然没有私有空间，模块成员任然可以在外部被访问、修改，模块的依赖关系也没有得到解决

```
// 模块使用

<script src="module-a.js"></script>
<script src="module-b.js"></script>
<script>
    moduleA.method1()
    moduleB.method1()
    
    // 模块成员可以被修改
    moduleA.name = ''foo''
<script/>
```

**Stage 3 - IIFE (立即执行函数的方式去为模块提供私有空间)**

&emsp;&emsp;具体的做法，将每一个模块的成员都放在一个函数提供的私有作用域当中，对于需要暴露给外部的成员，可以通过挂载到全局对象上的方式去实现，这种方式实现了私有成员的概念。私有成员只能在模块内部的私有成员通过闭包的方式去访问，而在外部无法访问，从而确保了私有变量的安全。还可以通过自执行函数的参数作为我们依赖声明去使用，这样每个模块的依赖关系变得更加明显

```
// module-a.js
(function ($) {
    var name = ''module-a'
    
    function method1（）{
        console.log(name + '#method1')
    }
    
    function method2 () {
        console.log(name + '#method2')
    }
    
    window.moduleA = {
        method1: method1,
        method2: method2
    }
})(JQuery)
```
```
// 模块使用

<script src="module-a.js"></script>
<script>
    moduleA.method1()
 
    // 模块私有成员无妨访问
    console.log(moduleA.name) // => undefined
<script/>
```

&emsp;&emsp;以上就是早期开发者在没有工具和规范的情况下对模块化的落地方式，这些方式确实解决了前端领域去实现模块化当中各种各样的问题，但是任然存在没有解决的问题。

&emsp;&emsp; 这些方式都是以原始模块系统为基础，通过约定的方式去实现模块化的代码组织，这些方式在不同的开发者去实施的时候，会有一些细微的差别。为了统一不同的开发者和不同的项目之间的差异，需要一个标准去规范模块化的实现方式。在模块化当中，针对于模块的加载问题，在这几种方式当中都是通过 script 标签手动引入每个用到的模块，意味着模块的加载不受代码的控制，一旦时间久了之后维护起来特别麻烦，所以需要一些基础的公共代码去实现自动通过代码帮我们加载模块，也就是需要一个模块化标准和一个可以用来自动加载模块的基础库。

#### 3、模块化规范的出现

**CommonJS 规范** 是 node.js 当中所提出的一套标准，在 node.js 中所有代码必须要遵循 common.js 规范：

1. 一个文件就是一个模块
2. 每个模块都有单独的作用域
3. 通过 module.exports 导出成员
4. 通过 require 函数载入模块

&emsp;&emsp; 如果在浏览器端使用此规范会出现问题，CommonJS 是以同步模式加载模块，因为 node.js 的执行机制是在启动时去加载模块，执行过程中是不需要加载的，它只会去使用到模块，所以这种方式在 node.js 当中不会有问题，但是如果在浏览器端去使用 CommonJS 规范的话，必然导致效率低下，因为每次页面的加载都会导致大量的同步请求出现，所以在早期的前端模块化当中并没有选择 CommonJS 规范，而是专门为浏览器端结合浏览器的特点重新设计了规范，这个规范叫做 AMD (Asynchronous Module Definition)  异步的模块定义规范，同期还推出了比较出名的库 Require.js ，它实现了 AMD 这个规范，它本身又是一个非常强大的模块加载器。

&emsp;&emsp; 在 AMD 规范当中，约定每个模块都必须要通过 define 函数去定义，这个函数默认接收两个参数，也可以传入三个参数，如果传入三个参数，第一个参数就是我们这个模块的名字，可以在后期加载模块的时候使用，第二个参数就是一个数组，它是用来声明模块的依赖项，第三个参数是一个函数，函数的参数与前面的依赖项一一对应，每一项分别为依赖项导出的成员，这个函数的作用可以理解为为当前的模块提供私有的空间，如果需要向外导出成员，可以通过 return 方式实现

```
// 定义一个模块

define('module1' , ['jquery' ,'./module2'], function ($, module2) {
    return {
        start: function () {
            $('body').animate({ margin: '200px' })
            module2()
        }
    }
})
```
&emsp;&emsp; require 当中还提供了 requre 函数去用来帮我们自动加载模块，用法与 difine 函数类似，区别在于 require 函数只用于加载模块，而 define 函数是用来定义模块，一旦 require.js 需要去加载一个模块，它内部会自动创建一个 script 标签去发送对应的脚本文件请求，并且执行相应的模块代码

```
// 载入一个模块

require(['./module1'], function (module1) {
    module1.start()
})
```

目前绝大多数第三方库都支持 AMD 规范，AMD 的生态比较好，但是

1. AMD 使用起来相对复杂（因为在代码编写当中，除了业务代码，还需要使用许多如：define、require等等这些操作模块的代码，这些会导致我们的代码复杂程度有一定的提高）
2. 模块 JS 文件请求频繁（当我们项目当中模块划分的过于细致的话，同一个页面对 js 文件请求的次数就会特别多，从而导致页面效率低下）

&emsp;&emsp; AMD 只能算前端模块化演进道路的一部分，它是一种妥协的实现方式，并不能算是最终的解决方案。在当时的环境背景下面还是非常有意义的，它给前端模块化提供了标准。

&emsp;&emsp; 同期还有淘宝推出的 Sea.js 库，这个库实现的是另外一个标准，也就是 CMD 规范，全称 Common Module definitoin 通用模块定义规范，这个模块的标准有点类似于 CommonJS ，使用上跟 require.js差不多，可以算是一个重复的轮子，它当时的想法就是让我们写出来的代码，尽可能的跟 CommonJS 类似，从而减轻开发者的学习成本，但是这种方式后来也被 RequireJS 兼容了。

```
// CMD 规范 （类似于 CommonJS 规范）

define(function (require , exports , module) {
    // 通过 require 引入依赖
    var $ = require('jquery')
    // 通过 exports 或者 module.exports 对外暴露成员
    module.exports = function () {
        console.log('module 2~‘）
       $('body').append('<p>module2</p>')
    }
})
```

#### 4、模块化标准规范

&emsp;&emsp; 在这之前我们已经了解了前端模块化的发展过程，以及在这个过程中出现的一些标准，尽管这些标准都已经实现了模块化，但是它们都或多或少存在一些让开发者难以接受的问题。随着技术的发展，JavaScript 的标准也在逐渐的完善，在模块化这一块实现方式相比以往也有了较大的变化，现如今的模块化已经算是非常成熟了，针对于前端模块化的最佳实现方式都基本统一了，node.js 环境中会去遵循 CommonJS 规范组织模块，在浏览器环境当中，我们会采用 ES Modules 规范。

&emsp;&emsp;前端模块化算是统一成了 CommonJS 和 ES Modules 这两个规范，对于开发者而言主要着重掌握这两种规范就可以了。

&emsp;&emsp;在 Node.js 中使用 CommonJS 已经没什么好说的，因为 CommonJS 是 Node.js 内置的模块系统，没有任何的环境的问题，我们直接去遵循 CommonJS 规范 去使用 require 载入模块，通过 module.exports 导出模块就行。

&emsp;&emsp; 对于 ES Modules 情况相对比较复杂一些，ES Modules 是 ECMAScript 2015 (ES6)定义的一个最新的模块系统，它是最近几年被定义的标准，会存在各种各样的环境兼容问题。最早在这个标准刚推出的时候，所有主流的浏览器基本上都是不支持这样的特性，但是随着 webpack 等一系列打包工具的流行，这一规范才逐渐开始普及。截止到目前，ES Modules 已经是最主流的前端模块化方案了，相比于 AMD 这种社区提出来的开发规范，ES Modules 可以说是在语言层面实现了模块化，所以它更为完善一些。现如今大多数浏览器已经开始支持 ES Modules 特性，原生支持意味着以后我们可以直接使用这样的特性开发我们的网页应用，未来还会有一个很好的发展，短期之内不会有针对模块化这块的新的标准或轮子出现。

#### 5、ES Modules 特性

&emsp;&emsp; 对于 ES Modules 的学习可以从两个维度去入手，首先必须要了解它作为一个规范或者说标准，它到底约定了哪些特性和语法，其次是我们如何通过一些工具或者方案去解决它在运行过程中的一些兼容性所带来的问题。

ES Modules 特性：

通过给 script 标签添加 type = module 的属性，就可以以 ES Module 的标准执行其中的 JS 代码

```
<script type="module">
// 这是一个模块
</script>
```

1、**ESM 自动采用严格模式，忽略 ‘use strict’**，也就是不加 ‘use strict' 它也是严格模式，严格模式当中不能使用 this , 因为 this 在非严格模式下，this 指向的是全局对象，在严格模式下为 undefined

```
// 严格模式
<script type="module">
    console.log(this) // undefined
</script>

// 非严格模式
<script>
    console.log(this) // window
</script>
```

2、**每个 ES Module 都是运行在单独的私有作用域当中**，意味着每个 ES Module 都有一个独立的私有作用域，从而不用担心直接在全局范围去使用变量会造成全局作用域污染的问题

```
<script type="module">
    var foo = 100
    console.log(foo) // 100
</script>
<script type="module">
    console.log(foo) // foo is not defined
</script>
```

3、**ES Module 是通过 CORS 的方式请求外部 JS 模块**，意味着 JS 模块不在同源地址下面的话，那就需要我们去请求的服务端地址，它在响应的响应头当中必须要提供有效的 CORS 标头

4、**ES Module 的 script 标签会延迟执行脚本**，等同于 script 标签的 defer 属性，意味着我们添加了 type=module 等于添加了 defer  属性

#### 6、ES Modules 导出

ES Modules 最为核心的功能就是对模块的导出和导入，这两个功能主要是分别由 export、import 两个关键词构成，export 的命令主要是在模块内对外进行接口暴露，import 命令则是在模块内去导入其它模块所需要的接口。

```
// ./module.js
const foo = 'es modules'
export {foo}

// ./app.js
import {foo} from ''./module.js'
console.log(foo) // => es modules
```
export 不仅可以修饰变量声明，还可以修饰函数声明、类声明，这样函数、类也可以作为导出成员

```
export function hello () {
    console.log('hello')
}

export class Person {}
```
除了修饰成员声明的使用方式，export 一般还可用来单独去使用，具体的操作方式 通过 {} 将成员导出去，这种用法更为常见，因为一般通过在模块尾部去集中导出所有成员的方式，这样可以更加直观地描述模块向外提供了哪些成员，易于外界对代码的理解更容易一些。

```
var name = 'foo module'

function hello () {
    console.log('hello')
}

class Person {}

export { name , hello , Person }
```
除此之外还可以通过这种方式去为我们输出的成员，进行重命名，具体的实现方式用 as 关键

```
// module.js
export {
    name as fooName
}

// app.js 
import { fooName } from module.js
```

重命名使用过程中会有一种特殊的情况，就是一旦将导出成员的名字设置为 default ，这个成员就会作为当前模块默认的导出成员，导入的时候就需要对这个成员进行重命名，因为 default 是关键词不能当做变量使用，所有需要通过 as 关键词重新起一个名字

```
// module.js
export {
    name as default
}

// app.js 
import { default as fooName } from 'module.js'
```
在 ES Module 当中还为 default 成员单独设置了一个特殊的用法，直接通过 export default +变量，就可以将变量作为当前模块的默认成员导出，导入直接通过 import +变量名的方式，接受模块默认导出的成员，这个变量名可以根据需要随便取

```
// module.js
export default name

// app.js
import abc from 'module.js'
```

#### 7、ES Modules 导入导出的注意事项

1、**export { } 导出的成员不是字面量对象，import { } 导入的成员不是解构,而是固定写法**，我们在使用 export 导出模块当中的一些成员的时候，使用的是 export { 成员变量1，成员变量2，。。。}的方式，这种方式许多人会误认为 export 后面跟上的是字面量对象，因为许多人会联想到 es6 当中的新出的字面量对象简写写法，正常的字面量对象写法如下

```
var obj = {
    name: name,
    age: age
}
```

在 es6 的简写写法当中，当字面量对象的属性名和当前作用域变量名字一样，就可以直接通过变量的名字去代替，跟导出语法相似，许多人就会误认为导出的是字面量对象

```
var obj = { name, age }
```
导入的时候就会误认为是对对象的解构

```
import { name, age} from './module.js'
```
实际上这两个说法是错误的，export { } 、import { } 这是一个固定的写法，如果想导出一个对象可以通过 export default { }，此时{ } 代表的就是字面量对象

```
export default { name, age}
```

2、**在 ES Module 的导出过程当中，导出的成员并不是导出成员的值**，并不是把成员的值复制一遍，而是把值存放的地址导出，在外部拿到的成员会受当前模块的修改的影响。

3、**在外部导入一个模块的成员过后，成员为只读不能修改**， 可以借助此特点定义一些常量模块，比如项目当中的一些配置文件，这些配置文件希望在外部使用的时候只读取而不能修改，因为一旦外部不小心修改了，会导致全局的配置受影响，所以可以借助这种小特性解决应用当中常量的问题。


#### 8、ES Modules 导入用法

**1、引用文件路径注意事项**

import 导入模块时， from 后面的模块文件路径字符串必须要使用完整的文件名称，**不能省略 .js 扩展名**，跟 CommonJS 有区别

```
import { } from ''./module.js'
```
对于文件路径名称，后期通过打包工具打包模块时可以省略扩展名和省略 index.js 默认文件的操作

如果使用的是相对路径，相对路径的 ./ 在网页开发当中引用资源是可以省略掉的，但是在 import 使用时**相对路径的 ./ 不能省略**掉，如果省略掉就变成以字母开头，ES Module 会认为是在加载第三方模块，所以必须要以 ./ 开头，这一点与 CommonJS 相同。

除了可以用 ./ 开头的相对路径方式，还可以**使用 / 开头的绝对路径**，也就是从网站根目录下开始往下数的完整路径去引用模块，还可以使用**完整的** URL去加载模块，这就意味着可以直接引用 cdn 上的模块文件。

2、如果只是要执行某个模块，并不需要提取模块当中的成员，那么可以保持 import 花括号为空，这样就只会执行模块不会提取任何成员

```
import { } form ‘ ./module.js ’
```
或者

```
import ' ./module.js '
```
这个特性在导入一些不需要外界控制的子功能模块时非常有用


3、如果一个模块需要导出的成员特别多，在导入时都会用到它们，这时可以使用 * 的方式将所有成员提取出来，通过 as 将所有成员放到一个对象当中，导出的成员都会成为对象的属性出现，通过 module.成员名称拿到具体的成员

```
import *  as mod from './module.js'
```
4、**如何动态的去加载模块**

在使用导入模块的时候，import 关键词可以理解为导入模块的声明，需要在开发阶段明确需要导入模块的路径，但是有的时候，模块路径是在运行的阶段才知道，这种情况不能使用 import 关键词去 from 一个变量，有的时候需要在某些情况下当某些条件满足时才导入模块，在这种方式下也没有办法使用 import ，因为 import 关键字只能出现在模块最外层的作用域，并不能嵌套在 if 或者函数当中，遇到以上两种情况就需要动态去导入模块的机制，ES Module 当中提供全局的 import 函数，它专门用来动态导入模块，具体的用法就是通过 import 函数传入需要导入模块的路径，因为是普通函数，任何地方都可以调用，函数返回的是 promise，因为模块加载时异步过程，当模块加载完成后会自动执行 then 当中所制定的回调函数，模块的对象可以通过参数去拿到

```
import ('./module.js').then(function (module) {
    console.log(module)
})
```

5、如果在一个模块当中同时导出了一些命名成员和一个默认成员，在导入模块需要同时导入命名成员和默认成员，可以通过以下并列的方式导入

```
import { 成员1，成员2，default as 重命名称 } from './module.js'

```
或者
```
import 默认成员重命名称，{ 成员1，成员2 } from ‘./module.js’
```

#### 9、ES Modules 导出导入成员

import 可以配合 export 去使用，效果就是将导入的结果直接作为当前模块的导出成员

```
export { 成员1，成员2} from './module.js'
```

#### 10、ES Modules 浏览器环境 Polyfill

ES Modules 是2014年才被提出来的，意味着早期的浏览器不可能支持这个特性，在使用 ES Modules 需要考虑兼容性所带来的问题。

Polyfill 可以让我们在浏览器当中直接去支持 ES Modules 中绝大多数特性，这个模块的名字叫 ES Module Loader，这个模块实际就是一个 JS 文件，我们将这个 JS 文件引入到网页当中，就可以让网页运行 ES Modules

```
<script scr="dist/babel-browser-build.js"></script>
<script src="dist/browser-es-module-loader.js"></script>
```

browser-es-module-loader npm模块可以通过 unpkg.com/browser-es-module-loader 网址获得

对于不支持 promise 新特性的浏览器，可以通过引入 Promise Polyfill

```
<script src="dist/promise-polyfill></script>
```
promise-polyfill 可以通过 unpkg.com/promise-polyfill 网址获得

ES Module Loader 的工作原理就是将浏览器中不能识别的 ES Module 交给 babel 去转换，对于需要 import 进来的文件通过 ajax 请求方式，把请求回来的代码在去通过 babel 转换，从而支持 ES Module.

如果本身已经支持 ES Module 的浏览器，那么代码就会被执行两次，因为浏览器本身会执行一次 ES Module，然后 ES Module Loader 又执行一次，就导致脚本被重复执行，对于这个问题可以借助 script 标签的属性 nomodule 来解决，这样 script 标签只会在不支持 ES Module 的浏览器当中工作。

```
<script nomodule="true"></script>
```
这种兼容方式只适合本地开发阶段使用，生产阶段千万不要用，因为它的原理都是在运行阶段动态的去解析脚本，效率非常差，真正的生产阶段应该预先将这些代码编译出来，让它可以直接在浏览器当中工作。

#### 11、ES Modules in Node.js-支持情况

ES Modules 作为 JavaScript 语言层面的模块化标准，会逐渐去统一 js 所有应用领域的模块化需求，node.js 作为 javascript 一个非常重要的应用领域，它目前开始逐步支持 ES Modules 特性，自从 node 8.5版本过后内部就已经以实验特性的方式，去支持 ES Modules 特性，也就是在 node 当中可以直接原生的去使用 ES Modules 编写代码。考虑到原来的 CommonJS 规范与现在的 ES Modules 差距较大，所以这样的特性还是处于过度的状态。

启动用 ES Modules 特性编写的 node 脚本，需要添加 --experimental-modules 参数去启用 ES Module 的实验特性

```
node --experimental-modules **.mjs
```

可以通过 ES Modules 去载入原生模块、第三方模块

```
import fs from 'fs'
```
不能通过 import { } 载入第三方模块，因为{ } 不是解构，第三方模块都是导出一个对象，这个对象作为模块默认成员导出，所以需要默认导入的方式导入成员。

可以通过提取的方式直接去提取系统内置模块当中的成员，因为系统内置的模块，官方都做了兼容，意味着会对系统内置模块里的成员到导出一次，然后再整体作为一个对象再默认导出，为了兼容外界默认导入或单个命名导入的方式去使用。


#### 12、ES Modules in Node.js-与CommonJS的交互

**1、ES Modules 中可以导入 CommonJS 模块**

```
// commonjs.js
module.exports = {
    foo: 'commonjs exports value'
}

// es-module.mjs
import mod from './commonjs.js'
console.log(mod)
```

**2、CommonJS 中不能导入 ES Modules 模块**

```
// es-module.mjs
export const foo = 'es module export value'

// commonjs.js
const mod = require('./es-module.mjs')
console.log(mod) //报错
```

**3、CommonJS 始终只会导出一个默认成员**

**4、注意 import 不是解构导出对象**

#### 13、ES Modules in Node.js-与CommonJS的差异

ES Modules 中没有 CommonJS 中的 require、module、exports、__filename、__dirname 这些模块全局成员，require、module、exports 可以通过 ES Modules 中 import、exports 代替

__filename (当前文件的绝对路径）可以通过 import 作为一个对象下面的 meta 属性里面的 url ,获得当前文件 url 地址，借助 url 里面的 fileURLToPath 方法把文件 url 转换成文件路径，就可以拿到当前文件的路径,__dirname（当前文件所在目录）同理

```
import { fileURLToPath } from 'url'
import { dirname } from 'path'
const __filename = fileURLToPath(import.meta.url)
console.log(__filename)
const __dirname = dirname(__filename)
console.log(__dirname)
```

#### 14、ES Modules in Node.js-新版本进一步支持

在新版本当中通过给项目的 package.json 添加 type 字段，值设置为 module,这样项目的所有 js 文件默认会以 ES Modules 去工作，不用将扩展名改为 .mjs，

```
// package.json
{
    "type" : "module"
}
```
如果需要使用 CommonJS 规范可以将文件扩展名设置为 .cjs 就可以了。

#### 15、ES Modules in Node.js-Babel 兼容方案

如果使用的是早期的 node.js 版本，可以使用 babel 实现 ES Modules 的兼容，bable 是目前最主流的一款 JavaScript 编译器，它可以将一些使用了新特性的代码编译成当前环境支持的代码。

在 node 环境使用 babel 运行 ES Modules 代码，首先安装 @babel/node、@babel/core 模块以及预设插件 @babel/preset-env 

```
yarn add @babel/node @babel/core @babel/preset-env --dev
```
babel 是基于插件机制去实现的，它的核心模块不会去转换代码，具体需要通过 preset-env 插件去转换代码当中的每一个特性

```
yarn babel-node **.js --presets=@babel/preset-env
```

**相关工具使用：**

Browser Sync 调试工具，启动具有热更新的 web server
```
// 安装 
 npm install -g browser-sync
 
 // 使用
 browser-sync . --files **/*.js
 
```