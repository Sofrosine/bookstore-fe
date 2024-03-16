"use client";

import clsx from "clsx";
import { FC, useMemo } from "react";
import styleCheckbox from "@/styles/checkbox.module.css";
import {
  Controller,
  FieldError,
  FieldErrorsImpl,
  Merge,
  UseFormSetValue,
  useFormContext,
} from "react-hook-form";

type Props = {
  label?: string; // The label text for the input field
  icon?: React.ReactNode; // The icon element to display
  iconRight?: React.ReactNode; // The icon element to display
  name: string;
  setValue?: UseFormSetValue<any>;
} & React.InputHTMLAttributes<HTMLInputElement>;

const Input: FC<Props> = ({ label, icon, iconRight, name, ...props }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const error = errors[name] ? errors[name]?.message : "";

  if (props?.type === "checkbox") {
    return (
      <Controller
        control={control}
        name={name}
        render={({ field }) => {
          return (
            <label className={styleCheckbox.container}>
              <input
                {...props}
                {...field}
                checked={field?.value}
                type="checkbox"
              />
              <span className={styleCheckbox.checkmark}></span>
              {label}
            </label>
          );
        }}
      />
    );
  }

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <div className="flex flex-col space-y-0.5 text-black-text">
            <label htmlFor={name} className="text-body-2 font-medium px-1">
              {label}
            </label>
            <div className="flex relative items-center">
              {icon && (
                <span className="absolute left-1 z-50 bottom-1">{icon}</span>
              )}
              {iconRight && (
                <span className="absolute right-1 z-50 bottom-1">
                  {iconRight}
                </span>
              )}
              <input
                {...props}
                {...field}
                value={field?.value}
                onChange={(e) => {
                  field.onChange(e);
                  // Add customize onchange here
                }}
                className={clsx("flex-1 text-body-1", icon && "pl-9")}
              />
            </div>
            {error && (
              <div className="text-body-2 text-error">{error.toString()}</div>
            )}
          </div>
        );
      }}
    ></Controller>
  );
};

export default Input;