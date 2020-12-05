import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentReference,
} from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Noticia } from '../model/noticia.model';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  private news: Observable<Noticia[]>;
  private newsCollection: AngularFirestoreCollection<Noticia>;

  constructor(private firestore: AngularFirestore, private afS: AngularFireStorage) {
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

  async addNews(news: Noticia, img:any): Promise<any> {
    return this.newsCollection.add(news).then(async imgUrlRef => {
      news.id = imgUrlRef.id;
      news.img = await this.uploadImg(imgUrlRef.id, img);
      this.updateNews(news, null);
    });
  }

  async updateNews(news: Noticia, img: any): Promise<void> {
    if (img != null) {
      news.img = await this.uploadImg(news.id, img);
    }
    this.firestore.collection('news').doc(news.id).update(news);
  }

  async deleteNews(id: string): Promise<void> {
    this.newsCollection.doc(id).delete();
    await this.afS.ref(`news/${id}`).delete();
  }

  async uploadImg(id: string, imgData: any): Promise<any> {
    await this.afS.upload(`news/${id}`, imgData);
    return await this.afS.ref(`news/${id}`).getDownloadURL().toPromise();
  }
}
