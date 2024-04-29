import Slider from './modules/slider';
import TableMain from './modules/tabel-main';

export default function profiles() {
  return (
    <div className="mt-4 h-full pb-4 overflow-hidden">
      <div className="flex gap-2 bg-white h-full rounded-md p-2 overflow-hidden">
        <Slider />
        <div className="flex-1 overflow-hidden">
          <TableMain />
        </div>
      </div>
    </div>
  );
}
