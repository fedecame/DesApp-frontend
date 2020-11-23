import { Observable, of } from 'rxjs';

export class FieldConfig {
  key: string;
  label: string;
  type: string;
  cssClasses: string[];
  errors: { key: string; text: string }[];
  options: {};

  constructor({
    key,
    label,
    type,
    cssClasses,
    errors,
    options,
  }: {
    key: string;
    label: string;
    type?: string;
    cssClasses?: string[];
    errors?: { key: string; text: string }[];
    options?: {};
  }) {
    this.key = key;
    this.label = label;
    this.type = type || 'input';
    this.cssClasses = cssClasses || [];
    this.errors = errors || [];
    this.options = options || (this.type === 'input' ? { inputType: 'text' } : {});
  }
}
