module.exports = {

    "presets": [

        ["@babel/preset-typescript", { "all": true}],
        "@babel/preset-react",
        [
            '@babel/preset-env',   // to support ES6 modules

        ]
    ],
    "plugins": [
        // https://github.com/facebook/react-native/issues/20150#issuecomment-417858270
        "@babel/plugin-proposal-class-properties"
    ]
}
