const envPreset = [
    '@babel/preset-env',
    {
        useBuiltIns: 'usage',
        corejs: 3,
        modules: false,
    },
];

module.exports = function (api) {
    const presets = ['@babel/preset-typescript', envPreset];
    const plugins = ['@babel/plugin-transform-runtime', !api.env('production') && 'react-refresh/babel'].filter(Boolean);
    api.cache(true);
    return {
        presets,
        plugins,
        env: {
            development: {
                presets: [['@babel/preset-react', { development: true, runtime: "automatic" }]],
            },
            production: {
                presets: ['@babel/preset-react', {runtime: "automatic"}],
                plugins: ['@babel/plugin-transform-react-constant-elements', '@babel/plugin-transform-react-inline-elements'],
            },
        },
    };
};