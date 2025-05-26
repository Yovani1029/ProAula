import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export function emailExistenteValidator(http: HttpClient): AsyncValidatorFn {
    return (control: AbstractControl) => {
        const email = control.value;
        if (!email) return of(null); 

        const apiKey = 'f5214d829db94b519b754409b9baaf1f	';
        const url = `https://emailvalidation.abstractapi.com/v1/?api_key=${apiKey}&email=${email}`;

        return http.get<any>(url).pipe(
            map(response => {
                console.log(response);
                return response.deliverability === 'DELIVERABLE' &&
                    !response.is_disposable_email
                    ? null
                    : { correoInvalido: true };

            }),
            catchError(() => of({ correoInvalido: true })) 
        );
    };
}
