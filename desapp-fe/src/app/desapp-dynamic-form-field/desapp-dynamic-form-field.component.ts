import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FieldConfig } from '../models/FieldConfig';

@Component({
  selector: 'app-desapp-dynamic-form-field',
  templateUrl: './desapp-dynamic-form-field.component.html',
  styleUrls: ['./desapp-dynamic-form-field.component.scss'],
})
export class DesappDynamicFormFieldComponent implements OnInit {
  @Input() fieldConfig: FieldConfig;
  @Input() formGroup: FormGroup;

  constructor() {}

  ngOnInit(): void {}

  getErrorMessage(): string {
    const errors = this.fieldConfig.errors;
    console.log('errors: ', this.formGroup.controls);
    for (const error of errors) {
      if (this.formGroup.controls[this.fieldConfig.key].hasError(error.key)) {
        return error.text;
      }
    }
    return '';
  }
}
