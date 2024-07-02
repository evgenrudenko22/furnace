const path = require("path")

module.exports = {
    mode: 'production',
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname,
            'dist'
        ),
        filename: 'index.js',
        library: 'Furnace',
        libraryTarget: 'umd',
        globalObject: 'this',
    },
    module: {
        rules: [
            {
                test: '/\.js?$/',
                exclude: '/node_modules',
                use: {
                    loader: 'babel-loader'
                }
            }
        ],
    }
}