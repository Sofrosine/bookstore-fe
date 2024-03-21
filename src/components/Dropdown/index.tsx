import clsx from "clsx";
import Image from "next/image";
import React, { FC } from "react";

type Props = {
  label?: string;
  options: { value: string; label: string }[]; // Dropdown options
  containerClassName?: string;
  name: string;
  error?: string;
} & React.SelectHTMLAttributes<HTMLSelectElement>;

const Dropdown: FC<Props> = ({
  label,
  options,
  name,
  disabled,
  containerClassName,
  error,
  ...props
}) => {
  return (
    <div
      className={clsx(
        "flex flex-col space-y-0.5 text-black-text",
        containerClassName
      )}
    >
      <label htmlFor={name} className="text-body-2 font-medium">
        {label}
      </label>
      <div className="relative ">
        <select
          {...props}
          disabled={disabled}
          className={clsx(
            "text-body-1 w-full appearance-none bg-transparent border-b border-grey-2 focus:outline-none focus:border-green-500 pb-1",
            disabled && "text-grey-2"
          )}
        >
          {options?.map((option, index) => (
            <option key={index} value={option?.value}>
              {option?.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <Image
            src={"/icons/IcChevronDown.svg"}
            height={24}
            width={24}
            alt=""
          />
        </div>
      </div>
      {error && (
        <div className="text-body-2 text-error">{error.toString()}</div>
      )}
    </div>
  );
};

export default Dropdown;
