import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
} from '@nestjs/swagger';

import { NewsService } from './news.service';

@Controller('')
export class NewsController {
  constructor(private newsService: NewsService) {}

  @Get('ids')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Article IDs fetched successfully' })
  getArticleIdList() {
    return this.newsService.getArticleIdList();
  }

  @Get('summaries')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Article summaries fetched successfully' })
  getArticleSummaries() {
    return this.newsService.getArticleSummaries();
  }

  @Get('articles')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Articles fetched successfully' })
  getAllArticles() {
    return this.newsService.getAllArticles();
  }

  @Get('articles/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Articles fetched successfully' })
  getArticleDetail(@Param('id', ParseIntPipe) id: number) {
    return this.newsService.getArticleDetail(id);
  }
}
