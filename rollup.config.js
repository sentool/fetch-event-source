import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';

const outlookDIR = 'dist';
const rollupConfig = [];

// output cjs
rollupConfig.push({
  input: 'src/index.js',
  output: [
    {
      file: `${outlookDIR}/index.cjs`,
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
      file: `${outlookDIR}/index.esm.js`,
      ...outputESMConfig,
    },
    {
      file: `${outlookDIR}/index.esm.min.js`,
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
      file: `${outlookDIR}/index.js`,
      ...outputUMDConfig,
    },
    {
      file: `${outlookDIR}/index.min.js`,
      ...outputUMDConfig,
      plugins: [terser()],
    },
  ],
  plugins: [
    babel({ babelHelpers: 'bundled' }),
  ],
});

export default rollupConfig;
