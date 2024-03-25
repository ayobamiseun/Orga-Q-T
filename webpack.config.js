{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
                presets: ["@babel/preset-env", "@babel/preset-react"]
            },
            resolve: {
                extensions: ['.js', '.jsx']
            }
}