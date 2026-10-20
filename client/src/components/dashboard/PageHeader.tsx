import type { ReactNode } from "react";
import { Link } from "react-router";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  breadcrumbs: BreadcrumbItem[];
  title: string;
  description?: string;
  children?: ReactNode;
}

const PageHeader = ({
  breadcrumbs,
  title,
  description,
  children,
}: PageHeaderProps) => {
  return (
    <div className="border-b border-gray-300 pb-3">
      <div className="breadcrumbs text-sm mb-2">
        <ul>
          {breadcrumbs.map((item, index) => {
            const isLast = index === breadcrumbs.length - 1;

            return (
              <li key={`${item.label}-${index}`}>
                {item.href && !isLast ? (
                  <Link to={item.href} className="text-gray-700">
                    {item.label}
                  </Link>
                ) : (
                  <span
                    className={
                      isLast ? "font-semibold pointer-events-none" : ""
                    }
                  >
                    {item.label}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
      <div className="flex gap-3 justify-between items-center">
        <div className="w-[65%]">
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-sm text-gray-700 mt-2">{description}</p>
        </div>
        <div className="w-[35%] flex justify-end items-center gap-3">
          {children}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
