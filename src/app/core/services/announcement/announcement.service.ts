import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { Announcement, AnnouncementData } from '../../models/announcement/announcement';
import { Category } from '../../models/announcement/category';
import { Favorite } from '../../models/announcement/favorite';

@Injectable({
  providedIn: 'root'
})
export class AnnouncementService {

  private url = environment.apiUrl;
  constructor(private http : HttpClient) { }

  //function pour recuperer le token 
  authToken(){
    const token = localStorage.getItem('token'); 
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return headers;
  }

  //methode pour recuperer les annonces
  getAnnouncements(): Observable<{ data: Announcement[] }> {
    const announcements = this.http.get<{ data: Announcement[] }>(this.url + 'announcements');
    return announcements;
  }

  getAnnoucement(id: number) :Observable<{ data: Announcement }> {
    const announcement = this.http.get<{ data: Announcement }>(this.url + 'announcements/' + id);
    return announcement;
  }

  getSimilarAnnouncements(id: number): Observable<{ data: Announcement[] }> {
    return this.http.get<{ data: Announcement[] }>(this.url + 'announcements/' + id + '/similar');
  }
  


  getCategories(): Observable<{ data: Category[] }> {
    const categories = this.http.get<{ data: Category[] }>(this.url + 'categories');
    return categories;
  }

  //methode pour ajouter une annonce
  createAnnouncement(data : FormData){
    const headers = this.authToken();
    return this.http.post(this.url + 'announcements', data, { headers });
  }

  //methode pour rajouter en favorie
  addTofavorite(id : number){
    const headers = this.authToken();
    return this.http.post(this.url + 'favorites' + '/' + id, {}, { headers });
  }

}
