import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import axios from 'axios';
import { ArticleSummary } from 'types';

@Injectable()
export class NewsService {
  private articleIdList = [
    129463574, 300651689, 129461719, 129464037, 129439472, 129459032, 300651607,
    300652639, 300645673, 300643179,
  ];

  private articlePromises = [];

  constructor() {}

  getArticleIdList() {
    return this.articleIdList;
  }

  async getAllArticles() {
    if (this.articlePromises.length === 0) {
      this.articlePromises = this.articleIdList.map((id) =>
        this.getArticleDetailFromStuff(id),
      );
    }
    const result = await Promise.all(this.articlePromises);
    return result.map((resolved) => resolved.data);
  }

  async getArticleSummaries() {
    const allArticles = await this.getAllArticles();
    const articleSummaries: ArticleSummary[] = allArticles.map((articleRaw) => {
      return {
        id: articleRaw.id,
        title: articleRaw.title,
        intro: articleRaw.intro,
        date: articleRaw.datetime_display,
        images: articleRaw.images,
        section: articleRaw.section
      };
    });
    return articleSummaries;
  }

  async getArticleDetailFromStuff(id: number) {
    return axios.get(`https://www.stuff.co.nz/_json/${id}`);
  }

  async getArticleDetail(id: number) {
    const allArticles = await this.getAllArticles();
    return allArticles.find((articleRaw) => articleRaw.id === id);
  }
}
