import { resolve as _resolve } from 'path';

export const entry = './src/pages/index.js';
export const output = {
    path: _resolve(__dirname, 'dist'),
    filename: 'bundle.js',
};
export const module = {
    rules: [
        {
            test: /\.jsx?$/, // This will match both .js and .jsx files
            exclude: /node_modules/, // Don't process files inside node_modules
            use: {
                loader: 'babel-loader', // Use Babel to process JS and JSX
            },
        },
    ],
};
export const resolve = {
    extensions: ['.js', '.jsx'], // Ensure Webpack can resolve .js and .jsx files
};
export const devtool = 'source-map';
