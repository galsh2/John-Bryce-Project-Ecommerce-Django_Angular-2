
import { Component } from '@angular/core';
import { UserprofileService } from 'src/app/services/userprofile.service';


interface ProfileData {
  [key: string]: string | undefined;
  first_name: string;
  last_name: string;
  phone: string;
  address: string;
  city: string;

}

@Component({
  selector: 'app-postuserprofile',
  templateUrl: './postuserprofile.component.html',
  styleUrls: ['./postuserprofile.component.css']
})
export class PostuserprofileComponent {

  profileData: ProfileData = {
    first_name: '',
    last_name: '',
    phone: '',
    address: '',
    city: ''

  };

  selectedFile?: File;
  constructor(private userProfileService: UserprofileService) { }
  onFileChanged(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
    }
  }

  createProfile() {
    this.userProfileService.createUserProfile(this.profileData, this.selectedFile).subscribe(
      data => {
        console.log('Profile created successfully', data);
      },
      error => {
        console.error('Error creating profile:', error);
      }
    );
  }

  updateProfile() {
    const filledFields: any = {};
    for (const key in this.profileData) {
      if (this.profileData[key]) {  // Check if the field is filled
        filledFields[key] = this.profileData[key];
      }
    }

    this.userProfileService.updateUserProfile(filledFields, this.selectedFile).subscribe(
      data => {
        console.log('Profile updated successfully', data);
      },
      error => {
        console.error('Error updating profile:', error);
      }
    );
  }
}
