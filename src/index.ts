import { transform } from './transform';
const program = require('commander');
import fs from 'fs-extra';
const path = require('path')

program
    .version('0.1.0', '-v --version')
    .description('生成base64的iconfont到本地')
    .option('-s, --src [src]', 'iconfont css url')
    .option('-o, --output [path]', '生成的文件路径')
    .action(async function ({ src, output }: any) {
        let config;
        if (!src || !output) {
            try {
                config = JSON.parse(fs.readFileSync('package.json', 'utf8')).iconfont
            } catch (e) {
                console.log("请指定package.json 的 iconfont，详见文档。")
                process.exit(1)
            }
        }

        if (!src) src = config.src
        const iconfont = await transform(src)

        if (!output) output = config.output
        fs.outputFile(path.resolve('.', output), iconfont, { flag: "w+", encoding: 'utf8' })

        console.log("✅ 生成完成")
    })
    .parse(process.argv);