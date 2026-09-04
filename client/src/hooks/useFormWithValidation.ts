import { useCallback, useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

export type ValidationErrors = Partial<Record<string, string>>;

type ValidationRule = (value: string) => string | undefined;
type ValidationSchema<T extends Record<string, string>> = Partial<{
  [K in keyof T]: ValidationRule;
}>;

export function useFormWithValidation<T extends Record<string, string>>(
  initialValues: T,
  validationRules: ValidationSchema<T>,
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validate = useCallback(
    (nextValues: T): ValidationErrors => {
      const nextErrors: ValidationErrors = {};

      for (const [key, rule] of Object.entries(validationRules) as [
        keyof T,
        ValidationRule | undefined,
      ][]) {
        if (!rule) continue;

        const message = rule(String(nextValues[key] ?? ""));
        if (message) {
          nextErrors[String(key)] = message;
        }
      }

      return nextErrors;
    },
    [validationRules],
  );

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    const nextValues = { ...values, [name]: value } as T;
    setValues(nextValues);
    setErrors(validate(nextValues));
  };

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>,
    submitAction?: (nextValues: T) => void,
  ) => {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    submitAction?.(values);
  };

  const isValid = useMemo(() => {
    return Object.keys(validate(values)).length === 0;
  }, [values, validate]);

  return { values, errors, isValid, handleChange, handleSubmit };
}
