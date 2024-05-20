import path from 'node:path';
import { Adb } from '@devicefarmer/adbkit';

export default function adbkit(): Partial<Window['adbApi']> {
  const client = Adb.createClient();
  // console.log(import.meta);
  return {
    // shellAdb: (command) => exec(command),
    connect: async (...params) => client.connect(...params),
    disconnect: async (...params) => client.disconnect(...params),
    reboot: async (serial: string) => client.getDevice(serial).reboot(),
    getDevice: (serial) => client.getDevice(serial),
    listDevices: async () => {
      const list = await client.listDevices();
      return list;
    },
    // getStatus: () => client.(),
    getPackages: (serial: string) => client.getDevice(serial).getPackages(),
    kill: () => client.kill(),
    shell: (id, command) => client.getDevice(id).shell(command).then(Adb.util.readAll),
    push: async (
      id,
      filePath,
      { progress, savePath = `${window.env.VITE_UPLOAD_FILE}${path.basename(filePath)}` } = {
        progress: () => null,
        savePath: window.env.VITE_UPLOAD_FILE,
      },
    ) => {
      await client.getDevice(id).shell('su');
      const res = await client.getDevice(id).push(filePath, savePath);

      return new Promise((resolve, reject) => {
        res.on('progress', (stats: number) => {
          progress?.(stats);
        });

        res.on('end', (ret: unknown) => {
          resolve(ret);
        });

        res.on('error', (err: unknown) => {
          reject(err);
        });
      });
    },
    readdir: async (id, filePath) => {
      const files = await client.getDevice(id).readdir(filePath);
      return files;
    },
    shellResult: async (id, command) => {
      return client
        .getDevice(id)
        .shell(command)
        .then(Adb.util.readAll)
        .then((res: Darwish.AnyObj) => {
          return res.toString();
        });
    },
  };
}
