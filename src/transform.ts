import axios from 'axios'

export async function transform(url: string) {
    const iconfont = await getIconfont(url)
    const woff2Reg = /url\(\'(.*)\'\) format\(\'woff2\'\)/
    const woff2Url = iconfont.match(woff2Reg)[1];
    return iconfont.replace(woff2Reg, await woff22base64(woff2Url))
}

function replaceUrl(url: string) {
    return url.replace(/(^\/\/)(.*)/, "http:$1$2").replace(/(^at.alicdn.com)(.*)/, "http://$1$2")
}

async function getIconfont(url: string) {
    try {
        url = replaceUrl(url);
        return (await axios(url)).data;
    } catch (_) {
        console.log("❌ 错误！请检查url是否正确")
        process.exit(1)
    }
}

async function woff22base64(url: string) {
    url = replaceUrl(url);
    const data = (await axios(url, {
        responseType: 'arraybuffer'
    })).data
    return `url('data:application/x-font-woff2;charset=utf-8;base64,${Buffer.from(data).toString('base64')}') format('woff2')`;
}
