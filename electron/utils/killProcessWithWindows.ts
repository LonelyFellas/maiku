import { exec } from 'node:child_process';

/**
 * 在windows系统中杀死进程
 * @param pid 进程id
 */
export function killProcessWithWindows(pid: number) {
  exec(`taskkill /PID ${pid} /F /T`, (error, stdout, stderr) => {
    if (error) {
      console.error(`执行出错: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
  });
}
