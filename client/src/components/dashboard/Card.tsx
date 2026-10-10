import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

interface CardProps {
  title: string;
  description?: string;
  value: string | number;
  valueColor?: string;
  sideText?: string;
  sideTextClass?: string;
  icon: LucideIcon;
  iconColor?: string;
  children?: ReactNode;
}

interface CardFooterProps {
  children: ReactNode;
}

const Card = ({
  title,
  description,
  value,
  valueColor,
  sideText,
  sideTextClass,
  icon: Icon,
  iconColor,
  children,
}: CardProps) => {
  return (
    <div className="card w-full bg-base-100 card-md shadow-sm">
      <div className="card-body relative">
        <div>
          <h2 className="card-title font-semibold uppercase text-base text-gray-700">
            {title}
          </h2>

          <Icon
            className={`absolute right-8 top-6 ${iconColor ?? "text-primary"}`}
          />
        </div>

        <div>
          <p className={`text-4xl font-bold ${valueColor ?? ""}`}>
            {typeof value === "number" ? value.toLocaleString("id-ID") : value}
            <span
              className={`text-sm ms-2 text-gray-600 font-semibold ${sideTextClass ?? ""}`}
            >
              {sideText}
            </span>
          </p>
          <span className="mt-2 text-gray-700">{description}</span>
        </div>

        {children && <CardFooter>{children}</CardFooter>}
      </div>
    </div>
  );
};

const CardFooter = ({ children }: CardFooterProps) => {
  return (
    <div className="border-t border-gray-300 mt-4 pt-4 flex justify-between text-xs">
      {children}
    </div>
  );
};

export default Card;
