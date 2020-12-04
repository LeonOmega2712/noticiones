import { Component, OnInit } from '@angular/core';
import { Noticia } from '../model/noticia.model'
import { NewsService } from '../services/news.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-news-upload',
  templateUrl: './news-upload.component.html',
  styleUrls: ['./news-upload.component.css'],
  exportAs: 'ngForm'
})
export class NewsUploadComponent implements OnInit {

  newsForm: Noticia;
  constructor(private ns: NewsService) { }

  ngOnInit(): void {
  }

  subirNoticia(regForm: NgForm) {
    this.newsForm = regForm.form.value;
    this.ns.addNews(this.newsForm);
  }
}
