import type {WebpackOverrideFn} from '@remotion/bundler';

/**
 * @description A function that modifies the default Webpack configuration to make the necessary changes to support Tailwind.
 * @see [Documentation](https://www.remotion.dev/docs/tailwind/enable-tailwind)
 */
export const enableTailwind: WebpackOverrideFn = (currentConfiguration) => {
	return {
		...currentConfiguration,
		module: {
			...currentConfiguration.module,
			rules: [
				...(currentConfiguration.module?.rules
					? currentConfiguration.module.rules
					: []
				).filter(
					(rule) => rule !== '...' && !rule.test?.toString().includes('.css')
				),
				{
					test: /\.css$/i,
					use: [
						require.resolve('style-loader'),
						require.resolve('css-loader'),
						{
							loader: require.resolve('postcss-loader'),
							options: {
								postcssOptions: {
									plugins: [
										require.resolve('postcss-preset-env'),
										require.resolve('tailwindcss'),
										require.resolve('autoprefixer'),
									],
								},
							},
						},
					],
				},
			],
		},
	};
};
