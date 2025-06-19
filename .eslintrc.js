export default {
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    plugins: ['node'],
    extends: ['eslint:recommended', 'plugin:prettier/recommended'],
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module',
    },
    rules: {
        'node/no-unsupported-features/es-syntax': [
            'error',
            { ignores: ['modules'] },
        ],
        'node/no-missing-import': [
            'error',
            {
                tryExtensions: ['.js', '.json', '.node'],
            },
        ],
        'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
        'import/order': [
            'error',
            {
                groups: [
                    'builtin',
                    'external',
                    'internal',
                    'parent',
                    'sibling',
                    'index',
                ],
                'newlines-between': 'always',
                alphabetize: {
                    order: 'asc',
                    caseInsensitive: true,
                },
            },
        ],
        'prettier/prettier': 'error',
    },
};
