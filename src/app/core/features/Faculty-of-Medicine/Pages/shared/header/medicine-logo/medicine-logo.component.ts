import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ContactService } from '../../../../Services/contact.service';
import { LogoService } from '../../../../Services/logo.service';
import { Contact } from '../../../../model/contact.model';
import { Logo } from '../../../../model/logo.model';

@Component({
  selector: 'app-medicine-logo',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './medicine-logo.component.html',
  styleUrls: ['./medicine-logo.component.css']
})
export class MedicineLogoComponent implements OnInit {
  contact?: Contact;
  logoUrl?: string;

  constructor(
    private contactService: ContactService,
    private logoService: LogoService
  ) {}

  ngOnInit(): void {
    this.loadContact();
    this.loadLogo();
  }

  private loadContact(): void {
    this.contactService.getAllContacts().subscribe(contacts => {
      if (contacts && contacts.length > 0) {
        this.contact = contacts[0];
      }
    });
  }

  private loadLogo(): void {
    this.logoService.getDefaultLogo().subscribe((logo: Logo | undefined) => {
      if (logo) {
        this.logoUrl = logo.url;
      }
    });
  }

  openLocation(): void {
    if (this.contact?.address) {
      const address = encodeURIComponent(this.contact.address);
      window.open(`https://www.google.com/maps/search/${address}`, '_blank');
    }
  }

  openPhone(phone: string): void {
    window.location.href = `tel:${phone}`;
  }

  openEmail(): void {
    if (this.contact?.email) {
      window.location.href = `mailto:${this.contact.email}`;
    }
  }
}