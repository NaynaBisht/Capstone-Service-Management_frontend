import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TechnicianService } from '../../../shared/services/technician.service';
import { AuthService } from '../../../shared/services/auth.service';

export interface TechnicianProfile {
  id: string;
  name: string;
  photoUrl: string;
  phone: string;
  city: string;
  primarySkill: string;
  isAvailable: boolean;
  documents: {
    name: string;
    status: 'Verified' | 'Pending' | 'Rejected';
    docId: string;
  }[];
}

@Component({
  selector: 'app-technician-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './technician-profile.html',
  styleUrls: ['./technician-profile.css']
})
export class TechnicianProfileComponent implements OnInit {

  private technicianService = inject(TechnicianService);
  private authService = inject(AuthService);

  profile: TechnicianProfile = {
    id: '',
    name: 'Loading...',
    photoUrl: 'https://ui-avatars.com/api/?name=Loading&background=random',
    phone: '',
    city: '',
    primarySkill: '',
    isAvailable: false,
    documents: []
  };

  ngOnInit() {
    // 1. Get User ID safely from localStorage
    const userJson = localStorage.getItem('user');
    let userId = null;

    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        userId = user.id || user.userId || user.user_id;
      } catch (e) {
        console.error('Error parsing user data', e);
      }
    }

    if (userId) {
      this.loadProfile(userId);
    } else {
      console.error('No User ID found in localStorage');
    }
  }

  loadProfile(userId: string) {
    this.technicianService.getTechnicianByUserId(userId).subscribe({
      next: (data: any) => {
        console.log('Backend Data Fetched:', data); // Check your browser console for this!

        this.profile = {
          // ✅ FIX: Check for 'id' first (Standard Spring Boot response), then 'technicianId'
          id: data.id || data.technicianId, 
          
          name: data.name,
          photoUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=c27843&color=fff&size=128`,
          phone: data.phone || 'N/A',
          city: data.city || 'Unknown',
          primarySkill: (data.skills && data.skills.length > 0) ? data.skills[0] : 'General Technician',
          
          // Map Backend Enum (AVAILABLE/UNAVAILABLE) to Boolean
          isAvailable: data.availability === 'AVAILABLE',

          documents: data.documents ? Object.keys(data.documents).map((key, index) => ({
             name: key,
             status: 'Verified',
             docId: `DOC-${index + 1}`
          })) : []
        };
        
        console.log('Mapped Profile ID:', this.profile.id); // Confirm ID is set
      },
      error: (err) => {
        console.error('Failed to load profile:', err);
      }
    });
  }

  toggleAvailability(): void {
    if (!this.profile.id) {
      console.error('Cannot update status: Technician ID is missing!');
      // Revert the toggle visually since we can't save it
      setTimeout(() => this.profile.isAvailable = !this.profile.isAvailable, 0); 
      return;
    }

    const statusPayload = this.profile.isAvailable ? 'AVAILABLE' : 'UNAVAILABLE';
    console.log(`Sending PATCH request to /api/technicians/${this.profile.id}/availability with:`, statusPayload);

    this.technicianService.updateAvailability(this.profile.id, statusPayload).subscribe({
      next: () => console.log('Status updated successfully in backend'),
      error: (err) => {
        console.error('Update failed:', err);
        // Revert toggle on error
        this.profile.isAvailable = !this.profile.isAvailable;
      }
    });
  }
}