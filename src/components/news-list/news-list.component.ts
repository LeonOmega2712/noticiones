import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Noticia } from '../../model/noticia.model';
import { NewsService } from '../../services/news.service';

@Component({
  selector: 'app-news-list',
  templateUrl: './news-list.component.html',
  styleUrls: ['./news-list.component.css']
})
export class NewsListComponent implements OnInit {
  news: Observable<Noticia[]>;
  constructor(private ns: NewsService) { }

  ngOnInit(): void {
    this.news = this.ns.getNews();
    console.log(this.news);
  }

  borrarNoticia(id:string){
    this.ns.deleteNews(id);
  }

}
