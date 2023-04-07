namespace App {
  // validation
  export interface Validatable {
    value: string | number;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
  }

  export function validate(validatable: Validatable) {
    let isValid = true; // 기본값은 true

    if (validatable.required) {
      isValid = isValid && validatable.value.toString().trim().length !== 0;
    }
    if (
      validatable.minLength !== undefined &&
      typeof validatable.value === "string"
    ) {
      isValid = isValid && validatable.value.length >= validatable.minLength;
    }
    // 등호가 하나일 경우 null 과 undefined 모두 포함
    if (
      validatable.maxLength != null &&
      typeof validatable.value === "string"
    ) {
      isValid = isValid && validatable.value.length <= validatable.maxLength;
    }
    if (validatable.min != null && typeof validatable.value === "number") {
      isValid = isValid && validatable.value > validatable.min;
    }
    if (validatable.max != null && typeof validatable.value === "number") {
      isValid = isValid && validatable.value > validatable.max;
    }

    return isValid;
  }
}
