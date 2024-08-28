import path from "path"

export default { 
    mode: "development",
    entry: {
        map: "./src/js/map.js"
    },
    output: {
        filename: "[name].js",
        path: path.resolve('public/js'),
        publicPath: '/js/'
    },
    module: {
        rules: [
            {
                test: /\.(png|jpg|jpeg|gif)$/i,
                type: 'assert/resource',
                generator: {
                    filename: "../img/[name][ext]"
                }
            }
        ]
    }
}
