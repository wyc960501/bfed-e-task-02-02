# 魏业昌 |Part2 | 模块二
### 1、Webpack 的构建流程主要有哪些环节？如果可以请尽可能详尽的描述 Webpack 打包的整个过程。

webpack 的构建流程主要有 初始化参数、编译模块、打包输出 3个环节，具体的打包详细过程如下：

- **初始化参数**：根据 webpack.config.js 配置文件 和 Shell 参数，形成最终的打包配置；
- **开始编译**：通过配置参数初始化 compiler 对象，注册配置的所有 plugins ，监听 webpack 构建生命周期的事件节点，并做出相应的处理，然后执行对象的 run 方法开始编译；
- **确定入口**：从配置的 entry 入口文件，开始解析文件构建 AST 语法树，找出依赖，逐级递归；
- **编译模块**：递归中根据文件类型和 loader 配置，调用所有配置的 loader 对相应的模块文件进行转换，接着找出该模块依赖的模块，再递归本步骤直到入口文件依赖的所有文件都经过本步骤处理；
- **完成编译并输出**：递归完成后，得到的每个文件结果，包含每个模块以及它们之间的依赖关系，根据 entry 和 output 分包配置生成代码块 chunk; 
- **构建完成**：输出所有的 chunk 到相应的文件目录。
  
### 2、Loader 和 Plugin 有哪些不同？请描述一下开发 Loader 和 Plugin 的思路。
  
&ensp;&ensp;&ensp;&ensp;loader 让 webpack 能够去处理那些非 JavaScript 文件（webpack 自身只理解 JavaScript）。loader 可以将所有类型的文件转换为 webpack 能够处理的有效模块；loader 被用于转换某些类型的模块，而插件则可以用于执行范围更广的任务。插件的范围包括，从打包优化和压缩，一直到重新定义环境中的变量。插件接口功能极其强大，可以用来处理各种各样的任务。
  
**Loader 开发思路：**  

&ensp;&ensp;&ensp;&ensp; 创建相应的 loader.js 文件，编写一个函数并通过 module.exports 导出，这个函数就是 loader 对加载到的资源进行处理的过程，输入就是所加载到的资源文件内容，输出就是加工过后的结果，
通过 source 参数去接收输入，通过返回值（返回值要么是一段标准的 JavaScript 代码，要么找一个合适的加载器接着处理结果返回 javaScript 代码）输出。

**plugin 开发思路：**  

- 一个 javaScript 命名函数
- 在插件函数的 prototype 上定义一个 apply 方法。
- 指定一个绑定到 webpack 自身的事件钩子。
- 处理 webpack 内部实例的特定数据。
- 功能完成后调用 webpack 提供的回调。
