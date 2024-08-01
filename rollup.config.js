import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';

const DIR = 'dist';
const FILENAME = 'index';
const rollupConfig = [];

// output cjs
rollupConfig.push({
  input: 'src/index.js',
  output: [
    {
      file: `${DIR}/${FILENAME}.cjs`,
      format: 'cjs',
      sourcemap: true,
    }
  ],
  plugins: [
    babel({ babelHelpers: 'bundled' }),
  ],
});

// output esm
const outputESMConfig = {
  format: 'esm',
  sourcemap: true,
};
rollupConfig.push({
  input: 'src/index.js',
  output: [
    {
      file: `${DIR}/${FILENAME}.esm.js`,
      ...outputESMConfig,
    },
    {
      file: `${DIR}/${FILENAME}.esm.min.js`,
      ...outputESMConfig,
      plugins: [terser()],
    }
  ],
  plugins: [
    babel({ babelHelpers: 'bundled' }),
  ],
});

// output umd
const outputUMDConfig = {
  format: 'umd',
  name: 'FetchEventSource',
  sourcemap: true,
};
rollupConfig.push({
  input: 'src/index.js',
  output: [
    {
      file: `${DIR}/${FILENAME}.js`,
      ...outputUMDConfig,
    },
    {
      file: `${DIR}/${FILENAME}.min.js`,
      ...outputUMDConfig,
      plugins: [terser()],
    },
  ],
  plugins: [
    babel({ babelHelpers: 'bundled' }),
  ],
});

export default rollupConfig;
