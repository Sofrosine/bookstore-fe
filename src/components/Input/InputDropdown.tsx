import React, { FC } from "react";
import clsx from "clsx";
import { Controller, UseFormSetValue, useFormContext } from "react-hook-form";
import Image from "next/image";

type Props = {
  label?: string;
  options: { value: string; label: string }[]; // Dropdown options
  setValue?: UseFormSetValue<any>;
  containerClassName?: string;
  name: string;
} & React.SelectHTMLAttributes<HTMLSelectElement>;

const InputDropdown: FC<Props> = ({
  label,
  options,
  name,
  disabled,
  containerClassName,
  ...props
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const error = errors[name] ? errors[name]?.message : "";

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
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
                {...field}
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
      }}
    />
  );
};

export default InputDropdown;
