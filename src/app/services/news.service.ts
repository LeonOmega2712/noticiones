import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';
import { Noticia } from '../model/noticia.model';
@Injectable({
  providedIn: 'root'
})
export class NewsService {

  constructor(private firestore: AngularFirestore) { }

  getNews() {
    return this.firestore.collection('news').snapshotChanges();
  }

  addNews(news: Noticia) {
    return this.firestore.collection('news').add(news);
  }

  updateNews(news: Noticia) {
    delete news.id;
    this.firestore.doc(`news/${news.id}`).update(news);
  }

  deleteNews(newsId: string) {
    this.firestore.doc(`news/${newsId}`).delete();
  }
}
