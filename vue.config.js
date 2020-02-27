const path = require('path');
// const FileManagerPlugin = require('filemanager-webpack-plugin');
// let ts = [ new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate() ].join('');
// let outputDir = 'manage';
// const product = (process.env.NODE_ENV = 'production');
const resolve = (dir) => {
	return path.join(__dirname, dir);
};
module.exports = {
	lintOnSave: false,
	// outputDir: outputDir, // 输出文件目录
	// css: {
	// 	extract: product ? true : false,
	// 	sourceMap: product ? true : false,
	// 	loaderOption: {
	// 		less: {
	// 			javascriptEnabled: true
	// 		}
	// 	},
	// 	modules: false
  // },
  // configureWebpack: config => {
  //   if (product) {
  //     config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true;
  //   }
  // },
	chainWebpack: (config) => {
		config.plugins.delete('prefetch');
		config.resolve.alias
			.set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
			.set('_c', resolve('src/components'))
      .set('_v', resolve('src/views'));
      // if (product) {
      //   config.plugin('compress').use(FileManagerPlugin, [
      //     {
      //       onEnd: {
      //         delete: [
      //           // 首先需要删除项目根目录下的dist.zip
      //           './*.zip'
      //         ],
      //         archive: [
      //           // 然后我们选择dist文件夹将之打包成dist.zip并放在根目录
      //           { source: `./${outputDir}`, destination: `./${outputDir}.zip` }
      //         ]
      //       }
      //     }
      //   ]);
      // }

	},
	devServer: {
		proxy: {
			'/api': {
				target: 'http://192.168.99.61:13600', // 对应自己的接口
				changeOrigin: true,
				ws: true,
				pathRewrite: {
					'^/api': ''
				}
			}
		}
	}
};
