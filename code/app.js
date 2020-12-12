//一、
//答：初始化参数: 从配置文件和shell语句中读取合并参数,得到最终的参数,
//开始编译: 用上一步得到的参数初始化 Compiler 对象,在不同的钩子中执行不同的配置插件,执行对象的run方法开始编译,
//确定入口: 根据配置中的 entry 找出文件的入口,
//编译模块: 根据入口文件调用配置中的 loader 对模块进行解析,plugin 对模块进行其他操作递归查找所有依赖模块并做同样的操作,
//完成编译： 根据上一步得到编译完的最后结果以及他们的依赖管系,
//输出资源： 根据入口和模块的依赖关系组装成一个个包含多个模块的 Chunk，再把每个 Chunk 转换成一个单独的文件加入到输出列表，这步是可以修改输出内容的最后机会；
//输出完成： 根据配置的输出文件目录和文件件名,将文件内容输出到文件系统
//二、
//答：Loader 和 Plugin 的不同
//Loader 是模块加载器, webpack 默认只能解析js文件,要想其它文件也参与打包就要用到 Loader。所以Loader的作用是使 webpack 拥有加载和解析其他文件的能力.
//Plugin 是插件,用于扩展 webpack 的功能,让 webpack 更加灵活. webpack 在生命周期提供了许多事件,Plugin 可以监听这些事件在合适的时机提供 API 改变输出结果
//Loader 在 module.rules 中配置
module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            'style-loader',
            'css-loader'
          ]
        }
      ]
    },
//Plugin 在 plugins 中单独配置
plugins: [
  new HtmlWebpackPlugin({
	title: 'Webpack Tutorial',
	template: './src/index.html'
  }),
  new webpack.HotModuleReplacementPlugin()
]
//开发 Loader

    //新建一个js文件（可以发布到npm当作一个npm模块使用）
    //导出一个函数，输入是加载到的资源文件内容，输出是此次加工过后的一个结果。
    //是以多个管道进行工作的，但是输出的结果必须是一段 JavaScript 代码。方法一：直接返回一个 JavaScript 代码。 方法二：再去找一个合适的加载器接着去处理此次处理完的结果。
    //在 webpack.config.js 中使用 loader，配置 module.rules ，其中 use 除了可以使用模块名称，也可以使用模块路径

//开发 Plugin

    //通过钩子机制实现，webpack在不同的时期有不同的钩子，在对应的钩子上挂载任务即可。
    //插件必须是一个函数或者是一个包含 apply 方法的对象
    //接收一个 compiler 参数，通过这个对象注册钩子函数
    //通过 tap 注册插件，第一个参数为插件名，第二个参数为挂载到钩子上的函数，接收 compilation（此次打包的上下文） 对象参数。
    //做逻辑处理返回 source 内容和 size 文件大小
class MyPlugin {
  apply (compiler) {
    console.log('MyPlugin 启动')

    compiler.hooks.emit.tap('MyPlugin', compilation => {
      // compilation => 可以理解为此次打包的上下文
	  console.log(compilation.assets)
      for (const name in compilation.assets) {
        // console.log(name)
        // console.log(compilation.assets[name].source())
        if (name.endsWith('.js')) {
          const contents = compilation.assets[name].source()
          const withoutComments = contents.replace(/\/\*\*+\*\//g, '')
          compilation.assets[name] = {
            source: () => withoutComments,
            size: () => withoutComments.length
          }
        }
      }
    })
  }
}
//编程题
///** 项目开发过程说明文档 **/

    //安装 webpack 和 webpack-cli

//公共打包配置

    //处理js 文件 安装 babel-loader @babel/core @babel/preset-env
    //处理 vue 文件需要安装 vue-loader 依赖 css-loader vue-template-compiler 同时需要使用 VueLoaderPlugin
    //处理 less 文件需要安装 less less-loader style-loader
    //处理 img 图片 file-loader 图片不显示问题 -- file-loader在新版本中esModule默认为true，因此手动设置为false
    //运行打包是报错 Error: Cannot find module '@vue/cli-plugin-babel' 将babel.config.js 内容注销
    //运行打包报错 Cannot find module file-loader 安装 file-loader 模块
    //处理HTML打包 html-webpack-plugin 配置全局变量 BASE_URL new 利用 webpack[ 'ProvidePlugin' ]

//生产环境配置

    //利用 webpack-merge 合并公共的配置
    //增加删除的优化动作 clean-webpack-plugin
    //拷贝项目中的 public 中的文件 开发环境配置
    //利用 webpack-merge 合并公共的配置
    //利用 webpack-dev-server 开启一个开发服务器
    //解决报错Cannot find module 'webpack-cli/bin/config-yargs' 安装 "webpack": "^4.41.2", "webpack-cli": "^3.3.9", "webpack-dev-server": "^3.9.0"

//ESLint 代码检查配置

    //安装 eslint 模块 安装 eslint-loader 模块
    //初始化 .eslintrc.js 文件 npx eslint --init