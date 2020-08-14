export const waitAsync = time => {
    return new Promise((resolve, reject) => { setTimeout(() => { resolve() }, time) })
}