import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentReference,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Noticia } from '../model/noticia.model';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  private news: Observable<Noticia[]>;
  private newsCollection: AngularFirestoreCollection<Noticia>;

  constructor(private firestore: AngularFirestore) {
    this.newsCollection = this.firestore.collection<Noticia>('news');

    this.news = this.newsCollection.snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  getNews(): Observable<Noticia[]> {
    return this.news;
  }

  getNewsById(id: string): Observable<Noticia> {
    return this.newsCollection
      .doc<Noticia>(id)
      .valueChanges()
      .pipe(
        take(1),
        map((n) => {
          n.id = id;
          return n;
        })
      );
  }

  addNews(news: Noticia): Promise<DocumentReference> {
    return this.newsCollection.add(news);
  }

  updateNews(news: Noticia): Promise<void> {
    return this.newsCollection
      .doc(news.id)
      .update({
        title: news.title,
        content: news.content,
        author: news.author,
        date: news.date,
        img: news.img,
      });
  }

  deleteNews(id: string): Promise<void> {
    return this.newsCollection.doc(id).delete();
  }
}
