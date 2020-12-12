const { merge } = require('webpack-merge')
const common = require('./webpack.common')
const webpack = require('webpack')
const path = require('path')

module.exports = merge(common,{
	mode: 'development',
	devtool: 'cheap-eval-module-source-map',
	devServer: {
	  host: 'localhost',
	  port: '9001',
	  open: true, // ��������ʱ���Զ��������
	  hot: true, // �����ȸ��¹���
	  contentBase: path.join(__dirname, "public"),
	},
	plugins: [
	  new webpack.HotModuleReplacementPlugin()
	]
})