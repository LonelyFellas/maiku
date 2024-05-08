import pkg from './package.json' assert { type: 'json' };
import fs from 'node:fs';
import process from 'node:process';
import Semver from 'semver';

const { version } = pkg;

// 获取参数
/**
 * 获取命令行参数
 * 第一个参数为 版本号的类型 如 `major` `minor` `patch` `beta` `alpha`
 * * 其中默认的参数为 `patch` <br />
 * 第二个参数为 pre版本号 如 `beta`
 * @type {[('major' | 'premajor' | 'minor' | 'preminor' | 'patch' | 'prepatch' | 'prerelease'), 'beta', number]}
 */
const args = process.argv.slice(2);
const semverType = args[0] || 'patch';
const semverPreName = args[1];
const semverPreNum = args[2];

// 校验版本号类型
if (!['major', 'minor', 'patch', 'beta', 'alpha'].includes(semverType)) {
  console.error(`Invalid semver type: ${semverType}`);
}


/**
 * 计算新版本号
 * @type {string}
 */
const newVersion = Semver.inc(version, semverType, semverPreName, semverPreNum);

// 写入新版本号到 package.json
pkg.version = newVersion;
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));

// 打印新版本号
console.log(`New version: ${newVersion}`);


