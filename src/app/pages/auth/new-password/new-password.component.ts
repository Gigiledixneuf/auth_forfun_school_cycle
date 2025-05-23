import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import {AuthPasswordResetData} from '../../../core/models/auth';
import {NgClass, NgIf} from '@angular/common';
import {AuthService} from '../../../core/services/auth.service';

@Component({
  selector: 'app-new-password',
  imports: [ReactiveFormsModule, NgIf, RouterLink, NgClass],
  templateUrl: './new-password.component.html',
  styleUrl: './new-password.component.css'
})
export class NewPasswordComponent implements OnInit{

  token!: string;
  email ! : string;
  resetForm! : FormGroup;
  isSubmited = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private route : ActivatedRoute,
    private fb : FormBuilder,
    private router : Router,
    private authservice : AuthService,
  ) {

  }

  ngOnInit(){
    this.tokenData();
    this.emailData();


    this.resetForm = this.fb.group(
      {
      password : ['', [Validators.required, Validators.minLength(8)]],
      password_confirmation : ['', [Validators.required]]
      },
      {
        validator : this.passwordsMatchValidator
      }
    );

  }

  //function pour verifier que le mot de passe et la confirmation match
  passwordsMatchValidator(form : AbstractControl) : ValidationErrors | null{
    const password = form.get('password')?.value;
    const confirm = form.get('password_confirmation')?.value;
    return password === confirm ? null : {passwordsMatchValidator : true}
  }

  tokenData(){
    this.route.paramMap.subscribe(params => {
      this.token = params.get('token')!;
    });
  }

  emailData(){
    this.route.queryParamMap.subscribe(params => {
      this.email =  params.get('email')!;
    })
  }


  onSubmit(){
    this.isSubmited = true;
    this.successMessage = "";
    this.errorMessage = "";

    if(this.resetForm.invalid) return ;

    const formData = this.resetForm.value;

    this.authservice.resetPassword({
      token : this.token,
      email : this.email,
      password : formData.password,
      password_confirmation : formData.password_confirmation,
    }).subscribe(
      {
        next:()=>{
          this.successMessage = 'Mot de passe restauré avec success';
          setTimeout(()=> {
            this.router.navigate(['login']);
          }, 2000);
          this.resetForm.reset();
          this.isSubmited = false;
        },
        error : (error) =>{
          this.errorMessage = error.error.message || 'une erreur est survenue'
        }
      }
    )
  }

}
