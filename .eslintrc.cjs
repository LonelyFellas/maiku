module.exports = {
    root: true,
    env: {browser: true, es2020: true},
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:react-hooks/recommended'],
    ignorePatterns: ['dist', '.eslintrc.cjs', 'node_modules/**/*.ts', '**/*.d.ts'],
    parser: '@typescript-eslint/parser',
    plugins: ['react-refresh', 'import'],
    rules: {
        'react-refresh/only-export-components': ['warn', {allowConstantExport: true}],
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/ban-ts-comment': 'warn',
        'import/order': [
            'error',
            {
                groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index']],
                alphabetize: {
                    order: 'asc',
                    caseInsensitive: true,
                },
                pathGroups: [
                    {
                        pattern: 'react',
                        group: 'external',
                        position: 'before',
                    },
                    {
                        pattern: 'react-dom/**',
                        group: 'external',
                        position: 'before',
                    },
                    {
                        pattern: 'antd',
                        group: 'external',
                        position: 'before',
                    },
                    {
                        pattern: '@darwish/**',
                        group: 'external',
                        position: 'before',
                    }, {
                        pattern: '@common',
                        group: 'internal',
                        position: 'after',
                    }, {
                        pattern: '@common/**',
                        group: 'internal',
                        position: 'after',
                    },
                    {
                        pattern: '@api',
                        group: 'internal',
                        position: 'after',
                    },
                    {
                        pattern: '@assets',
                        group: 'internal',
                        position: 'after',
                    },
                    {
                        pattern: '@img',
                        group: 'internal',
                        position: 'after',
                    }, {
                        pattern: '@img/*',
                        group: "internal",
                        position: "after"
                    },
                    {
                        pattern: '@sty',
                        group: 'internal',
                        position: 'after',
                    },
                    {
                        pattern: '@/**',
                        group: 'internal',
                        position: 'after',
                    },
                    {
                        pattern: '*.css',
                        group: 'internal',
                        position: 'after',
                    },
                ],
                pathGroupsExcludedImportTypes: ['builtin'],
            },
        ],
    },
};
