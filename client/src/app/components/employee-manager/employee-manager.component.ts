import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms'
import { AuthService } from '../../services/auth.service';
import { dashCaseToCamelCase } from '@angular/compiler/src/util';
import { Router } from '@angular/router';
@Component({
  selector: 'app-employee-manager',
  templateUrl: './employee-manager.component.html',
  styleUrls: ['./employee-manager.component.css']
})
export class EmployeeManagerComponent implements OnInit {

  form: FormGroup;
  message0;
  messageClass0;
  message;
  messageClass;
  emailValid;
  emailMessage;
  usernameValid;
  usernameMessage;
  identity_cardValid;
  identity_cardMessage;
  phoneValid;
  phoneMessage;
  employees1;
  employees2;
  employees3;
  employees4;
  username;
  type_account;
  checkChangeGender = false;
  checkChangeTypeAccount = false;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { 
    this.createForm();
  }

  createForm(){
    this.form=this.formBuilder.group({
      email:['', Validators.compose([
        Validators.required,
        Validators.maxLength(254),
        this.validateEmail
      ])],
      username:['', Validators.compose([
        Validators.required,
        Validators.maxLength(30),
        this.validateUsername
      ])],
      password:['', Validators.required],
      confirm:['', Validators.required],
      fullname:['', Validators.compose([
        Validators.required,
        Validators.maxLength(30)
      ])],
      birthdate:['', Validators.compose([
        Validators.required
      ])],
      address:['', Validators.compose([
        Validators.required,
        Validators.maxLength(100)
      ])],
      gender:['-1', Validators.required],
      identity_card:['', Validators.compose([
        Validators.required,
        Validators.minLength(9),
        Validators.maxLength(9),
        this.validateNumber
      ])],
      phone:['', Validators.compose([
        Validators.required,
        Validators.maxLength(13),
        this.validateNumber
      ])],
      url_profile:'',
      type_account:'-1'
    }, { validator: this.matchingPasswords('password', 'confirm')})
    }

  validateEmail(controls){
    const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    if(regExp.test(controls.value)){
      return null;
    }else{
      return { 'validateEmail': true }
    }
  }

  validateUsername(controls){
    const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
    if(regExp.test(controls.value)){
      return null;
    }else{
      return { 'validateUsername': true }
    }
  }

  validateNumber(controls){
    const regExp = new RegExp(/^[0-9]+$/);
    if(regExp.test(controls.value)){
      return null;
    }else{
      return { 'validateNumber': true }
    }
  }

  matchingPasswords(password, confirm){
    return(group: FormGroup)=>{
      if(group.controls[password].value === group.controls[confirm].value){
        return null;
      }else{
        return { 'matchingPasswords': true }
      }
    }
  }
  changeTypeAccount(){
    this.checkChangeTypeAccount = true;
  }
  changeGender(){
    this.checkChangeGender =true;
  }

 onRegisterSubmit(){
   const user ={
     email: this.form.get('email').value,
     username: this.form.get('username').value,
     password: this.form.get('password').value,
     fullname: this.form.get('fullname').value,
     gender: this.form.get('gender').value,
     identity_card: this.form.get('identity_card').value,
     phone: this.form.get('phone').value,
     address: this.form.get('address').value,
     birthdate: this.form.get('birthdate').value,
     type_account: this.form.get('type_account').value,
     url_profile: 'default.png'
   }
   this.authService.registerUser(user).subscribe(data =>{
    if(!data.success){
      this.messageClass ='alert alert-danger';
      this.message =data.message;
    }else{
      this.messageClass ='alert alert-success';
      this.message =data.message;
      this.checkChangeGender= false;
      this.checkChangeTypeAccount= false;
      this.type_account=this.form.get('type_account').value;
      setTimeout(()=>{
        this.form.reset(); // Reset all form fields
        this.messageClass= false;
        this.message='';
      }, 2000)
    }
   });
 }

 checkEmail(){
   this.authService.checkEmail(this.form.get('email').value).subscribe(data=>{
     if(!data.success){
      this.emailValid = false;
      this.emailMessage = data.message;
     }else{
      this.emailValid = true;
      this.emailMessage = data.message;
     }
   });
 }
 checkUsername(){
  this.authService.checkUsername(this.form.get('username').value).subscribe(data=>{
    if(!data.success){
     this.usernameValid = false;
     this.usernameMessage = data.message;
    }else{
     this.usernameValid = true;
     this.usernameMessage = data.message;
    }
  });
}
checkIdentity_card(){
  this.authService.checkIdentity_card(this.form.get('identity_card').value).subscribe(data=>{
    if(!data.success){
     this.identity_cardValid = false;
     this.identity_cardMessage = data.message;
    }else{
     this.identity_cardValid = true;
     this.identity_cardMessage = data.message;
    }
  });
}
checkPhone(){
  this.authService.checkPhone(this.form.get('phone').value).subscribe(data=>{
    if(!data.success){
     this.phoneValid = false;
     this.phoneMessage = data.message;
    }else{
     this.phoneValid = true;
     this.phoneMessage = data.message;
    }
  });
}
getAllEmployees(type_account) {
  this.authService.getAllEmployees(type_account).subscribe(data => {
   if(type_account==1){
     this.employees1= data.employees;
   }
   if(type_account==2){
    this.employees2= data.employees;
  }
  if(type_account==3){
    this.employees3= data.employees;
  }

  });
}   
getUsername(username, type_account){
  this.username = username;
  this.type_account =type_account;
}
deleteEmployee(){
  this.authService.deleteEmployee(this.username).subscribe(data => {
    // Check if delete request worked
    if (!data.success) {
      this.messageClass = 'alert alert-danger'; // Return error bootstrap class
      this.message = data.message; // Return error message
    } else {
      this.messageClass = 'alert alert-success'; // Return bootstrap success class
      this.message = data.message; // Return success message
      // After two second timeout, route to blog page
    }
    setTimeout(() => {
      this.messageClass = false; // Erase error/success message
      this.message='';
    }, 2000);
  });
}
  ngOnInit() {
  }

}
