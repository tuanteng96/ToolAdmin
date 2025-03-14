export const toAbsoluteUrl = pathname =>
    import.meta.env.BASE_URL + pathname
export const toAbsolutePath = pathname =>
    import.meta.env.VITE_HOST + '/upload/image/' + pathname