import shareJson from '/public/share.json';
import fs from 'node:fs';

type ShareType = typeof shareJson;
export default function share(key: keyof ShareType) {
  const get = async () => {
    return shareJson[key];
  };

  const set = (value: ShareType[keyof ShareType]) => {
    const updatedShareJson = { ...shareJson, [key]: value };
    const stringifiedData = JSON.stringify(updatedShareJson, null, 2);
    fs.writeFileSync('public/share.json', stringifiedData);
    return updatedShareJson;
  };

  return [get, set] as const;
}
