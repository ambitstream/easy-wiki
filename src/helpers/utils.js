export const getRoot = () => {
    switch(process.env.NODE_ENV) {
        case 'development':
            return '/';
        case 'production':
            return 'https://ambitstream.github.io/easy-wiki/';
        default:
            return '/';
    }
}