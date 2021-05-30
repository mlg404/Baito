const presets = [
  [
    "@babel/preset-env",
    {
      targets: {
        node: "current",
      },
    },
  ],
  "@babel/typescript",
];

const plugins = [
  "@babel/proposal-class-properties",
  "@babel/proposal-object-rest-spread",
  "@babel/plugin-proposal-nullish-coalescing-operator",
];

module.exports = { presets, plugins };
