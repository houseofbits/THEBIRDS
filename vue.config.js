module.exports = {
    pages: {
        'index': {
            entry: './src/main.js',
            filename: 'index.html',
            title: 'TheBirds',
        },
        'test': {
            entry: './src/main.js',
            filename: 'test.html',
            template: 'public/test.html',
            title: 'Test frame',
        }
    }
}