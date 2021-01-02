const envPreset = [
    '@babel/preset-env',
    {
        useBuiltIns: 'usage',
        corejs: 3,
        modules: false,
    },
];

module.exports = function (api) {
    api.cache(true);

    const presets = ['@babel/preset-typescript', envPreset];
    const plugins = ['@babel/plugin-transform-runtime'];

    return {
        presets,
        plugins,
        env: {
            development: {
                presets: [['@babel/preset-react', { development: true }]],
            },
            production: {
                presets: ['@babel/preset-react'],
                plugins: ['@babel/plugin-transform-react-constant-elements', '@babel/plugin-transform-react-inline-elements'],
            },
        },
    };
};