import {
  ArrowRight,
  Ban,
  ClipboardCheck,
  House,
  MapPin,
  Pencil,
} from "lucide-react";

interface GridProps {
  title: string;
  code: string;
  isActive: boolean;
  number: number;
  city: string;
  address: string;
  sku: number;
  unitValue: number;
  buttonAction?: () => void;
}

const GridWarehouse = ({
  title,
  code,
  isActive,
  number,
  city,
  address,
  sku,
  unitValue,
  buttonAction,
}: GridProps) => {
  return (
    <div className="card bg-base-100 card-md shadow-sm h-max">
      <div className="card-body">
        <div className="flex justify-between items-start gap-4">
          <div className="flex items-center gap-3 font-jetBrains">
            <span className="py-2 px-3 text-primary text-lg font-semibold bg-primary/20 rounded-lg">
              0{number}
            </span>
            <div>
              <h2 className="text-xl font-semibold">{title}</h2>
              <p className="text-lg text-primary font-semibold">{code}</p>
            </div>
          </div>
          {isActive ? (
            <span className="text-success bg-accent/70 px-4 rounded-full font-semibold text-sm">
              Active
            </span>
          ) : (
            <span className="text-gray-800 bg-gray-700/30 px-4 rounded-full font-semibold text-sm">
              Inactive
            </span>
          )}
        </div>
        <ul className="w-[80%] text-base my-3">
          <li className="flex items-center gap-3 mb-2">
            <House size={20} className="text-primary" />
            <p className="font-semibold">{city}</p>
          </li>
          <li className="flex items-start gap-3">
            <MapPin size={20} className="text-primary shrink-0" />
            <p>{address}</p>
          </li>
        </ul>
        <div className="flex items-center justify-between gap-4 p-3 rounded bg-primary/10">
          <div>
            <h3 className="text-base font-semibold uppercase text-gray-700 ">
              Hubungan Inventaris
            </h3>
            <div className="flex items-center gap-2 w-max">
              <p className="text-xl font-semibold">{sku}</p>
              <span className="text-gray-700">&bull;</span>
              <p className="text-gray-700 text-base">{unitValue} Unit Fisik</p>
            </div>
          </div>
          <ClipboardCheck size={24} className="text-primary" />
        </div>
        <div className="flex justify-between items-center gap-4 border-t border-gray-200 mt-3 pt-3">
          <button
            onClick={buttonAction}
            className="flex items-center gap-1 text-primary font-semibold"
          >
            Lihat Detail & Stok <ArrowRight size={14} />
          </button>
          <div className="flex items-center gap-4">
            <span>
              <Pencil size={20} />
            </span>
            <span>
              <Ban size={20} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GridWarehouse;
